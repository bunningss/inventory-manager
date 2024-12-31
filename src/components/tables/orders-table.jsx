"use client";
import { TableModal } from "./table-modal";

const columns = [
  {
    header: "Serial No.",
    accessorKey: "index",
    cell: (_, index) => index + 1,
  },
  {
    header: "Order ID",
    accessorKey: "_id",
  },
  {
    header: "Customer Name",
    accessorKey: "name",
  },
  {
    header: "Phone Number",
    accessorKey: "phone",
  },
  {
    header: "Order Date",
    cell: (order) => new Date(order.orderDate).toDateString(),
  },
  {
    header: "Order Amount",
    cell: (order) =>
      `৳${(order?.totalAfterDiscount + order?.deliveryCharge) / 100}`,
  },
  {
    header: "Order Status",
    accessorKey: "status",
  },
];

export function OrdersTable({ orders }) {
  return <TableModal columns={columns} data={orders} />;
}
