"use client";
import { useCart } from "@/hooks/use-cart";
import { Button } from "../ui/button";

export function QuantityControl({ id, title, quantity }) {
  const cart = useCart();

  return (
    <div className="w-fit rounded-md flex items-center gap-4">
      <Button icon="plus" onClick={() => cart.onIncrease(id)} />
      <span className="font-bold text-base">{quantity}</span>
      <Button icon="minus" onClick={() => cart.onDecrease(id, title)} />
    </div>
  );
}
