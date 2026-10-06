# VERIFY-R2-ADV: Adverbier, US-054 and US-056 (verifier VR2-A)

Branch `qa-fixes-round2`, HEAD `b44aa70`, uncommitted diff `adverbs.html` (+63/-22) and `shared/themes/adverbs.css` (+9). Browser: Edge headless (puppeteer-core from `tests/node_modules`), `file://`, 3 s wait after load. Scripts, logs and screenshots are in the scratchpad `...\scratchpad\impl\vr2-adv\` (`us054.mjs`, `draws.mjs`, `us056.mjs` + `us056-rows.json`, `misc.mjs`, `order*.mjs`, `afternext.mjs`, `reg.mjs`, `*.out.txt`, `shots\`). HEAD copy and data variants (`head.html`, `cur-freq.html`, `cur-freq-man.html`, `head-freq-man.html`) were built in the scratchpad by `prep.mjs`, with the `shared/` paths rewritten to absolute paths. Speech was stubbed with a fake da-DK voice and a `speechSynthesis.speak` spy.

## Diff review
- US-054: each zone in `zones` gets an `unlockLevel` (0,1,2,3,4,4), and `populateMap` uses `Math.min(zone.unlockLevel, levels.length - 1)` (adverbs.html:544-551, 706). Nothing else in that area changed.
- US-056: `showAnswerExplanation` (adverbs.html:1277-1310) adds an `advance()` closure. A correct answer keeps the 2000 ms timer. A wrong answer refreshes the dashboard and map at once, then adds `#nextBtn` "Næste" and focuses it with `preventScroll`. The Sjovt hook adds `fb.scrollIntoView({block:"nearest"})` on a wrong answer (:1601). The CSS adds `.fb-next` and `#feedback { scroll-margin-bottom:16px }`.
- Cleanup: `addTts(container, text, label)` gives each button a distinct label. `appendGapText` wraps the gap and the punctuation right after it in a `white-space:nowrap` span (:761-784).
- No unrelated refactoring, no debug code, no new files. Storage key, levels, scoring and XP code are untouched (verified in the diff).

