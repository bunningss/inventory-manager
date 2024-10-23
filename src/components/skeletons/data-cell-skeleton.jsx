import { Skeleton } from "../ui/skeleton";

export function DatacellSkeleton() {
  return (
    <div className="h-fit flex items-center gap-2 text-base">
      <Skeleton className="h-7 w-7 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  );
}
