"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navItems = [
  { href: "/read", label: "体验占卜" },
  { href: "/cards", label: "塔罗牌库", disabled: true },
  { href: "/about", label: "关于 Veilcraft", disabled: true },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ background: "color-mix(in srgb, var(--bg) 82%, transparent)" }}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-aurora text-sm font-bold text-bg shadow-veil">
            VC
          </span>
          <span className="hidden flex-col text-left leading-tight sm:flex">
            <span className="text-sm">Veilcraft｜幕术</span>
            <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              揭幕不确定 · 打磨可行动
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => {
            if (item.disabled) {
              return (
                <span
                  key={item.href}
                  aria-disabled
                  className="cursor-not-allowed text-muted-foreground opacity-60"
                >
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors duration-enter ease-veil",
                  pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="md:hidden">
            <Link href="/read">
              立即揭幕
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/read">
              立即揭幕
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
