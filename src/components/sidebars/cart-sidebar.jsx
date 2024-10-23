"use client";
import { useCartSidebar } from "@/hooks/controllers";
import { Sidebar } from "./sidebar";
import { Button } from "../ui/button";
import { CartItem } from "../cart/cart-item";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";

export function CartSidebar() {
  const { isOpen, onClose } = useCartSidebar();
  const { cartItems, total } = useCart();
  const router = useRouter();

  const footer = (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-lg">Total:</span>
        <span className="text-lg font-bold">{(total / 100).toFixed(2)} TK</span>
      </div>
      <Button
        className="w-full"
        icon="arrowRight"
        disabled={cartItems.length <= 0}
        onClick={() => {
          router.push("/checkout");
          onClose();
        }}
      >
        proceed to Checkout
      </Button>
    </div>
  );

  return (
    <Sidebar
      isOpen={isOpen}
      onClose={onClose}
      title="Your Shopping Cart"
      subtitle="Review your selected items before checkout."
      footer={footer}
    >
      <div className="grid gap-2">
        {cartItems?.map((item, index) => (
          <CartItem key={index} item={item} />
        ))}
      </div>
    </Sidebar>
  );
}
