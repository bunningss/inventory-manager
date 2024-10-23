"use client";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "../cart/cart-item";
import { Heading } from "../heading";

export function CheckoutSummary() {
  const { cartItems } = useCart();

  return (
    <>
      <Heading>order summary</Heading>
      <div className="mt-4 max-h-[600px] overflow-auto grid gap-2 mb-2 md:sticky">
        {cartItems?.map((item, index) => (
          <CartItem key={index} item={item} />
        ))}
      </div>
    </>
  );
}
