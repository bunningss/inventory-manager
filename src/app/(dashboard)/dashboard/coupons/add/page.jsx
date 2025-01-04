import { Block } from "@/components/block";
import { AddCoupon } from "@/components/forms/add-coupon";

export default async function Page() {
  return (
    <div className="space-y-4">
      <Block title="add coupon" />
      <AddCoupon />
    </div>
  );
}
