import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { CouponCard } from "@/components/cards/coupon-card";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Coupons() {
  const res = await getData("coupons", 0);

  return (
    <CardView>
      {res.response?.payload?.map((coupon, index) => (
        <CouponCard key={index} coupon={coupon} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Block title="Coupons codes">
        <Coupons />
      </Block>
    </Suspense>
  );
}
