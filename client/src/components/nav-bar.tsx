import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Github, Linkedin } from "lucide-react";
import { ContactFormModal } from "./contact-form-modal";
import { ResumeModal } from "./resume-modal";

type NavRoute = 
  | { href: string; label: string; id?: never }
  | { id: string; label: string; href?: never };

const rightRoutes: NavRoute[] = [
  { id: "resume-modal", label: "Resume" },
  { id: "contact-modal", label: "Contact Me" }
];

export function NavBar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const handleNavItemClick = (item: NavRoute) => {
    if (item.id === "contact-modal") {
      setContactModalOpen(true);
      return true; // Prevent default navigation
    } else if (item.id === "resume-modal") {
      setResumeModalOpen(true);
      return true; // Prevent default navigation
    }
    return false; // Allow default navigation
  };

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
        
        {/* Spacer to push right items to the right */}
        <div className="flex-grow"></div>
        
        {/* Social links */}
        <div className="hidden md:flex items-center mr-4">
          <a href="https://github.com/Jomaguy" target="_blank" rel="noopener noreferrer" className="mr-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-muted/50">
              <Github className="h-5 w-5" />
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/jonathan-mahrt-guyou/" target="_blank" rel="noopener noreferrer" className="mr-4">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2 hover:bg-muted/50">
              <Linkedin className="h-5 w-5" />
            </Button>
          </a>
        </div>
        
        {/* Right Navigation */}
        <div className="hidden md:flex items-center mr-4">
          {rightRoutes.map((route) => (
            'href' in route && route.href ? (
              <Link key={route.href} href={route.href}>
                <a className={`mr-4 flex items-center justify-center h-10 px-4 rounded-full border-2 transition-colors ${
                  location === route.href 
                    ? 'text-foreground font-semibold border-primary' 
                    : 'text-foreground/60 border-muted hover:bg-muted/50'
                }`}>
                  {route.label}
                </a>
              </Link>
            ) : (
              <button
                key={'id' in route ? route.id : ''}
                onClick={() => handleNavItemClick(route)}
                className="mr-4 flex items-center justify-center h-10 px-4 rounded-full border-2 transition-colors text-foreground/60 border-muted hover:bg-muted/50"
              >
                {route.label}
              </button>
            )
          ))}
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
                <Link href="/">
                  <a
                    className={`text-2xl ${location === "/" ? 'text-foreground font-semibold' : 'text-foreground/60'}`}
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </a>
                </Link>
                
                {rightRoutes.map((route) => (
                  'href' in route && route.href ? (
                    <Link key={route.href} href={route.href}>
                      <a
                        className={`text-2xl px-4 py-2 rounded-full border-2 inline-block ${
                          location === route.href 
                            ? 'text-foreground font-semibold border-primary' 
                            : 'text-foreground/60 border-muted hover:bg-muted/50'
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {route.label}
                      </a>
                    </Link>
                  ) : (
                    <button
                      key={'id' in route ? route.id : ''}
                      className="text-2xl px-4 py-2 rounded-full border-2 inline-block text-foreground/60 border-muted hover:bg-muted/50"
                      onClick={() => {
                        handleNavItemClick(route);
                        setOpen(false);
                      }}
                    >
                      {route.label}
                    </button>
                  )
                ))}
                
                {/* Social links in mobile menu */}
                <div className="flex space-x-4 pt-4">
                  <a href="https://github.com/Jomaguy" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:bg-muted/50">
                      <Github className="h-6 w-6" />
                    </Button>
                  </a>
                  <a href="https://www.linkedin.com/in/jonathan-mahrt-guyou/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-2 hover:bg-muted/50">
                      <Linkedin className="h-6 w-6" />
                    </Button>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Contact Form Modal */}
      <ContactFormModal open={contactModalOpen} onOpenChange={setContactModalOpen} />
      
      {/* Resume Modal */}
      <ResumeModal open={resumeModalOpen} onOpenChange={setResumeModalOpen} />
    </header>
  );
}