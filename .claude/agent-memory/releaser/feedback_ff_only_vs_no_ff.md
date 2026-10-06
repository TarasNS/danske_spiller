---
name: ff-only-vs-no-ff
description: Callers may ask for --ff-only merge; releaser procedure mandates --no-ff merge commit
metadata:
  type: feedback
---

Brief for pronomen-fix said "merge with --ff-only", but the release procedure specifies `--no-ff --no-commit` so the merge commit records `Tested: <branch>@<sha>`.

**Why:** the procedure is the gate; the merge commit carries the audit trail and lets validations run before committing.
**How to apply:** follow the procedure, and mention the deviation in the report.
