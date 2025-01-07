"use client";
import { useState } from "react";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { postData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/form/form-modal";
import { ImageDropzone } from "../image-dropzone";

const formSchema = z.object({
  category: z.string().min(1, "Category name is required"),
  name: z.string().min(1, "category slug is required"),
  color: z.string().min(1, "icon is required"),
});

export function AddSubCategory({ categories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const { error, response } = await postData("categories/sub-categories", {
        ...data,
        icon: images[0],
      });

      if (error) {
        return errorNotification(response.msg);
      }

      successNotification(response.msg);
      router.push("/dashboard/categories/sub-categories");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      name: "",
      color: "",
    },
  });

  return (
    <div className="bg-background p-2 rounded-md">
      <FormModal
        formLabel="save"
        form={form}
        loading={isLoading}
        disabled={isLoading}
        onSubmit={handleSubmit}
      >
        <ImageDropzone
          uploadedFiles={images}
          setUploadedFiles={setImages}
          disabled={isLoading}
          label="Drag and drop or click to upload image."
        />
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormSelect
            form={form}
            label="select category"
            placeholder="select category"
            required
            name="category"
            options={categories}
            keyName="label"
            keyValue="_id"
          />
          <FormInput
            form={form}
            label="sub-category name"
            placeholder="e.g. - fruit"
            required
            name="name"
          />
          <FormInput
            form={form}
            label="color code"
            placeholder="#000000"
            required
            name="color"
          />
        </div>
      </FormModal>
    </div>
  );
}
