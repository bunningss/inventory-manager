"use client";
import Link from "next/link";
import { UpdateSalesReport } from "../modals/update-sales-report";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export function SalesReportsTable({ data, from, to }) {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <div ref={contentRef} className="print:px-6 print:pt-4 overflow-auto">
      <div className="min-w-[1300px] print:min-w-0">
        <span className="hidden print:block">
          {from} - {to}
        </span>
        <table className="w-full rounded-md mt-8">
          <SalesReportsTableHeader />
          <tbody>
            {data?.sales?.map((item, index) => (
              <SalesReportsTableItem key={index} item={item} />
            ))}
          </tbody>
        </table>
        <div className="mt-4 py-4 flex justify-between border-b border-b-input">
          <span className="text-sm text-muted-foreground">Total / মোট</span>
          <span className="text-sm font-bold">৳{data?.total / 100}</span>
        </div>
        <div className="mt-4 py-4 flex justify-between border-b border-b-input">
          <span className="text-sm text-muted-foreground">Paid / পরিশোধ</span>
          <span className="text-sm font-bold">
            ৳{(data?.total - data?.dues) / 100}
          </span>
        </div>
        <div className="mt-4 py-4 flex justify-between border-b border-b-input">
          <span className="text-sm text-muted-foreground">Dues / বাকি</span>
          <span className="text-sm font-bold">৳{data?.dues / 100}</span>
        </div>
        <Button className="print:hidden mt-4" onClick={reactToPrintFn}>
          Print Report
        </Button>
      </div>
    </div>
  );
}

export function SalesReportsTableHeader() {
  return (
    <thead className="bg-background w-full">
      <tr className="text-center capitalize">
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          date / তারিখ
        </th>
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          customer name / গ্রাহকের নাম
        </th>
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          phone number / মোবাইল নম্বর
        </th>
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          Receipt Number / রসিদ নম্বর
        </th>
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          total / মোট
        </th>
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          paid / পরিশোধ
        </th>
        <th scope="col" className="py-2 px-1 border border-muted-foreground">
          due / বাকি
        </th>
        <th
          scope="col"
          className="py-2 px-1 border border-muted-foreground print:hidden"
        >
          actions
        </th>
      </tr>
    </thead>
  );
}

export function SalesReportsTableItem({ item }) {
  return (
    <tr className="text-center">
      <td className="py-2 border border-muted-foreground">
        {new Date(item?.createdAt).toDateString()}
      </td>
      <td className="py-2 border border-muted-foreground capitalize">
        {item?.customerName}
      </td>
      <td className="py-2 border border-muted-foreground">
        {item?.customerNumber}
      </td>
      <td className="py-2 border border-muted-foreground">{item?.saleId}</td>
      <td className="py-2 border border-muted-foreground">
        ৳{item?.amount / 100}
      </td>
      <td className="py-2 border border-muted-foreground">
        ৳{item?.paid / 100}
      </td>
      <td className="py-2 border border-muted-foreground">
        ৳{item?.due / 100}
      </td>
      <td className="py-2 border border-muted-foreground space-x-4 print:hidden">
        <UpdateSalesReport data={item} />
        <Link href={`/dashboard/sales/${item?._id}`}>
          <Button size="icon" className="rounded-full" icon="details" />
        </Link>
      </td>
    </tr>
  );
}
