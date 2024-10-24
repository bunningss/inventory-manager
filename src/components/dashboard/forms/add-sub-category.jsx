"use client";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@/components/icon";
import { z } from "zod";
import { postData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { FormModal } from "@/components/form/form-modal";

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
      const res = await postData("categories/sub-categories", {
        ...data,
        icon: images[0],
      });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification(res.response.msg);
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
        <CldUploadWidget
          uploadPreset="ilham-com"
          onSuccess={(result) =>
            setImages((prev) => [...prev, result.info.secure_url])
          }
        >
          {({ open }) => {
            return (
              <div
                className="p-16 rounded-md border border-dashed border-shade text-center"
                onClick={() => open()}
              >
                Click to upload image
              </div>
            );
          }}
        </CldUploadWidget>
        {/* Uploaded images preview */}
        {images.length > 0 && (
          <div className="flex gap-4">
            {images?.map((image, index) => (
              <div key={index} className="relative">
                <figure className="relative h-28 w-28 border border-shade rounded-md mt-4 overflow-hidden">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </figure>
                {/* Delele image button */}
                <div
                  className="absolute top-1 -right-2 p-1 bg-theme_variant rounded-full cursor-pointer"
                  onClick={() => handleImages(image)}
                >
                  <Icon icon="close" size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </FormModal>
    </div>
  );
}
