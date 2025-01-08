import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import mongoose from "mongoose";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { cache } from "react";

// Get all products
const getCachedCategory = cache(async (slug) => {
  return await Category.findOne({ slug }).lean();
});

export async function GET(request) {
  const reqUrl = new URL(request.url);
  const related = reqUrl.searchParams.get("related");

  try {
    await connectDb();

    if (related) {
      const relatedCategory = await getCachedCategory(related);
      if (relatedCategory) {
        const relatedProducts = await Product.aggregate([
          { $match: { category: relatedCategory._id } },
          { $sample: { size: 4 } },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: {
              path: "$category",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              images: 1,
              "category.label": 1,
              "category.slug": 1,
              slug: 1,
              brand: 1,
              title: 1,
              price: 1,
              discountedPrice: 1,
              stock: 1,
              sold: 1,
              featured: 1,
              tags: 1,
            },
          },
        ]);

        return NextResponse.json(
          {
            msg: "Related products fetched successfully.",
            payload: relatedProducts,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { msg: "Category not found." },
          { status: 404 }
        );
      }
    }

    // If no related param
    const searchKey = reqUrl.searchParams.get("searchKey");
    const category = reqUrl.searchParams.get("category");
    const subCategory = reqUrl.searchParams.get("sub");
    const featured = reqUrl.searchParams.get("featured");
    const limit = parseInt(reqUrl.searchParams.get("limit") || "10");
    const page = parseInt(reqUrl.searchParams.get("page") || "1");
    const sortBy = reqUrl.searchParams.get("sortBy") || "createdAt";

    const query = {};
    let sort = { createdAt: -1 };

    if (searchKey) {
      query.title = { $regex: searchKey, $options: "i" };
    }

    if (category) {
      const categoryData = await getCachedCategory(category);
      if (categoryData) {
        query.category = categoryData._id;
      } else {
        return NextResponse.json(
          { msg: "Category not found." },
          { status: 404 }
        );
      }
    }

    if (subCategory) {
      query.tags = {
        $elemMatch: { $regex: new RegExp(`^${subCategory}$`, "i") },
      };
    }

    if (featured !== null) {
      query.featured = featured === "true";
    }

    if (sortBy === "name") sort = { title: 1 };
    else if (sortBy === "price") sort = { price: -1 };
    else if (sortBy === "discount") sort = { discountedPrice: 1 };
    else if (sortBy === "stock") sort = { stock: 1 };
    else if (sortBy === "sold") sort = { sold: -1 };

    const pipeline = [
      { $match: query },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          images: 1,
          slug: 1,
          brand: 1,
          title: 1,
          price: 1,
          discountedPrice: 1,
          stock: 1,
          sold: 1,
          featured: 1,
          tags: 1,
          "category.label": 1,
          "category.slug": 1,
        },
      },
    ];

    const [products, totalCount] = await Promise.all([
      Product.aggregate(pipeline),
      Product.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        msg: "Products fetched successfully.",
        payload: products,
        total: totalCount,
        page,
        limit,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { msg: "An error occurred while fetching products." },
      { status: 500 }
    );
  }
}

// Add new product
export async function POST(request) {
  const session = await mongoose.startSession();
  try {
    await connectDb();
    await verifyToken(request, "add:product");
    session.startTransaction();

    const body = await request.json();

    if (Number(body.price) <= 0) throw new Error("Invalid price.");
    if (body.discountedPrice) {
      if (Number(body.discountedPrice) < 0)
        throw new Error("Invalid discounted price.");
    }
    if (Number(body.stock) < 0) throw new Error("Invalid stock amount.");

    const productPrice = body.price * 100;
    const productDiscountedPrice = body.discountedPrice * 100;

    const newProduct = new Product({
      ...body,
      price: productPrice,
      discountedPrice: productDiscountedPrice,
      slug:
        body.title.toLowerCase().replace(/ /g, "-") +
        "-" +
        Math.floor(Math.random() + 1000 * 23),
    });

    await newProduct.save({ session });

    await session.commitTransaction();
    return NextResponse.json({ msg: "Product added." }, { status: 200 });
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ msg: err.message }, { status: 500 });
  } finally {
    session.endSession();
  }
}

// Delete product
export async function DELETE(request) {
  try {
    await connectDb();
    await verifyToken(request, "delete:product");

    const body = await request.json();

    await Product.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "Product deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
