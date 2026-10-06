# QA User Stories, round 2: unreviewed Major findings

**Source:** the "Newly Discovered Issues" of `stories/IMPLEMENTATION-RESULT.md` that are **Major** and have no story yet. Evidence comes from the final regression (`stories/implementation/FINAL-REGRESSION-F1.md`, `FINAL-REGRESSION-F2.md`, `REGRESSION-R2.md`) and from the verifier/implementer reports named in each story. Line numbers refer to branch `qa-implementation` at commit `68716dd`; search for the quoted text if they drift. These stories continue the numbering of `stories/QA-USER-STORIES.md` (US-001 to US-053).

**Global rules for every story** (same as round 1):
- Follow `CLAUDE.md`: vanilla JS, must work over `file://`, no fetch/CDN, zero console errors, progress keys use stable item IDs.
- Don't change scoring, SRS or storage keys unless the story says so.
- **Frozen files** (`shared/sjovt.css`, `shared/sjovt.js`, portal `index.html`) need owner approval before they are edited. None of these stories needs them.
- `prd.md` and `specs.md` are owner-edited only.
- **Content corrections need native-speaker sign-off before merge.** The QA language reviewers are not native speakers.
- Standard validation after any game change: `cd tests && CHROME_PATH=<Edge> node smoke.mjs <game.html>` (legacy root-level games have no `#btn-play`: those rows always fail, judge the rest); `node shared/validate.js` when shared data changes.

**Not included here (Minor, see `IMPLEMENTATION-RESULT.md`):** Præpositioner "Find fejlen" always scoring correct when the sentence has a single preposition (F1 N13), Idiomjæger's no-op main-menu back button, focus on `<body>` in Idiomjæger and Dansk Mester, and the other layout and polish items.

## Story Index

| Story | Priority | Area | Games | Dependency | Status |
|---|---|---|---|---|---|
| US-054 | P1 | Gameplay | Adverbier | none | VERIFIED |
| US-055 | P1 | UI / Mobile | Magiske Verber, Idiomjæger | none (reuse the US-013 pattern) | VERIFIED |
| US-056 | P1 | Gameplay / UI | Adverbier | none | VERIFIED |
| US-057 | P1 | Gameplay / UI | Dansk Mester | none | VERIFIED |
| US-058 | P1 | Language | Tidsmaskinen | native sign-off | READY FOR DEVELOPMENT |
| US-059 | P1 | Language / Gameplay | Præpositioner | native sign-off | READY FOR DEVELOPMENT |
| US-060 | P1 | Language | Konjunktioner | native sign-off | READY FOR DEVELOPMENT |
| US-061 | P1 | Language | Bøjningsværkstedet | native sign-off | READY FOR DEVELOPMENT |

---

## US-054 — Adverbier: make the "Sætningsbygning" zone unlockable

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
Adverbier (`adverbs.html`)

**Source QA findings:**  
`stories/implementation/FINAL-REGRESSION-F1.md` N1 (Major, pre-existing); `REGRESSION-R1.md`.

**Problem:**  
The fluency map's last zone, "Sætningsbygning", can never be unlocked. A zone unlocks when `progress.level >= zones.indexOf(zone)` (`adverbs.html:704`), and "Sætningsbygning" is the 6th zone, index 5 (`adverbs.html:548`). The level list stops at index 4, "Mester" (`levels`, `adverbs.html:567-573`). So even a player at the top level (seeded in the regression to level 4 with 80 correct, then reloaded) sees the zone locked. Entries that only appear in that zone (the regression names `alligevel` and `derfor`) are therefore never practised in zone mode. Hiding the empty zones (owner decision #3) did not change this, because the unlock index still comes from the full zone list.

**User story:**  
As a `learner who has reached the top level`,  
I want `every topic zone, including Sætningsbygning, to unlock`,  
so that `I can practise all the words in the game`.

**Expected behavior:**  
Every zone becomes available at some reachable level. The last zone unlocks at the latest when the learner reaches the highest level. Zone unlocking no longer depends on how many zones exist or which are hidden.

