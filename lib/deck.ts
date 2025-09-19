export type Arcana = "major" | "minor";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type MinorRank =
  | "ace"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten"
  | "page"
  | "knight"
  | "queen"
  | "king";

export interface CardTheme {
  palette: readonly [string, string];
  glow: string;
  pattern:
    | "ray"
    | "wave"
    | "petal"
    | "spark"
    | "rune"
    | "ember"
    | "tidal"
    | "gale"
    | "terra"
    | "nova";
  glyph: string;
}

export interface TarotCard {
  id: string;
  name: string;
  arcana: Arcana;
  number?: number;
  suit?: Suit;
  rank?: MinorRank;
  keywords: readonly string[];
  upright: string;
  reversed: string;
  theme: CardTheme;
}

const majorArcana: readonly TarotCard[] = [
  {
    id: "the-fool",
    name: "0 · 愚者 The Fool",
    arcana: "major",
    number: 0,
    keywords: ["开端", "信任直觉", "跳脱舒适圈"],
    upright: "拥抱未知，带着轻装与好奇迈出第一步。",
    reversed: "鲁莽或准备不足，让机会变成风险。",
    theme: {
      palette: ["#F9D976", "#F39F86"],
      glow: "rgba(255,214,102,0.45)",
      pattern: "nova",
      glyph: "feather",
    },
  },
  {
    id: "the-magician",
    name: "I · 魔术师 The Magician",
    arcana: "major",
    number: 1,
    keywords: ["资源整合", "专注意志", "把想法落地"],
    upright: "善用手边资源，将灵感转化为具象行动。",
    reversed: "力量被滥用或分散，需回到初心与诚信。",
    theme: {
      palette: ["#FF9A8B", "#FF6A88"],
      glow: "rgba(255,122,136,0.42)",
      pattern: "ray",
      glyph: "infinity",
    },
  },
  {
    id: "the-high-priestess",
    name: "II · 女祭司 The High Priestess",
    arcana: "major",
    number: 2,
    keywords: ["内在洞察", "静观其变", "情绪调谐"],
    upright: "暂停外界喧闹，聆听潜意识的低语。",
    reversed: "直觉被压抑或情绪失衡，需要时间梳理。",
    theme: {
      palette: ["#A18CD1", "#FBC2EB"],
      glow: "rgba(156,132,209,0.4)",
      pattern: "wave",
      glyph: "crescent",
    },
  },
  {
    id: "the-empress",
    name: "III · 女皇 The Empress",
    arcana: "major",
    number: 3,
    keywords: ["滋养", "丰盛", "创造力"],
    upright: "以宽厚与审美为项目注入可持续的滋养。",
    reversed: "界线模糊，过度付出令自己枯竭。",
    theme: {
      palette: ["#FAD0C4", "#FFD1FF"],
      glow: "rgba(247,186,196,0.45)",
      pattern: "petal",
      glyph: "lotus",
    },
  },
  {
    id: "the-emperor",
    name: "IV · 皇帝 The Emperor",
    arcana: "major",
    number: 4,
    keywords: ["结构", "权威", "制定规则"],
    upright: "建立边界与制度，让团队运转有章可循。",
    reversed: "僵化或控制过度，忽视弹性与人心。",
    theme: {
      palette: ["#F5576C", "#F093FB"],
      glow: "rgba(242,87,108,0.4)",
      pattern: "rune",
      glyph: "crown",
    },
  },
  {
    id: "the-hierophant",
    name: "V · 教皇 The Hierophant",
    arcana: "major",
    number: 5,
    keywords: ["传统智慧", "导师协助", "价值观对齐"],
    upright: "借重制度与经验，确保团队价值一致。",
    reversed: "盲从权威或流程，忽略真实需求。",
    theme: {
      palette: ["#96FBC4", "#F9F586"],
      glow: "rgba(150,251,196,0.4)",
      pattern: "wave",
      glyph: "pillar",
    },
  },
  {
    id: "the-lovers",
    name: "VI · 恋人 The Lovers",
    arcana: "major",
    number: 6,
    keywords: ["选择", "信任关系", "价值观契合"],
    upright: "以真诚沟通建立长期合作的共同愿景。",
    reversed: "价值冲突或承诺模糊，需要重新对齐。",
    theme: {
      palette: ["#FCCF31", "#F55555"],
      glow: "rgba(245,85,85,0.42)",
      pattern: "spark",
      glyph: "union",
    },
  },
  {
    id: "the-chariot",
    name: "VII · 战车 The Chariot",
    arcana: "major",
    number: 7,
    keywords: ["掌控方向", "自律", "推进计划"],
    upright: "锁定目标并坚持节奏，掌控前行方向。",
    reversed: "分心或拉扯让能量耗散，需重新掌舵。",
    theme: {
      palette: ["#4FACFE", "#00F2FE"],
      glow: "rgba(79,172,254,0.42)",
      pattern: "ray",
      glyph: "compass",
    },
  },
  {
    id: "strength",
    name: "VIII · 力量 Strength",
    arcana: "major",
    number: 8,
    keywords: ["温柔的勇气", "调驯情绪", "坚持"],
    upright: "以柔克刚，保持内在稳定与稳定领导力。",
    reversed: "内耗或自我怀疑，削弱行动力量。",
    theme: {
      palette: ["#FFB347", "#FFCC33"],
      glow: "rgba(255,179,71,0.45)",
      pattern: "ember",
      glyph: "lion",
    },
  },
  {
    id: "the-hermit",
    name: "IX · 隐士 The Hermit",
    arcana: "major",
    number: 9,
    keywords: ["独处思辨", "寻找真相", "慢下来"],
    upright: "退一步精炼洞见，为下一阶段点灯。",
    reversed: "过度退缩成孤立，信息闭塞。",
    theme: {
      palette: ["#8EC5FC", "#E0C3FC"],
      glow: "rgba(142,197,252,0.4)",
      pattern: "wave",
      glyph: "lantern",
    },
  },
  {
    id: "wheel-of-fortune",
    name: "X · 命运之轮 Wheel of Fortune",
    arcana: "major",
    number: 10,
    keywords: ["周期变动", "抓住窗口", "顺势调整"],
    upright: "识别趋势转折，顺势而为创造新局。",
    reversed: "抗拒改变或错失时机，需快速校正。",
    theme: {
      palette: ["#84FAB0", "#8FD3F4"],
      glow: "rgba(132,250,176,0.38)",
      pattern: "spark",
      glyph: "wheel",
    },
  },
  {
    id: "justice",
    name: "XI · 正义 Justice",
    arcana: "major",
    number: 11,
    keywords: ["取舍", "平衡利弊", "承担后果"],
    upright: "权衡事实与价值，做出负责任的决定。",
    reversed: "偏颇或信息不全，需要补足证据。",
    theme: {
      palette: ["#C9D6FF", "#E2E2E2"],
      glow: "rgba(201,214,255,0.35)",
      pattern: "rune",
      glyph: "scale",
    },
  },
  {
    id: "the-hanged-man",
    name: "XII · 倒吊人 The Hanged Man",
    arcana: "major",
    number: 12,
    keywords: ["换位思考", "暂停观察", "价值再评估"],
    upright: "以不同视角审视问题，等待合适突破口。",
    reversed: "停滞过久或自我牺牲，行动感被拖慢。",
    theme: {
      palette: ["#A1C4FD", "#C2E9FB"],
      glow: "rgba(161,196,253,0.4)",
      pattern: "wave",
      glyph: "spiral",
    },
  },
  {
    id: "death",
    name: "XIII · 死神 Death",
    arcana: "major",
    number: 13,
    keywords: ["阶段终结", "清理旧制", "迎接重生"],
    upright: "果断结束过时结构，为新生腾出空间。",
    reversed: "对终结的抗拒，让转型拖得痛苦。",
    theme: {
      palette: ["#232526", "#414345"],
      glow: "rgba(35,37,38,0.45)",
      pattern: "rune",
      glyph: "phoenix",
    },
  },
  {
    id: "temperance",
    name: "XIV · 节制 Temperance",
    arcana: "major",
    number: 14,
    keywords: ["调和", "节奏感", "跨界整合"],
    upright: "掌握调和力度，将不同资源融合成新解。",
    reversed: "节奏失衡或过度妥协，需要校准比例。",
    theme: {
      palette: ["#F6D365", "#FDA085"],
      glow: "rgba(246,211,101,0.42)",
      pattern: "petal",
      glyph: "alchemical",
    },
  },
  {
    id: "the-devil",
    name: "XV · 恶魔 The Devil",
    arcana: "major",
    number: 15,
    keywords: ["束缚", "成瘾循环", "权力结构"],
    upright: "看见被束缚的模式，选择主动解锁。",
    reversed: "借口或恐惧让你继续留在低效循环。",
    theme: {
      palette: ["#4B134F", "#C94B4B"],
      glow: "rgba(75,19,79,0.42)",
      pattern: "ember",
      glyph: "chain",
    },
  },
  {
    id: "the-tower",
    name: "XVI · 高塔 The Tower",
    arcana: "major",
    number: 16,
    keywords: ["突发事件", "打破旧框", "危机觉醒"],
    upright: "突变提醒你拆解老旧结构，重新搭建。",
    reversed: "拖延必要的崩解，风险累积更大。",
    theme: {
      palette: ["#0F2027", "#2C5364"],
      glow: "rgba(44,83,100,0.45)",
      pattern: "spark",
      glyph: "lightning",
    },
  },
  {
    id: "the-star",
    name: "XVII · 星星 The Star",
    arcana: "major",
    number: 17,
    keywords: ["信念", "疗愈", "长期愿景"],
    upright: "重申初心，温柔修复并继续向愿景迈进。",
    reversed: "信心动摇或停留幻想，需要具体行动。",
    theme: {
      palette: ["#89F7FE", "#66A6FF"],
      glow: "rgba(137,247,254,0.38)",
      pattern: "ray",
      glyph: "star",
    },
  },
  {
    id: "the-moon",
    name: "XVIII · 月亮 The Moon",
    arcana: "major",
    number: 18,
    keywords: ["潜意识", "不确定", "敏感直觉"],
    upright: "辨识情绪和幻象，循着直觉前行。",
    reversed: "过度猜测引发焦虑，回到事实校准。",
    theme: {
      palette: ["#20002C", "#CBB4D4"],
      glow: "rgba(105,76,125,0.45)",
      pattern: "wave",
      glyph: "moon",
    },
  },
  {
    id: "the-sun",
    name: "XIX · 太阳 The Sun",
    arcana: "major",
    number: 19,
    keywords: ["乐观", "清晰度", "公开肯定"],
    upright: "高能见度与正面反馈使计划顺势扩展。",
    reversed: "过度耗能或自满，导致成果黯淡。",
    theme: {
      palette: ["#FF512F", "#DD2476"],
      glow: "rgba(255,81,47,0.45)",
      pattern: "ray",
      glyph: "sun",
    },
  },
  {
    id: "judgement",
    name: "XX · 审判 Judgement",
    arcana: "major",
    number: 20,
    keywords: ["觉醒", "回应召唤", "阶段总结"],
    upright: "回应内心召唤，整合经验后选择升级。",
    reversed: "害怕评价或拖延决定，错过重生窗口。",
    theme: {
      palette: ["#43CBFF", "#9708CC"],
      glow: "rgba(151,8,204,0.38)",
      pattern: "rune",
      glyph: "trumpet",
    },
  },
  {
    id: "the-world",
    name: "XXI · 世界 The World",
    arcana: "major",
    number: 21,
    keywords: ["完成", "整合", "全球视角"],
    upright: "项目圆满收官，开启更大舞台与循环。",
    reversed: "收尾仍有漏洞，需补完后再前行。",
    theme: {
      palette: ["#11998E", "#38EF7D"],
      glow: "rgba(17,153,142,0.42)",
      pattern: "wave",
      glyph: "orb",
    },
  },
];

