# Agent evals

Regression tests for the Claude Code configuration (`CLAUDE.md`, `.claude/agents|skills|hooks`). Each case replays a real historical task.

```
node evals/run.mjs --selftest              # no model call: graders must fail at `from`, pass at `fix`
node evals/run.mjs [--case <id>] [--runs N] # real runs; needs the `claude` CLI + auth
```

## How a run works
1. Export the tree at `from` (no git history, so the fix can't be read), overlay the **current** `CLAUDE.md` + `.claude/{agents,skills,hooks}` . Permissions come from `evals/settings.json` via `--settings` (project settings are ignored in untrusted workspaces). `agent-memory/` is not injected. Commit that as a local baseline.
2. `claude -p <prompt>` in that checkout. Not `--bare`, so the config is actually loaded.
3. `may_change` is checked first (any other changed or new path fails the case).
4. Only then are the current `shared/validate.js` and `evals/checks/*` run against the result. Graders never exist in the evaluated checkout while Claude works.

## Case file (`evals/cases/<id>.json`)
`id`, `from` (parent of the historical fix), `fix` (the fix commit, used only by `--selftest`), `prompt`, `may_change` (globs; `**` crosses folders), `checks` (shell commands, exit 0 = pass; `{root}` = this repo; run with the evaluated checkout as cwd), optional `min_pass` (default: majority of runs).

## Adding a case
Pick a small, single-concern fix with an objective outcome. Write a grader in `evals/checks/` using `lib.mjs` (`git show HEAD:<file>` gives the pre-task baseline), then run `--selftest`. Don't pick tasks needing language judgement, and check that the docs at `from` (`stories/`, `PROGRESS.md`) don't already contain the answer.

## Caveats
- Locally, `~/.claude` skills/memory can still load. CI sets `EVAL_CLEAN_HOME=1` to use an empty HOME; for local runs set it too if you have an API key.
- Env: `EVAL_BUDGET_USD` (default 3 per run), `EVAL_TIMEOUT_MS` (default 15 min).
- Transcripts and diffs land in `evals-out/` (gitignored, uploaded as a CI artifact).
- Needs the `ANTHROPIC_API_KEY` repo secret. Fork PRs skip the model job.
