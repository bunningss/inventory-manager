import { Block } from "@/components/block";
import { Loading } from "@/components/loading";
import { CouponsTable } from "@/components/tables/coupons-table";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Coupons() {
  const { response } = await getData("coupons", 0);

  return <CouponsTable coupons={response.payload} />;
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-4">
        <Block title="Coupon codes"></Block>
        <Coupons />
      </div>
    </Suspense>
  );
}
