import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { HeadingSkeleton } from "./heading-skeleton";

export function TotalcardSkeleton() {
  return (
    <Card className="bg-accent border-b-4 border-b-primary">
      <CardContent className="flex items-center justify-between gap-4">
        <Skeleton className="h-16 w-16" />
        <div className="flex flex-col justify-between items-end gap-2 capitalize h-full">
          <Skeleton className="text-base w-7 h-4" />
          <HeadingSkeleton />
        </div>
      </CardContent>
    </Card>
  );
}
