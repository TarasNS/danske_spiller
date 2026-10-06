# REGRESSION-R3 — Konjunktioner, Ordstillingsdetektiven, Pronomenmysteriet, Tidsmaskinen, pixel-animation, shared explainer (10 games)

Branch `qa-implementation` (HEAD `353b8a3`), real Edge via `file://`, 1366x768 / 390x844 / 360x640 (explainer matrix: 360x740, 390x844, 1366x768, 1440x900). Read-only on the repo; scripts, logs and screenshots are in `...\scratchpad\impl\R3\` (`shots/`, `*.log`, `*.json`). The machine was shared with other regression runs, so timing rows are noisy; every FAIL below was re-run or analysed.

Verdict: **no P0/P1 regression; one new Minor UX defect (N1)**. All P0/P1 stories for these games re-test as PASS except where native-speaker sign-off is required (UNCONFIRMED).

## 1. Per-game table

PASS counts are scripted checks (own scripts: console, flow, scoring, SRS, persistence, blocked storage, keyboard, geometry). Screenshots looked at: start, question, feedback (right/wrong), results at 1366, 390 and 360 for each game.

| Check | Konjunktioner | Ordstillingsdetektiven | Pronomenmysteriet | Tidsmaskinen |
|---|---|---|---|---|
| Loads, zero console/page errors/failed requests (3 vp) | PASS | PASS | PASS | PASS |
| Start flow + every mode starts | PASS (start, 4 level filters A1-B2 + all) | PASS (12 cases, locked/unlocked, finale unlocks at 12 solved, finale 100/100 played at 1366) | PASS: all 6 modes, real data, no "Test sentence/opt1/opt2/Test note" anywhere | PASS: all 9 modes |
| Correct/incorrect feedback, progression, scoring, SRS | PASS: +10/+10/+20 combo, lives, rule + correct answer, record in `kkHi` (no SRS in this legacy game) | PASS: verdict, correct sentence, tip, TTS, lives, streak, score, weak-sentence mode | PASS: slip = correct answer + note + TTS + Videre; score matches; SRS box 2 for right, box 1 for wrong, stable ids `pronomenmysteriet:<mode>:<id>` | PASS: same incl. 2-slot Hvis-portalen, build step in mode 3; SRS written |
| Completion screen | PASS (game over + "Gennemgå fejl" review + "Gennemgang færdig") | PASS (LØST / GENÅBN / ØVET / finale MESTER with time+best) | PASS (summary, weak list, cross-game link) | PASS |
| Restart / back to menu | PASS | PASS (Prøv igen, Sagskort, back mid-case, confirmed reset) | PASS (Spil igen, Til start, x, Esc, reset with confirm clears SRS only) but see N1 | PASS, see N1 |
| Persistence across reload | PASS (Rekord) | PASS (stamps, unlocks, best %) | PASS (mode + SRS) | PASS (mode + SRS) |
| Blocked localStorage (getter throws AND methods throw) | PASS / PASS | PASS / PASS (full case played) | PASS / PASS | PASS / PASS |
| Explainer opens, tabs play, Esc closes, focus back | PASS (2 tabs) | PASS (6 tabs) | PASS (6 tabs) | PASS (10 tabs) |
| Desktop 1366x768 | PASS (see N3 note) | PASS | PASS | PASS |
| Mobile 390x844 / 360x640 | PASS / PASS | PASS / PASS (US-013 not regressed) | PASS / PASS except N1 at 360x640 | PASS / PASS (N1 seen once at 360x640) |
| Keyboard-only round | PASS (Enter start, 1-4, Enter next, Enter on game over restarts) | PASS (Enter on tiles -> UNDERSØG -> NÆSTE, focus never on body, ends on Prøv igen) | PASS (Enter on Spil, digits, Enter on Videre) | PASS |
| Scripted totals (d1366 / m390 / m360) | 24/24, 24/24, 24/24 | 34/34 each (finale full run 100/100 also PASS) | 48/48, 48/48, 47/48 (N1) | 60/60 each |
| `tests/smoke.mjs` (4 vp, dark/light/reduced motion, blocked storage) | PASS | PASS (run with `.casebtn` selector; the default `#resetBtn` opens a `confirm()` and hangs the harness - harness artefact) | PASS | PASS |
| Official spec test | n/a | n/a | `tests/pronomenmysteriet.mjs` 65/66: only "Space toggles a chip" (known test bug: all chips start pressed). First run, under load: 63/66 incl. two auto-advance timing flakes, passed on the quiet re-run | `tests/tidsmaskinen.mjs` 152/153: only "correct: auto-advance 700-1000 ms" (n=144, min 848, max 1259, known flaky/load). "timed expiry: no SRS write" passed this time |

