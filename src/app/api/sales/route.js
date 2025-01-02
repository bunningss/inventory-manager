import Sale from "@/lib/models/Sale";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { generateRandomString } from "@/utils/helpers";

// Create a new sale
export async function POST(request) {
  const session = await mongoose.startSession();
  try {
    await connectDb();
    session.startTransaction();
    await verifyToken(request, "add:sale");

    const body = await request.json();
    const { customerName, customerNumber, products, amount, paid } = body;

    if (isNaN(amount)) {
      throw new Error("Invalid amount.");
    }

    if (paid) {
      if (isNaN(paid)) {
        throw new Error("Invalid paid amount.");
      }
    }

    if (amount <= 0) {
      throw new Error("Amount cannot be less than or equal to zero.");
    }

    if (paid * 100 > amount) {
      throw new Error("Paid amount cannot be greater than total amount.");
    }

    if (!products.length) {
      throw new Error("Please add products to the sale.");
    }

    let due;

    if (paid) {
      if (isNaN(paid)) {
        throw new Error("Invalid paid amount.");
      }

      due = amount - paid * 100;
    }

    const saleId = generateRandomString(13);

    const sale = new Sale({
      saleId,
      customerName,
      customerNumber,
      products,
      amount,
      due: due ? due : 0,
      paid: paid ? paid * 100 : amount,
    });
    // Update product stock
    for (const product of products) {
      const { _id, quantity } = product;
      await Product.findByIdAndUpdate(
        _id,
        {
          $inc: { stock: -quantity, sold: quantity },
        },
        {
          new: true,
          session,
        }
      );
    }

    await sale.save({ session });
    await session.commitTransaction();

    return NextResponse.json(
      { msg: "Sale created.", payload: sale },
      { status: 200 }
    );
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ msg: err.message }, { status: 400 });
  } finally {
    session.endSession();
  }
}

// Get all sales
export async function GET(request) {
  try {
    await verifyToken(request, "view:sales");

    const reqUrl = new URL(request.url);
    let from = reqUrl.searchParams.get("from");
    let to = reqUrl.searchParams.get("to");
    let sortBy = reqUrl.searchParams.get("sortBy") || "createdAt";
    let searchKey = reqUrl.searchParams.get("searchKey");
    const type = reqUrl.searchParams.get("all");

    const filter = {};

    // Get today's date for filtering
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Determine the filter based on the presence of 'type' and dates
    if (type !== "all") {
      if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: fromDate, $lte: toDate };
      } else {
        // If neither from nor to is provided, filter for today's sales
        filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    // Add due filter if sortBy is 'due'
    if (sortBy === "due") {
      filter.due = { $gt: 0 };
    }

    // Add search filter if searchKey is provided
    if (searchKey) {
      filter.$or = [
        { saleId: { $regex: searchKey, $options: "i" } },
        { customerName: { $regex: searchKey, $options: "i" } },
      ];
    }

    await connectDb();

    // Determine sort order
    const sortOrder = sortBy === "amount" || sortBy === "due" ? -1 : -1;

    const sales = await Sale.find(filter)
      .sort({ [sortBy]: sortOrder })
      .lean();

    const dues = sales.reduce((a, c) => a + c.due, 0);
    const total = sales.reduce((a, c) => a + c.amount, 0);

    return NextResponse.json(
      { msg: "Data found.", payload: { sales, total, dues } },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
