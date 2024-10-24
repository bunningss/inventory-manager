import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a sub-category name."],
      trim: true,
      minlength: [2, "Sub-category name must be at least 2 characters."],
      maxlength: [50, "Sub-category name must be at most 50 characters."],
    },
    icon: {
      type: String,
      required: [true, "Please upload an image."],
      trim: true,
      minlength: [3, "Icon must be at least 3 characters."],
      maxlength: [300, "Icon must be at most 300 characters."],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Please select a category."],
    },
    color: {
      type: String,
      required: [true, "Please provide a color."],
      trim: true,
      minlength: [3, "Color must be at least 3 characters."],
      maxlength: [7, "Color must be at most 6 characters."],
    },
  },
  {
    timestamps: true,
  }
);

const SubCategory =
  mongoose.models.subCategory ||
  mongoose.model("subCategory", subCategorySchema);

export default SubCategory;
