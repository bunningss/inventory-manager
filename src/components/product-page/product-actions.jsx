"use client";
import { Button } from "../ui/button";
import { useCheckCart } from "@/utils/helpers";
import { QuantityControl } from "../cart/quantity-control";

export function ProductActions({ currentProduct }) {
  const isInCart = useCheckCart(currentProduct);

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {!isInCart && (
        <Button aria-label="add product to shopping cart" icon="shoppingBag">
          add to cart
        </Button>
      )}
      {isInCart && (
        <QuantityControl
          id={currentProduct?._id}
          title={currentProduct?.title}
          quantity={isInCart?.quantity}
        />
      )}
      <Button
        aria-label="add product to wishlist"
        icon="heart"
        variant="outline"
      >
        add to wishlist
      </Button>
    </div>
  );
}
