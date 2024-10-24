import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { sendResetPasswordLink } from "@/utils/send-email";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDb();

    const existingUser = await User.findOne({ email: body.email });
    if (!existingUser) {
      return NextResponse.json(
        {
          msg: "You will receive an email with password reset link shortly if you have an account with us.",
        },
        { status: 200 }
      );
    }

    const resetToken = await existingUser.generatePasswordResetToken();
    await existingUser.save();

    const resetUrl = `https://ilham.com.bd/reset-password/${resetToken}`;

    await sendResetPasswordLink(existingUser.name, resetUrl, body.email);

    return NextResponse.json(
      {
        msg: "You will receive an email with password reset link shortly if you have an account with us.",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}
