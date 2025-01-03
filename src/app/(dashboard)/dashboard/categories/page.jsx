import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { CategoryCard } from "@/components/cards/category-card";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Categories() {
  const res = await getData("categories", 0);

  return (
    <CardView>
      {res.response.payload?.map((category, index) => (
        <CategoryCard key={index} category={category} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="categories" />

      <Suspense fallback={<Loading />}>
        <Categories />
      </Suspense>
    </div>
  );
}
