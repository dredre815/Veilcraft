# Veilcraft｜幕术

**幕起。占卜，不再含糊。** Veilcraft delivers a couture tarot experience that pairs deterministic card draws with evidence-backed AI interpretations and a fully guided reading flow.

## ✨ Key Capabilities

- **Deterministic tarot engine.** Fisher–Yates shuffles seeded with base58 entropy guarantee that every draw can be replayed exactly, including independent upright/reversed orientation rolls.【F:lib/draw.ts†L1-L44】【F:lib/rng.ts†L1-L62】
- **Guided preparation and spread coaching.** The QuestionForm enforces tone-aware prompts, suggests refinements, and persists context while the SpreadPicker previews each layout with position semantics to set expectations.【F:app/read/components/question-form.tsx†L1-L141】【F:app/read/components/spread-picker.tsx†L1-L88】
- **Cinematic draw canvas with accessible controls.** Animated shuffle loops, keyboard/assistive cues, progress insights, and seed messaging make the reveal process both theatrical and reproducible.【F:app/read/components/draw-canvas.tsx†L1-L140】
- **Schema-backed AI interpretation with visible evidence.** Interpret responses are validated against the Reading schema, composed via the mock reading builder, and rendered gradually with EvidenceTray, action plans, and risk highlights.【F:lib/schema.ts†L1-L55】【F:app/api/interpret/route.ts†L1-L32】【F:lib/mock-reading.ts†L1-L118】【F:app/read/components/reading-panel.tsx†L1-L124】
- **Shareable outcomes and qualitative feedback.** Users can mint replay links, copy OG image URLs, and submit ratings/tags that round-trip through the Edge handlers and in-memory storage mocks.【F:app/read/components/share-sheet.tsx†L1-L113】【F:app/api/share/route.ts†L1-L48】【F:app/api/og/route.ts†L1-L78】【F:app/read/components/feedback-widget.tsx†L1-L102】【F:app/api/feedback/route.ts†L1-L33】

## 🧭 Experience Flow

1. **Frame the question.** Provide a 20–200 character prompt, pick the tone/language, and optionally leave a contact email; contextual hints adapt as you type.【F:app/read/components/question-form.tsx†L44-L140】
2. **Select a spread.** Compare the Three-Card and Celtic Cross layouts, review each position’s intent, and confirm the spread that matches the question depth.【F:app/read/components/spread-picker.tsx†L24-L88】
3. **Draw and reveal.** Launch a deterministic shuffle, flip cards with buttons, keyboard, or touch, and monitor progress plus live ARIA announcements for accessibility.【F:app/read/components/draw-canvas.tsx†L48-L140】
4. **Review the interpretation.** Once every card is exposed, the ReadingPanel streams the overview, card-by-card summaries, action items, cautions, and citation trays.【F:app/read/components/reading-panel.tsx†L63-L166】
5. **Share and respond.** Capture replay links/OG previews and leave structured feedback that can later fuel product analytics or LLM prompt adjustments.【F:app/read/components/share-sheet.tsx†L60-L113】【F:app/read/components/feedback-widget.tsx†L17-L102】

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

### Runtime Configuration

| Variable              | Required | Description                                                                                                                                                                  |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Optional | Explicit origin used when generating share URLs/OG links; defaults to the incoming request origin when absent.【F:DEPLOYMENT.md†L7-L15】【F:app/api/share/route.ts†L12-L24】 |

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

- **Upgrade the interpretation engine.** Swap the mock builder for live LLM + RAG integrations while keeping Zod validation at the edge.【F:app/api/interpret/route.ts†L1-L32】【F:lib/mock-reading.ts†L1-L118】
- **Persist share + feedback data.** The current storage utilities keep everything in-memory; wire them to durable storage (KV, database) for production.【F:lib/storage.ts†L1-L46】
- **Broaden deck and evidence sources.** Only the major arcana and canned evidence excerpts are bundled—extend `lib/deck.ts`/`lib/spreads.ts` and evidence gathering once richer data is available.【F:lib/mock-reading.ts†L1-L118】
- **Re-run Lighthouse in a sandbox-friendly environment.** Root containers need `--no-sandbox`; confirm production scoring from a hardened runner with Chrome sandbox enabled.【F:scripts/check-lighthouse.sh†L1-L12】

Document additional integrations or policy updates in `DEPLOYMENT.md` as they land.
