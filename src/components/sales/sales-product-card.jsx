"use client";

import Image from "next/image";
import { CalculatePrice } from "@/components/product-cards/calculate-price";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSales } from "@/hooks/use-sales";
import { factorCartPrice } from "@/utils/helpers";
import { useState } from "react";
import { Input } from "../ui/input";

export function SalesProductCard({ product }) {
  const { onAdd } = useSales();
  const [productPrice, setProductPrice] = useState(null);
  const [productQuantity, setProductQuantity] = useState(null);

  return (
    <Card title={product?.title}>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <figure className="relative h-[100px] w-[120px]">
          <Image
            src={product?.images[0] ? product.images[0] : ""}
            alt={product?.title}
            fill
            sizes="100px"
            className="object-contain"
          />
        </figure>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <div className="flex justify-between">
            <CardTitle className="capitalize font-bold text-base">
              {product?.title}
            </CardTitle>
            <CalculatePrice
              price={product?.price}
              discountedPrice={product?.discountedPrice}
              className="flex-col md:flex-row"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mb-1 mt-2">
            <Input
              placeholder="price"
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <Input
              placeholder="quantity"
              onChange={(e) => setProductQuantity(e.target.value)}
            />
          </div>
          <Button
            className=""
            icon="plus"
            onClick={() =>
              onAdd({
                ...product,
                quantity: productQuantity ? productQuantity * 1 : 1,
                price: productPrice
                  ? productPrice * 100
                  : factorCartPrice(product?.discountedPrice, product?.price),
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
