"use client";
import Image from "next/image";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { Editor } from "../../form/form-editor";
import { putData } from "@/utils/api-calls";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { errorNotification, successNotification } from "@/utils/toast";
import { FormModal } from "@/components/form/form-modal";

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
  const [description, setDescription] = useState(currentProduct?.description);
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
        description,
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

  // Filter out images
  const handleImages = (currentImage) => {
    const filteredImages = images.filter((image) => image !== currentImage);
    setImages(filteredImages);
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
    <div className="bg-background p-2 rounded-md">
      {/* Upload Pictures */}
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
              Click to upload images
            </div>
          );
        }}
      </CldUploadWidget>

      {/* Available images preview */}
      {images?.length > 0 && (
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
              {/* Delete button */}
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

      {/* Product information form */}
      <FormModal
        form={form}
        onSubmit={handleSubmit}
        formLabel="save"
        loading={isLoading}
        disabled={isLoading}
      >
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput
            form={form}
            placeholder=""
            label="product title"
            name="title"
          />
          <FormInput
            form={form}
            label="SEO title"
            placeholder=""
            name="seoTitle"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <FormInput
            form={form}
            placeholder=""
            label="product price"
            name="price"
          />
          <FormInput
            form={form}
            placeholder=""
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
          <FormInput form={form} placeholder="" label="brand" name="brand" />
        </div>
        <FormInput
          form={form}
          placeholder=""
          label="tags (Separate tags using comma)"
          type="textarea"
          name="tags"
        />
        <FormInput
          form={form}
          label="SEO tags"
          placeholder=""
          type="textarea"
          name="seoTags"
        />

        <Editor
          label="product description"
          content={description}
          setContent={setDescription}
        />
        <FormInput
          form={form}
          placeholder=""
          label="SEO description"
          type="textarea"
          name="seoDescription"
        />
      </FormModal>
    </div>
  );
}