`pixel-animation.html`: loads with zero console errors and no h-scroll at all 4 smoke viewports, blocked-localStorage no crash (the `#btn-play`-style rows fail by design). No changes expected, none found.

Notes on cells:
- Konjunktioner has no auto-advance (manual "Næste", legacy behaviour, unchanged from baseline).
- Pronomenmysteriet data: `pronomenmysteriet/data.js` is byte-identical to `b9abb96` (same sha256), 760 items (A2 304 / B1 288 / B2 168), keys exactly the 6 game modes.
- Repo hygiene: no dump files left (`tids-*.json`, `tests/tids-dumps.json` and `pm-items.json` were redirected to the scratchpad via `OUT`). `git status` shows other workers' uncommitted edits (`.claude/skills/agent-delegation/SKILL.md`, `boejningsvaerkstedet/index.html`, `shared/themes/boejningsvaerkstedet.css`, `stories/IMPLEMENTATION-PLAN.md`, REGRESSION-R1/R2) which are not mine; I changed nothing in the repo except this file.

## 2. Shared explainer matrix (all 10 games)

Games: adverbs, dansk-praepositioner, magiske_verber, boejningsvaerkstedet, en og et, forbindenor, konjunktioner, ordstilling-detektiv, pronomenmysteriet, tidsmaskinen = 43 game/tab combinations = the 35 distinct scenes. Run at 360x740, 390x844, 1366x768 (stepped through every step, 650 ms settle) and 1440x900 (real-time autoplay).

| Check | 360x740 | 390x844 | 1366x768 | 1440x900 |
|---|---|---|---|---|
| Opens from the entry button (43/43) | PASS | PASS | PASS | PASS |
| Reaches `window.__explainerDone` (43/43) | PASS | PASS | PASS | PASS (real time, ~28 s each) |
| Nothing clipped (every text element inside `.xpm-screen`, checked after every step) | PASS (0) | PASS (0) | PASS (0) | PASS (0) |
| Controls inside the panel and viewport, panel does not scroll | PASS | PASS | PASS | PASS |
| Tab strip compact (57 px high; scrolls horizontally with fade when tabs overflow) | PASS | PASS | PASS | PASS |
| Esc closes and focus returns to the entry button (43/43) | PASS | PASS | PASS | PASS |
| Zero console errors / failed requests | PASS | PASS | PASS | PASS |
| "Skal tjekkes" badge hidden in production | PASS (0 badges) | PASS | PASS | PASS |
| Entry button 44 px high; label "HJÆLP" at <=420 px, "FORKLARING" above | 78x44 HJÆLP | 78x44 HJÆLP | 127x44 | 127x44 |
| Modal buttons >= 44x44 | PASS | PASS | PASS | PASS |

Additional explainer checks (360x740 and 1366x768, 22/23 each; the one FAIL is a test artefact, see below):
- `?dev=1` and `localStorage sd-dev=1` show the badge on exactly the 18 `verify:true` scenes (adv 1, prep 1, mv 1, boej 3, konj 1, pron 5, tids 6; ordstilling 0). Without the flag: 0.
- Rule card centred: left/right margins equal (e.g. 9/9 px) in all 43 scenes at 360 (US-036 required <=2 px).
- Load failure (scene scripts aborted): Danish "Forklaringen kunne ikke indlæses. Luk og prøv igen, eller genindlæs siden." with `role=alert`, Luk focused, Esc closes, focus returns.
- Explainer with blocked localStorage (both variants) opens, steps, closes, zero errors, in all 4 games.
- Reduced motion: scenes are manual (no autoplay), stepping reaches done, in all 4 games.
- Modal keyboard: focus lands on Luk, Tab trap holds (0 escapes in 14 Tabs), ArrowRight switches tab, Space/Enter/Esc work; game keys (1-4, Enter) do NOT act while the modal is open (pron, konj, tids).
- Timers pause on `explainer:open` and resume on `explainer:close` (frozen 4 s while open, resumes at 1/s, a second open/close does not double the tick), at 1366 and 360: en/et Lynrunde (58->58->55), Præpositioner Lynrunde, Magiske Verber Hurtigduel, Tidsmaskinen "Med tid" timed mode: all 16/16 at both viewports.
- "Tokens" row failed only in my script (it counted hex literals across all sheets): `modal.css` has 17 `var(--sd-*, fallback)` uses; the only hex values in it are the fallbacks. PASS.

