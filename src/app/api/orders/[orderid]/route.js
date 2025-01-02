import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { hasPermission, verifyToken } from "@/utils/auth";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import Coupon from "@/lib/models/Coupon";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    await connectDb();
    const { id, role } = await verifyToken(request, "view:order-details");
    const { orderid } = params;

    const order = await Order.findById(orderid)
      .populate({
        path: "couponCode",
        select: "code",
      })
      .lean();

    if (!order)
      return NextResponse.json({ msg: "No data found." }, { status: 400 });

    let orderData;

    if (!hasPermission("view:order-details-full", role)) {
      orderData = {
        name: order.name,
        email: order?.email,
        phone: order?.phone,
        address: order?.address,
        location: order?.location,
        total: order?.totalWithDeliveryCharge,
        products: order?.products,
        status: order?.status,
        paymentStatus: order?.paymentStatus,
        paymentMethod: order?.paymentMethod,
        orderDate: order?.orderDate,
      };
    } else {
      orderData = order;
    }

    return NextResponse.json({ msg: "Data Found.", payload: orderData });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Update order status
export async function PUT(request, { params }) {
  const session = await mongoose.startSession();

  try {
    await connectDb();
    session.startTransaction();
    await verifyToken(request, "update:order-details");

    const { id } = params;
    const body = await request.json();

    const existingOrder = await Order.findById(id).session(session);
    if (!existingOrder) {
      throw new Error("Order not found.");
    }

    // Check order status transitions
    const previousStatus = existingOrder.status;
    const newStatus = body.status;

    // Update the order status and other fields
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        paymentStatus: body.paymentStatus,
        address: body.address,
      },
      { new: true, session }
    );

    // Update stock and sold based on order status changes
    for (const product of existingOrder.products) {
      if (
        previousStatus === "pending" &&
        (newStatus === "delivered" || newStatus === "processing")
      ) {
        // Confirm the order - decrease stock and increase sold
        await Product.findByIdAndUpdate(
          product._id,
          {
            $inc: {
              stock: -product.quantity,
              sold: product.quantity,
            },
          },
          { session }
        );
      } else if (previousStatus === "delivered" && newStatus === "cancelled") {
        // Revert sold and increase stock when cancelled
        await Product.findByIdAndUpdate(
          product._id,
          {
            $inc: {
              stock: product.quantity,
              sold: -product.quantity,
            },
          },
          { session }
        );
      } else if (previousStatus === "delivered" && newStatus === "pending") {
        await Product.findByIdAndUpdate(
          product._id,
          {
            $inc: {
              stock: product.quantity,
              sold: -product.quantity,
            },
          },
          { session }
        );
      } else if (previousStatus === "cancelled" && newStatus === "delivered") {
        await Product.findByIdAndUpdate(
          product._id,
          {
            $inc: {
              stock: -product.quantity,
              sold: product.quantity,
            },
          },
          { session }
        );
      }
    }

    // Handle commission changes based on order status transitions
    if (previousStatus === "delivered" && newStatus !== "delivered") {
      await User.findByIdAndUpdate(
        existingOrder.comissionTo,
        {
          $inc: {
            availableComission: -existingOrder.comission,
            pendingComission: existingOrder.comission,
          },
        },
        { session }
      );
    } else if (previousStatus !== "delivered" && newStatus === "delivered") {
      await User.findByIdAndUpdate(
        existingOrder.comissionTo,
        {
          $inc: {
            availableComission: existingOrder.comission,
            pendingComission: -existingOrder.comission,
          },
        },
        { session }
      );
    }

    if (previousStatus === "cancelled" && newStatus !== "cancelled") {
      await User.findByIdAndUpdate(
        existingOrder.comissionTo,
        {
          $inc: {
            pendingComission: existingOrder.comission,
            cancelledComission: -existingOrder.comission,
          },
        },
        { session }
      );
    } else if (previousStatus !== "cancelled" && newStatus === "cancelled") {
      await User.findByIdAndUpdate(
        existingOrder.comissionTo,
        {
          $inc: {
            cancelledComission: existingOrder.comission,
            pendingComission: -existingOrder.comission,
          },
        },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ msg: "Data Updated.", payload: updatedOrder });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
