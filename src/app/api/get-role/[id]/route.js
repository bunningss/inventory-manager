import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDb();

    const user = await User.findById(params.id).select("role").lean();
    if (!user) throw new Error("You are not authorized.");

    return NextResponse.json(
      { msg: "Role Found.", payload: user },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
