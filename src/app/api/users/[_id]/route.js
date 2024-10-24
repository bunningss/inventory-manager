import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import User from "@/lib/models/User";
import Coupon from "@/lib/models/Coupon";
import Address from "@/lib/models/Address";
import Order from "@/lib/models/Order";
import Category from "@/lib/models/Category";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// Get one user
export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.error)
      NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    if (user.payload?._id !== params._id && user.payload?.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });
    }

    await connectDb();

    const userData = await User.findById(user.payload._id)
      .populate({
        path: "code",
        select: "-_id -user -__v",
      })
      .populate({
        path: "addresses",
      })
      .populate({
        path: "orders",
        select:
          "name address phone totalWithDeliveryCharge status paymentMethod paymentStatus orderDate orderId couponCode products",
        populate: [
          {
            path: "couponCode",
            select: "-_id code discount",
          },
        ],
      })
      .select("-password -role -__v");

    return NextResponse.json(
      { msg: "Data found.", payload: userData },
      { status: 200 }
    );
  } catch (err) {
    console.log(err.message);
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Update user
export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.error)
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const userData = await User.findById(user.payload?._id);
    if (!userData)
      return NextResponse.json({ msg: "Invalid request." }, { status: 400 });

    const body = await request.json();

    if (body.phone && body.phone.length < 11)
      return NextResponse.json(
        { msg: "Please enter a valid phone number." },
        { status: 400 }
      );

    if (body.bkash && body.bkash.length < 11)
      return NextResponse.json(
        { msg: "Please enter a valid bKash number." },
        { status: 400 }
      );

    await User.findByIdAndUpdate(
      params._id,
      {
        name: body.name || userData.name,
        gender: body.gender,
        phone: body.phone,
        bkash: body.bkash,
      },
      {
        new: true,
      }
    );

    return NextResponse.json({ msg: "Data updated." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
