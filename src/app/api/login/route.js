import bcrypt from "bcrypt";
import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { signToken } from "@/utils/auth";

export async function POST(req) {
  try {
    await connectDb();

    let { email, password } = await req.json();

    let userExist = await User.findOne({ email }).collation({
      locale: "en",
      strength: 2,
    });

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

    const token = await signToken(userDetails);

    return NextResponse.json(
      {
        msg: "Login successful.",
        payload: token,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}
