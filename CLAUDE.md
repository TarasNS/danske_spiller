# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Sjovt Dansk" — static, browser-only Danish learning games (A1–C1 grammar/vocab). Vanilla HTML/CSS/JS only: **no frameworks, no build step, no `fetch`/XHR/CDN, no analytics/cookies**. Every game must work when opened via `file://` with zero console errors. Fonts are local (`shared/fonts/`); never add Google Fonts links.

## Commands

There is no build or lint. Open an `.html` file directly in a browser.

```
# Smoke + a11y matrix for one game (puppeteer-core; 3 viewports, dark/light/reduced-motion, localStorage blocked)
cd tests && npm install
node smoke.mjs <path/to/game.html> [playSelector=#btn-play] [--shots]
# e.g. node smoke.mjs ../boejningsvaerkstedet/index.html
# Exit 1 on failure; re-run a failing game once before trusting it (flaky). Smoke only — functional/content checks are separate.

# Dataset validation (unique IDs, allowed levels, required fields, correct-in-options, dupes after normalize)
node shared/validate.js
```

There is no single-test runner beyond `smoke.mjs` per game. `build-loop.sh` is an unattended-agent runner (hardcoded Windows path, needs `NTFY_TOPIC` in gitignored `.build-env`) — don't run it casually.

## Execution policy (FAST is the default)

Pick the cheapest sufficient path. When unsure between FAST and STANDARD, choose FAST unless a concrete risk trigger below applies. Don't announce the level unless asked.

- **FAST** (default): typo/data fix, one function, one CSS rule, copy/docs, single-mode tweak, small diff with no `shared/` / frozen file / schema / storage-key change. Edit directly in the main session: no subagent, no reviewer, no worktree, no PR/history investigation. Run one targeted check for what you touched (`node --check`, `node shared/validate.js` for data, or one `smoke.mjs <that game>` for visible UI), once.
- **STANDARD**: new mode, game logic, multi-file fix, theme for one game. Implement directly or with one `coder`/`designer` (more than one only for disjoint, independent file sets). One final verification (tester scoped to changed paths, or the implementer's own targeted run if no tester is needed).
- **HIGH-RISK**: `shared/dansk-core.js`, `shared/sjovt.*`, storage-key/SRS schema, bulk data (~200+ items), multi-game refactor, anything outward-facing or irreversible. Full PM/orchestrator flow, worktree, tester, and a reviewer where it adds independent value.

Rules at every level:
- Never run the same verification twice at the same SHA; cite the earlier result. Re-check only what changed afterwards.
- Never spawn a subagent or reviewer merely because one exists, or for work that is faster to do directly.
- Advisory findings (`NOT VERIFIED`, `FLAKY`, style, reviewer comments, optional checks) are reported, not blocking. A blocker is a failed acceptance criterion, a console error, a spec conflict, a broken invariant, or an explicit rule in this repo.
- Safety/product constraints in this file, `prd.md` and `specs.md` apply at every level.

## Architecture

- **Games** are self-contained: a folder with `index.html` (+ optional `data.js`), or a single root-level `.html` (older games: `adverbs.html`, `magiske_verber.html`, `idiomjaeger.html`, `dansk-praepositioner.html`, `danish-antonyms-game.html`; others live in folders like `forbindenor/`, `konjunktioner/`, `danske-phraser/`, `en og et/`). `index.html` at the root is the portal/homepage.
- **`shared/dansk-core.js`** → `window.DanskCore`: `tts` (Danish SpeechSynthesis), `store` (namespaced localStorage), `srs` (Leitner 5-box; key `<game>:<mode>:<item-id>`), `diff`, `level`, `ui`, `quiz`. Progress keys must use stable item IDs, never array indices.
- **`shared/data/*.js`** are canonical word lists (nouns, adjectives, verbs, pronouns, clause-patterns) exposed as `window.DANSK_*`. Per-game `data.js` files are often *generated at load time* from these (e.g. `boejningsvaerkstedet/data.js` builds Mode 1 from `DANSK_NOUNS`), so changing shared data changes item counts in games.
- **Visual identity** ("Sjovt" pixel-arcade skin) is layered on top: `shared/sjovt.css` + `shared/sjovt.js` (`window.Sjovt`, injects the `← MENU` bar, fx helpers, sprites) + per-game `shared/themes/<game-id>.css`. These shared design files and `index.html` are frozen — see `docs/redesign/AGENT-BRIEF.md` for the reskin rules (don't change learning content, scoring, SRS, or storage keys when reskinning).
- Standard script order in a game: `../shared/dansk-core.js`, then needed `../shared/data/*.js`, then `./data.js`.

## Hard requirements (from `prd.md`)

Danish UI text; TTS replay button on every Danish prompt; correct = animation + sound + ~800 ms auto-advance (no congratulatory text); wrong = correct answer + one grammar note + TTS replay (no encouragement); 360 px min width, no horizontal scroll, 44×44 px targets, full keyboard operation, dark mode, reduced motion, sound mute; progress survives reload and reset needs confirmation.

## Agent-driven workflow docs (precedence matters)

`prd.md` (platform rules) > `specs.md` (per-game specs, owner-edited only) > `PROGRESS.md` (task queue). Never edit `prd.md`/`specs.md` during build runs; on conflict, move the task to Blocked. `SCRATCHPAD.md` is an append-only run log — read its "Resume Here" section first when continuing work. `specs.md` marks some games as complete with exclusions (e.g. no further antonym/synonym game) — check it before adding a game.

## Worktrees and parallel streams

Use a git worktree per stream when several agents or people work at once. Worktrees share one repository (commits, branches, remotes) but each has its own files, index and checked-out branch; uncommitted edits are invisible to other worktrees, and a branch can be checked out in only one worktree at a time.

- **Split by file, not by count.** Tasks touching the same file (or `shared/*`, frozen files, schema/storage keys) stay in one stream, run in order. Independent games/files may run in parallel; max 3 streams. Each stream commits on its own branch; merge only after its checks pass, and don't push `master` casually (every push to `master` deploys to simply.com).
- **A new worktree has only tracked files.** `tests/node_modules` is missing: run `cd tests && npm install`, or run `smoke.mjs` from the main checkout's `tests/` and pass the worktree's game path.
- **Chrome path.** `tests/lib/harness.mjs` defaults to `C:/Program Files/Google/Chrome/Application/chrome.exe`. Without Chrome (e.g. only Edge), set `CHROME_PATH` to the browser executable.
- **Play selector.** `smoke.mjs` defaults to `#btn-play`; some games differ (Konjunktioner `#startBtn`, Præpositioner `#menu .mode-btn`). Wrong selector = false FAILs; pass the right one as the second argument.
- **Clean up when merged:** `git worktree remove <path>` then `git branch -d <branch>` (use `-D` only after confirming the work is in `master`). Stories/specs untracked in the main checkout are not present in a worktree: pass the text in the task prompt.

## Gotchas

- Root `tmp_*.js`, `.tmp_cdp_test.mjs`, and `boejningsvaerkstedet/tmp_*.js` are debug harnesses (e.g. headless DOM shim to boot a game); don't ship them into games.
- Entries flagged `verify: true` in `shared/data/*` need native-speaker review.
- `.claude/agents`, `.claude/skills` (incl. `danish-grammar-qa`, `game-ui-verification`) and `.claude/hooks` are tracked; other `.claude/*` is gitignored.
- Git remotes: `origin` = fork `TarasNS/danske_spiller`, `upstream` = `tasio1/danske_spiller`; default branch `master`.
