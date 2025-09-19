# Veilcraft｜幕术

**幕起。占卜，不再含糊。** Veilcraft delivers a couture tarot experience that pairs deterministic card draws with evidence-backed AI interpretations and a fully guided reading flow.

## ✨ Key Capabilities

- **Deterministic tarot engine.** Fisher–Yates shuffles seeded with base58 entropy guarantee that every draw can be replayed exactly, including independent upright/reversed orientation rolls.【F:lib/draw.ts†L1-L44】【F:lib/rng.ts†L1-L62】
- **Full 78-card deck with adaptive card surfaces.** 每张牌都携带正逆位提示与独特的渐层主题，DrawCanvas 会依据花色自动渲染不同质感与提示层。【F:lib/deck.ts†L1-L630】【F:app/read/components/draw-canvas.tsx†L1-L360】
- **Guided preparation and spread coaching.** The QuestionForm enforces tone-aware prompts, suggests refinements, and persists context while the SpreadPicker previews each layout with position semantics to set expectations.【F:app/read/components/question-form.tsx†L1-L141】【F:app/read/components/spread-picker.tsx†L1-L88】
- **Cinematic draw canvas with accessible controls.** Animated shuffle loops, keyboard/assistive cues, progress insights, and seed messaging make the reveal process both theatrical and reproducible.【F:app/read/components/draw-canvas.tsx†L1-L140】
- **Schema-backed AI interpretation with visible evidence.** Interpret responses are validated against the Reading schema, composed via the mock reading builder, and rendered gradually with EvidenceTray, action plans, and risk highlights.【F:lib/schema.ts†L1-L75】【F:app/api/interpret/route.ts†L1-L240】【F:app/read/components/reading-panel.tsx†L1-L220】
- **LLM-powered follow-up conversation.** 用户本地保存 OpenAI 密钥，通过 Edge 代理生成首轮解读，并在 InterpretationChat 中继续多轮追问，所有提示与失败状态都会被优雅地处理。【F:components/settings/api-key-dialog.tsx†L1-L200】【F:app/api/interpret/chat/route.ts†L1-L200】【F:app/read/components/interpretation-chat.tsx†L1-L240】

## 🎴 Card Theme System

Every card in `lib/deck.ts` 描述了一个视觉主题（`palette`, `glow`, `pattern`, `glyph`）与正逆位提示：

- **Palette & Glow** 驱动 DrawCanvas 的渐层与阴影，主题色直接映射为粒子与光晕效果。【F:lib/deck.ts†L1-L630】【F:app/read/components/draw-canvas.tsx†L320-L560】
- **Pattern 与 Glyph** 用于 CardParticles、标签和提示，帮助用户快速区分花色或象征。SpreadPicker 会显示 suit hints 让牌阵意义更直观。【F:app/read/components/spread-picker.tsx†L1-L220】
- **Upright/Reverse hints** 提供翻牌后立即可见的行动/修正文案，同时驱动可听化的提示音频（正位高音、逆位低音），并自动落入历史档案。【F:app/read/components/draw-canvas.tsx†L200-L240】【F:components/history/reading-history-dialog.tsx†L1-L160】

## 🔐 Local Privacy & Storage

- 个人密钥、占卜历史、追问对话与反馈均只保存在浏览器的 `localStorage` 中，服务器不会接收任何原始数据。【F:components/settings/api-key-dialog.tsx†L1-L200】【F:app/read/store/use-reading-archive.ts†L1-L170】
- 通过阅读面板右下角的“本地历史”按钮可以查看最近 50 次占卜、复制 seed、清空记录或继续追问。【F:components/history/reading-history-dialog.tsx†L1-L160】
- 若需要共享或备份，请手动导出 Seed / 问题文本；后续会提供结构化导出与同步能力（见 Outstanding Work）。

## 🧭 Experience Flow

1. **Frame the question.** Provide a 20–200 character prompt, pick the tone/language, and optionally leave a contact email; contextual hints adapt as you type.【F:app/read/components/question-form.tsx†L44-L140】
2. **Select a spread.** Compare the Three-Card and Celtic Cross layouts, review each position’s intent, and confirm the spread that matches the question depth.【F:app/read/components/spread-picker.tsx†L24-L88】
3. **Draw and reveal.** Launch a deterministic shuffle, flip cards with buttons, keyboard, or touch, and monitor progress plus live ARIA announcements for accessibility.【F:app/read/components/draw-canvas.tsx†L48-L140】
4. **Review the interpretation.** Once every card is exposed, the ReadingPanel streams the overview, card-by-card summaries, action items, cautions, and citation trays.【F:app/read/components/reading-panel.tsx†L63-L166】
5. **Archive and respond.** 所有解读与追问默认保存到浏览器，可在历史面板中回顾并留下匿名反馈，数据不会上传服务器。【F:components/history/reading-history-dialog.tsx†L1-L160】【F:app/read/components/feedback-widget.tsx†L1-L200】

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ (Next.js 15 requires the modern runtime).
- npm 9+ (ships with Node; npm 11 is tested in CI).

