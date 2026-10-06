# FINAL-REGRESSION-F3 — Konjunktioner, Ordstillingsdetektiven, Pronomenmysteriet, Tidsmaskinen, pixel-animation, shared explainer (10 games)

Branch `qa-implementation`, HEAD `b0083ce`. Real Edge via `file://`, viewports 1366x768 / 390x844 / 360x640 (explainer matrix 360x740, 390x844, 1366x768, 1440x900), light AND dark (`prefers-color-scheme` emulation). Read-only on the repo; scripts, logs and screenshots in `...\scratchpad\impl\F3\` (`shots/`, `*.log`). Several runs were done in parallel on a shared machine, so timing rows (auto-advance) are noisy; every FAIL below was re-run or analysed.

**Verdict: no P0/P1 regression and no new defect of Minor or higher.** N1 from R3 (Spil hidden under the MENU bar after "Til start") is FIXED. Three Info-level observations (section 4). Nothing was fixed, nothing committed; `git status` shows only other workers' `FINAL-REGRESSION-F1/F2.md` plus this file (and the `.claude/*`/`CLAUDE.md` items that are not ours). No dump files were left in the repo (`OUT` redirected for `tests/tidsmaskinen.mjs` and `tests/pronomenmysteriet.mjs`).

## 1. Per-game table

Own scripts (console, flow, scoring, SRS, persistence, blocked storage, keyboard, geometry) run at 3 viewports x light/dark = 6 runs per game. I looked at screenshots (start, question, feedback right/wrong, results, afterTilStart, story open) for all four games at 1366, 390 and 360, in light and dark (e.g. `dark-konj-m360-question`, `dark-pron-m360-question/slip`, `dark-tids-m360-question`, `dark-ordcases-m360-c3-wrong-q3`, `dark-ordcases-m360-c5-wrong-fb`, `ordcases-m360-story-open`, `tids-m360-afterTilStart`, `dark-konj-d1366-start`).

| Check | Konjunktioner | Ordstillingsdetektiven | Pronomenmysteriet | Tidsmaskinen |
|---|---|---|---|---|
| (a) Zero console/page errors, no failed requests (6 runs) | PASS | PASS | PASS | PASS |
| (b) Every mode starts | PASS (start, level filters, 300 questions each with 4 unique options) | PASS (12 cases, locked/unlocked, finale 100/100 at 1366) | PASS: all 6 modes, real data; "Test sentence / opt1 / opt2 / Test note" never shown, "Der er ingen opgaver" never shown | PASS: all 9 modes |
| (c) Correct/incorrect feedback, scoring, SRS | PASS (+10/+10/+20 combo, lives, rule + correct answer, `kkHi` record; no SRS in this legacy game) | PASS (verdict, correct sentence, tip, lives, streak, score, weak mode) | PASS (slip = correct answer + note + Lyt + Videre; score = right count; stable SRS ids) | PASS (incl. 2-slot Hvis-portalen, build step, SRS written) |
| (d) Completion | PASS (game over, "Gennemgå fejl", review done) | PASS (LØST, GENÅBN, ØVET, finale) | PASS (summary, weak list, cross-game link) | PASS |
| (e) Restart/back: ✕ and "← TILBAGE" | PASS | PASS (uniform "← TILBAGE" on case screen and results, back mid-case, retry, confirmed reset) | PASS (Spil igen, Til start, ✕, Esc) | PASS (same) |
| (f) Reload persistence | PASS (Rekord) | PASS (stamps, unlocks, best %) | PASS | PASS |
| (g) Blocked localStorage (getter AND methods throw) | PASS / PASS | PASS / PASS (full case played) | PASS / PASS | PASS / PASS |
| (h) Explainer opens, tabs play, Esc closes | PASS (2 tabs) | PASS (6 tabs) | PASS (6 tabs) | PASS (10 tabs) |
| (i) Keyboard-only round | PASS (see N3) | PASS (Enter on tiles, UNDERSØG, NÆSTE; focus never on body; ends on a control) | PASS | PASS |
| (j) Layout: no h-scroll, targets >=44, screenshots | PASS (N2 info) | PASS | PASS | PASS |
| (j) Dark gaps readable | `.sd-gap` contrast 10.9:1 (mustard on dark purple), "?" shown | n/a | 18.3:1 (dark on cream) | 15.9:1 cream target box, dark text |
| (j) Ordstilling 360x640, cases 1/3/5 x correct/wrong, statements 1..12 (light + dark, 6 runs) | – | PASS: EN prompt >=56 px below top, all tiles and UNDERSØG in view, NÆSTE in view and focused after every UNDERSØG (wrong at #1 and #5 included); story `<details>` collapsed with "Læs sagen" on statement 1 and every later one | – | – |
| (j) "Læs sagen" toggle | – | PASS: mouse click opens/closes, label becomes "Skjul sagen"; keyboard Enter and Space toggle; summary >=44 px; open choice sticks to the next statement (by design, D-ORD) | – | – |
| (j) "Til start" -> Spil visible | – | – | PASS: 3 runs x 3 viewports/themes: button top 409, bottom 473, below the 56 px bar, `elementFromPoint` hits it, scrollY 0, focus on `btn-play`; also after ✕ | PASS: same (top 320, bottom 384), 3 runs at 360x640 plus ✕ |
| (k) Listen button `.dc-tts-button`, label "Lyt...", one `speak` da-DK per click, >=44 px | PASS: aria-label "Lyt til sætningen", 48x48, 1 speak da-DK in question and feedback state | PASS: "Lyt til sætningen", 48x48, 1 speak da-DK after UNDERSØG (no button before check) | PASS: "Lyt", 48x48, 1 speak da-DK | PASS: "Lyt", 48x48, 1 speak da-DK |
| (l) `tests/smoke.mjs` (4 vp, dark/light/reduced motion, blocked storage) | 28/28 with `#startBtn` (default `#btn-play` gives the 7 known legacy-artefact FAIL rows) | 28/28 with `.casebtn` | 28/28 | 28/28 |
| Official spec test | n/a | n/a | `tests/pronomenmysteriet.mjs` 64/66 then 63/66: only "Space toggles a chip" (known test bug) and 1-2 auto-advance timing rows (842-1265 ms under load; different modes each run) | `tests/tidsmaskinen.mjs` 150/153 (run 1: auto-advance, "positive animation class + sound" press=133/144 under heavy load, mode-6 auto-advance) and 150/153 (run 2, quieter: auto-advance min 819 max 1332, mode-6 auto-advance, one `lookup fail FØR FORTIDEN` in layout matrix). The layout section re-run alone 2x: 6/6 each. All failing rows are timing/load flakes or known flakes |
| Scripted totals light d1366 / m390 / m360 ; dark d1366 / m390 / m360 | 24/24 x5, one flake (m390 light "game over" row: re-run 3x = 24/24) | 33/34 x6 (the 1 FAIL = my selector `#sol .speaker`, the button is now `.dc-tts-button`; verified separately in (k)) | 48/48 x5; d1366 light 46/48 (auto-advance under load) | 60/60 x5; d1366 light 57/60 (auto-advance under load) |

`pixel-animation.html`: smoke 13 PASS; only the 7 legacy rows ("#btn-play found", "console clean + still playable") fail by design (no play button); no h-scroll at 4 viewports, blocked storage no crash.

## 2. Shared explainer matrix (all 10 games, 43 game/tab rows = 35 distinct scenes)

Games: adverbs, dansk-praepositioner, magiske_verber, boejningsvaerkstedet, en og et, forbindenor, konjunktioner, ordstilling-detektiv, pronomenmysteriet, tidsmaskinen. 360x740, 390x844, 1366x768 stepped through every step (650 ms settle); 1440x900 real-time autoplay. Every cell is 43/43.

| Check | 360x740 | 390x844 | 1366x768 | 1440x900 |
|---|---|---|---|---|
| Opens from the entry button | PASS | PASS | PASS | PASS |
| Button: HJÆLP <=420 px / FORKLARING above; 44 px high | 77x44 HJÆLP | 77x44 HJÆLP | 127x44 | 127x44 |
| Button icon is the pixel SVG (`svg.xpm-ico`), no ▶/►/▷ character in its text | PASS | PASS | PASS | PASS |
| Reaches `window.__explainerDone` | PASS | PASS | PASS | PASS |
| Nothing clipped (every text element inside `.xpm-screen`, after every step) | PASS (0) | PASS (0) | PASS (0) | PASS (0) |
| Controls inside the panel and viewport, no panel scroll | PASS | PASS | PASS | PASS |
| Modal buttons >=44x44 | PASS | PASS | PASS | PASS |
| Tab strip compact | 57 px | 57 px | 57 px | 57 px |
| Esc closes, focus returns to the entry button | PASS | PASS | PASS | PASS |
| Zero console errors / failed requests | PASS | PASS | PASS | PASS |
| "Skal tjekkes" badge hidden in production | 0 | 0 | 0 | 0 |
| `?dev=1`: badge on exactly the `verify:true` scenes | 18 (adv 1, prep 1, mv 1, boej 3, konj 1, pron 5, tids 6, enet/forb/ord 0) | – | 18 (same) | – |

Timers pause on `explainer:open` and resume on `explainer:close` (script `timers.mjs`): En/Et Lynrunde, Præpositioner Lynrunde, Magiske Verber Hurtigduel, Tidsmaskinen "Med tid". At 360x740, 1366x768 and 1440x900: 8/8 each (value frozen for 4 s while open, resumes at 1 per second, a second open/close does not double the tick, focus back on the entry button). 390x844: 7/8 then 4/5 re-runs; the one miss is the Tidsmaskinen display flicker, see O2 (not a time loss).

## 3. P0/P1 re-test

| Story | Result | Evidence |
|---|---|---|
| US-001 Pronomenmysteriet data + guard | **PASS** | `node tests/pronomen-data-guard.mjs`: "PASS pronomen-data-guard: 6 modes, 760 items, levels A2/B1/B2". sha256 of `pronomenmysteriet/data.js` = sha256 of `git show b9abb96:pronomenmysteriet/data.js` (`11f16842...a4c9`). `grep -c "Test sentence\|opt1\|Test note"` = 0. All 6 modes play with real Danish items at 3 viewports x 2 themes. `tests/pronomenmysteriet.mjs` 64/66 and 63/66, only the known "Space toggles a chip" test bug plus auto-advance timing flakes; guard row inside it passes. |
| US-003 Tidsmaskinen adverb placement (23 items) | **PASS** (native review UNCONFIRMED) | `tidsmaskinen/data.js` unchanged since R3 (no diff vs `353b8a3`). Scan of 1,332 completed sentences: the remaining `participle + allerede/for længst/endnu` hits are inverted main clauses ("Da hun kom, var jeg allerede gået hjem") or clause-final placement ("Børnene er kommet allerede.", "Filmen var begyndt allerede, da vi kom."). Clause-final is grammatical but emphatic; native sign-off still pending (as in R3). |
| US-014 Tidsmaskinen contexts/notes | **PASS** (native review UNCONFIRMED) | Data unchanged since R3; "I morges stod jeg tidligt op", "fra kl." contexts, imperative note replaced; `tests/tidsmaskinen.mjs` 150/153 with only timing flakes + the layout flake that passes 2/2 alone. |
| US-013 Ordstilling feedback/Next in view | **PASS**, not regressed by owner decision #4 | Statements 1..12 of cases 1, 3, 5, correct and wrong, at 360x640, light and dark: EN prompt top >=56 px, tiles + UNDERSØG in view, NÆSTE in view and focused after every UNDERSØG (screenshots `ordcases-m360-c*-wrong-fb`, `dark-ordcases-m360-c3-wrong-q3`). Also 1366 and 390 via `ord.mjs` (statements 2..12 of case 1). |
| US-023 Ordstilling tips + valid orders | **PASS** (native review UNCONFIRMED) | `ord.mjs` US-023 rows pass in all 6 runs: no tip says the verb stands "til sidst", valid alternative order accepted and echoed, invalid rejected, `?` on all case-6 questions, lives clamp (no RangeError), GENÅBN screen. |
| US-022 Konjunktioner | **PARTIAL / known**, unchanged | "Hun danser smukt, ___ hendes mor gjorde." present; "Jeg føler, ___ sommeren aldrig kommer i år." (QA-120 wording deviation already escalated); 300/300 questions have 4 unique options with the answer present; game plays through. Distractor linguistics (QA-119) and native sign-off UNCONFIRMED. |
| US-025 Missing explainers | **PASS** (accuracy UNCONFIRMED) | Pronomenmysteriet 6 tabs, Tidsmaskinen 10, Ordstilling 6, Konjunktioner 2; all reach done at 4 viewports, nothing clipped, Esc/focus OK. |
| US-035 Explainer content/gaps | **PASS** (`sin-hans` native review incl. U-03 UNCONFIRMED) | Badge hidden in production, 18 `verify:true` scenes marked with `?dev=1`. |
| US-036 Explainer modal polish | **PASS** | Controls inside panel at 1366x768 without scroll, HJÆLP/FORKLARING 44 px, timers pause/resume in 4 games, pixel SVG button replaces ▶ (43/43 rows at 4 viewports). |

## 4. New issues

No new defects of severity Minor or above.

- **N1 (R3, Minor): FIXED.** "Til start" and ✕ now leave Spil fully visible below the MENU bar in Pronomenmysteriet and Tidsmaskinen (3 runs each at 360x640 light and dark plus 390 and 1366; button top 409 / 320, scrollY 0, focus on `btn-play`).
- **O1 (Info, by design): Ordstilling "Læs sagen" open state at 360x640.** When the learner opens the story, the English prompt, tiles and UNDERSØG move below the fold (scrollY 197, enTop 685 in `ordcases-m360-story-open`), and per owner decision #4 the open choice sticks for the rest of the case, so the US-013 geometry no longer holds for those statements until "Skjul sagen" is pressed. Collapsed state (default) passes everywhere. Not a defect against the decision; mention only for the owner.
- **O2 (Info): Tidsmaskinen timed mode, explainer open: the hidden countdown text can flicker by 1 s** (e.g. 19 -> 18 -> 19 while the modal is open, `ONLY=tids timers.mjs x390`, 1 miss in 5 runs). The hold in `tidsmaskinen/index.html` pushes the deadline forward every 40 ms, so the displayed `ceil` value sits on a second boundary. No time is lost (resume values are correct, 19->18->15 after 3.3 s), the text is behind the modal. Cosmetic, new with the Batch 3/5 hold code (pre-existing: no explainer at baseline).
- **O3 (Info, legacy, unchanged): Konjunktioner** at 1366x768 after answering the rule box is cut off and "Næste →" is below the fold (next bottom 854 > 768; N2 in R3); keyboard round ends on game over with focus on `<body>` (N3); transient "SERIE X2! +20" fx overlaps the hearts in the feedback screenshot. All pre-existing layout (only classes/styles/Lyt changed in the diff vs `353b8a3`).
- Known/test artefacts: "Space toggles a chip" is a test bug; auto-advance rows fail under parallel load (measured 819-1332 ms with Edge competing, 800-1000 ms quiet in R3); `tests/pronomenmysteriet.mjs` and `tests/tidsmaskinen.mjs` fail different timing rows on each run; the `lookup fail FØR FORTIDEN` row in the tidsmaskinen layout matrix did not reproduce (layout section alone 6/6 twice, 54 mode starts all rendered at once).

## 5. Not verified / UNCONFIRMED
- Native-speaker review of all rewritten Tidsmaskinen sentences (US-003/014, incl. clause-final "allerede"), the Ordstilling tip wording and `alt` orders (US-023), Konjunktioner distractors and the "Jeg føler, at" wording (US-022), all 18 `verify:true` explainer scenes (US-025/035).
- Real audio output of the Lyt buttons (the `speak` call was stubbed and counted; voice availability on the target device not tested). Pronomenmysteriet speaks the "…" gap as a comma by design.
- The timers matrix was run at 360x740, 390x844 and 1440x900 and at 1366x768; 390x844 has the O2 flicker miss.
