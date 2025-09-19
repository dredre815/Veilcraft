"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, ChevronsRight, Loader2, RefreshCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiKeyDialogTrigger } from "@/components/settings/api-key-dialog";
import { ReadingSchema, type CardRead, type Reading } from "@/lib/schema";
import { spreadMap, type SpreadDefinition } from "@/lib/spreads";

import { EvidenceTray } from "./evidence-tray";
import { FeedbackWidget } from "./feedback-widget";
import { InterpretationChat } from "./interpretation-chat";
import { ReadingHistoryDialogTrigger } from "@/components/history/reading-history-dialog";
import { useReadingStore } from "../store/use-reading-store";
import { useOpenAiSettings } from "../store/use-openai-settings";
import { useReadingArchive } from "../store/use-reading-archive";

const PANEL_EASE = [0.2, 0.9, 0.2, 1] as const;

function getOrientationLabel(orientation: CardRead["orientation"]) {
  return orientation === "upright" ? "正位" : "逆位";
}

function CardSummary({
  card,
  position,
  onShowEvidence,
  delay,
}: {
  card: CardRead;
  position: SpreadDefinition["positions"][number] | undefined;
  onShowEvidence: () => void;
  delay: number;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: PANEL_EASE, delay }}
      className="border-border/60 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
            {position ? `${position.index}. ${position.title}` : "牌位"}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <h3 className="text-lg font-semibold text-fg">{card.name}</h3>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              {getOrientationLabel(card.orientation)}
            </span>
          </div>
        </div>
        <Button variant="soft" size="sm" onClick={onShowEvidence}>
          证据引用
        </Button>
      </header>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{card.summary}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {card.keyFactors.map((factor, index) => (
          <div
            key={index}
            className="border-border/40 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 text-sm text-fg"
          >
            {factor}
          </div>
        ))}
      </div>
      <div className="border-border/40 mt-4 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-3 text-sm text-fg">
        {card.advice}
      </div>
    </motion.article>
  );
}

