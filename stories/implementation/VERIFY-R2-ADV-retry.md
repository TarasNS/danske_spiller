# VERIFY-R2-ADV-retry: Adverbier US-056 re-verification (verifier VR2-A2)

Branch `qa-fixes-round2`, uncommitted `adverbs.html` + `shared/themes/adverbs.css`. Edge headless (puppeteer-core), `file://`, 3 s preloader wait, level-4 progress seeded (80 correct; zones Tid, Sted, Bindeord, Sætningsbygning all enabled). My own scripts and screenshots: scratchpad `...\scratchpad\impl\vr2-a2\` (`lib.mjs`, `main.mjs`, `misc.mjs`, `review.mjs`, `prep.mjs`, `shots\`). Real mouse clicks and keys throughout; no state forced except choosing which question to show (to reach all 7 modes).

Retry diff reviewed: `stickyBarH()` (measures `.sd-bar`), `scrollFeedbackIntoView()`, `scrollGameIntoView()` (called in `loadQuestion` when the learner has interacted), `scroll-margin-top: 72px` on `#feedback`; the wrong-answer scroll is now called from `showAnswerExplanation` itself and again from the Sjovt hook. No unrelated change seen in these two files.

## Measurements (main matrix, current code)
Matrix: 7 modes x 3 viewports (1366x768, 390x844, 360x640) x reduced motion on/off x start scroll {top, bottom} x continue via {mouse click on Næste, Enter} = 168 wrong answers (with 84 Næste by mouse and 84 by Enter), plus 84 correct answers (7 modes x 3 vp x rm x 2 start positions).

| Measure | Result |
|---|---|
| Wrong answer: feedback top >= bottom of `.sd-bar` (56 px), whole feedback box, note, replay button and Næste inside the viewport and not covered (elementFromPoint probes), focus on `#nextBtn`, no h-scroll | 168/168 |
| No advance after 3.1 s (same word, step 0, Næste still there) | 42/42 checked (all modes/viewports/rm, start top) |
| After Næste by mouse: `#game h2` prompt fully visible below bar, first option focused and fully visible, step +1, no Næste | 84/84 |
| After Næste by Enter: same checks | 84/84 |
| Correct answer: no Næste, auto-advance within 2.5 s, new prompt and first option in view | 84/84 |
| Console/page errors/failed requests | 0 |

Natural-flow run (`misc.mjs` A, real click on zone Sætningsbygning, rotation of 7 questions with wrong and correct answers, then the Bossrunde) at 390, 360, 1366: every wrong answer had feedback top >= 56 (e.g. 398, 343, 139, 112 at 390/360), Næste focused, no advance after 3.1 s, Enter moves to the next question with prompt and first option in view and first option focused; the boss round waits for Næste and continues correctly. Review round (`review.mjs`, real "Repetition" -> "Start repetition") at 390 and 360: wrong answer waits, feedback fully visible, Enter continues with prompt/option in view. 0 console errors.

Blocked localStorage (getter throws, and Storage methods throw), 390 and 360: wrong answer -> feedback fully in view, Næste works, next question in view, correct answer auto-advances. 0 errors.

Without `shared/sjovt.js` (scratchpad copy `nosjovt.html` with the script tag removed and `shared/` paths made absolute; no `.sd-bar` then): full matrix 168/168 wrong, 84/84 after Næste (both ways), 84/84 correct, 0 errors. Scroll behaviour works with no dependency on `sjovt.js`.

Smoke `tests/smoke.mjs ../adverbs.html`: only legacy rows fail (`#btn-play` x4 and "console clean + still playable" x3: dark, light, reduced-motion); console clean x4, no h-scroll x4, icon labels, focus ring, contrast x2 and localStorage blocked all PASS. No dump files written.

Screenshots I looked at: Ordstilling at 360 and 390 after a wrong answer ("Forkert." and the first line of the answer fully below the MENU bar, replay, note, help and Næste visible) and after Næste (Udfyld hullet question, gap and first options visible below the bar; at 390 the question title is at the top of the card); Find betydningen at 1366 after a wrong answer (everything in view, Næste visible). One layout observation: at 390 after the wrong answer the Ordstilling question prompt sits above the viewport (the feedback is prioritised), which is expected.

## US-056 criteria (`stories/QA-USER-STORIES-2.md`)

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| At 1366×768, 390×844 and 360×640, after a wrong answer the feedback with its note and the replay button are fully inside the viewport. | PASS | 168/168 runs incl. Ordstilling at 390 and 360, both start scroll positions, rm on/off; feedback top never under the sticky bar (earlier FAIL cause fixed). |
| After a wrong answer there is no timed advance: the game waits for an explicit "Næste" (button focusable by keyboard, also reachable by Enter/Space). | PASS | 42/42 no advance after 3.1 s; Næste focused in 168/168; Enter advances exactly once (84/84, step 0 -> 1); mouse click works (84/84). Space not re-tested this round (verified in the earlier round; the button is a native button). |
| After a correct answer the behaviour stays automatic and short (unchanged unless the owner decides otherwise in US-026). | PASS | 84/84 auto-advance in ~2 s (2000 ms timer unchanged) and new question in view. |
| All seven modes are covered, including Lyt og vælg (replay button) and Oversættelsesbroen. | PASS | All 7 modes in the matrix and natural flow. |
| The dashboard/progress update is not delayed or lost; the pending-timer cleanup from US-005 still cancels timers when a zone or review starts. | PASS (spot-check) | Code path unchanged in the retry diff; natural flow, boss and review rounds and blocked-storage runs progress correctly. Dashboard/timer-cleanup detail was verified in the previous round (VERIFY-R2-ADV.md) and not changed. |
| Focus management from US-031 (dialogs, focus after render) is unchanged. No console errors; blocked storage still works. | PASS | After every render the first option is focused (`activeIsFirst`, 168/168); 0 console errors; both blocked-storage variants play. Dialog focus trap not re-run this round (not touched by the retry diff). |

US-054 spot-check: level-4 seed shows Tid and Sted completed, Bindeord and Sætningsbygning enabled; a real click on Sætningsbygning starts rounds and the full rotation and Bossrunde were played in it (3 viewports). PASS. Review/boss rounds wait for Næste after a wrong answer: PASS.

Native-speaker review of the Danish strings ("Næste", "Lyt til ordet", "Lyt til sætningen", "Lyt til hele sætningen"): NOT VERIFIED (not a native speaker; low risk).

## Issues
- None blocking. Previous Medium issue (next question off-screen after Næste) and the Ordstilling feedback-under-bar failure are both fixed.
- Cosmetic (pre-existing, unchanged): at 390 after a wrong Ordstilling answer the question prompt is scrolled above the viewport while the feedback is shown; no impact.
- Not re-run this round (unchanged code, verified previously): dialog focus trap, Space key on Næste, import/export, 1366 `scroll-margin-bottom` measurement.
- Repo: read-only; only this file written. `git status` shows other workers' modified files, none from me.

Verification: VERIFIED (US-056 criteria 1-6 pass on the machine-verifiable parts; the Danish strings need native sign-off and stay NOT VERIFIED)
