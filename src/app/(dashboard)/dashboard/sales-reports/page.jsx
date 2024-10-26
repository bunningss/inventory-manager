import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { SalesReportCard } from "@/components/sales/sales-report-card";
import { getData } from "@/utils/api-calls";

export default async function Page({ searchParams }) {
  const res = await getData(
    `sales?from=${searchParams.from}&to=${searchParams.to}`,
    0
  );

  return (
    <Block title="previous sales">
      {/* Filter */}
      <DatePickerWithRange />
      <CardView>
        {res.response.payload?.sales?.map((item, index) => (
          <SalesReportCard key={index} item={item} />
        ))}
      </CardView>
      <span>
        Total between {new Date(searchParams.from).toDateString()} and{" "}
        {new Date(searchParams.to).toDateString()}:{" "}
        {res.response.payload?.total / 100}
      </span>
    </Block>
  );
}
