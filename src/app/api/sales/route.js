import Sale from "@/lib/models/Sale";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { generateRandomString } from "@/utils/helpers";

const BATCH_SIZE = 50;

export async function POST(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 401 });
    }

    await connectDb();

    const body = await request.json();

    if (!Array.isArray(body.products) || body.products.length <= 0) {
      return NextResponse.json({ msg: "Invalid Sales data." }, { status: 400 });
    }

    if (body.amount <= 0 || body.paid * 100 > body.amount) {
      return NextResponse.json({ msg: "Invalid amount." }, { status: 400 });
    }

    const productIds = body.products.map((product) => product._id);

    const dbProducts = await Product.find({ _id: { $in: productIds } })
      .lean()
      .select("_id title stock price")
      .exec();

    const productMap = new Map(
      dbProducts.map((product) => [product._id.toString(), product])
    );

    const bulkOps = [];
    for (const product of body.products) {
      if (isNaN(product.price)) {
        return NextResponse.json(
          {
            msg: `Invalid price. Remove ${product.title} and try again.`,
          },
          { status: 400 }
        );
      }

      const dbProduct = productMap.get(product._id.toString());
      if (!dbProduct) {
        return NextResponse.json(
          { msg: `Invalid product selected. ${product?.title}` },
          { status: 400 }
        );
      }

      if (product.quantity > dbProduct.stock) {
        return NextResponse.json(
          { msg: `${dbProduct.title} out of stock.` },
          { status: 400 }
        );
      }

      bulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: {
            $inc: { stock: -product.quantity, sold: product.quantity },
          },
        },
      });
    }

    // Process updates in batches
    for (let i = 0; i < bulkOps.length; i += BATCH_SIZE) {
      const batch = bulkOps.slice(i, i + BATCH_SIZE);
      await Product.bulkWrite(batch, { session });
    }

    let saleId;
    do {
      saleId = generateRandomString(13);
    } while (await Sale.findOne({ saleId: saleId }).lean());

    const paid = body.paid ? body.paid * 100 : body.amount;
    const due = body.paid ? body.amount - body.paid * 100 : 0;

    const newSale = new Sale({
      ...body,
      paymentMethod: "cash",
      saleId,
      paid,
      due,
    });

    await newSale.save({ session });
    await session.commitTransaction();

    return NextResponse.json(
      { msg: "Data saved successfully.", payload: newSale },
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
