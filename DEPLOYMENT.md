# Veilcraft｜幕术 · Deployment Guide

This guide documents the environment variables, quality gates, and command sequence required to deploy Veilcraft to a production environment such as Vercel or a self-hosted Next.js target.

## Environment Variables

当前版本无需强制环境变量；所有解读历史与密钥均存储在用户浏览器中。后续若接入云端同步或日志服务，再补充此表。

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

- 确认 `/api/interpret` 与 `/api/interpret/chat` 仍返回符合 Schema 的 JSON，避免被代理或权限错误阻断。
- 运行 `npm run test:e2e` 与 `npm run check:lighthouse` 观察主要页面体验是否达到基线。
- 关注浏览器端日志（localStorage/IndexedDB）容量，评估是否需要后续导出与清理策略。

Document any deviations or custom infrastructure requirements in this file so future iterations stay aligned with the deployment workflow.
