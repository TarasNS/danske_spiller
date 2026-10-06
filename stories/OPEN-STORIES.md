# Open stories

Four content stories remain, all waiting on native-speaker sign-off. Done work (US-001..057) is in git history; owner decisions are in `DECISIONS.md`. Evidence files named below (`VERIFY-*`, `US-0xx.md`) were removed from the tree; recover with `git show 91f7c08:stories/implementation/<file>`.

Rules for all four: vanilla JS, `file://`, zero console errors, stable item IDs (SRS keys), no scoring/storage changes, `node shared/validate.js` = 0 errors, one `smoke.mjs` run on the touched game. Order: US-061, US-058, US-060, US-059.

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
