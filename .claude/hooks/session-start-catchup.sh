#!/usr/bin/env bash
# SessionStart hook: injects an instruction to run the /catchup skill.
# Skips on "clear"/"compact" (mid-session resets, not a real new session) —
# only fires on a genuine startup/resume.
set -euo pipefail

input="$(cat)"
source="$(echo "$input" | jq -r '.source // empty')"

if [ "$source" = "clear" ] || [ "$source" = "compact" ]; then
  exit 0
fi

jq -n '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: "Session just started in this repo (fs-ds-fasearch). Before doing anything else, invoke the /catchup skill to get oriented — it reads docs/PLAN.md, packages/tokens/HAND_ADDED_TOKENS.md, docs/TESTING_PLAN.md, RESUME_NOTES.txt, and current git state, then reports a concise status summary."
  }
}'
