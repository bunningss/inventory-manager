import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { SalesReportsFilters } from "@/components/sales-reports-filters";
import { SalesCards } from "@/components/sales/sales-cards";
import { SalesReportCard } from "@/components/sales/sales-report-card";
import { SalesResportTable } from "@/components/sales/sales-report-table";
import { getData } from "@/utils/api-calls";

export default async function Page({ searchParams }) {
  const res = await getData(
    `sales?from=${searchParams.from}&to=${searchParams.to}`,
    0
  );

  const headerContent = (
    <span className="block text-muted-foreground mt-4">
      From{" "}
      <span className="text-primary">
        {new Date(searchParams.from).toDateString()}
      </span>{" "}
      to{" "}
      <span className="text-primary">
        {new Date(searchParams.to).toDateString()}
      </span>
      :{" "}
      <b className="text-primary">
        <em>৳{res.response.payload?.total / 100}</em>
      </b>
    </span>
  );

  return (
    <Block title="previous sales" headerContent={headerContent}>
      <SalesReportsFilters />
      {/* <SalesResportTable data={res.response.payload?.sales} /> */}
      <SalesCards data={res.response.payload?.sales} />
    </Block>
  );
}
