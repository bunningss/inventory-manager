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
import { FormModal } from "../form/form-modal";

const formSchema = z.object({
  quantity: z.string().min(1, { message: "Quantity is required." }),
});

export function AddProductQuantity({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: "",
    },
  });

  const handleSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const { response, error } = await putData(
        `products/update-quantity/${data?._id}`,
        formData
      );

      if (error) {
        return errorNotification(response.msg);
      }

      successNotification(response.msg);
      form.reset({
        quantity: "",
      });
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
      title="Add product Quantity"
      description="New product quantity."
      triggerIcon="plus"
      triggerSize="icon"
      className="rounded-full"
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
          name="quantity"
          label="product quantity / পণ্য পরিমাণ"
          placeholder="Quantity / পরিমাণ"
        />
      </FormModal>
    </Modal>
  );
}
