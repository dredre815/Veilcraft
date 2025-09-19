"use client";

import { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lightbulb, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateQuestionSuggestions } from "@/lib/question-suggestions";
import { cn } from "@/lib/utils";
import { useReadingStore } from "../store/use-reading-store";

const CATEGORY_VALUES = ["relationship", "career", "wealth", "health"] as const;

const CATEGORY_OPTIONS = [
  { value: CATEGORY_VALUES[0], label: "情感关系" },
  { value: CATEGORY_VALUES[1], label: "事业发展" },
  { value: CATEGORY_VALUES[2], label: "财富规划" },
  { value: CATEGORY_VALUES[3], label: "身心状态" },
] as const;

const TONE_VALUES = ["measured", "direct", "pragmatic"] as const;

const TONE_OPTIONS = [
  {
    value: TONE_VALUES[0],
    label: "克制",
    description: "以冷静、分析的角度给出洞察。",
  },
  {
    value: TONE_VALUES[1],
    label: "直接",
    description: "快速指出关键矛盾与突破口。",
  },
  {
    value: TONE_VALUES[2],
    label: "务实",
    description: "聚焦可执行的下一步行动。",
  },
];

const LANGUAGE_VALUES = ["zh-CN", "en-US"] as const;

const LANGUAGE_OPTIONS = [
  { value: LANGUAGE_VALUES[0], label: "中文" },
  { value: LANGUAGE_VALUES[1], label: "English" },
] as const;

