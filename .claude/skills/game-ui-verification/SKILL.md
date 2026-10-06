---
name: game-ui-verification
description: Use when a STANDARD or HIGH-RISK UI change (game, theme, sprite, page layout) needs real-browser evidence (console errors, 360 px overflow, dark mode, file://), and when writing a game-specific test in tests/. Not required for FAST edits; optional there (one smoke run on the touched game).
---

# Verifying a game UI

Evidence beats inspection: run the game via `file://`, measure, and look at screenshots. The harness lives in `tests/` (puppeteer-core + installed Chrome).

## When to use (conditional, not mandatory)
- **FAST edit:** not required. If the change is visible UI, one `smoke.mjs` run on the touched game is enough; skip screenshots and the extra matrix.
- **STANDARD/HIGH-RISK UI change:** run it once on the affected game/screens, and record the SHA. Don't repeat it at the same SHA; the tester cites it unless the report lacks command output.
- Only the checks relevant to the changed files; the "does NOT cover" list below is for writing game-specific tests, not a checklist for every task.

## Setup (once)
```bash
cd tests && npm i          # node_modules is gitignored
```
Chrome path defaults to `C:/Program Files/Google/Chrome/Application/chrome.exe` (override with `CHROME_PATH`).

## Run the generic smoke matrix
```bash
cd tests && node smoke.mjs ../<game-id>/index.html [playSelector] [--shots]
```
- `playSelector` defaults to `#btn-play`; other games use different ids — find the Spil button first (`grep -n "Spil" <game>`).
- `--shots` saves start/play PNGs per viewport to `docs/redesign/screenshots/<game>/<viewport>-<screen>.png`. **Open them with Read** — a PNG you didn't look at is not evidence.
- Exit code 1 = at least one FAIL. Re-run once before trusting a FAIL; a pass-then-fail is `FLAKY`, not PASS.

What it checks: console errors/warnings, page errors, failed requests (all must be zero) · no horizontal scroll at 360/390/820/1440 · tap targets ≥44 px on the play screen · unlabelled icon buttons · visible keyboard focus rings · dark/light text contrast ≥4.5:1 · reduced-motion still playable · game survives `localStorage` throwing.

## What the smoke script does NOT cover (write a `tests/<game-id>.mjs` for these)
Import helpers from `tests/lib/harness.mjs` (`launch`, `openGame`, `hasHorizontalOverflow`, `smallTapTargets`, `focusRingProblems`, `lowContrast`, `shot`, `sleep`).
- Correct answer → auto-advance 700–900 ms, no congratulatory text; wrong answer → correct answer + exactly one note + replay, waits for input.
- Every mode reachable and playable; round-end screen content (score, accuracy, ≤3 weakest, one primary Spil igen).
- Free-text accepts every listed variant (case, final punctuation, apostrophes).
- Keyboard: number keys select options, Enter submits, Escape closes overlays.
- SRS persistence: answer, reload, state survives under `<game-id>:<mode>:<item-id>`; keys never index-based.
- Timed modes have an untimed Træning default.
- Content correctness → see the `danish-grammar-qa` skill. Dataset structure → `node shared/validate.js`.
- Muted mode silent; æøå and long Danish words render/wrap.

## Gotchas
- The Sjovt preloader curtain covers first paint; `openGame` waits 1.5 s. Interact earlier and clicks hit the curtain.
- Always open with `pathToFileURL` (done by `openGame`) — testing over http hides `file://` failures.
- Screenshots < 400 KB; use viewport shots, not huge fullPage ones.
- Debug harnesses (`tmp_*.js`) do not belong in the repo root; use the scratchpad.
- Never mark a check PASS that you did not run: use NOT VERIFIED with the reason.
