import { Block } from "@/components/block";
import { Loading } from "@/components/loading";
import { OrdersTable } from "@/components/tables/orders-table";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Orders() {
  const { response } = await getData("orders", 0);

  return <OrdersTable orders={response.payload} />;
}

export default async function Page() {
  return (
    <div className="space-y-4">
      <Block title="orders" />

      <Suspense fallback={<Loading className="py-8" />}>
        <Orders />
      </Suspense>
    </div>
  );
}
