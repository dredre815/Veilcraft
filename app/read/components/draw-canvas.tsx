"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Keyboard, RefreshCcw, Shuffle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { drawSpread, getSpread, type DrawnCard, type Orientation } from "@/lib/draw";
import type { CardTheme, Suit } from "@/lib/deck";
import { spreadMap } from "@/lib/spreads";
import { useReadingStore, type DrawPhase } from "../store/use-reading-store";

const CARD_EASE = [0.2, 0.9, 0.2, 1] as const;

const PATTERN_OVERLAYS: Record<CardTheme["pattern"], string> = {
  ray: "radial-gradient(circle at 20% -10%, rgba(255,255,255,0.45), transparent 55%)",
  wave: "linear-gradient(140deg, rgba(255,255,255,0.22) 0%, transparent 60%)",
  petal: "radial-gradient(circle at 15% 110%, rgba(255,255,255,0.32), transparent 60%)",
  spark: "radial-gradient(circle at 80% 10%, rgba(255,255,255,0.4), transparent 55%)",
  rune: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)",
  ember: "linear-gradient(160deg, rgba(255,255,255,0.16) 0%, transparent 65%)",
  tidal: "radial-gradient(circle at 50% 120%, rgba(255,255,255,0.3), transparent 62%)",
  gale: "linear-gradient(120deg, rgba(255,255,255,0.2) 0%, transparent 52%)",
  terra: "radial-gradient(circle at 0% 100%, rgba(255,255,255,0.28), transparent 60%)",
  nova: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.5), transparent 58%)",
};

const SUIT_BADGES: Record<Suit, string> = {
  wands: "权杖 · Wands",
  cups: "圣杯 · Cups",
  swords: "宝剑 · Swords",
  pentacles: "钱币 · Pentacles",
};

const PARTICLE_COUNT = 18;
const PARTICLE_LIFETIME = 2800;
const AUDIO_RELEASE = 0.4;

function getCardVisuals(theme?: CardTheme) {
  const defaultGradient = "linear-gradient(135deg, rgba(44,44,62,0.96), rgba(14,14,24,0.96))";
  if (!theme) {
    const overlay = PATTERN_OVERLAYS.ray;
    return {
      frontBackground: `${overlay}, ${defaultGradient}`,
      backBackground: defaultGradient,
      boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    };
  }
  const gradient = `linear-gradient(135deg, ${theme.palette[0]}, ${theme.palette[1]})`;
  const overlay = PATTERN_OVERLAYS[theme.pattern];
  return {
    frontBackground: `${overlay}, ${gradient}`,
    backBackground: gradient,
    boxShadow: `0 18px 40px ${theme.glow}`,
  };
}

function formatGlyphLabel(glyph?: string) {
  if (!glyph) {
    return "";
  }
  return glyph
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

interface ParticleSpec {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function createSeed(theme?: CardTheme) {
  const base = `${theme?.palette.join("-") ?? "default"}-${theme?.glyph ?? "glyph"}-${theme?.pattern ?? "pattern"}`;
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}

function pseudoRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function generateParticles(theme?: CardTheme): ParticleSpec[] {
  const seed = createSeed(theme);
  const random = pseudoRandom(seed);
  return Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
    const left = Math.round(random() * 100);
    const top = Math.round(random() * 100);
    const size = 8 + random() * 14;
    const delay = random() * 1200;
    const duration = PARTICLE_LIFETIME + random() * 1200;
    const opacity = 0.25 + random() * 0.4;
    return {
      id: index,
      left,
      top,
      size,
      delay,
      duration,
      opacity,
    };
  });
}

function CardParticles({ theme, active }: { theme?: CardTheme; active: boolean }) {
  const particles = useMemo(() => generateParticles(theme), [theme]);

  if (!active) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            background: "rgba(255,255,255,0.65)",
            filter: "blur(6px)",
            opacity: particle.opacity,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, particle.opacity, 0], scale: [0.6, 1.1, 0.8] }}
          transition={{
            duration: particle.duration / 1000,
            ease: "easeInOut",
            repeat: Infinity,
            delay: particle.delay / 1000,
          }}
        />
      ))}
    </div>
  );
}

function playRevealTone(
  context: AudioContext,
  theme: CardTheme | undefined,
  orientation: Orientation,
) {
  try {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    const baseFrequency = orientation === "reversed" ? 280 : 420;
    const colorInfluence = theme ? computeColorLuminance(theme.palette[0]) : 0.5;
    const frequency = baseFrequency + colorInfluence * 60;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    gain.gain.setValueAtTime(0, context.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + AUDIO_RELEASE);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + AUDIO_RELEASE + 0.05);
  } catch (error) {
    console.warn("Failed to play reveal tone", error);
  }
}

