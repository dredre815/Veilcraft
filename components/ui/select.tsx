"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "border-border/70 w-full appearance-none rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] px-4 py-3 text-sm text-fg shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-enter ease-veil focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60",
          "bg-[length:12px_12px,12px_12px,100%_100%] bg-[position:calc(100%-18px)_center,calc(100%-6px)_center,0_0] bg-no-repeat [background-image:linear-gradient(45deg,transparent_50%,rgba(234,236,239,0.72)_50%),linear-gradient(135deg,rgba(234,236,239,0.72)_50%,transparent_50%),linear-gradient(to_right,rgba(234,236,239,0.32),rgba(234,236,239,0.08))]",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
