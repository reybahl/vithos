import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { ThemeToggle } from "./components/theme-toggle";
import "./index.css";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system">
      <TooltipProvider>
        <RouterProvider router={router} />
        <ThemeToggle />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);
