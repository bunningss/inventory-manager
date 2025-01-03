"use client";

import { TableModal } from "./table-modal";

const columns = [
  {
    header: "Serial No.",
    accessorKey: "index",
    cell: (_, index) => index + 1,
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Date",
    accessorKey: "date",
    cell: (expense) => new Date(expense.date).toDateString(),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: (expense) => `৳${expense.amount / 100}`,
  },
];

export function ExpenseTable({ expenses }) {
  return <TableModal data={expenses} columns={columns} />;
}
