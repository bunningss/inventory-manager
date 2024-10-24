import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Expense from "@/lib/models/Expense";
import Withdrawal from "@/lib/models/Withdraw";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

const ORDER_STATUSES = {
  DELIVERED: "delivered",
  PENDING: "pending",
  PROCESSING: "processing",
  CANCELLED: "cancelled",
};

export async function GET(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin") {
      return NextResponse.json({ msg: "Unauthorized." }, { status: 403 });
    }

    await connectDb();

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(startOfMonth.getMonth() + 1);

    // const orders = await Order.find().sort({ createdAt: -1 });
    // const products = await Product.find().sort({ sold: -1 }).limit(6);
    // const expenses = await Expense.find();
    // const withdrawals = await Withdrawal.find({ status: "paid" });
    // const cancelledWithdrawals = await Withdrawal.find({ status: "cancelled" });
    // const withdrawalsThisMonth = await Withdrawal.find({
    //   status: "paid",
    //   createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    // });
    // const cancelledWithdrawalsThisMonth = await Withdrawal.find({
    //   status: "cancelled",
    //   createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    // });

    const [
      orders,
      products,
      expenses,
      withdrawals,
      cancelledWithdrawals,
      withdrawalsThisMonth,
      cancelledWithdrawalsThisMonth,
      currentMonthExpenses,
      currentMonthOrders,
    ] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      Product.find().sort({ sold: -1 }).limit(6),
      Expense.find(),
      Withdrawal.find({ status: "paid" }),
      Withdrawal.find({ status: "cancelled" }),
      Withdrawal.find({
        status: "paid",
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }),
      Withdrawal.find({
        status: "cancelled",
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }),
      Expense.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      }),
      Order.find({
        createdAt: {
          $gte: startOfMonth,
          $lt: endOfMonth,
        },
      }),
    ]);

    // Total expenses for the entire collection
    const totalCancelledWithdrawals = cancelledWithdrawals.reduce(
      (a, c) => a + c.amount,
      0
    );
    const totalPaidWithdrawals = withdrawals.reduce((a, c) => a + c.amount, 0);
    const totalCancelledWithdrawalsThisMonth =
      cancelledWithdrawalsThisMonth.reduce((a, c) => a + c.amount, 0);
    const totalPaidWithdrawalsThisMonth = withdrawalsThisMonth.reduce(
      (a, c) => a + c.amount,
      0
    );
    const totalExpenses = expenses.reduce((a, c) => a + c.amount, 0);

    // Current month expenses calculation
    // const currentMonthExpenses = await Expense.find({
    //   createdAt: {
    //     $gte: startOfMonth,
    //     $lt: endOfMonth,
    //   },
    // });

    const currentMonthTotalExpenses = currentMonthExpenses.reduce(
      (a, c) => a + c.amount,
      0
    );

    let totalEarnings = 0;
    let partnerEarnings = 0;
    const orderCounts = {
      totalOrders: orders.length,
      pendingOrders: 0,
      processingOrders: 0,
      cancelledOrders: 0,
      completedOrders: 0,
    };

    const recentOrders = orders.slice(0, 6);

    for (const order of orders) {
      switch (order.status) {
        case ORDER_STATUSES.DELIVERED:
          totalEarnings += order.totalAfterDiscount + order.deliveryCharge;
          partnerEarnings += order.comission;
          orderCounts.completedOrders++;
          break;
        case ORDER_STATUSES.PENDING:
          orderCounts.pendingOrders++;
          break;
        case ORDER_STATUSES.PROCESSING:
          orderCounts.processingOrders++;
          break;
        case ORDER_STATUSES.CANCELLED:
          orderCounts.cancelledOrders++;
          break;
      }
    }

    // Fetch current month order data
    let currentMonthTotalEarnings = 0;
    let currentMonthPartnerEarnings = 0;

    // const currentMonthOrders = await Order.find({
    //   createdAt: {
    //     $gte: startOfMonth,
    //     $lt: endOfMonth,
    //   },
    // });

    const currentMonthOrderCounts = {
      currentMonthTotalOrders: currentMonthOrders.length,
      currentMonthPendingOrders: 0,
      currentMonthProcessingOrders: 0,
      currentMonthCancelledOrders: 0,
      currentMonthCompletedOrders: 0,
    };

    for (const order of currentMonthOrders) {
      switch (order.status) {
        case ORDER_STATUSES.DELIVERED:
          currentMonthTotalEarnings +=
            order.totalAfterDiscount + order.deliveryCharge;
          currentMonthPartnerEarnings += order.comission;
          currentMonthOrderCounts.currentMonthCompletedOrders++;
          break;
        case ORDER_STATUSES.PENDING:
          currentMonthOrderCounts.currentMonthPendingOrders++;
          break;
        case ORDER_STATUSES.PROCESSING:
          currentMonthOrderCounts.currentMonthProcessingOrders++;
          break;
        case ORDER_STATUSES.CANCELLED:
          currentMonthOrderCounts.currentMonthCancelledOrders++;
          break;
      }
    }

    return NextResponse.json(
      {
        msg: "Data Found",
        payload: {
          totalEarnings,
          partnerEarnings,
          ...orderCounts,
          ...currentMonthOrderCounts,
          recentOrders,
          products,
          totalExpenses,
          currentMonthTotalExpenses,
          currentMonthTotalEarnings,
          currentMonthPartnerEarnings,
          totalPaidWithdrawals,
          totalPaidWithdrawalsThisMonth,
          totalCancelledWithdrawals,
          totalCancelledWithdrawalsThisMonth,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json({ msg: "An error occurred." }, { status: 500 });
  }
}
