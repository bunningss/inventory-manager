import { CartIndicator } from "@/components/cart/cart-indicator";
import { Navbar } from "@/components/navbars/navbar";
import { CartSidebar } from "@/components/sidebars/cart-sidebar";
import { getSession } from "@/utils/auth";

export default async function LandingLayout({ children }) {
  const session = await getSession();

  return (
    <div>
      <Navbar userData={session} />
      <main>{children}</main>
      <CartIndicator />
      <CartSidebar />
    </div>
  );
}
