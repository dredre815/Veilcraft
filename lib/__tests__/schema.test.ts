import { describe, expect, it } from "vitest";

import {
  CardReadSchema,
  FeedbackRequestSchema,
  InterpretRequestSchema,
  ReadingSchema,
  ShareRequestSchema,
} from "../schema";

const baseEvidence = {
  cardId: "the-fool",
  orientation: "upright",
  positionId: "past",
  quotes: ["勇敢迈出新的旅程。"],
};

const baseCard = {
  cardId: "the-fool",
  name: "The Fool",
  orientation: "upright",
  positionId: "past",
  summary: "这张牌提醒你保持好奇，拥抱未知，并相信自己的直觉。",
  keyFactors: ["新的旅程", "内在勇气"],
  advice: "以开放的心态接受眼前的机会，并保持脚踏实地。",
  evidence: [baseEvidence],
};

const baseReading = {
  question: "接下来我应该专注于什么方向？",
  spreadId: "three-card",
  overview:
    "你正处于重要的转折点，需要平衡新的灵感与务实的执行。抽出的牌面显示过去的探索为现在奠定基础，而未来的行动取决于你的果断。",
  theme: ["转折", "行动计划"],
  cards: [baseCard],
  actionItems: ["记录最重要的三个目标并安排执行"],
  cautions: ["不要忽略现实的限制条件"],
  disclaimer: "以上内容供自我反思之用，不构成专业建议。",
};

describe("Reading schema", () => {
  it("accepts a fully populated reading payload", () => {
    expect(() => ReadingSchema.parse(baseReading)).not.toThrow();
  });

  it("rejects readings that fall short of text requirements", () => {
    const invalid = {
      ...baseReading,
      overview: "太短",
    };

    const parsed = ReadingSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      expect(issue?.code).toBe("too_small");
      expect(issue?.path).toEqual(["overview"]);
    }
  });
});

describe("Card schema", () => {
  it("requires each evidence entry to include at least one quote", () => {
    const invalidCard = {
      ...baseCard,
      evidence: [
        {
          ...baseEvidence,
          quotes: [],
        },
      ],
    };

    const parsed = CardReadSchema.safeParse(invalidCard);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      expect(issue?.code).toBe("too_small");
      expect(issue?.path).toEqual(["evidence", 0, "quotes"]);
    }
  });
});

describe("Interpret request schema", () => {
  it("validates card inputs and question metadata", () => {
    const valid = {
      seed: "seed",
      spreadId: "three-card",
      question: {
        text: "我应该优先考虑哪些职业机会？",
        category: "career",
        tone: "grounded",
        language: "zh-CN",
      },
      cards: [
        {
          cardId: "the-fool",
          positionId: "past",
          orientation: "upright",
        },
      ],
    };

    expect(() => InterpretRequestSchema.parse(valid)).not.toThrow();
  });
});

describe("Share request schema", () => {
  it("ensures the embedded reading matches the outer payload context", () => {
    const payload = {
      seed: "seed",
      spreadId: baseReading.spreadId,
      question: {
        text: baseReading.question,
        category: "career",
        tone: "grounded",
        language: "zh-CN",
      },
      cards: [
        {
          cardId: "the-fool",
          positionId: "past",
          orientation: "upright",
        },
      ],
      reading: baseReading,
    };

    expect(() => ShareRequestSchema.parse(payload)).not.toThrow();

    const mismatchedSpread = {
      ...payload,
      reading: {
        ...baseReading,
        spreadId: "celtic-cross",
      },
    };

    expect(() => ShareRequestSchema.parse(mismatchedSpread)).toThrow(
      /Reading spread does not match payload spreadId/,
    );
  });
});

describe("Feedback request schema", () => {
  it("caps the score between 1 and 5 and trims optional comment", () => {
    const payload = {
      readingId: "reading-123",
      score: 5,
      tags: ["insightful", "actionable"],
      comment: "   非常有帮助   ",
    };

    const parsed = FeedbackRequestSchema.parse(payload);
    expect(parsed.comment).toBe("非常有帮助");

    const invalid = FeedbackRequestSchema.safeParse({
      ...payload,
      score: 6,
    });

    expect(invalid.success).toBe(false);
    if (!invalid.success) {
      const issue = invalid.error.issues[0];
      expect(issue?.code).toBe("too_big");
      expect(issue?.path).toEqual(["score"]);
    }
  });
});
