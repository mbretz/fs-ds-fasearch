#!/usr/bin/env bash
# SessionStart hook: performs the /catchup skill's data-gathering itself and
# injects the results directly as context, rather than just instructing
# Claude to go invoke the skill. This makes catchup happen deterministically
# every session instead of depending on the model acting on an instruction.
#
# Skips on "clear"/"compact" (mid-session resets, not a real new session) —
# only fires on a genuine startup/resume.
#
# NOTE: the file list below duplicates .claude/skills/catchup/SKILL.md's
# step 1. If you add/remove/rename a doc there, update read_or_note calls
# here too (and vice versa).
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"

input="$(cat)"
source="$(echo "$input" | jq -r '.source // empty')"

if [ "$source" = "clear" ] || [ "$source" = "compact" ]; then
  exit 0
fi

read_or_note() {
  local path="$1"
  if [ -f "$path" ]; then
    printf '### %s\n\n' "$path"
    cat "$path"
    printf '\n\n'
  else
    printf '### %s\n\n(missing — skip)\n\n' "$path"
  fi
}

body="$(
  printf '## Automated catchup (SessionStart hook)\n\n'
  printf 'This is the /catchup skill'"'"'s data, gathered automatically at session start so it always runs regardless of whether the skill is explicitly invoked. Read it, then report the usual concise catchup summary (branch/tree state, what shipped recently, standing conventions/gotchas, testing-plan status, any open "next target" question) before starting new work — no need to re-read these files yourself.\n\n'

  read_or_note "CLAUDE.md"
  read_or_note "docs/PLAN.md"
  read_or_note "docs/FIGMA_COMPONENT_AUDIT.md"
  read_or_note "packages/tokens/HAND_ADDED_TOKENS.md"
  read_or_note "docs/TESTING_PLAN.md"
  read_or_note "RESUME_NOTES.txt"

  printf '### git status --short --branch\n\n```\n'
  git status --short --branch 2>&1 || true
  printf '```\n\n'

  printf '### git log --oneline -8\n\n```\n'
  git log --oneline -8 2>&1 || true
  printf '```\n'
)"

jq -n --arg body "$body" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $body
  }
}'

# catchup-complete-sound.sh (PostToolUse, matcher: Skill) only fires when
# the /catchup skill is explicitly invoked via the Skill tool — which no
# longer happens for the automatic startup catchup now that this hook
# injects the data directly. Play the same cue here so the audible
# "you're oriented" signal still fires on every session start.
( afplay /System/Library/Sounds/Glass.aiff 2>/dev/null || osascript -e 'beep' 2>/dev/null || true ) &

