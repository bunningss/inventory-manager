import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { ProductCard } from "@/components/cards/product-card";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Products({ searchParams }) {
  const queryString = new URLSearchParams(searchParams).toString();
  const res = await getData(`products?${queryString ? queryString : ""}`, 0);

  return (
    <CardView>
      {res.response.payload?.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </CardView>
  );
}

export default async function Page({ searchParams }) {
  return (
    <Suspense fallback={<Loading />}>
      <Block title="all products">
        <Products searchParams={searchParams} />
      </Block>
    </Suspense>
  );
}
