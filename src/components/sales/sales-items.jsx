import { SalesProductCard } from "@/components/sales/sales-product-card";
import { getData } from "@/utils/api-calls";

export async function SalesItems() {
  const res = await getData("products", 0);

  return (
    <div className="space-y-4">
      {res.response?.payload?.map((product, index) => (
        <SalesProductCard key={index} product={product} />
      ))}
    </div>
  );
}
