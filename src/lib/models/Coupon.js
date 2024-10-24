import mongoose from "mongoose";

const couponScema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: ["true", "Code is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [4, "Code must be at least 4 characters"],
      maxlength: [50, "Code must not exceed 12 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    comission: {
      type: Number,
      required: false,
      default: 10,
      trim: true,
      min: [1, "Comission must be at least 1 character"],
      max: [99, "Comission must not exceed 2 characters"],
    },
    discount: {
      type: Number,
      required: false,
      default: 10,
      trim: true,
      min: [1, "Discount must be at least 1 character"],
      max: [99, "Discount must not exceed 2 characters"],
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.models.coupon || mongoose.model("coupon", couponScema);

export default Coupon;
