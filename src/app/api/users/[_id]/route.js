import User from "@/lib/models/User";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";
import Category from "@/lib/models/Category";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { permissions } from "@/lib/static";

// Get one user
export async function GET(request, { params }) {
  try {
    await connectDb();
    const { id } = await verifyToken(request, "view:self");

    if (params._id !== id) {
      await verifyToken(request, "view:others");
    }

    const userData = await User.findById(params._id)
      .populate({
        path: "orders",
        select:
          "name address phone totalWithDeliveryCharge status paymentMethod paymentStatus orderDate orderId products",
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
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Update user
export async function PUT(request, { params }) {
  try {
    await connectDb();
    const { id } = await verifyToken(request, "update:self");

    const userData = await User.findById(params._id);
    if (!userData)
      return NextResponse.json({ msg: "Invalid request." }, { status: 404 });

    const body = await request.json();

    if (body.phone && body.phone.length < 11)
      return NextResponse.json(
        { msg: "Please enter a valid phone number." },
        { status: 400 }
      );

    if (body.role) {
      await verifyToken(request, "update:roles");
      if (Object.keys(permissions).includes(body.role)) {
        userData.role = body.role;
      }
    }

    if (id === params._id || (await verifyToken(request, "update:roles"))) {
      userData.name = body.name ? body.name : userData.name;
      userData.gender = body.gender ? body.gender : userData.gender;
      userData.phone = body.phone ? body.phone : userData.phone;
      userData.birthdate = body.birthdate ? body.birthdate : userData.birthdate;
    }

    await userData.save();

    return NextResponse.json({ msg: "Data updated." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    await verifyToken(request, "delete:users");

    await User.findByIdAndDelete(params?._id);

    return NextResponse.json({ msg: "User deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
