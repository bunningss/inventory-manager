import User from "@/lib/models/User";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Coupon from "@/lib/models/Coupon";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { sendWelcomeMail } from "@/utils/send-email";
import { generateRandomString } from "@/utils/helpers";

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

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Save the new user
      await newUser.save({ session });

      let generatedCode;
      // Generate coupon code until a unique one found
      do {
        generatedCode = generateRandomString(11);
      } while (await Coupon.findOne({ code: generatedCode }));

      // Create auto code
      const autoCode = new Coupon({
        code: generatedCode,
        user: newUser._id,
        discount: 5,
        comission: 10,
      });

      await autoCode.save({ session });

      // Update the user with the generated code
      newUser.generatedCode = autoCode._id;
      await newUser.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      // Send welcome mail
      await sendWelcomeMail(newUser.name, "Welcome to Ilham", newUser.email);

      return NextResponse.json(
        { msg: "Account created successfully." },
        { status: 200 }
      );
    } catch (err) {
      // Rollback the transaction in case of an error
      await session.abortTransaction();
      return NextResponse.json({ msg: err.message }, { status: 500 });
    } finally {
      session.endSession();
    }
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
