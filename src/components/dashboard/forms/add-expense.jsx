"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api-calls";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormInput } from "@/components/form/form-input";
import { FormModal } from "@/components/form/form-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendTelegramMessage } from "@/utils/send-telegram-message";
import { CustomEditor } from "../custom-editor";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.string().min(1, "Date is required"),
  details: z.string().min(10, {
    message: "Details is required.",
  }),
});

export function AddExpense() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      date: "",
      details: "",
    },
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await postData("expenses", data);
      if (res.error) {
        return errorNotification(res.response.msg);
      }

      await sendTelegramMessage(
        `🧾 নতুন খরচ যোগ করা হয়েছে. \nবর্ণনা: ${data.title}\nমোট:৳${data.amount} \nতারিখ: ${data.date}`
      );
      successNotification(res.response.msg);
      router.push("/dashboard/expenses");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background p-2 rounded-md">
      <FormModal
        form={form}
        loading={isLoading}
        disabled={isLoading}
        formLabel="save"
        onSubmit={handleSubmit}
      >
        <FormInput
          form={form}
          label="title"
          placeholder="e.g. sim card"
          required
          name="title"
        />
        <div className="flex gap-2 md:gap-4">
          <FormInput
            form={form}
            label="date"
            placeholder="select date"
            type="date"
            required
            name="date"
          />
          <FormInput
            form={form}
            label="amount"
            placeholder="e.g. 999"
            type="number"
            min={0}
            required
            name="amount"
          />
        </div>
        <CustomEditor name="details" form={form} />
      </FormModal>
    </div>
  );
}
