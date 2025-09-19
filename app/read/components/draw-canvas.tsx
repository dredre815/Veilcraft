"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Keyboard, RefreshCcw, Shuffle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { drawSpread, getSpread, type DrawnCard } from "@/lib/draw";
import { spreadMap } from "@/lib/spreads";
import { useReadingStore, type DrawPhase } from "../store/use-reading-store";

const CARD_EASE = [0.2, 0.9, 0.2, 1] as const;

export function DrawCanvas() {
  const question = useReadingStore((state) => state.question);
  const spreadId = useReadingStore((state) => state.spreadId);
  const seed = useReadingStore((state) => state.seed);
  const cards = useReadingStore((state) => state.cards);
  const phase = useReadingStore((state) => state.phase);
  const revealIndex = useReadingStore((state) => state.revealIndex);
  const beginDraw = useReadingStore((state) => state.beginDraw);
  const completeShuffle = useReadingStore((state) => state.completeShuffle);
  const revealNext = useReadingStore((state) => state.revealNext);
  const revealPrevious = useReadingStore((state) => state.revealPrevious);
  const resetDraw = useReadingStore((state) => state.resetDraw);

  const spread = useMemo(() => spreadMap[spreadId] ?? getSpread(spreadId), [spreadId]);
  const [announcement, setAnnouncement] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (phase === "shuffling") {
      const timer = window.setTimeout(() => {
        completeShuffle();
      }, 900);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [phase, completeShuffle]);

  useEffect(() => {
    if (phase === "idle") {
      setAnnouncement("");
    }
  }, [phase]);

  useEffect(() => {
    if (revealIndex > 0 && cards[revealIndex - 1]) {
      const revealed = cards[revealIndex - 1];
      const position = spread.positions.find((item) => item.id === revealed.positionId);
      const label = `${position?.title ?? "位置"}`;
      const orientationLabel = revealed.orientation === "reversed" ? "逆位" : "正位";
      setAnnouncement(`${label}：${revealed.card.name}（${orientationLabel}）`);
    }
  }, [cards, revealIndex, spread.positions]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (phase !== "revealing" && phase !== "complete") return;
      if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        revealNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        revealPrevious();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, revealNext, revealPrevious]);

  const handleDraw = useCallback(async () => {
    if (!spread) return;
    setIsDrawing(true);
    try {
      const result = drawSpread({ spreadId: spread.id });
      beginDraw(result);
    } finally {
      setIsDrawing(false);
    }
  }, [beginDraw, spread]);

  const handleReset = useCallback(() => {
    resetDraw();
  }, [resetDraw]);

  const handleRevealNext = useCallback(() => {
    revealNext();
  }, [revealNext]);

  const handleRevealPrevious = useCallback(() => {
    revealPrevious();
  }, [revealPrevious]);

  const nextCard = cards[revealIndex];
  const nextPosition = nextCard
    ? spread.positions.find((position) => position.id === nextCard.positionId)
    : spread.positions[revealIndex];

  const progress = cards.length > 0 ? Math.round((revealIndex / cards.length) * 100) : 0;

  const canStartDraw = Boolean(question);
  const canReveal = phase === "revealing" && revealIndex < cards.length;
  const isComplete = phase === "complete" && cards.length > 0;

  return (
    <section className="glass-panel rounded-[32px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">抽牌 · Draw</h2>
          <p className="text-sm text-muted-foreground">
            Fisher–Yates 确定性洗牌，扇形展开，逐张翻转。
          </p>
        </div>
        <span className="veil-capsule">Step 3</span>
      </header>
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div
          className="relative flex h-[360px] items-center justify-center overflow-hidden rounded-[28px] border border-border"
          style={{ background: "color-mix(in srgb, var(--surface) 62%, transparent)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,92,255,0.18),_transparent_70%)]" />
          <AnimatePresence mode="wait">
            {phase === "idle" ? (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: CARD_EASE }}
                className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center"
              >
                <Sparkles className="h-10 w-10 text-primary" aria-hidden />
                <p className="text-sm text-muted-foreground">
                  完成问题与牌阵选择后，开始洗牌。系统会生成可复盘的 seed，并逐张翻牌。
                </p>
                <p className="text-muted-foreground/80 text-xs">
                  小提示：翻牌阶段可使用键盘 ← → 或 Enter / 空格 控制进度。
                </p>
              </motion.div>
            ) : null}
            {phase === "shuffling" ? (
              <ShuffleAnimation key="shuffle" cardCount={spread.positions.length} />
            ) : null}
          </AnimatePresence>
          {(phase === "revealing" || phase === "complete") && cards.length > 0 ? (
            <CardLayout
              cards={cards}
              revealIndex={revealIndex}
              spreadId={spread.id}
              isComplete={phase === "complete"}
            />
          ) : null}
          <span className="sr-only" aria-live="polite">
            {announcement}
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-fg">当前状态</p>
            <StatusPill phase={phase} revealIndex={revealIndex} total={cards.length} />
            {seed ? (
              <p className="text-xs text-muted-foreground">
                seed：<span className="font-mono text-[11px] tracking-tight">{seed}</span>
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                还未生成 seed。点击开始洗牌即可获得可复盘的抽牌序列。
              </p>
            )}
          </div>
          <div className="space-y-3">
            <div className="border-border/60 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Next</p>
              {nextPosition ? (
                <p className="mt-2 text-sm font-semibold text-fg">
                  {nextPosition.index}. {nextPosition.title}
                </p>
              ) : (
                <p className="mt-2 text-sm font-semibold text-fg">全部翻牌完成</p>
              )}
              {nextCard ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {nextCard.card.name}
                  {nextCard.orientation === "reversed" ? " · 逆位" : " · 正位"}
                </p>
              ) : null}
              <div className="bg-border/60 mt-4 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400"
                  style={{ width: `${progress}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                已翻开 {revealIndex} / {cards.length} 张牌
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                onClick={handleDraw}
                disabled={!canStartDraw || isDrawing || phase === "shuffling"}
                variant={canReveal || isComplete ? "soft" : "primary"}
                className="justify-between"
              >
                <span>
                  {phase === "idle" || isComplete
                    ? "开始洗牌"
                    : phase === "shuffling"
                      ? "洗牌中"
                      : "重新洗牌"}
                </span>
                <Shuffle className="h-4 w-4" aria-hidden />
              </Button>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleRevealNext}
                  disabled={!canReveal}
                  variant="primary"
                  className="flex-1 justify-between"
                >
                  <span>翻开下一张</span>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button
                  type="button"
                  onClick={handleRevealPrevious}
                  disabled={revealIndex === 0 || cards.length === 0}
                  variant="soft"
                  className="flex-1 justify-between"
                >
                  <span>回看上一张</span>
                  <Keyboard className="h-4 w-4" aria-hidden />
                </Button>
              </div>
              <Button
                type="button"
                onClick={handleReset}
                disabled={cards.length === 0 && !seed}
                variant="ghost"
                className="justify-between text-xs"
              >
                <span>清除当前抽牌</span>
                <RefreshCcw className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            {!canStartDraw ? (
              <p className="text-xs text-muted-foreground">
                请先提交“提问 · Focus”，以便记录问题上下文并生成专属 seed。
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardLayoutProps {
  cards: readonly DrawnCard[];
  revealIndex: number;
  spreadId: string;
  isComplete: boolean;
}

function CardLayout({ cards, revealIndex, spreadId, isComplete }: CardLayoutProps) {
  const spread = spreadMap[spreadId] ?? getSpread(spreadId);

  return (
    <div className="relative h-full w-full">
      {spread.layout.cards.map((layoutCard, index) => {
        const drawCard = cards[index];
        const isRevealed = revealIndex > index;
        const isActive = revealIndex === index && revealIndex < cards.length;
        const size =
          layoutCard.positionId === "challenge"
            ? spread.layout.cardSize + 4
            : spread.layout.cardSize;
        const orientationTransform =
          drawCard?.orientation === "reversed" ? "rotate(180deg)" : "rotate(0deg)";

        return (
          <motion.div
            key={layoutCard.positionId}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${layoutCard.x}%`,
              top: `${layoutCard.y}%`,
              width: `${size}%`,
              zIndex: isActive ? 20 : (layoutCard.zIndex ?? index),
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: isActive ? 1.02 : 1 }}
            transition={{ duration: 0.4, ease: CARD_EASE }}
          >
            <div className="relative h-full w-full" style={{ perspective: "1200px" }}>
              <motion.div
                className={cn(
                  "group/card border-border/70 relative h-full w-full overflow-hidden rounded-[22px] border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] shadow-glass",
                  isActive ? "ring-primary/70 ring-2" : "",
                )}
                style={{ transformStyle: "preserve-3d", rotate: layoutCard.rotate ?? 0 }}
                initial={false}
                animate={{ rotateY: isRevealed ? 0 : 180 }}
                transition={{ duration: 0.6, ease: CARD_EASE }}
              >
                <div
                  className="absolute inset-0 flex h-full w-full flex-col justify-between p-3"
                  style={{ backfaceVisibility: "hidden", transform: orientationTransform }}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    <span>{drawCard?.card.arcana === "major" ? "Major" : drawCard?.card.suit}</span>
                    <span>{drawCard?.orientation === "reversed" ? "Reversed" : "Upright"}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-fg">
                      {drawCard?.card.name ?? "未翻开"}
                    </p>
                    {drawCard ? (
                      <p className="text-[11px] text-muted-foreground">
                        {drawCard.card.keywords.join(" · ")}
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">准备翻开</p>
                    )}
                  </div>
                </div>
                <div
                  className="from-primary/15 absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br via-transparent to-cyan-400/30"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: `rotateY(180deg) ${orientationTransform}`,
                  }}
                >
                  <div className="border-border/60 rounded-[18px] border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
      {isComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: CARD_EASE }}
          className="border-primary/40 absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary"
        >
          全部翻牌完成
        </motion.div>
      ) : null}
    </div>
  );
}

