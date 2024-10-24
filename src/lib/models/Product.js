import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title must be at most 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug"],
      trim: true,
    },
    seoTitle: {
      type: String,
      required: [true, "Please provide a seo title"],
      trim: true,
      minlength: [3, "SEO Title must be at least 3 characters"],
      maxlength: [100, "SEO Title must be at most 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description must be at most 1000 characters"],
    },
    seoDescription: {
      type: String,
      required: [true, "Please provide a seo description"],
      trim: true,
      minlength: [10, "SEO Description must be at least 10 characters"],
      maxlength: [1000, "SEO Description must be at most 1000 characters"],
    },
    weight: {
      type: String,
      required: [true, "Please provide a weight"],
      trim: true,
      minlength: [3, "Weight must be at least 3 characters"],
      maxlength: [50, "Weight must be at most 50 characters"],
    },
    tags: [
      {
        type: String,
        required: [true, "Please provide a tag"],
        trim: true,
        minlength: [3, "Tag must be at least 3 characters"],
        maxlength: [50, "Tag must be at most 50 characters"],
      },
    ],
    seoTags: [
      {
        type: String,
        required: [true, "Please provide a seo tag"],
        trim: true,
        minlength: [3, "SEO Tag must be at least 3 characters"],
        maxlength: [50, "SEO Tag must be at most 50 characters"],
      },
    ],
    images: [
      {
        type: String,
        required: [true, "Please provide an image"],
        trim: true,
        minlength: [3, "Image must be at least 3 characters"],
      },
    ],
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [1, "Price must be at least 1"],
    },
    discountedPrice: {
      type: Number,
      required: [true, "Please provide a discounted price"],
      min: [1, "Discounted price must be at least 1"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide a stock"],
    },
    sold: {
      type: Number,
      required: false,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "category",
    },
    brand: {
      type: String,
      required: [true, "Please provide a brand"],
      trim: true,
      minlength: [3, "Brand must be at least 3 characters"],
      maxlength: [50, "Brand must be at most 50 characters"],
    },
    material: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Material must be at least 3 characters"],
      maxlength: [50, "Material must be at most 50 characters"],
    },
    warranty: {
      type: String,
      required: false,
      default: "Unavailable",
      trim: true,
      minlength: [3, "Warranty must be at least 3 characters"],
      maxlength: [50, "Warranty must be at most 50 characters"],
    },
    boxType: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Box type must be at least 3 characters"],
      maxlength: [50, "Box type must be at most 50 characters"],
    },
    color: {
      type: String,
      required: false,
      trim: true,
      minlength: [3, "Color must be at least 3 characters"],
      maxlength: [50, "Color must be at most 50 characters"],
    },
    status: {
      type: String,
      required: [false, "Please provide a status"],
      enum: ["sale", "hot", "new", "popular", "out of stock"],
      default: "",
    },
    featured: {
      type: Boolean,
      required: false,
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Rating must be at least 0"],
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
