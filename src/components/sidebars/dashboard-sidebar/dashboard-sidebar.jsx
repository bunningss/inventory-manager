import { Container } from "@/components/container";
import { DashboardSidebarItem } from "./dashboard-sidebar-item";

const sidebarItems = [
  {
    label: "dashboard",
    href: "/dashboard",
    icon: "dashboard",
    children: [],
  },
  {
    label: "product",
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
    label: "category",
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
    label: "expenses",
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
    label: "orders",
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
    label: "users",
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
    label: "coupon code",
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
    <aside className="shadow-md w-[300px] h-[calc(theme(height.screen)-56px)] rounded-md shadow-active overflow-y-auto sticky top-[56px]">
      <div className="flex flex-col gap-2 p-2">
        {sidebarItems?.map((item, index) => (
          <DashboardSidebarItem key={index} item={item} />
        ))}
      </div>
    </aside>
  );
}