function ActionsList({ items, delay }: { items: Reading["actionItems"]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: PANEL_EASE, delay }}
      className="border-border/60 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-5"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-fg">
        <Check className="h-4 w-4 text-primary" aria-hidden />
        可执行建议
      </div>
      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function CautionsList({ items, delay }: { items: Reading["cautions"]; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: PANEL_EASE, delay }}
      className="border-border/60 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-5"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-fg">
        <AlertTriangle className="h-4 w-4 text-warn" aria-hidden />
        风险提醒
      </div>
      <ul className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3">
            <span
              className="bg-warn/80 mt-[6px] inline-flex h-2 w-2 shrink-0 rounded-full"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function ReadingPanel() {
  const question = useReadingStore((state) => state.question);
  const spreadId = useReadingStore((state) => state.spreadId);
  const seed = useReadingStore((state) => state.seed);
  const cards = useReadingStore((state) => state.cards);
  const phase = useReadingStore((state) => state.phase);
  const reading = useReadingStore((state) => state.reading);
  const interpretStatus = useReadingStore((state) => state.interpretStatus);
  const interpretError = useReadingStore((state) => state.interpretError);
  const setInterpretationPending = useReadingStore((state) => state.setInterpretationPending);
  const setInterpretationSuccess = useReadingStore((state) => state.setInterpretationSuccess);
  const setInterpretationError = useReadingStore((state) => state.setInterpretationError);
  const resetInterpretation = useReadingStore((state) => state.resetInterpretation);

  const openAiKey = useOpenAiSettings((state) => state.apiKey);
  const apiKeyStatus = useOpenAiSettings((state) => state.apiKeyStatus);
  const markApiKeyStatus = useOpenAiSettings((state) => state.markApiKeyStatus);
  const saveReading = useReadingArchive((state) => state.saveReading);

  const spread = useMemo(() => spreadMap[spreadId], [spreadId]);
  const positionMap = useMemo(() => {
    if (!spread) return new Map<string, SpreadDefinition["positions"][number]>();
    return new Map(spread.positions.map((position) => [position.id, position] as const));
  }, [spread]);

  const [visibleCards, setVisibleCards] = useState(0);
  const [showTheme, setShowTheme] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showCautions, setShowCautions] = useState(false);
  const [evidenceTarget, setEvidenceTarget] = useState<CardRead | null>(null);

  useEffect(() => {
    if (!reading || interpretStatus !== "success") {
      setVisibleCards(0);
      setShowTheme(false);
      setShowActions(false);
      setShowCautions(false);
      return;
    }

    setVisibleCards(0);
    setShowTheme(false);
    setShowActions(false);
    setShowCautions(false);

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setShowTheme(true), 200));
    reading.cards.forEach((_, index) => {
      timers.push(window.setTimeout(() => setVisibleCards(index + 1), 360 + index * 240));
    });
    const baseDelay = 360 + reading.cards.length * 240;
    timers.push(window.setTimeout(() => setShowActions(true), baseDelay + 220));
    timers.push(window.setTimeout(() => setShowCautions(true), baseDelay + 420));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [reading, interpretStatus]);

  useEffect(() => {
    if (phase !== "complete") {
      resetInterpretation();
    }
  }, [phase, resetInterpretation]);

  const interpretReady = Boolean(
    question && seed && cards.length > 0 && phase === "complete" && spread,
  );
  const hasApiKey = Boolean(openAiKey && openAiKey.trim().length > 0);

  const fetchInterpretation = useCallback(async () => {
    if (!interpretReady || !question || !seed || cards.length === 0 || !openAiKey) {
      return;
    }
    try {
      setInterpretationPending();
      const payload = {
        seed,
        spreadId,
        question: {
          text: question.question,
          category: question.category,
          tone: question.tone,
          language: question.language,
        },
        cards: cards.map((item) => ({
          cardId: item.card.id,
          positionId: item.positionId,
          orientation: item.orientation,
        })),
      };

      const response = await fetch("/api/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-openai-key": openAiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        const message = errorJson?.message ?? "解读生成失败，请稍后重试。";
        if (response.status === 401) {
          markApiKeyStatus("invalid");
        }
        throw new Error(message);
      }

      markApiKeyStatus("valid");
      const json = await response.json();
      const parsed = ReadingSchema.parse(json);
      setInterpretationSuccess(parsed);
      saveReading({
        seed,
        spreadId,
        question: {
          question: question.question,
          category: question.category,
          tone: question.tone,
          language: question.language,
          email: question.email,
        },
        reading: parsed,
      });
    } catch (error) {
      console.error("Failed to generate interpretation", error);
      const message = error instanceof Error ? error.message : "解读生成失败，请稍后重试。";
      setInterpretationError(message);
    }
  }, [
    interpretReady,
    question,
    seed,
    cards,
    spreadId,
    openAiKey,
    setInterpretationPending,
    setInterpretationSuccess,
    setInterpretationError,
    markApiKeyStatus,
    saveReading,
  ]);

  useEffect(() => {
    if (interpretReady && hasApiKey && interpretStatus === "idle") {
      void fetchInterpretation();
    }
  }, [interpretReady, hasApiKey, interpretStatus, fetchInterpretation]);

  const handleRetry = useCallback(() => {
    void fetchInterpretation();
  }, [fetchInterpretation]);

  const handleShowEvidence = useCallback((card: CardRead) => {
    setEvidenceTarget(card);
  }, []);

  const handleCloseEvidence = useCallback(() => {
    setEvidenceTarget(null);
  }, []);

  const activePosition = evidenceTarget ? positionMap.get(evidenceTarget.positionId) : undefined;

  let panelContent: React.ReactNode = null;

  if (!question) {
    panelContent = (
      <div className="mt-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
        <Sparkles className="h-10 w-10 text-primary" aria-hidden />
        <p className="text-sm">先在左侧填写你的问题与语气偏好，完成后即可进入抽牌与解读流程。</p>
      </div>
    );
  } else if (!cards.length) {
    panelContent = (
      <div className="mt-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
        <ChevronsRight className="h-10 w-10 text-primary" aria-hidden />
        <p className="text-sm">完成提问后，选择牌阵并点击“开始洗牌”以获取可复盘的 seed。</p>
      </div>
    );
  } else if (phase !== "complete") {
    panelContent = (
      <div className="mt-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="text-sm">逐张翻开牌面后，Veilcraft 将生成结构化的 AI 解读。</p>
      </div>
    );
  } else if (!hasApiKey) {
    panelContent = (
      <div className="border-border/60 mt-8 flex flex-col items-center gap-4 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-6 py-8 text-center text-muted-foreground">
        <AlertTriangle className="h-10 w-10 text-primary" aria-hidden />
        <p className="text-sm">
          为保证隐私与自主控制，请先在右上角设置 OpenAI API Key，系统会代理请求并仅在本地存储密钥。
        </p>
        <ApiKeyDialogTrigger />
      </div>
    );
  } else if (interpretStatus === "loading") {
    panelContent = (
      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-16 w-full rounded-3xl" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 rounded-full" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: cards.length || 3 }).map((_, index) => (
            <div
              key={index}
              className="border-border/60 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] p-5"
            >
              <Skeleton className="h-5 w-40 rounded-full" />
              <Skeleton className="mt-4 h-16 w-full rounded-3xl" />
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Skeleton className="h-10 rounded-2xl" />
                <Skeleton className="h-10 rounded-2xl" />
              </div>
              <Skeleton className="mt-4 h-12 w-full rounded-2xl" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-20 rounded-3xl" />
          <Skeleton className="h-20 rounded-3xl" />
        </div>
        <Skeleton className="h-6 w-40 rounded-full" />
      </div>
    );
  } else if (interpretStatus === "error") {
    panelContent = (
      <div className="mt-8 flex flex-col items-center gap-4 text-center text-muted-foreground">
        <AlertTriangle className="h-10 w-10 text-warn" aria-hidden />
        <p className="text-sm">{interpretError ?? "解读生成失败，请稍后重试。"}</p>
        <Button variant="soft" size="sm" onClick={handleRetry}>
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden />
          重新请求解读
        </Button>
        {apiKeyStatus === "invalid" ? (
          <p className="text-xs text-danger">检测到密钥不可用，请在设置中更新后重试。</p>
        ) : null}
      </div>
    );
  } else if (interpretStatus === "success" && reading && question && seed) {
    panelContent = (
      <div className="mt-6 space-y-6">
        <motion.div
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, ease: PANEL_EASE }}
          className="space-y-3"
        >
          <span className="veil-capsule">解读已生成</span>
          <p className="text-base leading-relaxed text-muted-foreground">{reading.overview}</p>
        </motion.div>
        <AnimatePresence>
          {showTheme ? (
            <motion.div
              key="theme"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: PANEL_EASE }}
              className="flex flex-wrap gap-2"
            >
              {reading.theme.map((tag) => (
                <span
                  key={tag}
                  className="border-border/60 rounded-full border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="space-y-5">
          {reading.cards.slice(0, visibleCards || reading.cards.length).map((card, index) => (
            <CardSummary
              key={card.cardId}
              card={card}
              position={positionMap.get(card.positionId)}
              onShowEvidence={() => handleShowEvidence(card)}
              delay={0.12 * index}
            />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {showActions ? <ActionsList items={reading.actionItems} delay={0.1} /> : null}
          {showCautions ? <CautionsList items={reading.cautions} delay={0.18} /> : null}
        </div>
        <p className="text-muted-foreground/80 text-xs leading-relaxed">{reading.disclaimer}</p>
        <div className="border-border/60 glass-panel flex flex-col gap-4 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-fg">本地历史记录</p>
            <p className="text-xs text-muted-foreground">
              解读与追问会保存在浏览器中，随时回顾或导出 Seed。
            </p>
          </div>
          <ReadingHistoryDialogTrigger />
        </div>
        <FeedbackWidget />
        <InterpretationChat />
      </div>
    );
  }

  return (
    <section className="glass-panel rounded-[32px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">解读 · Reading</h2>
          <p className="text-sm text-muted-foreground">
            流式呈现 Overview、主题标签、牌位摘要、行动建议与风险提示。
          </p>
        </div>
        <span className="veil-capsule">Step 4</span>
      </header>
      {panelContent}
      <EvidenceTray
        open={Boolean(evidenceTarget)}
        card={evidenceTarget}
        position={activePosition}
        onClose={handleCloseEvidence}
      />
    </section>
  );
}
