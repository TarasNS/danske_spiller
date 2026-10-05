# QA User Stories: Sjovt Dansk

**Source:** `qa/FINAL-QA-REPORT.md` (consolidated `QA-xxx` IDs). Worker IDs (LANG/GAME/VID/UI/VIS) are given for traceability. Line numbers refer to the working tree on 2026-10-04 and may drift, so search for the quoted text.

**Global rules for every story:**
- Follow `CLAUDE.md`:
  - vanilla JS
  - must work over `file://`
  - no fetch/CDN
  - zero console errors
  - progress keys use stable item IDs
- Don't change scoring, SRS or storage keys unless the story says so.
- **Frozen files** (`shared/sjovt.css`, `shared/sjovt.js`, `index.html`, see `docs/redesign/AGENT-BRIEF.md`) need **owner approval** before they are edited.
- `prd.md` and `specs.md` are owner-edited only.
- **Content corrections need native-speaker sign-off before merge.** The QA language reviewer is not a native speaker.
- **Standard validation after any game change:**
  - `cd tests && node smoke.mjs <game.html>`. Legacy games have no `#btn-play`, so pass the right play selector or ignore that check.
  - `node shared/validate.js` when shared data changes.

## Story Index

| Story | Priority | Area | Games | Dependency | Status |
|---|---|---|---|---|---|
| US-001 | P0 | Language / Gameplay | Pronomenmysteriet (+ Portal fallback) | — | VERIFIED |
| US-002 | P0 | Language | Forbindeord | Native sign-off | VERIFIED |
| US-003 | P0 | Language | Tidsmaskinen | Native sign-off | VERIFIED |
| US-004 | P1 | Gameplay | Adverbier, Antonymer, Præpositioner | — | VERIFIED |
| US-005 | P1 | Gameplay | Adverbier | US-004 | VERIFIED |
| US-006 | P1 | Gameplay | Adverbier | US-005 (same file) | VERIFIED |
| US-007 | P1 | Language | Adverbier | US-005; native sign-off | VERIFIED |
| US-008 | P1 | Gameplay | Idiomjæger | — | VERIFIED |
| US-009 | P1 | Gameplay | Præpositioner | — | VERIFIED |
| US-010 | P1 | Gameplay | Bøjningsværkstedet | — | VERIFIED |
| US-011 | P1 | Gameplay / Mobile | Glosekort | — | VERIFIED |
| US-012 | P1 | Gameplay | En/Et, Forbindeord | — | VERIFIED |
| US-013 | P1 | UI / Mobile | Antonymer, Ordstillingsdetektiven, Præpositioner | — (coordinate with US-026) | VERIFIED |
| US-014 | P1 | Language | Tidsmaskinen | US-003; native sign-off | VERIFIED |
| US-015 | P1 | Language | Bøjningsværkstedet + `shared/data/adjectives.js`, `nouns.js` | US-010; native sign-off | VERIFIED |
| US-016 | P1 | Language | Magiske Verber | Native sign-off | VERIFIED |
| US-017 | P1 | Language | Glosekort | Native sign-off | VERIFIED |
| US-018 | P1 | Language | Idiomjæger | Native sign-off | VERIFIED |
| US-019 | P1 | Language | Præpositioner | US-009; native sign-off | VERIFIED |
| US-020 | P1 | Language | Antonymer | Native sign-off | VERIFIED |
| US-021 | P1 | Language | Dansk Mester | Native sign-off | VERIFIED |
| US-022 | P1 | Language | Forbindeord, Konjunktioner | US-002; native sign-off | VERIFIED |
| US-023 | P1 | Language / Gameplay | Ordstillingsdetektiven | Native sign-off | VERIFIED |
| US-024 | P1 | Language | En/Et | Native sign-off | VERIFIED |
| US-025 | P1 | Video | Tidsmaskinen, Pronomenmysteriet, Bøjningsværkstedet, Ordstillingsdetektiven | US-001 (Pronomenmysteriet part); native sign-off | VERIFIED |
| US-026 | P2 | Cross-game | 11 legacy games | Owner decision on shared helper location | BLOCKED |
| US-027 | P2 | Language / Cross-game | Idiomjæger, Adverbier, Glosekort | Owner decision (specs); native sign-off | BLOCKED |
| US-028 | P2 | Cross-game | Dansk Mester, Ordstillingsdetektiven, Præpositioner, Antonymer, Glosekort, Forbindeord | — | VERIFIED |
| US-029 | P2 | Visual / Cross-game | All 14 games | US-006; owner approval (frozen `sjovt.*`) | IMPLEMENTED BUT NOT VERIFIED |
| US-030 | P2 | Gameplay / Cross-game | Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen, En/Et, Forbindeord | US-011 (pattern) | VERIFIED |
| US-031 | P2 | UI / Cross-game | Antonymer, Magiske Verber, Bøjningsværkstedet, Pronomenmysteriet, Forbindeord, Ordstillingsdetektiven, Adverbier | US-013, US-026 (touch same handlers) | VERIFIED |
| US-032 | P2 | Visual | En/Et | — | VERIFIED |
| US-033 | P2 | Visual | Idiomjæger, Dansk Mester | Owner approval if new sprite added to `sjovt.js` | VERIFIED |
| US-034 | P2 | Visual / Cross-game | Konjunktioner, En/Et | — | VERIFIED |
| US-035 | P2 | Video / Language | Præpositioner, Magiske Verber, Konjunktioner, Adverbier, Pronomenmysteriet, explainer scenes | US-025; native sign-off | VERIFIED |
| US-036 | P3 | Video / UI | 10 explainer games (`shared/explainer/*`) | — | VERIFIED |
| US-037 | P3 | Mobile / UI | Dansk Mester, Præpositioner, Ordstillingsdetektiven, Antonymer, Magiske Verber, Bøjningsværkstedet, Pronomenmysteriet, Glosekort, Idiomjæger, Tidsmaskinen | — | VERIFIED |
| US-038 | P3 | Visual | Shared sprites; Tidsmaskinen, Bøjningsværkstedet, Dansk Mester + mode menus | Owner approval (frozen `sjovt.js`) | IMPLEMENTED BUT NOT VERIFIED (partial; frozen-file remainder BLOCKED) |
| US-039 | P3 | Visual / Cross-game | Shared chrome + several games + Portal | Owner approval (frozen `sjovt.css`/`sjovt.js`/`index.html`) | IMPLEMENTED BUT NOT VERIFIED (partial; frozen-file remainder BLOCKED) |
| US-040 | P3 | Cross-game / UI | Portal + all games | Owner approval (frozen `index.html`, `sjovt.js`) | BLOCKED |
| US-041 | P3 | Gameplay | Antonymer, Bøjningsværkstedet, Dansk Mester | — | VERIFIED |
| US-042 | P3 | Gameplay | Bøjningsværkstedet, Pronomenmysteriet | US-001 | VERIFIED |
| US-043 | P3 | Gameplay | Glosekort | US-011 | VERIFIED |
| US-044 | P3 | Gameplay / Language | Præpositioner | US-019 | VERIFIED |
| US-045 | P3 | Gameplay / Language | Antonymer | US-020 | VERIFIED |
| US-046 | P3 | Gameplay / Language | Dansk Mester | US-021 | VERIFIED |
| US-047 | P3 | Gameplay / Language | En/Et | US-024 | VERIFIED |
| US-048 | P3 | Gameplay / Language | Forbindeord | US-022 | VERIFIED |
| US-049 | P3 | Gameplay / Language | Konjunktioner | US-022 | VERIFIED |
| US-050 | P3 | Language | Tidsmaskinen, Bøjningsværkstedet, Magiske Verber, Idiomjæger, Ordstillingsdetektiven, Portal | US-014/015/016/018/023; owner approval for `index.html` | VERIFIED (partial; portal slice BLOCKED) |
| US-051 | P3 | Language (latent data) | `shared/data/verbs.js`, `pronouns.js`, `clause-patterns.js`, `saetningsmaskinen/data.js` | Native sign-off | VERIFIED (partial; authoring to the target size BLOCKED) |
| US-052 | P3 | UI / Visual | `pixel-animation.html` | Owner decision | BLOCKED |
| US-053 | P3 | Cross-game (docs) | `docs/redesign/*`, `shared/explainer/modal.css`, `CLAUDE.md` | Owner approval (docs) | BLOCKED |

**Counts:** 53 stories. P0: 3, P1: 22, P2: 10, P3: 18.

---

## US-001 — Restore Pronomenmysteriet's curated dataset and guard against placeholder data

**Priority:** P0

**Severity source:** Critical

**Area:**  
Language / Gameplay

**Affected games/pages:**  
`pronomenmysteriet/data.js`, `pronomenmysteriet/index.html`, `tests/pronomenmysteriet.mjs`; fallback only: `index.html` (portal card, line 265)

**Source QA findings:**  
QA-001 (LANG-001, GAME-037, UI-001, VIS §6 note)

**Problem:**  
All 760 items in `pronomenmysteriet/data.js` are placeholders:
- `"sentence_da": "Test sentence 0."`, `"options": ["opt1","opt2"]`, `"correct": "opt1"`, `"note": "Test note."`
- The mode keys `anaphoric_agreement` and `indefinite_pronouns` don't match the keys the game reads, `den_det_de` and `nogen_nogle_noget` (`index.html:165-166`). So modes 4–5 show "Der er ingen opgaver til dette valg."
- Levels are A1/A2/B1, but the level chips are A2/B1/B2, so B2 alone returns nothing.

The portal links the game. Commit `2d606e5` ("Commit includes placeholders that will be replaced with real curated content") overwrote the curated file. The parent commit `b9abb96` holds the QA'd version: 760 real items, keys `subject_object, possessive_agreement, reflexive_possessive, den_det_de, nogen_nogle_noget, demonstrative`, levels A2 304 / B1 288 / B2 168, 0 placeholders.

**User story:**  
As a `Danish learner`,  
I want `Pronomenmysteriet to show real Danish pronoun exercises in all 6 modes`,  
so that `I can actually practise pronouns instead of seeing "Test sentence / opt1"`.

**Expected behavior:**  
Every mode serves real Danish items with real options and Danish notes, and every level chip (A2/B1/B2) returns items.

**Acceptance criteria:**

- [ ] `pronomenmysteriet/data.js` content equals `git show b9abb96:pronomenmysteriet/data.js`, or a later curated version reviewed by the owner.
- [ ] `grep -c "Test sentence\|opt1\|Test note" pronomenmysteriet/data.js` returns 0.
- [ ] `PRONOMEN_DATA` keys exactly match the mode keys in `index.html:162-167`, and each mode has more than 0 items for every level chip.
- [ ] A guard fails the test run if any item contains placeholder text (`Test sentence`, `opt1`, `opt2`, `Test note`, `TODO`, `lorem`) or a mode key the game doesn't know. Put it in `tests/pronomenmysteriet.mjs` or a new check called from it.
- [ ] `node tests/pronomenmysteriet.mjs` passes all checks, including modes 4–5. Before the fix it aborted in mode 4.
- [ ] If the restore can't land immediately, the portal card is hidden instead. This is an `index.html` change and needs owner approval.

**Evidence:**  
`grep -c "Test sentence" pronomenmysteriet/data.js` = 760. Coordinator runtime (`scratchpad/qa-coordinator/verify.mjs`) shows each of the 6 keys contains only "Test sentence 0." with `["opt1","opt2"]`. Git:
- `git log -- pronomenmysteriet/data.js` gives 0d6abf3, then 855e0d7, then b9abb96, then 2d606e5.
- `git show --stat 2d606e5` shows +10794/−784.

Screenshots: `scratchpad/qa-ui/shots/pronomen-m390-play0.png`, `scratchpad/qa-gameplay/shots/A_pron_mode4_play.png`. Background: `docs/redesign/reports/pronomen-data.md`.

**Dependencies:**  
None. This unblocks US-025 (Pronomenmysteriet explainers), US-042 and the native review of the sin-hans scene (US-035).

**Implementation notes:**  
- The simplest fix is to check out the file content from `b9abb96` (the developer performs this). Then diff against the HEAD placeholders to make sure nothing else in the commit is needed.
- Don't change item IDs: SRS keys are `pronomenmysteriet:<mode>:<item-id>`.
- `shared/validate.js` validates only `shared/data/*.js`, so the placeholder guard belongs in the game test or in a small per-game validator.
- Find out which automation wrote `2d606e5` (Claude Haiku co-author per the commit message) so it can't run again.

**Validation:**  
`node tests/pronomenmysteriet.mjs`; `cd tests && node smoke.mjs ../pronomenmysteriet/index.html`; play modes 1–6 manually at A2, B1 and B2.

**Status:** VERIFIED

---

## US-002 — Forbindeord: stop offering valid synonyms as wrong options

**Priority:** P0

**Severity source:** Critical

**Area:**  
Language

**Affected games/pages:**  
`forbindenor/Forbindenor.html` (function `distractors`, lines 707-716; data `s(...)` lines about 257-640)

**Source QA findings:**  
QA-002 (LANG-053; GAME-034 UNCONFIRMED note on near-synonyms)

**Problem:**  
`const pool=(byCat[rec.cat]||[]).filter(w=>w!==rec.ans);` picks 3 distractors from the answer's own category. The categories hold synonym clusters:
- Eksempel: fx / eksempelvis / bl.a. / som
- Holdning: formentlig / formodentlig / sandsynligvis / muligvis / måske; naturligvis / selvfølgelig; desværre / uheldigvis
- Konsekvens: derfor / af den grund / følgelig / dermed
- Forklaring: fordi / da / eftersom / idet
- Tid: bagefter / derefter / dernæst / derpå
- Opsummering: alt i alt / kort sagt / sammenfattende…

Examples:
- "Hun smilede, {} hun var glad." has key *fordi*, but *da* or *eftersom* can be offered and marked wrong.
- "Vi så filmen, og {} gik vi en tur." has key *bagefter*, but *derefter* or *dernæst* can be offered.

This affects most of the 359 items in the game's only mode.

**User story:**  
As a `learner practising connectors`,  
I want `the wrong options to be actually wrong in the sentence`,  
so that `I am not punished for choosing a correct synonym`.

**Expected behavior:**  
Each question has exactly one defensible answer among its 4 options.

**Acceptance criteria:**

- [ ] Distractors are never a synonym or functional equivalent of the answer in that sentence. Use either (a) cross-category distractors with matching syntax, or (b) explicit synonym groups excluded per item.
- [ ] A synonym-group table exists in the file and covers at least the clusters listed above. Native-speaker sign-off is needed.
- [ ] Items whose frame allows several connectors either get an `accepted` list or are rewritten.
- [ ] A scripted run over all 359 items × 50 draws finds no distractor in the answer's synonym group.
- [ ] The 4 options still contain no duplicates and the answer is always present.

**Evidence:**  
`forbindenor/Forbindenor.html:707-716`; coordinator category inventory (grep of `s("Cat","ans"`); worker examples at `:262, :408, :381-384, :570-577, :477-484`.

**Dependencies:**  
Native-speaker sign-off on the synonym groups. US-022 edits the same file, so do this first.

**Implementation notes:**  
- Keep the `cat` field for display and stats.
- Inversion and syntax matter: *derfor* (adverb, inversion) vs *så* (conjunction, no inversion) are both "Konsekvens" but don't fit the same slot. Cross-category distractors must fit the word-order slot too, or the distractor becomes trivially wrong.
- Don't change the storage key `LS_KEY` or the weak-word keys.

**Validation:**  
Node script over `DATA` (extract it as the language worker did, see `scratchpad/qa-language/`); smoke; play 20 items manually.

**Status:** VERIFIED

---

## US-003 — Tidsmaskinen: fix sentence-adverb placement in perfect/pluperfect model answers

**Priority:** P0

**Severity source:** Critical

**Area:**  
Language

**Affected games/pages:**  
`tidsmaskinen/data.js`, modes `pluperfect` and `preterite_vs_perfect`

**Source QA findings:**  
QA-003 (LANG-002)

**Problem:**  
With a two-word answer (auxiliary + participle) in a single `___` slot placed *before* allerede / for længst / hidtil, the completed "correct" sentence has the adverb after the participle and before the object. Examples:
- "Jeg ___ allerede hjem, da du kom." with key "var gået" gives "Jeg var gået allerede hjem".
- "Han havde fået allerede visum"
- "Chefen havde aflyst allerede mødet"
- "Vi har haft allerede tre møder"
- "Holdet har vundet hidtil alle kampe"

Affected lines:
- pluperfect `data.js`: 6248, 6340, 6363, 6386, 6432, 6455, 6478, 6524, 6547, 6570, 6616, 6639, 6709, 6732
- preterite_vs_perfect: 4248, 4455, 4502, 4548, 4571, 4594, 4617, 4686, 4756

That is 14 of the 100 pluperfect items.

**User story:**  
As a `learner`,  
I want `the model answer to have correct Danish word order`,  
so that `I don't learn "har spist allerede" as correct`.

**Expected behavior:**  
Completed sentences read "Jeg var allerede gået hjem", "Han havde allerede fået visum", and so on.

**Acceptance criteria:**

- [ ] Every listed item is rewritten so the completed sentence has *auxiliary + adverb + participle (+ object)*. Use either a two-blank frame (the game already supports two-blank items) or move the adverb so a one-slot answer reads correctly.
- [ ] Item `id`s stay stable. If an id must change, note that the old SRS progress is dropped.
- [ ] A scan (see `scratchpad/qa-coordinator/tids_adv.cjs`) finds no item where `sentence.replace('___', correct)` gives `<aux> <participle> (allerede|for længst|hidtil|endnu) <object>`.
- [ ] Clause-final adverb cases ("Bordet er dækket allerede, så…") are reviewed by a native speaker and changed only if they agree.
- [ ] `tests/tidsmaskinen.mjs` passes.

**Evidence:**  
`tidsmaskinen/data.js:6244-6248` (`id: "jeg-var-gaaet-allerede-hjem-da-du-kom"`); coordinator scan output (Critical log C-3 in the final report).

**Dependencies:**  
Native-speaker sign-off. US-014 edits the same file afterwards.

**Implementation notes:**  
`data.js` is a static file with no generator script in the repo, so edit the items directly. Check `tidsmaskinen/index.html` for how two-blank items are declared before converting. Mode 3 also has a build step.

**Validation:**  
`node tests/tidsmaskinen.mjs`; smoke; play the pluperfect mode for 10 items.

**Status:** VERIFIED

---

## US-004 — Guard all localStorage access in legacy games

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`adverbs.html`, `danish-antonyms-game.html`, `dansk-praepositioner.html`