interface MinorCardInput {
  rank: MinorRank;
  keywords: string[];
  upright: string;
  reversed: string;
  theme: CardTheme;
}

const makeMinorCards = (suit: Suit, entries: readonly MinorCardInput[]) =>
  entries.map(
    (entry) =>
      ({
        id: `${entry.rank}-of-${suit}`,
        name: `${suitToLabel(suit)}${rankToLabel(entry.rank)} ${rankToEnglish(entry.rank)} of ${suitToEnglish(suit)}`,
        arcana: "minor" as const,
        suit,
        rank: entry.rank,
        keywords: entry.keywords,
        upright: entry.upright,
        reversed: entry.reversed,
        theme: entry.theme,
      }) satisfies TarotCard,
  );

function suitToLabel(suit: Suit): string {
  switch (suit) {
    case "wands":
      return "权杖";
    case "cups":
      return "圣杯";
    case "swords":
      return "宝剑";
    case "pentacles":
      return "钱币";
    default:
      return "";
  }
}

function suitToEnglish(suit: Suit): string {
  switch (suit) {
    case "wands":
      return "Wands";
    case "cups":
      return "Cups";
    case "swords":
      return "Swords";
    case "pentacles":
      return "Pentacles";
    default:
      return "";
  }
}

function rankToLabel(rank: MinorRank): string {
  const map: Record<MinorRank, string> = {
    ace: "首牌",
    two: "二",
    three: "三",
    four: "四",
    five: "五",
    six: "六",
    seven: "七",
    eight: "八",
    nine: "九",
    ten: "十",
    page: "侍从",
    knight: "骑士",
    queen: "皇后",
    king: "国王",
  };
  return map[rank];
}

