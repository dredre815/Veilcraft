# Veilcraft｜幕术 · TODO List

> 按照《开发计划》拆解为可执行工作单元。完成每个区块后需执行自检（代码审查 + 必要测试），并在开发日志记录。

## Phase 0 · 基础设施

- [x] 初始化 Next.js App Router 项目结构（TypeScript、ESLint、Prettier、Tailwind、shadcn/ui、Framer Motion）。
- [x] 建立设计令牌：`tokens.css`、Tailwind 配置扩展、基础样式变量。
- [x] 配置 Git hooks（lint-staged 或类似）与 CI 占位脚本。

## Phase 1 · 核心页面框架

- [x] 实现 `/app/layout.tsx` 与全局主题切换（暗/亮），注入 CSS 变量与字体。
- [x] 搭建 Landing Hero 骨架（品牌字标、Slogan、CTA、帷幕动效占位）。
- [x] 创建 `/read/page.tsx` 框架，分区：QuestionForm、SpreadPicker、DrawCanvas、ReadingPanel 占位与骨架状态。

## Phase 2 · 占卜流程逻辑

- [x] QuestionForm：React Hook Form + Zod 校验（含提示文案与错误状态）。
- [x] SpreadPicker：三张牌 & 凯尔特十字预览 + hover 动效。
- [x] DrawCanvas：洗牌 + 翻牌动画原型，键盘/触摸控制，整合 `/api/draw`。
- [x] 状态管理：建立抽牌状态 store（seed、spread、cards、progress）。

## Phase 3 · AI 解读与结果呈现

- [x] 定义 `lib/schema.ts`（ReadingSchema + 输入校验）与类型。
- [x] `/api/interpret`：实现草稿 → 校验 → mock 返回逻辑（预留真实 LLM 接入）。
- [x] ReadingPanel：流式渲染（先 Overview/Theme，再逐卡），证据按钮与 Drawer 占位。
- [x] EvidenceTray：展示引用条目与复制按钮。

## Phase 4 · 分享、反馈与补全

- [x] ShareSheet：生成 seed 链接、调用 `/api/share` 占位、复制成功提示。
- [x] FeedbackWidget：评分 + 标签 + 提交 API。
- [x] `/api/feedback` 与 `/api/share/[id]` mock，实现持久化接口抽象。
- [x] `/api/og` 占位图卡。

## Phase 5 · 质量与交付

- [x] 单元测试（Vitest/RTL）：核心 hooks、RNG、schema 校验。
- [x] 端到端测试（Playwright）流程 Happy Path。
- [x] 性能与可访问性检查（Lighthouse、axe）并根据结果调优。
- [x] 部署脚本与环境变量文档。

> 所有任务完成后，确认：工作区干净、测试通过、文档更新、开发日志完整。
