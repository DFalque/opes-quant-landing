#!/usr/bin/env bash
set -euo pipefail

if [ ! -d node_modules ]; then
  npm install
fi

PORT="${PORT:-4321}"
npm run dev -- --port "$PORT"
