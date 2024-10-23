"use client";
import { useCartSidebar } from "@/hooks/controllers";
import { Icon } from "../icon";
import { useCart } from "@/hooks/use-cart";

export function CartIndicator() {
  const { onOpen } = useCartSidebar();
  const { total, cartItems } = useCart();

  return (
    <div
      onClick={onOpen}
      role="button"
      className="hidden md:block fixed top-0 bottom-0 right-0 m-auto h-fit z-10 bg-card border border-muted rounded-md cursor-pointer overflow-hidden shadow-active"
    >
      <div className="px-2 py-1 flex flex-col items-center justify-center gap-1">
        <Icon icon="shoppingBasket" size={32} />
        <span className="text-xs uppercase">{cartItems.length} items</span>
      </div>
      <div className="bg-foreground px-2 py-1">
        <span className="text-xs uppercase text-accent">
          {(total / 100).toFixed(2)} TK
        </span>
      </div>
    </div>
  );
}
