import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { BadgeSkeleton } from "./badge-skeleton";
import { ButtonSkeleton } from "./button-skeleton";

export function ProductSkeleton() {
  return (
    <Card className="group border-transparent cursor-pointer">
      <CardContent className="relative pb-2">
        <div className="absolute top-2 left-0 flex items-center justify-between w-full px-2 z-[1]">
          <ButtonSkeleton className="rounded-full w-10" />

          <BadgeSkeleton />
        </div>

        <Skeleton className="relative h-[120px] md:h-[140px] w-full group-hover:scale-105 transition-transform" />
      </CardContent>
      <CardHeader>
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <div className="px-2 py-2 md:px-3 space-y-2">
        <Skeleton className="h-4 w-16" />

        <Skeleton className="h-4 w-16" />
      </div>
      <CardFooter className="flex items-center justify-between md:pt-0">
        <Skeleton className="h-4 w-16" />
        <ButtonSkeleton />
      </CardFooter>
    </Card>
  );
}
