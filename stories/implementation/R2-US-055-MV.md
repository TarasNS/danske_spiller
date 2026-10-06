# R2-US-055 (Magiske Verber slice, W-MV round 2)

1. Summary. `magiske_verber.html`: new `revealNext()` (after `answer()`), called on the non-speed path right after Næste is focused (`preventScroll`). It scrolls down just enough to bring Næste fully into view (12 px margin) while keeping the feedback top below the 64 px MENU bar; if both cannot fit, Næste wins (`scrollIntoView block:nearest`). Behaviour is `auto` (instant) under `prefers-reduced-motion` or `data-sd-motion="off"`, else `smooth`. No auto-advance added; speed mode, timers, explainer listeners and the US-031 focus-to-Næste logic unchanged. Cleanup: removed the dead `.q-prompt .blank` and `.q-chain .blank` rules (grep of the file and `shared/themes/magiske-verber.css` showed no `.blank` use; blanks are `.sd-gap`). `.q-chain` rule kept.
2. Status: IMPLEMENTED
3. Tests (scratchpad `impl/r2-mv/t.cjs`, `k.cjs`; Edge). Every game x difficulty (speed has no question-by-question feedback so skipped) x wrong/right, 3 viewports x (normal, reduced motion) = 252 runs each:
   - BEFORE (HEAD copy): 252/252 out of viewport (e.g. 360x640 arena hard wrong: feedback 918-1080, Næste 1104-1156, vh 640; scrollY stayed 0).
   - AFTER: 252/252 feedback and Næste fully inside innerHeight, Næste focused (`activeElement.id==="nextBtn"`). Examples (top-bottom, vh): 1366x768 wrong fb 590-680, Næste 704-756 (reduced motion right: 716-768); 390x844 fb 642-756, Næste 780-832; 360x640 fb 406-552, Næste 576-628 (reduced motion 576-628 / 578-630). 0 console/page errors.
   - Keyboard (390x844): focused option + Enter answers and focuses Næste; Enter advances once (idx 0 to 1); mouse click on an option then Enter advances exactly once (idx 2).
   - Hurtigduel: auto-advances after ~750 ms (idx 0 to 1), Næste row stays hidden, scrollY 0, timer ticks 60 to 57 normally.
   - `node tests/smoke.mjs ../magiske_verber.html`: all PASS except the known legacy `#btn-play` rows (4) and "dark/light/reduced-motion: console clean + still playable" rows (artefact of no `#btn-play`).
4. Manual. Looked at the 390x844 screenshot after a wrong-mode answer (repair/hard): question, options, green feedback block and NÆSTE all visible, focus ring on NÆSTE, layout intact.
5. Files. `magiske_verber.html`: `.blank` rules removed (~l.199-201, 2 lines); `answer()` calls `revealNext()` (~l.997); new `revealNext()` ~l.1000-1015. `shared/themes/magiske-verber.css` unchanged. Temp baseline copy `mv_base_tmp.html` created in repo root for the BEFORE run and deleted.
6. Risks. Smooth scroll may still be running if Enter is pressed instantly (harmless). Very short viewports where feedback + Næste exceed the height: Næste wins and the top of the feedback may scroll above the viewport (not reached at 360x640).
7. Newly discovered. `git status` shows other workers' files and `_r2idiom_base.html` (other worker's temp) in the root; not mine.
8. Native review. n/a.
9. Acceptance criteria.

| Criterion | Result |
|---|---|
| At 1366x768, 390x844 and 360x640, after a wrong and a right answer, feedback and Næste fully inside viewport and Næste focused; every question mode (of both games) | PASS for Magiske Verber (all 7 non-speed modes x 3 levels; Idiomjæger = other owner) |
| No auto-advance added for correct answers | PASS |
| Reduced-motion: scroll instant | PASS (behavior `auto`; geometry measured in reduced-motion runs) |
| Keyboard unchanged: number keys / Enter work, no double-advance (US-031 Enter after click stays) | PASS (Enter/click+Enter checked; no number-key handler change) |
| Hurtigduel and timed modes unaffected; explainer listeners and timers intact | PASS |
| No console errors; smoke no new failures | PASS (only legacy `#btn-play` artefact rows fail) |
| Cleanup: dead `.blank` CSS removed | DONE |
