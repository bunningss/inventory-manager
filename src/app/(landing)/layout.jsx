import { CartIndicator } from "@/components/cart/cart-indicator";
import { Navbar } from "@/components/navbars/navbar";
import { CartSidebar } from "@/components/sidebars/cart-sidebar";

export default async function LandingLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <CartIndicator />
      <CartSidebar />
    </div>
  );
}
