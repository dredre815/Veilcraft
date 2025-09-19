"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, KeyRound, ShieldAlert, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useOpenAiSettings } from "@/app/read/store/use-openai-settings";

const DIALOG_EASE = [0.2, 0.9, 0.2, 1] as const;

function formatTimestamp(timestamp: number | null) {
  if (!timestamp) {
    return "尚未检测";
  }
  try {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(timestamp));
  } catch (error) {
    console.error("Failed to format timestamp", error);
    return "未知";
  }
}

export function ApiKeyDialogTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { apiKey, apiKeyStatus, lastCheckedAt, setApiKey, clearApiKey } = useOpenAiSettings();
  const [inputValue, setInputValue] = useState("");
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) {
      setInputValue(apiKey ?? "");
      setShowSavedFeedback(false);
    }
  }, [open, apiKey]);

  useEffect(() => {
    if (!open) {
      return undefined;
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
    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 120);
    return () => window.clearTimeout(timer);
  }, [open]);

  const statusChip = useMemo(() => {
    if (!apiKey) {
      return null;
    }
    switch (apiKeyStatus) {
      case "valid":
        return (
          <span className="border-success/40 bg-success/15 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium text-success">
            <Check className="h-3.5 w-3.5" aria-hidden />
            最近验证成功 · {formatTimestamp(lastCheckedAt)}
          </span>
        );
      case "invalid":
        return (
          <span className="border-danger/40 bg-danger/15 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium text-danger">
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
            密钥无效或已过期 · {formatTimestamp(lastCheckedAt)}
          </span>
        );
      default:
        return (
          <span className="border-primary/30 bg-primary/10 text-primary/80 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            待验证 · {formatTimestamp(lastCheckedAt)}
          </span>
        );
    }
  }, [apiKey, apiKeyStatus, lastCheckedAt]);

  const trimmedValue = inputValue.trim();
  const isKeyDetected = Boolean(apiKey);

  const handleSave = () => {
    if (!trimmedValue) {
      return;
    }
    setApiKey(trimmedValue);
    setShowSavedFeedback(true);
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue("");
    setShowSavedFeedback(false);
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
        <KeyRound className="mr-2 h-4 w-4" aria-hidden />
        OpenAI 密钥
      </Button>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="api-key-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: DIALOG_EASE }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 pt-12 sm:items-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 32, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.28, ease: DIALOG_EASE }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="api-key-dialog-title"
              aria-describedby="api-key-dialog-description"
              className="glass-panel relative w-full max-w-xl rounded-3xl p-6 shadow-veil"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 id="api-key-dialog-title" className="text-lg font-semibold text-fg">
                    OpenAI 接入配置
                  </h2>
                  <p
                    id="api-key-dialog-description"
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    密钥仅保存在你的浏览器本地，并在请求解读时临时透传至服务器代理。
                    如果密钥失效，可随时更新或清除。
                  </p>
                </div>
                <Button
                  ref={closeButtonRef}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  aria-label="关闭设置"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden />
                </Button>
              </header>

              <div className="mt-6 space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="openai-api-key" className="text-sm font-medium text-fg">
                    OpenAI API Key
                  </Label>
                  <Input
                    id="openai-api-key"
                    ref={inputRef}
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="例如：sk-... 或者 sk-proj-..."
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    建议使用具备 Responses API
                    权限的密钥。输入后请点击“保存密钥”，系统将自动在下一次解读时验证。
                  </p>
                </div>

                {statusChip}

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                    密钥仅存储在浏览器 localStorage，可通过浏览器设置或此处按钮清除。
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={!isKeyDetected}
                      onClick={handleClear}
                    >
                      清除密钥
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={!trimmedValue}
                      onClick={handleSave}
                    >
                      保存密钥
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {showSavedFeedback ? (
                    <motion.p
                      key="saved"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.26, ease: DIALOG_EASE }}
                      className="border-primary/40 bg-primary/10 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-primary"
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden />
                      密钥已保存，可返回占卜流程继续使用。
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
