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
import { FormEditor } from "@/components/form/form-editor";
import { FormCalendar } from "@/components/form/form-calendar";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.string().min(1, "Amount is required"),
  date: z.date({
    message: "Please select date.",
  }),
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
      date: new Date(),
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
        <div className="grid md:grid-cols-2 gap-2 md:gap-4">
          <FormCalendar
            form={form}
            label="date"
            placeholder="select date"
            required
            name="date"
          />
          <FormInput
            form={form}
            label="amount"
            placeholder="e.g. 999"
            type="number"
            required
            name="amount"
          />
        </div>
        <FormEditor name="details" label="Details" form={form} />
      </FormModal>
    </div>
  );
}
