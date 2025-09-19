"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { type CardRead } from "@/lib/schema";
import { type SpreadPosition } from "@/lib/spreads";
import { cn } from "@/lib/utils";

const TRAY_EASE = [0.2, 0.9, 0.2, 1] as const;

interface EvidenceTrayProps {
  open: boolean;
  card: CardRead | null;
  position: SpreadPosition | undefined;
  onClose: () => void;
}

export function EvidenceTray({ open, card, position, onClose }: EvidenceTrayProps) {
  const [copied, setCopied] = useState(false);

  const quotes = useMemo(() => {
    if (!card?.evidence?.length) {
      return [] as string[];
    }
    const primaryEvidence = card.evidence[0];
    return primaryEvidence?.quotes ?? [];
  }, [card]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleCopy = useCallback(async () => {
    if (!quotes.length) return;

    try {
      await navigator.clipboard.writeText(quotes.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Failed to copy evidence", error);
    }
  }, [quotes]);

  return (
    <AnimatePresence>
      {open && card ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: TRAY_EASE }}
          className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 sm:items-center"
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="关闭证据面板"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.28, ease: TRAY_EASE }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-[28px] border border-border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-6 shadow-veil backdrop-blur",
            )}
          >
            <header className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Evidence
                </p>
                <h3 className="text-lg font-semibold text-fg">
                  {card.name}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    {position?.title ?? "牌位"}
                  </span>
                </h3>
              </div>
              <Button variant="soft" size="icon" aria-label="关闭证据面板" onClick={onClose}>
                <X className="h-4 w-4" aria-hidden />
              </Button>
            </header>
            <div className="mt-4 space-y-4">
              {quotes.length ? (
                quotes.map((quote, index) => (
                  <blockquote
                    key={index}
                    className="border-border/50 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-4 text-sm leading-relaxed text-fg"
                  >
                    “{quote}”
                  </blockquote>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">暂无可展示的引用。</p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                <p>引用自位置语义与卡牌关键词。</p>
              </div>
              <Button variant="soft" size="sm" onClick={handleCopy} disabled={!quotes.length}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" aria-hidden />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" aria-hidden />
                    复制引用
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
