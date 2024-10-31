import { SalesProductCard } from "@/components/sales/sales-product-card";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";
import { Loading } from "../loading";

async function Products() {
  const res = await getData("products", 0);

  return (
    <>
      {res.response?.payload?.map((product, index) => (
        <SalesProductCard key={index} product={product} />
      ))}
    </>
  );
}

export async function SalesItems() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<Loading className="py-8" />}>
        <Products />
      </Suspense>
    </div>
  );
}