const questionSchema = z.object({
  question: z
    .string()
    .trim()
    .min(20, "请用 20 字以上描述问题背景与期待。")
    .max(200, "为了保持聚焦，请控制在 200 字以内。"),
  category: z.enum(CATEGORY_VALUES),
  tone: z.enum(TONE_VALUES),
  language: z.enum(LANGUAGE_VALUES),
  email: z.string().email("请填写可接收解读结果的邮箱。").optional().or(z.literal("")),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  defaultValues?: Partial<QuestionFormValues>;
  onSubmit?: (values: QuestionFormValues) => void | Promise<void>;
}

export function QuestionForm({ defaultValues, onSubmit }: QuestionFormProps) {
  const storedQuestion = useReadingStore((state) => state.question);
  const setQuestionContext = useReadingStore((state) => state.setQuestion);
  const resetDraw = useReadingStore((state) => state.resetDraw);

  const initialDefaultsRef = useRef<QuestionFormValues | null>(null);

  if (!initialDefaultsRef.current) {
    initialDefaultsRef.current = {
      question: "",
      category: CATEGORY_OPTIONS[0].value,
      tone: TONE_OPTIONS[0].value,
      language: LANGUAGE_OPTIONS[0].value,
      email: "",
      ...(storedQuestion
        ? {
            question: storedQuestion.question,
            category: storedQuestion.category as (typeof CATEGORY_VALUES)[number],
            tone: storedQuestion.tone as (typeof TONE_VALUES)[number],
            language: storedQuestion.language as (typeof LANGUAGE_VALUES)[number],
            email: storedQuestion.email ?? "",
          }
        : {}),
      ...defaultValues,
    };
  }

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialDefaultsRef.current ?? undefined,
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = form;

  const questionValue = watch("question");
  const categoryValue = watch("category");
  const toneValue = watch("tone");

  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);

  const suggestions = useMemo(
    () => generateQuestionSuggestions(questionValue ?? "", categoryValue),
    [questionValue, categoryValue],
  );

  const handleSuggestionApply = (value: string) => {
    setValue("question", value, { shouldValidate: true, shouldDirty: true });
  };

  const onInternalSubmit = async (values: QuestionFormValues) => {
    await onSubmit?.(values);
    if (!onSubmit) {
      console.info("Question captured", values);
    }
    setLastSubmittedAt(Date.now());
    const sanitizedEmail = values.email?.trim();
    setQuestionContext({
      question: values.question.trim(),
      category: values.category,
      tone: values.tone,
      language: values.language,
      email: sanitizedEmail ? sanitizedEmail : undefined,
    });
    resetDraw();
  };

  const questionLength = questionValue?.trim().length ?? 0;
  const lengthIndicatorClass =
    questionLength > 200
      ? "text-danger"
      : questionLength >= 140
        ? "text-warn"
        : "text-muted-foreground";

  return (
    <section className="glass-panel rounded-[28px] p-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-fg">提问 · Focus</h2>
          <p className="text-sm text-muted-foreground">
            描述你想揭示的问题，系统会建议更聚焦的问法。
          </p>
        </div>
        <span className="veil-capsule">Step 1</span>
      </header>
      <form onSubmit={handleSubmit(onInternalSubmit)} className="mt-6 space-y-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm font-semibold text-fg">
            你的核心问题
          </Label>
          <Textarea
            id="question"
            autoComplete="off"
            spellCheck={false}
            maxLength={400}
            placeholder="例：这次岗位轮换后，我该如何在 3 个月内证明自己的价值，并赢得核心团队的信任？"
            aria-describedby="question-hint question-error"
            {...register("question")}
          />
          <div
            className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground"
            id="question-hint"
          >
            <span>20-200 字，聚焦真实场景与期待的变化。</span>
            <span className={cn("tabular-nums", lengthIndicatorClass)}>{questionLength} / 200</span>
          </div>
          {errors.question ? (
            <p id="question-error" className="text-sm text-danger">
              {errors.question.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold text-fg">
              议题类型
            </Label>
            <Select id="category" {...register("category")}>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="language" className="text-sm font-semibold text-fg">
              解读语言
            </Label>
            <Select id="language" {...register("language")}>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <span className="text-sm font-semibold text-fg">解读语气</span>
            <div role="radiogroup" aria-label="选择解读语气" className="grid gap-2 sm:grid-cols-3">
              {TONE_OPTIONS.map((option) => {
                const selected = option.value === toneValue;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() =>
                      setValue("tone", option.value, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className={cn(
                      "flex h-full flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition-all duration-enter ease-veil",
                      "border-border/70 hover:border-primary/60 bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] hover:shadow-veil",
                      selected &&
                        "border-primary bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] shadow-veil",
                    )}
                  >
                    <span className="text-sm font-semibold text-fg">{option.label}</span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </span>
                    <AnimatePresence>
                      {selected ? (
                        <motion.span
                          layoutId="tone-indicator"
                          className="bg-primary/15 mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary"
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                        >
                          <Check className="h-3 w-3" />
                          已选
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email" className="text-sm font-semibold text-fg">
              可选：接收结果的邮箱
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="我们将在未来版本支持发送完整解读回顾。"
              aria-describedby="email-hint email-error"
              {...register("email")}
            />
            <p id="email-hint" className="text-xs text-muted-foreground">
              邮箱仅用于发送本次占卜结果，默认不会存储原始问题文本。
            </p>
            {errors.email ? (
              <p id="email-error" className="text-sm text-danger">
                {errors.email.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="border-border/70 rounded-2xl border border-dashed bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] p-4">
          <div className="flex items-start gap-3">
            <span className="bg-primary/15 rounded-full p-2 text-primary">
              <Lightbulb className="h-4 w-4" aria-hidden />
            </span>
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-sm font-semibold text-fg">智能提示</p>
                <p className="text-xs text-muted-foreground">
                  根据你的输入，我们提供更聚焦的问法，点击即可替换文本。
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionApply(suggestion)}
                    className="border-border/70 group inline-flex max-w-full items-center gap-2 rounded-full border bg-[color-mix(in_srgb,var(--surface)_85%,transparent)] px-4 py-2 text-xs text-muted-foreground transition-all duration-enter ease-veil hover:border-primary hover:text-fg hover:shadow-veil"
                  >
                    <span className="truncate text-left">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <AnimatePresence mode="wait">
            {isSubmitSuccessful && lastSubmittedAt ? (
              <motion.p
                key={lastSubmittedAt}
                className="flex items-center gap-2 text-sm text-success"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                <Check className="h-4 w-4" aria-hidden />
                已锁定问题，继续选择牌阵。
              </motion.p>
            ) : (
              <motion.p
                key="prompt"
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
              >
                提交后即可在后续步骤中使用相同 seed 复盘。
              </motion.p>
            )}
          </AnimatePresence>
          <Button type="submit" className="sm:w-auto" disabled={isSubmitting || !isValid}>
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                保存中...
              </span>
            ) : (
              "锁定问题"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
}
