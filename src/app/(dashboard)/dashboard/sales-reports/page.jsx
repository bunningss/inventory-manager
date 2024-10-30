import { Block } from "@/components/block";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { SalesReportsFilters } from "@/components/sales/sales-reports-filters";
import { SalesReportsTable } from "@/components/sales/sales-reports-table";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function Reports({ searchParams }) {
  const { from, to, sortBy, searchKey } = searchParams;

  // prepare query string
  const queryParams = new URLSearchParams({
    ...(from && { from }),
    ...(to && { to }),
    ...(sortBy && { sortBy }),
    ...(searchKey && { searchKey }),
  }).toString();

  // Fetch data with query parameters
  const res = await getData(`sales?${queryParams}`, 0);

  return (
    <>
      {res.response.payload?.sales?.length > 0 && (
        <SalesReportsTable
          data={res.response.payload}
          from={new Date(searchParams.from).toDateString()}
          to={new Date(searchParams.to).toDateString()}
        />
      )}

      {res.response.payload?.sales?.length <= 0 && (
        <Empty
          message="No data found. / কোন তথ্য পাওয়া যায়নি"
          className="bg-background mt-4"
        />
      )}
    </>
  );
}

export default async function Page({ searchParams }) {
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
    </span>
  );

  return (
    <Block title="previous sales" headerContent={headerContent}>
      <SalesReportsFilters />
      <Suspense fallback={<Loading className="mt-4 py-8" />}>
        <Reports searchParams={searchParams} />
      </Suspense>
    </Block>
  );
}
