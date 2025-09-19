"use client";

import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

export function VeilBackground({ className }: { className?: string }) {
  const x = useMotionValue(typeof window === "undefined" ? 0 : window.innerWidth / 2);
  const y = useMotionValue(typeof window === "undefined" ? 0 : window.innerHeight / 2);

  const springX = useSpring(x, { stiffness: 80, damping: 30, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 80, damping: 30, mass: 0.8 });

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [x, y]);

  useEffect(() => {
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight / 2);
  }, [x, y]);

  const gradient = useMotionTemplate`radial-gradient(600px at ${springX}px ${springY}px, rgba(124, 92, 255, 0.32), transparent 72%)`;

  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 opacity-70 blur-3xl", className)}
      style={{ backgroundImage: gradient }}
    />
  );
}
