import User from "@/lib/models/User";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";
import Category from "@/lib/models/Category";
import { connectDb } from "@/lib/db/connectDb";
import { hasPermission, verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";
import { permissions } from "@/lib/static";

// Get one user
export async function GET(request, { params }) {
  try {
    await connectDb();
    const { id, role } = await verifyToken(request, "view:profile");

    if (params._id !== id) {
      const isAllowed = await hasPermission("view:user-details", role);
      if (!isAllowed)
        return NextResponse.json({ msg: "Unauthorized." }, { status: 401 });
    }

    const userData = await User.findById(params._id)
      .populate({
        path: "orders",
        select:
          "name address phone totalWithDeliveryCharge status paymentMethod paymentStatus orderDate orderId products",
      })
      .select("-password -role -__v")
      .lean();

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
    const { id, role } = await verifyToken(request, "update:profile");

    if (params._id !== id) {
      if (!(await hasPermission("update:user-details", role)))
        throw new Error("You are not authorized.");
    }

    const userData = await User.findById(params._id);
    if (!userData) throw new Error("User not found.");

    const body = await request.json();

    if (body.phone && body.phone.length < 11)
      throw new Error("Phone number must be 11 digits.");

    if (body.role) {
      if (await hasPermission("update:user-details", role)) {
        if (Object.keys(permissions).includes(body.role)) {
          userData.role = body.role;
        } else {
          throw new Error("Invalid role.");
        }
      }
    }
    userData.name = body.name ? body.name : userData.name;
    userData.gender = body.gender ? body.gender : userData.gender;
    userData.phone = body.phone ? body.phone : userData.phone;
    userData.birthdate = body.birthdate ? body.birthdate : userData.birthdate;

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
