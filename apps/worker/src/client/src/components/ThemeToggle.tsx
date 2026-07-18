import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = (resolvedTheme ?? "light") === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed right-4 bottom-4 z-50 flex size-10 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-muted"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun className="size-5 text-foreground" />
      ) : (
        <Moon className="size-5 text-foreground" />
      )}
    </button>
  );
}
