"use client";
import { Button } from "../ui/button";
import { Container } from "../container";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { User } from "../user";
import { useWishlist } from "@/hooks/use-wishlist";
import Link from "next/link";

export const Navbar = () => {
  const wishlist = useWishlist();

  return (
    <nav className="shadow-regular md:shadow-none md:border-b border-muted sticky top-0 z-20 bg-background h-16">
      <Container>
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              icon="search"
              className="rounded-full"
            >
              <span className="sr-only">search</span>
            </Button>

            <Button icon="menu" className="md:hidden">
              menu
            </Button>
            <div className="hidden md:flex gap-4 items-center">
              <Link href="/wishlist" passHref>
                <Button icon="heart" variant="outline">
                  <span>{wishlist.wishlistItems.length}</span>
                </Button>
              </Link>

              <User />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};
