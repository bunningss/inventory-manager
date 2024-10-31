import { Suspense } from "react";
import { Block } from "@/components/block";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { SalesReportsFilters } from "@/components/sales/sales-reports-filters";
import { SalesReportsTable } from "@/components/sales/sales-reports-table";
import { getData } from "@/utils/api-calls";

async function fetchReportsData(searchParams) {
  const { from, to, sortBy, searchKey, all } = searchParams;
  const queryParams = new URLSearchParams({
    ...(from && { from }),
    ...(to && { to }),
    ...(sortBy && { sortBy }),
    ...(searchKey && { searchKey }),
    ...(all && { all }),
  }).toString();

  return getData(`sales?${queryParams}`, 0);
}

async function Reports({ searchParams, from, to }) {
  const res = await fetchReportsData(searchParams);
  if (res.response.payload?.sales?.length > 0) {
    return (
      <SalesReportsTable data={res.response.payload} from={from} to={to} />
    );
  }
  return (
    <Empty
      message="No data found. / কোন তথ্য পাওয়া যায়নি"
      className="bg-background mt-4"
    />
  );
}

export default async function Page({ searchParams }) {
  const from = new Date(searchParams.from).toDateString();
  const to = new Date(searchParams.to).toDateString();

  const headerContent = (
    <span className="block text-muted-foreground mt-4">
      From <span className="text-primary">{from}</span> to{" "}
      <span className="text-primary">{to}</span>
    </span>
  );

  return (
    <Block title="previous sales" headerContent={headerContent}>
      <SalesReportsFilters />
      <Suspense fallback={<Loading className="mt-4 py-8" />}>
        <Reports from={from} to={to} searchParams={searchParams} />
      </Suspense>
    </Block>
  );
}
