import { beforeEach, describe, expect, it } from "vitest";

import type { Reading } from "@/lib/schema";

let useReadingArchive: typeof import("../use-reading-archive").useReadingArchive;

const baseReading: Reading = {
  question: "测试问题",
  spreadId: "three-card",
  overview: "整体能量指向新的机会与沟通窗口。",
  theme: ["行动", "洞察"],
  cards: [
    {
      cardId: "the-fool",
      name: "0 · 愚者 The Fool",
      orientation: "upright",
      positionId: "present",
      summary: "保持好奇与轻盈，抓住出现的新选项。",
      keyFactors: ["保持开放", "勇敢尝试"],
      advice: "以小步实验启动，及时校准。",
      evidence: [
        {
          cardId: "the-fool",
          orientation: "upright",
          positionId: "present",
          quotes: ["愚者暗示新的旅程和信任直觉。"],
        },
      ],
    },
  ],
  actionItems: ["列出 3 个可以立即执行的试验"],
  cautions: ["避免忽视安全网与资源承诺"],
  disclaimer: "内容仅供自我反思使用，不构成专业意见。",
};

describe("useReadingArchive", () => {
  beforeEach(async () => {
    const archiveModule = await import("../use-reading-archive");
    useReadingArchive = archiveModule.useReadingArchive;
    useReadingArchive.persist?.clearStorage?.();
    useReadingArchive.setState({ entries: [] });
  });

  it("saves readings and appends conversations", () => {
    const { saveReading, appendConversation, resetConversation, saveFeedback } =
      useReadingArchive.getState();

    saveReading({
      seed: "seed-1",
      spreadId: "three-card",
      question: {
        question: "测试问题",
        category: "career",
        tone: "measured",
        language: "zh-CN",
      },
      reading: baseReading,
    });

    let state = useReadingArchive.getState();
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0]?.conversation).toEqual([]);

    appendConversation("seed-1", { role: "user", content: "继续深入" });
    appendConversation("seed-1", { role: "assistant", content: "给出后续建议" });

    state = useReadingArchive.getState();
    expect(state.entries[0]?.conversation).toHaveLength(2);

    saveFeedback("seed-1", {
      score: 4,
      tags: ["启发"],
      comment: "很实用",
      submittedAt: Date.now(),
    });

    state = useReadingArchive.getState();
    expect(state.entries[0]?.feedback?.score).toBe(4);

    resetConversation("seed-1");
    state = useReadingArchive.getState();
    expect(state.entries[0]?.conversation).toEqual([]);
  });
});
