import { Container } from "@/components/container";
import { Product } from "@/components/cards/product";
import { ProductView } from "@/components/product-view";
import { PromoSlider } from "@/components/promo-slider";
import { ProductviewSkeleton } from "@/components/skeletons/product-view-skeleton";
import { Slider } from "@/components/slider";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

// component for product lists
const ProductList = async ({ query }) => {
  const res = await getData(`products?${query}&limit=10`);

  return (
    <>
      {res.response.payload?.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </>
  );
};

export default async function Home() {
  return (
    <Container>
      <div className="space-y-6">
        <Slider />

        {/* Popular Products */}
        <ProductView
          title="popular picks"
          href={{
            pathname: "/shop",
            query: { sortBy: "sold" },
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
            query: { sortBy: "sold" },
          }}
        >
          <Suspense fallback={<ProductviewSkeleton />}>
            <ProductList query="sortBy=sold" />
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
      </div>
    </Container>
  );
}
