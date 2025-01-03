import Product from "@/lib/models/Product";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await verifyToken(request, "update:product");

    const body = await request.json();
    if (!params.id) throw new Error("Invalid Product ID");

    const quantity = Number(body.quantity);

    if (!quantity || quantity <= 0) throw new Error("Invalid Quantity");

    await connectDb();

    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) throw new Error("Product not found");

    await Product.findByIdAndUpdate(
      params.id,
      {
        $inc: {
          stock: quantity,
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
