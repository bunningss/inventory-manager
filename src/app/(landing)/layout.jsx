import { Navbar } from "@/components/navbars/navbar";

export default async function LandingLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
