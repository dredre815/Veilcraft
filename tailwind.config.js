/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./lib/**/*.{ts,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        surface: "var(--surface)",
        border: "var(--border)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        primary: "var(--primary)",
        "primary-accent": "var(--primary-accent)",
        success: "var(--success)",
        warn: "var(--warn)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        veil: "var(--shadow-veil)",
        glass: "var(--shadow-glass)",
      },
      borderRadius: {
        xl2: "var(--radius-xl2)",
      },
      backgroundImage: {
        aurora: "var(--gradient-aurora)",
      },
      transitionTimingFunction: {
        veil: "var(--easing-standard)",
      },
      transitionDuration: {
        enter: "var(--duration-enter)",
        exit: "var(--duration-exit)",
      },
      keyframes: {
        "veil-pulse": {
          "0%, 100%": { opacity: 0.25, transform: "scale(0.98)" },
          "50%": { opacity: 0.6, transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "veil-pulse": "veil-pulse 4s var(--easing-standard) infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
