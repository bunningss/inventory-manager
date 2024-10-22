import { Navbar } from "@/components/navbars/navbar";

export default async function LandingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
