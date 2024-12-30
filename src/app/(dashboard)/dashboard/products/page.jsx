import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { ProductCard } from "@/components/cards/product-card";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { ProductFilters } from "@/components/filters/product-filters";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Products({ searchParams }) {
  const queryString = new URLSearchParams(searchParams).toString();
  const res = await getData(`products?${queryString ? queryString : ""}`, 0);

  return (
    <>
      {res.response.payload?.length > 0 && (
        <CardView className="md:grid-cols-[repeat(auto-fit,_minmax(400px,_1fr))]">
          {res.response.payload?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </CardView>
      )}
      {res.response.payload?.length <= 0 && (
        <Empty
          message="No products found. / কোন পণ্য পাওয়া যায় নি"
          className="bg-background"
        />
      )}
    </>
  );
}

export default async function Page({ searchParams }) {
  return (
    <Block title="all products" className="space-y-8">
      <ProductFilters />
      <Suspense fallback={<Loading className="py-8" />}>
        <Products searchParams={searchParams} />
      </Suspense>
    </Block>
  );
}
