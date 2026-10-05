---
name: agent-delegation
description: Use when the product-manager is about to dispatch coder, designer, tester or releaser, is splitting a task, is deciding whether agents can run in parallel, or is re-dispatching after a failed or incomplete report.
---

# Delegating to Agents

Agents start **cold**: no conversation, no memory of why. The brief is the only thing they get.

A vague brief produces plausible-looking wrong work; a precise one produces checkable work. Spend the effort here — it is cheaper than a rework round.

> **Limits:** Maximum 2 rework rounds and 4 dispatches per task.

---

## 0. Project-Grounding Rule

All delegation decisions and briefs must be grounded in information that is **verified in the current project** or explicitly provided by the user.

Never invent or assume:

- File or directory paths
- Agent names
- Skill names
- Commands or test scripts
- Branch names
- Configuration names
- Selectors or component names
- Routes
- Game names
- Build tools
- Dependencies
- Acceptance criteria
- Repository structure
- Project conventions
- Existing functionality

Before referencing a project-specific fact in a brief, verify it from the repository.

### Sources of Truth

Use project information in this order:

1. Explicit user instruction
2. Current repository files
3. Project specifications and requirements
4. Existing agent and skill definitions
5. Existing tests and validation scripts
6. Existing project documentation
7. Existing implementation

Do not substitute generic software-development conventions for missing project information.

### Examples Are Not Project Facts

Examples in this skill explain **how to structure delegation**. They do not prove that a path, command, component, script, or convention exists.

For example:

```text
<verified project test command>
<verified file path>
<verified specification section>
<verified agent name>
```

must be replaced only after inspecting the actual project.

Never convert an illustrative example into a real dispatch instruction without verification.

### Unknown Information

If required information cannot be verified, use:

`UNKNOWN`

Then either:

1. Perform bounded read-only discovery
2. Ask the user if the decision belongs to them
3. Stop if proceeding would require guessing

Never fill an information gap with a plausible assumption.

---

## 0a. Execution level (FAST is the default)

Classify first; when unsure between FAST and STANDARD choose FAST unless a concrete risk trigger applies.

| Level | Use for | Delegation | Verification |
|---|---|---|---|
| **FAST** (default) | typo/data fix, one function, one CSS rule, copy/docs, single-mode tweak, small diff without `shared/`, frozen files, schema or storage-key changes | **None.** Do it directly in the main session. No brief, worktree, reviewer or PR/history digging. | One targeted check of what changed, once |
| **STANDARD** | new mode, game logic, multi-file fix, one-game theme | Agents **only when useful**: one `coder`/`designer`, or several for disjoint, independent file sets. Otherwise do it directly. | Implementer's targeted checks + **one** final verification (scoped tester, or the implementer's own run if no tester is needed). A second verification only if the first found a real defect, and then only the changed checks. |
| **HIGH-RISK** | `shared/dansk-core.js`, `shared/sjovt.*`, storage-key/SRS schema, bulk data (~200+ items), multi-game refactor, outward-facing or irreversible actions | **Full orchestration**: PM/orchestrator split, worktree, tester, reviewer where it adds independent value | Broader tests per changed area; regression on other games for `shared/` changes |

Everything below (briefs, file ownership, gate order, retry limits) applies to **STANDARD when agents are used, and HIGH-RISK**. It does not apply to FAST.

Blocker vs advisory: only a failed acceptance criterion, a console error, a spec conflict, a broken invariant, or an explicit repository rule (CLAUDE.md, prd/specs, CI, branch protection, or the user) blocks work. `NOT VERIFIED`, `FLAKY`, style, reviewer comments and optional checks are reported, never blocking.

---

## 1. Decide: Delegate or Do It Yourself

**Default: do it yourself.** Delegate only when the task:

- Has a clear deliverable
- Touches a bounded file set
- Is independently verifiable
- Fits a verified agent role
- **And** delegating is faster, parallel, or needs independent verification. Never spawn an agent or reviewer merely because one exists, or for work that is faster to do directly.

FAST and small STANDARD tasks (game code, data, CSS included) are done directly in the main session. Coordination files you may always edit directly:

- `PROGRESS.md`
- `SCRATCHPAD.md`
- `.claude/agents/`
- `.claude/skills/`
- `.claude/hooks/`

These paths come from the current project rules.

Frozen files (`prd.md`, `specs.md`, `shared/sjovt.*`, `shared/fonts/`, root `index.html`) are never edited by anyone without the user's approval.

Ask the user instead of dispatching when the decision is theirs, including:

