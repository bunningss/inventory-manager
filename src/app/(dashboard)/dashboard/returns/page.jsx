import { Block } from "@/components/block";
import { ReturnItems } from "@/components/returns/return-items";
import { ReturnsSummary } from "@/components/returns/returns-summary";
import { SalesItems } from "@/components/sales/sales-items";

export default function Page({ searchParams }) {
  return (
    <Block title="returns">
      <div className="grid grid-cols-[2fr,1fr] gap-4 items-start">
        <ReturnItems searchParams={searchParams} />

        <ReturnsSummary />
      </div>
    </Block>
  );
}
