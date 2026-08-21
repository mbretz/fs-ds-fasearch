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
  printf '## \xe2\x9a\xa0\xef\xb8\x8f MANDATORY FIRST ACTION — read this before anything else \xe2\x9a\xa0\xef\xb8\x8f\n\n'
  printf 'GATE CONDITION: your very first output this session, before any tool call and before addressing the user'"'"'s message — no matter what that message asks, even if it looks urgent or trivial — MUST be a visible catchup summary printed as plain chat/CLI text. Not a tool call, not silent internal review of the data below: printed text the user can read. This is not optional and does not depend on being asked.\n\nRequired contents of that summary (concise, a few lines each):\n- branch/tree state\n- what shipped recently\n- standing conventions/gotchas\n- testing-plan status\n- any open "next target" question\n\nOnly after that text has been posted do you move on to the user'"'"'s actual request. This rule applies identically every single session — do not treat any session as an exception.\n\nThis is the /catchup skill'"'"'s data, gathered automatically at session start so the gate above always fires regardless of whether the skill is explicitly invoked. No need to re-read these files yourself, this context already has everything.\n\n'

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

