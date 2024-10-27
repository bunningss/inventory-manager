import Sale from "@/lib/models/Sale";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { generateRandomString } from "@/utils/helpers";

export async function POST(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });
    }

    await connectDb();

    const body = await request.json();

    if (body.amount <= 0)
      return NextResponse.json(
        { msg: "Invalid amount. Please select some items." },
        { status: 400 }
      );

    for (const product of body.products) {
      const dbProduct = await Product.findById(product._id);
      if (!dbProduct)
        return NextResponse.json(
          { msg: "Invalid product selected." },
          { status: 400 }
        );

      if (product.quantity > dbProduct.stock)
        return NextResponse.json(
          { msg: `${dbProduct.title} out of stock.` },
          { status: 400 }
        );
    }

    let saleId;
    // Generate order id until a unique one found
    do {
      saleId = generateRandomString(13);
    } while (await Sale.findOne({ saleId: saleId }));

    const newSale = new Sale({ ...body, paymentMethod: "cash", saleId });
    await newSale.save({ session });

    for (const product of body.products) {
      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: {
            stock: -product.quantity,
            sold: product.quantity,
          },
        },
        { session }
      );
    }

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

    const dateFilter = {};

    // Get today's date for filtering
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Determine the filter based on the presence of from and to
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.createdAt = { $gte: fromDate, $lte: toDate };
    } else if (from && !to) {
      const fromDate = new Date(from);
      fromDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(fromDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dateFilter.createdAt = { $gte: fromDate, $lt: nextDay };
    } else if (to && !from) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.createdAt = { $lte: toDate };
    } else {
      // If neither from nor to is provided, filter for today's sales
      dateFilter.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    await connectDb();

    const [allSales, sales] = await Promise.all([
      Sale.find().sort({ createdAt: -1 }),
      Sale.find(dateFilter).sort({ createdAt: -1 }),
    ]);

    const alltimeTotal = allSales.reduce((a, c) => a + c.amount, 0);
    const total = sales.reduce((a, c) => a + c.amount, 0);

    return NextResponse.json(
      { msg: "Data found.", payload: { sales, total, alltimeTotal } },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
