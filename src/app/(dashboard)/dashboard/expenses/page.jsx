import { Block } from "@/components/block";
import { Loading } from "@/components/loading";
import { ExpenseTable } from "@/components/tables/expense-table";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Expenses() {
  const { response } = await getData("expenses", 0);

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
