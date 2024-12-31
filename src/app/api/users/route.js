import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Get all users
export async function GET(request) {
  try {
    await connectDb();
    await verifyToken(request, "view:users");

    const users = await User.find().select("name email role").lean();

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
    await connectDb();
    await verifyToken(request, "delete:user");

    const body = await request.json();

    const existingUser = await User.findById(body._id);
    if (!existingUser)
      return NextResponse.json({ msg: "User not found." }, { status: 404 });

    if (existingUser.role.toLowerCase() === "admin")
      return NextResponse.json(
        { msg: "Cannot delete admin user." },
        { status: 400 }
      );

    await User.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "User deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
