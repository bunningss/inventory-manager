import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { SalesReportsFilters } from "@/components/sales-reports-filters";
import { SalesReportCard } from "@/components/sales/sales-report-card";
import { SalesResportTable } from "@/components/sales/sales-report-table";
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
        <CardView className="mt-4">
          {res.response.payload?.sales?.map((item, index) => (
            <SalesReportCard key={item._id || index} item={item} />
          ))}
        </CardView>
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
      :{" "}
      <b className="text-primary">
        {/* <em>৳{res.response.payload?.total / 100}</em> */}
      </b>
    </span>
  );

  return (
    <Block title="previous sales" headerContent={headerContent}>
      <SalesReportsFilters />
      {/* <SalesResportTable data={res.response.payload?.sales} /> */}
      <Suspense fallback={<Loading />}>
        <Reports searchParams={searchParams} />
      </Suspense>
    </Block>
  );
}
