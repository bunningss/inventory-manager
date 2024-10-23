import { DataCell } from "@/components/data-cell";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function OrderCard({ orderItem }) {
  return (
    <Card className="shadow-regular transition-shadow duration-300 hover:shadow-active">
      <CardContent className="grid grid-cols-1 gap-2 items-center md:grid-cols-2">
        <figure className="relative h-[170px]">
          <Image
            src={orderItem.images[0] ? orderItem.images[0] : ""}
            alt={orderItem.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 350px, 250px"
          />
        </figure>
        <section>
          <CardTitle className="text-base line-clamp-2">
            {orderItem.title}
          </CardTitle>

          <div className="mt-2 grid gap-2 md:gap-4">
            <DataCell
              dataName="price"
              dataValue={`৳${orderItem.price / 100}`}
            />
            <DataCell dataName="quantity" dataValue={orderItem.quantity} />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
