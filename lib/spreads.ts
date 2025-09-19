export interface SpreadPosition {
  id: string;
  index: number;
  title: string;
  subtitle?: string;
  description: string;
}

export interface SpreadLayoutCard {
  positionId: string;
  x: number;
  y: number;
  rotate?: number;
  zIndex?: number;
}

export interface SpreadLayout {
  cardSize: number;
  cards: readonly SpreadLayoutCard[];
}

export interface SpreadDefinition {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  recommended: readonly string[];
  positions: readonly SpreadPosition[];
  layout: SpreadLayout;
}

export const spreads: readonly SpreadDefinition[] = [
  {
    id: "three-card",
    name: "极速三张牌",
    tagline: "过去 · 现在 · 未来",
    summary: "用于快速校准当下局势，理解过去的铺垫、此刻的关键矛盾，以及未来 3-6 周的潜在走向。",
    recommended: ["聚焦单一议题", "需要快速定向行动"],
    positions: [
      {
        id: "past",
        index: 1,
        title: "过去",
        subtitle: "Past",
        description: "塑造当前局面的背景或前因，提醒你带入的惯性。",
      },
      {
        id: "present",
        index: 2,
        title: "现在",
        subtitle: "Present",
        description: "当前的核心矛盾与动力，正在影响你下一步的选择。",
      },
      {
        id: "future",
        index: 3,
        title: "未来",
        subtitle: "Future",
        description: "若顺着当前路径发展，在近期可以预见的趋势或结果。",
      },
    ],
    layout: {
      cardSize: 28,
      cards: [
        { positionId: "past", x: 18, y: 48 },
        { positionId: "present", x: 50, y: 36 },
        { positionId: "future", x: 82, y: 50 },
      ],
    },
  },
  {
    id: "celtic-cross",
    name: "凯尔特十字",
    tagline: "洞察根因 · 阻碍 · 长期走向",
    summary:
      "经典的十张牌阵，适合复杂议题。它会拆分现状根因、外部影响、内在驱动力以及长期走向，辅助制定系统性的策略。",
    recommended: ["面对多方博弈", "需要评估长期策略"],
    positions: [
      {
        id: "significator",
        index: 1,
        title: "议题核心",
        subtitle: "Significator",
        description: "当前状况的核心主题或显化出的表层样貌。",
      },
      {
        id: "challenge",
        index: 2,
        title: "显性阻碍",
        subtitle: "Challenge",
        description: "直接阻挡进展的挑战，或你需要正面面对的问题。",
      },
      {
        id: "foundation",
        index: 3,
        title: "根基",
        subtitle: "Foundation",
        description: "推动事件演进的深层根因，往往与潜意识或结构性因素有关。",
      },
      {
        id: "recent-past",
        index: 4,
        title: "近期过去",
        subtitle: "Recent Past",
        description: "刚刚发生的事件，正在对局势产生余波。",
      },
      {
        id: "potential",
        index: 5,
        title: "潜力",
        subtitle: "Potential",
        description: "如果抓住当下的契机，可以达成的最佳潜在结果。",
      },
      {
        id: "near-future",
        index: 6,
        title: "短期未来",
        subtitle: "Near Future",
        description: "接下来 1-2 个月内的趋势或阶段性节点。",
      },
      {
        id: "self",
        index: 7,
        title: "自我立场",
        subtitle: "Self",
        description: "你在这件事中的姿态、优势或盲区。",
      },
      {
        id: "environment",
        index: 8,
        title: "外部环境",
        subtitle: "Environment",
        description: "他人或环境的影响与反馈，可能的支持或阻力。",
      },
      {
        id: "hopes-fears",
        index: 9,
        title: "期望 / 担忧",
        subtitle: "Hopes & Fears",
        description: "你或关键干系人抱持的希望与担忧，影响决策的心理面。",
      },
      {
        id: "outcome",
        index: 10,
        title: "总体走向",
        subtitle: "Outcome",
        description: "在当前路径下的长期结果，以及需要提前准备的事项。",
      },
    ],
    layout: {
      cardSize: 22,
      cards: [
        { positionId: "significator", x: 32, y: 40 },
        { positionId: "challenge", x: 32, y: 40, rotate: 90, zIndex: 1 },
        { positionId: "foundation", x: 32, y: 70 },
        { positionId: "recent-past", x: 10, y: 40 },
        { positionId: "potential", x: 32, y: 10 },
        { positionId: "near-future", x: 54, y: 40 },
        { positionId: "self", x: 76, y: 6 },
        { positionId: "environment", x: 76, y: 28 },
        { positionId: "hopes-fears", x: 76, y: 50 },
        { positionId: "outcome", x: 76, y: 72 },
      ],
    },
  },
];

export const spreadMap = Object.fromEntries(spreads.map((spread) => [spread.id, spread] as const));

export type SpreadId = (typeof spreads)[number]["id"];
