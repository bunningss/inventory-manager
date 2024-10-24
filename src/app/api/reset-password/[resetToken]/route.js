import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import User from "@/lib/models/User";
import crypto from "crypto";
import bcrypt from "bcrypt";

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const resetToken = crypto
      .createHash("sha256")
      .update(params.resetToken)
      .digest("hex");

    if (body.password.trim().length < 8)
      return NextResponse.json(
        { msg: "Password must be at least 8 characters long." },
        { status: 400 }
      );

    if (body.password !== body.confirmPassword)
      return NextResponse.json(
        { msg: "Passwords do not match." },
        { status: 400 }
      );

    await connectDb();

    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      return NextResponse.json(
        { msg: "Token is invalid or has expired." },
        { status: 400 }
      );

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    return NextResponse.json(
      { msg: "Password updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}