## 3. P0/P1 re-test

| Story | Result | Evidence |
|---|---|---|
| US-001 Pronomenmysteriet data + guard | **PASS** | `node tests/pronomen-data-guard.mjs`: "PASS pronomen-data-guard: 6 modes, 760 items, levels A2/B1/B2". `data.js` sha256 equals `git show b9abb96:pronomenmysteriet/data.js`. `grep -c "Test sentence\|opt1\|Test note"` = 0. Keys exactly the 6 game modes; each mode has items at A2, B1, B2. All 6 modes play in the browser with real Danish items (3 viewports), "Der er ingen opgaver" never shown. `tests/pronomenmysteriet.mjs` 65/66 (only the known "Space toggles a chip" test bug), guard row inside it PASSES. |
| US-003 Tidsmaskinen adverb placement (23 items) | **PASS** (content needs native sign-off: UNCONFIRMED for naturalness) | Scan of all 1,332 completed sentences (every accepted answer): no `<aux> <participle> allerede/for længst/hidtil/endnu <object>`. The 23 items now read e.g. "Jeg var gået hjem allerede, da du kom", "Chefen havde aflyst mødet allerede", "Holdet har vundet alle kampe hidtil". The 14 regex hits left are inverted main clauses ("Da hun kom, var jeg allerede gået hjem") = correct. Ids unchanged (1,260 items, 0 duplicate `mode:id`). Clause-final placement is grammatical but a little emphatic; native review pending (implementer also flagged it). |
| US-014 Tidsmaskinen contexts and notes | **PASS** (U-01/U-02 NOT in scope until native confirms; native review UNCONFIRMED) | "I morges stod jeg tidligt **op** ...", "Nu for tiden står jeg ofte tidligt **op** ..."; `siden kl.` contexts replaced by `fra kl.`; passive context "Det skete for mange år siden."; imperative note replaced on all 12 items ("Bydeform = navnemåde uden -e; dobbeltkonsonant forenkles (komme → kom)."), old false note count 0; "Vi ___ det for længst" now accepts `havde vidst` and `vidste`. `tests/tidsmaskinen.mjs` 152/153 (known flaky row only). |
| US-013 Ordstilling feedback/Next in view | **PASS** (regression from Batch 2 has NOT returned) | At 1366x768, 390x844 and 360x640, for statements 2..12 of case 1: the English prompt line, all tiles and UNDERSØG are inside the viewport below the 56 px MENU bar with no scrolling (screenshots `ord-m360-q2.png`, `ord-m390-q2.png`, `ord-d1366-q2.png`). After UNDERSØG the verdict/tip and Næste are in view and Næste has focus on all 12 (`ord-m360-feedback-wrong.png`). Case-2 retry, weak mode and finale also fine. |
| US-023 Ordstilling tips + valid orders | **PASS** (native sign-off UNCONFIRMED) | No `grammarTip` says the verb stands "til sidst"; case 7 tip now "Infinitiven står efter grundleddet (og evt. ikke); objekt og andre led følger efter: Jeg · kan · tale dansk, Han · kan · ikke · komme." 8 items carry `alt`; live test: "Kaffe drikker jeg" accepted for "Jeg drikker kaffe" (verdict ✓, echoes the learner order); a clearly invalid permutation is rejected. All 26 case-6 questions end with "?". `G.lives=-2` -> `renderHUD()` renders "♡♡♡" without throwing; failing a case (lives 0) shows GENÅBN with no RangeError. |
| US-022 Konjunktioner | **PARTIAL / known**: spelling and ligesom items PASS; QA-120 as worded FAIL (known); QA-119 + sign-off UNCONFIRMED | "Hun danser smukt, ___ hendes mor gjorde." present. QA-120 was changed to "Jeg føler, at sommeren aldrig kommer i år." (acceptance text asks for "Det føles, som om…"): deviation already escalated by the implementer. The listed items now have new distractors (e.g. `at/om/der`), every question still has 4 unique options with the answer present (300/300), game plays through (levels, review, game over). Residual `da`-type distractors on når/mens/før/inden/siden items were recorded by the implementer, not fixed; I did not judge Danish grammar, so QA-119 and the native sign-off stay UNCONFIRMED. (The Forbindenor half of US-022 is outside this scope.) |
| US-025 Missing explainers | **PASS** for these games (scene accuracy UNCONFIRMED until native review) | Pronomenmysteriet: 6 tabs (min-mit, sin-hans, subjekt-objekt, den-det-de, nogen-nogle-noget, demonstrativer); Tidsmaskinen: 10 tabs (adds pluskvamperfektum, fremtid, hvis-betingelse, at-infinitiv, passiv, imperativ); Ordstilling: 6 tabs (adds adverbier-placering, modalverber, foernutid-har, konjunktioner). All reach done at 4 viewports, nothing clipped, reduced motion works, badge hidden for the `verify:true` scenes. The optional "open on the tab for the active mode" is not implemented (documented follow-up; not required). |
| US-035 Explainer content/gaps | **PASS** (sin-hans native review incl. U-03 UNCONFIRMED) | Badge hidden in production, shown only with `?dev=1`/`sd-dev`; `til` scene wired in Præpositioner; `foernutid-er` in Magiske Verber; `konjunktioner-betydning` in Konjunktioner; `adverbier-betydning` in Adverbier; `flertal` now says "Nogle ord: barn → børn"; `inversion-derfor` now "Han var syg, derfor han blev hjemme" with comma; `tider-nutid-datid` highlights "I går" (words 0,1). `sin-hans` is still `verify:true` (pending native review). |
| US-036 Explainer modal polish | **PASS** | Controls inside the panel at 1366x768 with no panel scroll; HJÆLP/FORKLARING label, 44 px; `explainer:open/close` timers (4 games, see above); Danish load-failure message; rule card centred (9/9 px); modal uses `--sd-*` tokens with fallbacks. |

