import Sale from "@/lib/models/Sale";
import Product from "@/lib/models/Product";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

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

    const newSale = new Sale({ ...body, paymentMethod: "cash" });
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

    await connectDb();

    const sales = await Sale.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { msg: "Data found.", payload: sales },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
