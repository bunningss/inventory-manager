import { DataCell } from "@/components/data-cell";
import { OrderCard } from "./order-card";
import { Badge } from "@/components/ui/badge";

export function OrderContainer({ order }) {
  return (
    <div className="rounded-md shadow-regular bg-accent dark:bg-background p-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <DataCell
            dataName="order date"
            dataValue={new Date(order?.orderDate).toDateString()}
          />
          <DataCell
            dataName="total"
            dataValue={`৳${(order?.totalWithDeliveryCharge / 100).toFixed(2)}`}
          />
          <DataCell dataName="order ID" dataValue={order?.orderId} />
        </div>
        <Badge>pending</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
        {order?.products?.map((product, index) => (
          <OrderCard key={index} orderItem={product} />
        ))}
      </div>
    </div>
  );
}
