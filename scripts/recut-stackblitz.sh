#!/usr/bin/env bash
# Rebuilds the `stackblitz` branch from the latest `main`.
#
# StackBlitz's GitHub import stalls on the full repo, so reviewers get a
# slimmed copy: this drops what the locator doesn't need to run, downscales
# the two large PNGs, swaps in a reviewer-facing README
# (scripts/stackblitz-README.md), repoints the package READMEs' PLAN.md links at
# GitHub, and adds a .stackblitzrc that auto-installs
# and starts the locator.
#
# Usage:
#   scripts/recut-stackblitz.sh           build locally, leave `stackblitz` unpushed
#   scripts/recut-stackblitz.sh --push    also force-push it to origin
#   BASE=<ref> scripts/recut-stackblitz.sh   cut from a ref other than origin/main
#
# Runs in a temporary git worktree, so the current working tree is never
# touched. Nothing is pushed without --push.

set -euo pipefail

BRANCH=stackblitz
REPO_URL=https://github.com/mbretz/fs-ds-fasearch
BASE="${BASE:-origin/main}"  # override to test unmerged changes

# Dropped from the StackBlitz copy -- none are needed to run the locator.
REMOVE=(
  docs
  CLAUDE.md
  .claude
  .agents
  packages/tokens/build/swift
  packages/tokens/build/kotlin
  packages/tokens/build/dtcg
  packages/tokens/source/tokens-studio
)

# Imported by the locator, so downscaled rather than removed (path:max-width).
DOWNSCALE=(
  apps/locator/src/assets/search-module-hero.png:1000
  apps/locator/src/assets/investment-services.png:800
)

PUSH=false
case "${1:-}" in
  --push) PUSH=true ;;
  '') ;;
  *) echo "Unknown argument: $1 (only --push is supported)" >&2; exit 2 ;;
esac

resize() { # resize <file> <max-width>
  if command -v sips >/dev/null 2>&1; then
    sips -Z "$2" "$1" >/dev/null
  elif command -v magick >/dev/null 2>&1; then
    magick "$1" -resize "$2x$2>" "$1"
  else
    echo "Need sips (macOS) or ImageMagick (magick) to downscale images." >&2
    exit 1
  fi
}

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"
git fetch --quiet origin main

WORKTREE="$(mktemp -d)"
# rm + prune rather than `git worktree remove`, which needs git >= 2.17.
trap 'cd /; rm -rf "$WORKTREE"; git -C "$ROOT" worktree prune' EXIT

git worktree add -B "$BRANCH" "$WORKTREE" "$BASE" >/dev/null
cd "$WORKTREE"

for path in "${REMOVE[@]}"; do
  [ -e "$path" ] && git rm -rq "$path"
done

for entry in "${DOWNSCALE[@]}"; do
  resize "${entry%%:*}" "${entry##*:}"
done

# docs/ isn't shipped, so point the package READMEs' relative PLAN.md links
# at the file on GitHub instead of leaving them dead.
perl -pi -e "s|\(\.\./\.\./docs/PLAN\.md\)|($REPO_URL/blob/main/docs/PLAN.md)|g" packages/*/README.md

# The reviewer README replaces the root one; this tooling isn't shipped.
cp scripts/stackblitz-README.md README.md
git rm -q scripts/stackblitz-README.md scripts/recut-stackblitz.sh

cat > .stackblitzrc <<'EOF'
{
  "installDependencies": true,
  "startCommand": "pnpm --filter locator dev"
}
EOF

git add -A
git commit --quiet -m "Slim the repo for StackBlitz (re-cut from main $(git rev-parse --short "$BASE"))"

echo "Built local '$BRANCH' from $BASE ($(git rev-parse --short "$BASE"))."

if $PUSH; then
  git push --force-with-lease origin "$BRANCH"
  echo "Force-pushed origin/$BRANCH."
else
  echo "Not pushed. Review with: git diff origin/$BRANCH $BRANCH --stat"
  echo "Then rerun with --push, or: git push --force-with-lease origin $BRANCH"
fi
