"use client";
import { putData } from "@/utils/api-calls";
import { errorNotification, successNotification } from "@/utils/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Modal } from "./modal";
import { FormModal } from "../form/form-modal";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(50),
  role: z.enum(["admin", "user"], {
    required_error: "Please select a role.",
    message: "Please select a role.",
  }),
});

const roleOptions = [
  {
    name: "user",
    value: "user",
  },
  {
    name: "admin",
    value: "admin",
  },
];

export function UpdateUser({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      role: data?.role,
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
      title="Edit User"
      description="Make changes here. Click save when you're done."
      triggerIcon="edit"
      className="rounded-full"
      triggerSize="icon"
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
          options={roleOptions}
          placeholder="select role"
          name="role"
          label="role"
          defaultValue={data?.role}
        />
      </FormModal>
    </Modal>
  );
}
