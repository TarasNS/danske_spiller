# D-PRON-spil-focus (regression N1)

Status: IMPLEMENTED

## Cause
US-037 moved Spil to the top of the start card. `showStart()` still called `btn-play.focus()` without `preventScroll`, and the page kept the scroll position of the long results screen. The browser then scrolled Spil to the very top of the viewport, under the 56 px sticky MENU bar. Reproduced before the fix in Pronomenmysteriet (2 of 3 runs at 360x640) and Tidsmaskinen (1 of 3 runs at 360x640).

## Change
One two-line change in `showStart()` of each game: `window.scrollTo(0, 0);` then `btn-play.focus({ preventScroll: true })`. The scroll reset is needed because preventScroll alone keeps the stale scroll offset of the results screen.
- `pronomenmysteriet/index.html` lines 344-345
- `tidsmaskinen/index.html` lines 857-858

Untouched: US-031 focus on Spil (never BODY), US-030 reset, US-037 layout, US-042 queue, data and explainer wiring.

## Before / after (real round, results, "Til start"; Spil rect vs 56 px bar and viewport height)
| Game / viewport | Before (y, top, bottom, ok) | After (y, top, bottom, ok) |
|---|---|---|
| Pron 360x640 run 1 | 369, 40-104, FAIL (partly under bar) | 0, 409-473, PASS |
| Pron 360x640 run 2 | 0, 407-471, PASS | 0, 409-473, PASS |
| Pron 360x640 run 3 | 409, 0-64, FAIL (under bar, elementFromPoint is not Spil) | 0, 409-473, PASS |
| Pron 390x844 | 18, 367-431, PASS | 0, 385-449, PASS |
| Pron 1366x768 | 0, 346-410, PASS | 0, 346-410, PASS |
| Tids 360x640 run 1 / 2 | 32, 288-352, PASS | 0, 320-384, PASS |
| Tids 360x640 run 3 | 320, 0-64, FAIL | 0, 320-384, PASS |
| Tids 390x844 / 1366x768 | PASS | 0, 320-384 / 324-388, PASS |

After the fix every case: top >= 56, bottom <= viewport height, `document.activeElement` is `#btn-play`, scrollY 0, Spil receives the hit-test at its centre.

## Tests
- Script `scratchpad\impl\d4-pron\t.mjs` (output `before.json`, `after.json`, screenshots in `shots/`): real round, results, "Til start", Spil probe; then Spil, Escape back to start, probe. All Escape paths PASS after the fix, zero console errors/page errors/failed requests. Screenshot `after-pron-m360-tilstart.png` checked: Spil fully visible below the bar.
- `node smoke.mjs ../pronomenmysteriet/index.html`: PASS (all rows). `node smoke.mjs ../tidsmaskinen/index.html`: PASS (all rows).
- `tests/pronomenmysteriet.mjs` and `tests/tidsmaskinen.mjs` not run (dump files). No stray files created in the repo.

## Notes
- The mid-round x button was not found by the generic selector, so only Escape and "Til start" were probed; both use `showStart()`, the same fixed code.
- First load: `document.activeElement` is BODY both before and after (initial load never called `showStart()`; unchanged baseline behaviour, not part of this regression). Spil is visible there (y 409-473 at 360x640).

## Files changed
`pronomenmysteriet/index.html`, `tidsmaskinen/index.html` (plus this report). `git status` shows other workers' files too; none touched by me.
