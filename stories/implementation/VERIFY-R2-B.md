# VERIFY-R2-B: US-055 (Magiske Verber + Idiomjæger), US-057 (Dansk Mester), Glosekort reset-cancel, Idiomjæger main-menu back

Verifier: VR2-B (independent). Branch `qa-fixes-round2`, uncommitted working tree compared with `git diff HEAD`. Browser: Edge headless via puppeteer-core. Scripts, logs and screenshots are in `scratchpad\impl\vr2-b\` (`mv.cjs`, `mvk.cjs`, `ij.cjs`, `ij2.cjs`, `ij3.cjs`, `dm.cjs`, `gl.cjs`, `reg.cjs`, `last.cjs`, `*-cur.txt` / `*-head.txt`, `shots\`). For the HEAD comparison I used copies from `git show HEAD:<file>` in `scratchpad\impl\vr2-b\head\` with a copy of `shared/`, where `shared/themes/idiomjaeger.css` is the HEAD version. Nothing was written to the repo except this file.

"In view" below means: element top >= bottom of the sticky `.sd-bar` (56 px), and element bottom <= `innerHeight`. Measurements were taken 1.1 s after the answer, when the smooth scroll had finished.

Files reviewed (diff): `magiske_verber.html`, `idiomjaeger.html`, `shared/themes/idiomjaeger.css`, `danske-phraser/dansk-mester.html`, `danish_flashcards/danish_flashcards_game/script.js`.

---

## 1. US-055: Magiske Verber (report `R2-US-055-MV.md`)

Diff: new `revealNext()`, called on the non-speed path after `nextBtn.focus({preventScroll:true})`. It scrolls by just enough to show Næste, keeps the top of the feedback block below the 64 px bar, and falls back to `scrollIntoView({block:'nearest'})`. It uses `behavior:'auto'` under `prefers-reduced-motion` or `data-sd-motion="off"`. The dead `.q-prompt .blank` / `.q-chain .blank` rules were removed (I grepped: there is no `.blank` use in the file or the theme). The scope is limited to what the story needs.

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| At 1366×768, 390×844 and 360×640, after a wrong answer and after a right answer, the feedback block and the Næste button are fully inside the viewport and Næste has focus. Applies to every question mode of both games. | PASS (MV) | `mv.cjs`: 7 non-speed games x 3 levels + "Gennemse fejl" review, x wrong/right, x 3 viewports, x normal/reduced motion = **264 runs, 0 bad**, 0 errors. Examples: 1366x768 fb 590-680, Næste 704-756; 390x844 fb 618-756, Næste 780-832; 360x640 (repair/hard) all in view (screenshot `mv-cur-360x640.png`). **HEAD: 264/264 bad** (e.g. 1366x768 fb 826-916, Næste 940-992, scrollY 0). |
| No auto-advance is added for correct answers (that belongs to blocked US-026). | PASS | In every run, the question index was unchanged and Næste was still shown 2.6 s after the answer. |
| Reduced-motion: the scroll is instant, not animated. | PASS | `mvk.cjs` 360x640: with reduced motion, scrollY = 685 synchronously after the click (685 at the next frame, 685 at +60 ms). Without it: 0 → 115 at +60 ms → 716 final, so the scroll is smooth. |
| Keyboard behaviour is unchanged: number keys / Enter still work, no double-advance (the Magiske Verber "Enter after a mouse click" fix from US-031 stays). | PASS | `mvk.cjs` at 1366 and 390: a real mouse click on an option, then Enter, gives idx 0 → 1 exactly. Key "2" answers, Næste is focused and in view, and Enter gives +1. A focused option + Enter, then Enter, gives +1. A focused option + Space, then Space, gives +1. On the last question, "Se resultat →" is in view and focused, and Enter shows the result screen. |
| Hurtigduel (Magiske Verber speed mode) and the timed modes are unaffected. Existing explainer listeners and timers are intact. | PASS | Hurtigduel auto-advances (idx 0 → 1 within ~950 ms), the Næste row stays hidden, scrollY stays 0, and the timer counts 60 → 56. `ExplainerModal.open` freezes the timer (56 → 56 over 2 s, `S.timer` null) and `close` resumes it (→ 54, timer running). |
| No console errors; smoke has no new failures. | PASS | 0 console/page errors in all scripts. `smoke.mjs`: 13 PASS / 7 FAIL, identical to the HEAD copy. The 7 FAIL rows are the legacy `#btn-play` rows (4 viewport rows and 3 "console clean + still playable" rows). |

## 2. US-055: Idiomjæger (no implementer report; diff judged by me)

