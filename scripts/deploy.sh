#!/usr/bin/env bash
set -euo pipefail

printf "\n🪄 Running Veilcraft pre-deployment checklist...\n\n"

npm run lint
npm run type-check
npm run test
npm run test:e2e
npm run check:lighthouse

printf "\n✅ Checks complete. Run 'npm run build' or promote the generated .lighthouse reports before deployment.\n"
