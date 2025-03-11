import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { NavBar } from "@/components/nav-bar";
import { ChatInterface } from "@/components/chat-interface";
import { LightThemeProvider } from "@/components/light-theme-provider";
import { WelcomeMessage } from "@/components/welcome-message";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [welcomeShown, setWelcomeShown] = useState(false);
  
  return (
    <LightThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <NavBar />
          <main className="flex-1 w-full">
            <Router />
          </main>
          {welcomeShown ? <ChatInterface /> : null}
          
          {!welcomeShown && (
            <WelcomeMessage onContinue={() => setWelcomeShown(true)} />
          )}
        </div>
        <Toaster />
      </QueryClientProvider>
    </LightThemeProvider>
  );
}

export default App;