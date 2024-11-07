import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { UpdateExpense } from "../modals/update-expense";

export function ExpenseCard({ expense }) {
  return (
    <Card title={expense?.title}>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <div className="bg-slate-100 dark:bg-primary-foreground px-1">
          <Icon icon="expense" size={80} />
        </div>
        <div className="py-0 px-1 w-full flex flex-col">
          <CardTitle className="capitalize font-bold text-base">
            {expense?.title}
          </CardTitle>
          <span>{new Date(expense?.date).toDateString()}</span>
          <div className="flex items-center justify-between">
            <span>
              Amount:{" "}
              <span className="text-primary font-bold">
                ৳{expense?.amount / 100}
              </span>
            </span>
            <div className="space-x-2">
              <UpdateExpense />
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                icon="delete"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
