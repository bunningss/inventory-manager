import mongoose from "mongoose";
import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";
import Category from "@/lib/models/Category";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Get one user
export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.error)
      NextResponse.json({ msg: "Unauthorized." }, { status: 401 });

    if (user.payload?._id !== params._id && user.payload?.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 403 });
    }

    await connectDb();

    const userData = await User.findById(user.payload._id)
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

    if (!userData) {
      return NextResponse.json({ msg: "User not found." }, { status: 404 });
    }

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
      return NextResponse.json({ msg: "Unauthorized." }, { status: 401 });

    if (user.payload?._id !== params._id && user.payload?.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 403 });
    }

    await connectDb();

    const userData = await User.findById(params?._id);
    if (!userData)
      return NextResponse.json({ msg: "Invalid request." }, { status: 404 });

    const body = await request.json();

    if (body.phone && body.phone.length < 11)
      return NextResponse.json(
        { msg: "Please enter a valid phone number." },
        { status: 400 }
      );

    if (userData?.role?.toLowerCase() === "admin") {
      if (body.role?.toLowerCase() !== userData.role?.toLowerCase()) {
        await User.findByIdAndUpdate(
          params._id,
          {
            role: body.role,
          },
          {
            new: true,
          }
        );
      }
    }

    await User.findByIdAndUpdate(
      params._id,
      {
        name: body.name || userData.name,
        gender: body.gender,
        phone: body.phone,
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

// Delete user
export async function DELETE(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 403 });
    }

    await User.findByIdAndDelete(params?._id);

    return NextResponse.json({ msg: "User deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
