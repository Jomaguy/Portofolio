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
      <div className="flex h-32 items-center px-10">
        {/* Logo */}
        <div className="flex-none mr-16">
          <Link href="/">
            <span className="text-5xl font-bold flex items-center">Portfolio</span>
          </Link>
        </div>
        
        {/* Spacer to push right items to the right */}
        <div className="flex-grow"></div>
        
        {/* Social links */}
        <div className="hidden md:flex items-center mr-8">
          <a href="https://github.com/Jomaguy" target="_blank" rel="noopener noreferrer" className="mr-4">
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 hover:bg-muted/50">
              <Github className="h-8 w-8" />
            </Button>
          </a>
          <a href="https://www.linkedin.com/in/jonathan-mahrt-guyou/" target="_blank" rel="noopener noreferrer" className="mr-8">
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 hover:bg-muted/50">
              <Linkedin className="h-8 w-8" />
            </Button>
          </a>
        </div>
        
        {/* Right Navigation */}
        <div className="hidden md:flex items-center mr-4">
          {rightRoutes.map((route) => (
            'href' in route && route.href ? (
              <Link key={route.href} href={route.href}>
                <span className={`mr-6 flex items-center justify-center h-16 px-8 rounded-full border-2 transition-colors text-xl ${
                  location === route.href 
                    ? 'text-foreground font-semibold border-primary' 
                    : 'text-foreground/60 border-muted hover:bg-muted/50'
                }`}>
                  {route.label}
                </span>
              </Link>
            ) : (
              <button
                key={'id' in route ? route.id : ''}
                onClick={() => handleNavItemClick(route)}
                className="mr-6 flex items-center justify-center h-16 px-8 rounded-full border-2 transition-colors text-foreground/60 border-muted hover:bg-muted/50 text-xl"
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
              <Button variant="ghost" size="icon" className="h-16 w-16">
                <Menu className="h-10 w-10" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[350px]">
              <nav className="flex flex-col space-y-10 mt-16">
                <Link href="/">
                  <span
                    className={`text-4xl ${location === "/" ? 'text-foreground font-semibold' : 'text-foreground/60'}`}
                    onClick={() => setOpen(false)}
                  >
                    Home
                  </span>
                </Link>
                
                {rightRoutes.map((route) => (
                  'href' in route && route.href ? (
                    <Link key={route.href} href={route.href}>
                      <span
                        className={`text-3xl px-6 py-4 rounded-full border-2 inline-block ${
                          location === route.href 
                            ? 'text-foreground font-semibold border-primary' 
                            : 'text-foreground/60 border-muted hover:bg-muted/50'
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {route.label}
                      </span>
                    </Link>
                  ) : (
                    <button
                      key={'id' in route ? route.id : ''}
                      className="text-3xl px-6 py-4 rounded-full border-2 inline-block text-foreground/60 border-muted hover:bg-muted/50"
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
                <div className="flex space-x-6 pt-6">
                  <a href="https://github.com/Jomaguy" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 hover:bg-muted/50">
                      <Github className="h-9 w-9" />
                    </Button>
                  </a>
                  <a href="https://www.linkedin.com/in/jonathan-mahrt-guyou/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-16 w-16 rounded-full border-2 hover:bg-muted/50">
                      <Linkedin className="h-9 w-9" />
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