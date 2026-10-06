# Worker brief (applies to every implementation worker)

Project: "Sjovt Dansk", `C:\Users\TarasTsarenko\Downloads\Dansk\danske_spiller`, branch `qa-implementation`. Vanilla HTML/CSS/JS, must work over `file://`, no build, no fetch/CDN, zero console errors. Read `CLAUDE.md` first.

## Inputs
- Your assigned stories: read each in full in `stories/QA-USER-STORIES.md` (search `## US-0xx`). Consolidated findings: `qa/FINAL-QA-REPORT.md` (`QA-xxx`); raw worker reports in `qa/*.md` for extra evidence.
- For Danish content use `.claude/skills/danish-grammar-qa/SKILL.md`.
- `stories/IMPLEMENTATION-PLAN.md` explains ownership. Batch 1 outcomes are in `stories/implementation/US-001..004.md`.

## Hard rules
1. **Only edit the files listed as yours.** Other workers are editing other files concurrently. If you discover you need another file (shared code, another game, `shared/dansk-core.js`, `shared/explainer/*`, tests), STOP that part, finish the rest, and report it as a "shared dependency" in your output file. Never edit frozen files: `shared/sjovt.css`, `shared/sjovt.js`, portal `index.html`, `prd.md`, `specs.md`, `CLAUDE.md`.
2. **Stay in the story scope.** No refactoring, formatting changes, unrelated content changes, new features, dependency/config changes. Record unrelated problems under "Newly discovered issues" and do not fix them.
3. **No git state changes:** no commits, branches, stash, checkout, reset, `npm install`. (Reading with `git show/diff/log` is fine.)
4. **Content you're not sure of:** you are not a native speaker and no native sign-off exists. Apply only corrections that the QA evidence shows to be clearly wrong and where you're confident; list everything doubtful under "Needs native review" and leave it unchanged. Keep item IDs / storage keys / data shapes stable unless the story says otherwise.
5. **Keep PRD behaviour** (`prd.md`): Danish UI text, 360 px min width, 44x44 px targets, keyboard operation, progress survives reload, reset needs confirmation. Don't change scoring/SRS/storage keys unless the story says so.
6. **Temp files only in the scratchpad:** `C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\impl\<your-owner-name>\`. Existing tests (`tests/smoke.mjs`, `tests/tidsmaskinen.mjs`, `tests/pronomenmysteriet.mjs`) may write dump files into the repo root: run them so that nothing is left behind and delete anything they create; before finishing run `git status --short` and confirm only your owned files changed (plus `stories/implementation/*.md`).

## Tests
- Browser: `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"` (Chrome is not installed). `puppeteer-core` is at `tests/node_modules` (require by absolute path from scratchpad scripts; see `tests/lib/` helpers).
- `cd tests && CHROME_PATH=... node smoke.mjs <path/to/game.html>`. Legacy root-level games have no `#btn-play`: the "play button found" / "console clean + still playable" rows then fail as a known artefact; report it, and judge the rest.
- `node shared/validate.js` whenever `shared/data/*.js` changed.
- For each acceptance criterion write your own check (script or manual drive) and record the result. Where a bug was reproduced before the fix, show the before/after (use `git show HEAD:<file>` copies for "before").

## Output (required for every story you own)
Write `stories/implementation/US-XXX.md` (one per story; if a story has several slices owned by different workers, append your slice under a heading with your owner name) containing:
1. Implementation summary (what changed, in plain words)
2. `Status:` one of IMPLEMENTED / NEEDS REVIEW / BLOCKED (do not write VERIFIED; an independent agent does that)
3. Tests run + exact results (including pre-existing failures, attributed)
4. Manual verification performed
5. Files changed (with line ranges)
6. Remaining risks
7. Newly discovered issues (recorded only)
8. "Needs native review" list (content stories)
9. Acceptance-criteria table: every criterion from the story copied verbatim with PASS / FAIL / NOT VERIFIED (criteria needing native sign-off or owner approval = NOT VERIFIED)

Finish with a short summary message (stories, status, key test results, anything blocked).

---

## Batch 4 addendum (P2/P3 polish)

- **Earlier batches are already in the working tree and committed on branch `qa-implementation`.** Read `git log`/`git diff HEAD~0` and the earlier reports for your files; do not revert, restyle or re-do them (Batch 1–3 additions you must keep intact include: localStorage guards, TTS buttons, weak-word streak fields, `explainer:open/close` listener blocks, `data-explainer` lines, Danish content corrections, the US-002 distractor block in `Forbindenor.html`).
- **Cross-game stories are split into per-owner slices.** Do ONLY the slice for the game(s) you own, as named in your assignment. Read the whole story for context (the other games' parts belong to other workers running concurrently).
- **Report files:** for a story that has several owners (US-028, 030, 031, 033, 034, 037, 041, 042, 050) write your report to your OWN file `stories/implementation/US-XXX-<OWNER>.md` (e.g. `US-037-W-DM.md`), never to a shared `US-XXX.md`, so parallel workers cannot overwrite each other. For stories with a single owner write `stories/implementation/US-XXX.md` as before. Same standard sections + criteria table (criteria that concern your slice; mark criteria that concern other games as "other owner").
- **Order of work:** P2 stories first, then P3 stories, each in dependency order (the story's Dependencies field).
- **Frozen files stay frozen:** `shared/sjovt.css`, `shared/sjovt.js`, portal `index.html`, `prd.md`, `specs.md`, `CLAUDE.md`. If a story slice cannot be done without editing them (e.g. a new sprite in `sjovt.js`, confetti layering in `Sjovt.fx`, the portal slice of US-050), do NOT do it: write `Status: BLOCKED` with the exact reason and what owner approval is needed, and move on. Reuse existing sprites/helpers where the story allows. Don't edit `shared/dansk-core.js` / `shared/dansk-speech.js` either (shared by many games): report a shared dependency instead.
- **Never run `git add`, `git commit`, `taskkill`, or anything that kills other processes** (two earlier incidents: `taskkill //IM node.exe`). If your own test hangs, kill only its PID.
- Tests that write dump files into the repo (`tests/tidsmaskinen.mjs`, `tests/pronomenmysteriet.mjs`, smoke with `--shots`) must be run with output redirected to your scratchpad, or the generated files deleted afterwards. `git status --short` at the end must show only your owned files + `stories/implementation/*.md`.

---

## Batch 5b addendum (per-game adoption of the shared pieces: US-029, US-038, US-039 unblocked slices)

Shared pieces already exist (verified or being verified): `shared/tts-button.css`, `shared/sd-extras.css`, `ttsButton` label "Lyt" in `shared/dansk-core.js`, the pixel ▶ in the explainer, and the icon map `docs/redesign/icon-map.md` + per-game table in `stories/implementation/B5-icon-map.md`. Read `stories/implementation/B5a-shared.md` (exact adoption snippets) and `B5-icon-map.md` (your game's rows) FIRST. You own ONLY your game files and `shared/themes/<game>.css`. Frozen files stay untouched (`shared/sjovt.css`, `shared/sjovt.js`, portal `index.html`, `prd.md`, `specs.md`, `CLAUDE.md`); never touch `.claude/*`, `docs/*`, other shared files. If the shared CSS/JS needs a change, report it as a shared dependency; don't edit it.

Your slices (apply only what concerns your game; read the story text `## US-029`, `## US-038`, `## US-039` in `stories/QA-USER-STORIES.md` and the evidence in `qa/visual-consistency-review.md`):
1. **US-029 TTS button:** replace every "listen" control (♪, ▶, pixel speaker, text, none) by the shared `.dc-tts-button` (markup/`DanskCore.ui.ttsButton` per the adoption snippet), aria-label "Lyt" (or "Lyt til sætningen"/similar Danish label where a longer label is clearer), ≥44×44, link `../shared/tts-button.css` (drop `../` for root-level games) AFTER the theme CSS; delete the theme's old `.dc-tts-button::before` glyph rules and any ♪/▶-for-TTS styling in your theme/game CSS; ▶ is reserved for the explainer (also replace any other ▶ marker in your game, e.g. Glosekort's current-card marker, with a pixel/neutral marker or `aria-current` styling); keep TTS behaviour (what is spoken, when, replay) unchanged; a game that has no TTS at all stays without (record it).
2. **US-038 icons:** apply the icon-map rows for your game (identity/header sprites, mode-menu sprites, achievement/streak sprites) using ONLY existing sprites; no row mixes 16px and 32px densities; Tidsmaskinen header `tidsstjerne`, Bøjningsværkstedet one title with `tandhjul`, Dansk Mester header `snak`. En/Et was already re-picked (decision #8): only check it matches the map.
3. **US-039 per-game parts:** (a) blank placeholders → `.sd-gap` (link `../shared/sd-extras.css`) where your game has sentence blanks; (b) level/category badges → `.sd-badge` (neutral; green/red only for feedback) — check the existing `.sd-badge` in `sjovt.css` and use `.sd-badge--panel` per the snippet; (c) selects → `class="sd-select"`; (d) dark-surface outliers (Magiske Verber, Præpositioner, Dansk Mester, Glosekort) → `.sd-surface` per the snippet so light cards don't stay light in dark mode; (e) Idiomjæger inline TTS → `.dc-tts-button--sm`; (f) back-control wording: in-game back controls say "← TILBAGE" (✕ only to quit a round) where your game has a different wording/glyph; keep behaviour. Keep all text Danish; keep keyboard order, focus management (US-031) and ≥44px targets.
Never change game logic, scoring, storage keys, data, or earlier-batch features; minimal diffs; no refactors.

Tests (scratchpad `…\scratchpad\impl\b5b-<game>\`; Edge `CHROME_PATH=…msedge.exe`): game loads with zero console errors; screenshots BEFORE/AFTER at 1366x768, 390x844 and 360x640 in light and dark (LOOK; describe) of start/menu, question, feedback and results screens; TTS button measured (≥44×44, aria-label), click → exactly one `speechSynthesis.speak` with `da-DK`, focus ring visible; no h-scroll; sprites crisp and in one density per row; `grep` shows no ♪/▶ used for TTS in your files; `node tests/smoke.mjs <game>` (cd tests; legacy `#btn-play` artefact rows aside); blocked-storage run; a short full round. `git status --short` at the end shows only your files + `stories/implementation/*.md`.
Reports: `stories/implementation/B5b-<GAME>.md` (one per game; standard sections + a table per slice: US-029 / US-038 / US-039 with PASS/FAIL/NOT VERIFIED/NA and why).
