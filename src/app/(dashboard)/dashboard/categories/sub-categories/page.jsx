import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { SubCategoryCard } from "@/components/cards/sub-category-card";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function SubCategories() {
  const { response } = await getData("categories/sub-categories", 0);

  if (response.payload?.length <= 0) return <Empty message="No data found." />;

  return (
    <CardView>
      {response.payload?.map((subcategory, index) => (
        <SubCategoryCard key={index} subCategory={subcategory} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="sub categories" />

      <Suspense fallback={<Loading />}>
        <SubCategories />
      </Suspense>
    </div>
  );
}
