"use client";
import { TableModal } from "./table-modal";

const columns = [
  {
    header: "Serial No.",
    accessorKey: "index",
    cell: (_, index) => index + 1,
  },
  {
    header: "Customer Name",
    accessorKey: "customerName",
  },
  {
    header: "Receipt No.",
    accessorKey: "saleId",
  },
  {
    header: "Phone Number",
    accessorKey: "customerNumber",
  },
  {
    header: "Total Amount",
    accessorKey: "amount",
  },
  {
    header: "Paid Amount",
    accessorKey: "paid",
  },
  {
    header: "Due Amount",
    accessorKey: "due",
  },
  {
    header: "Actions",
    accessorKey: "status",
  },
];

export function SaleReportsTable({ reports }) {
  return <TableModal data={reports} columns={columns} />;
}
