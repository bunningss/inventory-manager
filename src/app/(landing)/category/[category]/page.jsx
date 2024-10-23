import { CategoryView } from "@/components/category-view";
import { Container } from "@/components/container";
import { Product } from "@/components/product-cards/product";
import { ProductView } from "@/components/product-view";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";
import { ProductviewSkeleton } from "@/components/skeletons/product-view-skeleton";
import { CategoryviewSkeleton } from "@/components/skeletons/category-view-skeleton";
import { formatParams } from "@/utils/helpers";

// generate metadata
export async function generateMetadata({ params }) {
  const res = await getData(`categories/${formatParams(params.category)}`);

  return {
    title: formatParams(params.category),
    openGraph: {
      title: `${formatParams(params.category)} | iLHAM`,
    },
    description: res.response.payload?.description,
  };
}

// Get sub categories based on category
async function Categories({ category }) {
  const res = await getData(`categories/${category}`);

  return <CategoryView categories={res.response.payload?.subCategories} />;
}

// get products based on category
async function Products({ category, subCategory }) {
  const res = await getData(
    `products?category=${formatParams(category)}${
      subCategory ? `&sub=${subCategory}` : ""
    }`,
    0
  );

  return (
    <>
      {res.response.payload?.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </>
  );
}

export default async function Page({ params, searchParams }) {
  return (
    <Container>
      {/* <PromoSlider /> */}
      <Suspense fallback={<CategoryviewSkeleton />}>
        <Categories category={params.category} />
      </Suspense>

      <ProductView title={formatParams(params.category)}>
        <Suspense fallback={<ProductviewSkeleton />}>
          <Products category={params.category} subCategory={searchParams.sub} />
        </Suspense>
      </ProductView>
    </Container>
  );
}
