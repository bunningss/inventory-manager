"use client";
import { Heading } from "../heading";
import { useState } from "react";
import { postData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormModal } from "../form/form-modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendTelegramMessage } from "@/utils/send-telegram-message";
import { useReturns } from "@/hooks/use-returns";
import { ReturnSummaryCard } from "./return-summary-card";

const formSchema = z.object({
  paid: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerNumber: z.string().optional().nullable(),
});

export function ReturnsSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const { returnItems, total, onClear } = useReturns();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paid: "",
      customerName: "",
      customerNumber: "",
    },
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await postData("returns", {
        amount: total,
        products: returnItems,
      });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      // Format salesItems into a string
      const productsList = salesItems
        .map(
          (item) =>
            `${item.title} - ৳${item.price / 100} x ${item.quantity} পিস`
        )
        .join("\n");

      await sendTelegramMessage(
        `💵 মোট ফেরত: ${total / 100}টাকা.\nবিস্তারিত বিবরণ:\n${productsList}`
      );
      router.push(`/dashboard/return-reports/${res.response.payload._id}`);
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
        {returnItems?.map((product, index) => (
          <ReturnSummaryCard key={index} product={product} />
        ))}
      </div>
      <FormModal
        form={form}
        formLabel="save"
        onSubmit={handleSubmit}
        loading={isLoading}
        disabled={isLoading || total <= 0}
      >
        <Heading>Total: ৳ {total / 100}</Heading>
      </FormModal>
    </div>
  );
}
