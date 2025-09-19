"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "切换到亮色主题" : "切换到暗色主题";

  return (
    <Button
      type="button"
      variant="soft"
      size="icon"
      onClick={toggleTheme}
      aria-label={label}
      className={cn("relative overflow-hidden", className)}
      disabled={!mounted}
    >
      <Sun
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 ease-veil",
          isDark ? "rotate-12 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 ease-veil",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-12 scale-0 opacity-0",
        )}
      />
    </Button>
  );
}
