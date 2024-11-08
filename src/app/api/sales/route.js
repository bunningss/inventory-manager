import Sale from "@/lib/models/Sale";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { generateRandomString } from "@/utils/helpers";

// Create a new sale
export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });
    }

    const body = await request.json();
    const { customerName, customerNumber, products, amount, due, paid } = body;

    if (amount <= 0) {
      return NextResponse.json(
        { msg: "Amount must be greater than zero." },
        { status: 400 }
      );
    }

    if (paid * 100 > amount) {
      return NextResponse.json(
        { msg: "Paid amount cannot be greater than total amount." },
        { status: 400 }
      );
    }

    if (due < 0) {
      return NextResponse.json(
        { msg: "Due amount cannot be less than zero." },
        { status: 400 }
      );
    }

    if (!products.length) {
      return NextResponse.json(
        { msg: "Please add products to the sale." },
        { status: 400 }
      );
    }

    await connectDb();

    let remainingDue;

    if (paid) {
      remainingDue = amount - paid * 100;
    }

    const saleId = generateRandomString(13);

    const sale = new Sale({
      saleId,
      customerName,
      customerNumber,
      products,
      amount,
      due: remainingDue ? remainingDue : 0,
      paid: paid ? paid * 100 : amount,
    });
    // Update product stock
    for (const product of products) {
      const { _id, quantity } = product;
      await Product.findByIdAndUpdate(_id, {
        $inc: { stock: -quantity, sold: quantity },
      });
    }

    await sale.save();
    console.log(sale);
    return NextResponse.json(
      { msg: "Sale created.", payload: sale },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Get all sales
export async function GET(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });
    }

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

    const sales = await Sale.find(filter).sort({ [sortBy]: sortOrder });

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
