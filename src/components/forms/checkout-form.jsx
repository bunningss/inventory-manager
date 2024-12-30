"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { getData, postData } from "@/utils/api-calls";
import {
  errorNotification,
  successNotification,
  warningNotification,
} from "@/utils/toast";
import { Heading } from "../heading";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "../form/form-input";
import { FormSelect } from "../form/form-select";
import { FormRadio } from "../form/form-radio";
import { FormModal } from "../form/form-modal";

const locations = [
  {
    name: "dhaka - 80TK",
    value: "8000",
  },
  {
    name: "outside dhaka - 100TK",
    value: "10000",
  },
];

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(11, {
    message: "Phone number must be at least 11 characters.",
  }),
  city: z.string({
    required_error: "Please select city.",
  }),
  paymentMethod: z.enum(["BKASH", "COD"], {
    required_error: "You need to select a payment method.",
  }),
  couponCode: z.string().optional().nullable(),
});

export function CheckoutForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const { cartItems, total, onClear } = useCart();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      city: "",
      paymentMethod: "COD",
      couponCode: "",
    },
  });

  useEffect(() => {
    const charge = form.watch("city");
    if (charge) {
      setDeliveryCharge(charge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("city")]);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Start processing order
      const { error, response } = await postData("orders", {
        ...data,
        products: cartItems,
        total: total,
        deliveryCharge: data.city,
        location: locations.filter((loc) => loc.value === data.city)[0]?.name,
      });

      if (error) {
        return errorNotification(response.msg);
      }

      onClear();
      router.push(`/success?id=${response?.payload}`);
      successNotification(response.msg);
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoupon = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      setIsLoading(true);
      const couponCode = form.getValues("couponCode");

      if (!couponCode.trim()) {
        return warningNotification("Please enter valid a coupon code.");
      }

      const { error, response } = await getData(`coupons/${couponCode}`, 0);
      if (error) {
        form.setValue("couponCode", "");
        return errorNotification(response.msg);
      }

      setDiscount(response.payload.discount);
      successNotification("Coupon code applied successfully.");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <FormModal
        formLabel="place order"
        onSubmit={handleSubmit}
        form={form}
        loading={isLoading}
        disabled={cartItems.length <= 0 || isLoading}
      >
        <div>
          <Heading>shipping information</Heading>
          <div className="flex flex-col gap-4 mt-4">
            <FormInput
              form={form}
              label="full name / পুরো নাম"
              placeholder="John Doe"
              name="name"
              required
            />
            <FormInput
              form={form}
              label="address / ঠিকানা"
              placeholder="21/3, Mariana Drive, AC"
              name="address"
              required
            />

            <div className="grid md:grid-cols-2 gap-2 md:gap-4">
              <FormSelect
                form={form}
                name="city"
                placeholder="select city"
                options={locations}
                label="city / শহর"
                required
              />
              <FormInput
                form={form}
                placeholder="01..."
                name="phone"
                label="phone number / মোবাইল নম্বর"
                required
              />
            </div>
          </div>
        </div>

        {/* Coupon code */}
        <div className="grid gap-4 border border-shade border-dashed p-4 rounded-md">
          <FormInput
            form={form}
            name="couponCode"
            placeholder="example2024"
            className="uppercase"
          />

          <Button
            icon="discount"
            onClick={handleCoupon}
            loading={isLoading}
            disabled={isLoading || cartItems.length === 0}
          >
            apply coupon
          </Button>
        </div>

        {/* Payment method */}
        <div className="mt-4">
          <Heading>payment method</Heading>
          <div className="grid gap-2 md:gap-4 mt-4">
            <FormRadio form={form} />
          </div>
        </div>

        {/* Order summary */}
        <div className="p-2 bg-accent">
          <table className="w-full rounded-md">
            <tbody>
              <tr>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">Sub Total</td>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">
                  ৳{(total / 100).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">
                  Delivery Charge
                </td>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">
                  ৳{(deliveryCharge / 100).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">Discount</td>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">
                  ৳{(((total / 100) * discount) / 100).toFixed(2)}{" "}
                  {discount && (
                    <span className="text-primary font-bold">
                      ({discount}%)
                    </span>
                  )}
                </td>
              </tr>
              <tr className="text-3xl">
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">Order total</td>
                <td className="capitalize pt-3 pb-3 pl-0 pr-0">
                  ৳
                  {discount
                    ? (
                        (Number(total) -
                          Number(total * discount) / 100 +
                          Number(deliveryCharge)) /
                        100
                      ).toFixed(2)
                    : ((Number(total) + Number(deliveryCharge)) / 100).toFixed(
                        2
                      )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormModal>
    </div>
  );
}
