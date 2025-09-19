"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Link2, Loader2, Share2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DrawnCard } from "@/lib/draw";
import type { Reading } from "@/lib/schema";
import { cn } from "@/lib/utils";

import type { QuestionContext } from "../store/use-reading-store";

const SHEET_EASE = [0.2, 0.9, 0.2, 1] as const;

interface ShareSheetProps {
  question: QuestionContext;
  spreadId: string;
  seed: string;
  cards: readonly DrawnCard[];
  reading: Reading;
}

interface ShareResponse {
  id: string;
  shareUrl: string | null;
  relativeUrl: string;
  ogImageUrl: string | null;
  relativeOgImageUrl: string;
  createdAt: number;
  seed: string;
  spreadId: string;
}

type ShareState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ShareResponse }
  | { status: "error"; message: string };

type CopyState = "idle" | "copied" | "error";

export function ShareSheet({ question, spreadId, seed, cards, reading }: ShareSheetProps) {
  const [open, setOpen] = useState(false);
  const [shareState, setShareState] = useState<ShareState>({ status: "idle" });
  const [linkCopyState, setLinkCopyState] = useState<CopyState>("idle");
  const [ogCopyState, setOgCopyState] = useState<CopyState>("idle");
  const lastShareRef = useRef<{ seed: string; response: ShareResponse } | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const sharePayload = useMemo(
    () => ({
      seed,
      spreadId,
      question: {
        text: question.question,
        category: question.category,
        tone: question.tone,
        language: question.language,
      },
      cards: cards.map((card) => ({
        cardId: card.card.id,
        positionId: card.positionId,
        orientation: card.orientation,
      })),
      reading,
    }),
    [cards, question, reading, seed, spreadId],
  );

  const resolvedShareUrl = useMemo(() => {
    if (shareState.status !== "success") {
      return "";
    }
    if (shareState.data.shareUrl) {
      return shareState.data.shareUrl;
    }
    if (typeof window !== "undefined") {
      return new URL(shareState.data.relativeUrl, window.location.origin).toString();
    }
    return shareState.data.relativeUrl;
  }, [shareState]);

  const resolvedOgImageUrl = useMemo(() => {
    if (shareState.status !== "success") {
      return "";
    }
    if (shareState.data.ogImageUrl) {
      return shareState.data.ogImageUrl;
    }
    if (typeof window !== "undefined") {
      return new URL(shareState.data.relativeOgImageUrl, window.location.origin).toString();
    }
    return shareState.data.relativeOgImageUrl;
  }, [shareState]);

  const handleCreateShare = useCallback(async () => {
    if (!sharePayload) {
      return;
    }

    if (lastShareRef.current?.seed === seed) {
      setShareState({ status: "success", data: lastShareRef.current.response });
      return;
    }

    setShareState({ status: "loading" });
    setLinkCopyState("idle");
    setOgCopyState("idle");

    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sharePayload),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const message = errorJson?.message ?? "生成分享链接失败，请稍后重试。";
        throw new Error(message);
      }

      const json = (await response.json()) as ShareResponse;
      lastShareRef.current = { seed, response: json };
      setShareState({ status: "success", data: json });
    } catch (error) {
      console.error("Failed to create share record", error);
      const message = error instanceof Error ? error.message : "生成分享链接失败，请稍后重试。";
      setShareState({ status: "error", message });
    }
  }, [sharePayload, seed]);

  const handleCopyShareLink = useCallback(async () => {
    if (!resolvedShareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(resolvedShareUrl);
      setLinkCopyState("copied");
      window.setTimeout(() => setLinkCopyState("idle"), 2500);
    } catch (error) {
      console.error("Failed to copy share link", error);
      setLinkCopyState("error");
      window.setTimeout(() => setLinkCopyState("idle"), 2500);
    }
  }, [resolvedShareUrl]);

  const handleCopyOgImage = useCallback(async () => {
    if (!resolvedOgImageUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(resolvedOgImageUrl);
      setOgCopyState("copied");
      window.setTimeout(() => setOgCopyState("idle"), 2500);
    } catch (error) {
      console.error("Failed to copy share og image link", error);
      setOgCopyState("error");
      window.setTimeout(() => setOgCopyState("idle"), 2500);
    }
  }, [resolvedOgImageUrl]);

  useEffect(() => {
    if (!open) {
      return;
    }
    setLinkCopyState("idle");
    setOgCopyState("idle");
    if (shareState.status === "idle") {
      void handleCreateShare();
    }
  }, [handleCreateShare, open, shareState.status]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="soft"
        size="sm"
        className="shrink-0"
        onClick={() => setOpen(true)}
      >
        <Share2 className="mr-2 h-4 w-4" aria-hidden />
        分享与复盘
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="share-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: SHEET_EASE }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-6 pt-12 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.28, ease: SHEET_EASE }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-sheet-title"
              className="glass-panel relative w-full max-w-xl rounded-3xl p-6 shadow-veil"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 id="share-sheet-title" className="text-lg font-semibold text-fg">
                    分享与复盘
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    复制专属链接或 seed，随时回看本次抽牌与解读。
                  </p>
                </div>
                <Button
                  ref={closeButtonRef}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={() => setOpen(false)}
                  aria-label="关闭分享面板"
                >
                  <X className="h-5 w-5" aria-hidden />
                </Button>
              </header>
              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    提问
                  </span>
                  <p className="border-border/60 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-3 text-sm leading-relaxed text-fg">
                    {question.question}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border-border/60 space-y-1 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-3 text-xs text-muted-foreground">
                    <span className="text-muted-foreground/80 block text-[11px] uppercase tracking-[0.28em]">
                      Seed
                    </span>
                    <span className="break-all text-sm text-fg">{seed}</span>
                  </div>
                  <div className="border-border/60 space-y-1 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-3 text-xs text-muted-foreground">
                    <span className="text-muted-foreground/80 block text-[11px] uppercase tracking-[0.28em]">
                      Spread
                    </span>
                    <span className="text-sm text-fg">{spreadId}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-fg">
                    <Link2 className="h-4 w-4 text-primary" aria-hidden />
                    分享链接
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      readOnly
                      value={
                        shareState.status === "success"
                          ? resolvedShareUrl
                          : shareState.status === "loading"
                            ? "生成中……"
                            : ""
                      }
                      placeholder="生成中……"
                      className={cn(
                        "font-mono text-xs",
                        shareState.status !== "success" && "text-muted-foreground",
                      )}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="soft"
                        size="sm"
                        onClick={handleCreateShare}
                        disabled={shareState.status === "loading"}
                      >
                        {shareState.status === "loading" ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                        ) : null}
                        重新生成
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={handleCopyShareLink}
                        disabled={shareState.status !== "success"}
                      >
                        <Copy className="mr-2 h-4 w-4" aria-hidden />
                        复制链接
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    链接包含 seed，可直接复盘牌阵与 AI 解读。
                  </p>
                  {linkCopyState === "copied" ? (
                    <div className="inline-flex items-center gap-2 text-xs text-primary">
                      <Check className="h-3.5 w-3.5" aria-hidden /> 已复制到剪贴板
                    </div>
                  ) : null}
                  {linkCopyState === "error" ? (
                    <p className="text-xs text-danger">复制失败，请手动选中链接复制。</p>
                  ) : null}
                  {shareState.status === "error" ? (
                    <p className="text-xs text-danger">{shareState.message}</p>
                  ) : null}
                </div>
                {shareState.status === "success" ? (
                  <div className="border-border/60 space-y-3 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2 font-medium text-fg">
                        <Link2 className="h-4 w-4 text-primary" aria-hidden /> 分享图卡
                      </span>
                      <span className="text-xs">社交平台将自动抓取此预览图</span>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input readOnly value={resolvedOgImageUrl} className="font-mono text-xs" />
                      <Button type="button" variant="soft" size="sm" onClick={handleCopyOgImage}>
                        <Copy className="mr-2 h-4 w-4" aria-hidden />
                        复制图卡链接
                      </Button>
                    </div>
                    {ogCopyState === "copied" ? (
                      <div className="inline-flex items-center gap-2 text-xs text-primary">
                        <Check className="h-3.5 w-3.5" aria-hidden /> 图卡链接已复制
                      </div>
                    ) : null}
                    {ogCopyState === "error" ? (
                      <p className="text-xs text-danger">复制失败，可右键保存或手动复制。</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
