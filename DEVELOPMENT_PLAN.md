# Veilcraft｜幕术 · 开发计划

## 1. 产品定位与版本目标

- **目标体验**：以“华丽但克制”的视觉呈现，为用户提供确定性可复盘的塔罗抽牌与证据驱动的 AI 解读。
- **MVP 范围（v1.0）**：
  1. 支持极速三张牌（过去/现在/未来）流程：提问 → 选择牌阵 → 抽牌动画 → 结果面板。
  2. 结构化 AI 解读（符合 ReadingSchema），展示 Overview / Theme / Cards / Actions / Cautions / Disclaimer。
  3. 证据托盘原型：展示每张牌 1-3 条证据引用。
  4. 可复盘的 seed 抽牌与分享链接（含 OG 占位）。
  5. 评分反馈组件与基础埋点。
- **未来扩展预留**：凯尔特十字牌阵、RAG 卡意库、A/B Prompt、Edge 缓存策略。

## 2. 设计与体验原则

- **视觉风格**：深浅主题自适应、Aurora 渐变主色、玻璃质感卡片、统一圆角/阴影令牌。
- **交互基线**：动画时长与缓动遵循 240/180ms 与 `[.2,.9,.2,1]`；抽牌动画 ≤ 900ms；加载骨架与状态提示完整。
- **信息架构**：
  - 页面：Landing（/）、占卜流程（/read）、牌百科（/cards/[id]）和分享页（/share/[id]）。
  - 组件：QuestionForm、SpreadPicker、DrawCanvas、ReadingPanel、EvidenceTray、ShareSheet、FeedbackWidget。
- **可访问性**：色彩对比遵循 WCAG AA；键盘可用的抽牌与导航；屏幕阅读描述关键状态。

## 3. 技术架构

- **前端框架**：Next.js 14（App Router，部分 Edge runtime）；TypeScript；Tailwind CSS + shadcn/ui；Framer Motion 实现动效；Radix UI primitives。
- **状态管理**：React Server Components + Client Components；前端 zustand/valtio 管理占卜流程状态；URL 查询参数承载 seed。
- **API 层**：
  - `/api/draw`：生成确定性抽牌结果。
  - `/api/interpret`：联通 LLM（暂以 mock/edge function 实现，可插拔真实供应商）。
  - `/api/feedback`：记录评分与标签。
  - `/api/share/[id]`：读取存储的阅读记录或基于 seed 重算。
- **数据与持久化**：Prisma + SQLite（本地）/Postgres（生产）抽象；Redis/Upstash 用于缓存；Edge Storage（KV）用于分享记录。
- **AI 管线**：
  1. 收集牌阵输入与卡意证据。
  2. Prompt 生成草稿（LLM A），Zod 校验。
  3. 润色关键字段（LLM B）。
  4. 失败回退策略：提示“结果正在校准”，提供重试。
- **抽牌算法**：CSPRNG + Seed（sha256 base58），Fisher–Yates 洗牌 + 独立 orientation bit。

## 4. 代码结构

```
/app
  layout.tsx               // 主题、全局样式、元信息
  page.tsx                 // Landing Hero
  /read
    page.tsx               // 主流程壳层
    /components            // 特定于流程的 Client 组件
  /api
    /draw/route.ts
    /interpret/route.ts
    /feedback/route.ts
    /share/[id]/route.ts
/components                // 通用 UI 组件
  ui/*                     // shadcn 包装
  VeilBackground.tsx
  Pill.tsx
  Card.tsx
  Tooltip.tsx
/lib
  rng.ts                   // Seed & Shuffle
  schema.ts                // Zod schemas
  spreads.ts               // 牌阵定义
  evidence.ts              // 证据拉取接口（mock + RAG 框架）
  llm.ts                   // LLM 调用封装（含草稿/润色）
  analytics.ts             // A/B 与埋点
  storage.ts               // KV/DB 接口
/styles
  globals.css              // Tailwind base + 设计变量
  tokens.css               // CSS 变量定义
```

## 5. 关键模块策略

- **Landing Hero**：
  - 采用 Framer Motion 与 WebGL（可选）制作帷幕动效；
  - 展示 slogan、CTA、近期占卜案例轮播；
  - 支持滚动驱动的帷幕开合与“向下提示”。
- **QuestionForm**：
  - 使用 React Hook Form + Zod；
  - 自动建议聚焦问法（初期使用客户端规则，后续接入轻量模型）。
- **SpreadPicker**：
  - 3D Hover 光晕效果；
  - 预留更多牌阵扩展。
- **DrawCanvas**：
  - 洗牌 → 扇形 → 翻牌的连续动画；
  - 键盘与触屏支持；
  - 抽牌完成后触发 `/api/interpret`。
- **ReadingPanel & EvidenceTray**：
  - 流式渲染 `overview` → `theme` → 每张牌详细；
  - 证据抽屉展示引用文本与来源；
  - ActionList 与 Cautions 强调可执行与风险提示。
- **Share & Feedback**：
  - 生成分享链接（包含 seed、spreadId、lang、tone）；
  - `api/og` 生成图卡（阶段性可占位）；
  - Feedback 组件写入评分与标签。

## 6. 工程流程

1. **脚手架搭建**：初始化 Next.js、Tailwind、shadcn、项目配置（ESLint、Prettier、husky/pre-commit）。
2. **设计令牌与基础 UI**：实现 tokens.css、Tailwind 扩展、核心 UI 组件（Card/Pill/Glass Panel）。
3. **页面框架与导航**：完成 layout、Landing 雏形、读牌流程路由骨架。
4. **占卜流程逻辑**：QuestionForm、SpreadPicker、状态管理、抽牌动画、与 `/api/draw` 交互。
5. **AI 解读管线**：Schema 定义、LLM mock、Interpret API、ReadingPanel 流式显示。
6. **分享与反馈**：ShareSheet、Feedback 组件与 API。
7. **质量保障**：单元测试（Vitest/React Testing Library）、端到端测试（Playwright）、类型检查、Lint、性能调优。
8. **部署与监控**：配置 Vercel/Edge、Sentry、Analytics，准备环境变量与 CI。

## 7. 验收标准

- UI 与交互符合品牌基调，主要流程具备动效与骨架。
- 抽牌结果可复盘，AI 输出通过 Zod 校验且展示结构完整。
- 证据抽屉、分享链接、反馈表单可用。
- 所有测试、lint、type check 通过；性能初步达标。
- 代码结构清晰，具备扩展空间。

## 8. 风险与缓解

- **LLM JSON 失败**：实现自动重试与手动重试提示；保存错误日志。
- **动画性能**：限制粒子数量，使用 requestAnimationFrame；在移动端提供降级。
- **数据合规**：问题文本可选匿名化，强调免责声明。

## 9. 沟通与协作约定

- 所有开发以本计划为依据；重大调整需同步更新计划文档。
- 代码提交需附测试结果与开发日志更新；PR 描述对齐计划与 TODO。
