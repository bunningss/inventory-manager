"use client";
import { z } from "zod";
import { FormInput } from "../form/form-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Heading } from "../heading";
import { errorNotification, successNotification } from "@/utils/toast";
import { putData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { FormModal } from "../form/form-modal";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export function ResetPasswordForm({ resetToken }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const res = await putData(`reset-password/${resetToken}`, values);
      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification(res.response.msg);
      router.push("/login");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Heading className="text-center mb-2">create a new password.</Heading>
      <FormModal
        form={form}
        formLabel="update password"
        onSubmit={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
      >
        <FormInput
          form={form}
          type="password"
          placeholder="********"
          label="new password"
          name="password"
        />
        <FormInput
          form={form}
          type="password"
          placeholder="********"
          label="confirm new password"
          name="confirmPassword"
        />
      </FormModal>
    </>
  );
}