**Source QA findings:**  
QA-004 (GAME-001, GAME-014, GAME-012)

**Problem:**  
When storage is blocked (privacy mode or blocked site data) the getter throws `SecurityError`:
- **Adverbier:** `loadProgress()` calls `localStorage.getItem` with no try/catch (`adverbs.html:592`). It runs in the DOMContentLoaded handler (`:1095`), so init aborts and the page shows only header buttons. Unguarded access also exists at `:604` (save) and `:1102`, `:1111` (dark mode).
- **Antonymer:** `function save(){ localStorage.setItem(...) }` (`:853`) throws from `launchMode → startSession → touchDailyStreak → save`, so no mode starts.
- **Præpositioner:** `endSpeed` (`:1236-1237`), `renderStats` (`:1302`) and `resetProg` (`:1348`). Lynrunde freezes at "0s".

**User story:**  
As a `learner whose browser blocks site storage`,  
I want `the games to still load and play`,  
so that `I can learn even if progress can't be saved`.

**Expected behavior:**  
Games play normally. Progress silently isn't persisted. There are no console errors.

**Acceptance criteria:**

- [ ] Every `localStorage`/`sessionStorage` read and write in the three files goes through try/catch helpers (pattern: `magiske_verber.html:751-754`, or `DanskCore.store`).
- [ ] `node smoke.mjs ../adverbs.html` passes "localStorage blocked: no crash".
- [ ] With the storage getter throwing, Adverbier shows the zone map and questions; Antonymer starts every mode; Præpositioner's Lynrunde reaches its result screen and Statistik renders.
- [ ] There are 0 pageerrors in all three cases.
- [ ] Storage keys (`danishSentenceBuilderProgress`, `modsat_danish_antonyms_v1`, the præp key) are unchanged.

**Evidence:**  
Coordinator runtime: Adverbier gave `SecurityError: blocked` with 0 zone elements vs 6 in the control; Antonymer threw on `launchMode('mc')`. Worker screenshots: `scratchpad/qa-gameplay/shots/X_adverbs_lsblocked_after.png`, `C_ant_lsblocked_afterclick.png`, `B_praep_lsblocked_speed.png`.

**Dependencies:**  
None. This unblocks US-005, US-006 and US-007 (Adverbier must boot under test).

**Implementation notes:**  
Grep each file for `localStorage` and wrap every occurrence. Keep the default state when a load fails.

**Validation:**  
`node smoke.mjs` for the 3 files. Manual run with `--disable-local-storage` or a DevTools override.

**Status:** VERIFIED

---

## US-005 — Adverbier: repair the core loop (review, mode rotation, answer leak, input handling)

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`adverbs.html`

**Source QA findings:**  
QA-005 (GAME-002), QA-007 (GAME-004), QA-008 (GAME-005, LANG-035 part), QA-014 (GAME-007), QA-015 (GAME-008 part)

**Problem:**  
1. **Review (QA-005):**
   - (a) `#reviewModal` stays open over the question; `elementFromPoint` on an option returns the modal.
   - (b) "Luk" empties `#game` (`:1188-1195`).
   - (c) "Repetitionen er færdig!" (`:1006-1011`) is nested inside `if (reviewQueue.length > 0)`, so it can never run.
   - (d) Correct review answers never lower the "mangler 3 rigtige svar" counter.
2. **Mode stuck (QA-007):** `showAnswerExplanation` calls `loadQuestion(currentMode)` without the zone (`:1020`). The mode is picked once per zone click (`:669-678`) and never rotates. After choosing "Tid", items come from other zones. The boss round (`MODES.BOSS`, `:927`) can't be reached.
3. **Answer leak (QA-008):** Bindeordsduellen never blanks the target word (`:875-885`), e.g. "Jeg har ikke set filmen endnu …" with the options når/da/endnu/men.
4. **Input (QA-014):** the global keydown (`:1211`) opens review when "r" is typed in the CSV textarea.
5. **Undo (QA-015):** Ordstilling has no undo for a tapped tile.

**User story:**  
As a `learner using Adverbier`,  
I want `review, zones and question types to work as designed`,  
so that `I can practise each adverb group and finish a review`.

**Expected behavior:**  
- Choosing a zone serves only that zone's items, with rotating question types.
- Review runs to "Repetitionen er færdig!" and counts correct answers.
- No prompt contains its answer.
- Typing in inputs never triggers shortcuts.
- Tiles can be undone.

**Acceptance criteria:**

- [ ] Starting review closes the modal. Options are clickable (`elementFromPoint` hits the option).
- [ ] "Luk" leaves the play area in a valid state.
- [ ] After the last review item, "Repetitionen er færdig!" shows (check `reviewQueue.length === 0` after the shift).
- [ ] A correct review answer decrements the per-word "mangler N rigtige svar".
- [ ] The active zone is passed through every `loadQuestion` call. 14 consecutive answers after choosing "Tid" are all Time items.
- [ ] The question type rotates across the 7 modes. The boss round is reachable as designed.
- [ ] Bindeordsduellen blanks the target word in 10/10 entries.
- [ ] The keydown handler ignores events from `input`, `textarea` and `[contenteditable]`.
- [ ] Ordstilling lets the user remove a placed tile (click it again or an undo button), operable by keyboard.
- [ ] Zero console errors.

**Evidence:**  
`scratchpad/qa-gameplay/shots/B_adverbs_review_modal.png`, `B_adverbs_csv_r_key.png`; line refs above.

**Dependencies:**  
US-004 (the game must boot when storage is blocked; tests use that path).

**Implementation notes:**  
- The worker forced modes via in-page state; see `scratchpad/qa-gameplay/B/` for a harness.
- Keep the storage key `danishSentenceBuilderProgress`.
- Feedback timing (2 s) and praise text are handled in US-026. Don't rework them here beyond what the loop needs.

**Validation:**  
Smoke; scripted 14-answer run per zone; a full review run.

**Status:** VERIFIED

---

## US-006 — Adverbier: add Danish TTS replay to prompts and wrong-answer feedback

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`adverbs.html`

**Source QA findings:**  
QA-006 (GAME-003, VIS-009 adverbs part, VIS §6 note)

**Problem:**  
`adverbs.html` has 0 matches for `speechSynthesis`/`speak(`. "Lyt og vælg" shows the whole sentence, answer included, for 3 s and then hides it (`:905-911`); there is no audio. The PRD requires a TTS replay on every Danish prompt.

**User story:**  
As a `learner`,  
I want `to hear every Danish sentence and replay it`,  
so that `the listening mode actually trains listening`.

**Expected behavior:**  
- Every Danish prompt has a ▶/speaker replay button.
- The wrong-answer panel replays the correct sentence.
- "Lyt og vælg" plays audio and does not reveal the answer text before answering.

**Acceptance criteria:**

- [ ] The game loads `../shared/dansk-core.js` (and `DanskSpeech` if needed) and uses `DanskCore.tts` / `DanskCore.ui.ttsButton` with `da-DK`.
- [ ] A replay button appears on every Danish prompt and in the wrong-answer feedback, at least 44×44, with a Danish aria-label.
- [ ] "Lyt og vælg" speaks the sentence with the target word, does not show the answer word before the user answers, and can be replayed.
- [ ] `speechSynthesis.speak` is called with `lang:"da-DK"` (spy test, as in `scratchpad/qa-video/run.mjs`).
- [ ] TTS is only triggered by the user or by an explicit listening prompt (no surprise autoplay).

**Evidence:**  
`grep -c "speechSynthesis\|speak(" adverbs.html` = 0; `adverbs.html:905-911`.

**Dependencies:**  
US-005 (same file and same render functions; do it after or together). US-029 later unifies the button style.

**Implementation notes:**  
- Follow the script order in `CLAUDE.md`.
- `dansk-core.js` isn't frozen.
- Use the existing `dc-tts-button` class so US-029 can restyle it centrally.

**Validation:**  
Smoke; a spy test for `speak` calls; manual listening check in a browser with a Danish voice (U-05).

**Status:** VERIFIED

---

## US-007 — Adverbier: real dataset, correct categories, unambiguous items and Danish grammar notes

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`adverbs.html` (data `:422-514`, category mode `:829-866`, gap/listening `:761-780, 905-925`, feedback `:998`)

**Source QA findings:**  
QA-096 (LANG-017, GAME-006), QA-097 (LANG-034), QA-098 (LANG-035 rest), QA-099 (LANG-036, GAME-008 note part)

**Problem:**  
- **QA-096:** only 10 built-in entries ship ("Built-in sample data. Replace or augment this by importing CSV."), while the header promises "~500 sentences". fordi/når/da/men are conjunctions, not adverbs. Levels are inflated (men/ud/fordi B1; inde/derfor B2).
- **QA-097:**
  - `derfor` has `category:"Adverb - Cause/Effect"`, but no category button exists for it. `renderCategoryQuestion` maps it to `""`, so every answer is wrong.
  - `alligevel` is tagged "Manner"; it is a concessive sentence adverb.
  - `stadig` is tagged "Frequency"; it is time/continuation.
- **QA-098:** items with several correct answers: "Jeg blev hjemme, ___ jeg var syg." (fordi/da); "___ jeg er træt, drikker jeg kaffe." (når/da); "Hun arbejder ___ på projektet." (stadig/endnu).
- **QA-099:** wrong-answer feedback prints "Det rigtige svar er <word> – <English meaning>" even when the answer was a category or a whole sentence. It has no Danish grammar note.

**User story:**  
As a `learner`,  
I want `a real adverb dataset with correct categories and one right answer per item, plus a Danish grammar note when I'm wrong`,  
so that `I learn the adverb system correctly`.

**Expected behavior:**  
Every item has exactly one defensible answer. Every category item can be answered. Wrong answers show the correct answer plus one Danish note.

**Acceptance criteria:**

- [ ] The dataset is replaced or extended with real adverb items. Size and levels follow `specs.md` (owner to confirm the target; the header claims about 500). Conjunctions are either moved to the Bindeord mode with a correct category or removed. Levels are re-assessed.
- [ ] Every entry's category maps to an existing button. `derfor` has a valid category (add "Årsag/følge" or retag). `stadig` is Time. `alligevel` is either given a sentence-adverb category or excluded from Ordklasse-jagten.
- [ ] A script asserts that every entry's category resolves to a button (no `correctCat === ""`).
- [ ] Gap-fill and listening items have one defensible answer: add context cues, or exclude the competing word from the options.
- [ ] Wrong-answer feedback shows the correct answer in the form the mode asked for (word, category label or sentence) plus one Danish grammar note per entry (new `note` field). English appears only as an optional hint (see US-027).
- [ ] The CSV import schema (documented in the import modal) is updated if a `note` column is added. Old CSVs still import.
- [ ] Native-speaker sign-off on the new items and notes.

**Evidence:**  
`adverbs.html:9-11, 422-514, 456, 429, 438, 832-866, 761-780, 905-925, 998`; Critical log C-6 in the final report.

**Dependencies:**  
US-005 (same file); native-speaker sign-off; owner input on the dataset size in `specs.md`.

**Implementation notes:**  
Keep entry `id`s stable if progress is keyed by word. Check `progress.categoryStats` keys when renaming categories.

**Validation:**  
Category-resolution script; smoke; manual play in each zone.

**Status:** VERIFIED

---

## US-008 — Idiomjæger: Modersmålstaleren must not crash at levels A2/B1

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`idiomjaeger.html` (`launchGame` `:1056`, `nextQuestion` `:823-826`)

**Source QA findings:**  
QA-009 (GAME-009)

**Problem:**  
`case'native':{const pool=levelPool().filter(d=>d.l==='B2'||d.l==='C1'); ...}` gives an empty pool when the level filter is A2 or B1. `pickWeighted` then returns undefined and `d.id` throws "Cannot read properties of undefined (reading 'id')". Nothing visible happens.

**User story:**  
As a `learner who set the level to A2`,  
I want `Modersmålstaleren to either work or tell me why it is unavailable`,  
so that `the game doesn't silently break`.

**Expected behavior:**  
- When the filtered pool is empty, the game falls back to all B2/C1 items with a short Danish notice, **or**
- the card is disabled with a Danish explanation.

There is no pageerror either way.

**Acceptance criteria:**

- [ ] With `PLAY_LVL` set to A2 and to B1, launching Modersmålstaleren causes no pageerror.
- [ ] The behaviour is one of the two options above. The same guard applies to any other mode whose pool can be empty.
- [ ] `startQuiz`/`nextQuestion` defend against an empty pool generally (return to the menu with a message).
- [ ] Behaviour at "Alle niveauer" is unchanged.

**Evidence:**  
Coordinator runtime: `PLAY_LVL='A2'; launchGame('native')` gave the reading-'id' error; the 'all' control had no error. Screenshot `scratchpad/qa-gameplay/shots/B_idiom_native_A2.png`.

**Dependencies:**  
None.

**Implementation notes:**  
`PLAY_LVL` is a top-level `let` (`:708`); the level select is `#fPlayLvl`.

**Validation:**  
Smoke; a scripted level × game matrix (see `scratchpad/qa-gameplay/B/`).

**Status:** VERIFIED

---

## US-009 — Præpositioner: Forvekslingspar must only serve answerable items when a level is selected

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`dansk-praepositioner.html` (`randItem` `:711-719`, `nextPair` `:1158-1165`)

**Source QA findings:**  
QA-010 (GAME-011)

**Problem:**  
`randItem` filters by level first, then by the pair filter. If nothing is left, it falls back to `pool = ITEMS`, which is *unfiltered*. `nextPair` still offers only the two pair options. So the correct preposition often isn't offered: 7–10 of 10 questions can't be answered in several combinations (A2 group 1: 10/10; A1 group 5: 9/10; B1 group 5: 9/10). Example: "Vi mødes om natten." with the options [til, i].

**User story:**  
As a `learner practising i/på or af/fra at my level`,  
I want `every pair question to contain the right answer`,  
so that `I'm not marked wrong when no correct option exists`.

**Expected behavior:**  
When level + pair gives no items, the game falls back to the pair-filtered pool across all levels and never to all ITEMS. Every served item's answer is one of the two pair options.

**Acceptance criteria:**

- [ ] `randItem` fallback order: (level ∧ filter) → (filter, all levels) → only then any other fallback. The pair mode never falls back to unfiltered ITEMS.
- [ ] A scripted run of 10 questions × every level × all 6 groups gives 0 items whose answer is outside `[p.a, p.b]`.
- [ ] Other modes behave as before.

**Evidence:**  
Source `dansk-praepositioner.html:711-719` (`if(pool.length===0) pool = ITEMS;` after the filter); worker measurements in `qa/gameplay-review.md` GAME-011.

**Dependencies:**  
None. US-019 changes the same file's data afterwards.

**Implementation notes:**  
Pass the filter into the fallback, or make `randItem` return null and let `nextPair` handle it.

**Validation:**  
Scripted matrix; smoke.

**Status:** VERIFIED

---

## US-010 — Bøjningsværkstedet: shuffle options in modes 5 and 6

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`boejningsvaerkstedet/index.html` (option render `:1148-1162`)

**Source QA findings:**  
QA-011 (GAME-019)

**Problem:**  
Options render in data order with no shuffle. The correct option is first in 250/250 `bestemt_ubestemt` items and 221/221 `maengdevaerkstedet` items, so pressing "1" every time scores 10/10.

**User story:**  
As a `learner`,  
I want `the answer position to vary`,  
so that `I have to actually know the form`.

**Expected behavior:**  
Options are shuffled per presentation. Clicks and number keys are checked against the displayed option's value.

**Acceptance criteria:**

- [ ] Options in modes 5 and 6 are shuffled each time an item is shown (pattern: `pronomenmysteriet/index.html:486`).
- [ ] The answer check compares the chosen option's text/value with `item.correct`, not with index 0.
- [ ] Number keys 1–n select the displayed order.
- [ ] Over 200 presentations the correct answer lands in each position about evenly (no position above 70%).
- [ ] SRS keys, scoring and the 800 ms auto-advance are unchanged.

**Evidence:**  
Coordinator runtime: `BOEJNINGS_DATA.bestemt_ubestemt` 250/250 and `maengdevaerkstedet` 221/221 have `options[0] === correct`.

**Dependencies:**  
None. US-015 edits mode 5/6 data afterwards.

**Implementation notes:**  
Check whether modes 1–4 (typed or other UIs) share this render path, and only shuffle choice-based modes.

**Validation:**  
Scripted distribution check; smoke; keyboard-only round.

**Status:** VERIFIED

---

## US-011 — Glosekort: confirm before "Start forfra" wipes progress, and separate it from the answer buttons

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay / Mobile

**Affected games/pages:**  
`danish_flashcards/danish_flashcards_game/script.js` (`:609-623`), `index.html`, `shared/themes/flashcards.css`

**Source QA findings:**  
QA-012 (GAME-023, UI-005)

**Problem:**  
`restartBtn` resets every status and calls `saveProgress()` with no `confirm()`. On mobile (390×844) it sits 28 px below the large answer buttons (answer y=730–834, restart y=862–910), so a mis-tap silently loses all progress. The PRD says "reset requires confirmation".

**User story:**  
As a `learner on a phone`,  
I want `to confirm before my progress is wiped`,  
so that `an accidental tap doesn't erase my work`.

**Expected behavior:**  
Clicking "Start forfra" asks "Vil du starte forfra? Dine fremskridt nulstilles." Cancel keeps everything. On mobile the button is visually separated from the answer row.

**Acceptance criteria:**

