import { Suspense } from "react";
import { Product } from "@/components/product-cards/product";
import { ProductView } from "@/components/product-view";
import { getData } from "@/utils/api-calls";
import { Container } from "@/components/container";
import { ProductviewSkeleton } from "@/components/skeletons/product-view-skeleton";

export function metadata() {
  return {
    title: "Shop",
  };
}

async function Products({ searchParams }) {
  const queryString = new URLSearchParams(searchParams).toString();
  const res = await getData(`products${queryString ? `?${queryString}` : ""}`);

  return (
    <>
      {res.response.payload?.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </>
  );
}

export default async function Page({ searchParams }) {
  return (
    <Container>
      <ProductView title="all products">
        <Suspense fallback={<ProductviewSkeleton />}>
          <Products searchParams={searchParams} />
        </Suspense>
      </ProductView>
    </Container>
  );
}