function computeColorLuminance(hex: string): number {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) {
    return 0.5;
  }
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  // Rec. 709 luminance approximation
  return Math.max(0, Math.min(1, 0.2126 * r + 0.7152 * g + 0.0722 * b));
}

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
  const shouldReduceMotion = !!useReducedMotion();
  const audioContextRef = useRef<AudioContext | null>(null);

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

      if (!shouldReduceMotion && audioContextRef.current) {
        playRevealTone(audioContextRef.current, revealed.card.theme, revealed.orientation);
      }
    }
  }, [cards, revealIndex, shouldReduceMotion, spread.positions]);

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
    if (!shouldReduceMotion) {
      try {
        const globalWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext };
        const AudioCtor = globalWindow.AudioContext ?? globalWindow.webkitAudioContext;
        if (AudioCtor && !audioContextRef.current) {
          audioContextRef.current = new AudioCtor();
        }
        if (audioContextRef.current?.state === "suspended") {
          void audioContextRef.current.resume();
        }
      } catch (error) {
        console.warn("Audio context init failed", error);
      }
    }
    revealNext();
  }, [revealNext, shouldReduceMotion]);

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
              reduceMotion={shouldReduceMotion}
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
  reduceMotion: boolean;
}

function CardLayout({ cards, revealIndex, spreadId, isComplete, reduceMotion }: CardLayoutProps) {
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
        const visuals = getCardVisuals(drawCard?.card.theme);
        const arcanaBadge = drawCard
          ? drawCard.card.arcana === "major"
            ? "大阿卡纳"
            : SUIT_BADGES[drawCard.card.suit ?? "wands"]
          : "待抽取";
        const orientationLabel = drawCard
          ? drawCard.orientation === "reversed"
            ? "逆位"
            : "正位"
          : "待揭示";
        const orientationTone =
          drawCard?.orientation === "reversed" ? "text-rose-200" : "text-white/80";
        const orientationHint = drawCard
          ? drawCard.orientation === "reversed"
            ? drawCard.card.reversed
            : drawCard.card.upright
          : "翻开查看牌面指引。";
        const glyphLabel = drawCard?.card.theme ? formatGlyphLabel(drawCard.card.theme.glyph) : "";
        const keywordText = drawCard ? drawCard.card.keywords.join(" · ") : "准备翻开";

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
                  "group/card relative h-full w-full overflow-hidden rounded-[22px] border border-white/20 shadow-glass backdrop-blur-sm",
                  isActive ? "ring-primary/70 ring-2" : "",
                )}
                style={{
                  transformStyle: "preserve-3d",
                  rotate: layoutCard.rotate ?? 0,
                  boxShadow: visuals.boxShadow,
                }}
                initial={false}
                animate={{ rotateY: isRevealed ? 0 : 180 }}
                transition={{ duration: 0.6, ease: CARD_EASE }}
              >
                <CardParticles theme={drawCard?.card.theme} active={isActive && !reduceMotion} />
                <div
                  className="absolute inset-0 flex h-full w-full flex-col justify-between p-3 text-white"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: orientationTransform,
                    backgroundImage: visuals.frontBackground,
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/70">
                    <span>{arcanaBadge}</span>
                    {glyphLabel ? <span className="tracking-[0.22em]">{glyphLabel}</span> : null}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold leading-tight text-white">
                        {drawCard?.card.name ?? "未翻开"}
                      </p>
                      <span
                        className={cn(
                          "rounded-full border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.24em]",
                          drawCard
                            ? cn(orientationTone, "border-white/30 bg-white/10")
                            : "border-white/20 bg-white/10 text-white/70",
                        )}
                      >
                        {orientationLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70">{keywordText}</p>
                  </div>
                  <div className="rounded-2xl bg-black/20 px-3 py-2 text-[11px] leading-relaxed text-white/85 backdrop-blur-[2px]">
                    {orientationHint}
                  </div>
                </div>
                <div
                  className="absolute inset-0 flex h-full w-full items-center justify-center"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: `rotateY(180deg) ${orientationTransform}`,
                    backgroundImage: visuals.backBackground,
                  }}
                >
                  <div className="rounded-[18px] border border-white/30 bg-black/20 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.32em] text-white/80 backdrop-blur-[2px]">
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
