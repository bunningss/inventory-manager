import Link from "next/link";
import { Block } from "@/components/block";
import { CardView } from "@/components/card-view";
import { OrderCard } from "@/components/cards/order-card";
import { ProductCard } from "@/components/cards/product-card";
import { Empty } from "@/components/empty";
import { Loading } from "@/components/loading";
import { TotalCard } from "@/components/total-card";
import { getData } from "@/utils/api-calls";
import { Suspense } from "react";

async function DashboardData() {
  const res = await getData("dashboard-data", 0);

  const summaryData = [
    {
      dataKey: "total sales / মোট বিক্রয়",
      dataValue: `৳ ${
        (res.response.payload?.totalEarnings +
          res.response.payload?.totalSales) /
        100
      }`,
      icon: "total",
    },
    {
      dataKey: "total expense / মোট খরচ",
      dataValue: `৳ ${res.response.payload?.totalExpenses / 100}`,
      icon: "total",
    },
    {
      dataKey: "total revenue / মোট লাভ",
      dataValue: `৳ ${
        (res.response.payload?.totalEarnings +
          res.response.payload?.totalSales -
          res.response.payload?.totalExpenses) /
        100
      }`,
      icon: "total",
    },
  ];

  const CurrentMonthData = [
    {
      dataKey: "total sales / মোট বিক্রয়",
      dataValue: `৳ ${
        (res.response.payload?.currentMonthTotalEarnings +
          res.response.payload?.currentMonthTotalSales) /
        100
      }`,
      icon: "total",
    },
    {
      dataKey: "total orders / মোট অর্ডার",
      dataValue: `${res.response.payload?.currentMonthTotalOrders}`,
      icon: "total",
    },
    {
      dataKey: "completed orders / সম্পূর্ণ",
      dataValue: `${res.response.payload?.currentMonthCompletedOrders}`,
      icon: "total",
    },
    {
      dataKey: "cancelled orders / বাতিল",
      dataValue: `${res.response.payload?.currentMonthCancelledOrders}`,
      icon: "total",
    },
    {
      dataKey: "total expense / মোট খরচ",
      dataValue: `৳ ${res.response.payload?.currentMonthTotalExpenses / 100}`,
      icon: "total",
    },
    {
      dataKey: "revenue / আয়",
      dataValue: `৳ ${
        (res.response.payload?.currentMonthTotalEarnings +
          res.response.payload?.currentMonthTotalSales -
          res.response.payload?.currentMonthTotalExpenses) /
        100
      }`,
      icon: "total",
    },
  ];

  const orderData = [
    {
      dataKey: "pending orders",
      dataValue: res.response.payload?.pendingOrders,
      icon: "pending",
    },
    {
      dataKey: "processing orders",
      dataValue: res.response.payload?.processingOrders,
      icon: "processing",
    },
    {
      dataKey: "completed orders",
      dataValue: res.response.payload?.completedOrders,
      icon: "verified",
    },
    {
      dataKey: "cancelled orders",
      dataValue: res.response.payload?.cancelledOrders,
      icon: "cancel",
    },
  ];

  const HeaderContent = ({ url }) => {
    return (
      <Link
        href={url ? url : ""}
        className="capitalize font-bold text-primary underline decoration-wavy"
      >
        view all
      </Link>
    );
  };

  return (
    <div className="grid gap-8">
      {/* Total Summary */}
      <Block title="summary" headerContent={<HeaderContent />}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
          {summaryData.map((data, index) => (
            <TotalCard key={index} data={data} />
          ))}
        </div>
      </Block>
      {/* Current Month */}
      <Block
        title={`${new Date().toLocaleString("default", {
          month: "long",
        })} ${new Date().getFullYear()}`}
        headerContent={<HeaderContent />}
      >
        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
          {CurrentMonthData.map((data, index) => (
            <TotalCard key={index} data={data} />
          ))}
        </div>
      </Block>
      {/* Order Status */}
      <Block title="order summary">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-4">
          {orderData.map((data, index) => (
            <TotalCard key={index} data={data} />
          ))}
        </div>
      </Block>
      {/* Recent Orders */}
      <Block
        title="recent orders"
        headerContent={<HeaderContent url="/dashboard/orders" />}
      >
        <CardView>
          {res.response.payload.recentOrders?.map((order, index) => (
            <OrderCard key={index} order={order} />
          ))}
        </CardView>
        {res.response.payload.recentOrders?.length === 0 && (
          <Empty message="looks like there's no data to display." />
        )}
      </Block>
      {/* Popular Products */}
      <Block
        title="Most sold products"
        headerContent={
          <HeaderContent
            url={{
              pathname: "/dashboard/products",
              query: { sortBySold: "true" },
            }}
          />
        }
      >
        <CardView>
          {res.response.payload.products?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </CardView>
        {res.response.payload.products?.length === 0 && (
          <Empty message="looks like there's no data to display." />
        )}
      </Block>
      {/* Low in stock */}
      <Block
        title="Low in stock"
        headerContent={
          <HeaderContent
            url={{
              pathname: "/dashboard/products",
              query: { sortByStock: "true" },
            }}
          />
        }
      >
        <CardView>
          {res.response.payload.lowStock?.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </CardView>
        {res.response.payload.lowStock?.length === 0 && (
          <Empty message="looks like there's no data to display." />
        )}
      </Block>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardData />
    </Suspense>
  );
}
