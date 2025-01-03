"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  return (
    <div className="h-[calc(100vh-120px)] w-full flex flex-col items-center justify-center gap-4">
      <h2>Something went wrong!</h2>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
