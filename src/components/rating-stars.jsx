import { Icon } from "./icon";

export function RatingStars({ rating }) {
  return (
    <div className="flex items-center">
      <Icon icon="star" className="text-primary" size={22} />
      <Icon icon="star" className="text-primary" size={22} />
      <Icon icon="star" className="text-primary" size={22} />
      <Icon icon="star" className="text-primary" size={22} />
    </div>
  );
}
