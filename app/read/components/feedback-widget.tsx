"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Star, Loader2, Send, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useReadingStore } from "../store/use-reading-store";
import { useReadingArchive } from "../store/use-reading-archive";

const FEEDBACK_TAGS = ["命中", "启发", "可执行", "过于玄学", "想要更多细节"] as const;
const COMMENT_LIMIT = 400;

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function FeedbackWidget() {
  const seed = useReadingStore((state) => state.seed);
  const interpretStatus = useReadingStore((state) => state.interpretStatus);
  const reading = useReadingStore((state) => state.reading);

  const saveFeedback = useReadingArchive((state) => state.saveFeedback);
  const existingFeedback = useReadingArchive((state) =>
    seed ? (state.entries.find((entry) => entry.seed === seed)?.feedback ?? null) : null,
  );

  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canDisplay = Boolean(seed && interpretStatus === "success" && reading);

  const displayRating = hoverRating ?? rating ?? 0;

  const ratingLabel = useMemo(() => {
    switch (displayRating) {
      case 1:
        return "糟糕";
      case 2:
        return "一般";
      case 3:
        return "还不错";
      case 4:
        return "喜欢";
      case 5:
        return "惊艳";
      default:
        return "选择评分";
    }
  }, [displayRating]);

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";

  useEffect(() => {
    if (!existingFeedback) {
      setStatus("idle");
      setRating(null);
      setSelectedTags([]);
      setComment("");
      return;
    }
    setStatus("success");
    setRating(existingFeedback.score);
    setSelectedTags([...existingFeedback.tags]);
    setComment(existingFeedback.comment ?? "");
  }, [existingFeedback]);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((previous) =>
      previous.includes(tag) ? previous.filter((item) => item !== tag) : [...previous, tag],
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!seed || !rating || isSubmitting) {
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);
    try {
      saveFeedback(seed, {
        score: rating,
        tags: selectedTags,
        comment: comment.trim() ? comment.trim() : undefined,
        submittedAt: Date.now(),
      });
      setStatus("success");
    } catch (error) {
      console.error("Failed to persist feedback", error);
      setErrorMessage("保存反馈时出现异常，请稍后重试。");
      setStatus("error");
    }
  }, [comment, isSubmitting, rating, saveFeedback, seed, selectedTags]);

  if (!canDisplay) {
    return null;
  }

  return (
    <section className="glass-panel rounded-[28px] p-5">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-fg">反馈 · Feedback</h3>
          <p className="text-xs text-muted-foreground">
            评分将帮助 Veilcraft 优化解释风格与证据呈现。
          </p>
        </div>
        <span className="veil-capsule">感谢你的意见</span>
      </header>
      <div className="mt-5 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;
              const active = (hoverRating ?? rating ?? 0) >= value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(null)}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-enter ease-veil",
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] text-muted-foreground",
                    isSuccess && "pointer-events-none opacity-60",
                  )}
                  aria-label={`评分 ${value} 分`}
                >
                  <Star className={cn("h-5 w-5", active ? "fill-current" : "")} aria-hidden />
                </button>
              );
            })}
            <span className="text-sm text-muted-foreground">{ratingLabel}</span>
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.28em] text-muted-foreground">标签</span>
          <div className="flex flex-wrap gap-2">
            {FEEDBACK_TAGS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-enter ease-veil",
                    active
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-border bg-[color-mix(in_srgb,var(--surface)_95%,transparent)] text-muted-foreground",
                    isSuccess && "pointer-events-none opacity-60",
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="feedback-comment"
            className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
          >
            其他补充
          </label>
          <Textarea
            id="feedback-comment"
            placeholder="想告诉我们的亮点、疑惑或改进建议……"
            maxLength={COMMENT_LIMIT}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            disabled={isSuccess}
            className="min-h-[120px] text-sm"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {comment.length}/{COMMENT_LIMIT}
            </span>
            <div className="flex items-center gap-2">
              {errorMessage ? <span className="text-danger">{errorMessage}</span> : null}
              {isSuccess ? (
                <span className="inline-flex items-center gap-1 text-success">
                  <Check className="h-3.5 w-3.5" aria-hidden /> 已收到
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!rating || isSubmitting || isSuccess}
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            <Send className="mr-2 h-4 w-4" aria-hidden />
            提交反馈
          </Button>
        </div>
      </div>
    </section>
  );
}
