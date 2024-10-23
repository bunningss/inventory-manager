import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function CategoryboxSkeleton() {
  return (
    <Card className="shadow-transparent hover:shadow-none cursor-pointer min-w-48 h-32">
      <CardContent className="md:p-2">
        <Skeleton className="h-20" />
        <Skeleton className="mt-2 h-5 w-16" />
      </CardContent>
    </Card>
  );
}
