import Sale from "@/lib/models/Sale";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const sale = await Sale.findById(params.id);

    return NextResponse.json(
      { msg: "Data found.", payload: sale },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse({ msg: err.message }, { status: 500 });
  }
}