- [ ] A Danish `confirm()` (or an accessible in-page dialog) appears. Cancelling leaves statuses, counts and storage unchanged.
- [ ] Accepting resets as before.
- [ ] The button has at least 24 px extra spacing or a ghost/secondary style, or it moves out of the answer row on mobile.
- [ ] A puppeteer `dialog` event fires on click (it didn't before).

**Evidence:**  
`script.js:609-623`; `scratchpad/qa-ui/shots/flash-m390-restart.png`; `scratchpad/qa-ui/modals.mjs` (no dialog event).

**Dependencies:**  
None. This is the pattern for US-030.

**Implementation notes:**  
Match the wording used by Magiske Verber's and Ordstillingsdetektiven's reset confirms.

**Validation:**  
Smoke; dialog test; mobile screenshot.

**Status:** VERIFIED

---

## US-012 — Weak-word lists must be clearable (En/Et, Forbindeord)

**Priority:** P1

**Severity source:** Major

**Area:**  
Gameplay

**Affected games/pages:**  
`en og et/index.html` (`weakPool` `:915-926`, the weak end screen `:1342-1348`), `forbindenor/Forbindenor.html` (`:838-842`)

**Source QA findings:**  
QA-013 (GAME-028, GAME-033)

**Problem:**  
A word is "weak" while its lifetime correct count is below its lifetime attempts (`rec.c<rec.t`). Both only grow, so one miss keeps a word weak forever. En/Et: after a 15/15 Svage ord round the end screen shows "Ryddet: 0 / 15". Forbindeord: after 3 perfect weak loops, `før {t:16,c:15}` is still weak.

**User story:**  
As a `learner reviewing weak words`,  
I want `words to leave the weak list once I've answered them right`,  
so that `weak practice shows my progress`.

**Expected behavior:**  
A word leaves the weak list after N consecutive correct answers (suggested N=2) or when its last result was correct, and the end screen counts it as cleared.

**Acceptance criteria:**

- [ ] The weakness rule uses a recent streak or the last result (or `DanskCore.srs`), not lifetime c<t.
- [ ] En/Et: a perfect Svage ord round clears the words answered correctly N times, and "Ryddet" reflects that.
- [ ] Forbindeord: perfect weak loops empty the weak pool.
- [ ] Existing saved data migrates: add a streak field, defaulting to 0, without wiping c/t.

**Evidence:**  
Source lines above; worker runs in `qa/gameplay-review.md` (GAME-028, GAME-033).

**Dependencies:**  
None.

**Implementation notes:**  
Keep the storage key names. Add fields and don't rename existing ones.

**Validation:**  
Scripted weak-round runs; reload persistence; smoke.

**Status:** VERIFIED

---

## US-013 — Keep post-answer feedback and the Next control in view (Antonymer, Ordstillingsdetektiven, Præpositioner)

**Priority:** P1

**Severity source:** Major

**Area:**  
UI / Mobile

**Affected games/pages:**  
`danish-antonyms-game.html` (`#nextWrap` after `#feedbackArea` `:376-379`; advance `:1299-1304`), `ordstilling-detektiv/index.html` (markup `:326-336`, `loadQuestion`, `showExplain`), `dansk-praepositioner.html` (`#fb` `:879`, NÆSTE created `:966`)

**Source QA findings:**  
QA-035 (UI-002), QA-036 (UI-003), QA-037 (UI-004)

**Problem:**  
None of the three games scrolls or moves focus after an answer:
- **Antonymer:** "Fortsæt →" is below a tall feedback panel after every answer. Desktop: nextBtn top 1200 vs innerHeight 768. Mobile: top 1168 vs 844.
- **Ordstillingsdetektiven:** the case story pushes the tiles and UNDERSØG below the fold on each of the 12 statements (d1366 tiles top 811; m390 top 1002), and NEXT is below the fold after checking.
- **Præpositioner:** at 1366×768 the `#fb` verdict, correct answer and TIP render under NÆSTE, off-screen (top 773 vs 768). Learners never see the grammar note.

**User story:**  
As a `learner on a laptop or phone`,  
I want `to see the feedback and the next button without hunting`,  
so that `I read the grammar note and keep a smooth rhythm`.

**Expected behavior:**  
After each answer, the verdict, the correct answer, the note and the Next control are visible (or scrolled into view), and focus moves to Next.

**Acceptance criteria:**

- [ ] Antonymer: after `showFeedback`, Next is focused (`focus({preventScroll:true})`) and scrolled into view (`scrollIntoView({block:'nearest'})`). Either move Fortsæt above the long explanation or make it sticky.
- [ ] Ordstillingsdetektiven: from the 2nd statement on, the tiles and UNDERSØG are visible without scrolling at 1366×768 and 390×844 (collapse the story in `<details>`, or scroll `#answer` into view in `loadQuestion()`). After checking, Next is in view and focused.
- [ ] Præpositioner: `#fb` renders above NÆSTE or is scrolled into view. At 1366×768 the verdict and TIP are fully inside the viewport after answering in Flervalg.
- [ ] A geometry check at d1366, m390 and m360 shows feedback and Next inside `innerHeight` (or reached by automatic scroll).
- [ ] With reduced motion, scrolling is instant.

**Evidence:**  
Coordinator runtime (`verify.mjs`) for UI-002 and UI-004; screenshots `scratchpad/qa-ui/shots/antonyms-m390-fb-full.png`, `ordstil-d1366-caseopen.png`, `ordstil-d1366-checked.png`, `praep-d1366-fb0.png`.

**Dependencies:**  
None. Coordinate with US-026: auto-advance on correct answers changes the Antonymer flow. Both may land; this story covers the wrong-answer and manual paths.

**Implementation notes:**  
Tidsmaskinen already scrolls and focuses after an answer; reuse its pattern.

**Validation:**  
`scratchpad/qa-ui/fold.mjs` re-run; smoke.

**Status:** VERIFIED

---

## US-014 — Tidsmaskinen: correct contexts and grammar notes

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`tidsmaskinen/data.js`

**Source QA findings:**  
QA-075 (LANG-003), QA-076 (LANG-004), QA-077 (LANG-006), QA-078 (LANG-008). Confirm-first: U-01 (LANG-005), U-02 (LANG-007).

**Problem:**  
- **QA-075:** "I morges ___ jeg tidligt og tog toget…" (key "stod") and "Nu for tiden ___ jeg ofte tidligt…" (key "står") are missing *op* (`:559`, `:1205`).
- **QA-076:** pluperfect contexts "Børnene sov siden kl. 20." / "Det regnede siden kl. 20." / "De dansede siden kl. 19." / "Vi læste siden kl. 9." break the game's own *siden* rule. Passive "Det er sket for mange år siden." (`:6846, 6893, 6986, 7009, 20905`).
- **QA-077:** the note "Nogle ofte brugte verber har uregelmæssige imperativer: vær, gør, bliv, sig, giv, kom, tag." is false; these are regular (`:23104` and 11 more items).
- **QA-078:** "Vi ___ det for længst, da du fortalte det." has key "havde vidst", but "vidste" is equally natural (`:6592-6593`).

**User story:**  
As a `learner`,  
I want `contexts and notes that follow correct Danish`,  
so that `the tense rules I learn are true`.

**Expected behavior:**  
Contexts and notes are correct, and each item has one defensible key.

**Acceptance criteria:**

- [ ] QA-075: "…stod jeg tidligt op…" / "…står jeg ofte tidligt op…". Check how the blank sits relative to *op*.
- [ ] QA-076: rewrite to "Børnene havde sovet siden kl. 20" (or "sov fra kl. 20") and "Det skete for mange år siden."
- [ ] QA-077: replace with "Bydeform = navnemåde uden -e; dobbeltkonsonant forenkles (komme → kom)." on all 12 items.
- [ ] QA-078: use a dynamic verb, or accept both answers.
- [ ] U-01 and U-02: a native speaker first confirms whether "skal være født" (hearsay) is a second correct answer and whether "kommer til at" for visible imminence is non-native. Only then reword the items and notes as LANG-005/007 suggest.
- [ ] `tests/tidsmaskinen.mjs` passes. Item ids are unchanged.

**Evidence:**  
Line refs above (`qa/language-review.md` LANG-003…008).

**Dependencies:**  
US-003 (same file; do it first); native-speaker sign-off.

**Implementation notes:**  
Notes are shared by many items. Grep the exact note string and replace all occurrences.

**Validation:**  
`node tests/tidsmaskinen.mjs`; grep for the old strings returns 0.

**Status:** VERIFIED

---

## US-015 — Bøjningsværkstedet and shared adjectives/nouns: fix wrong keys, notes and ambiguous items

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`boejningsvaerkstedet/data.js`, `shared/data/adjectives.js`, `shared/data/nouns.js` (this also changes item counts in Bøjningsværkstedet)

**Source QA findings:**  
QA-080 (LANG-014), QA-081 (LANG-015), QA-082 (LANG-016), QA-083 (LANG-018), QA-084 (LANG-019), QA-085 (LANG-020), QA-086 (LANG-022), QA-087 (LANG-023), QA-088 (LANG-024)

**Problem:**  
- **QA-080, M5:** "Han har efterladt ___ ved stationen." → `hans cykel`; "Hun glemte ___ i bussen." → `hendes taske`; also hund and bog. *sin* is required here (`data.js:409, 410, 419, 420`).
- **QA-081, M6:** "Har du set ___ til Peter?" has key `nogen`; it should be `noget`, with the note "Fast udtryk: se noget til nogen." (`:777`).
- **QA-082:** `rig` is in the -ig list (`adjectives.js:247`), which produces rigst/rigste. It should be rigere/rigest/rigeste.
- **QA-083, M4:** `supAns = uniq([sup, supDef, 'den ' + supDef, 'det ' + supDef])` with `superlative_definite: 'mest ' + base` accepts "den mest typisk" and rejects "den mest typiske" (39 items; `data.js:244`; `adjectives.js:105, 132`).
- **QA-084:** "Glad gradbøjes uregelmæssigt: glad → gladere → gladest." (also let, flot). The `irregular` flag (set for the neuter) drives the comparison note (`adjectives.js:163, 168, 169`; `data.js:241, 247`).
- **QA-085:** comparison drilled on non-gradable -ig adjectives (muligere, umuligere, offentligere, kongeligere, færdigere, gyldigere, lovligere, forskelligere; `adjectives.js:237-257`). Exact list is partly UNCONFIRMED.
- **QA-086, M6:** two correct answers:
  - intet + nouns whose singular and plural are the same (svar, ord, lys, tegn)
  - begge with no "two" cue (8 items)
  - hverken/enten (4 items)

  Lines: `:601, 756, 760, 764, 770; 738-748; 794-801`.
- **QA-087, M5:** about 25 definiteness items where the distractor is natural ("Han ligger stadig i ___." sengen; "Hun læser ___ hver morgen." avisen; `:311-314, 481-502, 511-534`).
- **QA-088, M1:** the generic note "føje en bestemt endelse til stammen" / "føje -ne/-ene til ubestemt flertal" is false for about 67 nouns (kat→katten, cykel→cyklen, museum→museet, lærere→lærerne, gæs→gæssene; `data.js:57-64`).

**User story:**  
As a `learner`,  
I want `Bøjningsværkstedet's keys, notes and model sentences to be correct and unambiguous`,  
so that `I don't learn hans for sin or wrong comparison forms`.

**Expected behavior:**  
Each item has one defensible answer, the model sentences are grammatical, and the notes describe the actual form change.

**Acceptance criteria:**

- [ ] QA-080: use `sin cykel/taske/hund/bog` (distractor `sin cyklen` etc.), or rewrite with a non-subject owner as `b5-hans-bil` does.
- [ ] QA-081: key `noget`, with the note updated.
- [ ] QA-082: `rig` moved to the regular list. The `rig-sammenligning` key becomes rigest/rigeste.
- [ ] QA-083: the periphrastic definite superlative is `'mest ' + definite/plural form` ("den mest typiske"), with blå/grå unchanged. A test asserts that "den mest typiske" is accepted and "den mest typisk" is rejected.
- [ ] QA-084: the comparison note uses a separate field from the neuter irregularity ("Glad gradbøjes regelmæssigt: gladere → gladest.").
- [ ] QA-085: a non-gradable filter excludes the confirmed non-gradable adjectives. A native speaker confirms the list.
- [ ] QA-086: use nouns with a distinct plural for intet/ingen, add a "to" cue for begge, and a negative cue for hverken.
- [ ] QA-087: add generic cues (e.g. "nu om dage", "generelt") or replace the items.
- [ ] QA-088: the M1 note is derived from the actual change (doubling, schwa loss, -um, -ere) or comes from `noun.note`.
- [ ] `node shared/validate.js` gives 0 errors. Item counts per mode are reported before and after (shared data changes counts). Smoke passes.

**Evidence:**  
Line refs above; coordinator verified QA-080, QA-081 and QA-082 in source.

**Dependencies:**  
US-010 (same game; shuffle first so M5/M6 data edits are tested in shuffled order); native-speaker sign-off.

**Implementation notes:**  
- `boejningsvaerkstedet/data.js` generates M1–M4 from `DANSK_NOUNS`/`DANSK_ADJECTIVES` at load time.
- Keep item id generation stable. If ids are derived from words, changing `rig` changes one id, which is acceptable.
- The language worker's boot harness is in `scratchpad/qa-language/`.

**Validation:**  
Boot data.js in node with the shared data and dump the items (as the worker did); `node shared/validate.js`; smoke.

**Status:** VERIFIED

---

## US-016 — Magiske Verber: correct auxiliaries and anchor the tense items

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`magiske_verber.html` (V table `:415, :427`; templates `:449-578`; buildOptions `:585`; explanation `:621`)

**Source QA findings:**  
QA-091 (LANG-029), QA-092 (LANG-030)

**Problem:**  
- **QA-091:** `{v:'rejse',…,pf:'Vi er [v] til Spanien flere gange i år.'}` (should be *har rejst* for repeated travel) and `{v:'begynde',…,pf:'Filmen har [v] uden mig.'}` (should be *er begyndt*). The generated instruction "Hvilken form står efter 'har'?" and the explanations repeat the error (`:531, :558`).
- **QA-092:** 14 past templates open with a non-temporal adverbial ("Til festen [v] gæsterne…", "På mødet [v] lederen…"), and 44 of 78 present templates have no time anchor ("Jeg [v] en mail til min chef."). The other tense is in the options and is grammatical. The explanation "Tidsudtrykket peger på fortiden" is false for these.

**User story:**  
As a `learner`,  
I want `perfect-tense auxiliaries to be right and each tense item to have one correct answer`,  
so that `I learn har/er and tense choice correctly`.

**Expected behavior:**  
Correct auxiliaries; every past/present item contains an explicit time cue, or the competing tense is excluded from its options.

**Acceptance criteria:**

- [ ] QA-091: "Vi har rejst til Spanien flere gange i år." / "Filmen er begyndt uden mig." The instructions and explanation reflect the right auxiliary.
- [ ] QA-092: every past template has a past time cue ("Til festen i lørdags…"), every present template has a present cue ("hver dag", "nu"), **or** `buildOptions` excludes the other tense for anchor-less templates.
- [ ] "Tidsudtrykket peger på fortiden" appears only for templates that contain a time expression.
- [ ] A script over all 735 generated questions finds no item whose options contain both the present and past form of the verb unless a cue exists.
- [ ] Native-speaker sign-off.

**Evidence:**  
Coordinator verified `:531` and `:558` in source; `qa/language-review.md` LANG-029/030.

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
The OK_MSGS/NO_MSGS praise text belongs to US-026; don't change it here.

**Validation:**  
Generator dump script; smoke; play each round game once.

**Status:** VERIFIED

---

## US-017 — Glosekort: fix the "mødes" participle and wrong notes/examples

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`danish_flashcards/danish_flashcards_game/script.js`

**Source QA findings:**  
QA-094 (LANG-032), QA-095 (LANG-033)

**Problem:**  
- **QA-094:** `infinitive:'mødes', … pastParticiple:'mødt'` (`:101`). The reciprocal verb's perfect is "har mødtes".
- **QA-095:** wrong or unnatural notes and examples:
  - "»prøve på« bruges om tøj" (`:142`): *prøve på (at)* means "try to"; for clothes it is "prøve en jakke (på)". Borderline Major.
  - "»spørge efter« betyder at efterlyse" (`:148`)
  - "Han opgiver aldrig så let." (`:76`) → "Han giver aldrig så let op."
  - "Toget rejser klokken 8" (`:16`) → kører/afgår
  - "Det røg ud af vinduet" (`:92`) → "ud ad vinduet"
  - "vride sig = skrue sig" (`:49`) → "sno sig"
  - "måtte" glossed "to must" (`:68`) → "may / must"
  - UNCONFIRMED: "Skoene slider…" (`:46`), "Slippe af sted med" (`:37`)

**User story:**  
As a `learner`,  
I want `verb forms and notes on the cards to be correct`,  
so that `I memorise the right forms`.

**Expected behavior:**  
Correct participle and notes.

**Acceptance criteria:**

- [ ] `mødes` has `pastParticiple:'mødtes'`.
- [ ] Each listed note and example is corrected as specified. The UNCONFIRMED items change only after native confirmation.
- [ ] The aria-label "Pronounce" is handled in US-028 (not here).
- [ ] Smoke passes; cards render.

**Evidence:**  
Coordinator verified `script.js:101`; `qa/language-review.md` LANG-032/033.

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
Progress is keyed by index/infinitive. Check `saveProgress` and don't reorder the `verbs` array.

**Validation:**  
Smoke; grep for the old strings returns 0.

**Status:** VERIFIED

---

## US-018 — Idiomjæger: fix the reversed idiom, the calque entry and synonym distractors

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`idiomjaeger.html` (data `:343-536`, pickers `:594-603`)

**Source QA findings:**  
QA-100 (LANG-037), QA-101 (LANG-038), QA-102 (LANG-039)

**Problem:**  
- **QA-100:** `{d:"Gå op i en højere enhed",m:"To dissolve into nothing / fall apart",x:"For plans or things to come to nothing.",e:"Hele planen gik op i en højere enhed.",t:"The whole plan just fell apart."}` (`:531`). The idiom means "merge into a harmonious whole", so every mode marks the wrong meaning as correct.
- **QA-101:** "Have rejst sig på den forkerte side" (`:491`) is a calque of English "get up on the wrong side of the bed". The Danish idiom *stå op med det forkerte ben først* is already at `:351`. The example "Undskyld, jeg er vist rejst mig…" is also ungrammatical (*har* … rejst mig).
- **QA-102:** duplicates or synonyms can be offered as "wrong": "Ramme hovedet på sømmet" (`:408`) / "Slå hovedet på sømmet" (`:508`); "Det er ingen sag" (`:350`) / "Det er ikke nogen sag" (`:492`); gå i vasken / gå i fisk; tale lige ud af posen / sige rent ud / tage bladet fra munden; ramme plet / være lige i skabet. The pickers exclude only identical strings.

**User story:**  
As a `learner`,  
I want `idiom meanings to be correct and only one option to be right`,  
so that `I learn real Danish idioms`.

**Expected behavior:**  
Correct meaning and example; no calque entries; no synonymous idiom offered as a distractor.

**Acceptance criteria:**

- [ ] QA-100: m "To come together perfectly / form a harmonious whole". Rewrite x, e and t (e.g. "Musikken og billederne gik op i en højere enhed."). Category is no longer "Problems & Challenges".
- [ ] QA-101: delete the entry. If it is kept, the example uses "har vist rejst mig".
- [ ] QA-102: merge the exact duplicates and add a synonym-group field. The pickers exclude every member of the answer's group.
- [ ] Badge, achievement and mastery counts still work after any entry deletion. Check `masteredCount` and the stored per-idiom keys; idioms are keyed by `d`/`k`.
- [ ] Native-speaker sign-off.

**Evidence:**  
Coordinator verified `:531`; Critical log C-5 in the final report.

**Dependencies:**  
Native-speaker sign-off. US-027 later moves meanings to Danish.

**Implementation notes:**  
Deleting an idiom orphans its stored stats; that is harmless, but don't crash on unknown keys.

**Validation:**  
Smoke; scripted run of 500 meaning questions with no synonym pair among the options.

**Status:** VERIFIED

---

## US-019 — Præpositioner: answer validity ("Find fejlen" errors, CONFUSE distractors, keys)

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`dansk-praepositioner.html` (`CONFUSE` `:314-320`, `gen(...)` data `:337-600`, mistake mode `:1016`, correct mode `:1069-1070`, translation `:1133`)

**Source QA findings:**  
QA-104 (LANG-041, downgraded from Critical), QA-105 (LANG-042), QA-106 (LANG-043)

**Problem:**  
- **QA-104:** "Find fejlen" and "Ret sætningen" build the "wrong" sentence by swapping in `err`, but for these templates the result is correct Danish, which the game then labels "Fejlen: uden → med":
  - `gen("Jeg drikker kaffe {a} {x}.","med",[…mælk,sukker,fløde…],…,{err:"uden"})` (`:404`)
  - `gen("Jeg drikker te {a} {x}.","uden",…)` (default err "med") (`:478`)
  - "Hun rejste uden …" (`:484`)
  - "Mødet sluttede uden …" (`:486`)
  - `gen("Temperaturen er {a} {x}.","under",…,{err:"over"})` (`:494`)
- **QA-105:** the CONFUSE map offers valid alternatives as wrong:
  - "Vi mødes i kantinen" vs *ved*
  - "Bogen ligger på reolen" vs *i*
  - "i toget/sofaen" vs *på*
  - "under ferien" vs *i*
  - "efter mødet" vs *under*
  - "ved vinduet" vs *i*
  - "over pladsen" vs *på*
  - "over en time" vs *under*
  - "om en time" vs *på*
  - about 15 more (`:342, 356, 350, 492, 464, 532, 510, 572, 428, 358, 490, 568, 498, 468, 528, 578, 506`)

  Also `CONFUSE["af"]`, `["fra"]` and `["uden"]` list the preposition itself.
- **QA-106:**
  - "Vi skal lige nå til flyet/toget…" (key "til", `:542`) should be "nå toget".
  - "Bilen holder ved indkørslen" (`:536`) should be "i indkørslen".
  - "Brevet er {a} …" is keyed "til" at `:376` and "fra" at `:456`.
  - Translation needs an exact string (farmor/bedstemor rejected, `:1133`, `:616`).

**User story:**  
As a `learner`,  
I want `"errors" to be real errors and wrong options to be really wrong`,  
so that `I don't learn that correct Danish is incorrect`.

**Expected behavior:**  
Every `err` produces an ungrammatical sentence in its frame. Distractors are invalid in their frame. Translation accepts listed alternatives.

**Acceptance criteria:**

- [ ] QA-104: each listed template gets an `err` that is ungrammatical in every fill (e.g. "kaffe *af* mælk"), or the template is excluded from mistake/correct modes (`noErr:true`).
- [ ] QA-105: per-template distractor exclusions (or per-template `wrong` lists) remove valid alternatives for all listed templates. `CONFUSE` entries no longer contain the key itself.
- [ ] QA-106: "Vi skal lige nå toget" (a different mode or remove the preposition slot); "holder i indkørslen"; one key per "Brevet er …" frame; translation accepts an array of answers.
- [ ] A script over all ITEMS: in mistake mode no wrong sentence equals a whitelisted valid sentence, and no option equals the answer.
- [ ] Native-speaker sign-off on the new `err`/distractor choices.

**Evidence:**  
Critical log C-4 in the final report; coordinator source check of `:404-405`, `:494-495`, `:1016`, `:1069-1070`.

**Dependencies:**  
US-009 (same file); native-speaker sign-off.

**Implementation notes:**  
`gen()` already accepts `opts.err`. Add `opts.wrong` (array) and `opts.noErr`. Don't change the stored `reviewQ` shape beyond adding fields.

**Validation:**  
Item dump script; smoke; play "Find fejlen" ×20.

**Status:** VERIFIED

---

## US-020 — Antonymer: accept all valid antonyms, fix example grammar and remove non-antonym pairs

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`danish-antonyms-game.html` (distractors `:1101-1103`, typed check `:1194`, data `:477-760`); `danish_antonyms.csv` isn't loaded but should be kept in sync if it is maintained

**Source QA findings:**  
QA-108 (LANG-045, GAME-015), QA-109 (LANG-046), QA-110 (LANG-047)

**Problem:**  
- **QA-108:** distractors = `ANTONYMS.flatMap(p=>[p.wordA,p.wordB]).filter(w=>w!==answer && w!==shown)`. 66 headwords have several antonyms (gammel: ung/ny/frisk; mild: bitter/intens/alvorlig/skarp/stærk/syrlig; sikker: usikker/tvivlsom/farlig). A valid antonym can be offered as wrong, and typed mode accepts only one. The hint "begynder med »s«" for mild fits stærk, skarp and syrlig.
- **QA-109:** example grammar errors (`:658, 549, 696, 723, 565, 637, 570, 530`):
  - "Han spiste den hele kage." → "Han spiste hele kagen."
  - "Systemet er kompleks." → "komplekst"
  - "Hendes ansigt var bleg." → "blegt"
  - "Systemet var træg." → "trægt"
  - "Værelset er tilstødende køkkenet."
  - "Husene er lignende."
  - "favorit film"
  - "Kom her hen."
- **QA-110:**
  - Non-antonyms: rød/blå, gul/lilla, luftig/pigget, kløende/glat, fløjl/sandpapir, gas/fast stof, dygtig/langsom, skarp/sløret, beholde/forlade, pæn/frygtelig, mikro/makro.
  - Non-words: "ulovende", "frysende (koldt)", "Stigen var rystende", "rejser på økonomi".
  - False friend: *sympatisk* glossed "sympathetic" with antonym "ligegyldig" (it should be *usympatisk*).
  - Lines: `:477, 478, 553, 711, 751, 756, 604, 627, 655, 512, 725, 672, 483, 614, 586, 687`.

**User story:**  
As a `learner`,  
I want `every valid antonym accepted and the examples grammatical`,  
so that `I'm not marked wrong for a right answer and I copy correct Danish`.

**Expected behavior:**  
Distractors exclude every word paired with the shown word. Typed mode accepts every paired antonym. Examples are grammatical. Only true antonym pairs remain.

**Acceptance criteria:**

- [ ] The distractor filter excludes all words paired (in either direction) with the shown word.
- [ ] Typed mode accepts any paired antonym. Hints don't match more than one accepted answer.
- [ ] All QA-109 examples are corrected.
- [ ] QA-110 pairs are removed or replaced. The *sympatisk* pair becomes sympatisk/usympatisk with a correct gloss. Non-words are replaced.
- [ ] Duplicate pairs are removed (see LANG-048: lys/mørk, retfærdig/uretfærdig, større/mindre, alvorlig/mild, lige/ulige).
- [ ] Saved progress (`modsat_danish_antonyms_v1`) still loads. Removed pairs are ignored safely.
- [ ] A simulation of 3,000 multiple-choice questions has 0 options that are a valid antonym of the shown word.
- [ ] Native-speaker sign-off.

**Evidence:**  
Coordinator noted `:1101-1103`; worker simulation (5/3000) in GAME-015; `qa/language-review.md` LANG-045…047.

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
Build a `Map(word → Set(antonyms))` once at load.

**Validation:**  
Simulation script; smoke.

**Status:** VERIFIED

---

## US-021 — Dansk Mester: correct misleading notes and ambiguous glosses

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`danske-phraser/dansk-mester.html`

**Source QA findings:**  
QA-112 (LANG-049), QA-113 (LANG-050), QA-114 (LANG-051)

**Problem:**  
- **QA-112:** `note:"»Mangler« betyder »savner« – der er kun ét trin tilbage."` (`:512`). *mangle* = lack; *savne* = miss.
- **QA-113:**
  - "Bruges, når man er enig i en holdning eller et udsagn – husk »i«, ikke »med«." (`:386`): *enig med* + person is correct, and the Præpositioner game teaches "enig med dig" (`dansk-praepositioner.html:546`).
  - "begynde på … husk »på«, ikke »med«" (`:387, :422`)
  - "Det var hyggeligt" explained as "»Hyggelig« i datid" (`:363, :484`)
- **QA-114:** duplicate English glosses make multiple choice ambiguous: passe på / tage sig af both "take care of"; kigge på / se på both "look at"; "I think so" / "I think so too" (`:388-389, :945`).

**User story:**  
As a `learner`,  
I want `phrase notes to be accurate and each English prompt to point to one phrase`,  
so that `I learn the right usage`.

**Expected behavior:**  
Accurate notes; unique glosses in a question, or the ambiguous pair is never offered together.

**Acceptance criteria:**

- [ ] QA-112: "»Mangler« betyder her, at der stadig er noget tilbage."
- [ ] QA-113: "enig i en sag, enig med en person"; "begynde på (en opgave) / begynde med (at …)"; "var + intetkøn -t".
- [ ] QA-114: glosses are disambiguated ("look after" vs "take care of (a task)"; "look at" vs "watch"), **or** the option builder excludes items with the same gloss.
- [ ] Native-speaker sign-off.

**Evidence:**  
Coordinator verified `:512`; `qa/language-review.md` LANG-049…051.

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
Check whether phrase stats are keyed by `da`. If so, don't change `da` strings.

**Validation:**  
Smoke; grep for the old notes returns 0.

**Status:** VERIFIED

---

## US-022 — Forbindeord and Konjunktioner: fix spelling, reflexive-possessive errors and ambiguous items

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`forbindenor/Forbindenor.html`, `konjunktioner/konjunktioner.html`

**Source QA findings:**  
QA-116 (LANG-054), QA-117 (LANG-055), QA-119 (LANG-057), QA-120 (LANG-058)

**Problem:**  
- **QA-116:** answer key `ovenikoebet` displays and is read aloud as "ovenikøbet". RO and the item's own note use *oven i købet* (`Forbindenor.html:372-375`).
- **QA-117:** "Hun maler smukt, ligesom sin mor gjorde." (`Forbindenor.html:453`) and "Hun danser smukt, ___ sin mor gjorde." (`konjunktioner.html:610`) put *sin* inside the subject of its own clause. Also check UNCONFIRMED `forb :456`, `konj :601`.
- **QA-119:** about 35 Konjunktioner items where a "wrong" option is also correct:
  - "Jeg ved ikke, ___ min nye lærer er." (hvor)
  - "Telefonen ringede, ___ jeg var ude i haven." (da)
  - "Vi tager på stranden, ___ solen skinner." (når)
  - eftersom items offering fordi/da
  - lines `:631, 637, 638, 643, 647, 650, 652, 672, 676, 681-683, 451, 452, 496, 504, 506, 509-511, 526, 531, 535, 540, 618, 488, 449`
- **QA-120:** "Det føles, at sommeren aldrig kommer i år." should be "Det føles, som om…" (`konjunktioner.html:424`).

**User story:**  
As a `learner`,  
I want `connector and conjunction items to be spelled right and have one right answer`,  
so that `I learn correct Danish`.

**Expected behavior:**  
Correct spelling and possessives; one defensible answer per item.

**Acceptance criteria:**

- [ ] QA-116: the answer displays and is spoken as "oven i købet". Keep the internal id stable if progress depends on it.
- [ ] QA-117: "ligesom hendes mor gjorde" in both games. The UNCONFIRMED lines are reviewed.
- [ ] QA-119: each listed item's distractors are replaced with options that are clearly wrong in the frame.
- [ ] QA-120: "Det føles, som om…".
- [ ] Native-speaker sign-off.

**Evidence:**  
Coordinator verified `Forbindenor.html:372-375`; `qa/language-review.md` LANG-054/055/057/058.

**Dependencies:**  
US-002 (Forbindeord distractor logic first; same file); native-speaker sign-off.

**Implementation notes:**  
Forbindeord answer keys are ASCII-folded (`ovenikoebet`) and mapped to display text. Find the display map rather than editing only the key.

**Validation:**  
Smoke on both games; data dump.

**Status:** VERIFIED

---

## US-023 — Ordstillingsdetektiven: correct the "verb last" tips and accept valid word orders

**Priority:** P1

**Severity source:** Major

**Area:**  
Language / Gameplay

**Affected games/pages:**  
`ordstilling-detektiv/index.html` (tips `:566, 567, 601, 701, 734`; check `:1040/:1052`; lives `:959`)

**Source QA findings:**  
QA-122 (LANG-060), QA-123 (LANG-061 order part; GAME UNCONFIRMED note)

**Problem:**  
- **QA-122:** `grammarTip:"…modalverbet på anden plads, og hovedverbet står til sidst i infinitiv: Jeg · kan · tale dansk"`. Danish isn't verb-final, and the tip's own example has an object after the infinitive.
- **QA-123:** `built.join(" ")===cur.correct.join(" ")` accepts only one order. Valid topicalised orders ("Kaffe drikker jeg") are rejected while the English prompt suggests a free translation. The case 6 questions lack "?".

**User story:**  
As a `learner`,  
I want `tips that describe Danish word order correctly and credit for valid alternatives`,  
so that `I learn V2 order without being misled`.

**Expected behavior:**  
Tips are correct. Either alternative valid orders are accepted, or the task clearly says "byg præcis denne sætning".

**Acceptance criteria:**

- [ ] All listed tips say: "Infinitiven/tillægsformen står efter grundleddet (og evt. ikke); objekt og andre led følger efter."
- [ ] Either (a) items support `alternatives: [[…], …]` and the check accepts any of them, or (b) the instruction text states that the exact target sentence must be built.
- [ ] Case 6 questions end with "?".
- [ ] (Cheap hardening, noted by UI QA) `G.lives` is clamped to at least 0 before `String.repeat` (`:959`).
- [ ] Native-speaker sign-off on the tip wording and any alternatives.

**Evidence:**  
Coordinator verified `:567`; `qa/language-review.md` LANG-060/061.

**Dependencies:**  
Native-speaker sign-off. English "Next/Finish" labels are in US-028.

**Implementation notes:**  
Weak-mode and rank storage are keyed by case/statement. Keep them.

**Validation:**  
Smoke; solve one case with an alternative order (if option a is chosen).

**Status:** VERIFIED

---

## US-024 — En/Et: correct the "øl" note

**Priority:** P1

**Severity source:** Major

**Area:**  
Language

**Affected games/pages:**  
`en og et/index.html` (`:579`)

**Source QA findings:**  
QA-126 (LANG-069)

**Problem:**  
`{w:"øl",a:"en",d:"øllen",…,note:"Det hedder »en øl«. Bestemt form: ølen."}`. The note contradicts the data (øllen). *et øl* is also used (UNCONFIRMED: RO lists both), so the en/et question may be ambiguous.

**User story:**  
As a `learner`,  
I want `the note to show the right definite form`,  
so that `I learn øllen`.

**Expected behavior:**  
Note: "Bestemt form: øllen. (Både en øl og et øl bruges.)" Either accept both genders or replace the item.

**Acceptance criteria:**

- [ ] The note is corrected.
- [ ] A native speaker decides whether to accept both en/et for øl or to drop the item from the en/et question. That decision is implemented.

**Evidence:**  
Coordinator verified `:579`.

**Dependencies:**  
Native-speaker sign-off.

**Implementation notes:**  
—

**Validation:**  
Smoke.

**Status:** VERIFIED

---

## US-025 — Add missing explainers for Tidsmaskinen, Pronomenmysteriet, Bøjningsværkstedet; wire existing scenes in Ordstillingsdetektiven

**Priority:** P1

**Severity source:** Major

**Area:**  
Video

**Affected games/pages:**  
`tidsmaskinen/index.html` (line 2 `data-explainer`), `pronomenmysteriet/index.html` (line 2), `boejningsvaerkstedet/index.html` (line 2), `ordstilling-detektiv/index.html` (line 2), new files in `shared/explainer/scenes/`

**Source QA findings:**  
QA-046 (VID-001), QA-047 (VID-002), QA-048 (VID-003), QA-049 (VID-004)

**Problem:**  
Current `data-explainer` values (coordinator runtime):
- tidsmaskinen = `tider-nutid-datid,foernutid-har,datid-foernutid,modalverber`. This covers modes 1, 2 and 5. Missing: mode 3 pluskvamperfektum, 4 future, 6 hvis, 7 at+infinitiv, 8 passive, 9 imperative. The tabs aren't tied to the selected mode.
- pronomenmysteriet = `min-mit,sin-hans`. Missing: mode 1 subject/object, 4 den/det/de, 5 nogen/nogle/noget, 6 demonstratives.
- boejningsvaerkstedet = `navneord-former,tillaegsord-form`. Missing: mode 4 gradbøjning, 6 mængdeord.
- ordstilling-detektiv lists only `v2-ordstilling,ikke-placering`, although the shipped `adverbier-placering`, `modalverber`, `foernutid-har` and `konjunktioner` match cases 5, 7, 8 and 9–10.

**User story:**  
As a `learner stuck on a mode`,  
I want `a FORKLARING explainer for the rule that mode tests`,  
so that `I can learn the rule, not just guess`.

**Expected behavior:**  
Each listed mode has a matching scene. Where possible, the first tab shown matches the active mode.

**Acceptance criteria:**

- [ ] New scenes are authored with the skill `.claude/skills/grammar-explainer-video` (scene format as the existing 18). At minimum:
  - Tidsmaskinen: pluskvamperfektum, future, hvis/conditional, at+infinitiv, passive, imperative
  - Pronomenmysteriet: subject/object, den/det/de, nogen/nogle/noget, demonstratives
  - Bøjningsværkstedet: gradbøjning, mængdeord
- [ ] The scenes are wired via `data-explainer`. Ordstillingsdetektiven adds `adverbier-placering,modalverber,foernutid-har,konjunktioner`.
- [ ] Optional (recommended): the modal opens on the scene matching the active mode, if `modal.js` supports a preferred tab. Otherwise document it as a follow-up.
- [ ] Each new scene passes the VID harness (`scratchpad/qa-video/run.mjs`): all steps reach `__explainerDone`, nothing is clipped at 360/390/1440, and reduced motion works.
- [ ] New scenes ship with `verify:false` only after native-speaker review. Until then `verify:true` is acceptable only if US-035 has hidden the badge from learners.

**Evidence:**  
Coordinator runtime `data-explainer` values; `specs.md:140-146, 160-166, 201-210`; `qa/video-review.md`.

**Dependencies:**  
US-001 (the Pronomenmysteriet scenes need real data to validate against); native-speaker sign-off.

**Implementation notes:**  
- `shared/explainer/*` isn't listed as frozen in CLAUDE.md, but it is shared by 10 games. Run the VID harness on all 10 after any change.
- Scenes must stay in sync with `.claude/skills/grammar-explainer-video/examples/` if that copy is the source.

**Validation:**  
VID harness on the 4 games; smoke.

**Status:** VERIFIED

---

## US-026 — Shared answer-feedback contract for the 11 legacy games (PRD)

**Priority:** P2

**Severity source:** Major

**Area:**  
Cross-game

**Affected games/pages:**  
`adverbs.html`, `magiske_verber.html`, `idiomjaeger.html`, `dansk-praepositioner.html`, `danish-antonyms-game.html`, `danish_flashcards/…/script.js`, `danske-phraser/dansk-mester.html`, `en og et/index.html`, `forbindenor/Forbindenor.html`, `konjunktioner/konjunktioner.html`, `ordstilling-detektiv/index.html`; also `boejningsvaerkstedet/index.html` ("Rigtigt!" `:1224`)

**Source QA findings:**  
QA-031 (GAME-031, VIS-010, LANG-073, GAME-008 timing, UI-002 auto-advance part, UI-017 no-SFX part)

**Problem:**  
`prd.md:20-21` requires:
- Correct: animation + sound + ~800 ms auto-advance, with no congratulatory text.
- Wrong: correct answer + one grammar note + TTS replay, with no encouragement.

The legacy games instead:
- Show praise or encouragement:
  - `magiske_verber.html:933-934` `OK_MSGS = ['Godt klaret!','Flot arbejde!','Du bliver bedre!']`, "Prøv igen!"
  - `en og et/index.html:1001-1002` `praise=["Storartet!","Pragtfuldt!",…]`, "Du klarer den næste!"
  - Konjunktioner "✓ RIGTIGT!"
  - Idiomjæger "Stort fund! 🪙 +10"
  - Antonymer "RIGTIGT!" (`:1276`)
  - Præpositioner "✗ PRØV IGEN!" (seen at runtime)
  - Ordstillingsdetektiven "✓ Sagens logik holder!"
  - Dansk Mester praise arrays (around `:1011`)
- Need a manual Næste click: Idiomjæger, Præpositioner, Antonymer, En/Et, Forbindeord, Konjunktioner, Ordstillingsdetektiven, Adverbier (2 s).
- Play **no** correct/wrong sounds: only the 3 DanskCore games use `DanskCore.ui.sound`.

The continue control is labelled NÆSTE →, NÆSTE », VIDERE or FORTSÆT → in different positions.

**User story:**  
As a `learner moving between games`,  
I want `the same feedback rhythm everywhere`,  
so that `correct answers flow quickly and wrong answers teach me something, without noise`.

**Expected behavior:**  
- Correct: `Sjovt.fx.correct` + `DanskCore.ui.sound` correct tone + auto-advance at 800 ms, with no text.
- Wrong: the answer, one Danish note, a TTS replay, and one "Næste" button in a consistent place (focused).
- Mute is respected via `dc:sound-enabled`.

**Acceptance criteria:**

- [ ] A shared helper exists (e.g. `DanskCore.quiz.feedback(...)` in `shared/dansk-core.js`, which isn't frozen) that implements the contract and respects reduced motion and mute.
- [ ] Each of the 11 games uses it, or matches it. Per game:
  - no praise or encouragement strings remain (grep the lists above returns 0 user-visible hits)
  - correct answers auto-advance at 800 ± 100 ms (measured)
  - a correct sound plays when sound is on
  - wrong feedback shows the correct answer + a note + TTS
- [ ] Games that now emit sound expose a visible mute (see US-040 for placement). Until US-040 lands, a per-game LYD toggle wired to `dc:sound-enabled` is acceptable.
- [ ] Speed or timed modes keep their own pacing if specs require it. Document any exception.
- [ ] Bøjningsværkstedet's "Rigtigt!" text is removed.
- [ ] Owner sign-off on rolling this out to games that `specs.md` marks "Complete", since it changes their UX.

**Evidence:**  
`prd.md:20-21`; `qa/visual-consistency-review.md` VIS-010 (`sheet-fresh-fb.png`, `sheet-fb-after.png`); coordinator runtime (Præpositioner "✗ PRØV IGEN!"); sound grep (resolution R-1 in the final report).

**Dependencies:**  
Owner decision on helper location. If the helper must live in `shared/sjovt.js`, owner approval is required (frozen). It is recommended after US-005 (Adverbier loop) and alongside US-013. It unblocks US-031 and US-040 (mute placement).

**Implementation notes:**  
- Roll out one game per PR.
- Don't change scoring or storage.
- The Adverbier 2 s delay and Magiske Verber's 750 ms Hurtigduel are covered here.

**Validation:**  
Per game: smoke, an auto-advance timing probe, a `speechSynthesis`/AudioContext spy, and a grep for the praise strings.

**Owner decisions (2026-10-05):** #15-18 in `stories/DECISIONS.md`: helper in `dansk-core.js`; full contract in all 12 games (Complete games signed off); per-game LYD toggle until US-040; timed modes keep their pacing.

**Status:** READY FOR DEVELOPMENT

---

## US-027 — Danish-first learning content in Idiomjæger, Adverbier and Glosekort

**Priority:** P2

**Severity source:** Major

**Area:**  
Language / Cross-game

**Affected games/pages:**  
`idiomjaeger.html` (data `:343-536`, UI `:801-804, 857, 1046, 1049`), `adverbs.html` (`:744-797, 998`), `danish_flashcards/danish_flashcards_game/script.js` (`:403, 414`)

**Source QA findings:**  
QA-032 (LANG-072)

**Problem:**  
`prd.md:17`: "Interface text in Danish; English only to resolve semantic ambiguity." But:
- **Idiomjæger:** every meaning option, explanation and Kontekstmesteren prompt is English ("Situation: To stay calm…").
- **Adverbier:** "Find betydningen" options are English, and the feedback says "Engelsk: …".
- **Glosekort:** the English gloss is always on the card front.

**User story:**  
As a `learner`,  
I want `meanings and explanations in Danish with English as an optional hint`,  
so that `I stay immersed in Danish as the PRD intends`.

**Expected behavior:**  
Danish meaning and explanation by default; English hidden behind a hint toggle where useful.

**Acceptance criteria:**

- [ ] The owner confirms scope in `specs.md` (owner-edited), e.g. whether Idiomjæger is intended as an EN→DA idiom game. **This is the first step.**
- [ ] If confirmed: Danish meanings (`m_da`, `x_da`) are authored for all 171 idioms and shown by default, with English behind a "Vis engelsk" hint.
- [ ] Adverbier meaning options are Danish.
- [ ] The Glosekort front shows Danish first, with English as a toggle.
- [ ] Native-speaker sign-off on all new Danish text.

**Evidence:**  
Line refs above; `prd.md:17`.

**Dependencies:**  
Owner decision (`specs.md`); native-speaker sign-off; US-018 (fix idiom content first); US-007 (Adverbier data).

**Implementation notes:**  
Large content task; split per game. Keep the English fields for the hint.

**Validation:**  
Smoke; spot review.

**Owner decisions (2026-10-05):** #19-22 in `stories/DECISIONS.md`: Danish first in all three games, English behind "Vis engelsk"; agents draft (`verify:true`), native reviewer signs off. Scope confirmed by the owner (first criterion); `specs.md` wording still to be added by the owner or with explicit approval.

**Status:** READY FOR DEVELOPMENT

---

## US-028 — Replace English UI strings with Danish

**Priority:** P2

**Severity source:** Minor

**Area:**  
Cross-game

**Affected games/pages:**  
`shared/themes/dansk-mester.css`, `danske-phraser/dansk-mester.html`, `ordstilling-detektiv/index.html`, `dansk-praepositioner.html`, `danish-antonyms-game.html`, `danish_flashcards/danish_flashcards_game/script.js`, `forbindenor/Forbindenor.html`

**Source QA findings:**  
QA-033 (UI-011; LANG-033, 044, 048, 052, 056, 061 parts; GAME-027, 034, 036 parts; VIS-009 aria part; VIS §6)

**Problem:**  
English strings in a Danish UI:

| Location | English string | Danish replacement |
|---|---|---|
| `shared/themes/dansk-mester.css:181-182` | `content:"  ✓ CORRECT"` / `"  ✗ WRONG"` | ✓ RIGTIGT / ✗ FORKERT |
| `dansk-mester.html:1131` | "Continue ▸" | Fortsæt ▸ |
| `ordstilling-detektiv/index.html:1086` | `"Finish ▸":"Next ▸"` | Afslut ▸ / Næste ▸ |
| `dansk-praepositioner.html:946` | "🎯 Multiple choice" | Flervalg |
| `danish-antonyms-game.html:1189` | button "Check" | Tjek |
| `danish-antonyms-game.html:918` | aria-label "Pronounce" | Udtal |
| flashcards `script.js:264` | aria-label "Pronounce" | Udtal |
| `Forbindenor.html:760` | "+1 ENERGY" | +1 ENERGI |
| `Forbindenor.html:636-641` | English category labels next to the Danish ones | remove (or behind a hint) |

**User story:**  
As a `learner`,  
I want `all interface text in Danish`,  
so that `the UI matches the PRD and stays immersive`.

**Expected behavior:**  
Danish strings: RIGTIGT/FORKERT, Fortsæt, Næste/Afslut, Flervalg, Tjek, Udtal, ENERGI. English category labels are removed, or shown only as a hint.

**Acceptance criteria:**

- [ ] Every string listed is replaced.
- [ ] A grep across game files for `CORRECT|WRONG|Continue|Next ▸|Finish ▸|Multiple choice|"Check"|Pronounce|ENERGY` returns 0 user-visible hits.
- [ ] Accessible names are Danish.

**Evidence:**  
`scratchpad/qa-ui/mont/vp.png`; line refs above.

**Dependencies:**  
None. Coordinate with US-029, which may rename TTS aria labels to "Lyt".

**Implementation notes:**  
Theme CSS files (`shared/themes/*`) aren't frozen.

**Validation:**  
Grep; smoke per game.

**Status:** VERIFIED

---

## US-029 — One TTS replay button across all games

**Priority:** P2

**Severity source:** Major

**Area:**  
Visual / Cross-game

**Affected games/pages:**  
- ♪: `konjunktioner.html:736`, `Forbindenor.html:685`, `ordstilling-detektiv/index.html:810`, `en og et/index.html:894`, `themes/idiomjaeger.css:171`, `themes/dansk-mester.css:204`
- ▶: `magiske_verber.html:800`, `dansk-praepositioner.html:767`, flashcards `script.js:263`, `themes/boejningsvaerkstedet.css:200`, `themes/pronomenmysteriet.css:144`, `themes/tidsmaskinen.css:140`
- pixel speaker SVG: `danish-antonyms-game.html:917`

**Source QA findings:**  
QA-034 (VIS-009)

**Problem:**  
- The TTS button has four looks (♪, ▶, a pixel speaker, none in Adverbier) and varying accessible names ("Udtal", "Udtal ordet", "Lyt til sætningen", "Afspil igen", "Pronounce").
- ▶ also means "open explainer" (FORKLARING, `modal.js:163`) and "current card" (flashcard list).
- Fill colours differ.

**User story:**  
As a `learner`,  
I want `the "listen" button to look the same in every game`,  
so that `I recognise it instantly and don't confuse it with "play explainer"`.

**Expected behavior:**  
One pixel speaker icon, one 48×48 framed style, one Danish label ("Lyt"). ▶ is reserved for the explainer.

**Acceptance criteria:**

- [ ] One shared speaker sprite or icon (base: the Antonymer 8×8 path), rendered via `DanskCore.ui.ttsButton` / `.dc-tts-button`.
- [ ] All 14 games use it. Grep finds no ♪ or ▶ used for TTS.
- [ ] aria-label "Lyt" (or "Lyt til sætningen"), at least 44×44, visible focus ring.
- [ ] VID/UI harness: no regressions in tap-target or focus checks.

**Evidence:**  
`scratchpad/qa-visual/tts/*.png`, `tts.cjs` output.

**Dependencies:**  
US-006 (Adverbier gets a TTS button first). **Owner approval** if the sprite or style goes into frozen `shared/sjovt.js` / `shared/sjovt.css`. The alternative is to place it in `dansk-core.js` plus theme CSS.

**Implementation notes:**  
Theme files already restyle `.dc-tts-button::before`. Centralise the style there.

**Validation:**  
Screenshots of each game's TTS button; smoke.

**Status:** IMPLEMENTED BUT NOT VERIFIED

---

## US-030 — Add "Nulstil fremskridt" with confirmation where reset is missing

**Priority:** P2

**Severity source:** Minor

**Area:**  
Gameplay / Cross-game

**Affected games/pages:**  
`boejningsvaerkstedet/index.html`, `pronomenmysteriet/index.html`, `tidsmaskinen/index.html` (progress in `srs:<game-id>`), `en og et/index.html`, `forbindenor/Forbindenor.html`

**Source QA findings:**  
QA-025 (GAME-032, GAME-029 reset part, GAME-034 reset part)

**Problem:**  
`prd.md:26`: "reset requires confirmation". These 5 games have no reset at all. A grep for reset/confirm in the three DanskCore games finds nothing.

**User story:**  
As a `learner`,  
I want `to reset my progress deliberately`,  
so that `I can start over without clearing browser data`.

**Expected behavior:**  
A "Nulstil fremskridt" control asks for Danish confirmation and then clears only that game's keys.

**Acceptance criteria:**

- [ ] Each game has a visible reset, at least 44×44, keyboard-operable.
- [ ] A Danish `confirm()` (or accessible dialog) appears. Cancel changes nothing.
- [ ] Accept clears only that game's namespace (`DanskCore.store` / the game's LS key).
- [ ] It works when storage is blocked (no crash).

**Evidence:**  
`qa/gameplay-review.md` GAME-032/029/034.

**Dependencies:**  
US-011 (confirmation wording pattern).

**Implementation notes:**  
- For the DanskCore games, add the control to the start screen next to LYD/MØRK.
- Don't change key names.

**Validation:**  
Dialog test; reload after reset; smoke.

**Status:** VERIFIED

---

## US-031 — Consistent focus management after answers, screen changes and modal opens

**Priority:** P2

**Severity source:** Minor

**Area:**  
UI / Cross-game

**Affected games/pages:**  
- `danish-antonyms-game.html` (GAME-017)
- `magiske_verber.html` (GAME-022)
- `boejningsvaerkstedet/index.html` summary (`:670-675, :1337`)
- `pronomenmysteriet/index.html` summary (`:390-395, :651`)
- `forbindenor/Forbindenor.html` (GAME-034)
- `ordstilling-detektiv/index.html` after "Tjek" (GAME-036)
- `adverbs.html` settings and import modals (UI-015)

**Source QA findings:**  
QA-020 (GAME-017, 021, 022, 034 part, 036 part, UI-015)

**Problem:**  
Focus falls to `<body>` after answers or screen changes, so keyboard users must Tab back in. Summary screens set focus before the screen is visible. Tidsmaskinen (`:891-897`) does it in the right order. Adverbier's modals leave `activeElement` on BODY, with no focus trap or Esc handling.

**User story:**  
As a `keyboard user`,  
I want `focus to land on the next sensible control`,  
so that `I can play with the keyboard alone (PRD)`.

**Expected behavior:**  
- After each render, focus moves to the first option or to the Next button.
- Summary focus is set after the screen is shown.
- Modals focus their first control, trap Tab, close on Esc and restore focus.

**Acceptance criteria:**

- [ ] In every listed game, `document.activeElement` is never `BODY` after an answer, screen change or summary.
- [ ] Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen" (order as in `tidsmaskinen/index.html:891-897`).
- [ ] Adverbier modals use `DanskCore.ui.focusTrap`; Esc closes them and focus returns to the opener.
- [ ] Enter on the focused Next control advances in Antonymer.

**Evidence:**  
`scratchpad/qa-ui/a11y.mjs`, `modals.mjs`; `qa/gameplay-review.md` line refs.

**Dependencies:**  
US-013 and US-026 touch the same post-answer handlers. Land after them or coordinate.

**Implementation notes:**  
Use `focus({preventScroll:true})` together with explicit `scrollIntoView` to avoid jumpy pages.

**Validation:**  
A Tab-walk script; a keyboard-only playthrough per game.

**Status:** VERIFIED

---

## US-032 — En/Et: replace vector mode icons with Sjovt pixel sprites

**Priority:** P2

**Severity source:** Major

**Area:**  
Visual

**Affected games/pages:**  
`en og et/index.html` (`:304-346` mode icons, `:366-374` emblems), `shared/themes/en-og-et.css`

**Source QA findings:**  
QA-058 (VIS-001); related smoke note: dark-mode contrast 1.09 on the mode-card glyphs

**Problem:**  
The 8 mode-card icons and the emblems are pre-reskin vector art: `rx` rounded rects, circles, Bézier paths, a 2px gold `#c79a3a` stroke, and SVG `<text>` in `Cinzel Decorative`, which isn't loaded and falls back to serif. Coordinator grep: 6 `rx="`, 12 "Cinzel". This is the only game with non-pixel menu icons.

**User story:**  
As a `learner`,  
I want `En/Et to look like the rest of Sjovt Dansk`,  
so that `the site feels like one product`.

**Expected behavior:**  
Pixel sprites in the 32px shaded style, with no SVG `<text>` and no rounded vectors.

**Acceptance criteria:**

- [ ] All 8 mode icons and the emblems are replaced by `data-sd-sprite` sprites (existing ones such as `terning`, or new 32px sprites drawn to the shared style).
- [ ] The page has no `rx=` and no `Cinzel` references.
- [ ] Dark-mode contrast of the mode-card glyphs is at least 3:1 (smoke `lowContrast` check passes).

**Evidence:**  
`scratchpad/qa-visual/enet-desktop-light-start.png`, `sheet-mobile-dark-start.png`.

**Dependencies:**  
New sprites in `shared/sjovt.js` need **owner approval** (frozen). Reusing existing sprites, or inline pixel SVG in the game file, doesn't.

**Implementation notes:**  
`Sjovt.spriteSVG` uses rect-per-run with `crispEdges`. Match the 1px outline and the top-left-lit 3-tone ramp.

**Validation:**  
Screenshots light/dark at 390 and 1440; smoke.

**Status:** VERIFIED

---

## US-033 — Replace colour emoji icons with sprites (Idiomjæger, Dansk Mester)

**Priority:** P2

**Severity source:** Major

**Area:**  
Visual

**Affected games/pages:**  
- `idiomjaeger.html`: badges `:666-674`, "Serie 🔥" `:688`, "🪙 +10" `:854`, toasts 🏆 `:676/:856`, results 🎓/🏴‍☠️/💪/💰/🔁 `:868-875`, `:1093`
- `danske-phraser/dansk-mester.html`: 🔥 `:1227`, 🎓 `:850`, headlines `:1157` (render UNCONFIRMED)

**Source QA findings:**  
QA-059 (VIS-002, VIS-003); U-04 for the unverified headline emoji

**Problem:**  
OS colour emoji are used as icons:
- 🇩🇰 renders as "DK" on Windows.
- Locked badges are greyscale emoji.
- The streak is shown as the `molle` sprite in the Dansk Mester header but as 🔥 on its stats page.

**User story:**  
As a `learner`,  
I want `icons in the same pixel style everywhere`,  
so that `badges and results look like part of the game`.

**Expected behavior:**  
Sprites (`pokal`, `stjerne`, `flag`, `kiste`, `lup`, and a new `flamme` for streaks) replace the emoji.

**Acceptance criteria:**

- [ ] No visible colour emoji remain in Idiomjæger or Dansk Mester. A CDP font check reports no "Segoe UI Emoji" on visible nodes.
- [ ] One streak icon is used in the Dansk Mester header and stats.
- [ ] The badge mapping follows the Dansk Mester badges screen pattern.
- [ ] Verify whether the Dansk Mester `:1157` headline emoji render (U-04) and remove them if so.

**Evidence:**  
`scratchpad/qa-visual/res/idiom-badges.png`, `idiom-results.png`, `fb/idiom-3.png`, `res/mester-stats.png`.

**Dependencies:**  
A new `flamme` sprite in `shared/sjovt.js` needs **owner approval** (frozen). Otherwise reuse an existing sprite.

**Implementation notes:**  
Also remove emoji from button labels ("Spil igen 🔁").

**Validation:**  
Screenshots of the badges, results and stats screens.

**Status:** VERIFIED

---

## US-034 — Make the ← MENU bar full-bleed in Konjunktioner and En/Et

**Priority:** P2

**Severity source:** Minor

**Area:**  
Visual / Cross-game

**Affected games/pages:**  
`konjunktioner/konjunktioner.html` (body `padding:14px`, `:66-71`), `shared/themes/konjunktioner.css:155`; `en og et/index.html` (body `padding:26px 14px 70px`, `:71-75`), `shared/themes/en-og-et.css:204`

**Source QA findings:**  
QA-042 (UI-010, VIS-007)

**Problem:**  
Body padding wraps the injected sticky `.sd-bar` in a coloured frame: the bar sits at x=12–26, y=20–24 instead of 0/0 as in the other 12 games.

**User story:**  
As a `learner`,  
I want `the top bar to look the same in every game`,  
so that `navigation feels consistent`.

**Expected behavior:**  
The bar spans the full viewport width at y=0. Content padding moves to the game container.

**Acceptance criteria:**

- [ ] `html.sd-page body{padding:0}` in both theme files, with the padding moved onto the game wrapper.
- [ ] Probe: `.sd-bar` x=0, y=0, width = viewport at 390 and 1366.
- [ ] No horizontal scroll at 360. Layout is unchanged otherwise.

**Evidence:**  
`scratchpad/qa-ui/shots/konj-d1366-start.png`; `scratchpad/qa-visual/probe.cjs` output.

**Dependencies:**  
None. Theme files aren't frozen.

**Implementation notes:**  
Check the mobile media queries in the theme files that also set body padding.

**Validation:**  
`probe.cjs`; smoke.

**Status:** VERIFIED

---

## US-035 — Explainer content gaps and scene review (til, er-perfect, meaning vs order, sin-hans)

**Priority:** P2

**Severity source:** Minor

**Area:**  
Video / Language

**Affected games/pages:**  
`dansk-praepositioner.html`, `magiske_verber.html`, `konjunktioner/konjunktioner.html`, `adverbs.html`, `pronomenmysteriet/index.html`; scenes `shared/explainer/scenes/foernutid-har.scene.js`, `sin-hans.scene.js`, `flertal.scene.js`, `inversion-derfor.scene.js`, `konjunktioner.scene.js`, `tider-nutid-datid.scene.js`; `shared/explainer/explainer.js:97`

**Source QA findings:**  
QA-050 (VID-005), QA-051 (VID-006), QA-052 (VID-007), QA-054 (VID-009), QA-057 (VID-014, LANG-068); U-03 (LANG-067)

**Problem:**  
- **QA-050:** no "til" scene, although Præpositioner promises "i, på, til og af".
- **QA-051:** `foernutid-har.scene.js:1` says "Kun 'har'-verber; 'er'-verber (er kommet) er udeladt", while Magiske Verber drills har/er. Learners risk "har kommet".
- **QA-052:** the Konjunktioner and Adverbier meaning modes have no meaning-based explainer.
- **QA-054:** `sin-hans` has `verify:true`, so `explainer.js:97` shows the "Skal tjekkes" badge to learners and truncates the title to "sin elle…" on mobile.
- **QA-057:**
  - `flertal.scene.js:151` "Hvert ord: barn → børn" (should be "Nogle ord / Uregelmæssigt")
  - `inversion-derfor`/`konjunktioner` run-on "han var syg derfor…"
  - `tider-nutid-datid.scene.js:419` highlights only "går" in "I går"
- **U-03 (confirm first):** whether sin-hans colours the grammatical "Peter ser hans bror" in "wrong" red.

**User story:**  
As a `learner`,  
I want `explainers that cover what each game tests and contain no internal QA labels`,  
so that `the explanations are complete and trustworthy`.

**Expected behavior:**  
New til and er-perfect content; meaning-focused scenes for the conjunction and adverb meaning modes; no "Skal tjekkes" visible; corrected wording.

**Acceptance criteria:**

- [ ] A native speaker reviews `sin-hans` (incl. U-03). If the red colouring is confirmed misleading, use a neutral colour plus a gloss ("= en andens bror"). Then set `verify:false`.
- [ ] Production never renders the "Skal tjekkes" badge: gate it behind a dev flag in `explainer.js`.
- [ ] A "til" scene is added and wired in Præpositioner.
- [ ] `foernutid-har` gains an er-verb step, or a sibling scene `foernutid-er` is added and wired in Magiske Verber.
- [ ] Konjunktioner and Adverbier get a meaning scene (or the existing scene is clearly labelled as word order).
- [ ] QA-057 wording fixes are applied, with punctuation or capitalisation where the player supports it.
- [ ] VID harness passes on all affected games.

**Evidence:**  
`scratchpad/qa-video/shots/pronomenmysteriet_index_mobile_tab1_step4.png`; `qa/video-review.md`.

**Dependencies:**  
US-025 (same authoring workflow); native-speaker sign-off.

**Implementation notes:**  
Keep the scenes in sync with `.claude/skills/grammar-explainer-video/examples/` if that is the canonical copy.

**Validation:**  
VID harness; screenshots.

**Status:** VERIFIED

---

## US-036 — Explainer modal polish (desktop fit, mobile label, timers, failure message, rule card, tokens)

**Priority:** P3

**Severity source:** Minor

**Area:**  
Video / UI

**Affected games/pages:**  
`shared/explainer/modal.css` (`:5, :11, :15-18, :24, :28, :31-33`), `shared/explainer/modal.js` (`:102, :115, :163`), `shared/explainer/explainer.css` (`:9-22`), `shared/explainer/explainer.js` (`:154`), `shared/explainer/monitor.svg`; games with countdown timers: `en og et/index.html` (`:1072-1078`), `dansk-praepositioner.html:1196`, `magiske_verber.html:896`, `tidsmaskinen/index.html:816`

**Source QA findings:**  
QA-038 (UI-006), QA-045 (UI-014, VID-011), QA-053 (VID-008), QA-055 (VID-012), QA-056 (VID-013), QA-064 (VIS-012, VIS-014)

**Problem:**  
- **QA-038:** at 1366×768 the monitor (`width:100%; aspect-ratio:48/40`) pushes the controls below the panel (`.xpm-panel` clientH 744 vs scrollH 822/876).
- **QA-045:** at ≤420 px the label is hidden (`modal.css:11`), leaving a bare ▶.
- **QA-053:** countdown timers keep running while the modal is open (en og et: 59 → 54 s in 5 s; code-confirmed in 3 more games).
- **QA-055:** `.catch(function () { state = null; })` fails silently.
- **QA-056:** the rule card is off-centre (16 px left vs 2 px right).
- **QA-064:** the modal uses literal `#F94F37`/`#E1AD12` and a navy dark palette (`#1B1D2B`) instead of `--sd-*` tokens; 3px frames; ease timing; mixed-case labels; monitor art pixels about 13–15 CSS px.

**User story:**  
As a `learner`,  
I want `the explainer to fit my screen, be recognisable on mobile, not cost me time, and match the game's look`,  
so that `asking for help is painless`.

**Expected behavior:**  
- Controls are visible at 1366×768.
- There is a short visible label at ≤420 px ("HJÆLP" or "?").
- Game timers pause while the modal is open.
- A Danish error message shows if loading fails.
- The rule card is centred.
- The modal uses game tokens.

**Acceptance criteria:**

- [ ] The monitor is capped by height (e.g. `width:min(100%, calc((100dvh - 300px) * 1.2))`). At 1366×768 the controls are inside the panel without scrolling.
- [ ] At 360–420 px the button shows a short Danish label and stays at least 44×44.
- [ ] `modal.js` dispatches `explainer:open` / `explainer:close` events. The 4 countdown games pause and resume their timers on them. The en/et probe shows the timer unchanged over 5 s with the modal open.
- [ ] A load failure shows a Danish message in the modal.
- [ ] The rule card is horizontally centred (margins within 2 px of each other).
- [ ] The modal uses `var(--sd-primary)`, `var(--sd-panel)`, `var(--sd-box)` and `var(--sd-drop)` with fallbacks, plus `steps()` easing and uppercase labels. Optionally redraw `monitor.svg` at 4× resolution.
- [ ] VID harness passes on all 10 games at 360/390/1366/1440.

**Evidence:**  
`scratchpad/qa-ui/shots/tid-d1366-explainer.png`; `scratchpad/qa-video/results.json` (timerProbe); `scratchpad/qa-visual/crops/xp-konjunktioner-*.png`.

**Dependencies:**  
None, although the explainer is shared by 10 games. `SKILL.md:49` documents "does not pause game timers", so update the skill doc too.

**Implementation notes:**  
`shared/explainer/*` isn't in CLAUDE.md's frozen list. If the owner considers it part of the design system, get approval first.

**Validation:**  
VID harness; UI `modals.mjs`.

**Status:** VERIFIED

---

## US-037 — Layout polish: 360 px overflow, hyphenation, SPIL above the fold, confetti, mobile filter

**Priority:** P3

**Severity source:** Minor

**Area:**  
Mobile / UI

**Affected games/pages:**  
- `shared/themes/dansk-mester.css:137` (+ the badges screen)
- `shared/themes/praepositioner.css:45`, `ordstilling.css:36`, `magiske-verber.css:95`, `antonyms.css:31`
- `boejningsvaerkstedet/index.html:382`, `pronomenmysteriet/index.html`
- the results screens of Idiomjæger, Antonymer, Pronomenmysteriet and Tidsmaskinen (`Sjovt.fx.celebrate` callers)
- `danish_flashcards/…/index.html` + `themes/flashcards.css`

**Source QA findings:**  
QA-039 (UI-007, VIS-024), QA-040 (UI-008), QA-041 (UI-009), QA-043 (UI-012), QA-044 (UI-013)

**Problem:**  
- **QA-039:** at 360 px "INTERVALREPETITION" is 190 px wide in a smaller card, giving 1 px of horizontal scroll (scrollWidth 361). This breaks the PRD "360 px, no h-scroll" rule. Dansk Mester badge labels also overflow their tiles.
- **QA-040:** headings break mid-word with no hyphen ("PRÆPOSITIONSME|STER", "ORDSTILLINGSDETEKT|IVEN", "MODSA|T", "FØRNUTIDSBYGGERE|N").
- **QA-041:** SPIL is below the fold (Bøjningsværkstedet top 1001–1065 at d1366; Pronomenmysteriet 753–817).
- **QA-043:** confetti draws over the results numbers.
- **QA-044:** the Glosekort filter is at y=1121 on mobile, below the card.

**User story:**  
As a `learner on a small phone`,  
I want `layouts that fit and read cleanly`,  
so that `I can start and finish rounds comfortably`.

**Expected behavior:**  
No h-scroll at 360. Headings wrap at compound boundaries. SPIL is visible without scrolling, or sticky. Confetti stays off the text. The mobile filter is reachable above the card.

**Acceptance criteria:**

- [ ] At 360×740, Dansk Mester `scrollWidth === clientWidth`; mode and badge labels fit (`clamp()` font size or `&shy;`).
- [ ] Listed headings break only at `&shy;` compound points, or fit via `clamp()`.
- [ ] Bøjningsværkstedet and Pronomenmysteriet: SPIL is visible at 1366×768 and 390×844 on load (moved above the mode list, or a sticky bottom bar).
- [ ] Confetti spawns behind the results text (z-index) or only from the trophy area.
- [ ] Glosekort shows a compact level-chip row above the card at ≤480 px.

**Evidence:**  
`scratchpad/qa-ui/shots/phraser-m360-modes.png`, `mont/s360a.png`, `shots/boejning-d1366-start.png`, `shots/idiom-m390-end.png`, `shots/flash-m390-start.png`.

**Dependencies:**  
None. If confetti layering requires changing `Sjovt.fx.celebrate` in `shared/sjovt.js`, **owner approval** is needed; otherwise adjust z-index in the theme CSS.

**Implementation notes:**  
—

**Validation:**  
`scratchpad/qa-ui/survey.mjs` and `phr360.mjs` re-run; smoke.

**Status:** VERIFIED

---

## US-038 — Sprite and icon system polish (density, semantics, identity sprites)

**Priority:** P3

**Severity source:** Minor

**Area:**  
Visual

**Affected games/pages:**  
`shared/sjovt.js` (`:27-126` 16px set, `:128-601` 32px set, `:619` half scale); mode menus in Magiske Verber (`:723, :735`), Idiomjæger, Præpositioner (`MODE_SPR` `:837`), Antonymer, Dansk Mester; `tidsmaskinen/index.html:158, 164`; `boejningsvaerkstedet/index.html` header; Dansk Mester header

**Source QA findings:**  
QA-060 (VIS-004, downgraded), QA-061 (VIS-005), QA-062 (VIS-006, VIS-021, VIS matrix)

**Problem:**  
- **QA-060:** 16px flat sprites (4px pixels, no ramp) sit next to 32px shaded icons (2px pixels) on the same row.
- **QA-061:** hat, molle, snegl, pokal and flag mean different things in different games.
- **QA-062:** Tidsmaskinen's header uses `ur` (Adverbier's icon) instead of `tidsstjerne`; Bøjningsværkstedet's header uses `molle` while its panel and portal card use `tandhjul`, and the title is duplicated; Dansk Mester's header uses `flag` while its card uses `snak`.

