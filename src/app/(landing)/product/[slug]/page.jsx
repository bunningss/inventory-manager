import { Container } from "@/components/container";
import { Empty } from "@/components/empty";
import { Heading } from "@/components/heading";
import { ProductSmall } from "@/components/cards/product-small";
import { ProductActions } from "@/components/product-page/product-actions";
import { ProductDetails } from "@/components/product-page/product-details";
import { ProductImages } from "@/components/product-page/product-images";
import { ProductSpecifications } from "@/components/product-page/product-specifications";
import { ProductView } from "@/components/product-view";
import { Review } from "@/components/review";
import { ProductPageSkeleton } from "@/components/skeletons/product-page-skeleton";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const res = await getData(`products/${params.slug}`);

  return {
    title: res.response.payload?.title,
    description: res.response.payload?.seoDescription,
  };
}

async function ProductData({ slug }) {
  const res = await getData(`products/${slug}`);

  return (
    <>
      <section>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* Product Images */}
          <ProductImages currentProduct={res.response.payload} />
          {/* Product Details */}
          <ProductSpecifications
            currentProduct={res.response.payload}
            actionButtons={
              <ProductActions currentProduct={res.response.payload} />
            }
          />
        </div>
      </section>
      {/* Product description */}
      <ProductDetails currentProduct={res.response.payload} />
      {/* customer reviews */}
      <div className="lg:grid lg:grid-cols-[2fr_1fr] lg:gap-2">
        <section className="space-y-4">
          <Heading className="grid gap-2 text-xl font-bold capitalize after:content-[''] after:h-[1px] after:w-full after:rounded-md after:bg-muted">
            Reviews
          </Heading>
          <Empty message="No data available." />
          <div className="flex flex-col gap-2">
            {/* <Review />
          <Review />
          <Review /> */}
            {/* <Rating /> */}
          </div>
        </section>

        <section className="space-y-1">
          <Heading className="grid gap-2 text-xl font-bold capitalize after:content-[''] after:h-[1px] after:w-full after:rounded-md after:bg-muted">
            Related products
          </Heading>
          <ProductView className="grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1">
            <ProductSmall />
            <ProductSmall />
            <ProductSmall />
          </ProductView>
        </section>
      </div>
    </>
  );
}

export default async function Page({ params }) {
  return (
    <Container>
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductData slug={params.slug} />
      </Suspense>
    </Container>
  );
}