function rankToEnglish(rank: MinorRank): string {
  const map: Record<MinorRank, string> = {
    ace: "Ace",
    two: "Two",
    three: "Three",
    four: "Four",
    five: "Five",
    six: "Six",
    seven: "Seven",
    eight: "Eight",
    nine: "Nine",
    ten: "Ten",
    page: "Page",
    knight: "Knight",
    queen: "Queen",
    king: "King",
  };
  return map[rank];
}

const wandsCards = makeMinorCards("wands", [
  {
    rank: "ace",
    keywords: ["灵感火花", "启动", "勇气"],
    upright: "把握突如其来的创意与行动冲动。",
    reversed: "热情被压抑，点火前先排除阻碍。",
    theme: {
      palette: ["#FF512F", "#DD2476"],
      glow: "rgba(255,115,77,0.45)",
      pattern: "ember",
      glyph: "torch",
    },
  },
  {
    rank: "two",
    keywords: ["规划蓝图", "全局视野", "权力平衡"],
    upright: "评估资源与伙伴，为扩张定好路线图。",
    reversed: "缺乏行动或对合作犹疑。",
    theme: {
      palette: ["#F7971E", "#FFD200"],
      glow: "rgba(247,151,30,0.45)",
      pattern: "ray",
      glyph: "axis",
    },
  },
  {
    rank: "three",
    keywords: ["远景", "合作布局", "拓展市场"],
    upright: "向外延伸资源，等待成果归航。",
    reversed: "部署或物流延迟，需要调整期望。",
    theme: {
      palette: ["#FFB75E", "#ED8F03"],
      glow: "rgba(255,183,94,0.45)",
      pattern: "ray",
      glyph: "harbor",
    },
  },
  {
    rank: "four",
    keywords: ["庆祝阶段", "稳定", "社群"],
    upright: "阶段性成果落地，与团队共享里程碑。",
    reversed: "喜悦短暂或归属感不足，需重视社群。",
    theme: {
      palette: ["#FFAFBD", "#ffc3a0"],
      glow: "rgba(255,175,189,0.4)",
      pattern: "petal",
      glyph: "arch",
    },
  },
  {
    rank: "five",
    keywords: ["竞争碰撞", "试错", "定位"],
    upright: "健康竞争促成长，明确规则与共识。",
    reversed: "争执失去焦点，耗费团队能量。",
    theme: {
      palette: ["#F83600", "#FE8C00"],
      glow: "rgba(248,54,0,0.45)",
      pattern: "ember",
      glyph: "sparks",
    },
  },
  {
    rank: "six",
    keywords: ["胜利", "认可", "公开肯定"],
    upright: "成果受到认可，适度展示并鼓舞队伍。",
    reversed: "虚荣或期待落空，需内部调和。",
    theme: {
      palette: ["#FF5858", "#F09819"],
      glow: "rgba(255,88,88,0.45)",
      pattern: "ray",
      glyph: "laurel",
    },
  },
  {
    rank: "seven",
    keywords: ["捍卫立场", "策略应对", "保持优势"],
    upright: "占得有利位置，持续用策略回应挑战。",
    reversed: "压力过大或防守过度，可考虑合作。",
    theme: {
      palette: ["#EB3349", "#F45C43"],
      glow: "rgba(235,51,73,0.45)",
      pattern: "ember",
      glyph: "bastion",
    },
  },
  {
    rank: "eight",
    keywords: ["迅速推进", "消息传递", "目标一致"],
    upright: "速度与协同显著提升，保持沟通顺畅。",
    reversed: "过度匆忙导致混乱，需规划缓冲。",
    theme: {
      palette: ["#FF512F", "#F09819"],
      glow: "rgba(255,112,47,0.45)",
      pattern: "ray",
      glyph: "arrows",
    },
  },
  {
    rank: "nine",
    keywords: ["韧性", "防御", "临界点"],
    upright: "守住阵地，调配最后资源迎接收官。",
    reversed: "倦怠或多疑，需寻求支持。",
    theme: {
      palette: ["#C02425", "#F0CB35"],
      glow: "rgba(192,36,37,0.45)",
      pattern: "ember",
      glyph: "barricade",
    },
  },
  {
    rank: "ten",
    keywords: ["负载", "责任", "收官压力"],
    upright: "承担必要责任，规划卸载与交接。",
    reversed: "负担过重需要委派与优化。",
    theme: {
      palette: ["#F857A6", "#FF5858"],
      glow: "rgba(248,87,166,0.4)",
      pattern: "ember",
      glyph: "bundle",
    },
  },
  {
    rank: "page",
    keywords: ["探索", "勇敢表达", "新舞台"],
    upright: "尝试新表达或渠道，点燃创意试验。",
    reversed: "缺乏后续计划，想法难以落地。",
    theme: {
      palette: ["#F2709C", "#FF9472"],
      glow: "rgba(242,112,156,0.4)",
      pattern: "spark",
      glyph: "messenger",
    },
  },
  {
    rank: "knight",
    keywords: ["冒险精神", "行动派", "加速度"],
    upright: "迅速推进新项目，带动团队士气。",
    reversed: "冲动或方向飘忽，需要稳住节奏。",
    theme: {
      palette: ["#F7B733", "#FC4A1A"],
      glow: "rgba(252,74,26,0.42)",
      pattern: "ember",
      glyph: "stallion",
    },
  },
  {
    rank: "queen",
    keywords: ["魅力领导", "自信", "资源聚焦"],
    upright: "以温暖与灵感凝聚伙伴，资源对焦最关键处。",
    reversed: "能量分散或过度掌控，需信任他人。",
    theme: {
      palette: ["#F953C6", "#B91D73"],
      glow: "rgba(249,83,198,0.45)",
      pattern: "petal",
      glyph: "sunflower",
    },
  },
  {
    rank: "king",
    keywords: ["远见", "创业精神", "整合影响力"],
    upright: "以战略眼光点燃新机会，并承担领导责任。",
    reversed: "固执己见或忽略团队回馈。",
    theme: {
      palette: ["#F00000", "#DC281E"],
      glow: "rgba(240,0,0,0.45)",
      pattern: "ember",
      glyph: "scepter",
    },
  },
]);

