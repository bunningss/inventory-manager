"use client";
import { TableModal } from "./table-modal";

const columns = [
  {
    header: "Serial No.",
    accessorKey: "index",
    cell: (_, index) => index + 1,
  },
  {
    header: "Code",
    cell: (item) => `${item.code?.toUpperCase()}`,
  },
  {
    header: "Discount",
    cell: (item) => `${item.discount}%`,
  },
  {
    header: "Code Status",
    cell: (item) => (item.isActive ? "Active" : "Inactive"),
  },
];

export function CouponsTable({ coupons }) {
  return <TableModal columns={columns} data={coupons} />;
}
