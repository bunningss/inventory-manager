import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: [4, "Name must be at least 4 characters"],
      maxlength: [56, "Name must not exceed 56 characters"],
    },
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Please provide a valid email address."],
      lowercase: true,
      trim: true,
      minlength: [8, "email must be at least 4 characters"],
      maxlength: [56, "Name must not exceed 56 characters"],
    },
    phone: {
      type: String,
      required: [false, "Please enter a phone number"],
      trim: true,
      minlength: [11, "Phone number must be at least 11 characters"],
      maxlength: [14, "Phone number must not exceed 14 characters"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      trim: true,
      minlength: [8, "Name must be at least 8 characters"],
      maxlength: [256, "Name must not exceed 256 characters"],
    },
    passwordResetToken: {
      type: String,
      required: false,
      trim: true,
    },
    passwordResetExpires: Date,
    profileImage: {
      type: String,
      required: false,
    },
    coverImage: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female"],
    },
    birthdate: {
      type: Date,
      required: false,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "moderator"],
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
