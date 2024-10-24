import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      required: [true, "Please provide a category name."],
      minlength: [2, "Category name must be at least 2 characters."],
      maxlength: [20, "Category name must not exceed 20 characters."],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide a category description."],
      minlength: [8, "Category name must be at least 8 characters."],
      maxlength: [100, "Category name must not exceed 100 characters."],
    },
    slug: {
      type: String,
      trim: true,
      required: [true, "Please provide a category slug."],
      minlength: [2, "Category slug must be at least 2 characters."],
      maxlength: [50, "Category slug must not exceed 50 characters."],
    },
    icon: {
      type: String,
      trim: true,
      required: [true, "Please provide a category icon."],
      minlength: [2, "Category icon must be at least 2 characters."],
      maxlength: [15, "Category icon must not exceed 15 characters."],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category =
  mongoose.models.category || mongoose.model("category", categorySchema);

export default Category;