**Acceptance criteria:**

- [ ] With saved progress at the top level (level index 4, 70 or more correct), reloading the page shows "Sætningsbygning" unlocked and playable.
- [ ] Unlock levels are defined per zone (or clamped to the highest level), not derived from `zones.indexOf(zone)`, so adding or hiding zones cannot make a zone unreachable.
- [ ] Starting a round in "Sætningsbygning" serves entries, including `alligevel` and `derfor`.
- [ ] Unlock thresholds of the other zones, level thresholds, scoring, XP and the storage key `danishSentenceBuilderProgress` are unchanged. Existing saves load without errors.
- [ ] Zones that are hidden because they are empty (owner decision #3) still reappear when they get entries.
- [ ] Keyboard order, the 360 px layout and the blocked-storage behaviour are unchanged. No console errors.

**Evidence:**  
`adverbs.html:541-549` (zones), `:567-573` (levels), `:698-710` (lock logic). Repro: set `danishSentenceBuilderProgress` to level 4 and 80 correct, reload: zones read `Tid, Sted, Bindeord, Sætningsbygning (locked)`.

**Dependencies:**  
None.

**Implementation notes:**  
- The simplest change is an explicit `unlockLevel` on each zone (the last one equal to the top level index), or `Math.min(zones.indexOf(zone), levels.length - 1)`. Pick whichever keeps current behaviour for the other zones.
- Keep the empty-zone hiding from `D-ADV-empty-zones.md` working.

**Validation:**  
Seed progress at each level 0 to 4 and check which zones are locked; start a round in the last zone and answer to completion; run smoke.

**Status:** VERIFIED

---

## US-055 — Keep post-answer feedback and the Næste button in view (Magiske Verber, Idiomjæger)

**Priority:** P1

**Severity source:** Major

**Area:**  
UI / Mobile

**Affected games/pages:**  
Magiske Verber (`magiske_verber.html`), Idiomjæger (`idiomjaeger.html`)

**Source QA findings:**  
`FINAL-REGRESSION-F1.md` N2 (Major, pre-existing; "US-013 only covered Præpositioner, Antonymer and Ordstillingsdetektiven"); `REGRESSION-R1.md`.

**Problem:**  
After answering, the grammar feedback and the Næste button are below the visible screen and nothing scrolls them into view. Measured by the regression:
- Magiske Verber at 1366×768: feedback at 731-755 px, Næste top 756-831 px, against a viewport height of 768 px.
- Idiomjæger: Næste top at 946 px (desktop) and 1219 px at 844 px tall.

Focus does move to Næste (`magiske_verber.html:993-995` calls `focus({preventScroll:true})`), but the page does not scroll, so the learner sees neither the explanation of a wrong answer nor the button to continue.

**User story:**  
As a `learner on a laptop or phone`,  
I want `the explanation and the Næste button to appear on screen after I answer`,  
so that `I can read why I was wrong and continue without hunting for the button`.

**Expected behavior:**  
After each answer (right or wrong, in every mode that shows feedback), the feedback block and Næste are fully visible, with Næste focused. Same behaviour the three games fixed in US-013.

**Acceptance criteria:**

- [ ] At 1366×768, 390×844 and 360×640, after a wrong answer and after a right answer, the feedback block and the Næste button are fully inside the viewport and Næste has focus. Applies to every question mode of both games.
- [ ] No auto-advance is added for correct answers (that belongs to blocked US-026).
- [ ] Reduced-motion: the scroll is instant, not animated.
- [ ] Keyboard behaviour is unchanged: number keys / Enter still work, no double-advance (the Magiske Verber "Enter after a mouse click" fix from US-031 stays).
- [ ] Hurtigduel (Magiske Verber speed mode) and the timed modes are unaffected. Existing explainer listeners and timers are intact.
- [ ] No console errors; smoke has no new failures.

**Evidence:**  
`FINAL-REGRESSION-F1.md` section 3 (N2). Code: `magiske_verber.html:304-308` (feedback, `#nextRow`), `:956-995` (`answer()`); `idiomjaeger.html:833-850` (`#nextWrap`, `answer()`), `:894-900`.

**Dependencies:**  
None. Reuse the pattern already verified in `revealNext()` of `danish-antonyms-game.html`, `revealFeedback()` of `dansk-praepositioner.html` and `keepAnswerInView()` of `ordstilling-detektiv/index.html` (see `stories/implementation/US-013.md`).

**Implementation notes:**  
Scroll the feedback block into view (`block:'nearest'`) after it is shown, then focus Næste with `preventScroll`. If feedback plus button are taller than the screen, the button wins, as in US-013.

**Validation:**  
The same measurement script as `VERIFY-US-013-prep.md`: bounding rects of feedback and Næste after answers, at three viewports, normal and reduced motion.

**Status:** VERIFIED

---

## US-056 — Adverbier: let the learner read the wrong-answer note

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay / UI

**Affected games/pages:**  
Adverbier (`adverbs.html`)

**Source QA findings:**  
`FINAL-REGRESSION-F1.md` N2 (Adverbier part); `qa/FINAL-QA-REPORT.md` (feedback rules; `prd.md`: wrong = correct answer + one grammar note + TTS replay).

**Problem:**  
After a wrong answer the Danish grammar note is below the visible screen at all three tested viewports, and the question is replaced automatically after 2 seconds (`adverbs.html:1265-1279`, `setTimeout(..., 2000)`). The learner can neither reach nor read the note before the game moves on, so the explanation the product promises on a wrong answer is lost.

**User story:**  
As a `learner who answered wrong`,  
I want `the correct answer, the grammar note and the replay button to stay in view until I choose to continue`,  
so that `I understand the mistake instead of losing it after two seconds`.

**Expected behavior:**  
A wrong answer shows the answer, the note and the replay button fully on screen and waits for the learner (a "Næste" control or key), with no timed advance. A correct answer keeps the quick automatic advance the PRD describes.

**Acceptance criteria:**

- [ ] At 1366×768, 390×844 and 360×640, after a wrong answer the feedback with its note and the replay button are fully inside the viewport.
- [ ] After a wrong answer there is no timed advance: the game waits for an explicit "Næste" (button focusable by keyboard, also reachable by Enter/Space).
- [ ] After a correct answer the behaviour stays automatic and short (unchanged unless the owner decides otherwise in US-026).
- [ ] All seven modes are covered, including Lyt og vælg (replay button) and Oversættelsesbroen.
- [ ] The dashboard/progress update is not delayed or lost; the pending-timer cleanup from US-005 still cancels timers when a zone or review starts.
- [ ] Focus management from US-031 (dialogs, focus after render) is unchanged. No console errors; blocked storage still works.

**Evidence:**  
`FINAL-REGRESSION-F1.md` N2; `adverbs.html:1166-1279` (answer handling, explanation, `advanceTimer`).

**Dependencies:**  
None. Compatible with blocked US-026 (feedback contract): this story only makes the wrong-answer path wait.

**Implementation notes:**  
Skip scheduling `advanceTimer` when the answer is wrong, show a Næste control (reuse the pattern of the other games), scroll the feedback into view with `block:'nearest'`.

**Validation:**  
Answer wrongly in each mode at the three viewports; measure the note's rect; wait more than 2 seconds and confirm the question is unchanged; press Næste.

**Status:** VERIFIED

---

## US-057 — Dansk Mester: keep the wrong-answer note readable

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay / UI

**Affected games/pages:**  
Dansk Mester (`danske-phraser/dansk-mester.html`)

**Source QA findings:**  
`REGRESSION-R2.md` N2 and `FINAL-REGRESSION-F2.md` finding 1 (still open); `prd.md` feedback rules.

**Problem:**  
After a wrong answer the note sits below the visible screen at 1366×768 (bottom at about 824-837 px against 768) and at 360×640, with no scroll to it, while the question advances automatically after 1.5 seconds (`dansk-mester.html:1021`, `setTimeout(..., correct ? 750 : 1500)`). It fits only at 390×844. On a laptop the learner cannot read the explanation before the next question replaces it.

**User story:**  
As a `learner who answered wrong`,  
I want `the note to be on screen and to stay until I continue`,  
so that `I learn the phrase's meaning instead of just seeing it flash by`.

**Expected behavior:**  
After a wrong answer the answer, the note and the replay button are fully visible and remain until the learner moves on. Correct answers advance quickly (750 ms), as now.

**Acceptance criteria:**

- [ ] At 1366×768, 390×844 and 360×640, after a wrong answer in each mode that shows a note, the note and replay button are fully inside the viewport.
- [ ] After a wrong answer there is no timed advance: the learner continues with a visible, keyboard-focusable control ("Fortsæt →" or the existing control).
- [ ] After a correct answer the 750 ms advance is unchanged.
- [ ] The US-041 timer cleanup (`clearGameTimers`, quitting right after an answer) still works: no uncaught errors when quitting within 100-750 ms of an answer, no timer firing after leaving the round.
- [ ] Match mode and timed mode (`Tidsudfordring`) keep their own pace: do not add waiting where there is no note.
- [ ] No console errors; smoke has no new failures.

**Evidence:**  
`FINAL-REGRESSION-F2.md` Dansk Mester row; `dansk-mester.html:1021`, `:1109` (match advance), `:1128` (miss timer).

**Dependencies:**  
None; compatible with blocked US-026.

**Implementation notes:**  
Don't schedule `G._adv` for the wrong path; show a continue control and scroll the note into view (`block:'nearest'`).

**Validation:**  
Wrong answers in flervalg, vendekort and blandet modes at the three viewports; measure the note rect; wait 3 seconds; continue via keyboard.

**Status:** VERIFIED

---

## US-058 — Tidsmaskinen passive mode: fix ungrammatical sentences with the adverb after the participle

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
Tidsmaskinen (`tidsmaskinen/data.js`, mode `passive`, around line 19671)

**Source QA findings:**  
`stories/implementation/VERIFY-US-003.md` ("Worth a separate story"), `VERIFY4-US-050-tids.md`, `US-050-W-TIDS.md` (recorded again as newly discovered); same class as US-003.

**Problem:**  
Several passive-mode model answers put a sentence adverb after the participle, which is ungrammatical or stilted in Danish, and the answer key marks them correct:
- "Der bliver spist ikke i klassen." (should be "Der bliver ikke spist i klassen.")
- "Der bliver betalt kun med kort her." (should be "Der bliver kun betalt med kort her.")
- "Maden bliver serveret kun mellem klokken 11 og 13." (should be "Maden bliver kun serveret mellem klokken 11 og 13.")
- "Fødselsdagen bliver fejret altid med kage og flag." (stilted; "Fødselsdagen bliver altid fejret med kage og flag.")

US-003 fixed the same defect in the perfect and pluperfect modes, but the passive mode was out of its scope and was only recorded.

**User story:**  
As a `learner practising the passive`,  
I want `the model sentences to be correct Danish`,  
so that `I don't learn the wrong place for ikke, kun and altid`.

**Expected behavior:**  
Every passive item is grammatical and has exactly one defensible answer; adverbs like ikke, kun and altid stand before the participle.

**Acceptance criteria:**

- [ ] The four sentences above (found by searching the `passive` mode for "klassen", "med kort her", "mellem klokken 11" and "fejret altid") are corrected so the adverb stands before the participle, and the key still matches the sentence.
- [ ] A scripted scan of ALL items of the passive mode (and, as a sanity check, the whole bank) finds no remaining participle followed by a sentence adverb (ikke, kun, altid, aldrig, også, allerede, ofte, stadig …) except legitimate cases listed in the report.
- [ ] Item ids, option counts, `accepted_answers` consistency and the 1,260 total stay unchanged unless a change is unavoidable (explain it, because ids are SRS keys).
- [ ] If fixing the word order requires restructuring the blank (the adverb now sits before the verb phrase), the item still tests the passive (bliver + participle) and still has one defensible answer among its options.
- [ ] Native-speaker sign-off on every changed sentence.
- [ ] `node shared/validate.js` 0 errors; Tidsmaskinen smoke passes; the passive mode plays through with correct and wrong answers and zero console errors.

**Evidence:**  
`VERIFY-US-003.md` line 12; `tidsmaskinen/data.js` passive mode (`"mode": "passive"`).

**Dependencies:**  
Native-speaker sign-off. US-003/014/050 changes in the same file stay intact.

**Implementation notes:**  
Clause-final placement (the US-003 solution) does not work for ikke and kun in a main clause, so the sentence frame has to put the adverb before the blank or inside it. Choose the structure that keeps one defensible answer, and keep the three ungrammatical-by-design distractor types the mode already uses.

**Validation:**  
Item dump of the passive mode before/after, the adverb-after-participle scan, and hand-reading of each changed item filled in with every option.

**Status:** READY FOR DEVELOPMENT

---

## US-059 — Præpositioner: stop offering valid prepositions as wrong options

**Priority:** P1

**Severity source:** Major

**Area:**  
Language / Gameplay

**Affected games/pages:**  
Præpositioner (`dansk-praepositioner.html`)

**Source QA findings:**  
`stories/implementation/VERIFY-US-019.md` (UNCERTAIN items 2-9 and "newly discovered templates"); `US-019.md`; follow-up to US-019, whose own criteria covered only the templates named in the story.

**Problem:**  
Wrong options are partly drawn at random from all 15 prepositions ("padding"). About 69 templates need padded distractors, so any template whose exclusion list is shorter than its set of valid prepositions can show a valid option, and the learner who picks it is marked wrong. The verifier's examples:
- "Temperaturen er under frysepunktet": fixed distractors `i` and `ved`, plus padding such as `på`; "ved frysepunktet" and "på frysepunktet" look valid.
- "Hun sidder ved vinduet": padding can offer `under` or `over` ("Hun sidder under vinduet" is valid).
- "Katten ligger under bordet": padding can offer `på` ("Katten ligger på bordet").
- "Huset ligger ved skoven": a fixed distractor is `i` ("Huset ligger i skoven" is valid).
- "Jeg er færdig om en time": padding can offer `efter`.
- Other templates that already had a valid alternative at the baseline: "Han kom til frokost", "Bilen holder på fortovet", "Jeg cykler på arbejde", "går på byen", "går på teatret", "længes til sommeren", "Jeg arbejder i Netto", "Det skete over ferien/over middagen", "Vi bor lige på torvet", "Han gik ud uden/med jakke", "Vi klarer os ikke uden/med hjælp", "Vi mødes ved/i indgangen".

**User story:**  
As a `learner practising prepositions`,  
I want `the wrong options to be actually wrong in the sentence`,  
so that `a correct answer is never marked wrong`.

**Expected behavior:**  
Every question has one defensible answer among its options. Distractors come from an explicit per-template list (or the random padding excludes every preposition that fits), and templates with several valid prepositions either accept them all or are rewritten.

**Acceptance criteria:**

- [ ] For every template, every possible distractor (explicit and padding) filled into the sentence is checked against a per-template list of valid prepositions; the scan reports 0 valid distractors across all ITEMS (replace the unconstrained padding by a safe pool or by explicit `not`/`wrong` lists).
- [ ] The templates listed above are fixed one by one: add the valid alternatives to `not`, accept them as answers (`ok` list), or rewrite the sentence so only one fits.
- [ ] "Find fejlen" / "Ret sætningen" modes never present a correct sentence as the error (US-019 criteria still hold).
- [ ] Pair-mode group sizes stay sufficient to start every pair group; scoring, XP, stored `reviewQ` shape and the US-009/013/019/028/037/044 behaviour are unchanged.
- [ ] Native-speaker sign-off on the per-template valid sets and on every changed or removed template.
- [ ] A scripted run over all ITEMS (as in `VERIFY-US-019.md`) gives 0 hits; smoke passes; modes play through with zero console errors.

**Evidence:**  
`VERIFY-US-019.md` lines 30-36 and the "newly discovered" section; `dansk-praepositioner.html` data and `distractorsFor` (padding).

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
`gen()` already accepts `opts.err`, `opts.wrong`, `opts.noErr`, `opts.not` (US-019). The most robust fix is to give every template a `valid` set and make the padding exclude it; this also removes the need to maintain `not` lists by hand.

**Validation:**  
The whitelist scan from `VERIFY-US-019.md` extended to all 69 padded templates; hand-read ≥40 templates with all options filled in; play each mode.

**Status:** READY FOR DEVELOPMENT

---

## US-060 — Konjunktioner: remove valid "wrong" conjunctions from the remaining items

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
Konjunktioner (`konjunktioner/konjunktioner.html`)

**Source QA findings:**  
`stories/implementation/US-022.md` (retry section: "Other `da`-type residuals, recorded, not fixed"), `VERIFY-US-022.md`; follow-up to US-022 QA-119, which only listed about 35 lines.

**Problem:**  
US-022 replaced the distractors on the lines the QA story listed, but the same defect remains on others: `da` (a causal "since") is still offered as a wrong option for `når`, `mens`, `før` and `inden` items where it reads as grammatical, so a learner who picks it is marked wrong. Residuals named by the implementer and verifier:
- når items on lines ~482-487 and 489-493 (for example 485, 487 and 490 can read as grammatical; "Vi spiser altid morgenmad, da vi står op" and "Han synger altid, da han er i godt humør" are borderline).
- mens items ~505, 507, 512, 513.
- før/inden items ~525, 528-530, 533, 534, 536, 538, 539 (for example 538 "Drik din kaffe, da den bliver kold" reads as causal).
- The `eftersom` item "___ ingen meldte sig, måtte jeg selv gøre det.": the options are now `der/som/at`; `som` can still be read as a dated causal "since".
- "Jeg ved ikke, ___ min nye lærer er": `hvis` can read as "whose".

**User story:**  
As a `learner practising subordinating conjunctions`,  
I want `the wrong options to be actually wrong in the sentence`,  
so that `I am not punished for a correct answer`.

**Expected behavior:**  
Every item has one defensible answer; distractors that fit the frame are removed or replaced by clearly wrong options.

**Acceptance criteria:**

- [ ] Every item of the game is checked with each offered option filled in, and a list of the items where a distractor reads as grammatical (the lines above and any others found) is produced and then fixed by replacing those distractors with options that cannot introduce the clause in that frame.
- [ ] No item offers `da` as a wrong option where the sentence is grammatical with `da`; the same for `som`, `hvis` and `når` in their frames.
- [ ] The `eftersom` item and the "min nye lærer" item are fixed.
- [ ] Each item keeps four unique options with the answer present and exactly one defensible answer (script over all ~300 questions).
- [ ] The US-022 and US-049 behaviour, scoring and storage keys stay unchanged.
- [ ] Native-speaker sign-off on every changed distractor set and on the borderline items.
- [ ] Smoke (legacy artefact rows aside) and a full drive to game over and review with zero console errors.

**Evidence:**  
`US-022.md` "Other `da`-type residuals" (about lines 30-34), `VERIFY-US-022.md` UNCERTAIN list; `konjunktioner/konjunktioner.html` data lines ~449-683.

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
Cheap approach that avoids hand-checking: forbid distractors from the "da/som/hvis/når" family on any item whose frame is a subordinate clause with a time or condition meaning, and keep the remaining ones from the interrogative family (`at/om/der/hvem/hvad`) that the US-022 retry used.

**Validation:**  
Item dump before/after, hand-reading of every changed item filled in with each option, the 300-question uniqueness script.

**Status:** READY FOR DEVELOPMENT

---

## US-061 — Bøjningsværkstedet: fix the reflexive possessive in modes 5 and 6 (`deres` vs `sin/sine`)

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
Bøjningsværkstedet (`boejningsvaerkstedet/data.js`, Mode 5 items `b5-deres-bil`, `b5-deres-boern`)

**Source QA findings:**  
`stories/implementation/VERIFY-US-015.md` (row QA-080 and item 5 of the UNCERTAIN list), `US-015.md` ("Newly discovered"); same class as QA-080/US-015, which fixed only the four `hans/hendes` items the QA story named.

**Problem:**  
Two items still teach the wrong form when the possessor is the subject of the clause:
- `b5-deres-bil` (`data.js:475`): "Naboerne vasker ___ hver søndag." with the key `deres bil`. The neighbours own the car, so Danish requires the reflexive possessive: "Naboerne vasker sin bil hver søndag."
- `b5-deres-boern` (`data.js:485`): "De henter ___ i børnehaven." with the key `deres børn`. If the children are the subjects' own, Danish requires "De henter sine børn" (reflexive); `deres børn` is only correct if the children belong to someone else, which the sentence does not say. As written, the sentence has no single defensible answer.

QA-080 and US-015 fixed the same defect for hans/hendes with a non-subject owner (for example `b5-hans-bil`), but these two were not listed.

**User story:**  
As a `learner practising possessive pronouns`,  
I want `sentences where only one possessive form is correct`,  
so that `I learn when to use sin/sine and when not`.

**Expected behavior:**  
Every Mode 5/6 sentence about possessives has one defensible answer: a subject-owned noun takes `sin/sit/sine`, and a non-subject owner takes `hans/hendes/deres`.

**Acceptance criteria:**

- [ ] `b5-deres-bil` and `b5-deres-boern` are rewritten (preferred: the same approach as `b5-hans-bil`, a non-subject owner, so `deres` stays correct) or their keys and options changed to `sin bil` / `sine børn`, with a matching note.
- [ ] An audit of ALL items with pattern `ejestedord` in Modes 5 and 6 finds no other sentence whose possessor is the subject while the key is `hans/hendes/deres` (or the reverse); any found are fixed the same way.
- [ ] Item ids stay the same (`b5-deres-bil`, `b5-deres-boern`); options keep exactly one defensible answer; the correct answer is not always in the same position (US-010 shuffle intact).
- [ ] `node shared/validate.js` 0 errors; item counts for the six modes stay 1260 / 561 / 746 / 176 / 250 / 221.
- [ ] Native-speaker sign-off on the rewritten sentences and notes.
- [ ] Modes 5 and 6 play through with zero console errors.

**Evidence:**  
`boejningsvaerkstedet/data.js:475` and `:485`; `VERIFY-US-015.md` line 48; `US-015.md` line 63.

**Dependencies:**  
Native-speaker sign-off. US-015's changes in the same file stay intact.

**Implementation notes:**  
Check how `ejestedord` items are generated and whether the Danish pronoun glosses in notes need updating.

**Validation:**  
Dump the `ejestedord` items before/after; read each one with every option filled in; play modes 5 and 6.

**Status:** READY FOR DEVELOPMENT

---

## Recommended Development Order

| Order | Story | Why Now | Dependency | What It Unblocks |
|---|---|---|---|---|
| 1 | US-054 | A zone that can never unlock hides entries from every player; a small, local logic fix | none | full coverage of Adverbier's word list |
| 2 | US-056 | Lost wrong-answer explanations are the product's core promise; one game, one file | none | consistent wrong-answer handling (pairs with US-057 and blocked US-026) |
| 3 | US-057 | Same defect in Dansk Mester, one file | none | |
| 4 | US-055 | Reuses the already verified US-013 pattern in two games | none | |
| 5 | US-061 | Small, 2 items plus an audit | native sign-off | |
| 6 | US-058 | Ungrammatical model answers (4 items plus a scan) | native sign-off | |
| 7 | US-060 | Largest content batch (Konjunktioner distractors) | native sign-off | |
| 8 | US-059 | Largest scan (69 padded templates in Præpositioner) | native sign-off | |

Functional stories (US-054 to US-057) come before the content stories because they need no native-speaker review and can be merged and verified right away; the content stories (US-058 to US-061) are independent of each other and wait on a native speaker.
