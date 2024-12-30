export function CalculateDiscount({ price, discountedPrice }) {
  return (
    <span className="w-fit p-1 bg-primary rounded-md text-xs font-bold text-accent dark:text-background">
      {(((price - discountedPrice) / price) * 100).toFixed(2)}% off
    </span>
  );
}