**User story:**  
As a `learner`,  
I want `icons that look like one family and mean the same thing everywhere`,  
so that `I can read the menus at a glance`.

**Expected behavior:**  
One density per context, a small semantic icon map, and identity sprites that match the portal.

**Acceptance criteria:**

- [ ] Tidsmaskinen header slots use `data-sd-sprite="tidsstjerne"`. Bøjningsværkstedet keeps one title, with `tandhjul`. The Dansk Mester header uses `snak` (or the owner chooses).
- [ ] No mode row mixes 16px and 32px sprites at different pixel densities (either redraw the 9 generic sprites at 32px, or render them consistently).
- [ ] A semantic map (quiz, typing, pairs, speed, review, translation, error-hunt, stats) is documented and applied to all mode menus.

**Evidence:**  
`scratchpad/qa-visual/crops/antonym-icons.png`, `tids-desktop-light-start.png`, `boejn-desktop-light-start.png`.

**Dependencies:**  
**Owner approval** (frozen `shared/sjovt.js`) for redrawn sprites. The identity-sprite attribute changes (QA-062) are game-file only and can go first.

**Implementation notes:**  
Split into "identity sprites" (quick) and "redraw generic set" (art task).

**Validation:**  
Screenshots of mode menus and headers.

**Owner decisions (2026-10-05):** #32-34 in `stories/DECISIONS.md`: frozen `sjovt.js` approved for this story; redraw the 9 generic sprites at 32 px; add ~3-4 new sprites for one-meaning icons; agents judge the art.

