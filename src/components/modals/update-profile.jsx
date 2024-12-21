"use client";
import { useState } from "react";
import { Modal } from "./modal";
import { errorNotification, successNotification } from "@/utils/toast";
import { putData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { FormModal } from "../form/form-modal";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(50),
  gender: z
    .enum(["male", "female"], {
      required_error: "Please select a gender",
      message: "Please select a gender",
    })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(11, {
      message: "Phone number must be at least 11 characters.",
    })
    .max(11)
    .optional()
    .or(z.literal("")),
});

const genderOptions = [
  {
    name: "male",
    value: "male",
  },
  {
    name: "female",
    value: "female",
  },
];

export function UpdateProfile({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      gender: data?.gender,
      phone: data?.phone || "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const res = await putData(`users/${data?._id}`, {
        ...formData,
      });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification(res.response.msg);
      setIsModalOpen(false);
      router.refresh();
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      triggerLabel="update profile"
      triggerIcon="edit"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onOpen={() => setIsModalOpen(true)}
    >
      <FormModal
        onSubmit={handleSubmit}
        form={form}
        loading={isLoading}
        disabled={isLoading}
        formLabel="update"
      >
        <FormInput
          form={form}
          name="name"
          placeholder=""
          label="name"
          defaultValue={data?.name}
        />
        <FormSelect
          form={form}
          options={genderOptions}
          placeholder="select gender"
          name="gender"
          label="gender"
          defaultValue={data?.gender}
        />
        <FormInput
          form={form}
          name="phone"
          placeholder=""
          label="phone number"
          defaultValue={data?.phone}
        />
      </FormModal>
    </Modal>
  );
}
