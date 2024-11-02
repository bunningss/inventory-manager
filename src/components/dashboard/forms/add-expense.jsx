"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api-calls";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormInput } from "@/components/form/form-input";
import { Editor } from "../editor";
import { FormModal } from "@/components/form/form-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendTelegramMessage } from "@/utils/send-telegram-message";

const formSchema = z.object({
  title: z.string(),
  amount: z.string(),
  date: z.string(),
});

export function AddExpense() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await postData("expenses", {
        ...data,
        details: description,
      });
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
            min={0}
            required
            name="amount"
          />
        </div>
        <Editor
          content={description}
          setContent={setDescription}
          label="details"
          required
          placeholder="details of expenses"
        />
      </FormModal>
    </div>
  );
}