**Status:** IMPLEMENTED BUT NOT VERIFIED (partial; remainder READY FOR DEVELOPMENT)

---

## US-039 — Shared chrome and component polish

**Priority:** P3

**Severity source:** Minor

**Area:**  
Visual / Cross-game

**Affected games/pages:**  
`shared/sjovt.css` (`:16-27` unicode-range, `:115-121` grid), `shared/sjovt.js` (`:770` bar height); Portal `index.html` (`:67-68`, `:221`); result renderers (`konjunktioner.html:929`, `Forbindenor.html:816`, `en og et/index.html:1359`, `idiomjaeger.html:862`, template `renderSummary`); gap placeholders (Forbindeord, Konjunktioner, Tidsmaskinen, Bøjningsværkstedet); level badges (Ordstillingsdetektiven, Konjunktioner); dark surfaces (Magiske Verber, Præpositioner, Dansk Mester, Glosekort); native selects (Idiomjæger, Præpositioner, Konjunktioner, Dansk Mester); `idiomjaeger.html:857`

**Source QA findings:**  
QA-063 (VIS-008), QA-065 (VIS-013), QA-066 (VIS-015, VIS-016), QA-067 (VIS-017), QA-068 (VIS-018), QA-069 (VIS-019), QA-070 (VIS-020), QA-071 (VIS-022), QA-072 (VIS-023), QA-073 (VIS-025)

