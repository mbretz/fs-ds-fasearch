---
name: branch
description: This skill should be used when the user asks to "create and checkout a branch", "make a new branch", "create a branch called X", "branch off of Y", "checkout a new branch based on Z", or runs "/branch". Creates a new git branch and checks it out, optionally based on a branch other than the current one.
argument-hint: [new-branch-name] [base-branch]
allowed-tools: Bash(git status:*), Bash(git branch:*), Bash(git checkout:*), Bash(git rev-parse:*)
model: haiku
---

# Branch

Create a new git branch named `$1` and check it out. If `$2` is given, base
the new branch on `$2` instead of the current branch.

## Procedure

1. If `$1` is empty, stop and report usage: `/branch <new-branch-name> [base-branch]`.

2. Run `git status` to confirm the working tree state. Do not stash, commit,
   or discard anything on the user's behalf — `git checkout -b` does not
   touch uncommitted changes, so no cleanup is needed before branching.

3. Confirm `$1` does not already exist as a local branch:

   ```bash
   git branch --list "$1"
   ```

   If it already exists, stop and tell the user the branch name is taken —
   do not overwrite or delete the existing branch.

4. If `$2` was given, confirm it exists (locally or on the remote) before
   using it as the base:

   ```bash
   git rev-parse --verify "$2"
   ```

   If it does not resolve, stop and report that the base branch was not
   found — do not guess an alternative.

5. Create and check out the branch:

   - With a base branch given: `git checkout -b "$1" "$2"`
   - Without one (base off current branch): `git checkout -b "$1"`

6. Report the branch created and, if applicable, what it was based on.
