"use client";
import { useForm } from "react-hook-form";
import { FormInput } from "../form/form-input";
import { FormModal } from "../form/form-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "./modal";
import { useState } from "react";

const formSchema = z.object({
  customerName: z.string().optional(),
  paid: z.string(),
});

export function UpdateSalesReport({ data }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: data?.customerName,
      paid: data?.paid / 100,
    },
  });

  const handleSubmit = async (values) => {};

  return (
    <Modal
      title="Edit report"
      description="Make changes to your report here. Click save when you're done."
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
        <FormInput form={form} label="paid amount" name="paid" />
      </FormModal>
    </Modal>
  );
}
