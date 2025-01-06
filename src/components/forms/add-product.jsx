"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postData } from "@/utils/api-calls";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormModal } from "@/components/form/form-modal";
import { ImageDropzone } from "@/components/dropzone";
import { FormEditor } from "../form/form-editor";
import { FormTextarea } from "../form/form-textarea";

const formSchema = z.object({
  title: z.string().min(1, "Product title is required"),
  seoTitle: z.string().min(1, "SEO title is required"),
  price: z.string().min(0, "Product price must be greater than or equal to 0"),
  discountedPrice: z
    .string()
    .min(0, "Product price must be greater than or equal to 0"),
  weight: z.string().min(1, "Weight is required"),
  stock: z.string().min(1, "Stock must be at least 1"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["popular", "sale", "hot", "new", "out of stock"]).optional(),
  warranty: z.string().optional(),
  boxType: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  brand: z.string().min(1, "Brand is required"),
  tags: z.string().optional(),
  seoTags: z.string().optional(),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  seoDescription: z.string().min(1, "SEO description is required"),
});

export function AddProduct({ categories }) {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      seoTitle: "",
      price: "",
      discountedPrice: "",
      weight: "",
      stock: "",
      category: "",
      status: "",
      warranty: "",
      boxType: "",
      color: "",
      material: "",
      featured: "false",
      brand: "",
      tags: "",
      seoTags: "",
      description: "",
      seoDescription: "",
    },
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const tags_trimmed = data.tags?.split(",").map((tag) => tag.trim());
      const seo_tags_trimmed = data.seoTags
        ?.split(",")
        .map((tag) => tag.trim());
      const res = await postData("products", {
        ...data,
        tags: tags_trimmed,
        seoTags: seo_tags_trimmed,
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

  return (
    <div className="bg-background p-2 rounded-md space-y-4">
      {/* Upload Pictures */}
      <ImageDropzone
        label="Drag and Drop Images"
        file={images}
        setFile={setImages}
      />

      {/* Product information form */}
      <FormModal
        form={form}
        onSubmit={handleSubmit}
        formLabel="save"
        loading={isLoading}
        disabled={isLoading}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            form={form}
            placeholder=""
            label="product title"
            required
            name="title"
          />
          <FormInput
            form={form}
            label="SEO title"
            placeholder=""
            required
            name="seoTitle"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput
            form={form}
            placeholder=""
            label="product price"
            required
            type="number"
            name="price"
          />
          <FormInput
            form={form}
            placeholder=""
            label="discounted price"
            type="number"
            name="discountedPrice"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput
            form={form}
            placeholder=""
            label="weight"
            required
            name="weight"
          />
          <FormInput
            form={form}
            placeholder=""
            label="stock"
            required
            type="number"
            min={1}
            name="stock"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormSelect
            form={form}
            label="select category"
            options={categories}
            keyName="label"
            keyValue="_id"
            required
            name="category"
          />
          <FormSelect
            form={form}
            label="status"
            name="status"
            options={[
              {
                name: "popular",
                value: "popular",
              },
              {
                name: "sale",
                value: "sale",
              },
              {
                name: "hot",
                value: "hot",
              },
              {
                name: "new",
                value: "new",
              },
              {
                name: "out of stock",
                value: "out of stock",
              },
            ]}
            keyName="name"
            keyValue="value"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput
            form={form}
            name="warranty"
            placeholder=""
            label="warranty"
          />
          <FormInput
            form={form}
            name="boxType"
            placeholder=""
            label="box type"
          />
          <FormInput form={form} name="color" placeholder="" label="color" />
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
          <FormInput
            form={form}
            placeholder=""
            label="brand"
            required
            name="brand"
          />
        </div>
        <FormTextarea
          form={form}
          placeholder=""
          label="tags (Separate tags using comma)"
          required
          name="tags"
        />
        <FormTextarea
          form={form}
          label="SEO tags"
          placeholder=""
          required
          name="seoTags"
        />
        <FormEditor
          name="description"
          label="product description"
          required
          form={form}
        />
        <FormTextarea
          form={form}
          label="SEO description"
          name="seoDescription"
          required
        />
      </FormModal>
    </div>
  );
}
