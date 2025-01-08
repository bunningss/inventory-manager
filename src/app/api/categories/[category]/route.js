import mongoose from "mongoose";
import Category from "@/lib/models/Category";
import SubCategory from "@/lib/models/Sub-Category";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export async function GET(request, { params }) {
  try {
    await connectDb();
    const category = await Category.findOne({
      label: params.category,
    })
      .populate("subCategories")
      .collation({ locale: "en", strength: 2 })
      .lean();

    return NextResponse.json(
      { msg: "Data found", payload: category },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 401 });
  }
}

// Delete category
export async function DELETE(request, { params }) {
  const session = await mongoose.startSession();

  try {
    await connectDb();
    session.startTransaction();
    await verifyToken(request, "delete:category");

    const category = await Category.findById(params.category).session(session);
    if (!category) {
      throw new Error("Category not found.");
    }

    await SubCategory.deleteMany({
      _id: { $in: category.subCategories },
    }).session(session);

    await Product.updateMany(
      { category: params.category },
      { $unset: { category: "" } }
    ).session(session);

    await Category.findByIdAndDelete(params.category).session(session);

    await session.commitTransaction();
    return NextResponse.json({ msg: "Category deleted." }, { status: 200 });
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ msg: err.message }, { status: 400 });
  } finally {
    session.endSession();
  }
}
