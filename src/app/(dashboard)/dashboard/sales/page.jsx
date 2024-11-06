import { Block } from "@/components/block";
import { SalesItems } from "@/components/sales/sales-items";
import { SalesSummary } from "@/components/sales/sales-summary";

export default function Page({ searchParams }) {
  return (
    <Block title="sales">
      <div className="grid grid-cols-[2fr,1fr] gap-4 items-start">
        <SalesItems searchParams={searchParams} />

        <SalesSummary />
      </div>
    </Block>
  );
}
