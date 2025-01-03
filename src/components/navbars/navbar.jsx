"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Container } from "../container";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { User } from "../user";
import { useWishlist } from "@/hooks/use-wishlist";
import { useMenuSidebar } from "@/hooks/controllers";

export const Navbar = ({ userData }) => {
  const wishlist = useWishlist();
  const menuSidebar = useMenuSidebar();

  return (
    <nav className="shadow-regular md:shadow-none md:border-b border-muted sticky top-0 z-20 bg-background h-16">
      <Container>
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <ThemeToggle />
            </div>

            <Button
              icon="menu"
              className="md:hidden"
              onClick={menuSidebar.onOpen}
            >
              menu
            </Button>
            <div className="hidden md:flex gap-4 items-center">
              <Link href="/wishlist" passHref>
                <Button icon="heart" variant="outline">
                  <span>{wishlist?.wishlistItems?.length}</span>
                </Button>
              </Link>
              {userData?.error && (
                <Link href="/sign-in">
                  <Button>Login</Button>
                </Link>
              )}
              {!userData?.error && <User userData={userData} />}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};
