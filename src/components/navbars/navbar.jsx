"use client";
import { Button } from "../ui/button";
import { Container } from "../container";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";

export const Navbar = () => {
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
              <Button icon="heart" variant="outline">
                <span>0</span>
              </Button>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
};
