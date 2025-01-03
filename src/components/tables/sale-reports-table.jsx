"use client";
import Link from "next/link";
import { TableModal } from "./table-modal";
import { UpdateSalesReport } from "../modals/update-sales-report";
import { Button } from "../ui/button";

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
    cell: (report) => `৳${report.amount / 100}`,
  },
  {
    header: "Paid Amount",
    cell: (report) => `৳${report.paid / 100}`,
  },
  {
    header: "Due Amount",
    cell: (report) => `৳${report.due / 100}`,
  },
  {
    header: "Actions",
    accessorKey: "status",
    cell: (report) => (
      <div className="space-x-2">
        <UpdateSalesReport data={report} />
        <Link href={`/dashboard/sales/sales-reports/${report?._id}`}>
          <Button className="rounded-full normal-case h-auto p-1">
            details
          </Button>
        </Link>
      </div>
    ),
  },
];

export function SaleReportsTable({ reports }) {
  return <TableModal data={reports} columns={columns} />;
}
