import { Block } from "@/components/block";
import { AddExpense } from "@/components/forms/add-expense";

export default function Page() {
  return (
    <div className="space-y-4">
      <Block title="add expense" />
      <AddExpense />
    </div>
  );
}
