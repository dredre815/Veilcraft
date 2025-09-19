"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  mounted: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "veilcraft:theme";

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Theme storage unavailable", error);
      }
    }
    const initial =
      stored === "light" || stored === "dark"
        ? (stored as Theme)
        : prefersLight.matches
          ? "light"
          : defaultTheme;
    setThemeState(initial);
    applyTheme(initial);
    setMounted(true);

    const handleChange = (event: MediaQueryListEvent) => {
      let persisted: string | null = null;
      try {
        persisted = window.localStorage.getItem(STORAGE_KEY);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Theme storage unavailable", error);
        }
      }

      if (!persisted) {
        const nextTheme = event.matches ? "light" : "dark";
        setThemeState(nextTheme);
        applyTheme(nextTheme);
      }
    };

    if (typeof prefersLight.addEventListener === "function") {
      prefersLight.addEventListener("change", handleChange);
      return () => prefersLight.removeEventListener("change", handleChange);
    }

    prefersLight.addListener(handleChange);
    return () => prefersLight.removeListener(handleChange);
  }, [defaultTheme]);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Theme persistence failed", error);
      }
    }
  }, [theme, mounted]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme: theme,
      mounted,
      setTheme: (nextTheme) => setThemeState(nextTheme),
      toggleTheme: () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme, mounted],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  document.body?.setAttribute("data-theme", theme);
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
