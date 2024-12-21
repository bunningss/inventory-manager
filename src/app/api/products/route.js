import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { cache } from "react";

// Get all products
const getCachedCategory = cache(async (label) => {
  return await Category.findOne({ label }).lean();
});

export async function GET(request) {
  const reqUrl = new URL(request.url);
  const searchKey = reqUrl.searchParams.get("searchKey");
  const category = reqUrl.searchParams.get("category");
  const subCategory = reqUrl.searchParams.get("sub");
  const featured = reqUrl.searchParams.get("featured");
  const limit = parseInt(reqUrl.searchParams.get("limit") || "10");
  const page = parseInt(reqUrl.searchParams.get("page") || "1");
  const sortBy = reqUrl.searchParams.get("sortBy") || "createdAt";

  try {
    await connectDb();

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
      { $unwind: "$category" },
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

    const productPrice = body.price * 100;
    const productDiscountedPrice = body.discountedPrice * 100;

    const newProduct = new Product({
      ...filteredData,
      price: productPrice,
      discountedPrice: productDiscountedPrice,
      slug:
        body.title.toLowerCase().replace(/ /g, "-") +
        "-" +
        Math.floor(Math.random() + 1000 * 23),
    });
    await newProduct.save();

    return NextResponse.json({ msg: "Product added." }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}

// Delete product
export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();

    const existingProduct = await Product.findOne({ _id: body._id });
    if (!existingProduct)
      return NextResponse.json({ msg: "Product not found." }, { status: 404 });

    await Product.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "Product deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
