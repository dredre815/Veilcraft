"use client";

import { FormEvent, useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Loader2, MessageCircle, RefreshCcw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ConversationTurn } from "@/lib/schema";
import { useOpenAiSettings } from "@/app/read/store/use-openai-settings";
import { useReadingStore } from "../store/use-reading-store";
import { useReadingArchive } from "../store/use-reading-archive";

const CHAT_EASE = [0.2, 0.9, 0.2, 1] as const;

export function InterpretationChat() {
  const question = useReadingStore((state) => state.question);
  const seed = useReadingStore((state) => state.seed);
  const spreadId = useReadingStore((state) => state.spreadId);
  const cards = useReadingStore((state) => state.cards);
  const reading = useReadingStore((state) => state.reading);
  const conversation = useReadingStore((state) => state.conversation);
  const appendConversationTurn = useReadingStore((state) => state.appendConversationTurn);
  const resetConversation = useReadingStore((state) => state.resetConversation);

  const apiKey = useOpenAiSettings((state) => state.apiKey);
  const markApiKeyStatus = useOpenAiSettings((state) => state.markApiKeyStatus);
  const apiKeyStatus = useOpenAiSettings((state) => state.apiKeyStatus);
  const appendArchiveConversation = useReadingArchive((state) => state.appendConversation);
  const resetArchiveConversation = useReadingArchive((state) => state.resetConversation);

  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const canChat = Boolean(apiKey && question && reading && seed && cards.length > 0);

  const conversationWithMeta = useMemo(() => {
    if (!conversation.length) {
      return [] as ConversationTurn[];
    }
    return conversation;
  }, [conversation]);

  const scrollToBottom = useCallback(() => {
    window.setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  }, []);

  const handleSubmit = useCallback(
    async (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const trimmed = prompt.trim();
      if (!trimmed || !canChat || !question || !reading) {
        return;
      }

      const questionPayload = {
        text: question.question,
        category: question.category,
        tone: question.tone,
        language: question.language,
      };
      const cardPayload = cards.map((card) => ({
        cardId: card.card.id,
        positionId: card.positionId,
        orientation: card.orientation,
      }));

      const key = apiKey;
      if (!key) {
        setErrorMessage("请先在设置中填写有效的 OpenAI 密钥。");
        return;
      }

      if (!seed) {
        setErrorMessage("当前解读缺少 seed，无法记录追问。");
        return;
      }

      const previousTurns = [...conversation];
      const userTurn: ConversationTurn = {
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };

      appendConversationTurn(userTurn);
      appendArchiveConversation(seed, userTurn);
      setPrompt("");
      setErrorMessage(null);
      setIsSending(true);
      scrollToBottom();

      try {
        const response = await fetch("/api/interpret/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-openai-key": key,
          },
          body: JSON.stringify({
            seed,
            spreadId,
            question: questionPayload,
            cards: cardPayload,
            reading,
            conversation: previousTurns,
            prompt: trimmed,
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            markApiKeyStatus("invalid");
          }
          const errorJson = await response.json().catch(() => null);
          const message = errorJson?.message ?? "追问失败，请稍后重试。";
          setErrorMessage(message);
          return;
        }

        markApiKeyStatus("valid");
        const reply = (await response.json()) as ConversationTurn;
        appendConversationTurn(reply);
        appendArchiveConversation(seed, reply);
        scrollToBottom();
      } catch (error) {
        console.error("Failed to submit follow-up", error);
        setErrorMessage("网络异常，稍后再试或检查网络连接。");
      } finally {
        setIsSending(false);
      }
    },
    [
      apiKey,
      appendArchiveConversation,
      appendConversationTurn,
      canChat,
      cards,
      conversation,
      markApiKeyStatus,
      prompt,
      question,
      reading,
      scrollToBottom,
      seed,
      spreadId,
    ],
  );

  if (!reading) {
    return null;
  }

  return (
    <section className="glass-panel rounded-[28px] p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-fg">追问 · Conversation</h3>
          <p className="text-sm text-muted-foreground">
            针对解读继续提问，Veilcraft 会结合原牌阵与上下文给出进一步建议。
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => {
            resetConversation();
            if (seed) {
              resetArchiveConversation(seed);
            }
            setErrorMessage(null);
            setPrompt("");
          }}
          disabled={!conversation.length && !prompt}
        >
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden />
          清空对话
        </Button>
      </header>

      {!canChat ? (
        <div className="border-border/60 mt-6 flex flex-col items-center gap-4 rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_86%,transparent)] px-6 py-8 text-center text-sm text-muted-foreground">
          <MessageCircle className="h-10 w-10 text-primary" aria-hidden />
          <p>需先完成抽牌解读并在右上角设置 OpenAI API Key 后，方可开启追问对话。</p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <div className="border-border/60 max-h-[280px] space-y-3 overflow-y-auto rounded-3xl border bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-4">
            {conversationWithMeta.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                开启对话吧：例如 “如果我想在三周内推进，这套行动的优先顺序建议怎么排？”
              </p>
            ) : (
              conversationWithMeta.map((turn, index) => (
                <motion.div
                  key={`${turn.role}-${turn.createdAt ?? index}`}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.24, ease: CHAT_EASE }}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    turn.role === "assistant"
                      ? "bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] text-fg"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {turn.content}
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <label
                htmlFor="follow-up-prompt"
                className="text-xs uppercase tracking-[0.28em] text-muted-foreground"
              >
                你的追问
              </label>
              <Textarea
                id="follow-up-prompt"
                minLength={3}
                maxLength={600}
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="写下你想继续深挖的角度，例如：针对行动建议 A，还有什么证据或注意事项？"
                disabled={isSending}
                className="min-h-[120px] text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <AnimatePresence>
                {errorMessage ? (
                  <motion.div
                    key="chat-error"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.26, ease: CHAT_EASE }}
                    className="inline-flex items-center gap-2 text-sm text-danger"
                  >
                    <AlertTriangle className="h-4 w-4" aria-hidden />
                    {errorMessage}
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {apiKeyStatus === "invalid" ? "当前密钥验证失败，请检查设置。" : null}
              </div>
              <Button type="submit" disabled={isSending || !prompt.trim()}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    发送中
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" aria-hidden />
                    发送追问
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