function ShuffleAnimation({ cardCount }: { cardCount: number }) {
  return (
    <motion.div
      className="relative flex h-32 w-24 items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: CARD_EASE }}
    >
      {Array.from({ length: Math.min(cardCount, 6) }).map((_, index) => (
        <motion.div
          key={index}
          className="border-border/60 absolute h-full w-full rounded-[20px] border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)]"
          style={{ boxShadow: "0 12px 40px rgba(124,92,255,0.25)" }}
          animate={{
            rotate: [0, 5, -4, 3, 0].map((angle) => angle + index * 2),
            y: [0, -6, 4, -3, 0],
          }}
          transition={{
            duration: 1.2,
            ease: CARD_EASE,
            repeat: Infinity,
            repeatDelay: 0.1,
            delay: index * 0.06,
          }}
        />
      ))}
    </motion.div>
  );
}

function StatusPill({
  phase,
  revealIndex,
  total,
}: {
  phase: DrawPhase;
  revealIndex: number;
  total: number;
}) {
  let label = "未开始";
  if (phase === "shuffling") label = "洗牌中";
  if (phase === "revealing") label = "翻牌进行中";
  if (phase === "complete") label = "已完成";

  return (
    <span className="border-border/60 inline-flex items-center gap-2 rounded-full border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-3 py-1 text-xs font-medium text-muted-foreground">
      <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
      {label}
      {total > 0 ? (
        <span className="text-muted-foreground/80 text-[11px]">
          {revealIndex} / {total}
        </span>
      ) : null}
    </span>
  );
}
