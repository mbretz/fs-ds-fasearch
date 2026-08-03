#!/usr/bin/env python3
"""
Structural + naming + alias-resolution check for a Figma variable export
(packages/tokens/source/tokens.json in this repo) against the conventions
documented in docs/PLAN.md section 1.2.

Usage:
    python3 check_tokens.py <path-to-tokens.json>

Exit code is 0 if no findings, 1 if any findings were reported (double
encoding, broken JSON, unit leftovers, mode-key mismatches, or unresolved
aliases). Typo detection is advisory only and never affects exit code.
"""
import json
import re
import sys
from collections import defaultdict


def fail(msg):
    print(f"BLOCKER: {msg}")
    sys.exit(1)


def load(path):
    with open(path, "r") as f:
        raw = f.read()
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        fail(f"file is not valid JSON at all ({e}). Check for stray commas, "
             f"truncated export, or a non-JSON wrapper.")
    depth = 0
    while isinstance(data, str):
        depth += 1
        try:
            data = json.loads(data)
        except json.JSONDecodeError as e:
            fail(f"file is double/triple-encoded JSON and even the inner "
                 f"string does not parse ({e}).")
    if depth:
        print(f"BLOCKER: file is double-encoded JSON ({depth} extra layer(s) "
              f"of string-escaping). Re-save as a plain JSON object — see "
              f"'Fixing double-encoding' in SKILL.md.")
        sys.exit(1)
    if not isinstance(data, dict):
        fail(f"top level of the file is a {type(data).__name__}, not an object.")
    return data


MODE_SIMILARITY_THRESHOLD = 0.5


def detect_modes(data):
    """Identify, for each top-level collection, which of its immediate
    children are genuine parallel *modes* (e.g. density: condensed/roomy,
    color: light/dark) as opposed to unrelated *category* groupings
    (semantic: content/control/layout..., component: button/card/...).

    Real modes are near-identical in structure -- same leaf paths, values
    differ. Category groups are structurally unrelated siblings that just
    happen to live in the same collection. Distinguish them by average
    pairwise Jaccard similarity of normalized leaf-path sets across all
    children of a collection: only flag a collection as multi-mode if
    every child overlaps heavily with every other child.

    Returns {collection_name: {mode_name: subtree, ...}, ...} containing
    only collections that qualified.
    """
    modes_by_collection = {}
    for coll_name, coll in data.items():
        if not isinstance(coll, dict):
            continue
        children = {k: v for k, v in coll.items() if isinstance(v, dict)}
        if len(children) < 2:
            continue
        leafsets = {
            name: {".".join(p) for p, _ in collect_leaves(tree)}
            for name, tree in children.items()
        }
        names = list(leafsets)
        pair_scores = []
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                a, b = names[i], names[j]
                union = leafsets[a] | leafsets[b]
                if not union:
                    continue
                pair_scores.append(len(leafsets[a] & leafsets[b]) / len(union))
        if pair_scores and min(pair_scores) >= MODE_SIMILARITY_THRESHOLD:
            modes_by_collection[coll_name] = children
    return modes_by_collection


def collect_leaves(node, path=()):
    """Yield (path_tuple, value_dict) for every dict that has a 'value' key."""
    if isinstance(node, dict):
        if "value" in node:
            yield path, node
            return
        for k, v in node.items():
            yield from collect_leaves(v, path + (k,))


def check_units(data):
    print("\n== Unit-suffix check ==")
    bad = []
    for path, leaf in collect_leaves(data):
        v = leaf.get("value")
        if isinstance(v, str) and re.fullmatch(r"-?\d+(\.\d+)?(px|em|rem)", v):
            bad.append((".".join(path), v))
    if bad:
        print(f"{len(bad)} value(s) still carry a unit suffix "
              f"(should be bare numbers per PLAN.md §1.2 — units are "
              f"attached later by the Style Dictionary transform):")
        for p, v in bad:
            print(f"  {p} = {v!r}")
    else:
        print("OK — no px/em/rem-suffixed numeric values found.")
    return bad


def check_mode_parity(data, modes_by_collection):
    """For collections detect_modes() identified as genuinely multi-mode,
    diff the leaf-path sets across modes — every mode should define the
    same set of tokens, just with different values."""
    print("\n== Mode key-parity check ==")
    problems = []
    for coll_name, modes in modes_by_collection.items():
        leafsets = {
            name: {".".join(p) for p, _ in collect_leaves(tree)}
            for name, tree in modes.items()
        }
        names = list(leafsets)
        for i in range(len(names)):
            for j in range(i + 1, len(names)):
                a, b = names[i], names[j]
                only_a = leafsets[a] - leafsets[b]
                only_b = leafsets[b] - leafsets[a]
                if only_a or only_b:
                    problems.append((coll_name, a, b, only_a, only_b))
    if problems:
        for coll_name, a, b, only_a, only_b in problems:
            print(f"MISMATCH in '{coll_name}': '{a}' vs '{b}'")
            for p in sorted(only_a):
                print(f"  only in {a}: {p}")
            for p in sorted(only_b):
                print(f"  only in {b}: {p}")
    elif modes_by_collection:
        detected = ", ".join(
            f"{c} ({'/'.join(m)})" for c, m in modes_by_collection.items()
        )
        print(f"OK — detected mode collections [{detected}] all have "
              f"matching keys across their modes.")
    else:
        print("No multi-mode collections detected (nothing to compare).")
    return problems


