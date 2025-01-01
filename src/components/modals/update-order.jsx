"use client";
import { Modal } from "@/components/modals/modal";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/components/form/form-input";
import { FormSelect } from "@/components/form/form-select";
import { putData } from "@/utils/api-calls";
import { errorNotification, successNotification } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { FormModal } from "../form/form-modal";

const statuses = [
  {
    name: "pending",
    value: "pending",
  },
  {
    name: "processing",
    value: "processing",
  },
  {
    name: "courier",
    value: "courier",
  },
  {
    name: "delivered",
    value: "delivered",
  },
  {
    name: "cancelled",
    value: "cancelled",
  },
];

const paymentStatus = [
  {
    name: "pending",
    value: "pending",
  },
  {
    name: "paid",
    value: "confirmed",
  },
];

const formSchema = z.object({
  address: z.string().min(8, {
    message: "Address must be at least 8 characters.",
  }),
  status: z.enum(
    ["pending", "processing", "courier", "delivered", "cancelled"],
    {
      required_error: "Please select an order status.",
    }
  ),
  paymentStatus: z.enum(["pending", "confirmed"], {
    required_error: "Please select an payment status.",
  }),
});

export function UpdateOrder({ order }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: order?.address,
      status: "courier",
      paymentStatus: order?.paymentStatus,
    },
  });

  async function handleSubmit(data) {
    setIsLoading(true);

    try {
      const res = await putData(`orders/${order?._id}`, data);

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      successNotification("Order updated successfully.");
      router.refresh();
      setIsModalOpen(false);
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="order status"
      description="Update order details."
      triggerIcon="edit"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onOpen={() => setIsModalOpen(true)}
      className="rounded-full"
      triggerSize="icon"
    >
      <FormModal
        form={form}
        onSubmit={handleSubmit}
        formLabel="save"
        loading={isLoading}
        disabled={isLoading}
      >
        <FormInput form={form} name="address" label="delivery address" />
        <FormSelect
          form={form}
          name="paymentStatus"
          label="payment status"
          placeholder="payment status"
          options={paymentStatus}
        />
        <FormSelect
          form={form}
          name="status"
          label="order status"
          placeholder="current status"
          options={statuses}
        />
      </FormModal>
    </Modal>
  );
}
