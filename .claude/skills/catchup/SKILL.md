---
name: catchup
description: This skill should be used when the user asks to "catch up", "catch me up", "get up to speed", "review the project docs", "get oriented", or runs "/catchup". Reviews the standing set of project docs (some gitignored) plus current git state, then reports a concise status summary before new work starts.
argument-hint: '[@extra-file ...]'
---

# Catchup

Get oriented at the start of a session: read the standing set of project
docs, note current git state, and report a concise summary before diving
into new work.

## Procedure

1. Read each of the following, via the `Read` tool, in this order. If a
   file doesn't exist (e.g. `RESUME_NOTES.txt` was deleted at the end of
   the last session, or hasn't been created yet), skip it and note that
   in the summary rather than treating it as an error.

   - `CLAUDE.md` (root)
   - `docs/PLAN.md`
   - `docs/FIGMA_COMPONENT_AUDIT.md` (gitignored — `Read` still works,
     `.gitignore` only affects the `@`-mention autocomplete picker, not
     direct file reads)
   - `packages/tokens/HAND_ADDED_TOKENS.md` (gitignored, same as above)
   - `docs/TESTING_PLAN.md` (gitignored, same as above — check its own
     header for planned-vs-implemented status before trusting its
     contents; skip if it doesn't exist)
   - `RESUME_NOTES.txt` (gitignored scratch file, same as above)

2. If `$ARGUMENTS` contains additional file references — whether typed as
   `@file` mentions (already resolved into context by the time this
   skill runs, in which case just use that content directly) or plain
   paths (strip a leading `@` if present, then `Read` the path) — fold
   those in too. Don't re-read a file whose content is already visible
   in context from an `@`-mention resolution.

3. Run `git status --short --branch` and `git log --oneline -8` to see
   the current branch, working-tree state, and recent commit history.

4. Report a concise summary covering:

   - Current branch and working-tree state (clean vs. uncommitted
     changes — flag anything unexpected rather than silently proceeding
     past it).
   - What shipped in the most recent session(s), per `RESUME_NOTES.txt`
     and recent commits.
   - Any standing conventions or gotchas worth keeping in mind for new
     work (pull from `docs/PLAN.md`'s dated notes and `RESUME_NOTES.txt`).
   - `docs/TESTING_PLAN.md`'s current status (planned vs. actually
     implemented — check its header, don't assume from memory of past
     sessions) if the file exists.
   - The open "next target" decision, if `RESUME_NOTES.txt` flags one —
     surface it as a question for the user, don't pick for them.
   - Anything from the extra referenced files (step 2), if any were
     given.

   Keep this readable as a short briefing, not a wall of text — headers
   or a short bullet list per topic, not a full re-quote of every doc.
