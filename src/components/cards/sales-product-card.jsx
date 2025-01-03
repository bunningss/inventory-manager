"use client";

import Image from "next/image";
import { CalculatePrice } from "@/components/calculate-price";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSales } from "@/hooks/use-sales";
import { factorCartPrice } from "@/utils/helpers";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormModal } from "../form/form-modal";
import { FormInput } from "../form/form-input";
import { errorNotification } from "@/utils/toast";

const formSchema = z.object({
  price: z.string().optional().nullable(),
  quantity: z.string().optional().nullable(),
});

export function SalesProductCard({ product }) {
  const { onAdd } = useSales();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: "",
      quantity: "",
    },
  });

  const handleSubmit = (data) => {
    if (
      isNaN(data.price) ||
      isNaN(factorCartPrice(product?.discountedPrice, product?.price))
    )
      return errorNotification("Invalid Price.");

    onAdd({
      ...product,
      quantity: data.quantity ? data.quantity * 1 : 1,
      price: data.price
        ? data.price * 100
        : factorCartPrice(product?.discountedPrice, product?.price),
    });
  };

  return (
    <Card
      title={product?.title}
      className={`${product?.stock <= 0 ? "border-2 border-destructive" : ""}`}
    >
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
            <span>
              Stock:{" "}
              <b>
                <em>{product?.stock}</em>
              </b>
            </span>
            <CalculatePrice
              price={product?.price}
              discountedPrice={product?.discountedPrice}
              className="flex-col md:flex-row"
            />
          </div>

          <FormModal
            form={form}
            formLabel="add item"
            onSubmit={handleSubmit}
            disabled={product?.stock <= 0}
          >
            <div className="grid grid-cols-2 gap-4">
              <FormInput form={form} placeholder="Price" name="price" />
              <FormInput form={form} placeholder="Quantity" name="quantity" />
            </div>
          </FormModal>
        </div>
      </CardContent>
    </Card>
  );
}