### Local Development

```bash
npm install
npx playwright install --with-deps chromium  # one-time browser install for e2e/Lighthouse helpers
npm run dev
```

The dev server binds to [http://localhost:3000](http://localhost:3000) with Turbopack live reloading.

## 🧪 Quality & Tooling

All quality gates are codified as npm scripts:

| Command                    | Purpose                                                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`             | ESLint with zero-warning budget.【F:package.json†L7-L28】                                                                                                                              |
| `npm run type-check`       | Strict TypeScript compilation without emit.【F:package.json†L7-L28】                                                                                                                   |
| `npm run test`             | Vitest unit suite covering RNG helpers, schema guards, and the reading store.【F:package.json†L7-L28】                                                                                 |
| `npm run test:e2e`         | Playwright `/read` happy path with Axe accessibility assertions.【F:package.json†L7-L28】【F:tests/e2e/read-flow.spec.ts†L1-L37】                                                      |
| `npm run check:lighthouse` | Builds, serves, and audits `/` + `/read` using the Playwright Chromium binary (flags add `--no-sandbox` for root CI).【F:package.json†L7-L28】【F:scripts/check-lighthouse.sh†L1-L12】 |
| `npm run deploy:prepare`   | Composite lint → types → unit → e2e → Lighthouse checklist prior to release.【F:package.json†L7-L28】【F:scripts/deploy.sh†L1-L11】                                                    |

Unit coverage lives in `lib/__tests__/rng.test.ts` and `app/read/store/__tests__/use-reading-store.test.ts`.【F:lib/**tests**/rng.test.ts†L1-L58】【F:app/read/store/**tests**/use-reading-store.test.ts†L1-L120】

> **Tip:** Running Lighthouse or Playwright under root containers may require `--with-deps` installs (as shown above) and network access for Google Fonts. Fonts declared with `display: "swap"` in `app/layout.tsx` gracefully fall back when the CDN is unreachable.【F:app/layout.tsx†L1-L36】

## 📤 Deployment

1. Install dependencies and Playwright browsers (if not already provisioned):
   ```bash
   npm install
   npx playwright install --with-deps chromium
   ```
2. Execute the pre-deployment gate: `npm run deploy:prepare`.
3. Review `.lighthouse/` HTML reports for performance/accessibility regressions.
4. Build the production bundle: `npm run build`.
5. Deploy:
   - **Vercel** – `vercel deploy --prebuilt` after the build step.
   - **Self-hosted** – copy the project, run `npm install --omit=dev`, then `npm run start -- --hostname 0.0.0.0 --port 3000` behind your preferred process manager.【F:DEPLOYMENT.md†L1-L39】

## 📂 Project Structure

```
/app              # App Router pages and edge routes
/components      # UI primitives + layout shell
/lib             # Tarot metadata, RNG helpers, schema guards, mock engine
/styles          # Design tokens and Tailwind helpers
/tests           # Vitest + Playwright coverage
/scripts         # Deployment and audit automation
```

Key planning artefacts live alongside the code:

- `DEVELOPMENT_PLAN.md` – opinionated product/engineering plan.
- `TODO.md` – completed task matrix for each development phase.
- `DEV_LOG.md` – chronological change log with test evidence.

## 📋 Outstanding Work

These mocks unblock the UX today but should be replaced before launch:

- **Augment the interpretation engine with RAG.** 为牌位接入真实证据检索与嵌入召回，同时保留 JSON Schema 校验与失败回退策略。【F:app/api/interpret/route.ts†L1-L240】【F:app/api/interpret/chat/route.ts†L1-L200】
- **Exportable local archive.** 目前历史与反馈仅存在单设备浏览器中，后续可提供导出/同步能力与更多管理功能。【F:app/read/store/use-reading-archive.ts†L1-L170】【F:components/history/reading-history-dialog.tsx†L1-L160】
- **Enrich evidence sources.** 现阶段引用仍为占位文案，后续需为 78 张牌补足真实出处与可引用资料。【F:lib/mock-reading.ts†L1-L118】
- **Re-run Lighthouse in a sandbox-friendly environment.** Root containers need `--no-sandbox`; confirm production scoring from a hardened runner with Chrome sandbox enabled.【F:scripts/check-lighthouse.sh†L1-L12】

Document additional integrations or policy updates in `DEPLOYMENT.md` as they land.
