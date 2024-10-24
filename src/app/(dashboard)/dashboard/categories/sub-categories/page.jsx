import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { SubCategoryCard } from "@/components/cards/sub-category-card";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function SubCategories() {
  const res = await getData("categories/sub-categories", 0);

  return (
    <CardView>
      {res.response.payload?.map((subcategory, index) => (
        <SubCategoryCard key={index} subCategory={subcategory} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Block title="sub categories">
        <SubCategories />
      </Block>
    </Suspense>
  );
}
