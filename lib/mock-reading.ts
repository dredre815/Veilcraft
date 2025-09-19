import { tarotDeck } from "./deck";
import { spreadMap } from "./spreads";
import { InterpretRequest, Reading, ReadingSchema } from "./schema";

const deckById = new Map(tarotDeck.map((card) => [card.id, card] as const));

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
}

export function buildMockReading(payload: InterpretRequest): Reading {
  const spread = spreadMap[payload.spreadId];
  if (!spread) {
    throw new Error(`Unknown spread id: ${payload.spreadId}`);
  }

  const cardDetails = payload.cards.map((input) => {
    const card = deckById.get(input.cardId);
    if (!card) {
      throw new Error(`Unknown card id: ${input.cardId}`);
    }

    const position = spread.positions.find((item) => item.id === input.positionId);
    if (!position) {
      throw new Error(`Unknown position id: ${input.positionId}`);
    }

    const orientationLabel = input.orientation === "upright" ? "正位" : "逆位";
    const keywordPhrase = card.keywords.join("、");

    const summary = truncate(
      `【${position.title}】抽到 ${card.name}${orientationLabel}，象征 ${keywordPhrase} 在此位发声，呼应 ${position.description}`,
      240,
    );

    const advice = truncate(
      input.orientation === "upright"
        ? `巩固 ${position.title} 位的正向势头，利用 ${keywordPhrase} 的能量落地一项具体动作，并保持 ${payload.question.tone} 的态度。`
        : `先调校 ${position.title} 位的偏差，反思 ${keywordPhrase} 中被压抑的讯号，再以 ${payload.question.tone} 的方式重新设定节奏。`,
      240,
    );

    const keyFactors = [
      truncate(`位置焦点：${position.description}`, 120),
      truncate(`关键词提示：${keywordPhrase}`, 120),
      truncate(`取向：${orientationLabel === "正位" ? "强化长处" : "修正阻力"}`, 80),
    ];

    const evidenceQuotes = [
      truncate(position.description, 160),
      ...card.keywords.slice(0, 2).map((keyword) => `${card.name}：${keyword}`),
    ].slice(0, 3);

    return {
      read: {
        cardId: card.id,
        name: card.name,
        orientation: input.orientation,
        positionId: position.id,
        summary,
        keyFactors,
        advice,
        evidence: [
          {
            cardId: card.id,
            orientation: input.orientation,
            positionId: position.id,
            quotes: evidenceQuotes,
          },
        ],
      },
      position,
      card,
      orientationLabel,
      keywordPhrase,
    };
  });

  const focusQuestion = truncate(payload.question.text, 48);
  const aggregateKeywords = Array.from(new Set(cardDetails.flatMap((item) => item.card.keywords)));
  const theme = aggregateKeywords.slice(0, 5);

  const overview = truncate(
    `围绕「${focusQuestion}」，${spread.name} 显示 ${cardDetails
      .map(
        (detail) =>
          `${detail.position.title} 由 ${detail.card.name}${detail.orientationLabel} 主导`,
      )
      .join(
        "，",
      )}。整体能量聚焦 ${theme.slice(0, 2).join("、") || "行动与反思"}，提醒你以 ${payload.question.tone} 的姿态推进。`,
    400,
  );

  const actionItems = cardDetails
    .slice(0, Math.min(3, cardDetails.length))
    .map((detail) =>
      truncate(
        `${detail.position.title} 位建议${detail.orientationLabel === "正位" ? "延展优势" : "修正偏差"}：结合 ${detail.keywordPhrase} 制定下一步行动，并在本周安排一次复盘。`,
        200,
      ),
    );

  const reversedCards = cardDetails.filter((detail) => detail.read.orientation === "reversed");
  const cautions = reversedCards.length
    ? [
        truncate(
          `逆位的 ${reversedCards.map((detail) => detail.card.name).join("、")} 暗示潜在阻力，落地前请设置验证点，避免因假设失准而扩散风险。`,
          200,
        ),
      ]
    : [
        truncate(
          `即便整体顺利，也要为 ${theme[0] ?? "关键议题"} 预留调整空间，按阶段复盘以确保行动与初心保持对齐。`,
          200,
        ),
      ];

  const reading: Reading = {
    question: payload.question.text,
    spreadId: payload.spreadId,
    overview,
    theme: theme.length ? theme : ["聚焦执行"],
    cards: cardDetails.map((detail) => detail.read),
    actionItems: actionItems.length ? actionItems : ["将洞察写成可执行的下一步，并设定提醒。"],
    cautions,
    disclaimer:
      "以下内容旨在提供灵感与自我反思，不构成医疗、法律或金融建议。重要决策请自行判断或咨询专业人士。",
  };

  return ReadingSchema.parse(reading);
}
