import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeScript } from "@/components/theme/theme-script";
import { SiteHeader } from "@/components/shell/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSans = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Veilcraft｜幕术",
  description:
    "Deterministic tarot readings with couture-grade UI and evidence-led AI interpretation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body
        className={cn(
          "min-h-screen bg-bg text-fg antialiased",
          geistSans.variable,
          geistMono.variable,
          notoSans.variable,
        )}
        data-theme="dark"
      >
        <ThemeProvider defaultTheme="dark">
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <footer
              className="border-t border-border py-10 text-sm text-muted-foreground"
              style={{
                background: "color-mix(in srgb, var(--bg) 85%, transparent)",
              }}
            >
              <div className="container flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Veilcraft｜幕术 · Crafted for actionable clarity
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span>© {new Date().getFullYear()} Veilcraft Studio</span>
                  <a className="hover:text-primary" href="/legal/privacy">
                    隐私声明
                  </a>
                  <a className="hover:text-primary" href="/legal/terms">
                    使用条款
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
