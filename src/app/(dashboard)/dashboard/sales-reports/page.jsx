import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { SalesReportsFilters } from "@/components/sales-reports-filters";
import { SalesReportCard } from "@/components/sales/sales-report-card";
import { getData } from "@/utils/api-calls";

export default async function Page({ searchParams }) {
  const res = await getData(
    `sales?from=${searchParams.from}&to=${searchParams.to}`,
    0
  );

  return (
    <Block title="previous sales">
      <SalesReportsFilters />
      <CardView>
        {res.response.payload?.sales?.map((item, index) => (
          <SalesReportCard key={index} item={item} />
        ))}
      </CardView>
      <span className="block text-muted-foreground mt-4">
        Total between{" "}
        <span className="text-primary">
          {new Date(searchParams.from).toDateString()}
        </span>{" "}
        and{" "}
        <span className="text-primary">
          {new Date(searchParams.to).toDateString()}
        </span>
        :{" "}
        <b className="text-primary">
          <em>৳{res.response.payload?.total / 100}</em>
        </b>
      </span>
    </Block>
  );
}
