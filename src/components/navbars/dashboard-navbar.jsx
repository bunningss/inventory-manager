import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { User } from "../user";

export function DashboardNavbar({ userData }) {
  return (
    <nav className="bg-background border-b sticky top-0 mb-2 z-10 shadow-regular h-14 flex items-center justify-center p-2">
      <div className="w-full flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2">
          <User userData={userData} />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
