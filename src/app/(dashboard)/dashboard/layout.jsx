import { DashboardNavbar } from "@/components/navbars/dashboard-navbar";
import { DashboardSidebar } from "@/components/sidebars/dashboard-sidebar/dashboard-sidebar";
import { getSession } from "@/utils/auth";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  return (
    <div>
      <DashboardNavbar userData={session} />
      <div className="flex gap-2">
        <DashboardSidebar />
        <main className="w-full pr-2">{children}</main>
      </div>
    </div>
  );
}
