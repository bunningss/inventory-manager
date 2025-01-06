"use client";
import { ImageDropzone } from "@/components/dropzone";
import { FormInput } from "@/components/form/form-input";
import { FormModal } from "@/components/form/form-modal";
import { postData } from "@/utils/api-calls";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState(null);
  const form = useForm();

  const handleSubmit = async (formData) => {
    const res = await postData("upload", { data: formData, files: files });

    setUrls(res.response?.payload);
  };

  return (
    <div>
      <ImageDropzone setFiles={setFiles} />
      <FormModal onSubmit={handleSubmit} form={form} formLabel="save">
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
            label="category icon [ choose from lucide.dev/icons ]"
            placeholder="e.g. briefcase"
            name="icon"
            required
          />
        </div>
      </FormModal>

      {urls?.map((item, index) => (
        <figure key={index} className="h-96 w-96">
          <Image src={item} alt="Regular image" fill />
        </figure>
      ))}
    </div>
  );
}
