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

## Gotchas

- Root `tmp_*.js`, `.tmp_cdp_test.mjs`, and `boejningsvaerkstedet/tmp_*.js` are debug harnesses (e.g. headless DOM shim to boot a game); don't ship them into games.
- Entries flagged `verify: true` in `shared/data/*` need native-speaker review.
- `.claude/agents`, `.claude/skills` (incl. `danish-grammar-qa`, `game-ui-verification`) and `.claude/hooks` are tracked; other `.claude/*` is gitignored.
- Git remotes: `origin` = fork `TarasNS/danske_spiller`, `upstream` = `tasio1/danske_spiller`; default branch `master`.
