import { Badge } from "./ui/badge";

export function CalculateDiscount({ price, discountedPrice }) {
  return (
    <>
      {(((price - discountedPrice) / price) * 100).toFixed(2) > 0 && (
        <Badge>
          {(((price - discountedPrice) / price) * 100).toFixed(2)}% off
        </Badge>
      )}
    </>
  );
}
