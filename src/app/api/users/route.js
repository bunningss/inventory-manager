import { connectDb } from "@/lib/db/connectDb";
import User from "@/lib/models/User";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Get all users
export async function GET(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const users = await User.find().select("name email role");

    return NextResponse.json(
      { msg: "Data found.", payload: users },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Delete user
export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();

    const existingUser = await User.findOne({ _id: body._id });
    if (!existingUser)
      return NextResponse.json({ msg: "User not found." }, { status: 404 });

    if (existingUser.role.toLowerCase() === "admin")
      return NextResponse.json(
        { msg: "Admin user cannot be deleted." },
        { status: 400 }
      );

    await User.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "User deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