**Problem:**  
- **QA-063:** ← ▶ ▼ ⟵ ⟶ render in system fallback fonts (Cascadia Mono, Cambria Math).
- **QA-065:** the back control uses 4 glyphs and 7 wordings.
- **QA-066:** the portal SEO panel has a 12px radius; the portal theme button has no ink frame.
- **QA-067:** 5 different results-screen patterns.
- **QA-068:** 3 different gap placeholders.
- **QA-069:** green and red reused for CEFR levels and categories.
- **QA-070:** some games keep light surfaces in dark mode.
- **QA-071:** the grid stops about 48 px short; the bar is 56px vs `--sd-bar-h` 48px.
- **QA-072:** OS select chevrons.
- **QA-073:** inline 48px TTS boxes break the line rhythm in Idiomjæger explanations.

**User story:**  
As a `learner`,  
I want `shared UI parts to look and behave the same in every game`,  
so that `the product feels polished and predictable`.

**Expected behavior:**  
- Pixel arrows (or extended glyph coverage).
- One back pattern ("← TILBAGE"; ✕ only to quit a round).
- `sd-panel` and framed buttons on the portal.
- A shared results card and a shared `.sd-gap`.
- Neutral level badges.
- One dark-surface rule.
- Grid to the bottom, with the bar-height token correct.
- Pixel select chevron.
- A 32px inline TTS variant.