const cupsCards = makeMinorCards("cups", [
  {
    rank: "ace",
    keywords: ["情绪泉源", "疗愈", "新连结"],
    upright: "敞开心扉，滋养可信赖的关系与灵感。",
    reversed: "情绪受阻或能量外漏，先顾好自己。",
    theme: {
      palette: ["#43C6AC", "#191654"],
      glow: "rgba(67,198,172,0.42)",
      pattern: "tidal",
      glyph: "chalice",
    },
  },
  {
    rank: "two",
    keywords: ["互信", "合作契约", "互惠"],
    upright: "双向交流顺畅，建立可靠伙伴关系。",
    reversed: "关系失衡或沟通误解，需要修复。",
    theme: {
      palette: ["#30E8BF", "#FF8235"],
      glow: "rgba(48,232,191,0.42)",
      pattern: "wave",
      glyph: "confluence",
    },
  },
  {
    rank: "three",
    keywords: ["庆祝", "社群互助", "创意交流"],
    upright: "与志同道合者共享灵感与资源。",
    reversed: "过度社交或 gossip 影响专注。",
    theme: {
      palette: ["#4DA0B0", "#D39D38"],
      glow: "rgba(77,160,176,0.42)",
      pattern: "petal",
      glyph: "toast",
    },
  },
  {
    rank: "four",
    keywords: ["倦怠", "再评估", "内省"],
    upright: "暂停接收新提议，检视真正想要什么。",
    reversed: "从麻木醒来，重新拥抱机会。",
    theme: {
      palette: ["#396afc", "#2948ff"],
      glow: "rgba(57,106,252,0.4)",
      pattern: "wave",
      glyph: "stillwater",
    },
  },
  {
    rank: "five",
    keywords: ["失落", "情绪调整", "留意未失"],
    upright: "承认失去的部分，也看见仍可挽回的资源。",
    reversed: "走出遗憾，重新建立连结。",
    theme: {
      palette: ["#614385", "#516395"],
      glow: "rgba(81,99,149,0.45)",
      pattern: "tidal",
      glyph: "spill",
    },
  },
  {
    rank: "six",
    keywords: ["温情", "记忆", "分享"],
    upright: "借过去经验与善意，唤回初心与信任。",
    reversed: "陷于过去或理想化，需要回到当下。",
    theme: {
      palette: ["#43C6AC", "#191654"],
      glow: "rgba(72,172,211,0.42)",
      pattern: "petal",
      glyph: "memory",
    },
  },
  {
    rank: "seven",
    keywords: ["选择过多", "幻象", "想象力"],
    upright: "先确定评估标准，再做决策。",
    reversed: "聚焦一项可执行的选项，避免拖延。",
    theme: {
      palette: ["#5f2c82", "#49a09d"],
      glow: "rgba(89,74,146,0.42)",
      pattern: "tidal",
      glyph: "constellation",
    },
  },
  {
    rank: "eight",
    keywords: ["离开", "寻找意义", "升级"],
    upright: "勇敢离开无法满足的阶段，寻找更深价值。",
    reversed: "迟疑不决，担心错过既有安全感。",
    theme: {
      palette: ["#0B486B", "#F56217"],
      glow: "rgba(11,72,107,0.42)",
      pattern: "wave",
      glyph: "moonpath",
    },
  },
  {
    rank: "nine",
    keywords: ["满足", "愿望达成", "感恩"],
    upright: "享受阶段成果，表达感激并分享喜悦。",
    reversed: "过度沉溺或表面满足，需要深入反思。",
    theme: {
      palette: ["#136a8a", "#267871"],
      glow: "rgba(19,106,138,0.42)",
      pattern: "tidal",
      glyph: "harvest",
    },
  },
  {
    rank: "ten",
    keywords: ["圆满", "家庭与团队", "价值实现"],
    upright: "愿景落地成共享文化，建立长期幸福感。",
    reversed: "外在和谐但内在未被满足，需诚实沟通。",
    theme: {
      palette: ["#00C9FF", "#92FE9D"],
      glow: "rgba(0,201,255,0.4)",
      pattern: "petal",
      glyph: "rainbow",
    },
  },
  {
    rank: "page",
    keywords: ["创意讯息", "情感探索", "直觉"],
    upright: "接受灵感与邀约，带着好奇实验。",
    reversed: "过度敏感或逃避现实，需要设界线。",
    theme: {
      palette: ["#83a4d4", "#b6fbff"],
      glow: "rgba(131,164,212,0.4)",
      pattern: "tidal",
      glyph: "message",
    },
  },
  {
    rank: "knight",
    keywords: ["浪漫行动", "提案", "梦想驱动"],
    upright: "以真诚表达吸引支持，推进理想项目。",
    reversed: "情绪化或承诺不定，需脚踏实地。",
    theme: {
      palette: ["#2193b0", "#6dd5ed"],
      glow: "rgba(33,147,176,0.42)",
      pattern: "tidal",
      glyph: "courier",
    },
  },
  {
    rank: "queen",
    keywords: ["共情力", "情绪智商", "疗愈空间"],
    upright: "以倾听与洞察照顾团队细腻需求。",
    reversed: "情绪界线松散，易被他人情绪拖累。",
    theme: {
      palette: ["#654ea3", "#eaafc8"],
      glow: "rgba(101,78,163,0.42)",
      pattern: "petal",
      glyph: "shell",
    },
  },
  {
    rank: "king",
    keywords: ["情绪掌舵", "稳健领导", "外交"],
    upright: "以稳重与同理协调复杂关系网络。",
    reversed: "压抑或操控情绪，影响判断。",
    theme: {
      palette: ["#396afc", "#2948ff"],
      glow: "rgba(57,106,252,0.42)",
      pattern: "wave",
      glyph: "trident",
    },
  },
]);

