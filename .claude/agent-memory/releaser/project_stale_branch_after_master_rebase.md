---
name: stale-branch-after-master-rebase
description: Task branches cut before a master rebase carry duplicate bookkeeping commits and fail the scope gate
metadata:
  type: project
---

task/pronomen-fix contained d06f50e plus f0afa8a (a boejning-data bookkeeping commit that master already had in rebased form as 1c27388). `git diff --stat master...branch` therefore showed PROGRESS.md and SCRATCHPAD.md changes, which are outside a data.js-only scope.

**Why:** Rebasing master leaves the branch with the old copies of commits, so the diff is larger than the brief states.

**How to apply:** Run `git log master..<branch>` and the diff stat before merging. If extra commits appear, refuse and ask the PM to rebase the branch onto master. That changes the sha, so a re-test is needed. Also refuse when a required check such as the content audit is NOT VERIFIED, even if the brief claims the gates are clear.
