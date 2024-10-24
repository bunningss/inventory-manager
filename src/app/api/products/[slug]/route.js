import { connectDb } from "@/lib/db/connectDb";
import Product from "@/lib/models/Product";
import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import { verifyToken } from "@/utils/auth";

export async function GET(request, { params }) {
  try {
    await connectDb();
    const product = await Product.findOne({ slug: params.slug }).populate({
      path: "category",
    });

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
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

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
