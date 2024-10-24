import { Block } from "@/components/block";
import { AddSubCategory } from "@/components/dashboard/forms/add-sub-category";
import { getData } from "@/utils/api-calls";

export default async function Page() {
  const res = await getData("categories", 0);

  return (
    <>
      <Block title="add sub category"></Block>

      <div className="mt-8">
        <AddSubCategory categories={res.response.payload} />
      </div>
    </>
  );
}
