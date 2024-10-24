import Order from "@/lib/models/Order";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const user = await verifyToken(request);
    if (user.error)
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const orders = await Order.find({ user: user.payload?._id })
      .select(
        "name address phone totalWithDeliveryCharge status paymentMethod paymentStatus orderDate orderId couponCode products"
      )
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(
      { msg: "Data found.", payload: orders },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