const swordsCards = makeMinorCards("swords", [
  {
    rank: "ace",
    keywords: ["洞察", "真相", "断舍"],
    upright: "以清晰逻辑斩断混乱，宣布新思想。",
    reversed: "沟通混乱或缺乏事实支持。",
    theme: {
      palette: ["#536976", "#292E49"],
      glow: "rgba(83,105,118,0.42)",
      pattern: "gale",
      glyph: "blade",
    },
  },
  {
    rank: "two",
    keywords: ["权衡", "暂时停滞", "内在冲突"],
    upright: "暂缓行动，搜集更多信息后抉择。",
    reversed: "拖延决策或情绪压抑，需要拆除盲点。",
    theme: {
      palette: ["#bdc3c7", "#2c3e50"],
      glow: "rgba(144,164,174,0.4)",
      pattern: "gale",
      glyph: "balance",
    },
  },
  {
    rank: "three",
    keywords: ["刺痛", "真相揭露", "疗愈开始"],
    upright: "面对失望的事实，为疗愈创造空间。",
    reversed: "伤口尚未复原，需温柔对待自己。",
    theme: {
      palette: ["#3a6186", "#89253e"],
      glow: "rgba(58,97,134,0.42)",
      pattern: "spark",
      glyph: "heartbreak",
    },
  },
  {
    rank: "four",
    keywords: ["休整", "策略静修", "精神充电"],
    upright: "暂停战斗，修复体力与策略。",
    reversed: "过度沉睡或被迫停滞，需适度苏醒。",
    theme: {
      palette: ["#4b6cb7", "#182848"],
      glow: "rgba(75,108,183,0.42)",
      pattern: "gale",
      glyph: "sanctum",
    },
  },
  {
    rank: "five",
    keywords: ["输赢", "策略冲突", "代价"],
    upright: "胜利可能伴随损耗，想清楚要留什么。",
    reversed: "停止无意义争斗，寻求双赢解法。",
    theme: {
      palette: ["#232526", "#414345"],
      glow: "rgba(35,37,38,0.42)",
      pattern: "gale",
      glyph: "aftermath",
    },
  },
  {
    rank: "six",
    keywords: ["过渡", "智性转移", "疗愈旅程"],
    upright: "带着经验迁移到更健康的环境。",
    reversed: "迟迟无法放下旧局，过渡卡住。",
    theme: {
      palette: ["#1c92d2", "#f2fcfe"],
      glow: "rgba(28,146,210,0.42)",
      pattern: "wave",
      glyph: "ferry",
    },
  },
  {
    rank: "seven",
    keywords: ["策略", "隐秘行动", "资源再分配"],
    upright: "用聪明的方式调配资源，保持灵活。",
    reversed: "隐瞒或自欺暴露，需回归诚信。",
    theme: {
      palette: ["#1f4037", "#99f2c8"],
      glow: "rgba(31,64,55,0.4)",
      pattern: "gale",
      glyph: "mask",
    },
  },
  {
    rank: "eight",
    keywords: ["束缚", "思维限制", "恐惧"],
    upright: "看清自我设限，寻求外界扶持。",
    reversed: "逐渐挣脱束缚，勇敢迈出一步。",
    theme: {
      palette: ["#5f2c82", "#49a09d"],
      glow: "rgba(95,44,130,0.42)",
      pattern: "gale",
      glyph: "bind",
    },
  },
  {
    rank: "nine",
    keywords: ["焦虑", "夜间思绪", "自责"],
    upright: "表达恐惧并寻求支持，别独自承担。",
    reversed: "焦虑开始缓解，继续练习自我安抚。",
    theme: {
      palette: ["#000428", "#004e92"],
      glow: "rgba(0,78,146,0.45)",
      pattern: "gale",
      glyph: "night",
    },
  },
  {
    rank: "ten",
    keywords: ["终结", "崩塌", "最坏已过"],
    upright: "承认彻底的结束，重启才能开始。",
    reversed: "危机已见底，逐步恢复力量。",
    theme: {
      palette: ["#373B44", "#4286f4"],
      glow: "rgba(55,59,68,0.45)",
      pattern: "spark",
      glyph: "dawn",
    },
  },
  {
    rank: "page",
    keywords: ["好奇", "学习", "敏锐"],
    upright: "以提问与观察掌握新信息。",
    reversed: "话语尖锐或信息失真，需要谨慎。",
    theme: {
      palette: ["#457fca", "#5691c8"],
      glow: "rgba(69,127,202,0.4)",
      pattern: "gale",
      glyph: "quill",
    },
  },
  {
    rank: "knight",
    keywords: ["快速决策", "直言", "冲刺"],
    upright: "迅速处理问题，保持逻辑与节奏。",
    reversed: "鲁莽或忽略细节，需先校准方向。",
    theme: {
      palette: ["#485563", "#29323c"],
      glow: "rgba(72,85,99,0.42)",
      pattern: "gale",
      glyph: "falcon",
    },
  },
  {
    rank: "queen",
    keywords: ["洞察力", "客观", "设界限"],
    upright: "以清晰语言与理性领导沟通。",
    reversed: "过于冷漠或批评，需要平衡温度。",
    theme: {
      palette: ["#667db6", "#0082c8"],
      glow: "rgba(102,125,182,0.4)",
      pattern: "gale",
      glyph: "crownblade",
    },
  },
  {
    rank: "king",
    keywords: ["策略统御", "专业", "决策"],
    upright: "以高度逻辑与愿景做出决定。",
    reversed: "固执或滥用权力，需要检视价值。",
    theme: {
      palette: ["#283c86", "#45a247"],
      glow: "rgba(66,88,134,0.4)",
      pattern: "gale",
      glyph: "edict",
    },
  },
]);

