"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { createGrantToken, createPayment } from "@/utils/bkash";
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
import { Input } from "../ui/input";
import { Label } from "../ui/label";

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
  phone: z.string().min(9, {
    message: "Phone number must be at least 9 characters.",
  }),
  city: z.string({
    required_error: "Please select city.",
  }),
  paymentMethod: z.enum(["BKASH", "COD"], {
    required_error: "You need to select a payment method.",
  }),
});

export function CheckoutForm({ referrer }) {
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState(referrer);
  const [discount, setDiscount] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const { cartItems, total, onClear } = useCart();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Start processing order
      const res = await postData("orders", {
        ...data,
        products: cartItems,
        total: total,
        couponCode: couponCode,
        deliveryCharge: data.city,
        location: locations.filter((loc) => loc.value === data.city)[0]?.name,
      });

      if (res.error) {
        return errorNotification(res.response.msg);
      }

      if (data.paymentMethod === "BKASH") {
        const grantToken = await createGrantToken();
        if (grantToken.error) {
          return errorNotification(
            "An error occured during payment. Please try again."
          );
        }

        const paymenturl = await createPayment({}, grantToken.payload);
        if (paymenturl.error) {
          return errorNotification(
            "An error occured during payment. Please try again."
          );
        }

        router.push(paymenturl.payload);
      }

      onClear();
      router.push(`/success?id=${res.response?.payload}`);
      successNotification(res.response.msg);
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
    setIsLoading(true);

    try {
      if (!couponCode) {
        return warningNotification("Please enter valid a coupon code.");
      }

      const res = await getData(`coupons/${couponCode}`, 0);
      if (res.error) {
        setCouponCode("");
        return errorNotification(res.response.msg);
      }

      setDiscount(res.response.payload.discount);
      successNotification("Coupon code applied successfully.");
    } catch (err) {
      errorNotification(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (referrer) {
      handleCoupon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referrer]);

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
              description=""
            />
            <FormInput
              form={form}
              label="address / ঠিকানা"
              placeholder="21/3, Mariana Drive, AC"
              name="address"
              required
              description=""
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
                description=""
              />
            </div>
          </div>
        </div>

        {/* Coupon code */}
        <div className="grid gap-4 border border-shade border-dashed p-4 rounded-md">
          <div className="space-y-2">
            <Label className="capitalize">coupon code / কুপন</Label>
            <Input
              className="uppercase"
              placeholder={couponCode ? couponCode : "example2024"}
              onChange={(e) => setCouponCode(e.target.value)}
            />
          </div>

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
                        (parseInt(total) -
                          parseInt(total * discount) / 100 +
                          parseInt(deliveryCharge)) /
                        100
                      ).toFixed(2)
                    : (
                        (parseInt(total) + parseInt(deliveryCharge)) /
                        100
                      ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormModal>
    </div>
  );
}
