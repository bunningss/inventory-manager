import Sale from "@/lib/models/Sale";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    await connectDb();

    const sale = await Sale.findById(params.id);

    return NextResponse.json(
      { msg: "Data found.", payload: sale },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse({ msg: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await verifyToken(request);
    if (user.payload?.role?.toLowerCase() !== "admin")
      return NextResponse.json({ msg: "Unauthorized." }, { status: 400 });

    const body = await request.json();

    const existingSale = await Sale.findById(params.id);

    if (body.newAmount) {
      if (existingSale.paid + body.newAmount * 100 > existingSale.amount) {
        return NextResponse.json({ msg: "Invalid Amount" }, { status: 400 });
      }
    }

    await connectDb();

    if (body.clear) {
      await Sale.findByIdAndUpdate(
        params.id,
        {
          customerName: body.customerName,
          customerNumber: body.customerNumber,
          paid: existingSale.amount,
          due: 0,
        },
        {
          new: true,
        }
      );
    } else {
      await Sale.findByIdAndUpdate(
        params.id,
        {
          customerName: body.customerName,
          customerNumber: body.customerNumber,
          $inc: {
            paid: body.newAmount ? body.newAmount * 100 : 0,
            due: -(body.newAmount ? body.newAmount * 100 : 0),
          },
        },
        {
          new: true,
        }
      );
    }

    return NextResponse.json({ msg: "Data updated." }, { status: 200 });
  } catch (err) {
    return NextResponse({ msg: err.message }, { status: 500 });
  }
}
