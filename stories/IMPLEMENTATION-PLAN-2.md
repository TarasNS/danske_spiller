# Implementation plan, round 2: functional fixes (no native review needed)

**Branch:** `qa-fixes-round2` (from `qa-implementation` @ `b44aa70`, PR #3). **Stories:** US-054, US-055, US-056, US-057 (`stories/QA-USER-STORIES-2.md`) plus a small cleanup batch of recorded Minor items. Content stories US-058..061 wait for the native reviewer's corrections and are NOT part of this round. Frozen files untouched. Same worker rules as `stories/implementation/WORKER-BRIEF.md` (incl. addenda); report files `stories/implementation/R2-<ID>.md`; workers never commit; `.claude/*` and `CLAUDE.md` are not ours.

| Order | Work | Owner | Files | Depends | Parallel-safe | Status |
|---|---|---|---|---|---|---|
| 1 | US-054 Adverbier "Sætningsbygning" unlock | W-ADV | `adverbs.html` | none | yes | READY |
| 2 | US-056 Adverbier wrong-answer note readable (+ distinct "Lyt" labels in feedback, gap "." wrap at 390) | W-ADV | `adverbs.html` | after US-054 (same file) | sequential | READY |
| 3 | US-055 MV part: feedback + Næste in view; dead `.blank` CSS | W-MV | `magiske_verber.html`, `shared/themes/magiske-verber.css` | none | yes | READY |
| 4 | US-055 Idiomjæger part: feedback + Næste in view; main-menu "← TILBAGE" no-op | W-IDIOM | `idiomjaeger.html`, `shared/themes/idiomjaeger.css` | none | yes | READY |
| 5 | US-057 Dansk Mester wrong-answer note + "Fortsæt ▸" → "→" | W-DM | `danske-phraser/dansk-mester.html`, `shared/themes/dansk-mester.css` | none | yes | READY |
| 6 | Cleanup: Glosekort reset-cancel clears feedback line | W-GLOSE | `danish_flashcards/danish_flashcards_game/*` | none | yes | READY |
| 7 | Cleanup: dead `.blank` CSS (Bøjningsværkstedet) | W-BOEJ | `boejningsvaerkstedet/index.html`, theme | none | yes | READY |
| 8 | Cleanup: dead `.blank` CSS (Pronomenmysteriet) + spec test fixes (Space chip, dump path) | W-PRON | `pronomenmysteriet/index.html`, theme, `tests/pronomenmysteriet.mjs` | none | yes | READY |
| 9 | Cleanup: Tidsmaskinen spec test (dump path outside the repo; "timed expiry: no SRS write" compares before/after instead of absence) | W-TIDS | `tests/tidsmaskinen.mjs` | none | yes | READY |

Batches: 1 = items 1-9 (disjoint files; item 2 after item 1 inside the same worker). Then independent verification (P1 stories verified by a separate agent), then a targeted regression of every touched game, then PR.

## Execution log

| Event | Decision |
|---|---|
| 8 workers dispatched; 6 finished with reports (US-054, US-056, US-055 MV, US-057, Glosekort cancel, Bøjningsværkstedet dead CSS, Pronomenmysteriet cleanup + spec test 66/66) | Accept pending independent verification |
| W-IDIOM stopped by the user mid-task; its diff (main-menu back hidden, `revealNext()`, Enter preventDefault in text mode, focus heading after screen change) is small and on scope; no report | User decision: keep and verify (no re-dispatch) |
| W-TIDS ended on an API/network error (ENVIRONMENT ISSUE) while its final test run was in progress; edit to `tests/tidsmaskinen.mjs` complete (script-relative game path, dump files to OS temp, before/after SRS comparison) | Keep; verifier runs the full test |
| Stray `_r2idiom_base.html` (W-IDIOM baseline copy) | Removed by coordinator |
| VR2-A: US-054 VERIFIED; US-056 FAILED criterion 1 (Ordstilling mode at 390/360: feedback top under the MENU bar) + Medium side effect (question off-screen after Næste) = IMPLEMENTATION ERROR | Narrow retry (scroll helpers measuring the real bar; game-owned scroll); re-verified by VR2-A2: VERIFIED (168/168 wrong, 84/84 after Næste, works without sjovt.js) |
| VR2-B: US-055 (Magiske Verber, Idiomjæger incl. the stopped worker's diff), US-057, Glosekort cancel: all VERIFIED; minor notes (heading focus ring visible for keyboard users; Dansk Mester timed mode keeps 1.5 s advance on wrong; DA→EN feedback has no replay inside the box, as at HEAD) | Accept; notes go into the PR |
| VR2-A first run of VR2-C ended twice on an API safeguard false positive (ENVIRONMENT ISSUE) | Re-dispatched on Sonnet following `tester.md`: all three cleanup items VERIFIED; Tidsmaskinen "auto-advance 700-1000 ms" row still flaky (also alone: max 1196 ms), untouched by this round |
| Final | US-054..057 VERIFIED (status updated in `stories/QA-USER-STORIES-2.md`); cleanup items VERIFIED; US-058..061 remain READY FOR DEVELOPMENT (wait for the native reviewer's corrections) | Commit, push `qa-fixes-round2`, open PR stacked on `qa-implementation` |