const pentaclesCards = makeMinorCards("pentacles", [
  {
    rank: "ace",
    keywords: ["资源开端", "实际机会", "稳定"],
    upright: "抓住可落地的机会与资金流。",
    reversed: "基础不稳或错过投入时机。",
    theme: {
      palette: ["#56ab2f", "#a8e063"],
      glow: "rgba(86,171,47,0.45)",
      pattern: "terra",
      glyph: "seed",
    },
  },
  {
    rank: "two",
    keywords: ["多任务", "弹性", "平衡"],
    upright: "以敏捷调度资源与时间。",
    reversed: "超载导致失衡，需优先排序。",
    theme: {
      palette: ["#76b852", "#8DC26F"],
      glow: "rgba(118,184,82,0.42)",
      pattern: "terra",
      glyph: "infinity",
    },
  },
  {
    rank: "three",
    keywords: ["团队协作", "专业分工", "认可"],
    upright: "协作顺畅，专业互补，作品成形。",
    reversed: "协作失衡或缺乏共识，需明确流程。",
    theme: {
      palette: ["#134E5E", "#71B280"],
      glow: "rgba(19,78,94,0.42)",
      pattern: "terra",
      glyph: "atelier",
    },
  },
  {
    rank: "four",
    keywords: ["持有", "安全感", "控制"],
    upright: "建立稳固基础，但别过度守成。",
    reversed: "过于紧抓，反而阻挡流动。",
    theme: {
      palette: ["#5A3F37", "#2C7744"],
      glow: "rgba(90,63,55,0.45)",
      pattern: "terra",
      glyph: "lockbox",
    },
  },
  {
    rank: "five",
    keywords: ["资源短缺", "孤立", "求援"],
    upright: "面对暂时匮乏，主动寻求资源。",
    reversed: "负面循环结束，看见援手。",
    theme: {
      palette: ["#636363", "#a2ab58"],
      glow: "rgba(99,99,99,0.42)",
      pattern: "terra",
      glyph: "lantern",
    },
  },
  {
    rank: "six",
    keywords: ["互助", "资源分配", "慷慨"],
    upright: "公平分配价值，形成正向循环。",
    reversed: "给予与索取失衡，需校准条件。",
    theme: {
      palette: ["#11998e", "#38ef7d"],
      glow: "rgba(17,153,142,0.42)",
      pattern: "terra",
      glyph: "scale",
    },
  },
  {
    rank: "seven",
    keywords: ["耐心", "长期评估", "耕耘"],
    upright: "检视投入产出，耐心等待成长。",
    reversed: "投入方向失衡，需调整策略。",
    theme: {
      palette: ["#3CA55C", "#B5AC49"],
      glow: "rgba(60,165,92,0.42)",
      pattern: "terra",
      glyph: "field",
    },
  },
  {
    rank: "eight",
    keywords: ["专注 craftsmanship", "技能提升", "迭代"],
    upright: "磨练技艺，让作品臻于精细。",
    reversed: "重复繁琐或缺乏热情，需注入意义。",
    theme: {
      palette: ["#4EAD74", "#A3E8AE"],
      glow: "rgba(78,173,116,0.42)",
      pattern: "terra",
      glyph: "workbench",
    },
  },
  {
    rank: "nine",
    keywords: ["独立丰收", "质感生活", "自信"],
    upright: "享受努力带来的独立与丰盛。",
    reversed: "物质充裕但内心孤独，需建立连结。",
    theme: {
      palette: ["#BA8B02", "#181818"],
      glow: "rgba(186,139,2,0.42)",
      pattern: "terra",
      glyph: "vine",
    },
  },
  {
    rank: "ten",
    keywords: ["长远传承", "财富结构", "家族企业"],
    upright: "打下可持续的制度与资产，惠及团队与家庭。",
    reversed: "财务结构失衡或价值不一致。",
    theme: {
      palette: ["#F2994A", "#F2C94C"],
      glow: "rgba(242,153,74,0.45)",
      pattern: "terra",
      glyph: "sigil",
    },
  },
  {
    rank: "page",
    keywords: ["学习机会", "实习", "验证想法"],
    upright: "带着务实态度学习并实验。",
    reversed: "拖延或不够专注，需要具体计划。",
    theme: {
      palette: ["#155799", "#159957"],
      glow: "rgba(21,153,87,0.42)",
      pattern: "terra",
      glyph: "scroll",
    },
  },
  {
    rank: "knight",
    keywords: ["稳定执行", "责任感", "耐性"],
    upright: "脚踏实地地推进计划，坚持到底。",
    reversed: "过于僵化或行动迟缓，需注入弹性。",
    theme: {
      palette: ["#283c86", "#45a247"],
      glow: "rgba(40,60,134,0.42)",
      pattern: "terra",
      glyph: "plow",
    },
  },
  {
    rank: "queen",
    keywords: ["资源管理", "照顾", "务实丰盛"],
    upright: "以温暖与效率管理资源与人。",
    reversed: "过度劳累或忽视自己需求。",
    theme: {
      palette: ["#355C7D", "#6C5B7B"],
      glow: "rgba(53,92,125,0.42)",
      pattern: "terra",
      glyph: "hearth",
    },
  },
  {
    rank: "king",
    keywords: ["稳健统筹", "商业智慧", "投资"],
    upright: "以长线视角规划资产与成长。",
    reversed: "过度保守或物质主义，需要回归价值。",
    theme: {
      palette: ["#1D976C", "#93F9B9"],
      glow: "rgba(29,151,108,0.42)",
      pattern: "terra",
      glyph: "throne",
    },
  },
]);

export const tarotDeck: readonly TarotCard[] = [
  ...majorArcana,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards,
];
