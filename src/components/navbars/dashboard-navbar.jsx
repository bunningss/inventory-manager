import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { User } from "../user";

export function DashboardNavbar({ userData }) {
  return (
    <nav className="bg-background border-b border-input sticky top-0 p-2 mb-2 z-10 shadow-regular">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="space-x-4">
          <User userData={userData} />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
