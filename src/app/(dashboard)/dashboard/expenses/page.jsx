import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { ExpenseCard } from "@/components/cards/expense-card";
import { Loading } from "@/components/loading";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Expenses() {
  const res = await getData("expenses", 0);

  return (
    <CardView>
      {res.response.payload?.map((expense, index) => (
        <ExpenseCard key={index} expense={expense} />
      ))}
    </CardView>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Block title="expenses">
        <Expenses />
      </Block>
    </Suspense>
  );
}
