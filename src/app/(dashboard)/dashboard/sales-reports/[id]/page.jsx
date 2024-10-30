import { getData } from "@/utils/api-calls";
import { Receipt } from "@/components/sales/receipt";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

async function Receipts({ id }) {
  const res = await getData(`sales/${id}`, 0);
  return <Receipt data={res.response.payload} />;
}

export default async function Page({ params }) {
  return (
    <Suspense fallback={<Loading />}>
      <Receipts id={params.id} />
    </Suspense>
  );
}
