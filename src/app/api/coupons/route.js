import Coupon from "@/lib/models/Coupon";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Add new code
export async function POST(request) {
  try {
    await connectDb();
    await verifyToken(request, "add:coupon");

    const body = await request.json();

    const existingCode = await Coupon.findOne({ code: body.code })
      .collation({
        locale: "en",
        strength: 2,
      })
      .lean();

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
    await connectDb();
    await verifyToken(request, "view:coupons");

    const codes = await Coupon.find()
      .select("code discount isActive")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ msg: "Data found.", payload: codes });
  } catch (err) {
    return NextResponse.json({ msg: err.message });
  }
}

// Delete code
export async function DELETE(request) {
  try {
    return NextResponse.json({ msg: "Option Disabled." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
