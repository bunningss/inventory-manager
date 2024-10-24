import Coupon from "@/lib/models/Coupon";
import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Add new code
export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();
    const body = await request.json();

    const existingCode = await Coupon.findOne({ code: body.code }).collation({
      locale: "en",
      strength: 2,
    });
    if (existingCode)
      return NextResponse.json(
        {
          msg: "Code unavailable. Please choose a different code.",
        },
        { status: 400 }
      );

    const newCoupon = new Coupon({
      code: body.code,
      discount: body.discount,
    });

    await newCoupon.save();

    return NextResponse.json(
      { msg: `Code ${body.code.toUpperCase()} added successfully.` },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Get all codes
export async function GET(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const codes = await Coupon.find()
      .select("code discount isActive")
      .sort({ createdAt: -1 });

    return NextResponse.json({ msg: "Data found.", payload: codes });
  } catch (err) {
    return NextResponse.json({ msg: err.message });
  }
}

// Delete code
export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();

    const existingCode = await Coupon.findOne({ _id: body._id });
    if (!existingCode)
      return NextResponse.json(
        { msg: "Coupon code not found." },
        { status: 404 }
      );

    await Promise.all([
      Coupon.findByIdAndDelete(body._id),
      User.findByIdAndUpdate(
        existingCode.user,
        {
          code: null,
        },
        {
          new: true,
        }
      ),
    ]);

    return NextResponse.json({ msg: "Code deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
