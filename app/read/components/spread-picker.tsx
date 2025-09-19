"use client";

import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";

import { spreadMap, spreads, type SpreadDefinition, type SpreadId } from "@/lib/spreads";
import type { Suit } from "@/lib/deck";
import { useReadingStore } from "../store/use-reading-store";
import { cn } from "@/lib/utils";

const SUIT_LABELS: Record<Suit, string> = {
  wands: "权杖",
  cups: "圣杯",
  swords: "宝剑",
  pentacles: "钱币",
};

const SUIT_PREVIEW_GRADIENTS: Record<Suit, string> = {
  wands: "linear-gradient(135deg, rgba(244,133,75,0.85), rgba(240,71,44,0.82))",
  cups: "linear-gradient(135deg, rgba(88,140,255,0.85), rgba(119,213,255,0.8))",
  swords: "linear-gradient(135deg, rgba(114,126,170,0.82), rgba(58,72,113,0.82))",
  pentacles: "linear-gradient(135deg, rgba(101,176,117,0.85), rgba(214,194,88,0.78))",
};

interface SpreadPickerProps {
  defaultSpreadId?: SpreadId;
  onSelect?: (spread: SpreadDefinition) => void;
}

export function SpreadPicker({ defaultSpreadId, onSelect }: SpreadPickerProps) {
  const activeId = useReadingStore((state) => state.spreadId);
  const setSpread = useReadingStore((state) => state.setSpread);

  useEffect(() => {
    if (
      defaultSpreadId &&
      spreads.some((spread) => spread.id === defaultSpreadId) &&
      defaultSpreadId !== activeId
    ) {
      setSpread(defaultSpreadId);
    }
  }, [activeId, defaultSpreadId, setSpread]);

  const activeSpread = useMemo(() => spreadMap[activeId] ?? spreads[0], [activeId]);

  const handleSelect = (spread: SpreadDefinition) => {
    setSpread(spread.id as SpreadId);
    onSelect?.(spread);
  };

  return (
    <section className="glass-panel rounded-[28px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">牌阵 · Spread</h2>
          <p className="text-sm text-muted-foreground">
            选择适配问题深度的牌阵，右侧实时预览布局。
          </p>
        </div>
        <span className="veil-capsule">Step 2</span>
      </header>

      <div className="mt-6 space-y-6">
        <div role="radiogroup" aria-label="选择牌阵" className="grid gap-4">
          {spreads.map((spread) => (
            <SpreadOption
              key={spread.id}
              spread={spread}
              selected={spread.id === activeId}
              onSelect={() => handleSelect(spread)}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeSpread ? (
            <motion.div
              key={activeSpread.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
              className="border-border/70 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] p-5 shadow-glass"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-fg">位置语义速览</p>
                  <p className="text-xs text-muted-foreground">
                    理解每张牌的提问角度，确保输出结构与期望对齐。
                  </p>
                </div>
                <span className="border-border/60 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  {activeSpread.positions.length} 张牌
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {activeSpread.positions.map((position) => (
                  <div
                    key={position.id}
                    className="border-border/60 hover:border-primary/70 group relative overflow-hidden rounded-xl border bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-4 transition-colors duration-enter ease-veil"
                  >
                    <div className="flex items-baseline gap-2 text-fg">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-medium">
                        {position.index}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-fg">{position.title}</p>
                        {position.subtitle ? (
                          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            {position.subtitle}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {position.description}
                    </p>
                    {position.suitHint?.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {position.suitHint.map((suit) => (
                          <span
                            key={`${position.id}-${suit}`}
                            className="rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white/90 shadow-sm"
                            style={{
                              backgroundImage: SUIT_PREVIEW_GRADIENTS[suit],
                              boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                            }}
                          >
                            {SUIT_LABELS[suit]}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

interface SpreadOptionProps {
  spread: SpreadDefinition;
  selected: boolean;
  onSelect: () => void;
}

function SpreadOption({ spread, selected, onSelect }: SpreadOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "focus-visible:ring-primary/60 group relative flex w-full flex-col gap-5 rounded-2xl border px-5 py-4 text-left transition-all duration-enter ease-veil focus:outline-none focus-visible:ring-2",
        "border-border/70 hover:border-primary/60 bg-[color-mix(in_srgb,var(--surface)_80%,transparent)] hover:shadow-veil",
        selected &&
          "border-primary bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] shadow-veil",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-sm font-semibold text-fg">{spread.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{spread.summary}</p>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            <span className="border-border/70 rounded-full border px-2 py-1">{spread.tagline}</span>
            {spread.recommended.map((item) => (
              <span key={item} className="border-border/60 rounded-full border px-2 py-1">
                {item}
              </span>
            ))}
          </div>
        </div>
        <SpreadPreview spread={spread} active={selected} />
      </div>
      <motion.span
        layout
        className="inline-flex items-center gap-2 text-xs font-medium text-primary"
        initial={false}
        animate={{ opacity: selected ? 1 : 0.65, y: selected ? 0 : 2 }}
      >
        {selected ? (
          <>
            <Check className="h-3.5 w-3.5" aria-hidden /> 已选择
          </>
        ) : (
          <>
            查看布局细节 <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </>
        )}
      </motion.span>
      <span className="sr-only">
        {selected ? "已选择" : "点击选择"} {spread.name}
      </span>
    </button>
  );
}

interface SpreadPreviewProps {
  spread: SpreadDefinition;
  active: boolean;
}

function SpreadPreview({ spread, active }: SpreadPreviewProps) {
  return (
    <motion.div
      layout
      className="border-border/60 relative h-36 w-full max-w-[240px] overflow-hidden rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-3"
      animate={{ scale: active ? 1.02 : 1 }}
      transition={{ duration: 0.24, ease: [0.2, 0.9, 0.2, 1] }}
    >
      <div className="from-primary/12 absolute inset-0 bg-gradient-to-br via-transparent to-cyan-400/10 opacity-60" />
      {spread.layout.cards.map((card) => {
        const position = spread.positions.find((item) => item.id === card.positionId);
        const size =
          card.positionId === "challenge" ? spread.layout.cardSize + 4 : spread.layout.cardSize;
        const transform = `translate(-50%, -50%)${card.rotate ? ` rotate(${card.rotate}deg)` : ""}`;
        const suitGradient = position?.suitHint?.[0]
          ? SUIT_PREVIEW_GRADIENTS[position.suitHint[0]]
          : "linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))";
        return (
          <motion.div
            key={card.positionId}
            className="group/card absolute flex aspect-[3/5] items-center justify-center rounded-[18px] border border-white/20 shadow-inner"
            style={{
              left: `${card.x}%`,
              top: `${card.y}%`,
              width: `${size}%`,
              transform,
              zIndex: card.zIndex ?? 0,
              backgroundImage: suitGradient,
              boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
            }}
            whileHover={{ scale: 1.05, transition: { duration: 0.18, ease: [0.2, 0.9, 0.2, 1] } }}
          >
            {position ? (
              <span className="bg-primary/18 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
                {position.index < 10 ? `0${position.index}` : position.index}
              </span>
            ) : null}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
