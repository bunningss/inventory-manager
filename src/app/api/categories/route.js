import Category from "@/lib/models/Category";
import SubCategory from "@/lib/models/Sub-Category";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Add new category
export async function POST(request) {
  try {
    await connectDb();
    await verifyToken(request, "add:category");

    const body = await request.json();
    const slug = body.label.replace(/[\s&]+/g, "-").toLowerCase();

    const newCategory = new Category({
      ...body,
      slug: `/category/${slug}`,
    });

    await newCategory.save();

    return NextResponse.json(
      { msg: "Data saved successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 401 });
  }
}

// Get all categories
export async function GET() {
  try {
    await connectDb();
    const categories = await Category.find()
      .select("label slug icon description")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { msg: "Data found", payload: categories },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 401 });
  }
}

// Delete category
export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();

    const category = await Category.findById(body._id);
    if (!category) {
      return NextResponse.json({ msg: "Category not found." }, { status: 404 });
    }

    await SubCategory.deleteMany({ _id: { $in: category.subCategories } });
    await Category.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "Category deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
