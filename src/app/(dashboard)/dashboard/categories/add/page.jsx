import { Block } from "@/components/block";
import { AddCategory } from "@/components/dashboard/forms/add-category";

export default function Page() {
  return (
    <>
      <Block title="add category"></Block>
      <div className="mt-8">
        <AddCategory />
      </div>
    </>
  );
}