**Acceptance criteria:**

- [ ] The CDP platform-font check shows no system fallback for the bar arrow, the explainer ▶ or the portal ▼.
- [ ] Every in-game back control uses one glyph and one wording.
- [ ] The portal has no `border-radius` (audit radius count 0). The theme button has an ink frame.
- [ ] Results screens share one component (pokal/stjerne, score and accuracy, optional mistakes, "SPIL IGEN" / "TIL MENUEN").
- [ ] A single `.sd-gap` style is used in the 4 games.
- [ ] Level badges use `.sd-badge`; green and red are reserved for feedback.
- [ ] One documented dark-surface rule is applied to the 4 outlier games.
- [ ] The grid covers the viewport bottom; `--sd-bar-h` equals the rendered bar height.
- [ ] Selects use `appearance:none` with a pixel chevron.
- [ ] Idiomjæger inline TTS uses the small variant.

**Evidence:**  
`scratchpad/qa-visual/summary.txt`, `crops/bar.png`, `crops/portal-seo.png`, `crops/portal-theme.png`, `sheet-results.png`, `sheet-mobile-dark-start.png`.

**Dependencies:**  
**Owner approval** for `shared/sjovt.css`, `shared/sjovt.js` and `index.html` (frozen). The game-file parts (gap, badges, selects, Idiomjæger inline TTS, dark surfaces in theme files) can proceed independently.

**Implementation notes:**  
Split into "frozen shared" and "per-game theme" PRs.

**Validation:**  
VIS `audit.cjs` re-run; screenshots.

**Owner decisions (2026-10-05):** #35-37 in `stories/DECISIONS.md`: frozen `sjovt.css`/`sjovt.js`/`index.html` approved for this story; pixel-art arrow sprites; results = shared CSS classes only (the "one component" criterion is narrowed to shared styles).

**Status:** IMPLEMENTED BUT NOT VERIFIED (partial; remainder READY FOR DEVELOPMENT)

---

## US-040 — Theme and sound controls: persist the portal theme and unify placement

**Priority:** P3

**Severity source:** Minor

**Area:**  
Cross-game / UI

**Affected games/pages:**  
`index.html` (`themeBtn` `:299-308`), `shared/sjovt.js` (bar), `adverbs.html` (`#darkToggle`), Bøjningsværkstedet / Pronomenmysteriet / Tidsmaskinen (LYD/MØRK), `danish-antonyms-game.html` (`#setSound` `:417, :833`)

**Source QA findings:**  
QA-029 (GAME-030, VIS-011 downgraded, UI-017 resolved). Residual: U-06.

**Problem:**  
- The portal theme toggle sets `data-theme` only and is lost on reload, although the comment says "choice kept for the session".
- Games ignore the portal choice.
- The theme toggle exists in 4 games with different labels.
- A mute control exists only in the 3 DanskCore games (which are the only ones with sound effects) and in the Antonymer settings, where it gates TTS.

Once US-026 adds sounds to legacy games, they will need a mute.

**User story:**  
As a `learner`,  
I want `my dark-mode and sound choices to be remembered and found in the same place in every game`,  
so that `I set them once`.

**Expected behavior:**  
Theme and mute toggles sit in the shared `.sd-bar`, stored in one key (`sd:theme`, `dc:sound-enabled`) and applied before first paint. Per-game duplicates are removed.

**Acceptance criteria:**

- [ ] The portal theme persists across reload (sessionStorage or localStorage in try/catch), or the comment is corrected if the owner prefers OS-only.
- [ ] If the shared bar approach is approved: theme and mute toggles appear in the bar on every page; the per-game toggles are removed; the choice carries from portal to game.
- [ ] Every game that plays sound effects after US-026 has a reachable mute.
- [ ] U-06: verify (with a `speechSynthesis.speak` spy) that no game auto-plays TTS without a user gesture. If one does, it respects mute.

**Evidence:**  
`index.html:305-307`; `scratchpad/qa-visual/summary.txt` ("comps theme= mute="); resolution R-1 in the final report.

**Dependencies:**  
**Owner approval** (frozen `index.html`, `shared/sjovt.js`); US-026.

**Implementation notes:**  
`DanskCore.ui` already has `darkMode` and `sound` with `dc:sound-enabled`.

**Validation:**  
Reload test; cross-page test; smoke.

**Owner decisions (2026-10-05):** #23-26 in `stories/DECISIONS.md`: frozen `index.html` + `shared/sjovt.js` approved for this story; OS default + saved `sd:theme` override; mute = sound effects only; per-game toggles removed in favour of the bar.

**Status:** READY FOR DEVELOPMENT

---

## US-041 — Cancel pending timers when leaving a round

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay

**Affected games/pages:**  
`danish-antonyms-game.html` (`:1301`), `boejningsvaerkstedet/index.html` (`showStart`; timers at `:795, :896, :999, :1089, :1185`), `danske-phraser/dansk-mester.html` (`:952`, `:1020`)

**Source QA findings:**  
QA-019 (GAME-018, GAME-020, GAME-026)

**Problem:**  
- **Antonymer:** after the speed round ends, a pending timeout draws a question into the hidden screen.
- **Bøjningsværkstedet:** Escape during the 800 ms advance leaves the round running; number keys on the start screen then answer an invisible item and write progress (saved count went 1 → 2).
- **Dansk Mester:** "‹ Afslut" within 750 ms of an answer throws "Cannot set properties of null (setting 'innerHTML')", which breaks the zero-console-errors rule.

**User story:**  
As a `learner`,  
I want `leaving a round to really stop it`,  
so that `hidden questions don't change my progress`.

**Expected behavior:**  
All advance timeouts are stored and cleared on quit, Escape or end.

**Acceptance criteria:**

- [ ] Each listed timer id is stored and `clearTimeout` is called in quit/showStart/end handlers (pattern: Pronomenmysteriet and Tidsmaskinen).
- [ ] Repro scripts: no hidden render, no progress write after Escape, and no pageerror on a quick Afslut.

**Evidence:**  
`qa/gameplay-review.md` GAME-018/020/026.

**Dependencies:**  
None.

**Implementation notes:**  
—

**Validation:**  
Repro scripts; smoke.

**Status:** VERIFIED

---

## US-042 — Bring just-missed items back first in the next round

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay

**Affected games/pages:**  
`boejningsvaerkstedet/index.html` (`:595`), `pronomenmysteriet/index.html`

**Source QA findings:**  
QA-028 (GAME-038)

**Problem:**  
Unseen items count as due and outnumber missed ones, so an item you just missed doesn't come back first in the next round. The spec test failed this in 2 Pronomenmysteriet modes. Tidsmaskinen does it correctly.

**User story:**  
As a `learner`,  
I want `my mistakes to come back soon`,  
so that `I fix them while they are fresh`.

**Expected behavior:**  
Items missed in the last round are queued before unseen items, as in Tidsmaskinen.

**Acceptance criteria:**

- [ ] Queue order: missed in the last round, then due, then unseen.
- [ ] `tests/pronomenmysteriet.mjs` resurfacing checks pass.
- [ ] SRS keys are unchanged.

**Evidence:**  
`qa/gameplay-review.md` GAME-038.

**Dependencies:**  
US-001 (Pronomenmysteriet needs real data to test).

**Implementation notes:**  
Port the Tidsmaskinen queue logic.

**Validation:**  
`node tests/pronomenmysteriet.mjs`; a scripted Bøjningsværkstedet round.

**Status:** VERIFIED

---

## US-043 — Glosekort polish: no stuck card after filter change; keyboard-operable list; no double-click skip

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay

**Affected games/pages:**  
`danish_flashcards/danish_flashcards_game/script.js` (`goToNext` `:553`, list `<li>` `:478`, review `:570`)

**Source QA findings:**  
QA-021 (GAME-024), QA-022 (GAME-025)

**Problem:**  
- **QA-021:** answer all 52 A1 cards with the A1 filter on, then switch to "Alle". Both answer buttons are disabled and there is no Next control. Sidebar items are mouse-only `<li>`.
- **QA-022:** a double-click on "Det vidste jeg ikke" within 1.2 s skips a card.

**User story:**  
As a `learner`,  
I want `the deck to always offer a next card and work by keyboard`,  
so that `I never get stuck`.

**Expected behavior:**  
`goToNext` skips answered cards. List items are buttons. Double-clicks are ignored during the transition.

**Acceptance criteria:**

- [ ] The repro no longer gets stuck: it moves to the next unanswered card or shows the done panel.
- [ ] List items are `<button>`s, reachable with Tab and Enter.
- [ ] A second click within the advance window is ignored.

**Evidence:**  
`scratchpad/qa-gameplay/shots/C_flash_filter_stuck.png`.

**Dependencies:**  
US-011 (same file).

**Implementation notes:**  
—

**Validation:**  
Repro script; smoke.

**Status:** VERIFIED

---

## US-044 — Præpositioner polish: Lynrunde XP and minor language

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay / Language

**Affected games/pages:**  
`dansk-praepositioner.html` (`:1223`; data `:343, 365, 378, 391, 440, 446, 584, 617`)

**Source QA findings:**  
QA-017 (GAME-013), QA-107 (LANG-044)

**Problem:**  
- **QA-017:** Lynrunde gives `prog.xp += 5` on top of the +10 in `record()`, so 15 XP per hit.
- **QA-107:**
  - "I tjeneste af nogen" → "i nogens tjeneste"
  - "Indvendigt i lukkede rum" → "Inde i…"
  - "bolig-udtryk" → "boligudtryk"
  - "Du arbejder for meget" (here *for* is a degree adverb)
  - "Læg pengene på bankbogen" is dated
  - UNCONFIRMED colloquial variants marked wrong ("cykler på arbejde", "arbejder i Netto", "en tid til lægen")

  The "Multiple choice" badge is in US-028.

**User story:**  
As a `learner`,  
I want `fair XP and natural Danish notes`,  
so that `stats and explanations are trustworthy`.

**Expected behavior:**  
10 XP per hit, or a documented speed bonus. Corrected wording.

**Acceptance criteria:**

- [ ] The XP rule is decided by the owner and implemented consistently.
- [ ] Listed wording is fixed. The UNCONFIRMED variants change only after native confirmation.

**Evidence:**  
`qa/gameplay-review.md` GAME-013; `qa/language-review.md` LANG-044.

**Dependencies:**  
US-019 (same file).

**Implementation notes:**  
—

**Validation:**  
Smoke.

**Status:** VERIFIED

---

## US-045 — Antonymer polish: Find-par feedback and minor language

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay / Language

**Affected games/pages:**  
`danish-antonyms-game.html` (`:1240`; data per LANG-048)

**Source QA findings:**  
QA-018 (GAME-016), QA-111 (LANG-048)

**Problem:**  
- **QA-018:** a wrong match in "Find par" only flashes red. It shows no correct partner, note or TTS, and records the miss against the wrong pair.
- **QA-111:**
  - Unnatural examples: "Skolen ligger nær.", "Det er lys dag", "modvillig til at hjælpe", "Bilen er accelererende", "et prompte svar".
  - The page says B1–B2, but it contains C1/technical items (proksimal/distal, sækkelærred).

  English "Check"/"Pronounce" are in US-028; duplicate pairs are in US-020.

**User story:**  
As a `learner`,  
I want `pair mistakes explained and natural examples`,  
so that `I learn from errors`.

**Expected behavior:**  
A wrong pair shows the correct partner, a note and TTS, and the miss is recorded on the right item.

**Acceptance criteria:**

- [ ] Find par shows the correct partner and a TTS replay after a miss, and attributes the miss to the tapped word's pair.
- [ ] Listed examples are rewritten. Item levels are re-tagged or the page label adjusted.

**Evidence:**  
Line refs in the worker reports.

**Dependencies:**  
US-020.

**Implementation notes:**  
—

**Validation:**  
Smoke.

**Status:** VERIFIED

---

## US-046 — Dansk Mester polish: TTS on EN→DA items, match feedback, minor language

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay / Language

**Affected games/pages:**  
`danske-phraser/dansk-mester.html` (`:968`, the match mode; data `:346, 398, 464, 489`)

**Source QA findings:**  
QA-023 (GAME-027 part), QA-115 (LANG-052)

**Problem:**  
- **QA-023:** English→Danish items have no TTS button, even after a wrong answer. A wrong match shows no correct answer.
- **QA-115:**
  - "dobbelt benægtelse" → "underdrivelse"
  - "Velbekomme" is described as said before the meal
  - "tre småord" (finde is a verb)
  - af sted/afsted used inconsistently
  - levels: 53 of 150 items are B1+ on an A1–A2 page

  "Continue ▸" is in US-028.

**User story:**  
As a `learner`,  
I want `to hear the Danish answer in every direction and see corrections`,  
so that `I learn pronunciation and usage`.

**Expected behavior:**  
TTS on the Danish answer in EN→DA items. A wrong match shows the correct pairing. Notes are corrected.

**Acceptance criteria:**

- [ ] EN→DA items show a TTS button for the Danish answer in feedback.
- [ ] A wrong match reveals the correct pair.
- [ ] Listed notes are fixed. Spelling is consistent. The level label is aligned.

**Evidence:**  
Worker line refs.

**Dependencies:**  
US-021.

**Implementation notes:**  
—

**Validation:**  
Smoke.

**Status:** VERIFIED

---

## US-047 — En/Et polish: number keys in word-pair choice, minor language

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay / Language

**Affected games/pages:**  
`en og et/index.html` (word-pair choice; data `:493, 581-584, 777, 802, 819-820, 833-859, 1141, 1207`)

**Source QA findings:**  
QA-024 (GAME-029 part), QA-127 (LANG-070)

**Problem:**  
- **QA-024:** number keys don't select options in the word-pair multiple-choice style.
- **QA-127:**
  - Notes teach "en mælk", "et sukker", "et salt" as forms to learn.
  - The `and` note contradicts itself.
  - "Jeg læser ___ om dagen" is glossed "during the day".
  - Stray space before punctuation ("låne ___ ?").
  - Wrong synonym pairs: kedelig/træls, sjældent/fåtalligt, penge/mønt, vej/gade.
  - English translations shown in feedback (see US-027 scope).

**User story:**  
As a `learner`,  
I want `keyboard shortcuts everywhere and correct notes`,  
so that `play is smooth and accurate`.

**Expected behavior:**  
Keys 1–n select options in all multiple-choice styles. Notes are corrected.

**Acceptance criteria:**

- [ ] Number keys work in the word-pair multiple-choice style.
- [ ] Listed notes, glosses and pairs are corrected. Stray spaces are removed.

**Evidence:**  
Worker line refs.

**Dependencies:**  
US-024.

**Implementation notes:**  
—

**Validation:**  
Smoke; keyboard test.

**Status:** VERIFIED

---

## US-048 — Forbindeord polish: resume mid-run, minor language

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay / Language

**Affected games/pages:**  
`forbindenor/Forbindenor.html` (state `:703-705`; data `:314, 316, 405-407, 430-448, 602`)

**Source QA findings:**  
QA-026 (GAME-034 part), QA-118 (LANG-056)

**Problem:**  
- **QA-026:** a reload mid-run restarts at 1/359.
- **QA-118:**
  - The note "Står ordet først… verbet før grundleddet" is attached to "så" items with no inversion.
  - Category placement: både/begge/alle under "Sammenligning"; omsider under "Holdning".
  - "For det andet" appears without "for det første".
  - Levels clash with Konjunktioner (eftersom C1 vs B2).

  "+1 ENERGY" and the English labels are in US-028.

**User story:**  
As a `learner`,  
I want `to resume where I left off and read accurate notes`,  
so that `long runs aren't lost`.

**Expected behavior:**  
Run position (index, order, lives, score) persists across reload (guarded storage). Notes are corrected.

**Acceptance criteria:**

- [ ] Reload mid-run resumes at the same item with the same lives and score.
- [ ] Listed notes and categories are corrected. Levels are aligned with Konjunktioner (owner decides the source of truth).

**Evidence:**  
Worker refs.

**Dependencies:**  
US-002 and US-022 (same file).

**Implementation notes:**  
Add a new key for the run state. Don't change `LS_KEY`.

**Validation:**  
Reload test; smoke.

**Status:** VERIFIED

---

## US-049 — Konjunktioner polish: Enter in review, minor language

**Priority:** P3

**Severity source:** Minor

**Area:**  
Gameplay / Language

**Affected games/pages:**  
`konjunktioner/konjunktioner.html` (key handler `:980`; rules `:318-322`; data `:359, 557, 601-614`)

**Source QA findings:**  
QA-027 (GAME-035), QA-121 (LANG-059)

**Problem:**  
- **QA-027:** Enter stops working in review after game over, because the handler requires `lives > 0`.
- **QA-121:**
  - The rule "Ordstilling efter: SVA" for og/men/eller/så vs the inverted item `:359`.
  - Commas before *end* + noun phrase.
  - "smagte præcis, ligesom da…" has the comma in the wrong place.
  - "siden nytår" is presented as a conjunction.

