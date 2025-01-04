import { Block } from "@/components/block";
import { AddCategory } from "@/components/forms/add-category";

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="add category" />
      <AddCategory />
    </div>
  );
}
