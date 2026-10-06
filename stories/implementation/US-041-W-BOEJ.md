# US-041 (W-BOEJ slice) - Cancel pending timers when leaving a round

## 1. Implementation summary
The five `window.setTimeout(advance, 800)` calls (Modes 1-6 renderers) now go through `scheduleAdvance()`, which stores the id in `advanceTimer`. `clearPending()` clears the timer and the number-key handler; it is called from `showStart` (Escape and back button), `startRound`, `renderItem`, `finishRound` and "Gentag fejl". `advance()` also returns early if the play screen is hidden. Result: Escape/back during the 800 ms wait leaves the round for good; no hidden item is rendered, no number-key handler is registered on the start screen, no progress is written.

Status: IMPLEMENTED

## 3. Tests run
`t4.mjs` (Edge):
- Mode 5: correct answer, Escape within 800 ms, wait 1.2 s: start screen visible, play screen stays hidden PASS.
- Press 1 and 2 on the start screen: saved SRS item count unchanged (1 -> 1) PASS.
- Mode 1: correct answer then back button within 800 ms: stays on start, no hidden render PASS; no console/page errors PASS.
- Before-state not re-run in a browser; the pre-fix behaviour is from QA GAME-018/020 (timer never stored, `showStart` only removed the key handler, so `advance` ran after Escape and `renderItem` re-registered the number-key handler). Smoke PASS.

## 5. Files changed
`boejningsvaerkstedet/index.html`: timer helpers (~676-687), `showStart` (~603), `renderItem`/`advance`/`finishRound`/`startRound`, five call sites, "Gentag fejl" handler.

## 6. Remaining risks
None known.

## 7. Newly discovered issues
None.

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| Each listed timer id is stored and `clearTimeout` is called in quit/showStart/end handlers (pattern: Pronomenmysteriet and Tidsmaskinen). | PASS for Bøjningsværkstedet; Antonymer and Dansk Mester: other owner |
| Repro scripts: no hidden render, no progress write after Escape, and no pageerror on a quick Afslut. | PASS for Bøjningsværkstedet (scripted); others: other owner |
