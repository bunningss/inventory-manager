import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";
import { connectDb } from "@/lib/db/connectDb";
import Expense from "@/lib/models/Expense";

// Add new expenses
export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();
    const body = await request.json();

    const formattedDate = new Date(body.date).toDateString();
    const newExpense = new Expense({
      ...body,
      addedBy: user.payload?._id,
      date: formattedDate,
      amount: body.amount * 100,
    });
    await newExpense.save();

    return NextResponse.json(
      { msg: "Data saved successfully." },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Retrieve all expenses
export async function GET(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const expenses = await Expense.find().select("title date amount status");

    return NextResponse.json({ msg: "Data found.", payload: expenses });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}

// Delete expense
export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();

    const existingExpense = await Expense.findOne({ _id: body._id });
    if (!existingExpense)
      return NextResponse.json({ msg: "Expense not found." }, { status: 404 });

    await Expense.findByIdAndDelete(body._id);

    return NextResponse.json({ msg: "Expense deleted." }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: err.message }, { status: 400 });
  }
}
