import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { tarotDeck } from "../../../../lib/deck";
import type { DrawResult } from "../../../../lib/draw";
import type { Reading } from "../../../../lib/schema";
import { spreads } from "../../../../lib/spreads";

let useReadingStore: typeof import("../use-reading-store").useReadingStore;

beforeEach(async () => {
  vi.useRealTimers();
  vi.resetModules();
  ({ useReadingStore } = await import("../use-reading-store"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useReadingStore", () => {
  it("records question metadata with a generated timestamp when omitted", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-01T10:00:00Z"));

    const { setQuestion } = useReadingStore.getState();

    setQuestion({
      question: "我应该把精力集中在哪些目标上？",
      category: "career",
      tone: "grounded",
      language: "zh-CN",
    });

    const state = useReadingStore.getState();

    expect(state.question).toEqual({
      question: "我应该把精力集中在哪些目标上？",
      category: "career",
      tone: "grounded",
      language: "zh-CN",
      submittedAt: new Date("2025-02-01T10:00:00Z").getTime(),
    });

    vi.useRealTimers();
  });

  it("transitions through draw phases as cards are revealed", () => {
    const spread = spreads[0];
    const drawResult: DrawResult = {
      seed: "seed-123",
      spreadId: spread.id,
      cards: spread.positions.map((position, index) => ({
        index,
        positionId: position.id,
        card: tarotDeck[index],
        orientation: "upright",
      })),
    };

    const { beginDraw, completeShuffle, revealNext } = useReadingStore.getState();

    beginDraw(drawResult);

    let state = useReadingStore.getState();
    expect(state.phase).toBe("shuffling");
    expect(state.cards).toHaveLength(spread.positions.length);
    expect(state.revealIndex).toBe(0);

    completeShuffle();
    state = useReadingStore.getState();
    expect(state.phase).toBe("revealing");

    for (let i = 0; i < spread.positions.length; i += 1) {
      revealNext();
    }

    state = useReadingStore.getState();
    expect(state.phase).toBe("complete");
    expect(state.revealIndex).toBe(spread.positions.length);
  });

  it("stores interpretation results and exposes error handling helpers", () => {
    const sampleReading: Reading = {
      question: "接下来如何把握新的合作机会？",
      spreadId: "three-card",
      overview:
        "阅读显示目前的合作伙伴期待更明确的承诺，而未来的发展取决于你如何设定边界并主动沟通。",
      theme: ["合作", "沟通"],
      cards: [
        {
          cardId: "the-fool",
          name: "The Fool",
          orientation: "upright",
          positionId: "present",
          summary: "保持好奇与开放的心态能帮助你探索新的合作可能性。",
          keyFactors: ["信任建立", "新视角"],
          advice: "给合作对象一个明确的试运行计划，并说明期望的成果。",
          evidence: [
            {
              cardId: "the-fool",
              orientation: "upright",
              positionId: "present",
              quotes: ["以轻盈的步伐拥抱未知的合作。"],
            },
          ],
        },
      ],
      actionItems: ["明确合作目标并安排首次对齐会议"],
      cautions: ["避免承诺超出可交付的范围"],
      disclaimer: "内容仅供自我反思使用，不构成专业建议。",
    };

    const {
      setInterpretationPending,
      setInterpretationSuccess,
      setInterpretationError,
      resetInterpretation,
      appendConversationTurn,
    } = useReadingStore.getState();

    setInterpretationPending();
    let state = useReadingStore.getState();
    expect(state.interpretStatus).toBe("loading");
    expect(state.reading).toBeNull();
    expect(state.conversation).toEqual([]);

    setInterpretationSuccess(sampleReading);
    state = useReadingStore.getState();
    expect(state.interpretStatus).toBe("success");
    expect(state.reading).toEqual(sampleReading);
    expect(state.interpretError).toBeNull();
    expect(state.conversation).toEqual([]);

    appendConversationTurn({
      role: "user",
      content: "帮我深入看一下行动建议",
      createdAt: Date.now(),
    });
    state = useReadingStore.getState();
    expect(state.conversation).toHaveLength(1);

    setInterpretationError("Network error");
    state = useReadingStore.getState();
    expect(state.interpretStatus).toBe("error");
    expect(state.interpretError).toBe("Network error");
    expect(state.conversation).toEqual([]);

    resetInterpretation();
    state = useReadingStore.getState();
    expect(state.interpretStatus).toBe("idle");
    expect(state.reading).toBeNull();
    expect(state.interpretError).toBeNull();
    expect(state.conversation).toEqual([]);
  });
});
