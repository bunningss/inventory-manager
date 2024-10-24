import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDb();

    let userData = await req.json();

    if (userData.password.trim().length < 8)
      return NextResponse.json(
        { msg: "Password must be at least 8 characters long." },
        { status: 400 }
      );

    if (userData.password !== userData.confirmPassword)
      return NextResponse.json(
        { msg: "Passwords do not match." },
        { status: 400 }
      );

    const emailExist = await User.findOne({ email: userData.email });
    if (emailExist) {
      return NextResponse.json(
        {
          msg: "There is an account associated with this email. Try logging in.",
        },
        { status: 400 }
      );
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Creating new user
    const newUser = new User({
      ...userData,
      password: hashedPassword,
      pendingComission: 0,
      availableComission: 0,
      withdrawnComission: 0,
    });

    await newUser.save();

    return NextResponse.json(
      { msg: "Account created successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
