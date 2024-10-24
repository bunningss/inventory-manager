import bcrypt from "bcrypt";
import User from "@/lib/models/User";
import Address from "@/lib/models/Address";
import Coupon from "@/lib/models/Coupon";
import { SignJWT } from "jose";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    let { email, password } = await req.json();

    let userExist = await User.findOne({ email })
      .populate("addresses")
      .populate("generatedCode")
      .collation({ locale: "en", strength: 2 });

    if (!userExist)
      return NextResponse.json(
        { msg: "Invalid email or password." },
        { status: 400 }
      );

    const validPass = await bcrypt.compare(password, userExist.password);
    if (!validPass)
      return NextResponse.json(
        { msg: "Invalid email or password." },
        { status: 400 }
      );

    const { password: _, ...userDetails } = userExist._doc;

    // creating token which is gonna expire in 7days
    const expiry = 60 * 60 * 24;

    // Convert TOKEN_SECRET to Uint8Array
    const secretKey = new TextEncoder().encode(process.env.TOKEN_SECRET);

    const token = await new SignJWT({ ...userDetails })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${expiry}s`)
      .sign(secretKey);

    return NextResponse.json(
      {
        msg: "Login successful.",
        session_token: token,
        expiryTime: expiry,
        partner: userDetails?.code ? true : false,
        payload: userDetails,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}
