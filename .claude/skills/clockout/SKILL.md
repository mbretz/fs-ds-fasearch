---
name: clockout
description: This skill should be used when the user asks to "clock out", "wrap up", "end the session", "update resume notes", or runs "/clockout". Reviews what happened this session and updates the standing project docs (RESUME_NOTES.txt freely; docs/PLAN.md, packages/tokens/HAND_ADDED_TOKENS.md, and docs/TESTING_PLAN.md only after flagging the specific addition) so the next /catchup starts from an accurate baseline.
---

# Clockout

Close out a session: figure out what actually happened, then bring
`RESUME_NOTES.txt` (and, where warranted, `docs/PLAN.md` /
`packages/tokens/HAND_ADDED_TOKENS.md` / `docs/TESTING_PLAN.md`) up to
date so the next session's `/catchup` has an accurate baseline. This is
the mirror image of `/catchup` — that skill reads these docs at session
start, this one writes them at session end.

## Procedure

1. Read the current state of the standing docs, same set `/catchup`
   reads: `docs/PLAN.md`, `packages/tokens/HAND_ADDED_TOKENS.md`
   (gitignored), `docs/TESTING_PLAN.md` (gitignored), `RESUME_NOTES.txt`
   (gitignored). Skip any that don't exist rather than erroring.

2. Reconstruct what happened this session:

   - `git log --oneline -15` and `git status --short --branch` for
     commits/branches/PRs created, and current working-tree state.
   - `git diff --stat` (and `git diff` for anything non-trivial) for
     uncommitted work.
   - Your own conversation context for the _why_ behind those changes —
     decisions made with the user, dead ends tried and abandoned, bugs
     found and fixed, standing conventions established. This is the part
     `git log` alone can't reconstruct, and it's the most valuable part
     of `RESUME_NOTES.txt` — don't let it thin out into a bare commit
     list.

3. Diff that against what `RESUME_NOTES.txt` currently says (its last
   "STATUS AS OF" date/section). If nothing meaningful happened since
   then (e.g. this session was pure Q&A, no commits, no uncommitted
   changes), say so and stop — don't rewrite the file just to churn it.

4. Rewrite `RESUME_NOTES.txt`, matching its existing structure and
   register (see the file's own history for the pattern): a "STATUS AS
   OF `<date>`" header, a "NEW THIS SESSION" section per major piece of
   work (branch/PR, what shipped, key API/token decisions and why,
   real bugs found), a "STANDING CONVENTIONS" index of anything durable
   established this session, and a "NEXT TARGET" section if there's an
   open decision for next time — phrase it as a question for the user,
   never a pre-made choice. Overwrite the whole file; this is a scratch
   doc, not something to patch incrementally.

5. Check whether anything shipped this session needs a dated note in
   `docs/PLAN.md` (a new component, a deviation from the plan) or a new
   row in `packages/tokens/HAND_ADDED_TOKENS.md` (a hand-added token not
   yet documented there) that didn't get written inline during the
   session. If you find a real gap, draft the addition and show it to
   the user before writing — these are committed, narrative docs other
   sessions and the audit trail depend on, not scratch state, so they
   get the same review step commit messages do. Don't invent a dated
   note for work that already has one.

6. If `docs/TESTING_PLAN.md` exists, check whether its own
   planned-vs-implemented header still matches reality after this
   session's work (e.g. it said "planned, not implemented" but this
   session actually wrote the config/dependency bumps/CI workflow it
   describes). If the status moved, flag the specific mismatch and
   propose the header update — same review-before-write treatment as
   step 5, this file isn't scratch state either.

7. Report back: what got rewritten in `RESUME_NOTES.txt`, what (if
   anything) you're proposing for `PLAN.md`/`HAND_ADDED_TOKENS.md`/
   `TESTING_PLAN.md` and why, and confirm the working tree state so the
   user knows whether anything's still uncommitted before they close
   the session.
