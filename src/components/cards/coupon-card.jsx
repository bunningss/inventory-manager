import { Card, CardContent, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Icon } from "@/components/icon";

export function CouponCard({ coupon }) {
  return (
    <Card title={coupon?.code}>
      <CardContent className="flex items-center gap-2 p-1 md:p-1">
        <div className="bg-slate-100 px-1">
          <Icon icon="coupon" size={80} />
        </div>
        <div className="py-0 px-1 w-full flex flex-col gap-1">
          <CardTitle className="font-bold text-base">
            {coupon?.code}
            <span
              className={
                coupon?.isActive ? "text-green-500" : "text-destructive"
              }
            >
              {coupon?.isActive ? "" : " - Disabled"}
            </span>
          </CardTitle>
          <span>{coupon?.user?.name}</span>
          <div className="flex items-center justify-between">
            <span>
              Discount:{" "}
              <span className="font-bold text-primary">
                {coupon?.discount}%
              </span>
            </span>

            <div className="space-x-2">
              <Button size="icon" className="rounded-full" icon="edit" />
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
