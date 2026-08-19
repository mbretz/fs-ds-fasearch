#!/usr/bin/env bash
# PostToolUse hook (matcher: Skill): plays a short OS sound when the
# /catchup skill call finishes, as an audible "you're oriented" signal.
set -euo pipefail

input="$(cat)"
skill="$(echo "$input" | jq -r '.tool_input.skill // empty')"

if [ "$skill" = "catchup" ]; then
  afplay /System/Library/Sounds/Glass.aiff 2>/dev/null || osascript -e 'beep' 2>/dev/null || true
fi
