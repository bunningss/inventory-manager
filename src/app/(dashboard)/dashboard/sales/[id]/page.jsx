import SalesReceiptCard from "@/components/sales/sales-receipt-card";
import { Block } from "@/components/block";
import { getData } from "@/utils/api-calls";

export default async function Page({ params }) {
  const res = await getData(`sales/${params.id}`);

  return (
    <div>
      <Block title="Purchase receipt">
        <div className="space-y-1">
          {res.response.payload?.products?.map((item, index) => (
            <SalesReceiptCard key={index} item={item} />
          ))}
          <div className="py-4 flex justify-between border-b border-b-input">
            <span className="text-sm text-muted-foreground">TOTAL</span>
            <span className="text-sm font-bold">
              ৳{(res.response.payload?.amount / 100).toFixed(2)}
            </span>
          </div>
        </div>
      </Block>
    </div>
  );
}
