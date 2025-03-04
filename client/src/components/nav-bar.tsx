import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const routes = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" }
];

export function NavBar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-24 items-center px-8">
        {/* Logo */}
        <div className="flex-none mr-12">
          <Link href="/">
            <a className="flex items-center">
              <span className="text-3xl font-bold">Portfolio</span>
            </a>
          </Link>
        </div>
        
        {/* Navigation - explicitly positioned to start from the left */}
        <div className="hidden md:flex flex-row items-center">
          {routes.map((route) => (
            <Link key={route.href} href={route.href}>
              <a className={`mr-12 text-xl transition-colors hover:text-foreground/80 ${
                location === route.href ? 'text-foreground font-semibold' : 'text-foreground/60'
              }`}>
                {route.label}
              </a>
            </Link>
          ))}
        </div>
        
        {/* Spacer to push theme toggle to the right */}
        <div className="flex-grow"></div>
        
        {/* Theme toggle - explicitly positioned on the far right */}
        <div className="flex-none">
          <ThemeToggle size="lg" />
        </div>
        
        {/* Mobile menu button - only visible on small screens */}
        <div className="md:hidden ml-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Menu className="h-8 w-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-8 mt-12">
                {routes.map((route) => (
                  <Link key={route.href} href={route.href}>
                    <a
                      className={`text-2xl ${location === route.href ? 'text-foreground font-semibold' : 'text-foreground/60'}`}
                      onClick={() => setOpen(false)}
                    >
                      {route.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}