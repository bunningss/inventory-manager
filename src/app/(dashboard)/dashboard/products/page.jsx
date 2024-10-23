import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { ProductCard } from "@/components/cards/product-card";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Products() {
  const res = await getData("products", 0);

  return (
    <CardView>
      {res.response.payload?.map((product, index) => (
        <ProductCard key={index} product={product} />
      ))}
    </CardView>
  );
}

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Block title="all products">
        <Products />
      </Block>
    </Suspense>
  );
}
