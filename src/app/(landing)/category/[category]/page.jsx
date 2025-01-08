import { CategoryView } from "@/components/category-view";
import { Container } from "@/components/container";
import { Product } from "@/components/cards/product";
import { ProductView } from "@/components/product-view";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";
import { ProductviewSkeleton } from "@/components/skeletons/product-view-skeleton";
import { CategoryviewSkeleton } from "@/components/skeletons/category-view-skeleton";
import { formatParams } from "@/utils/helpers";
import { Empty } from "@/components/empty";

// generate metadata
export async function generateMetadata({ params }) {
  const { response } = await getData(`categories/${params.category}`);

  return {
    title: formatParams(params.category),
    openGraph: {
      title: `${formatParams(params.category)} | iLHAM`,
    },
    description: response.payload?.description,
  };
}

// Get sub categories based on category
async function Categories({ category }) {
  const { response } = await getData(`categories/${category}`);

  return <CategoryView categories={response.payload?.subCategories} />;
}

// get products based on category
async function Products({ category, subCategory }) {
  const { response, error } = await getData(
    `products?category=/category/${category}${
      subCategory ? `&sub=${subCategory}` : ""
    }`,
    0
  );

  return (
    <>
      {(error || response?.payload?.length <= 0) && (
        <Empty message="No data found." />
      )}
      {response?.payload?.length > 0 &&
        response.payload?.map((product, index) => (
          <Product key={index} product={product} />
        ))}
    </>
  );
}

export default async function Page({ params, searchParams }) {
  return (
    <Container>
      <div className="space-y-8">
        {/* <PromoSlider /> */}
        <Suspense fallback={<CategoryviewSkeleton />}>
          <Categories category={params.category} />
        </Suspense>

        <ProductView title={formatParams(params.category)}>
          <Suspense fallback={<ProductviewSkeleton />}>
            <Products
              category={params.category}
              subCategory={searchParams.sub}
            />
          </Suspense>
        </ProductView>
      </div>
    </Container>
  );
}
