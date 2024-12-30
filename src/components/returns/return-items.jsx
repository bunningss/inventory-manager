import { getData } from "@/utils/api-calls";
import { Suspense } from "react";
import { Loading } from "../loading";
import { ProductFilters } from "../filters/product-filters";
import { ReturnProductCard } from "./return-product-card";

async function Products({ searchParams }) {
  const queryString = new URLSearchParams(searchParams).toString();
  const res = await getData(`products?${queryString ? queryString : ""}`, 0);

  return (
    <>
      {res.response?.payload?.map((product, index) => (
        <ReturnProductCard key={index} product={product} />
      ))}
    </>
  );
}

export async function ReturnItems({ searchParams }) {
  return (
    <div className="space-y-4">
      <ProductFilters />
      <Suspense fallback={<Loading className="py-8" />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
