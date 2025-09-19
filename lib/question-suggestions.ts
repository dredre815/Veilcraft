const DEFAULT_SUGGESTIONS = [
  "描述时间范围与期望，让塔罗解读更聚焦。",
  "聚焦可行动的目标或阻碍，方便生成建议。",
  "补充关键信息，例如相关的人或项目阶段。",
];

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  relationship: [
    "我与伴侣在未来三个月的沟通会有哪些关键转折？",
    "在保持界限的前提下，我该如何回应这段关系中的反复拉扯？",
    "如何在接下来的两个月内修复我们之间的信任？",
  ],
  career: [
    "未来一个季度里，我在当前职位晋升的最大阻力是什么？",
    "面对新的项目负责人，我应该如何调整沟通策略来确保推进？",
    "接下来六周，我应该把精力放在技能补强还是拓展人脉？",
  ],
  wealth: [
    "在控制风险的前提下，我近期是否适合增加新的投资项目？",
    "未来三个月影响我收入稳定性的关键因素是什么？",
    "我应该如何在接下来两个季度平衡储蓄与必要的支出？",
  ],
  health: [
    "在兼顾工作强度的情况下，接下来一个月我的休息与恢复需要关注什么？",
    "未来六周我该如何调整作息来缓解反复的疲劳感？",
    "我需要在哪些方面建立新的习惯，帮助身体重拾平衡？",
  ],
};

const PATTERN_SUGGESTIONS: Array<{ matcher: RegExp; output: string[] }> = [
  {
    matcher: /(复合|和好|感情|暧昧|relationship|love)/i,
    output: [
      "我和对方未来两个月的关系走向会聚焦在哪些关键节点？",
      "为了让关系更稳定，我现在最需要调整的沟通方式是什么？",
    ],
  },
  {
    matcher: /(工作|事业|晋升|career|job|项目)/i,
    output: [
      "面对当前的项目阻碍，我需要优先拆解哪一个问题？",
      "未来三个月内，我在职业发展上最值得投资的方向是什么？",
    ],
  },
  {
    matcher: /(财务|投资|资金|money|wealth|收入)/i,
    output: [
      "为了维持现金流稳定，我应该注意哪些支出或合作条款？",
      "接下来一个季度，我应该如何平衡风险与收益？",
    ],
  },
  {
    matcher: /(健康|焦虑|睡眠|身心|health|body)/i,
    output: [
      "在保证工作进度的前提下，我应该优先调整哪一个生活习惯？",
      "未来六周维护身心稳定的关键提醒是什么？",
    ],
  },
];

function dedupe(values: string[]): string[] {
  return Array.from(new Set(values.map((item) => item.trim()))).filter(Boolean);
}

export function generateQuestionSuggestions(
  question: string,
  category?: string,
  limit = 3,
): string[] {
  const normalized = question.trim();
  if (!normalized) {
    if (category && CATEGORY_SUGGESTIONS[category]) {
      return CATEGORY_SUGGESTIONS[category].slice(0, limit);
    }
    return DEFAULT_SUGGESTIONS.slice(0, limit);
  }

  const suggestions: string[] = [];
  for (const pattern of PATTERN_SUGGESTIONS) {
    if (pattern.matcher.test(normalized)) {
      suggestions.push(...pattern.output);
    }
  }

  if (category && CATEGORY_SUGGESTIONS[category]) {
    suggestions.push(...CATEGORY_SUGGESTIONS[category]);
  }

  if (normalized.length < 20) {
    suggestions.push("扩写场景、时间与期待，帮助系统识别真正的诉求。");
  } else if (normalized.length > 140) {
    suggestions.push("尝试提炼为一句话重点，方便聚焦生成可执行建议。");
  }

  if (/怎么办|如何|怎么做/i.test(normalized)) {
    suggestions.push("描述你最担心的结果，塔罗将给出针对性的行动指引。");
  }

  if (/一直|反复|总是/i.test(normalized)) {
    suggestions.push("标注触发事件或关键节点，便于识别因果链条。");
  }

  if (suggestions.length === 0) {
    suggestions.push(...DEFAULT_SUGGESTIONS);
  }

  return dedupe(suggestions).slice(0, limit);
}
