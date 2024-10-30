"use client";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useSales } from "@/hooks/use-sales";

export function SalesSummaryCard({ product }) {
  const { onRemove } = useSales();

  return (
    <Card title={product?.title}>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <figure className="relative h-[50px] w-[100px]">
          <Image
            src={product?.images[0] ? product.images[0] : ""}
            alt={product?.title}
            fill
            sizes="60px"
            className="object-contain"
          />
        </figure>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <CardTitle className="capitalize font-bold text-base">
            {product?.title}
          </CardTitle>
          <div className="flex gap-2">
            <span>Quantity: {product?.quantity}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total: ৳{(product.price * product.quantity) / 100}</span>
            <Button
              icon="close"
              variant="destructive"
              onClick={() => onRemove(product._id)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
