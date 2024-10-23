import { BadgeSkeleton } from "./badge-skeleton";
import { DatacellSkeleton } from "./data-cell-skeleton";
import { OrdercardSkeleton } from "./order-card-skeleton";

export function OrdercontainerSkeleton() {
  return (
    <div className="rounded-md shadow-regular bg-accent dark:bg-background p-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <DatacellSkeleton />
          <DatacellSkeleton />
          <DatacellSkeleton />
        </div>
        <BadgeSkeleton />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        <OrdercardSkeleton />
        <OrdercardSkeleton />
        <OrdercardSkeleton />
      </div>
    </div>
  );
}
