import { SalesProductCard } from "@/components/sales/sales-product-card";
import { getData } from "@/utils/api-calls";
import { CardView } from "../card-view";

export async function SalesItems() {
  const res = await getData("products", 0);

  return (
    <CardView>
      {res.response?.payload?.map((product, index) => (
        <SalesProductCard key={index} product={product} />
      ))}
    </CardView>
  );
}
