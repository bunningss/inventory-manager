import { useCart } from "@/hooks/use-cart";
import { useMemo } from "react";

export function useCheckCart(product) {
  const { cartItems } = useCart();

  const foundItem = useMemo(() => {
    return cartItems?.find((item) => item?._id === product?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems.length]);

  return foundItem;
}
