# Veilcraft｜幕术 · 开发日志

> 用于记录每一步 Coding / 配置 / 调试行为，辅助复盘与 Debug。按照时间倒序追加，包含日期、执行人、阶段、详情、关联任务、检查结果。

| 日期       | 阶段    | 操作摘要                                                                                   | 关联 TODO                             | 检查/备注                                                                                                                          |
| ---------- | ------- | ------------------------------------------------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 2025-09-30 | Phase 5 | 全局巡检并修复 Tailwind 扫描警告、补充 README 部署/使用说明、调整 /api/share/[id] 类型兼容 | Phase 5 · 文档 / QA                   | `npm run lint`、`npm run type-check`、`npm run test`、`npm run test:e2e` 通过                                                      |
| 2025-09-29 | Phase 5 | 接入 Playwright Happy Path（含 axe 扫描）、配置 Lighthouse 审计与部署脚本，新增部署文档    | Phase 5 · E2E / 性能 / 部署           | `npm run lint`、`npm run type-check`、`npm run test`、`npm run test:e2e` 通过；`npm run check:lighthouse` 受 root sandbox 限制失败 |
| 2025-09-28 | Phase 5 | 引入 Vitest 配置并编写 RNG/Schema/Zustand 单元测试，更新测试脚本与路径别名支持             | Phase 5 · 单元测试                    | `npm run lint`、`npm run type-check`、`npm run test` 通过                                                                          |
| 2025-09-27 | Phase 4 | 实现 /api/og 分享图卡占位、扩展分享 API 返回图卡链接并更新 ShareSheet 复制交互             | Phase 4 · `/api/og` 占位图卡          | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-26 | Phase 4 | 完成 ShareSheet 复制链接、FeedbackWidget 评分提交流程与 share/feedback API mock            | Phase 4 · ShareSheet / Feedback       | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-25 | Phase 3 | 实装 ReadingPanel 流式解读、EvidenceTray 复制操作与 interpret 状态管理                     | Phase 3 · ReadingPanel / EvidenceTray | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-24 | Phase 3 | 定义 Reading Schema 并实现 interpret Mock API（Zod 校验 + 假数据生成）                     | Phase 3 · schema / interpret          | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-23 | Phase 2 | 构建 DrawCanvas 动画与键盘交互，接入 Zustand 状态仓库并生成确定性 seed                     | Phase 2 · DrawCanvas / 状态管理       | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-22 | Phase 2 | 完成 SpreadPicker 交互（双牌阵预览、动效、位置语义面板）                                   | Phase 2 · SpreadPicker                | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-21 | Phase 2 | 实装 QuestionForm（React Hook Form + Zod）与智能提示，新增输入组件样式并接入校验           | Phase 2 · QuestionForm                | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-20 | Phase 1 | 完成主题切换 Layout、Landing Hero 与 /read 流程骨架，联调样式与动效                        | Phase 1 · 核心框架                    | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-19 | Phase 0 | 初始化 Next.js 脚手架、Tailwind 令牌、shadcn 配置，接入 CI 与工具链                        | Phase 0 · 基础设施                    | `npm run lint`、`npm run type-check` 通过                                                                                          |
| 2025-09-19 | 规划    | 创建开发计划、TODO 与日志骨架                                                              | Phase 0 · 基础设施                    | 文档更新，未触发测试                                                                                                               |

## 记录规范

1. 每次开始新的开发块前先记录目标；结束后记录结果与测试结论。
2. 如有问题、Bug 或待办，明确标注并引用 Issue/PR。
3. 对重要决策（架构调整、依赖变更等）需简要写明原因。