## 4. New issues

### N1 — Minor (UX, regression from moving the Spil button to the top): "Spil" is hidden under the sticky MENU bar after "Til start" on small phones
- Games: Pronomenmysteriet (reproduced 3 of 3 runs at 360x640); Tidsmaskinen (same code pattern; reproduced once at 360x640, passed on the re-run; 390x844 and 1366 fine).
- Repro: open `pronomenmysteriet/index.html` at 360x640, press Spil, finish a round, press "Til start" on the results (or the ✕ mid-round). The start screen shows with the page scrolled (scrollY ~400); the big Spil button sits at y 0-64, covered by the 56 px fixed MENU bar (only a sliver is visible; `elementFromPoint` at its centre returns the HJÆLP button).
- Cause (code reading): in `showStart()` the code calls `document.getElementById('btn-play').focus()` without `preventScroll`; since Spil is now the first control of the start card (above the mode list), the browser scrolls it to the very top, under the sticky bar. In the baseline Spil was at the bottom of the card, so the same `focus()` was harmless.
- Evidence: `shots/pron-m360-afterTilStart.png`, `pron-m360.log` ("j: after Til start the Spil button is visible"), `dbg2.mjs`.
- Impact: the primary action is not visible after each round on small phones (scroll up fixes it). Not a data/progress problem. Suggested fix (not applied): `focus({ preventScroll: true })` or scroll to top in `showStart()`.

### Observations (not regressions, pre-existing or out of scope)
- N2 (Info): Konjunktioner at 1366x768: after answering, the rule box is cut off and "Næste →" is below the fold (Næste bottom 892 vs viewport 768); the player must scroll. Layout code is unchanged from baseline (only data/explainer wiring changed) and Konjunktioner is not in US-013; legacy issue.
- N3 (Info): Konjunktioner keyboard round ends on the game-over screen with focus on `<body>` (Enter still restarts). Legacy.
- N4 (Info): `tests/smoke.mjs ordstilling-detektiv/index.html` with the default selector `#btn-play` is fine, but the documented `#resetBtn` selector clicks Nulstil, which opens a `confirm()` and hangs the harness; use `.casebtn`.
- N5 (Info): `tests/pronomenmysteriet.mjs` "Space toggles a chip" is a test bug (all level chips start pressed); auto-advance rows (~800 ms) fail under load (measured 850-1260 ms with other runs in parallel, 800-1000 ms quiet).

## 5. Not verified / UNCONFIRMED
- Native-speaker review of: all rewritten Tidsmaskinen sentences (US-003/014, incl. clause-final "allerede"), U-01/U-02 (skal være født, kommer til at), Ordstilling tip wording and the 8 `alt` orders (US-023), Konjunktioner distractors and the "Jeg føler, at" wording (US-022), all 18 `verify:true` explainer scenes (US-025/035).
- Timer pause/resume was run at 1366 and 360 only (not at 390 or 1440).
- Konjunktioner "ambiguous distractor" quality (QA-119) was only checked structurally, not linguistically.
