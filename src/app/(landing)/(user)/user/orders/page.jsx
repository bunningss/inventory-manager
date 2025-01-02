import { Empty } from "@/components/empty";
import { Heading } from "@/components/heading";
import { OrdercontainerSkeleton } from "@/components/skeletons/order-container-skeleton";
import { OrderContainer } from "@/components/user/order-container";
import { getData } from "@/utils/api-calls";
import { getSession } from "@/utils/auth";
import { Suspense } from "react";

export async function generateMetadata() {
  const { payload } = await getSession();

  return {
    title: `${payload?.name}'s past orders`,
  };
}

async function OrderData() {
  const { response } = await getData(`users/orders`, 0);

  return (
    <>
      {response.payload?.length > 0 && (
        <div className="grid gap-4">
          {response.payload?.map((order, index) => (
            <OrderContainer key={index} order={order} />
          ))}
        </div>
      )}
      {response.payload?.length === 0 && (
        <Empty message="You haven't placed any orders yet. Order something to continue." />
      )}
    </>
  );
}

export default async function Page() {
  return (
    <>
      <Heading className="mb-4">Order details</Heading>
      <Suspense fallback={<OrdercontainerSkeleton />}>
        <OrderData />
      </Suspense>
    </>
  );
}
