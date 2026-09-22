#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

npm run build
npx cap sync android
npx cap open android
