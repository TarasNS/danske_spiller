# VERIFY US-005 - Adverbier core loop (verifier V-ADV)

Method: own puppeteer-core/Edge script (scratchpad `impl/v-adv/t.mjs`, `k.mjs`, output `out2.txt`), file:// at 1366x768, 390x844, 360x640. Only the 2 s auto-advance was shortened to 60 ms in bulk runs; real 2 s timing confirmed separately (advance after 2018 ms). Original behaviour read from `git show HEAD:adverbs.html`: zone dropped in `loadQuestion(currentMode)`, mode picked once, dead "færdig" branch, no leak blanking; the defects are as the story states.

| Criterion | Result | Evidence |
|---|---|---|
| Starting review closes the modal. Options are clickable (`elementFromPoint` hits the option). | PASS | `#reviewModal` hidden after "Start repetition"; elementFromPoint at the first option centre = the option. |
| "Luk" leaves the play area in a valid state. | PASS | Luk before review: game text unchanged; Luk mid-review: same question, `awaitingAnswer` and `reviewActive` true. |
| After the last review item, "Repetitionen er færdig!" shows. | PASS | Game shows "Repetitionen er færdig!" + "Tilbage til øvelserne"; Tilbage returns to a zone question. |
| A correct review answer decrements "mangler N rigtige svar". | PASS | derfor 3->2, men 3->2 (list refreshed live). |
| The active zone is passed through every `loadQuestion` call. 14 consecutive answers after choosing "Tid" are all Time items. | PASS | 20 consecutive answers in Tid (stadig/endnu), Sted (inde/ud), Bindeord (fordi/når/da/men): all in-zone incl. boss round. Måde/Frekvens show the empty-zone message, no crash. |
| The question type rotates across the 7 modes. The boss round is reachable as designed. | PASS | First 7 questions in each of 3 zones = 7 distinct modes (shuffled); questions 8-12 are "Bossrunde n/5 - <mode>"; then rotation restarts. |
| Bindeordsduellen blanks the target word in 10/10 entries. | PASS | 10 entries x 60 builds: target word never in the prompt (whole-word regex); also 0 leaks for Udfyld hullet and Lyt og vælg. |
| The keydown handler ignores events from `input`, `textarea` and `[contenteditable]`. | PASS | Typed "rr123" in the CSV textarea: review stays closed; "r" in an injected input and a contenteditable div ignored; "r" on body opens review; key "1" answers. |
| Ordstilling lets the user remove a placed tile (click it again or an undo button), operable by keyboard. | PASS | Click on placed tile removes it; Enter and Space on a focused tile toggle it (Enter no longer submits); undo button works by keyboard. |
| Zero console errors. | PASS | 0 console/page errors in all runs. |

Other checks
- US-004 guards intact: every `localStorage` access (lines 632, 645, 1352, 1362, 1414) is in try/catch (HEAD had none, so these are Batch 1's). Run with localStorage/sessionStorage getters throwing at 1366, 390 and 360: page renders, 6 zone buttons, question shown, answering works (total/correct/score = 1/1/10), review open/close and zone click fine, no overflow on wrong feedback, 0 errors.
- Persistence: score 80 survived a reload. `smoke.mjs ../adverbs.html`: all rows PASS except the known legacy `#btn-play` (x4) and "still playable" (x3) artefacts; "localStorage blocked: no crash" PASS. No stray files (git status identical before/after).

Scope creep assessment
- "Fortryd sidste ord" button, live "Din sætning:" preview and aria-pressed outline: the criterion allows "click again OR an undo button", so the click-toggle alone satisfies it. The extras are small and accessible; mild scope creep, not required.
- "Afslut repetition" and "Tilbage til øvelserne": not named by any criterion. Defensible, since "Luk" now only hides the modal and the finish screen would otherwise be a dead end. Mild.
- "R opens review from anywhere" (was: only while a question was pending): behaviour change beyond the story, mild.
- Boss round with its own queue, empty-zone message, Ordklasse fallback, timer cancel, Enter-on-button fix trace to criteria or crash prevention. CSS only adds rules for new controls. No unrelated refactor seen.

Observations (not failures)
- The review queue holds each word once; after "Repetitionen er færdig!" the words still show "mangler 2" (three passes needed in total). Matches the criteria, may confuse a learner.
- Not done: a headed human run.

Native review: new UI labels unreviewed.

Verification: VERIFIED (all 10 criteria PASS by scripted real-click/keyboard checks; native review of new UI labels is outstanding but is not a story criterion)
