import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { tarotDeck } from "@/lib/deck";
import { spreadMap } from "@/lib/spreads";
import {
  ConversationTurn,
  InterpretFollowUpRequest,
  InterpretFollowUpRequestSchema,
} from "@/lib/schema";

export const runtime = "edge";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY_HEADER = "x-openai-key";

const tarotDeckMap = new Map(tarotDeck.map((card) => [card.id, card] as const));

function buildReadingContext(reading: InterpretFollowUpRequest["reading"]) {
  const lines: string[] = [];
  lines.push(`原始问题：${reading.question}`);
  lines.push(`概览：${reading.overview}`);
  if (reading.theme?.length) {
    lines.push(`主题标签：${reading.theme.join(" / ")}`);
  }
  lines.push("牌位摘要：");
  reading.cards.forEach((card, index) => {
    const orientationLabel = card.orientation === "upright" ? "正位" : "逆位";
    lines.push(
      `${index + 1}. ${card.name}（${orientationLabel}，位置 ${card.positionId}）：${card.summary}`,
    );
  });
  if (reading.actionItems?.length) {
    lines.push(`行动建议：${reading.actionItems.join("；")}`);
  }
  if (reading.cautions?.length) {
    lines.push(`风险提醒：${reading.cautions.join("；")}`);
  }
  lines.push(`免责声明：${reading.disclaimer}`);
  return lines.join("\n");
}

function buildCardMetaPayload(payload: InterpretFollowUpRequest) {
  const spread = spreadMap[payload.spreadId];
  if (!spread) {
    throw new Error(`Unknown spread id: ${payload.spreadId}`);
  }
  return payload.cards
    .map((cardInput) => {
      const card = tarotDeckMap.get(cardInput.cardId);
      const position = spread.positions.find((item) => item.id === cardInput.positionId);
      if (!card || !position) {
        return null;
      }
      const orientationLabel = cardInput.orientation === "upright" ? "正位" : "逆位";
      return `${card.name}（${orientationLabel}）：关键词 ${card.keywords.join("、")}；位置 ${position.title}：${position.description}`;
    })
    .filter((value): value is string => Boolean(value))
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = InterpretFollowUpRequestSchema.parse(json);

    const apiKey = request.headers.get(OPENAI_KEY_HEADER);
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "missing_api_key",
          message: "缺少 OpenAI API Key，请在设置中填写后重试。",
        },
        { status: 401 },
      );
    }

    const readingContext = buildReadingContext(payload.reading);
    const cardMeta = buildCardMetaPayload(payload);

    const conversationMessages = payload.conversation.map((turn) => ({
      role: turn.role,
      content: turn.content,
    }));

    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are Veilcraft, continuing a tarot reading conversation. Stay consistent with the established interpretation while offering actionable, empathetic guidance. Reference evidence deliberately and never contradict validated outputs.",
          },
          {
            role: "assistant",
            content: `以下是当前牌阵解读的摘要：\n${readingContext}\n\n牌面元数据：\n${cardMeta}`,
          },
          ...conversationMessages,
          {
            role: "user",
            content: payload.prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const message = errorJson?.error?.message ?? errorJson?.message ?? "OpenAI 请求失败";
      const status = response.status === 401 || response.status === 403 ? 401 : 502;
      return NextResponse.json(
        {
          error: status === 401 ? "invalid_api_key" : "openai_error",
          message: status === 401 ? "OpenAI 密钥无效或权限不足，请重新设置。" : message,
          details: status === 401 ? undefined : errorJson,
        },
        { status },
      );
    }

    const completion = await response.json();
    const rawContent: unknown = completion?.choices?.[0]?.message?.content;
    if (typeof rawContent !== "string") {
      return NextResponse.json(
        {
          error: "invalid_openai_response",
          message: "未从 OpenAI 收到有效的对话回答。",
        },
        { status: 502 },
      );
    }

    const reply: ConversationTurn = {
      role: "assistant",
      content: rawContent.trim(),
      createdAt: Date.now(),
    };

    return NextResponse.json(reply);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Follow-up request validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("/api/interpret/chat error", error);
    return NextResponse.json(
      {
        error: "follow_up_failed",
        message: "生成追问回答时发生未知错误，请稍后重试。",
      },
      { status: 500 },
    );
  }
}
