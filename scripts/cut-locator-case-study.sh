#!/usr/bin/env bash
# Cuts a standalone, locator-only copy of the repo for a separate case-study
# repo published on GitHub Pages.
#
# The locator consumes `ds`, `tokens` and `icons` straight from source through
# the pnpm workspace, so the cut keeps those packages and drops everything
# pipeline-facing (docs, Storybook, extra token formats, tooling, CI). It adds
# a GitHub Pages workflow and a case-study README.
#
# Usage:
#   scripts/cut-locator-case-study.sh <target-dir> [base-path]
#   BASE=<ref> scripts/cut-locator-case-study.sh <target-dir> [base-path]
#
#   <target-dir>  must not exist yet (or be empty); it is NOT a git repo yet.
#   [base-path]   Pages subpath, default "/" (use "/<repo-name>/" for a
#                 project site, "/" for a user site or custom domain).
#   BASE          ref to cut from, default origin/main.
#
# Reads from git (`git archive`), so the working tree is never touched.

set -euo pipefail

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  echo "Usage: $0 <target-dir> [base-path]" >&2
  exit 2
fi

TARGET="$1"
BASE_PATH="${2:-/}"
BASE="${BASE:-origin/main}"

case "$BASE_PATH" in
  /|/*/) ;;
  *) echo "base-path must be '/' or start and end with '/' (got: $BASE_PATH)" >&2; exit 2 ;;
esac

# Dropped from the case-study copy -- none are needed to build the locator.
REMOVE=(
  docs
  scripts
  CLAUDE.md
  .claude
  .agents
  skills-lock.json
  .github
  apps/storybook
  packages/tokens/build/swift
  packages/tokens/build/kotlin
  packages/tokens/build/dtcg
  packages/tokens/source/tokens-studio
)

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
git fetch --quiet origin main

if [ -e "$TARGET" ] && [ -n "$(ls -A "$TARGET" 2>/dev/null)" ]; then
  echo "$TARGET already exists and isn't empty." >&2
  exit 1
fi
mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"

# Copy the README template out of the source ref before it's removed.
README_TEMPLATE="$(git show "$BASE:scripts/locator-case-study-README.md")"

git archive "$BASE" | tar -x -C "$TARGET"
cd "$TARGET"

for path in "${REMOVE[@]}"; do
  rm -rf "$path"
done

printf '%s\n' "$README_TEMPLATE" > README.md

# Ask search engines not to index the published case-study site. (A meta tag
# is the only option: Pages can't send headers, and a robots.txt only counts
# at the host root, which a project site doesn't own.)
perl -pi -e 's|(<meta name="viewport"[^>]*/>)|$1\n    <meta name="robots" content="noindex, nofollow" />|' apps/locator/index.html
grep -q 'name="robots"' apps/locator/index.html || {
  echo "Couldn't add the noindex tag: no viewport <meta> in apps/locator/index.html." >&2
  exit 1
}

mkdir -p .github/workflows
cat > .github/workflows/pages.yml <<EOF
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - run: corepack enable
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter locator build
        env:
          BASE_PATH: $BASE_PATH
      # GitHub Pages serves 404.html for unknown paths, so deep links and
      # refreshes still load the app and the router reads the URL.
      - run: cp apps/locator/dist/index.html apps/locator/dist/404.html
      - uses: actions/upload-pages-artifact@v3
        with:
          path: apps/locator/dist
      - id: deployment
        uses: actions/deploy-pages@v4
EOF

# The removed workspace member (apps/storybook) is still in the lockfile, so
# regenerate it; otherwise CI's --frozen-lockfile install would fail.
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --lockfile-only
else
  echo "pnpm not found: run 'pnpm install' in $TARGET to refresh pnpm-lock.yaml." >&2
fi

echo
echo "Cut $(git -C "$ROOT" rev-parse --short "$BASE") -> $TARGET (base path: $BASE_PATH)"
echo "Next: cd $TARGET && git init && git add -A && git commit -m 'Initial commit'"
echo "Then create the GitHub repo, push, and set Settings > Pages > Source: GitHub Actions."
