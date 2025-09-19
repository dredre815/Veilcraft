import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { tarotDeck } from "@/lib/deck";
import { spreadMap } from "@/lib/spreads";
import { InterpretRequest, InterpretRequestSchema, ReadingSchema } from "@/lib/schema";

export const runtime = "edge";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_KEY_HEADER = "x-openai-key";

const tarotDeckMap = new Map(tarotDeck.map((card) => [card.id, card] as const));

const readingJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "question",
    "spreadId",
    "overview",
    "theme",
    "cards",
    "actionItems",
    "cautions",
    "disclaimer",
  ],
  properties: {
    question: { type: "string", minLength: 1, maxLength: 400 },
    spreadId: { type: "string", minLength: 1, maxLength: 64 },
    overview: { type: "string", minLength: 30, maxLength: 400 },
    theme: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: { type: "string", minLength: 1, maxLength: 80 },
    },
    cards: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "cardId",
          "name",
          "orientation",
          "positionId",
          "summary",
          "keyFactors",
          "advice",
          "evidence",
        ],
        properties: {
          cardId: { type: "string", minLength: 1 },
          name: { type: "string", minLength: 1, maxLength: 120 },
          orientation: { enum: ["upright", "reversed"] },
          positionId: { type: "string", minLength: 1 },
          summary: { type: "string", minLength: 10, maxLength: 240 },
          keyFactors: {
            type: "array",
            minItems: 1,
            maxItems: 5,
            items: { type: "string", minLength: 4, maxLength: 160 },
          },
          advice: { type: "string", minLength: 10, maxLength: 240 },
          evidence: {
            type: "array",
            minItems: 1,
            maxItems: 3,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["cardId", "orientation", "positionId", "quotes"],
              properties: {
                cardId: { type: "string", minLength: 1 },
                orientation: { enum: ["upright", "reversed"] },
                positionId: { type: "string", minLength: 1 },
                quotes: {
                  type: "array",
                  minItems: 1,
                  maxItems: 3,
                  items: { type: "string", minLength: 3, maxLength: 200 },
                },
              },
            },
          },
        },
      },
    },
    actionItems: {
      type: "array",
      minItems: 1,
      maxItems: 5,
      items: { type: "string", minLength: 5, maxLength: 220 },
    },
    cautions: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: { type: "string", minLength: 5, maxLength: 220 },
    },
    disclaimer: { type: "string", minLength: 10, maxLength: 200 },
  },
} as const;

function buildSystemPrompt(language: string) {
  const core = `You are Veilcraft, a deterministic tarot analyst. Produce reflective yet actionable interpretations grounded in the provided card metadata and spread semantics.`;
  const format = `Respond strictly in ${language} unless otherwise specified, respecting the spread structure and the user's tone preference.`;
  const evidence = `Each card must include 1-3 evidence quotes sourced from the supplied card keywords or spread position descriptions. Evidence should be concise and unique.`;
  const integrity = `All outputs must satisfy the supplied JSON schema. Do not include any additional fields or commentary outside the JSON.`;
  return `${core}\n${format}\n${evidence}\n${integrity}`;
}

function buildUserPrompt(payload: InterpretRequest) {
  const spread = spreadMap[payload.spreadId];
  if (!spread) {
    throw new Error(`Unknown spread id: ${payload.spreadId}`);
  }

  const cardsDescription = payload.cards
    .map((cardInput, index) => {
      const card = tarotDeckMap.get(cardInput.cardId);
      if (!card) {
        throw new Error(`Unknown card id: ${cardInput.cardId}`);
      }
      const position = spread.positions.find((item) => item.id === cardInput.positionId);
      if (!position) {
        throw new Error(`Unknown position id: ${cardInput.positionId}`);
      }
      const orientationLabel = cardInput.orientation === "upright" ? "正位" : "逆位";
      const keywords = card.keywords.join("、");
      return `${index + 1}. 牌位：${position.title} (${position.subtitle ?? ""})\n   定位：${position.description}\n   抽到：${card.name} · ${orientationLabel}\n   关键词：${keywords}`;
    })
    .join("\n\n");

  return `问题：${payload.question.text}\n议题类别：${payload.question.category}\n期待语气：${payload.question.tone}\n输出语言：${payload.question.language}\n牌阵：${spread.name}（${spread.tagline}）\n\n牌面详情：\n${cardsDescription}\n\n请结合以上信息生成结构化的塔罗解读。`;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = InterpretRequestSchema.parse(json);

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

    const spread = spreadMap[payload.spreadId];
    if (!spread) {
      return NextResponse.json(
        {
          error: "spread_not_found",
          message: `Spread ${payload.spreadId} 未定义。`,
        },
        { status: 400 },
      );
    }

    const systemPrompt = buildSystemPrompt(payload.question.language);
    const userPrompt = buildUserPrompt(payload);

    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        top_p: 0.9,
        presence_penalty: 0,
        frequency_penalty: 0,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "veilcraft_reading",
            schema: readingJsonSchema,
            strict: true,
          },
        },
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
          message: "未从 OpenAI 收到有效的解读内容。",
        },
        { status: 502 },
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawContent);
    } catch (error) {
      console.error("Failed to parse OpenAI JSON", error, rawContent);
      return NextResponse.json(
        {
          error: "invalid_openai_json",
          message: "OpenAI 返回的数据无法解析，请稍后重试。",
        },
        { status: 502 },
      );
    }

    const reading = ReadingSchema.parse(parsedJson);

    const normalisedReading = {
      ...reading,
      question: payload.question.text,
      spreadId: payload.spreadId,
    };

    return NextResponse.json(normalisedReading);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Interpret request validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("/api/interpret error", error);
    return NextResponse.json(
      {
        error: "interpret_generation_failed",
        message: "生成解读时发生未知错误，请稍后重试。",
      },
      { status: 500 },
    );
  }
}
