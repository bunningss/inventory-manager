import mongoose from "mongoose";
import Coupon from "@/lib/models/Coupon";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import User from "@/lib/models/User";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { generateRandomString } from "@/utils/helpers";
import { NextResponse } from "next/server";

// Create new order
export async function POST(request) {
  const session = await mongoose.startSession();

  try {
    await connectDb();
    session.startTransaction();

    const { id } = await verifyToken(request, "place:order");

    let total = 0;
    let verifiedCoupon;

    const body = await request.json();
    let rawTotal = body.total;

    for (const product of body.products) {
      const dbProduct = await Product.findById(product._id);

      let cartProductPrice =
        product.discountedPrice <= product.price
          ? product.discountedPrice
          : product.price;
      let dbProductPrice =
        dbProduct.discountedPrice <= dbProduct.price
          ? dbProduct.discountedPrice
          : dbProduct.price;

      if (!dbProduct)
        return NextResponse.json(
          {
            msg: `Product ${product.title} not found! Remove the product from cart and try again.`,
          },
          { status: 400 }
        );
      if (cartProductPrice !== dbProductPrice)
        return NextResponse.json(
          {
            msg: `Price does not match for ${product.title}. Remove the product from cart and add again.`,
          },
          { status: 400 }
        );

      total += dbProductPrice * product.quantity;
    }

    if (body.couponCode) {
      verifiedCoupon = await Coupon.findOne({
        code: body.couponCode,
      }).collation({ locale: "en", strength: 2 });

      if (!verifiedCoupon)
        return NextResponse.json(
          { msg: "Invalid coupon code." },
          { status: 400 }
        );

      total -= (total * verifiedCoupon?.discount) / 100;
      rawTotal -= (rawTotal * verifiedCoupon?.discount) / 100;
    }

    if (total !== rawTotal)
      return NextResponse.json(
        {
          msg: "Total price does not match. Please clear your cart and try again.",
        },
        { status: 400 }
      );

    let orderId;
    // Generate order id until a unique one found
    do {
      orderId = generateRandomString(11);
    } while (await Order.findOne({ orderId: orderId }));

    const newOrder = new Order({
      ...body,
      orderId,
      user: id,
      totalAfterDiscount: total,
      totalWithDeliveryCharge: body.total + parseInt(body.deliveryCharge),
      discountPercentage: verifiedCoupon?.discount,
      couponCode: verifiedCoupon?._id,
      totalBeforeDiscount: body.total,
      sellerTotal: total,
    });

    await newOrder.save({ session });

    if (id) {
      await User.findByIdAndUpdate(
        id,
        {
          $push: {
            orders: newOrder._id,
          },
        },
        {
          new: true,
          session,
        }
      );
    }

    await session.commitTransaction();

    return NextResponse.json(
      { msg: "Order placed successfully.", payload: newOrder?.orderId },
      { status: 200 }
    );
  } catch (err) {
    await session.abortTransaction();
    return NextResponse.json({ msg: err.message }, { status: 400 });
  } finally {
    session.endSession();
  }
}

// Get all orders
export async function GET(request) {
  try {
    await connectDb();
    await verifyToken(request, "view:orders");

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .select(
        "orderDate orderId _id name phone totalAfterDiscount deliveryCharge paymentStatus status address"
      )
      .lean();

    return NextResponse.json(
      { msg: "Data found.", payload: orders },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Delete order
// export async function DELETE(request) {
//   try {
//     const user = await verifyToken(request);
//     if (user.payload.role.toLowerCase() !== "admin")
//       return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

//     await connectDb();

//     const body = await request.json();
//     const existingOrder = await Order.findOne({ _id: body._id });
//     if (!existingOrder)
//       return NextResponse.json({ msg: "Order not found." }, { status: 404 });

//     await Order.findByIdAndDelete(body._id);

//     return NextResponse.json({ msg: "Order Deleted." }, { status: 200 });
//   } catch (err) {
//     return NextResponse.json({ msg: err.message }, { status: 400 });
//   }
// }
