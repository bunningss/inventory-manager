import Category from "@/lib/models/Category";
import mongoose from "mongoose";
import SubCategory from "@/lib/models/Sub-Category";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

// Add new sub-category
export async function POST(request) {
  const session = await mongoose.startSession();
  try {
    await connectDb();
    session.startTransaction();
    await verifyToken(request, "add:category");

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
        session,
      }
    );

    await newSubCategory.save({ session });

    await session.commitTransaction();
    return NextResponse.json(
      { msg: "Data saved successfully." },
      { status: 200 }
    );
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ msg: err.message }, { status: 401 });
  } finally {
    session.endSession();
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
      .sort({ createdAt: -1 })
      .lean();

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
    await verifyToken(request, "delete:category");

    await connectDb();

    const body = await request.json();

    await SubCategory.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "Sub category deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
