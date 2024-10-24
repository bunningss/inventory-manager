import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minlength: [4, "Name must be at least 4 characters"],
      maxlength: [32, "Name must not exceed 32 characters"],
    },
    orderId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: [true, "Please provide an address"],
      trim: true,
      minlength: [4, "Address must be at least 4 characters"],
      maxlength: [100, "Address must not exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      trim: true,
      minlength: [4, "Location must be at least 4 characters"],
      maxlength: [32, "Location must not exceed 32 characters"],
    },
    city: {
      type: String,
      required: false,
      trim: true,
      minlength: [4, "City must be at least 4 characters"],
      maxlength: [32, "City must not exceed 32 characters"],
    },
    zipCode: {
      type: String,
      required: false,
      trim: true,
      minlength: [4, "Zip code must be at least 4 characters"],
      maxlength: [12, "Zip code must not exceed 12 characters"],
    },
    country: {
      type: String,
      required: false,
      trim: true,
      minlength: [4, "Country must be at least 4 characters"],
      maxlength: [32, "Country must not exceed 32 characters"],
      default: "bangladesh",
    },
    email: {
      type: String,
      required: false,
      trim: true,
      minlength: [4, "Email must be at least 4 characters"],
      maxlength: [32, "Email must not exceed 32 characters"],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
      minlength: [11, "Phone number must be at least 11 characters"],
      maxlength: [14, "Phone number must not exceed 14 characters"],
    },
    orderDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    totalBeforeDiscount: {
      type: Number,
      required: true,
    },
    totalAfterDiscount: {
      type: Number,
      required: true,
    },
    totalAfterComission: {
      type: Number,
      required: true,
    },
    sellerTotal: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    totalWithDeliveryCharge: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: false,
      default: 0,
    },
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        weight: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        images: [
          {
            type: String,
            required: true,
          },
        ],
        brand: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      required: false,
      default: "pending",
      enum: ["pending", "processing", "delivered", "courier", "cancelled"],
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    couponCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "coupon",
    },
    comission: {
      type: Number,
      required: false,
      defalut: 0,
    },
    comissionTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: false,
      default: "pending",
    },
    deliveryDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.order || mongoose.model("order", orderSchema);

export default Order;
