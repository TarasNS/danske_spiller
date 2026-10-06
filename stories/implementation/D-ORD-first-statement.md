# D-ORD (decision #4): Ordstillingsdetektiven, first statement

## Summary
- The case story box (`<details class="storybox">`) is now closed by default on EVERY statement, including the 1st, in all three headers (case, weak, final). Toggle: summary text "Læs sagen" (closed) / "Skjul sagen" (open), with a triangle marker (CSS) and a visible focus ring. A native `<details>/<summary>` is keyboard operable (Enter and Space) and min-height 44 px (existing rule).
- Persistence: `G.storyOpen` (default false at every case/weak/final start). If the learner opens the story it stays as chosen until the case ends (`loadQuestion()` applies `sb.open=!!G.storyOpen`, `ontoggle` records the choice). A new case starts closed.
- Statement 1 position: the play card starts ~280 px down the page (page h1/intro above it), so collapsing alone was not enough (tiles still at 774-830, UNDERSØG 850-902 at 1366x768). `keepAnswerInView(first)` now also runs on statement 1: it scrolls `#playScreen` (HUD, header, prompt) to the top (64 px margin, instant) and the existing fallback (prompt under MENU bar, or UNDERSØG outside viewport) then scrolls `#qArea` to the top where the card does not fit (360x640, 390x844 case 1). Instant scroll, so reduced-motion safe. `keepAnswerInView()` otherwise unchanged; US-023 `alt` logic, US-028/031/050 changes, explainer wiring, timer untouched.
- Opening the story manually on statement 1 pushes content down (layout intact, no horizontal scroll, prompt still visible at 1366/390; at 360x640 prompt top 247, UNDERSØG 661-713 below the fold until scrolled). Accepted: the learner chose to read.

## Measurements (top-bottom px; MENU bar always 0-56)
Statement 1, case 1 correct run (cases 3, 5, wrong runs, weak, final equivalent, see test results):

| Viewport (vh) | English line | Tiles | UNDERSØG | NÆSTE after check (focused) |
|---|---|---|---|---|
| 1366x768 | 423-450 | 558-614 | 634-686 | 710-762 |
| 390x844 | 308-363 | 471-595 | 615-667 | 789-841 |
| 360x640 | 96-150 | 258-382 | 478-530 | 585-637 |
| 360x640 reduced motion | 96-150 | 258-382 | 478-530 | 588-640 |
| 430x932 | 503-557 | 665-789 | 809-861 | 874-926 |

Before (V-ORD2, story open): 1366 UNDERSØG 931-983; 390 ~1115-1216; 360 ~1197-1438.
Worst statement-1 cases: m390 case 5 UNDERSØG 784-836 (vh 844); 360x640 reduced motion case 5 English 96-177, tiles 285-477, UNDERSØG 573-625 (vh 640), NÆSTE 588-640 (exactly at vh, as in the earlier retry).

## Tests (scratchpad `impl/d2-ord/`, Edge headless)
- `v.cjs` (adapted from V-ORD2, checks now for statements 1..N): 5 configs (1366x768, 390x844, 360x640, 360x640 reduced motion, 430x932) x cases 1, 3, 5 x correct (12 statements) / wrong (3 statements, lives) + weak + final (6 statements) = 40 runs. Per statement: prompt top >= MENU bottom (56), English line, tiles and UNDERSØG inside innerHeight, no horizontal scroll; after check NÆSTE inside viewport and `document.activeElement.id==="nextBtn"` (never BODY); no auto-advance after 1.2 s. Result: RUNS 40, TOTAL VIOLATIONS 0, console/page errors 0 (re-run after final CSS edit: same). Before the `playScreen` scroll: 96 violations (statement 1 tiles/UNDERSØG below fold in every run).
- `tg.cjs` (toggle): at 1366, 390, 360 statement 1 starts closed ("Læs sagen"); mouse click opens (summary changes to "Skjul sagen", story text visible, no h-scroll, MENU unaffected); keyboard: focus summary, Enter opens, Space closes, focus stays on SUMMARY; opened story persists to statement 2; starting a new case (3) is closed again; 0 errors.
- Screenshots looked at (`s1-<vp>-closed.png`, `s1-<vp>-open.png`): closed state shows MENU bar, card header, "LÆS SAGEN", prompt, tiles, UNDERSØG without scrolling at 1366x768 and 390x844; at 360x640 the page is scrolled so the prompt/tiles/UNDERSØG show and the case header/toggle sit just above the fold. Open state shows the story text readable above the prompt. (A first screenshot showed a broken glyph for the marker due to a CSS escape error, fixed.)
- Smoke: `node tests/smoke.mjs ../ordstilling-detektiv/index.html .casebtn` Verdict PASS (all rows, using `.casebtn`).
- Focus (US-031): first tile focused on load, NÆSTE focused after check; toggle test showed activeElement never BODY in play.

## Files changed
- `ordstilling-detektiv/index.html`: 3 caseHead templates (~l.907, 935, 956: removed `open`, new "Læs sagen"/"Skjul sagen" summary spans); `loadQuestion` (~l.1011-1014: `G.storyOpen`, `keepAnswerInView(G.i===0)`); `keepAnswerInView(first)` (~l.1024-1036).
- `shared/themes/ordstilling.css`: appended summary marker, open/closed label and focus ring rules after the US-013 `.storybox` block.

## Risks
- At 360x640 and (statements 2..N) 390x844 the toggle itself is scrolled just above the viewport (the prompt wins over the header); the learner scrolls up a few dozen px to find "Læs sagen". Statement 1 at 1366 and 390 shows the toggle in view.
- Opening the story at 360x640 pushes UNDERSØG below the fold until scrolled (by choice).
- Scroll runs on each statement start only, not on resize. Page jumps to the card on case start (instant).
- Label "Læs sagen" wording is mine; native review of "Læs sagen" / "Skjul sagen" advisable.

Status: IMPLEMENTED
