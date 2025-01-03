import Link from "next/link";
import Image from "next/image";
import { DeleteItem } from "../modals/delete";
import { Card, CardContent, CardTitle } from "../ui/card";
import { CalculatePrice } from "../calculate-price";
import { Button } from "../ui/button";
import { AddProductQuantity } from "../modals/add-product-quantity";

export function ProductCard({ product, disabled }) {
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
          <CardTitle className="capitalize text-base">
            {product?.title}
          </CardTitle>
          <div className="flex gap-2">
            <span>
              Stock:{" "}
              <b>
                <em>{product?.stock}</em>
              </b>
            </span>
            <span>
              Sales:{" "}
              <b>
                <em>{product?.sold}</em>
              </b>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <CalculatePrice
              price={product?.price}
              discountedPrice={product?.discountedPrice}
              className="flex-col md:flex-row"
            />
            <div className="space-x-2">
              {!disabled && <AddProductQuantity data={product} />}
              {!disabled && (
                <Link href={`/dashboard/products/${product?.slug}`} passHref>
                  <Button size="icon" className="rounded-full" icon="edit" />
                </Link>
              )}
              {!disabled && (
                <DeleteItem requestUrl="products" _id={product?._id} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
