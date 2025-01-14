import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request, { params }) {
  try {
    await connectDb();
    const product = await Product.findOne({ slug: params.slug })
      .populate({
        path: "category",
      })
      .lean();

    if (!product) {
      return NextResponse.json(
        { msg: "Could not find product." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { msg: "Data found.", payload: product },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Update product
export async function PUT(request, { params }) {
  try {
    await connectDb();
    await verifyToken(request, "edit:product");

    const body = await request.json();

    const filteredData = {};

    for (const [key, val] of Object.entries(body)) {
      if (val) {
        filteredData[key] = val;
      }
    }

    await Product.findOneAndUpdate(
      {
        slug: params.slug,
      },
      {
        ...filteredData,
        price: filteredData.price * 100,
        discountedPrice: filteredData.discountedPrice * 100,
      },
      {
        new: true,
      }
    );

    return NextResponse.json({ msg: "Product updated successfully." });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Delete product
export async function DELETE(request, { params }) {
  try {
    await connectDb();
    await verifyToken(request, "delete:product");

    await Product.findByIdAndDelete(params.slug);

    return NextResponse.json({ msg: "Product deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
