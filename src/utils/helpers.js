import { useCart } from "@/hooks/use-cart";
import { useMemo } from "react";

export function factorCartPrice(discount_price, regular_price) {
  if (discount_price > regular_price) return regular_price;

  return discount_price;
}

export function useCheckCart(product) {
  const { cartItems } = useCart();

  const foundItem = useMemo(() => {
    return cartItems?.find((item) => item?._id === product?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  return foundItem;
}

export function useEcommerce() {
  const { onAdd, onRemove, onIncrease, onDecrease } = useCart();

  function addToCart(product) {
    onAdd({
      ...product,
      price: factorCartPrice(product?.discountedPrice, product?.price),
    });
  }

  function removeFromCart(product) {
    onRemove(product._id, product.title);
  }

  function increaseQuantity(id) {
    onIncrease(id);
  }

  function decreaseQuantity(id, title) {
    onDecrease(id, title);
  }

  return { addToCart, removeFromCart, increaseQuantity, decreaseQuantity };
}
