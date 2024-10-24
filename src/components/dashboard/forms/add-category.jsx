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
  label: z.string().min(1, "Category name is required"),
  slug: z.string().min(1, "category slug is required"),
  icon: z.string().min(1, "icon is required"),
  description: z.string().min(1, "description is required"),
});

export function AddCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const res = await postData("categories", data);

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification(res.response.msg);
      router.push("/dashboard/categories");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      slug: "",
      icon: "",
      description: "",
    },
  });

  return (
    <div className="bg-background p-2 rounded-md">
      <FormModal
        onSubmit={handleSubmit}
        form={form}
        formLabel="save"
        loading={isLoading}
        disabled={isLoading}
      >
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput
            form={form}
            label="category name"
            placeholder="e.g. bags"
            name="label"
            required
          />
          <FormInput
            form={form}
            label="category slug"
            placeholder="e.g. jute-bags"
            name="slug"
            required
          />
          <FormInput
            form={form}
            label="category icon [ choose from lucide.dev/icons ]"
            placeholder="e.g. briefcase"
            name="icon"
            required
          />
        </div>
        <FormInput
          form={form}
          type="textarea"
          label="category short description"
          placeholder="e.g. beautifully designed bags for everyone."
          name="description"
          required
        />
      </FormModal>
    </div>
  );
}
