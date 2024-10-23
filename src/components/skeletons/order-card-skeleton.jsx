import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DatacellSkeleton } from "./data-cell-skeleton";

export function OrdercardSkeleton() {
  return (
    <Card className="shadow-regular transition-shadow duration-300 hover:shadow-active">
      <CardContent className="grid grid-cols-1 gap-2 items-center md:grid-cols-2">
        <Skeleton className="h-[170px]" />
        <section>
          <Skeleton className="h-4 w-36" />

          <div className="mt-2 grid gap-2 md:gap-4">
            <DatacellSkeleton />
            <DatacellSkeleton />
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
