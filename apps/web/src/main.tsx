import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@acme/ui/components/sonner";
import { TooltipProvider } from "@acme/ui/components/tooltip";
import { ThemeToggle } from "./components/ThemeToggle";
import "./index.css";
import { AppRouterProvider } from "./app-router-provider";
import { QueryProvider } from "./lib/query-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system">
      <TooltipProvider>
        <QueryProvider>
          <AppRouterProvider />
        </QueryProvider>
        <ThemeToggle />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
