"use client";

import { useSales } from "@/hooks/use-sales";
import { SalesSummaryCard } from "./sales-summary-card";
import { Heading } from "../heading";
import { Button } from "../ui/button";
import { useState } from "react";
import { postData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { errorNotification, successNotification } from "@/utils/toast";

export function SalesSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const { salesItems, total, onClear } = useSales();
  const router = useRouter();

  const handleSubmit = async (e) => {
    setIsLoading(true);

    try {
      const res = await postData("sales", {
        amount: total,
        products: salesItems,
      });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      router.push(`/dashboard/sales/${res.response.payload._id}`);
      onClear();
      successNotification(res.response.msg);
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 bg-background p-2 rounded-md">
      <Heading>Summary</Heading>
      <div className="space-y-2">
        {salesItems?.map((product, index) => (
          <SalesSummaryCard key={index} product={product} />
        ))}
      </div>
      <Heading>Total: ৳ {total / 100}</Heading>
      <Button loading={isLoading} disabled={isLoading} onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
}
