"use client";
import { useSales } from "@/hooks/use-sales";
import { SalesSummaryCard } from "./sales-summary-card";
import { Heading } from "../heading";
import { useState } from "react";
import { postData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormModal } from "../form/form-modal";
import { z } from "zod";
import { FormInput } from "../form/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  paid: z.string().optional().nullable(),
});

export function SalesSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const { salesItems, total, onClear } = useSales();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paid: "",
    },
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await postData("sales", {
        amount: total,
        products: salesItems,
        paid: data.paid,
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
      <FormModal
        form={form}
        formLabel="save"
        onSubmit={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
      >
        <Heading>Total: ৳ {total / 100}</Heading>
        {salesItems?.length > 0 && (
          <FormInput form={form} placeholder="Paid" label="paid" name="paid" />
        )}
      </FormModal>
    </div>
  );
}
