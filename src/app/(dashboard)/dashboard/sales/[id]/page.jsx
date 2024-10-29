import { getData } from "@/utils/api-calls";
import { Receipt } from "@/components/sales/receipt";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

export default async function Page({ params }) {
  await new Promise((resolve) => setTimeout(resolve, 7000));
  const res = await getData(`sales/${params.id}`);

  return (
    <Suspense fallback={<Loading />}>
      <Receipt data={res.response.payload} />
    </Suspense>
  );
}
