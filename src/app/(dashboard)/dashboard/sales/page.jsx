import { Block } from "@/components/block";
import { ProductFilters } from "@/components/filters/product-filters";
import { Loading } from "@/components/loading";
import { SalesProductCard } from "@/components/cards/sales-product-card";
import { SalesSummary } from "@/components/sales-summary";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";
import { Empty } from "@/components/empty";

async function Products({ searchParams }) {
  const queryString = new URLSearchParams(searchParams).toString();
  const { response } = await getData(
    `products?${queryString ? queryString : ""}`,
    0
  );

  return (
    <>
      {response?.payload?.map((product, index) => (
        <SalesProductCard key={index} product={product} />
      ))}
      {response?.payload?.length <= 0 && (
        <Empty message="No products to display." />
      )}
    </>
  );
}

export default async function Page({ searchParams }) {
  return (
    <div className="space-y-4">
      <Block title="sales" />
      <div className="grid grid-cols-[2fr,1fr] gap-4 items-start">
        <div className="space-y-4">
          <ProductFilters />
          <Suspense fallback={<Loading className="py-8" />}>
            <Products searchParams={searchParams} />
          </Suspense>
        </div>

        <SalesSummary />
      </div>
    </div>
  );
}
