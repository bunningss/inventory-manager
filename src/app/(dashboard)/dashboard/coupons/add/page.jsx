import { Block } from "@/components/block";
import { AddCoupon } from "@/components/dashboard/forms/add-coupon";

export default async function Page() {
  return (
    <div>
      <Block title="add coupon"></Block>

      <div className="mt-8">
        <AddCoupon />
      </div>
    </div>
  );
}
