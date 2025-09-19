export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";

export interface TarotCard {
  id: string;
  name: string;
  arcana: Arcana;
  suit?: Suit;
  keywords: readonly string[];
}

export const tarotDeck: readonly TarotCard[] = [
  {
    id: "the-fool",
    name: "0 · 愚者 The Fool",
    arcana: "major",
    keywords: ["开端", "信任直觉", "跳脱舒适圈"],
  },
  {
    id: "the-magician",
    name: "I · 魔术师 The Magician",
    arcana: "major",
    keywords: ["资源整合", "专注意志", "把想法落地"],
  },
  {
    id: "the-high-priestess",
    name: "II · 女祭司 The High Priestess",
    arcana: "major",
    keywords: ["内在洞察", "静观其变", "情绪调谐"],
  },
  {
    id: "the-empress",
    name: "III · 女皇 The Empress",
    arcana: "major",
    keywords: ["滋养", "丰盛", "创造力"],
  },
  {
    id: "the-emperor",
    name: "IV · 皇帝 The Emperor",
    arcana: "major",
    keywords: ["结构", "权威", "制定规则"],
  },
  {
    id: "the-hierophant",
    name: "V · 教皇 The Hierophant",
    arcana: "major",
    keywords: ["传统智慧", "导师协助", "价值观对齐"],
  },
  {
    id: "the-lovers",
    name: "VI · 恋人 The Lovers",
    arcana: "major",
    keywords: ["选择", "信任关系", "价值观契合"],
  },
  {
    id: "the-chariot",
    name: "VII · 战车 The Chariot",
    arcana: "major",
    keywords: ["掌控方向", "自律", "推进计划"],
  },
  {
    id: "strength",
    name: "VIII · 力量 Strength",
    arcana: "major",
    keywords: ["温柔的勇气", "调驯情绪", "坚持"],
  },
  {
    id: "the-hermit",
    name: "IX · 隐士 The Hermit",
    arcana: "major",
    keywords: ["独处思辨", "寻找真相", "慢下来"],
  },
  {
    id: "wheel-of-fortune",
    name: "X · 命运之轮 Wheel of Fortune",
    arcana: "major",
    keywords: ["周期变动", "抓住窗口", "顺势调整"],
  },
  {
    id: "justice",
    name: "XI · 正义 Justice",
    arcana: "major",
    keywords: ["取舍", "平衡利弊", "承担后果"],
  },
  {
    id: "the-hanged-man",
    name: "XII · 倒吊人 The Hanged Man",
    arcana: "major",
    keywords: ["换位思考", "暂停观察", "价值再评估"],
  },
  {
    id: "death",
    name: "XIII · 死神 Death",
    arcana: "major",
    keywords: ["阶段终结", "清理旧制", "迎接重生"],
  },
  {
    id: "temperance",
    name: "XIV · 节制 Temperance",
    arcana: "major",
    keywords: ["调和", "节奏感", "跨界整合"],
  },
  {
    id: "the-devil",
    name: "XV · 恶魔 The Devil",
    arcana: "major",
    keywords: ["束缚", "成瘾循环", "权力结构"],
  },
  {
    id: "the-tower",
    name: "XVI · 高塔 The Tower",
    arcana: "major",
    keywords: ["突发事件", "打破旧框", "危机觉醒"],
  },
  {
    id: "the-star",
    name: "XVII · 星星 The Star",
    arcana: "major",
    keywords: ["信念", "疗愈", "长期愿景"],
  },
  {
    id: "the-moon",
    name: "XVIII · 月亮 The Moon",
    arcana: "major",
    keywords: ["潜意识", "不确定", "敏感直觉"],
  },
  {
    id: "the-sun",
    name: "XIX · 太阳 The Sun",
    arcana: "major",
    keywords: ["乐观", "清晰度", "公开肯定"],
  },
  {
    id: "judgement",
    name: "XX · 审判 Judgement",
    arcana: "major",
    keywords: ["觉醒", "回应召唤", "阶段总结"],
  },
  {
    id: "the-world",
    name: "XXI · 世界 The World",
    arcana: "major",
    keywords: ["完成", "整合", "全球视角"],
  },
];
