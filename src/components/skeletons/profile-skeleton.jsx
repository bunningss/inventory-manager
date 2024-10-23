import { Icon } from "../icon";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { DatacellSkeleton } from "./data-cell-skeleton";
import { HeadingSkeleton } from "./heading-skeleton";
import { TotalcardSkeleton } from "./total-card-skeleton";

export function ProfileSkeleton() {
  return (
    <>
      <div className="flex justify-between items-center mb-4 md:mb-1">
        <HeadingSkeleton />
        <Button icon="edit">edit profile</Button>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 md:gap-6">
        <div className="flex items-center gap-2">
          <Icon icon="location" size={20} />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="email" size={20} />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Icon icon="verified" size={20} />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <div className="flex flex-col-reverse mt-4 mb-4 md:grid md:grid-cols-2">
        <div className="pt-2 pb-2 pl-0 pr-0 flex flex-col gap-x-0 gap-y-4 md:gap-y-8">
          <DatacellSkeleton />
          <DatacellSkeleton />
          <DatacellSkeleton />
          <DatacellSkeleton />
        </div>
        <div className="pt-2 pb-2 pl-0 pr-0 flex flex-col gap-x-0 gap-y-4 md:gap-y-8">
          <DatacellSkeleton />
          <DatacellSkeleton />
        </div>
      </div>
    </>
  );
}
