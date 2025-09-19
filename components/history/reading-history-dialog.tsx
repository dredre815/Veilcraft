"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Copy, History, MessageSquare, Sparkles, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReadingArchive } from "@/app/read/store/use-reading-archive";

const DIALOG_EASE = [0.2, 0.9, 0.2, 1] as const;

function formatTimestamp(timestamp: number) {
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(timestamp));
  } catch {
    return "未知时间";
  }
}

export function ReadingHistoryDialogTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const entries = useReadingArchive((state) => state.entries);
  const clearHistory = useReadingArchive((state) => state.clearHistory);

  const sorted = useMemo(() => [...entries].sort((a, b) => b.savedAt - a.savedAt), [entries]);

  const handleCopy = (value: string) => {
    void navigator.clipboard.writeText(value).catch((error) => {
      console.error("Failed to copy seed", error);
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="soft"
        size="sm"
        className={cn("shrink-0", className)}
        onClick={() => setOpen(true)}
      >
        <History className="mr-2 h-4 w-4" aria-hidden />
        本地历史
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="history-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: DIALOG_EASE }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6 pt-12 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.28, ease: DIALOG_EASE }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reading-history-title"
              className="glass-panel relative flex w-full max-w-3xl flex-col gap-5 rounded-3xl p-6 shadow-veil"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h2 id="reading-history-title" className="text-lg font-semibold text-fg">
                    本地历史记录
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    你最近的解读、追问与反馈都会安全地存放在浏览器中，不会上传到服务器。
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => setOpen(false)}
                >
                  关闭
                </Button>
              </header>

              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  <Sparkles className="mr-2 inline h-4 w-4 text-primary" aria-hidden />共{" "}
                  {sorted.length} 条记录，仅保留最近的 50 次占卜。
                </span>
                {sorted.length ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-danger"
                    onClick={() => clearHistory()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" aria-hidden /> 清空历史
                  </Button>
                ) : null}
              </div>

              <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
                {sorted.length === 0 ? (
                  <div className="border-border/60 flex flex-col items-center gap-3 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-6 py-10 text-center text-sm text-muted-foreground">
                    <History className="h-10 w-10 text-primary" aria-hidden />
                    <p>还没有记录。完成一次解读后即可在此回顾并继续追问。</p>
                  </div>
                ) : (
                  sorted.map((entry) => (
                    <article
                      key={entry.seed}
                      className="border-border/60 space-y-3 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-fg">{entry.question.question}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.question.category} · {entry.question.tone}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-4 w-4" aria-hidden />
                          {formatTimestamp(entry.savedAt)}
                        </span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-xs text-white/85 backdrop-blur">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                            概览
                          </p>
                          <p className="mt-2 leading-relaxed">{entry.reading.overview}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-xs text-white/85 backdrop-blur">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">
                            主题
                          </p>
                          <p className="mt-2 leading-relaxed">{entry.reading.theme.join(" · ")}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => handleCopy(entry.seed)}
                        >
                          <Copy className="mr-2 h-4 w-4" aria-hidden />
                          Seed：{entry.seed}
                        </Button>
                        <span className="inline-flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-primary" aria-hidden />
                          对话 {entry.conversation.length}
                        </span>
                        {entry.feedback ? (
                          <span className="border-success/40 bg-success/15 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] text-success">
                            已反馈 · {entry.feedback.score} ★
                          </span>
                        ) : null}
                      </div>
                      <details className="group">
                        <summary className="hover:text-primary/80 cursor-pointer text-xs text-primary transition-colors">
                          查看牌位详情
                        </summary>
                        <div className="mt-3 space-y-3 text-xs text-muted-foreground">
                          {entry.reading.cards.map((card, index) => (
                            <div
                              key={card.cardId}
                              className="border-border/60 rounded-2xl border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-3"
                            >
                              <p className="font-medium text-fg">
                                {index + 1}. {card.name} ·{" "}
                                {card.orientation === "upright" ? "正位" : "逆位"}
                              </p>
                              <p className="mt-1">{card.summary}</p>
                            </div>
                          ))}
                        </div>
                      </details>
                    </article>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
