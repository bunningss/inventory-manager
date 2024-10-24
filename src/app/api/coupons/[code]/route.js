import { connectDb } from "@/lib/db/connectDb";
import Coupon from "@/lib/models/Coupon";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDb();

    const couponData = await Coupon.findOne(
      { code: params.code },
      "discount -_id"
    ).collation({ locale: "en", strength: 2 });
    if (!couponData)
      return NextResponse.json(
        { msg: "Invalid coupon code." },
        { status: 404 }
      );

    return NextResponse.json(
      { msg: "Data found.", payload: couponData },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}
