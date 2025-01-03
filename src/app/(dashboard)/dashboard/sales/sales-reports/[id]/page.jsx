import { getData } from "@/utils/api-calls";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { SaleReceipt } from "@/components/receipts/sale-receipt";

async function Receipts({ id }) {
  const res = await getData(`sales/${id}`, 0);
  return <SaleReceipt data={res.response.payload} />;
}

export default async function Page({ params }) {
  return (
    <Suspense fallback={<Loading />}>
      <Receipts id={params.id} />
    </Suspense>
  );
}
