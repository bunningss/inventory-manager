import Product from "@/lib/models/Product";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();
    if (!params.id)
      return NextResponse.json({ msg: "Invalid product." }, { status: 400 });
    if (!body.quantity || body.quantity <= 0)
      return NextResponse.json(
        { msg: "Please enter a valid quantity." },
        { status: 400 }
      );

    await connectDb();

    const existingProduct = await Product.findById(params.id);
    if (!existingProduct)
      return NextResponse.json({ msg: "Invalid Product" }, { status: 400 });

    await Product.findByIdAndUpdate(
      params.id,
      {
        $inc: {
          stock: body.quantity * 1,
        },
      },
      {
        new: true,
      }
    );

    return NextResponse.json({ msg: "Quantity Updated" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
