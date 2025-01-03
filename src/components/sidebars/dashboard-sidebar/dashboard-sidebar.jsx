import { formatDate } from "@/utils/helpers";
import { DashboardSidebarItem } from "./dashboard-sidebar-item";

const sidebarItems = [
  {
    label: "dashboard / ড্যাশবোর্ড",
    href: "/dashboard",
    icon: "dashboard",
    children: [],
  },
  {
    label: "new sale / বিক্রি",
    href: "/dashboard/sales",
    icon: "sales",
    children: [],
  },
  {
    label: "returns / ফেরত",
    href: "/dashboard/returns",
    icon: "returns",
    children: [],
  },
  {
    label: "sales reports / বিক্রি রিপোর্ট",
    href: `/dashboard/sales/sales-reports?from=${formatDate(
      new Date(Date.now())
    )}&to=${formatDate(new Date(Date.now()))}`,
    icon: "reports",
    children: [],
  },
  {
    label: "product / পণ্য",
    href: "",
    icon: "product",
    children: [
      {
        label: "view products",
        href: "products",
        icon: "",
      },
      {
        label: "add product",
        href: "products/add",
        icon: "",
      },
    ],
  },
  {
    label: "category / ক্যাটাগরি",
    href: "",
    icon: "category",
    children: [
      {
        label: "view categories",
        href: "categories",
        icon: "",
      },
      {
        label: "view sub categories",
        href: "categories/sub-categories",
        icon: "",
      },
      {
        label: "add category",
        href: "categories/add",
        icon: "",
      },
      {
        label: "add sub category",
        href: "categories/sub-categories/add",
        icon: "",
      },
    ],
  },
  {
    label: "expenses / খরচ",
    href: "",
    icon: "expense",
    children: [
      {
        label: "view expenses",
        href: "expenses",
        icon: "",
      },
      {
        label: "add expense",
        href: "expenses/add",
        icon: "",
      },
    ],
  },
  {
    label: "orders / অর্ডার",
    href: "",
    icon: "order",
    children: [
      {
        label: "view orders",
        href: "orders",
        icon: "",
      },
      {
        label: "create order",
        href: "orders/add",
        icon: "",
      },
    ],
  },
  {
    label: "users / ব্যবহারকারী",
    href: "",
    icon: "user",
    children: [
      {
        label: "view users",
        href: "users",
        icon: "",
      },
      {
        label: "add user",
        href: "users/add",
        icon: "",
      },
    ],
  },
  {
    label: "coupon code / কুপন কোড",
    href: "",
    icon: "coupon",
    children: [
      {
        label: "view coupons",
        href: "coupons",
        icon: "",
      },
      {
        label: "add coupon",
        href: "coupons/add",
        icon: "",
      },
    ],
  },
];

export function DashboardSidebar() {
  return (
    <aside className="min-w-[300px] h-[calc(theme(height.screen)-70px)] border border-input rounded-md shadow-active overflow-y-auto sticky top-[64px]">
      <div className="flex flex-col gap-2 p-2">
        {sidebarItems?.map((item, index) => (
          <DashboardSidebarItem key={index} item={item} />
        ))}
      </div>
    </aside>
  );
}
