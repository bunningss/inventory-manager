import { connectDb } from "@/lib/db/connectDb";
import Category from "@/lib/models/Category";
import SubCategory from "@/lib/models/Sub-Category";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Add new sub-category
export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();
    const body = await request.json();

    const category = await Category.findById(body.category);
    if (!category) {
      return NextResponse.json({ msg: "Category not found." }, { status: 404 });
    }

    const newSubCategory = new SubCategory({
      name: body.name,
      category: body.category,
      icon: body.icon,
      color: body.color,
    });

    await Category.findByIdAndUpdate(
      category._id,
      {
        $push: {
          subCategories: newSubCategory._id,
        },
      },
      {
        new: true,
      }
    );

    await newSubCategory.save();

    return NextResponse.json(
      { msg: "Data saved successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 401 });
  }
}

// Get all sub categories
export async function GET() {
  try {
    await connectDb();

    const subCategory = await SubCategory.find()
      .populate({
        path: "category",
        select: "label -_id",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      { msg: "Data found.", payload: subCategory },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Delete sub category
export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const body = await request.json();

    await SubCategory.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "Sub category deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
