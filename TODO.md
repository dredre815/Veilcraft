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

## Phase 6 · OpenAI 解读接入

- [x] 设计用户侧密钥管理：在设置面板写入/更新 OpenAI API Key（存储于 `localStorage`/`IndexedDB`，提供清除与失效检测）。
- [x] 改造 `/api/interpret` 为代理模式：从请求头读取临时密钥，通过服务器转发到 OpenAI，避免浏览器直连暴露敏感信息。
- [x] 迭代 prompt 体系：定义 System/Assistant/User 三段模板，覆盖抽牌上下文、证据引用格式、响应语调。
- [x] 构建多轮对话栈：在客户端维护 conversation state，允许用户对解读追问并携带 seed/牌阵/历史回答。
- [x] 增加失败回退：处理超时、速率限制、无效密钥，向用户反馈并允许重试或切换模型。
- [ ] 为新版解读流程补充自动化测试：单元测试已就绪，后续补写 Playwright 场景（含密钥缺失、首次解读、追问多轮）。

## Phase 7 · 全量塔罗牌与沉浸式卡面

- [x] 扩充 `lib/deck` 至完整 78 张牌（日/英名称、花色、正逆位关键词、视觉主题枚举）。
- [x] 设计卡面 UI 变体：基于牌属性生成渐变、纹理、符号层叠（无需真实图片），统一在 `CardLayout` 中渲染。
- [ ] 调整 DrawCanvas 动效：根据牌的视觉主题应用不同翻转光效、粒子与音效挂点，确保移动端帧率稳定。
- [x] 增加牌面信息层：翻开后展示简短正逆位提示，支持可访问性朗读。
- [x] 为扩展牌阵预留模板（花色/编号映射尺寸），并在 SpreadPicker 中提供缩略预览。
- [x] 更新文档与设计规范，记录每张牌的色板/动效参数，便于后续美术协作。
- [x] 输出卡面主题规范与读牌沉浸体验（粒子/音效）说明。

## Phase 8 · 本地存储与体验打磨

- [x] 将解读历史、对话记录、用户偏好迁移到浏览器持久化（IndexedDB + 缓存策略），清理 `lib/storage` 内存实现。
- [x] 下线分享相关 UI/API（ShareSheet、`/api/share`、OG 生成），替换为“本地历史记录”入口。
- [ ] 优化 FeedbackWidget：改为本地记录 + 可选导出，同时保留匿名评分动效。
- [ ] 重新梳理隐私文案与设置，说明数据仅存储在本地，提供一键清除。
- [ ] 建立基础观测：在本地写入调试日志（可导出 JSON），便于排查 prompt 或渲染问题。
