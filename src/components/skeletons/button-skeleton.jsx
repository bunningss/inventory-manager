import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function ButtonSkeleton({ className }) {
  return (
    <Skeleton
      className={cn(
        "inline-flex items-center gap-2 justify-center rounded-md h-10 px-4 py-2 w-20",
        className
      )}
    />
  );
}
