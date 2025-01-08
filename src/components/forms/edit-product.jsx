"use client";
import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { putData } from "@/utils/api-calls";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormModal } from "@/components/form/form-modal";
import { FormEditor } from "../form/form-editor";
import { FormTextarea } from "../form/form-textarea";
import { ImageDropzone } from "../image-dropzone";

const formSchema = z.object({
  title: z.string().optional(),
  seoTitle: z.string().optional(),
  price: z.union([z.string(), z.number()]).optional(),
  discountedPrice: z.union([z.string(), z.number()]).optional(),
  weight: z.string().optional(),
  stock: z.union([z.string(), z.number()]).optional(),
  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId")
    .optional(),
  status: z.enum(["popular", "sale", "hot", "new", "out of stock"]).optional(),
  warranty: z.string().optional(),
  boxType: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  featured: z.boolean().optional(),
  brand: z.string().optional(),
  tags: z.string().optional(),
  seoTags: z.string().optional(),
  seoDescription: z.string().optional(),
});

export function EditProduct({ categories, currentProduct }) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState(currentProduct?.images);
  const router = useRouter();

  // Make api call to update information
  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      const tags_trimmed = data.tags.split(",").map((tag) => tag.trim());
      const seo_tags_trimmed = data.seoTags.split(",").map((tag) => tag.trim());

      // make api call / perform database operation
      const res = await putData(`products/${currentProduct?.slug}`, {
        ...data,
        price: parseInt(data.price),
        discountedPrice: parseInt(data.discountedPrice),
        stock: parseInt(data.stock),
        tags: tags_trimmed,
        seoTags: seo_tags_trimmed,
        images,
      });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification(res.response.msg);
      router.push("/dashboard/products");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...currentProduct,
      category: currentProduct?.category?._id,
      seoTags: currentProduct?.seoTags?.join(", "),
      tags: currentProduct?.tags?.join(", "),
      price: currentProduct?.price / 100,
      discountedPrice: currentProduct?.discountedPrice / 100,
    },
  });

  return (
    <div className="space-y-4">
      {/* Upload Pictures */}
      <ImageDropzone
        uploadedFiles={images}
        setUploadedFiles={setImages}
        disabled={isLoading}
        allowMultiple
      />

      {/* Product information form */}
      <FormModal
        form={form}
        onSubmit={handleSubmit}
        formLabel="save"
        loading={isLoading}
        disabled={isLoading}
      >
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput form={form} label="product title" name="title" />
          <FormInput form={form} label="SEO title" name="seoTitle" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput form={form} label="product price" name="price" />
          <FormInput
            form={form}
            label="discounted price"
            name="discountedPrice"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput form={form} placeholder="" label="weight" name="weight" />
          <FormInput form={form} placeholder="" label="stock" name="stock" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormSelect
            form={form}
            label="select category"
            options={categories}
            keyName="label"
            keyValue="_id"
            name="category"
          />
          <FormSelect
            form={form}
            label="status"
            options={[
              {
                label: "popular",
                value: "popular",
              },
              {
                label: "sale",
                value: "sale",
              },
              {
                label: "hot",
                value: "hot",
              },
              {
                label: "new",
                value: "new",
              },
              {
                label: "out of stock",
                value: "out of stock",
              },
            ]}
            keyName="label"
            name="status"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput form={form} name="warranty" label="warranty" />
          <FormInput form={form} name="boxType" label="box type" />
          <FormInput form={form} name="color" label="color" />
          <FormInput
            form={form}
            name="material"
            placeholder=""
            label="material"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormSelect
            form={form}
            label="featured"
            options={[
              { name: "yes", value: true },
              { name: "no", value: false },
            ]}
            name="featured"
          />
          <FormInput form={form} label="brand" name="brand" />
        </div>
        <FormTextarea
          form={form}
          label="tags (Separate tags using comma)"
          name="tags"
        />
        <FormTextarea form={form} label="SEO tags" name="seoTags" />

        <FormEditor
          form={form}
          label="product description"
          name="description"
        />
        <FormTextarea
          form={form}
          label="SEO description"
          name="seoDescription"
        />
      </FormModal>
    </div>
  );
}
