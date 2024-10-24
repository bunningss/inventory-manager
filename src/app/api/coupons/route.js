import { connectDb } from "@/lib/db/connectDb";
import Category from "@/lib/models/Category";
import { NextResponse } from "next/server";
import SubCategory from "@/lib/models/Sub-Category";

export async function GET(request, { params }) {
  try {
    await connectDb();
    const category = await Category.findOne({
      label: params.category,
    })
      .populate("subCategories")
      .collation({ locale: "en", strength: 2 });
    return NextResponse.json(
      { msg: "Data found", payload: category },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 401 });
  }
}
