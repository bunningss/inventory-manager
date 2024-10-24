import Coupon from "@/lib/models/Coupon";
import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Add new code
export async function POST(request) {
  try {
    const isVerified = await verifyToken(request);
    if (isVerified.error)
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

    const userId =
      isVerified.payload?.role?.toLowerCase() === "admin"
        ? body.user
        : isVerified.payload?._id;

    const userWithCode = await User.findById(userId);
    if (userWithCode.code)
      return NextResponse.json(
        {
          msg: "User already have a code. Please contact support.",
        },
        { status: 400 }
      );

    const discount =
      isVerified.payload?.role?.toLowerCase() === "admin"
        ? body.discount
          ? body.discount
          : 10
        : 10;
    const comission =
      isVerified.payload?.role?.toLowerCase() === "admin"
        ? body.comission
          ? body.comission
          : 10
        : 10;

    const newCoupon = new Coupon({
      ...body,
      code: body.code,
      user: userId,
      discount: discount,
      comission: comission,
    });

    await newCoupon.save();
    // Update user code
    await User.findByIdAndUpdate(
      userId,
      {
        code: newCoupon._id,
      },
      {
        new: true,
      }
    );

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
