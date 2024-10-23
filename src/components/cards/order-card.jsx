import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { UpdateOrder } from "../modals/update-order";
import Link from "next/link";

export function OrderCard({ order }) {
  return (
    <Card
      title={order?._id}
      className={`shadow-md ${
        order?.status === "pending"
          ? "border-yellow-500 shadow-yellow-400"
          : order?.status === "processing"
          ? "border-blue-500 shadow-blue-500"
          : order?.status === "delivered"
          ? "border-green-800 shadow-green-800"
          : order?.status === "courier"
          ? "border-slate-400 shadow-slate-400"
          : order?.status === "cancelled"
          ? "border-destructive shadow-destructive"
          : ""
      }`}
    >
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <div className="bg-slate-100 px-1">
          <Icon icon="order" size={80} />
        </div>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <CardTitle className="capitalize font-bold text-base">
            {order?.name}
          </CardTitle>
          <span>
            {new Date(order?.orderDate).toDateString()}{" "}
            <b>
              <em>{order?.orderId}</em>
            </b>
          </span>
          <div className="flex items-center justify-between">
            <span>
              Amount:{" "}
              <span className="text-primary font-bold">
                ৳{(order?.totalAfterDiscount + order?.deliveryCharge) / 100}
              </span>
            </span>
            <div className="space-x-2">
              <UpdateOrder order={order} />
              <Link href={`/dashboard/orders/${order?.orderId}`}>
                <Button size="icon" className="rounded-full" icon="details" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
