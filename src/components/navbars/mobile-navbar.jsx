"use client";
import Link from "next/link";

import { useAccountSidebar, useCartSidebar } from "@/hooks/controllers";
import { useCart } from "@/hooks/use-cart";
import { Container } from "../container";
import { Icon } from "../icon";

export function MobileNavbar() {
  const accountSidebar = useAccountSidebar();
  const cartSidebar = useCartSidebar();
  const { cartItems } = useCart();

  return (
    <nav className="w-full bg-background border-t border-muted sticky bottom-0 left-0 z-[4] md:hidden">
      <Container>
        <div className="flex items-center justify-between">
          <Link
            href="/shop"
            className="flex flex-col items-center gap-1 justify-center"
          >
            <Icon icon="shop" size={24} />
            <span className="capitalize text-xs font-bold">shop</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-col items-center gap-1 justify-center"
          >
            <Icon icon="wishlist" size={24} />
            <span className="capitalize text-xs font-bold">wishlist</span>
          </Link>
          <Link
            href="/"
            className="flex flex-col items-center gap-1 justify-center"
          >
            <Icon icon="home" size={24} />
            <span className="capitalize text-xs font-bold">home</span>
          </Link>
          <div
            role="button"
            onClick={cartSidebar.onOpen}
            className="flex flex-col items-center gap-1 justify-center relative"
          >
            <Icon icon="shoppingbasket" size={24} />
            <span className="capitalize text-xs font-bold">cart</span>
            <span className="absolute -top-1.5 -right-2 h-4 w-4 rounded-full text-center text-[10px] bg-primary text-background">
              {cartItems?.length}
            </span>
          </div>
          <div
            className="flex flex-col items-center gap-1 justify-center"
            role="button"
            onClick={accountSidebar.onOpen}
          >
            <Icon icon="user" size={24} />
            <span className="capitalize text-xs font-bold">account</span>
          </div>
        </div>
      </Container>
    </nav>
  );
}
