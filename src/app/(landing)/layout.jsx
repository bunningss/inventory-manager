import { CartIndicator } from "@/components/cart/cart-indicator";
import { Navbar } from "@/components/navbars/navbar";

export default async function LandingLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <CartIndicator />
    </div>
  );
}
