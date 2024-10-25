"use client";

import { FormInput } from "@/components/form/form-input";
import { FormModal } from "@/components/form/form-modal";
import { postData } from "@/utils/api-calls";
import { errorNotification, successNotification } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  code: z.string().min(3, {
    message: "Code should be at least 5 characters long",
  }),
  discount: z.string(),
});

export function AddCoupon({ users }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await postData("coupons", data);

      if (res.error) {
        return errorNotification(res.response.msg);
      }
      successNotification(res.response.msg);
      router.push("/dashboard/coupons");
      router.refresh();
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <FormModal
        form={form}
        loading={isLoading}
        disabled={isLoading}
        formLabel="add coupon"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            form={form}
            label="enter code"
            placeholder="EXAMPLE24"
            name="code"
            required
          />

          <FormInput
            form={form}
            label="discount"
            placeholder="e.g. 10"
            name="discount"
          />
        </div>
      </FormModal>
    </div>
  );
}
