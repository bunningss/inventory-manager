"use client";
import Image from "next/image";
import Link from "next/link";
import { RatingStars } from "../rating-stars";
import { CalculatePrice } from "../calculate-price";
import { CalculateDiscount } from "../calculate-discount";
import { Card, CardContent, CardTitle } from "../ui/card";

export function ProductSmall({ product }) {
  return (
    <Link
      href={`/product/${product?.slug}?cat=${product?.category?.label}`}
      passHref
    >
      <Card title={product?.title}>
        <CardContent className="flex items-center p-1 md:p-1">
          <figure className="relative h-[100px] w-[120px] rounded-tl-md rounded-bl-md overflow-hidden">
            <Image
              src={product?.images[0] ? product.images[0] : ""}
              alt={product?.title}
              fill
              sizes="100px"
              className="object-contain"
            />
          </figure>
          <div className="py-0 px-1 w-full flex flex-col gap-1">
            <CardTitle className="capitalize font-bold text-base cursor-pointer transition-colors duration-300 hover:text-primary dark:hover:text-muted">
              {product?.title}
            </CardTitle>
            <RatingStars />
            <div className="flex items-center justify-between">
              <CalculatePrice
                price={product?.price}
                discountedPrice={product?.discountedPrice}
                className="flex-col md:flex-row"
              />
              <CalculateDiscount
                price={product?.price}
                discountedPrice={product?.discountedPrice}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