Diff:
- `topbar(extra,noBack)` hides "← TILBAGE" on the main menu only (coins are right-aligned with `margin-left:auto`).
- `revealNext()` focuses Næste (`preventScroll`) and scrolls by `nextBtn.bottom + 12 - innerHeight` (instant under reduced motion). It is called after quiz answers, after the last-life "Se resultat" case, and after text answers.
- `e.preventDefault()` on Enter in `#txtIn`. Without it, the keypress from the same Enter would land on the just-focused Næste and skip the feedback.
- In the Sjovt `polish()` hook: on a real screen change, if focus is on `<body>`/`<html>`, `h2.section-title` gets `tabindex=-1` and is focused (`preventScroll`).
- CSS: `h2.section-title[tabindex="-1"]:focus{outline:none}`.

All of it is in scope for US-055 plus the recorded "main-menu TILBAGE no-op" item. There is no debug code and there are no content changes.

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| At 1366×768, 390×844 and 360×640, after a wrong answer and after a right answer, the feedback block and the Næste button are fully inside the viewport and Næste has focus. Applies to every question mode of both games. | PASS | `ij.cjs`: 11 quiz entry points (idiomHunter, meaningHunter, exampleDetective, category, timed, survival, context, native, mixed, Øve-tilstand, Svage Idiomer) + 2 text modes (fillMissing, complete) x wrong/right x 3 viewports x normal/reduced motion, plus the survival last-life "Se resultat" case = **162 runs, 0 bad**, 0 errors. `#fb`, `.explain` and `#nextBtn` were all in view, focus was on `nextBtn`, and the feedback class matched the answer. Examples: 1366x768 fb 493, explain 565-686, Næste 708-756; 360x640 fillMissing explain 391-558, Næste 580-628. **HEAD: 162/162 bad** (1366x768 Næste 947-995 or 898-946, nothing focused). Screenshots `ij-cur-context-360x640.png` and `ij-cur-fillMissing-1366x768.png` show the feedback, explanation and focused NÆSTE intact. |
| No auto-advance is added for correct answers (that belongs to blocked US-026). | PASS | `Q.i`/`T.i` were unchanged and Næste was still shown 2.6 s after every answer. |
| Reduced-motion: the scroll is instant, not animated. | PASS | `behavior: reduce?'auto':'smooth'` (code), and the geometry was in view in all reduced-motion runs. Note: unlike MV, it does not check `data-sd-motion="off"`, but nothing in the repo sets that attribute (grep). Info only. |
| Keyboard behaviour is unchanged: number keys / Enter still work, no double-advance (the Magiske Verber "Enter after a mouse click" fix from US-031 stays). | PASS | `ij2.cjs`, full keyboard quiz round (10 questions). From the focused heading, Tab reaches the prompt TTS button and then the first choice. Enter answers and focuses Næste; Enter advances exactly +1 every time; the round ends on "Runde slut". Text mode (8 questions): Enter on an empty input does nothing (input still enabled). Typing works (value matches). Enter answers without advancing (`T.i` unchanged, Næste focused and shown); Enter advances +1 and focus returns to `#txtIn`. So the `preventDefault` swallows nothing that is needed. Memory and match work by keyboard (Enter/Space) through to "Færdig!". Idiomjæger has no number-key handler at HEAD either. |
| Hurtigduel (Magiske Verber speed mode) and the timed modes are unaffected. Existing explainer listeners and timers are intact. | PASS | Tidsjagten: answers show Næste (the same as HEAD's flow). `timeLeft=1` ends the round ("Runde slut"). TILBAGE from Tidsjagten clears `Q.timerH` (null) and the menu stays put 1.5 s later. |
| No console errors; smoke has no new failures. | PASS | 0 errors. `smoke.mjs` gives 13 PASS / 7 FAIL, identical to HEAD (legacy `#btn-play` rows only). |
| (Cleanup) Idiomjæger main-menu "← TILBAGE" no-op removed; every other back control works | PASS | On the main menu, the TILBAGE count is 0 (HEAD: 1; clicking it at HEAD just re-rendered the menu). Coins stay right-aligned (right edge 360 = bar right). Every topbar TILBAGE was clicked with a real mouse and returns to "Vælg din jagt": learn, dict, games, practice, category, stats, badges, quiz, text, memory, match, timed, survival, endQuiz, endText, endMemory, endMatch (17/17). "Menu" (endQuiz) goes to the menu; "Andre spil" (endQuiz/endText/endMemory/endMatch) goes to "Spil — 13 jagter"; "Spil igen" restarts the game. |
| (Extra) all 13 game ids still work; Modersmålstaleren at A2/B1/B2/C1 | PASS | `ij2.cjs` completed every id to its end screen: idiomHunter, meaningHunter, exampleDetective, fillMissing, complete, memory, match, category, timed, survival, context, native, mixed. Modersmålstaleren: A2 and B1 fall back to the B2+C1 pool (132 items, toast shown); B2 gives 89 B2-only items; C1 gives 43 C1-only items. All render choices, and after an answer Næste is in view and focused. |
| (Extra) heading focus does not steal focus / break Tab order; keyboard users keep a visible focus indicator | PASS, with a Minor finding | Focus moves to the heading only when `activeElement` is body or html. Text mode keeps focus in `#txtIn`, and memory/match re-renders do not change the screen key, so focus is not pulled to the heading. Tab order from the heading is forward into the prompt and choices. Interactive elements keep the 4 px focus ring (Tab-focused menu "Spil" button: `outline solid 4px rgb(43,63,214)`, `:focus-visible` true; screenshot `ij-cur-menu-tabfocus.png`). **Minor finding:** the theme's `outline:none` on the heading has no effect for keyboard users, because `sjovt.css:135` sets `[tabindex]:focus-visible{outline:… !important}`. After Enter on Næste, the heading shows the blue 4 px frame (`ij-cur-390-after-kbd-next.png`). After a mouse click it shows nothing (`:focus-visible` false), so the new CSS line never changes anything. The frame is tidy and arguably useful as a focus cue, but it is not what the author intended. |

## 3. US-057: Dansk Mester (report `R2-US-057.md`)

Diff: `finishAnswer()`. On a wrong answer outside timed mode, it appends "Fortsæt →" (`#btn-continue-q`, `.btn`), focuses it (`preventScroll`), runs `scrollIntoView({block:'nearest'})` (auto under reduced motion) and returns without a timer. Correct answers and timed mode still use `setTimeout(…, correct?750:1500)`. "Fortsæt ▸" was changed to "Fortsæt →" in two places. The scope is limited to what the story needs.

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| At 1366×768, 390×844 and 360×640, after a wrong answer in each mode that shows a note, the note and replay button are fully inside the viewport. | PASS (see Minor finding 2) | `dm.cjs`: flervalg, blandet (category and home), intervalrepetition, svage ord (category and home), both directions (da→en and en→da), x 3 viewports x normal/reduced motion = **72 runs, 0 bad**. `#fb`, the note `div`, the in-feedback replay button (en→da) and Fortsæt were all in view. Examples: 1366x768 fb 571-766, note 618-638, replay 642-690, Fortsæt 704-752; 360x640 fb 424-638, note 471-510, replay 514-562, Fortsæt 576-624. **HEAD: 72/72 bad** (1366x768 note 818-837 or 804-824 against vh 768; 360x640 note 814-873 against 640; advance after 1.5 s). Screenshots `dm-cur-360x640-da2en.png` and `dm-cur-1366x768-en2da.png` look correct. |
| After a wrong answer there is no timed advance: the learner continues with a visible, keyboard-focusable control ("Fortsæt →" or the existing control). | PASS | All 72 runs: the button text is "Fortsæt →" and `activeElement` is `btn-continue-q`. After 3.2 s, idx is unchanged and the button is still present. Enter or Space (alternated) continues exactly once: the new question has 4 enabled options and `G._answered` is false. A mouse click on a wrong option, then Enter, also continues once. On the last question, Fortsæt leads to the results screen. |
| After a correct answer the 750 ms advance is unchanged. | PASS | 755-758 ms measured at all 3 viewports, with and without reduced motion. |
| The US-041 timer cleanup (`clearGameTimers`, quitting right after an answer) still works: no uncaught errors when quitting within 100-750 ms of an answer, no timer firing after leaving the round. | PASS | 20 tries (wrong/correct alternated, one in three in timed mode), quit at 100-750 ms spread evenly: 0 page errors. The route was unchanged 1.7 s after the quit (0 late timers). |
| Match mode and timed mode (`Tidsudfordring`) keep their own pace: do not add waiting where there is no note. | PASS (judgement) | Timed wrong answers advance after 1505-1532 ms with no Fortsæt, unchanged. Match has no continue-q button. Judgement: the timed note still shows for only 1.5 s. The story explicitly says timed mode "keeps its own pace", and the AC limits the waiting to "each mode that shows a note" in the untimed sense, so keeping 1500 ms follows the story. The leftover risk (a timed-mode note can still flash by) is an owner decision, not a defect. |
| No console errors; smoke has no new failures. | PASS | 0 errors. Smoke gives 13 PASS / 7 FAIL, identical to HEAD (legacy rows). No "Fortsæt ▸" is left (`outerHTML` check false; HEAD true). |

## 4. Cleanup: Glosekort reset-cancel (report `R2-glose-cancel.md`)

Diff: the second `restartBtn` click listener (which cleared `#sd-fb` without condition) was removed. The clearing moved to the end of the main handler, after `confirm` and the reset. That is the minimal change.

| Criterion | Result | Evidence |
|---|---|---|
| With `confirm` stubbed false, after an answer, the feedback text/class, counters, card and `verb_glosekort_v1` stay identical | PASS | `gl.cjs`: after "Det vidste jeg" and after "Det vidste jeg ikke", "Start forfra" was used twice each way (mouse click and Enter on the focused button; confirm was called both times). The before/after snapshots of fb text and class, Rigtige/Forkerte, card number, remaining, card markup/class and the localStorage string are identical. Cancelling during the 1200 ms wrong-advance window also keeps the fb line. **HEAD:** fb text and class were cleared on cancel (diff `fbT,fbC`). |
| `confirm` true: reset and feedback cleared | PASS | fb "" with class `sd-fb-line`, Rigtige 0 / Forkerte 0, "Kort 1 af 150", every stored status `unreviewed`. It still holds after a reload. |

## 5. Regression (the 4 games, current tree)

| Check | MV | Idiomjæger | Dansk Mester | Glosekort |
|---|---|---|---|---|
| 0 console/page errors on load and in all scripted runs | PASS | PASS | PASS | PASS |
| Every mode starts and completes | PASS (all games/levels + review; result screen reached) | PASS (13/13 ids to the end screen) | PASS (all note modes, timed, match, last question goes to results) | PASS |
| Progress persists across reload | PASS (`magiske_verber_v1`) | PASS (`idiomjaeger_v2`) | PASS (`totalAnswered` 1 → 1 after reload) | PASS |
| localStorage blocked (getter throws) | PASS, plays, 0 errors | PASS | PASS | PASS |
| localStorage methods throw | PASS | PASS | PASS | PASS |
| Keyboard round | PASS | PASS | PASS | PASS (Enter on Start forfra) |
| smoke.mjs (legacy `#btn-play` rows aside) | 13/7, same as HEAD | 13/7, same as HEAD | 13/7, same as HEAD | 13/7, same as HEAD |
| Screenshots looked at | 360x640 wrong: feedback + NÆSTE focused | answered states, menu focus, heading after keyboard Næste | 360x640 and 1366x768 wrong: note, replay, FORTSÆT | n/a |

## 6. Issues by severity

- **Critical / Major:** none.
- **Minor 1 (Idiomjæger, new CSS has no effect):** the theme rule `html.sd-page h2.section-title[tabindex="-1"]:focus{outline:none}` is overridden by `sjovt.css:135` (`outline … !important` on `[tabindex]:focus-visible`). Keyboard users see a 4 px blue frame around the screen heading after every screen change. Mouse users never see one, so the rule has no effect in either case. The result looks acceptable and helps as a focus cue. Either drop the rule or accept the frame; this does not block the story.
- **Minor 2 (Dansk Mester, pre-existing design):** in the Danish→English direction, the feedback box has no replay button. The only Danish TTS is next to the prompt, and at 360x640 it can end up under or above the sticky bar after the scroll (measured 52-100 with the bar at 56; once -23 to 25). The in-feedback replay (English→Danish) is always in view. Recorded for the owner: does the AC's "replay button" mean the feedback replay only?
- **Info:** Idiomjæger `revealNext` ignores `data-sd-motion="off"` (MV honours it), but no UI sets that attribute. Idiomjæger only checks the bottom of Næste; the top of the feedback stayed in view at all tested sizes. After "Fortsæt →" in Dansk Mester, focus falls to `<body>` (same as HEAD after auto-advance). The Idiomjæger memory game loses keyboard focus to `<body>` after a flip, but HEAD does the same, so it is not a regression.

## 7. Scope creep / UNCERTAIN content

- Scope: none beyond the stories and the recorded cleanup items (MV dead `.blank` CSS is a recorded cleanup item; "Fortsæt ▸" → "→" is in the US-057 report as cleanup).
- Danish content: the only new strings are "Fortsæt →" (existing wording). Nothing for native review.

## 8. Verdicts

US-055 (Magiske Verber): all 6 criteria PASS; HEAD failure reproduced (264/264).
Verification: VERIFIED

US-055 (Idiomjæger, incl. main-menu TILBAGE cleanup): all 6 criteria PASS; HEAD failure reproduced (162/162); 13 game ids, 4 Modersmålstaleren levels and 17 back controls work; one Minor finding (the heading `outline:none` is overridden by the shared `!important` focus ring).
Verification: VERIFIED

US-057 (Dansk Mester): all 6 criteria PASS; HEAD failure reproduced (72/72); timed mode keeping 1500 ms follows the story; Minor 2 (no in-feedback replay in the Danish→English direction, pre-existing) is for the owner.
Verification: VERIFIED

Glosekort reset-cancel cleanup: PASS (cancel leaves everything identical; HEAD cleared the fb line; confirm resets and clears).
Verification: VERIFIED
