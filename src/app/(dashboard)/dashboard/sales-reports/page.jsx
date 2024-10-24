import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { SalesReportCard } from "@/components/sales/sales-report-card";
import { getData } from "@/utils/api-calls";

export default async function Page() {
  const res = await getData("sales", 0);

  return (
    <Block title="previous sales">
      <CardView>
        {res.response.payload?.map((item, index) => (
          <SalesReportCard key={index} item={item} />
        ))}
      </CardView>
    </Block>
  );
}
