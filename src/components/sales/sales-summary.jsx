"use client";

import { useSales } from "@/hooks/use-sales";
import { SalesSummaryCard } from "./sales-summary-card";
import { Heading } from "../heading";
import { Button } from "../ui/button";

export function SalesSummary() {
  const { salesItems, total } = useSales();

  return (
    <div className="space-y-4 bg-background p-2 rounded-md">
      <Heading>Summary</Heading>
      <div className="space-y-2">
        {salesItems?.map((product, index) => (
          <SalesSummaryCard key={index} product={product} />
        ))}
      </div>
      <Heading>Order Total: ৳ {total / 100}</Heading>
      <Button>Save</Button>
    </div>
  );
}