def check_alias_resolution(data, modes_by_collection):
    """Values shaped like '{path.to.token}' are DTCG-style aliases. Resolve
    each one against: (a) the collection's own top-level namespace roots
    (primitives/semantic/component expose their sub-keys, e.g. 'ref',
    'content', 'button', directly as roots), and (b) every mode subtree of
    every genuinely multi-mode collection (color.light, density.roomy,
    etc., as identified by detect_modes()), since tokens that vary by
    theme/density commonly alias a bare, mode-relative path that only
    resolves inside the currently active mode."""
    print("\n== Alias resolution check ==")

    mode_collection_names = set(modes_by_collection)
    namespace = {}
    mode_roots = {}
    for coll_name, coll in data.items():
        if not isinstance(coll, dict):
            continue
        if coll_name in mode_collection_names:
            for mode_name, mode_tree in modes_by_collection[coll_name].items():
                mode_roots[f"{coll_name}.{mode_name}"] = mode_tree
        else:
            for k, v in coll.items():
                if isinstance(v, dict):
                    namespace[k] = v

    def resolve_in(tree, parts):
        cur = tree
        for p in parts:
            if not isinstance(cur, dict) or p not in cur:
                return False
            cur = cur[p]
        return isinstance(cur, dict) and "value" in cur

    def resolve(path):
        parts = path.split(".")
        if parts[0] in namespace and resolve_in(namespace[parts[0]], parts[1:]):
            return True
        for tree in mode_roots.values():
            if resolve_in(tree, parts):
                return True
        return False

    total = 0
    broken = []
    for path, leaf in collect_leaves(data):
        v = leaf.get("value")
        if isinstance(v, str) and v.startswith("{") and v.endswith("}"):
            total += 1
            if not resolve(v[1:-1]):
                broken.append((".".join(path), v))

    print(f"{total} alias reference(s) found; {len(broken)} unresolved.")
    for p, v in broken:
        print(f"  {p} -> {v}  (no token at that path in any collection/mode)")
    return broken


def check_typo_heuristics(data):
    """Advisory only: flag internal-capitalization anomalies (e.g.
    'BackGround' instead of 'Background') and near-duplicate keys that
    differ only by case at the same nesting level (e.g. 'miscellaneous' vs
    'miscillaneous' would NOT be caught here since they're not case
    variants of each other -- this catches exact-case-fold duplicates,
    which most often indicate a rename that missed one spot)."""
    print("\n== Typo heuristics (advisory) ==")
    findings = []

    known_words = [
        "background", "foreground", "miscellaneous", "separator", "padding",
        "border", "color", "radius", "weight", "height", "width",
    ]

    def walk(node, path=()):
        if isinstance(node, dict):
            if "value" in node:
                return
            by_lower = defaultdict(list)
            for k in node:
                by_lower[k.lower()].append(k)
            for lower, variants in by_lower.items():
                if len(variants) > 1:
                    findings.append(
                        f"case-variant duplicate keys at {'.'.join(path) or '<root>'}: {variants}"
                    )
            for k, v in node.items():
                for word in known_words:
                    for m in re.finditer(word, k, re.IGNORECASE):
                        matched = m.group()
                        # expected shapes: all-lowercase ('background') or a
                        # single leading capital ('Background', at a
                        # camelCase word boundary). Any other capital inside
                        # the match (e.g. 'backGround') is suspicious.
                        if any(c.isupper() for c in matched[1:]):
                            findings.append(
                                f"suspicious mid-word capitalization in key "
                                f"'{k}' at {'.'.join(path)} (found '{matched}', expected '{word}' or '{word.capitalize()}')"
                            )
                walk(v, path + (k,))

    walk(data)
    if findings:
        for f in findings:
            print(f"  {f}")
    else:
        print("No obvious mid-word-capitalization or case-variant duplicate keys found.")
    return findings


def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(2)
    path = sys.argv[1]
    data = load(path)

    print(f"Loaded {path} — valid JSON, single-encoded.")
    print(f"Top-level collections: {list(data.keys())}")

    modes_by_collection = detect_modes(data)

    unit_problems = check_units(data)
    mode_problems = check_mode_parity(data, modes_by_collection)
    alias_problems = check_alias_resolution(data, modes_by_collection)
    check_typo_heuristics(data)  # advisory, doesn't affect exit code

    print("\n== Summary ==")
    blockers = bool(unit_problems or mode_problems or alias_problems)
    if blockers:
        print("FAIL — see findings above.")
        sys.exit(1)
    else:
        print("PASS — no unit, mode-parity, or alias-resolution issues found.")
        sys.exit(0)


if __name__ == "__main__":
    main()
