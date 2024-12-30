"use client";
import { TableModal } from "./table-modal";

const columns = [
  {
    header: "সি. নং",
    accessorKey: "index",
    cell: (_, index) => index + 1,
  },
  {
    header: "code",
    accessorKey: "code",
  },
  {
    header: "discount",
    cell: (item) => `${item.discount}%`,
  },
  {
    header: "code status",
    cell: (item) => (item.isActive ? "Active" : "Inactive"),
  },
];

export function CouponsTable({ coupons }) {
  return <TableModal columns={columns} data={coupons} />;
}
