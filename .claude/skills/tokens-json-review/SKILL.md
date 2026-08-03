---
name: tokens-json-review
description: This skill should be used when the user asks to "review tokens.json", "review the token export", "check the Figma variable export", "re-review tokens", "check tokens against the plan", "review the token JSON again", or opens/edits packages/tokens/source/tokens.json and asks for a review or validation pass.
---

# Tokens.json Review

Review a Figma-variable export (`packages/tokens/source/tokens.json`) for
structural validity and alignment with the conventions in `docs/PLAN.md`
section 1.2 (five-collection, three-tier token architecture: `primitives`
→ `semantic` → `component`, plus `density` (`condensed`/`roomy`) and
`color` (`light`/`dark`) as mode collections).

This file is disposable, one-way plugin output (`docs/PLAN.md` §1.1): it
gets overwritten by the next Figma export. Never hand-edit it to silence a
finding — always point back to what needs fixing in Figma, or in the
Style Dictionary parser if the issue is about export shape rather than
authoring.

## Procedure

1. Run the bundled checker against the file:

   ```bash
   python3 .claude/skills/tokens-json-review/scripts/check_tokens.py packages/tokens/source/tokens.json
   ```

   This performs, in order:
   - **Double-encoding / JSON validity** — the file must parse to a plain
     object on the first `json.loads()`. If it parses to a *string*, the
     export was double-stringified (a known failure mode of some export
     plugins/workflows) and must be re-saved as a plain JSON object before
     anything else is worth checking. This is a blocker — the script exits
     immediately.
   - **Unit-suffix leftovers** — type-aware, not a blanket "no unit ever"
     rule. A unit-suffixed value (`"16px"`) is only flagged when the
     token's own declared `type` is something other than `"dimension"`.
     Two legitimate source conventions coexist depending on where the
     file came from: community-plugin exports never declare `"dimension"`
     at all (only `color`/`fontFamily`/`number`), so any unit suffix
     there means a raw number that should have stayed unitless per
     PLAN.md §1.2 (units get attached later by the Style Dictionary
     transform). Tokens Studio Pro exports (with "convert numbers to
     dimensions" enabled) correctly declare genuine dimensions as
     `"dimension"` and bake the unit in at the source, per standard DTCG
     practice — that's expected, not a violation. Either way, a unit
     suffix on anything declared `fontWeight`/`number`/`color` is still
     wrong — a `"400px"` font-weight is invalid CSS regardless of which
     export produced it.
   - **Mode key-parity** — for collections that are genuinely multi-mode
     (auto-detected — see "How mode detection works" below), every mode
     must define the same set of leaf tokens. A token present in `light`
     but missing from `dark` (or `condensed` but missing from `roomy`)
     is a real gap.
   - **Alias resolution** — DTCG-style `{path.to.token}` alias values are
     resolved against the full token tree, including mode-relative
     resolution (a component token that references a bare path like
     `{control.action.color.default}` is expected to resolve inside
     whichever `color` mode is currently active, not as an absolute
     top-level path). Any alias that doesn't resolve in **any**
     collection/mode is reported — these are almost always an authoring
     slip in Figma (dropped path segment, misspelled segment, wrong
     token name) and need fixing at the source.
   - **Typo heuristics (advisory)** — flags mid-word capitalization
     anomalies (e.g. `backGroundColor` instead of `backgroundColor`) and
     exact case-variant duplicate keys at the same nesting level. This
     never fails the run; report it as a note, not a blocker.

2. Read the script's output in full and translate it into a review
   summary for the user, organized as:
   - **Blockers** — double-encoding, or anything that would break the
     Style Dictionary build outright.
   - **Fixed since last review** (if this is a re-review) — name what
     was previously flagged and is now confirmed clean, so progress is
     visible.
   - **Remaining issues** — grouped by category (units, mode parity,
     broken aliases, typos), with exact paths so they can be found and
     fixed in Figma.
   - If everything passes, say so plainly and note the file is ready to
     feed into the Style Dictionary config — don't manufacture findings.

3. For every broken alias or unit/typo finding, give the exact dotted
   path and (for broken aliases) what the likely correct path is if it's
   inferable from a sibling token or the equivalent token in another
   component. Don't just say "some aliases are broken" — list them.

## How mode detection works (read before trusting a "mismatch" finding)

Figma exports mix two structurally different kinds of grouping under the
same JSON shape (a dict of dicts with no `value` key at the parent level):

- **Genuine modes** (`density.condensed` / `density.roomy`,
  `color.light` / `color.dark`) — structurally near-identical siblings;
  same leaf paths, different values. These *should* have matching keys.
- **Category groupings** (`semantic.content` / `semantic.control` / ...,
  `component.button` / `component.card` / ...) — siblings that happen to
  live in the same collection but are semantically unrelated. These are
  *expected* to have completely different keys.

The script tells these apart automatically using Jaccard similarity of
normalized leaf-path sets between siblings (threshold 0.5, in
`MODE_SIMILARITY_THRESHOLD`) — only collections where every pair of
children overlaps heavily are treated as multi-mode. Don't manually flag
a `semantic.content` vs `semantic.control` key difference as a "mode
mismatch" — that's expected and by design, not a defect. If the
architecture changes (e.g. a new mode is added, or a collection is
restructured), re-run the script rather than reasoning about parity by
hand — the naive "just diff every sibling" approach produces hundreds of
false positives on this file (verified while building this skill).

## If the plugin's export doesn't alias at all

Some free Figma variable-export plugins flatten every value to a
resolved literal instead of a `{path.to.token}` reference, defeating the
whole point of the primitive → semantic → component tier structure (a
color rebrand or dark-mode edit won't propagate). If the alias-resolution
check reports **zero** `{...}` references found at all (not "broken",
*absent*), that's a signal the export tool itself is the problem, not
the Figma authoring — flag this distinctly from a normal alias-resolution
failure and suggest a DTCG/W3C-format-aware exporter instead of a plain
"variables to JSON" one.

## Fixing double-encoding

If the file is double-encoded (the whole thing is one big JSON string
with escaped `\n`/`\t`/`\"`), fix it with:

```bash
python3 -c "
import json
path = 'packages/tokens/source/tokens.json'
data = json.loads(open(path).read())
assert isinstance(data, str), 'not double-encoded — investigate before running this'
inner = json.loads(data)
json.dump(inner, open(path, 'w'), indent=2)
open(path, 'a').write('\n')
"
```

Verify afterward with `python3 -c "import json; json.load(open('packages/tokens/source/tokens.json'))"` before re-running the full checker.
