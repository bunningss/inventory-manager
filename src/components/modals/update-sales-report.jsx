"use client";
import { useForm } from "react-hook-form";
import { FormInput } from "../form/form-input";
import { FormModal } from "../form/form-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./modal";
import { useEffect, useState } from "react";
import { FormCheckbox } from "../form/form-checkbox";
import { errorNotification, successNotification } from "@/utils/toast";
import { putData } from "@/utils/api-calls";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  customerName: z.string().optional(),
  customerNumber: z.string().optional(),
  newAmount: z.string().optional(),
  clear: z.boolean().optional(),
});

export function UpdateSalesReport({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: data?.customerName,
      newAmount: "",
      customerNumber: data?.customerNumber || "",
      clear: Number(data?.due) === 0 ? true : false,
    },
  });

  // Reset form on modal state change
  useEffect(() => {
    form.reset({
      customerName: data?.customerName,
      newAmount: "",
      customerNumber: data?.customerNumber || "",
      clear: Number(data?.due) === 0 ? true : false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleSubmit = async (values) => {
    setIsLoading(true);

    try {
      const { response, error } = await putData(`sales/${data?._id}`, values);
      if (error) {
        return errorNotification(response.msg);
      }

      router.refresh();
      successNotification(response.msg);
      setIsModalOpen(false);
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Edit report"
      triggerIcon="edit"
      className="rounded-full"
      triggerSize="icon"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onOpen={() => setIsModalOpen(true)}
    >
      <FormModal
        form={form}
        formLabel="save"
        loading={isLoading}
        disabled={isLoading}
        onSubmit={handleSubmit}
      >
        <FormInput form={form} label="customer name" name="customerName" />
        <FormInput form={form} label="phone number" name="customerNumber" />
        <div className="border-b border-input flex items-center justify-between pb-1">
          <span>{`Paid / পরিশোধ - ৳${data?.paid / 100}`}</span>
          <span>{`Due / বাকি - ৳${data?.due / 100}`}</span>
        </div>

        <FormInput
          form={form}
          label="amount"
          name="newAmount"
          disabled={data?.due <= 0}
        />
        <FormCheckbox
          form={form}
          disabled={data?.due <= 0}
          name="clear"
          label="Full Paid / সম্পূর্ণ অর্থ প্রদান"
        />
      </FormModal>
    </Modal>
  );
}
