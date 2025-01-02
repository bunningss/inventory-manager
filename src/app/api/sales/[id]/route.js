import Sale from "@/lib/models/Sale";
import { connectDb } from "@/lib/db/connectDb";
import { verifyToken } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDb();
    await verifyToken(request, "view:sale-details");

    const sale = await Sale.findById(params.id).lean();

    return NextResponse.json(
      { msg: "Data found.", payload: sale },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse({ msg: err.message }, { status: 500 });
  }
}

// Update sale details
export async function PUT(request, { params }) {
  try {
    await verifyToken(request, "update:sale-details");

    const body = await request.json();
    const existingSale = await Sale.findById(params.id).lean();

    if (body.newAmount) {
      if (isNaN(body.newAmount)) throw new Error("Invalid Amount");

      if (existingSale.paid + body.newAmount * 100 > existingSale.amount) {
        throw new Error("Invalid Amount");
      }
    }

    await connectDb();

    if (body.clear === true) {
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
    return NextResponse.json({ msg: err.message }, { status: 500 });
  }
}