## US-054 — Sætningsbygning unlockable

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| With saved progress at the top level (level index 4, 70 or more correct), reloading the page shows "Sætningsbygning" unlocked and playable. | PASS | **HEAD reproduced:** seeded L4/70 and L4/80, reloaded, map `Tid(completed), Sted(completed), Bindeord, Sætningsbygning(locked)`. **Current:** `..., Bindeord, Sætningsbygning` (enabled). A real click on it started a round. Played with real clicks through a full 7-mode rotation, the 5-question Bossrunde and on into the next rotation, all in zone `order`, 0 errors (`us054.out.txt`). |
| Unlock levels are defined per zone (or clamped to the highest level), not derived from `zones.indexOf(zone)`, so adding or hiding zones cannot make a zone unreachable. | PASS | `unlockLevel` is set per zone and clamped (adverbs.html:544-551, 706). With an extra Frequency entry, and with extra Frequency + Manner entries, the zone count changes (5 and 6 zones) and Sætningsbygning still unlocks at L4. |
| Starting a round in "Sætningsbygning" serves entries, including `alligevel` and `derfor`. | PASS | 40 real clicks on the zone (L4/70) served all 10 entries: alligevel 4, derfor 3, endnu 8, når 6, stadig 5, ud 5, men 4, fordi 2, inde 2, da 1 (`draws.mjs`). |
| Unlock thresholds of the other zones, level thresholds, scoring, XP and the storage key `danishSentenceBuilderProgress` are unchanged. Existing saves load without errors. | PASS | Seeds L0 to L4 (0/10/25/45/70/80 correct) on HEAD and current give identical lock/completed states for every zone except Sætningsbygning at L4. The same holds for the 6-zone variant (Tid 0, Sted 1, Måde 2, Frekvens 3, Bindeord 4 on both). `levels`, score +10, the key and `loadProgress`/`saveProgress` are unchanged in the diff. All seeded saves loaded with 0 console errors. |
| Zones that are hidden because they are empty (owner decision #3) still reappear when they get entries. | PASS | Live data: Måde and Frekvens are hidden. `cur-freq.html` (+1 Frequency entry) shows Frekvens, locked at L0-2 and unlocked at L3. `cur-freq-man.html` also shows Måde, unlocked at L2. |
| Keyboard order, the 360 px layout and the blocked-storage behaviour are unchanged. No console errors. | PASS | No change to the map markup or order. Smoke: no h-scroll at 360/390/820/1440. Blocked storage (getter and methods) plays without errors (regression table). 0 console or page errors in every run. |

Minor note (cosmetic, from the implementer's risks list, confirmed): Sætningsbygning and Bindeord can never show the `completed` style, because the level never exceeds 4.

Verification: VERIFIED. Every criterion passes. HEAD failure reproduced, fix confirmed. No native-speaker items.

## US-056 — wrong-answer note readable

Matrix (`us056.mjs`): 3 viewports × {normal, reduced motion} × 7 modes × all 10 entries = 420 wrong answers with real clicks. For each: rects of the feedback box, the correct answer, the note, the replay button and Næste, checked for "inside the viewport **and not covered**" (elementFromPoint probes at top, middle and bottom). Also checked: focus, h-scroll, and that the dashboard changed. Then 84 wait-and-continue runs (3.2 s wait, then Enter or Space) and 42 correct-answer runs.

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| At 1366×768, 390×844 and 360×640, after a wrong answer the feedback with its note and the replay button are fully inside the viewport. | **FAIL** (380/420 pass) | Note, replay button and Næste are inside and uncovered in **all 420** runs. In 6 of 7 modes the whole feedback box is visible at all viewports. **Ordstilling at 390×844 and 360×640 (40/40 runs, with and without reduced motion): the top 46-56 px of the feedback box is behind the sticky `.sd-bar` (← MENU, 56 px).** The box top ends at 0/26/53 px. "Forkert." and the first line "Det rigtige svar er …" are hidden or cut in half (screenshots `shots/wrong-m-ORDER.png`, `wrong-s-ORDER.png`). Cause (`order3.mjs`): Chromium scroll anchoring already scrolls the page down while the feedback is appended (also at HEAD: 431 → 840). The new `scrollIntoView({block:"nearest"})` then aligns the box top to viewport top 0 and ignores the sticky bar. There is no `scroll-margin-top`/`scroll-padding-top`. Reproduced in a natural flow (tap "Tjek rækkefølgen" with the button mid-screen at 390, or from any start position at 360; `order.mjs`). |
| After a wrong answer there is no timed advance: the game waits for an explicit "Næste" (button focusable by keyboard, also reachable by Enter/Space). | PASS | 84/84 runs: question, title and `zoneStep` unchanged after 3.2 s, Næste still shown. Focus was on `#nextBtn` in 420/420 runs. Enter (42 runs) and Space (42 runs) each advanced exactly once: `zoneStep` 0→1, a fresh unanswered question, no stray advance 2.5 s later. A keyboard-only round at 390 confirmed Næste focus after every wrong answer (`reg.out.txt`). |
| After a correct answer the behaviour stays automatic and short (unchanged unless the owner decides otherwise in US-026). | PASS | 42/42 (7 modes × 3 viewports × rm): no Næste, still on the same question at 1.0 s, next question loaded by 2.3 s (2000 ms timer, unchanged). |
| All seven modes are covered, including Lyt og vælg (replay button) and Oversættelsesbroen. | PASS (except the Ordstilling layout above) | The wait/Næste behaviour works in all 7 modes. Lyt og vælg: the replay buttons are inside the viewport and speak the sentence. Oversættelsesbroen: no feedback replay is shown cut off at any viewport. |
| The dashboard/progress update is not delayed or lost; the pending-timer cleanup from US-005 still cancels timers when a zone or review starts. | PASS | The dashboard text changes right after a wrong answer (420/420). Progress is saved at once and survives a reload. Timer cleanup (`misc.out.txt`): (A) after a correct answer, a click on zone "Tid" during the pending advance left the new Tid question unchanged after 2.6 s. (B) After a correct answer, R + "Start repetition" during the pending advance left the review question and queue unchanged after 2.6 s. (E) Starting another zone while Næste is pending removes Næste, and the new question stays put. |
| Focus management from US-031 (dialogs, focus after render) is unchanged. No console errors; blocked storage still works. | PASS | Dialogs: focus moves inside, Tab/Shift+Tab are trapped, Esc closes and focus returns to the opener (settings, review, import). Typing "r" in the CSV field does not open review. After a render, focus goes to the first option (`preventScroll`, as before). 0 console or page errors. Blocked storage (getter and methods): a wrong answer waits, Næste works, the correct answer advances on its own, reset and export work. |

Review and boss rounds: both wait for Næste after a wrong answer (`misc.out.txt` C, D). In review, Næste re-queues the item (served again). In the boss round, Space moves 1/5 → 2/5. This is **acceptable and consistent with the story**: the criterion says "after a wrong answer there is no timed advance" without exempting any round type, and the PRD rule (correct answer + note + replay) applies to every wrong answer.

Re-measure of the late `scroll-margin-bottom` at 1366×768: the feedback bottom ends exactly 16 px above the viewport bottom whenever the page needs to scroll (min gap 16 px, e.g. box 458-752, Næste 690-738; the page could still scroll further, so the margin is what applies). Computed `scroll-margin-bottom: 16px`. The margin is now applied (no longer flush), so this part is OK at 1366. The same 16 px gap applies at 390 and 360.

Cleanup items:
- Lyt labels (speech spied with a fake voice). Question word: "Lyt til ordet" speaks the word (Find betydningen, Ordklasse-jagten). Question sentence: "Lyt til sætningen" (Udfyld hullet and Bindeordsduellen speak the sentence with the blank skipped, e.g. "Jeg blev hjemme, jeg var syg."; Lyt og vælg speaks the full sentence). Feedback: "Lyt til hele sætningen" speaks `sentence_da`. The labels are distinct, Danish, set on both `aria-label` and `title`, and match what they speak. PASS. Pre-existing nit, not in this diff: in Udfyld hullet, "endnu" is spoken as "Jeg har ikke set filmen,." (`spokenGap` leaves ",.").
- Gap ".": at 390 the "." now stays on the same line as the gap (wrapper span present, `shots/gap-endnu-390.png`). At HEAD the "." sat alone on the next line (`gap-endnu-390-HEAD.png`, gap top 401, dot top 445). The comma case ("Vi bliver , når…") is wrapped the same way. PASS (checked by looking at the screenshots).

Screenshots looked at: wrong answer at 1366 (Find betydningen, shows Forkert., answer, Dansk + replay, note, help, Næste, all visible), 390 Lyt og vælg (all visible), 360 Ordklasse-jagten (all visible), 390 and 360 Ordstilling (top of the box under the MENU bar), and 360 after Næste (see issue 2).

Verification: FAILED. Criterion 1 fails for Ordstilling at 390×844 and 360×640: the top of the feedback box ("Forkert." and the first line of the correct answer) is hidden behind the sticky MENU bar. All other criteria pass. Native-speaker items (new strings "Næste", "Lyt til ordet", "Lyt til sætningen", "Lyt til hele sætningen") are NOT VERIFIED and need a native sign-off (low risk).

## Regression (Adverbier)

| Check | Result | Evidence |
|---|---|---|
| Loads with zero console errors (1366, 390, 360, fresh profile) | PASS | `reg.out.txt` (issues: none). |
| Every mode starts and completes | PASS | All 7 modes answered wrong and right in the matrix. A full rotation plus Bossrunde completed in Sætningsbygning. The review round completes (re-queue). |
| Blocked storage: getter throws | PASS | Wrong + Næste, correct + auto-advance, settings export/reset, R opens review. 0 errors. |
| Blocked storage: Storage methods throw | PASS | Same flow, 0 errors. |
| Dialogs: focus trap, Esc, focus restore | PASS | Settings (export/reset/close cycle), review, import (textarea/load/cancel cycle). Focus returns to the opener. |
| Keyboard-only round (390) | PASS | 14 questions incl. Ordstilling (Tab + Space on tiles, Enter on Tjek), Ordklasse-jagten (Tab + Enter), number keys and Bossrunde. Næste focused after every wrong answer, continued with Enter/Space. |
| Progress persists across reload | PASS | total/correct/saved identical before and after the reload. |
| Smoke `tests/smoke.mjs ../adverbs.html` | PASS (legacy rows aside) | Only the known legacy rows fail: `#btn-play` ×4 and "console clean + still playable" ×3. Console clean ×4, no h-scroll ×4, icon labels, focus ring, contrast ×2 and localStorage blocked all pass. No dump files were written. |
| No stray files | PASS | `git status --short` is the same as before the run. The only repo write is this file. |

## Issues by severity

1. **Minor-Medium (US-056 criterion 1, FAIL):** Ordstilling at 390×844 and 360×640: after a wrong answer, `#feedback` is scrolled so that its top sits under the sticky `.sd-bar`. "Forkert." and half of the "Det rigtige svar er …" line are hidden. Root cause: pre-existing scroll anchoring plus `scrollIntoView({block:"nearest"})` without a top offset. Suggested fix: `html.sd-page #feedback { scroll-margin-top: calc(var(--sd-bar-h) + 12px); }` (bar is 56 px incl. border), or scroll the Næste/feedback with the bar height taken into account.
2. **Medium (new UX side effect, not a listed criterion):** after Næste on 390/360, the next question renders while the page is still scrolled down to where the feedback was. `focusFirstControl` focuses the first option with `preventScroll`, so the new question's title and the focused option are often above the viewport. At 360 this happens in 26/28 continue runs, e.g. scrollY 614, title at -276, focused option at -122; the learner sees the last option and the dashboard (`shots/after-next-s.png`). At 390 the title is off-screen in about half of the runs. A keyboard user's focus is off-screen. Suggest scrolling `#game` (or the first control) into view after Næste.
3. **Cosmetic (pre-existing):** Sætningsbygning and Bindeord never get the "completed" style (top level is 4). Udfyld hullet speaks ",." for a blank before the final period ("Jeg har ikke set filmen,.").
4. **Robustness note:** the wrong-answer scroll lives only in the Sjovt fx hook (`if (!window.Sjovt) return;`). If `shared/sjovt.js` fails to load, nothing scrolls (Næste still works).

## Summary
- US-054: VERIFIED. The last zone was locked at L4 at HEAD and unlocks at L4 now. Other thresholds are identical at L0-L4 (also with 6 zones). Rounds serve alligevel and derfor. Hidden zones reappear with data.
- US-056: FAILED, on criterion 1 only (Ordstilling at 390/360: top of the feedback box under the sticky MENU bar). Wait-for-Næste, Enter/Space exactly once, correct auto-advance, immediate dashboard update, timer cleanup, review/boss behaviour, scroll-margin-bottom (16 px at 1366), Lyt labels and the gap "." fix all pass. Also see issue 2 (the next question is off-screen after Næste on phones).
