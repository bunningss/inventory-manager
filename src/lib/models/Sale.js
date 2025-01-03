import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: false,
    },
    customerNumber: {
      type: String,
      required: false,
    },
    paid: {
      type: Number,
      required: true,
    },
    due: {
      type: Number,
      required: true,
    },
    saleId: {
      type: String,
      unique: true,
      required: true,
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
          required: false,
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
          required: false,
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.models.sale || mongoose.model("sale", saleSchema);

export default Sale;
