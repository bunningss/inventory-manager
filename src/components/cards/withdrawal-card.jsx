import { Card, CardContent, CardTitle } from "../../ui/card";
import { Icon } from "../../icon";
import { UpdateWithdrawal } from "../modals/update-withdrawal";

export function WithdrawalCard({ withdrawal }) {
  return (
    <Card
      className={`shadow-md ${
        withdrawal?.status === "paid"
          ? "border-green-800 shadow-green-800"
          : withdrawal?.status === "pending"
          ? "border-yellow-500 shadow-yellow-500"
          : "border-destructive shadow-destructive"
      }`}
    >
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <div className="bg-slate-100 px-1">
          <Icon icon="user" size={80} />
        </div>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <CardTitle className="capitalize font-bold text-base">
            {withdrawal?.user?.name}
          </CardTitle>

          <span>
            Requested Amount:{" "}
            <span className="text-primary font-bold uppercase">
              {withdrawal?.amount / 100}
            </span>
          </span>

          <div className="flex items-center justify-between">
            <span>
              bKash:
              <span className="text-primary font-bold uppercase">
                {withdrawal?.user?.bkash}
              </span>
            </span>
            <div>
              <UpdateWithdrawal withdrawal={withdrawal} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
