import { Suspense } from "react";
import { Block } from "@/components/block";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { SalesReportsFilters } from "@/components/filters/sales-reports-filters";
import { getData } from "@/utils/api-calls";
import { SaleReportsTable } from "@/components/tables/sale-reports-table";

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

async function Reports({ searchParams }) {
  const { response } = await fetchReportsData(searchParams);

  if (response.payload?.sales?.length > 0) {
    return <SaleReportsTable reports={response?.payload?.sales} />;
  }

  return (
    <Empty message="No data found. / কোন তথ্য পাওয়া যায়নি" className="mt-4" />
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
    <div className="space-y-4">
      <Block title="previous sales" headerContent={headerContent} />
      <SalesReportsFilters />
      <Suspense fallback={<Loading className="mt-4 py-8" />}>
        <Reports searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
