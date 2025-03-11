import { useEffect } from "react";

interface LightThemeProviderProps {
  children: React.ReactNode;
}

export function LightThemeProvider({ children }: LightThemeProviderProps) {
  useEffect(() => {
    // Set the theme to light on mount
    const doc = window.document.documentElement;
    doc.classList.remove("dark", "system");
    doc.classList.add("light");
    
    // Store the preference in localStorage
    localStorage.setItem("theme", "light");
  }, []);

  return <>{children}</>;
} 