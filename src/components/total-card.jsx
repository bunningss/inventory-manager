import { Icon } from "./icon";
import { Card, CardContent } from "./ui/card";

export function TotalCard({ data }) {
  return (
    <Card className="bg-accent border-b-4 border-b-primary">
      <CardContent className="flex items-center justify-between gap-4">
        <Icon icon={data?.icon} size={64} />
        <div className="flex flex-col justify-between items-end gap-2 capitalize h-full">
          <span className="text-base text-right">{data?.dataKey}</span>
          <span className="font-bold text-3xl">{data?.dataValue}</span>
        </div>
      </CardContent>
    </Card>
  );
}
