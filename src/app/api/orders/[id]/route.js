import { connectDb } from "@/lib/db/connectDb";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import Order from "@/lib/models/Order";
import User from "@/lib/models/User";
import mongoose from "mongoose";
import Coupon from "@/lib/models/Coupon";
import Product from "@/lib/models/Product";

export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request);

    let order;

    const { id } = params;
    await connectDb();

    order = await Order.findOne({ orderId: id })
      .populate({ path: "couponCode", select: "code" })
      .populate({ path: "comissionTo", select: "name" });

    if (!order)
      return NextResponse.json({ msg: "No data found." }, { status: 400 });

    if (user.payload?.role?.toLowerCase() !== "admin") {
      order = {
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
    }
    return NextResponse.json({ msg: "Data Found.", payload: order });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Update order status
export async function PUT(request, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await verifyToken(request);
    if (user.payload?.role.toLowerCase() !== "admin") {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });
    }

    const { id } = params;
    const body = await request.json();

    await connectDb();

    const existingOrder = await Order.findOne({ _id: id }).session(session);
    if (!existingOrder) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ msg: "Order not found." }, { status: 404 });
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

    // Commit the transaction after all operations are successful
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ msg: "Data Updated.", payload: updatedOrder });
  } catch (err) {
    await session.abortTransaction(); // Rollback in case of any error
    session.endSession();
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
