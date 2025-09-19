# Veilcraft｜幕术 · Deployment Guide

This guide documents the environment variables, quality gates, and command sequence required to deploy Veilcraft to a production environment such as Vercel or a self-hosted Next.js target.

## Environment Variables

| Variable              | Required | Purpose                                                                                                     |
| --------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Optional | Absolute origin used when generating share links. Defaults to the request `origin` header during API calls. |

Additional infrastructure (databases, KV stores, analytics) can be introduced in future phases; update this table when those integrations land.

## Pre-Deployment Checklist

1. Install production dependencies and Playwright browsers if you have not already:
   ```bash
   npm install
   npx playwright install --with-deps chromium
   ```
2. Run the automated gate:
   ```bash
   npm run deploy:prepare
   ```
   This script executes linting, type-checking, unit tests, the Playwright happy-path scenario (with axe assertions), and the Lighthouse desktop audit for `/` and `/read`. Lighthouse reports are emitted to `.lighthouse/` for archival.
3. Review the Lighthouse output and address warnings surfaced in the HTML reports when feasible (particularly performance regressions or accessibility issues that fell below target thresholds).
4. Build the production bundle:
   ```bash
   npm run build
   ```
5. Deploy using your preferred mechanism:
   - **Vercel**: `vercel deploy --prebuilt` after running `npm run build`.
   - **Self-hosted**: copy the repository (or build artifacts) to the server, run `npm install --omit=dev`, then `npm run start -- --hostname 0.0.0.0 --port 3000` behind your process manager.

## Post-Deployment Monitoring

- Verify that `/api/share` responses include absolute OG image URLs using the configured `NEXT_PUBLIC_APP_URL`.
- Ensure the `/api/interpret` mock continues to serve structured JSON (schema validation runs in production and will emit errors to logs if it fails).
- Track user feedback submissions to confirm the mock `/api/feedback` endpoint remains reachable until the real storage layer is connected.

Document any deviations or custom infrastructure requirements in this file so future iterations stay aligned with the deployment workflow.
