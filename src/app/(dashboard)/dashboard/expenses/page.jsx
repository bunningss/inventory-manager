import { Block } from "@/components/block";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { ExpenseTable } from "@/components/tables/expense-table";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Expenses() {
  const { response } = await getData("expenses", 0);

  if (response.payload?.length <= 0) return <Empty message="No data found." />;

  return <ExpenseTable expenses={response?.payload} />;
}

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="expenses" />

      <Suspense fallback={<Loading />}>
        <Expenses />
      </Suspense>
    </div>
  );
}