- Scope decisions
- Conflicting specifications
- Outward-facing decisions
- Destructive actions

---

## 2. Pick the Agent

Use the project's existing custom agents.

| Need | Agent | Never Ask It To |
|---|---|---|
| Game logic, modes, `data.js`, shared code, bug fixes | `coder` | Restyle or sign off its own work |
| Theme CSS, sprites, layout, motion, responsive/dark/reduced-motion polish | `designer` | Change content, rules or scoring |
| Independent verdict, validation, audit, UI driving | `tester` | Fix the code it tests |
| Merge to `master` and push after a PASS | `releaser` | Work before tester PASS on the exact SHA |
| Read-only discovery across many files | `Explore` | Edit |

These roles are based on the project's existing delegation rules.

### Custom-Agent Enforcement

When a matching custom agent exists under `.claude/agents/`, dispatch that agent by its exact verified name.

Do **not** use `general-purpose` for work that belongs to an existing custom agent.

Before dispatching, verify that the requested agent exists.

If the expected agent does not exist:

1. Do not silently substitute `general-purpose`
2. Check whether another existing agent explicitly owns that responsibility
3. If none does, report the missing role to the coordinator

`general-purpose` may be used only when:

- No verified custom agent owns the task
- The task cannot reasonably be split between existing agents
- The coordinator explicitly records why the fallback is necessary

A `general-purpose` dispatch where a matching custom agent exists is a **delegation error**.

### Skills Are Not Agents

A skill does not become an agent simply because it exists under `.claude/skills/`.

Agents may use relevant skills, but skill selection must also be based on skills that actually exist in the repository.

Do not invent an agent-to-skill mapping.

Before requiring a skill, verify:

```text
.claude/skills/<skill-name>/
```

or the actual project location.

---

## 3. Respect the Gate Order

Use the project's established gates:

```text
Data
  ↓
coder
  ↓
tester
```

```text
Game / mode
  ↓
coder (+ designer where required)
  ↓
tester
```

```text
Design
  ↓
designer
  ↓
tester
```

After tester PASS:

```text
tester PASS on exact SHA
  ↓
releaser
```

The agent that built something must never be its tester.

The `releaser` must not release work that has not received tester PASS on the exact SHA.

---

## 4. Size the Task

Use:

- One deliverable
- One session
- One branch
- One worktree

Verified project convention:

```text
Branch:   task/<id>
Worktree: .worktrees/<id>
```

If acceptance criteria cannot be stated in **6 or fewer checkable lines**, split the task.

Prefer vertical slices that can be tested end-to-end over horizontal layers that cannot be independently verified.

Do not invent a decomposition based on hypothetical architecture. Inspect the affected implementation first.

---

## 5. Parallelize Only When Safe

Run agents concurrently only when **all** of the following are true:

- File sets are disjoint
- File sets have been explicitly listed and compared
- Agents use separate branches/worktrees
- No task depends on another unfinished output
- Shared files are frozen

Known shared files from the project:

```text
shared/sjovt.css
shared/sjovt.js
shared/dansk-core.js
prd.md
specs.md
```

Do not add files to this list merely because they look shared. Verify them first.

### File Ownership

Every file being modified must have one active owner.

If two tasks need the same file, do not run them in parallel.

Instead:

1. Identify the shared change
2. Assign one owner
3. Complete and verify it
4. Then dispatch dependent work

Never allow two agents to modify the same file in parallel and attempt to reconcile their work afterward.

Batch independent dispatches in a single message when safe.

---

## 6. Write the Brief

Use the project's verified `brief-template.md`.

Every brief contains, in this order:

### 1. Goal

State:

- Why the work is needed
- Exact deliverable

Keep it to one clear objective.

### 2. Context Pointers

Reference exact verified project locations.

Example structure:

```text
<verified-file-path> — <verified section>
```

Do not invent section names or paths from memory.

### 3. Workspace

Specify:

```text
Worktree: <absolute verified path>
Branch:   <branch name>
Base SHA: <exact SHA>
```

### 4. Allowed / Forbidden Files

List exact paths.

Do not use:

```text
whatever is needed
```

Default forbidden files from the current project rules include:

```text
prd.md
specs.md
other tasks' files
shared/fonts/
tmp_*
```

If additional restrictions are needed, derive them from the actual task and repository.

### 5. Acceptance Criteria

Acceptance criteria must be:

- Observable
- Measurable
- Relevant to the assigned scope
- Verifiable by someone other than the implementation agent

Use verified project commands and requirements.

Good structure:

```text
- <observable behavior>
- <verified validation command> exits 0
- Zero console errors at <required verified viewports>
```

