"use client";
import { Button } from "../ui/button";
import { useEcommerce } from "@/utils/helpers";

export function QuantityControl({ id, title, quantity }) {
  const { increaseQuantity, decreaseQuantity } = useEcommerce();

  return (
    <div className="w-fit rounded-md flex items-center gap-4">
      <Button icon="plus" onClick={() => increaseQuantity(id)} />
      <span className="font-bold text-base">{quantity}</span>
      <Button icon="minus" onClick={() => decreaseQuantity(id, title)} />
    </div>
  );
}
