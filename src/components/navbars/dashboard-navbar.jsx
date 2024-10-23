import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";

export function DashboardNavbar() {
  return (
    <nav className="bg-background border border-input sticky top-0 p-2 mb-2 z-10 shadow-regular">
      <div className="flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
    </nav>
  );
}
