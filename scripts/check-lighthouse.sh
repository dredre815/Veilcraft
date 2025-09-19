#!/usr/bin/env bash
set -euo pipefail

CHROME_BIN=$(node -e "process.stdout.write(require('@playwright/test').chromium.executablePath());")

echo "Using Chrome binary: $CHROME_BIN"
echo "Running Lighthouse audits for / and /read..."

DEBUG=chrome-launcher lhci autorun \
  --config=./lighthouserc.json \
  --collect.chromePath="$CHROME_BIN" \
  --collect.chromeFlags="--no-sandbox" \
  --collect.chromeFlags="--disable-dev-shm-usage"