**User story:**  
As a `keyboard learner`,  
I want `Enter to work in review`,  
so that `I can review my mistakes without the mouse`.

**Expected behavior:**  
Enter advances in review and on the "review finished" screen. The rules and punctuation are fixed.

**Acceptance criteria:**

- [ ] The key handler allows Enter while reviewing.
- [ ] Listed rule wording, punctuation and the "siden nytår" item are corrected ("hovedsætningsordstilling (V2)").

**Evidence:**  
Worker refs.

**Dependencies:**  
US-022.

**Implementation notes:**  
—

**Validation:**  
Keyboard test; smoke.

**Status:** VERIFIED

---

## US-050 — Language polish: Tidsmaskinen, Bøjningsværkstedet, Magiske Verber, Idiomjæger, Ordstillingsdetektiven, Portal

**Priority:** P3

**Severity source:** Minor

**Area:**  
Language

**Affected games/pages:**  
`tidsmaskinen/data.js`, `boejningsvaerkstedet/data.js`, `shared/data/nouns.js`, `shared/data/adjectives.js`, `magiske_verber.html`, `idiomjaeger.html`, `ordstilling-detektiv/index.html`, `index.html`

**Source QA findings:**  
QA-016 (GAME-010, LANG-040 part), QA-079 (LANG-009–012), QA-089 (LANG-021, 025, 026), QA-093 (LANG-031), QA-103 (LANG-040), QA-124 (LANG-062), QA-128 (LANG-071)

**Problem:**  

**Tidsmaskinen (QA-079):**
- Invented distractor forms: "har vokset", "er boet", "forberedede"…
- Gender and countability: "en 12-tal" → "et 12-tal"; "en billetsalg" → "et billetsalg"; "Alle bagagerne" → "Al bagagen".
- Calques: "til Island indtil nu"; "Vi har aldrig haft en kat indtil nu" ×10; "missede"; "Den gang"; "I sommeren fandt hun"…
- Context and sentence disagree: "ringede én gang" vs "to/tre gange"; Vi/De.
- Note "Skal ikke udtrykker et forbud" (should be "må ikke").
- Six duplicates across modes.
- Lines: `data.js:3106…22951, 12216, 20383, 21086, 3787, 3810, 12451…`

**Bøjningsværkstedet and shared nouns/adjectives (QA-089):**
- dårlig is keyed only as værre/værst; dårligere/dårligst is rejected.
- 10 `verify:true` nouns are served (frygt, sol doubtful; høne UNCONFIRMED).
- The blå/grå note contradicts itself.
- "roligere → roligst" under the label "-ere/-est".
- Implausible pairs: en dyr park, en god kirke, en sjov ulv.
- "Tak for ___ hjælp" with key `meget`.
- Undisplayed notes: lille, spændende.
- Typo `nouns.js:77` "æg →ægget".
- penge note (UNCONFIRMED).

**Magiske Verber (QA-093):**
- "flytter sætningen til I GÅR" → "til fortiden"
- "Til timen" → "I timen"
- "Verbalarenaen" → "Verbumarenaen"
- "kort tillægsform" (UNCONFIRMED)
- "Nem" labelled A1 on an A2–B1 page
- Lines: `:638, 521, 550, 725, 661, 737`

**Idiomjæger (QA-103 + QA-016):**
- "Smide penge ud af vinduet" → "ud ad vinduet"
- "Mine advarsler talte for døve øren" → "Jeg talte for døve øren"
- "Lægge ordene i munden på nogen" → "lægge nogen ord i munden"
- "Have en finger på pulsen" → "have fingeren på pulsen"
- "Til mødet" → "På mødet"
- "Native-niveau" → "Modersmålsniveau"
- UNCONFIRMED: "Stå last og brast", "Gå under radaren"…
- "Fuldfør udtrykket": the regex `kaffe\s*$` fails on "Tak for kaffe!" (`:1049`)

**Ordstillingsdetektiven (QA-124):**
- "udfylder hele sætningen forreste plads" → "hele bisætningen"
- "Næste uge starter jeg" → "I næste uge"
- "email" → "e-mail"
- Lines: `:668, 425, 379, 619`

**Portal (QA-128):**
- "gratis online spil … dansk undervisning … A1–B2 niveau" → "onlinespil", "danskundervisning", "A1–B2-niveau"
- og:description uses "verbum" → "verber"
- Card level labels don't match the games (Konjunktion Crush B1, Ordstillingsdetektiven B1–B2, Forbindeord B1)
- `index.html:222`

**User story:**  
As a `learner`,  
I want `small wording errors cleaned up`,  
so that `every Danish text I read is correct`.

**Expected behavior:**  
The corrections listed above are applied.

**Acceptance criteria:**

- [ ] Each listed correction is applied, per game, in separate PRs.
- [ ] UNCONFIRMED sub-items change only after native confirmation.
- [ ] The Idiomjæger completion regex allows trailing punctuation (`kaffe[\s!?.]*$`), and "Tak for kaffe!" is blanked.
- [ ] Bøjningsværkstedet filters out `verify:true` nouns from Mode 1, or a native speaker resolves them.
- [ ] Portal text and level labels are corrected. This needs **owner approval** (frozen `index.html`).
- [ ] `node shared/validate.js` gives 0 errors; smoke per game.

**Evidence:**  
`qa/language-review.md` sections per ID.

**Dependencies:**  
US-014, US-015, US-016, US-018 and US-023 (same files; Majors first); owner approval for `index.html`; native-speaker sign-off.

**Implementation notes:**  
Split into one PR per game.

**Validation:**  
Per-game smoke; validate.js.

**Owner decisions (2026-10-05):** #38-40 in `stories/DECISIONS.md`: frozen `index.html` approved for the portal slice; card levels show the full item range (Konjunktion Crush A1–B2, Ordstillingsdetektiven A1–B2, Forbindeord A1–C1); no extra native review for the portal wording.

**Status:** VERIFIED (partial; portal slice READY FOR DEVELOPMENT)

---

## US-051 — Latent data cleanup: verbs.js, pronouns.js, clause-patterns.js, Sætningsmaskinen

**Priority:** P3

**Severity source:** Minor

**Area:**  
Language (latent data)

**Affected games/pages:**  
`shared/data/verbs.js` (`:105, 123, 142, 160, 224, 246, 266`), `shared/data/pronouns.js` (`:32, 33, 36, 61-62, 65, 71`), `shared/data/clause-patterns.js` (`:25, 27, 30, 88`), `saetningsmaskinen/data.js`

**Source QA findings:**  
QA-090 (LANG-027, 028, 065, 066), QA-125 (LANG-063, 064)

**Problem:**  
None of this is loaded by a shipped page: grep shows no game uses `DANSK_VERBS` or `DANSK_PRONOUNS`, and Sætningsmaskinen has no `index.html`. It will surface as soon as a game uses it.

**verbs.js:**
- The weak builder gives "forberedede/forberedet" (should be forberedte/forberedt) and "gentagede" (should be gentog/gentaget).
- UNCONFIRMED: `ride` with aux `er`; "lignes"; imperatives "hed"/"vid"; `bestå` passive null.

**pronouns.js:**
- `intet` note "Negerer utælleligt ental…" is wrong; it should be "Intetkønsformen af ingen (intet hus)".
- "reflexive" → "refleksiv".
- nogen/nogle notes are too absolute.
- *hverken* is listed as a pronoun.

**clause-patterns.js:**
- "mens hun ikke laver aftensmad" (*mens* doesn't fit).
- "Presentationelt" → "Præsentationelt".

**saetningsmaskinen/data.js:**
- About 920 of 1,020 items are `Array(N).fill(null).map(...)` clones ("han kommer ikke i dag" ×100, "___ regner." ×150), and a "// Continue to reach 140" comment remains.
- Wrong keys:
  - "Han ville vide, ___ jeg ringede ikke." (should be "hvorfor jeg ikke ringede", `:147`)
  - "En bog, hvilket jeg læste, var interessant." (should be "som", `:171`)
- Frames repeat words: "hvornår toget toget går", "Manden, der der står".
- "Det snør/snér" → "sner".
- Wrong notes.
- "modalsverbet" → "modalverbet".

**User story:**  
As a `developer building the next game`,  
I want `the shared and pending datasets to be correct before they are used`,  
so that `new games don't ship old errors`.

**Expected behavior:**  
Correct reference data, and real Sætningsmaskinen items before `saetning-game-*` starts.

**Acceptance criteria:**

- [ ] `forberede` moves to the -te class. `gentage` becomes a manual strong entry (gentager, gentog, gentaget, gentag, har, gentages).
- [ ] The `intet` note and the other pronoun and clause-pattern wording are fixed.
- [ ] Sætningsmaskinen: the clone generators are removed, real items are authored to the `specs.md` counts, and the listed wrong keys and frames are fixed. A placeholder/duplicate guard (as in US-001) is added.
- [ ] `node shared/validate.js` gives 0 errors.
- [ ] Native-speaker sign-off.

**Evidence:**  
`qa/language-review.md` LANG-027/028/063/064/065/066.

**Dependencies:**  
Native-speaker sign-off. This is a prerequisite for the `saetning-game-1/2` tasks in `PROGRESS.md`.

**Implementation notes:**  
`shared/data/*.js` changes can alter item counts in games that derive from them. Run validate.js and the Bøjningsværkstedet item dump.

**Validation:**  
`node shared/validate.js`; a duplicate scan on Sætningsmaskinen.

**Status:** VERIFIED (partial; authoring to the target size BLOCKED)

---

## US-052 — pixel-animation.html: remove from the deploy set or reskin it

**Priority:** P3

**Severity source:** Minor

**Area:**  
UI / Visual

**Affected games/pages:**  
`pixel-animation.html`

**Source QA findings:**  
QA-030 (GAME-039, UI-016, VIS-026, LANG-072 title part)

**Problem:**  
A standalone demo:
- no `← MENU` bar, no link back, nothing focusable
- not linked from the portal or the sitemap
- its own purple palette and Consolas font
- English title "Pixel Animation"

**User story:**  
As a `visitor who lands on this page`,  
I want `either a way back or for the page not to be published`,  
so that `I'm not stranded`.

**Expected behavior:**  
The owner decides: (a) move it out of the published root, or (b) load `sjovt.css`/`sjovt.js`, map the palette to tokens, and give it a Danish title.

**Acceptance criteria:**

- [ ] The owner records the decision.
- [ ] (a) The file is removed from the site root and from any deploy list, or (b) the page has the MENU bar, a Danish `<title>`, at least one focusable control, and passes smoke.

**Evidence:**  
`scratchpad/qa-ui/shots/pixel-m390-start.png`, `scratchpad/qa-visual/pixel-desktop-light-start.png`.

**Dependencies:**  
Owner decision.

**Implementation notes:**  
—

**Validation:**  
Smoke (if kept).

**Owner decision (2026-10-05):** #27 in `stories/DECISIONS.md`: option (a). Done: `git mv pixel-animation.html docs/redesign/pixel-animation.html` (standalone file, no external references; not in the portal, sitemap or any deploy list).

**Status:** IMPLEMENTED

---

## US-053 — Refresh design docs to match the shipped system

**Priority:** P3

**Severity source:** Minor

**Area:**  
Cross-game (docs)

**Affected games/pages:**  
`docs/redesign/AGENT-BRIEF.md` (`:8-11`), `docs/redesign/TEST-REPORT.md` (`:10`), `shared/explainer/modal.css` (`:6, :21, :23` "Pixelify Sans" fallbacks), `CLAUDE.md` ("Known data issue" note)

**Source QA findings:**  
QA-074 (VIS-027, LANG-013)

**Problem:**  
- The brief and test report describe Pixelify Sans, a mustard field and orange primary buttons. The shipped system uses JetBrains Mono ("SD Mono") with per-game `--game` colours, and no Pixelify font exists in `shared/fonts/`.
- `modal.css` still lists Pixelify Sans as a fallback.
- CLAUDE.md says `lærer` generates "lærerene", but the builder now returns "lærerne" (`shared/data/nouns.js:25, :258`).

**User story:**  
As a `contributor or coding agent`,  
I want `docs that describe the real design system and data state`,  
so that `I don't reintroduce a font that doesn't exist or chase a fixed bug`.

**Expected behavior:**  
The docs reflect the per-game colour contract, the real font stack and the current data state.

**Acceptance criteria:**

- [ ] `AGENT-BRIEF.md` and `TEST-REPORT.md` are updated (owner approval: design brief).
- [ ] The "Pixelify Sans" fallbacks are removed from `modal.css`.
- [ ] The stale `lærerene` note is removed from CLAUDE.md (CLAUDE.md is currently untracked and user-owned, so confirm with the owner).

**Evidence:**  
`shared/fonts/` listing; `sjovt.css:63-65`; `nouns.js:25, :258`.

**Dependencies:**  
Owner approval.

**Implementation notes:**  
Docs only, apart from the CSS fallback line.

**Validation:**  
Review.

**Owner decisions (2026-10-05):** #28-31 in `stories/DECISIONS.md`: rewrite the brief; edit TEST-REPORT in place; fix and commit CLAUDE.md; drop the Pixelify fallbacks.

**Status:** READY FOR DEVELOPMENT

---

## Unconfirmed — needs verification (no stories)

These items are **not confirmed defects**. Confirm them first; if confirmed, handle them in the referenced story.

| ID | Item | Where it would be handled |
|---|---|---|
| U-01 | Tidsmaskinen hearsay skal/skulle: two correct answers and a misleading note (LANG-005) | US-014 (confirm-first criterion) |
| U-02 | Tidsmaskinen "kommer til at" for visible imminence (LANG-007) | US-014 (confirm-first criterion) |
| U-03 | sin-hans scene colours grammatical sentences red (LANG-067) | US-035 (confirm-first criterion) |
| U-04 | Dansk Mester auto-advance; whether the `:1157` headline emoji and Præpositioner `MODES[].e` emoji render (VIS) | US-026 / US-033 |
| U-05 | Audible TTS on real devices; iOS Safari, landscape, 200% zoom, screen readers | Manual device pass before release |
| U-06 | Whether any legacy game auto-plays TTS without a user gesture | US-040 (criterion) |

---

## Recommended Development Order

| Order | Story | Why Now | Dependency | What It Unblocks |
|---|---|---|---|---|
| 1 | US-001 | Linked game teaches nothing; low-effort restore from git | — | US-025 (Pronomenmysteriet scenes), US-035 (sin-hans review), US-042 |
| 2 | US-004 | Systemic crash fix across 3 games; makes Adverbier testable when storage is blocked | — | US-005, US-006, US-007 |
| 3 | US-002 | Critical systemic wrong-answer logic | Native sign-off | US-022, US-048 |
| 4 | US-003 | Critical ungrammatical model answers | Native sign-off | US-014 |
| 5 | US-005 | Adverbier core loop broken | US-004 | US-006, US-007 |
| 6 | US-010 | One-line shuffle; removes a trivially gameable mode | — | US-015 |
| 7 | US-009 | Unanswerable questions | — | US-019 |
| 8 | US-008 | Crash | — | US-018 |
| 9 | US-011 | Silent data loss | — | US-030, US-043 |
| 10 | US-012 | Weak practice never completes in 2 games | — | US-047, US-048 |
| 11 | US-013 | Feedback and grammar notes unseen in 3 games | — | US-031 |
| 12 | US-006 | PRD TTS requirement in Adverbier | US-005 | US-029 |
| 13 | US-015 | Largest Major content batch; shared data affects counts | US-010 | US-050 |
| 14 | US-019 | Correct Danish taught as wrong | US-009 | US-044 |
| 15 | US-014 | Tidsmaskinen Major notes | US-003 | US-050 |
| 16 | US-022 | Forbindeord and Konjunktioner content | US-002 | US-048, US-049 |
| 17 | US-007 | Adverbier content and notes | US-005 | US-027 |
| 18 | US-020 | Antonymer content | — | US-045 |
| 19 | US-016 | Magiske Verber content | — | US-050 |
| 20 | US-018 | Idiomjæger content | US-008 (same file) | US-027 |
| 21 | US-021 | Dansk Mester content | — | US-046 |
| 22 | US-023 | Ordstillingsdetektiven tips and orders | — | US-050 |
| 23 | US-017 | Glosekort data | — | — |
| 24 | US-024 | En/Et note | — | US-047 |
| 25 | US-025 | Missing explanations (P1) | US-001 | US-035 |
| 26 | US-026 | Systemic PRD feedback contract (11 games) | Owner decision; after US-005/US-013 | US-031, US-040 |
| 27 | US-028 | Cheap cross-game Danish strings | — | — |
| 28 | US-030 | PRD reset requirement in 5 games | US-011 | — |
| 29 | US-031 | Keyboard operability across games | US-013, US-026 | — |
| 30 | US-029 | One TTS control everywhere | US-006; owner approval | — |
| 31 | US-027 | Danish-first content (large) | Owner decision; US-007, US-018 | — |
| 32 | US-034 | Cheap visible consistency fix | — | — |
| 33 | US-032 | Most visible pixel-art break | (owner approval if new sprites) | — |
| 34 | US-033 | Emoji → sprites | (owner approval if new sprite) | — |
| 35 | US-035 | Explainer content gaps and badge | US-025 | — |
| 36 | US-040 | Theme and mute placement | US-026; owner approval | — |
| 37 | US-036 | Explainer modal polish (shared, 10 games) | — | — |
| 38 | US-037 | Layout polish | — | — |
| 39 | US-039 | Shared chrome polish | Owner approval | — |
| 40 | US-038 | Sprite system polish | Owner approval | — |
| 41 | US-041 | Timer leaks (console error in Dansk Mester) | — | — |
| 42 | US-042 | SRS resurfacing | US-001 | — |
| 43 | US-043 | Glosekort polish | US-011 | — |
| 44 | US-044 | Præpositioner polish | US-019 | — |
| 45 | US-045 | Antonymer polish | US-020 | — |
| 46 | US-046 | Dansk Mester polish | US-021 | — |
| 47 | US-047 | En/Et polish | US-024, US-012 | — |
| 48 | US-048 | Forbindeord polish | US-002, US-022 | — |
| 49 | US-049 | Konjunktioner polish | US-022 | — |
| 50 | US-050 | Language polish (6 pages) | US-014/015/016/018/023; owner approval for `index.html` | — |
| 51 | US-051 | Latent data before Sætningsmaskinen is built | Native sign-off | `saetning-game-1/2` |
| 52 | US-052 | Orphan demo decision | Owner decision | — |
| 53 | US-053 | Docs refresh | Owner approval | — |
