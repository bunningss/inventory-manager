import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [4, "Title must be at least 4 characters"],
      maxlength: [50, "Title must not exceed 50 characters"],
      required: [true, "Please provide a title."],
    },
    details: {
      type: String,
      trim: true,
      minlength: [4, "Details must be at least 4 characters"],
      maxlength: [600, "Details must not exceed 600 characters"],
      required: [true, "Details is required."],
    },
    date: {
      type: Date,
      trim: true,
      required: [true, "Please provide a date."],
    },
    amount: {
      type: Number,
      trim: true,
      min: [1, "Amount must be at least 1 character"],
      required: [true, "Please provide an amount."],
    },
    status: {
      type: String,
      trim: true,
      minlength: [4, "Status must be at least 4 characters"],
      maxlength: [20, "Status must not exceed 20 characters"],
      required: false,
      default: "pending",
      enum: ["pending", "approved"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Expense =
  mongoose.models.expense || mongoose.model("expense", expenseSchema);

export default Expense;
