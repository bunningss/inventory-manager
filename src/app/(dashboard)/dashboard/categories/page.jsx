import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { CategoryCard } from "@/components/cards/category-card";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Categories() {
  const { response } = await getData("categories", 0);

  if (response.payload?.length <= 0)
    return <Empty message="No data to found." />;

  return (
    <CardView>
      {response.payload?.map((category, index) => (
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
