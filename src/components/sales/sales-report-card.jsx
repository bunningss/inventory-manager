import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function SalesReportCard({ item }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <div className="px-1">
          <Icon icon="reports" size={80} />
        </div>
        <div className="py-0 px-1 w-full">
          <CardTitle className="capitalize text-base flex justify-between">
            {item?.customerName && <span>{item?.customerName}</span>}
            <span className="font-normal">
              {new Date(item?.createdAt).toDateString()}
            </span>
          </CardTitle>
          <span>
            <b>
              <em>{item?.saleId}</em>
            </b>
          </span>
          <div className="flex items-center justify-between">
            <span>
              Amount:{" "}
              <span className="text-primary font-bold">
                ৳{item?.amount / 100}
              </span>
            </span>
            <div className="space-x-2">
              <Link href={`/dashboard/sales/${item?._id}`}>
                <Button size="icon" className="rounded-full" icon="details" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
