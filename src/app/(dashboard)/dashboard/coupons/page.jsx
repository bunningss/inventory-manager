import { Block } from "@/components/block";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { CouponsTable } from "@/components/tables/coupons-table";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Coupons() {
  const { response } = await getData("coupons", 0);
  if (response.payload?.length <= 0) return <Empty message="No data found." />;

  return <CouponsTable coupons={response.payload} />;
}

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="Coupon codes" />
      <Suspense fallback={<Loading />}>
        <Coupons />
      </Suspense>
    </div>
  );
}
