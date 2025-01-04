import { Block } from "@/components/block";
import { AddSubCategory } from "@/components/forms/add-sub-category";
import { getData } from "@/utils/api-calls";

export default async function Page() {
  const res = await getData("categories", 0);

  return (
    <div className="space-y-4">
      <Block title="add sub category"></Block>
      <AddSubCategory categories={res.response.payload} />
    </div>
  );
}
