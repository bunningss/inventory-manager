import { DashboardNavbar } from "@/components/navbars/dashboard-navbar";
import { DashboardSidebar } from "@/components/sidebars/dashboard-sidebar/dashboard-sidebar";

export default async function DashboardLayout({ children }) {
  return (
    <div>
      <DashboardNavbar />
      <div className="flex gap-4">
        <DashboardSidebar />
        <main className="w-full pr-2">{children}</main>
      </div>
    </div>
  );
}
