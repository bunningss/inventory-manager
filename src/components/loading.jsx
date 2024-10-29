import { LoaderIcon } from "lucide-react";

export function Loading() {
  return (
    <div className="h-full w-full bg-background flex items-center justify-center">
      <LoaderIcon className="animate-spin" size={50} />
    </div>
  );
}
