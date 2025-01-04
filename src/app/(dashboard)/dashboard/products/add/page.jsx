import { AddProduct } from "@/components/forms/add-product";
import { getData } from "@/utils/api-calls";

export default async function Page() {
  const res = await getData("categories", 0);

  return (
    <div>
      <AddProduct categories={res.response?.payload} />
    </div>
  );
}
