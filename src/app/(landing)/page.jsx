import { Container } from "@/components/container";
import { Product } from "@/components/product-cards/product";
import { ProductView } from "@/components/product-view";
import { PromoSlider } from "@/components/promo-slider";
import { ProductviewSkeleton } from "@/components/skeletons/product-view-skeleton";
import Slider from "@/components/slider";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

// component for product lists
const ProductList = async ({ query }) => {
  const res = await getData(`products?limit=8`);

  return (
    <>
      {res.response?.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </>
  );
};

export default async function Home() {
  return (
    <Container>
      <Slider />

      {/* Popular Products */}
      <ProductView
        title="popular picks"
        href={{
          pathname: "/shop",
          query: { category: "popular" },
        }}
      >
        <Suspense fallback={<ProductviewSkeleton />}>
          <ProductList query="featured=true" />
        </Suspense>
      </ProductView>

      {/* Promo Slider */}
      <PromoSlider />

      <ProductView
        title="best sellers"
        href={{
          pathname: "/shop",
          query: { sortBySold: "true" },
        }}
      >
        <Suspense fallback={<ProductviewSkeleton />}>
          <ProductList query="sortBySold=true" />
        </Suspense>
      </ProductView>

      <ProductView
        title="featured items"
        href={{
          pathname: "/shop",
          query: { featured: "true" },
        }}
      >
        <Suspense fallback={<ProductviewSkeleton />}>
          <ProductList query="featured=true" />
        </Suspense>
      </ProductView>
    </Container>
  );
}
