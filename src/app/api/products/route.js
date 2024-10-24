import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";

// Get all products
export async function GET(request) {
  const reqUrl = new URL(request.url);
  const searchKey = reqUrl.searchParams.get("searchKey");
  const category = reqUrl.searchParams.get("category");
  const subCategory = reqUrl.searchParams.get("sub");
  const featured = reqUrl.searchParams.get("featured");
  const sortBySold = reqUrl.searchParams.get("sortBySold");
  const limit = parseInt(reqUrl.searchParams.get("limit")) || 10;

  try {
    await connectDb();

    let query = {};
    let sort = {};

    // Search by title
    if (searchKey) {
      query.title = { $regex: searchKey, $options: "i" };
    }

    // Search by category
    if (category) {
      const categoryData = await Category.findOne({ label: category });
      if (categoryData) {
        query.category = categoryData._id;
      } else {
        return NextResponse.json(
          { msg: "Category not found." },
          { status: 404 }
        );
      }
    }

    // Search by subcategory (tags)
    if (subCategory) {
      query.tags = {
        $elemMatch: { $regex: new RegExp(`^${subCategory}$`, "i") },
      };
    }

    // Filter by featured status
    if (featured !== null) {
      query.featured = featured === "true";
    }

    // Sort by most sold items
    if (sortBySold === "true") {
      sort.sold = -1;
    }

    const productsQuery = Product.find(query)
      .populate({
        path: "category",
        select: "label -_id", // Only select the label field from category
      })
      .select({
        seoTags: 0,
        seoTitle: 0,
      })
      .sort(sort)
      .limit(limit);

    const products = await productsQuery;

    return NextResponse.json(
      {
        msg: "Products fetched successfully.",
        payload: products,
        total: await Product.countDocuments(query),
      },
      { status: 200 }
    );
  } catch (err) {
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
