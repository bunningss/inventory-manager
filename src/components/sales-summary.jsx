"use client";
import { useSales } from "@/hooks/use-sales";
import { SalesSummaryCard } from "./cards/sales-summary-card";
import { Heading } from "./heading";
import { useState } from "react";
import { postData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormModal } from "./form/form-modal";
import { z } from "zod";
import { FormInput } from "./form/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { sendTelegramMessage } from "@/utils/send-telegram-message";

const formSchema = z.object({
  paid: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerNumber: z.string().optional().nullable(),
});

export function SalesSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const { salesItems, total, onClear } = useSales();
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
      const { response, error } = await postData("sales", {
        amount: total,
        products: salesItems,
        paid: data.paid,
        customerName: data.customerName,
        customerNumber: data.customerNumber,
      });

      if (error) {
        return errorNotification(response.msg);
      }

      // Format salesItems into a string
      const productsList = salesItems
        .map(
          (item) =>
            `${item.title} - ৳${item.price / 100} x ${item.quantity} পিস`
        )
        .join("\n");

      await sendTelegramMessage(
        `💵 মোট বিক্রয়: ${total / 100}টাকা.\nবিস্তারিত বিবরণ:\n${productsList}`
      );
      router.push(`/dashboard/sales/sales-reports/${response.payload._id}`);
      onClear();
      successNotification(response.msg);
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
        disabled={isLoading || total <= 0}
      >
        <Heading>Total: ৳ {total / 100}</Heading>

        {salesItems?.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Due / বাকি</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <FormInput
                  form={form}
                  placeholder="Customer Name / গ্রাহকের নাম"
                  label="Customer Name / গ্রাহকের নাম"
                  name="customerName"
                />
                <FormInput
                  form={form}
                  placeholder="Phone Number / গ্রাহকের নাম"
                  label="Phone Number / মোবাইল নম্বর"
                  name="customerNumber"
                />
                <FormInput
                  form={form}
                  placeholder="Paid / প্রদান করা হয়েছে"
                  label="Paid / প্রদান করা হয়েছে"
                  name="paid"
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </FormModal>
    </div>
  );
}
