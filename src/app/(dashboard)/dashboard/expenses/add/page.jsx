import { Block } from "@/components/block";
import { AddExpense } from "@/components/dashboard/forms/add-expense";

export default function Page() {
  return (
    <>
      <Block title="add expense" />
      <div className="mt-8">
        <AddExpense />
      </div>
    </>
  );
}