Never invent a command just to make an acceptance criterion look measurable.

### 6. Constraints

Include only constraints verified from:

- Project documentation
- Existing implementation
- User instructions
- Relevant agent/skill rules

Examples already established by this project include:

```text
vanilla JS
file://
stable item IDs
no CDN
do not change scoring/storage keys
```

Do not add generic engineering preferences as project requirements.

### 7. Known Traps

Read applicable information from:

```text
.claude/agent-memory/
```

Include:

- Relevant lessons
- Previous failures
- What was already tried

This section is mandatory on re-dispatch.

### 8. Report Format

Require:

```markdown
## Status

PASS | PARTIAL | BLOCKED

## Files Changed

- `<path>` — <what changed>

## Commands Run

- `<command>` — PASS | FAIL

## Screenshots / UI States Reviewed

- <state or viewport>

## Acceptance Criteria

- [x] <verified criterion>
- [ ] <failed or unverified criterion>

## Not Verified

- <anything not actually verified>

## Requests

- None

## Lessons

- <reusable project-specific lesson>
```

Do not accept claims without evidence.

### 9. Stop Conditions

The worker must stop rather than improvise when:

- Specifications conflict
- A required shared change falls outside its ownership
- Required project information is `UNKNOWN`
- Danish correctness is uncertain
- Scope must materially expand
- A destructive or outward-facing decision is required

---

## 7. Re-Dispatch After Failure

Never resend the same brief.

A re-dispatch must contain:

1. Original acceptance criteria
2. Failure evidence **verbatim**
3. What was tried
4. Relevant commands and results
5. New hypothesis
6. What must change in this attempt
7. Applicable lessons from `.claude/agent-memory/`

Use the same:

- Agent
- Branch
- Worktree

unless verified evidence shows ownership itself was wrong.

After round 2, or the same root cause three times:

```text
BLOCKED
```

Stop and escalate.

---

## 8. Attempt Limits

### Per Task

- Maximum 2 rework rounds
- Maximum 4 dispatches

### Per Worker / Failing Check

- Maximum 3 attempts
- `seo`: maximum 2 attempts

Each attempt must use a different hypothesis.

### Tester

The tester may rerun a failure once to determine whether it is transient.

### Releaser

- Push retry: 1
- Merge/validation failure: 0

When a cap is reached, return:

```markdown
## Blocked Report

**Task:** <task>

**Attempts:**
1. <attempt>
2. <attempt>

**Last Error / Evidence:**
> <verbatim evidence>

**Best Diagnosis:** <diagnosis>

**Suggested Next Step:** <next step>
```

Never weaken acceptance criteria or widen scope to escape an attempt limit.

---

## 9. Anti-Patterns

Do not dispatch:

> Fix the styling.

No measurable outcome exists.

Do not dispatch:

> Figure out what's wrong and fix it.

unless discovery itself is the explicitly bounded task.

Do not:

- Ask a worker to sign off its own implementation
- Ask a tester to repair the code it tests
- Give unbounded file access
- Parallelize overlapping edits
- Trust `done` without evidence
- Repeat the same failed brief
- Use `general-purpose` when a verified custom agent owns the work
- Invent project paths, commands, components, skills or requirements

---

## 10. After Dispatch

Do not poll or duplicate the agent's work while it runs.

Perform independent coordination work instead.

When the agent returns, verify its report before accepting it.

Use the project's `work-summarization` skill for that procedure.

Treat:

```text
Agent says "done"
```

as a report requiring verification — not as proof of completion.

---

## 11. Final Delegation Principle

The coordinator may prescribe **process**.

The repository supplies **project facts**.

Never reverse those responsibilities.

The coordinator owns:

- Decomposition
- Agent selection
- Scope
- File ownership
- Dependency control
- Verification
- Integration
- Escalation

Agents provide implementation and evidence.

If a project fact has not been verified:

```text
UNKNOWN
```

is better than a plausible invention.

## 12. Review gate
Never convert advisory review signals into blocking gates unless they are explicitly required by repository policy, CI, GitHub branch protection, or the user.

Advisory (report, never block): `NOT VERIFIED` or `FLAKY` on checks outside the acceptance criteria, style and commit-message-format findings, reviewer comments, `PASS WITH ISSUES` minor/major notes, optional checks. Blocking: a failed acceptance criterion, a console error, a spec conflict, a broken invariant (frozen files, storage keys, scoring), or an explicit repository rule.

Do not run a second verification unless the first found a real defect, and then re-check only what changed. Never run the same check twice at the same SHA; cite the earlier result.