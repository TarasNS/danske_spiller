# Gameplay & Functional QA Review — Sjovt Dansk

QA Agent 2 (Gameplay & Functional) · 2026-10-04 · read-only review, no production files changed.

## Method & test harness

- **Browser:** Microsoft Edge (Chromium) headless, driven by `puppeteer-core` from `tests/node_modules` (Chrome isn't installed on this machine, so `CHROME_PATH` pointed to `msedge.exe`). Every page was opened via a `file:///` URL with `--allow-file-access-from-files`.
- **Harness:** custom scripts live in the session scratchpad `qa-gameplay/` and are not in the repo. `common.mjs` opens a page and records every console message, `pageerror`, `requestfailed`, HTTP ≥400 and dialog.
- **Scripts:**
  - `probe.mjs`: load and console check for every page.
  - `portal.mjs`, `portal_kb.mjs`, `portal_s.mjs`: portal links, keyboard and search.
  - `xcut.mjs`: localStorage/sessionStorage blocked, plus the explainer modal (`FORKLARING`) open and Escape close.
  - `pixel.mjs`: the pixel-animation page.
  - `A/`, `B/`, `C/`: per-game deep-play scripts.
- Screenshots are in `qa-gameplay/shots/`. Scratchpad root: `C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\qa-gameplay\`.
- **Deep play:** each game had localStorage cleared and was reloaded. Correct answers were read from the game's own in-page state or data (for example `S.queue[S.idx].correct`, `currentEntry`, data.js lookups), so every mode could be played right and wrong through to the summary screen. Each game was also checked for:
  - restart and back to menu
  - reload persistence
  - reset confirmation (dismissed and accepted)
  - keyboard-only play (Tab, Enter, number keys)
  - play with storage blocked (the getter throws `SecurityError`)
  - timed modes running to the end
- **`tests/smoke.mjs`:** run without `--shots` for 14 games; it writes no files without `--shots`. Log: `qa-gameplay/smoke.log`. The 240 checks passed. The "play button `#btn-play` not found" and "still playable" failures on the 11 legacy games are a harness artefact, because those games don't have `#btn-play`. The real failures are adverbs with localStorage blocked (GAME-001) and en-og-et dark-mode contrast (handed to the a11y agent).
- **Existing tests:** `tests/pronomenmysteriet.mjs` and `tests/tidsmaskinen.mjs` were run without `--shots`, with output sent to the scratchpad.
- **Repo state:** `git status` before and after showed only the existing `?? CLAUDE.md` plus this `qa/` folder.
- **Rules applied:** suspected bugs were reproduced twice, scrolling to the top first so clicks don't land on the sticky `.sd-bar`. Every Major or Critical finding was also checked against the source.

## Load / navigation baseline (all pages)

- All 16 pages load via file:// with **zero console errors, page errors or failed requests**. That covers the portal, 14 games and pixel-animation, and includes fonts, `shared/*`, data files and explainer scenes.
- **Portal:** all 14 cards built from `${g.url}` resolve to existing files, including `en%20og%20et/index.html`. Clicking each card opens the right game, and every game's `← MENU` bar goes back to `index.html`. Cards are reachable with Tab and open with Enter. Search filters correctly and shows an empty-state message when nothing matches.
- **Explainer modal (10 games):** it opens, focus moves inside it, Escape closes it, and the console stays clean.

## Status table

| # | Game | File | Status | Crit | Major | Minor |
|---|---|---|---|---|---|---|
| 1 | Portal | `index.html` | PASS WITH ISSUES | 0 | 0 | 1 |
| 2 | Adverbier og bindeord | `adverbs.html` | **NOT READY** | 0 | 5 | 3 |
| 3 | Magiske Verber | `magiske_verber.html` | PASS WITH ISSUES | 0 | 0 | 1 |
| 4 | Idiomjægeren | `idiomjaeger.html` | PASS WITH ISSUES | 0 | 1 | 1 |
| 5 | Præpositionsmester | `dansk-praepositioner.html` | PASS WITH ISSUES | 0 | 1 | 2 |
| 6 | Danske modsætninger | `danish-antonyms-game.html` | PASS WITH ISSUES | 0 | 1 | 4 |
| 7 | Bøjningsværkstedet | `boejningsvaerkstedet/index.html` | PASS WITH ISSUES | 0 | 1 | 2 |
| 8 | Verb-glosekort | `danish_flashcards/danish_flashcards_game/index.html` | PASS WITH ISSUES | 0 | 1 | 2 |
| 9 | Dansk Mester | `danske-phraser/dansk-mester.html` | PASS WITH ISSUES | 0 | 0 | 2 |
| 10 | En/Et-træner | `en og et/index.html` | PASS WITH ISSUES | 0 | 1 | 1 |
| 11 | Forbindeord | `forbindenor/Forbindenor.html` | PASS WITH ISSUES | 0 | 0 | 2 |
| 12 | Konjunktion Crush | `konjunktioner/konjunktioner.html` | PASS WITH ISSUES | 0 | 0 | 1 |
| 13 | Ordstillingsdetektiven | `ordstilling-detektiv/index.html` | PASS WITH ISSUES | 0 | 0 | 1 |
| 14 | Pronomenmysteriet | `pronomenmysteriet/index.html` | **NOT READY** | 1 | 0 | 1 |
| 15 | Tidsmaskinen | `tidsmaskinen/index.html` | PASS | 0 | 0 | 0 |
| 16 | Sætningsmaskinen | `saetningsmaskinen/` | NOT TESTED (no game yet) | 0 | 0 | 0 |
| 17 | Pixel animation | `pixel-animation.html` | PASS (demo page) | 0 | 0 | 1 |
| — | Cross-cutting | several | — | 0 | 0 | 2 |

The per-game columns cover the game-specific findings. The two cross-cutting Minors are counted separately: GAME-031 (PRD feedback rules) and GAME-032 (no reset in the DanskCore games). Tidsmaskinen's 0 Minor excludes GAME-032, which also applies to it.

---

## Per-game findings

### 1. Portal — `index.html` — PASS WITH ISSUES
**Tested:** loading, all 14 links (by click and keyboard), MENU round trip for each game, search, theme toggle and reload.

- **GAME-030 · Minor:** the theme choice is lost on reload.
  - The code comment says "choice kept for the session", but `themeBtn` only sets `data-theme` (index.html:305-307) and never saves it.
  - Evidence: after toggling to dark (`data-theme=dark`, button "LYS") and reloading, `data-theme=null` and the button says "MØRK".
  - **Fix:** save the choice to sessionStorage or localStorage inside try/catch, or update the comment.

### 2. Adverbier og bindeord — `adverbs.html` — NOT READY
**Tested:** 14 consecutive answers right and wrong, the zone buttons, all 7 question types (forced), the review modal, keys 1–4, Tab, CSV import, settings export, reset (both paths), reload, and play with storage blocked.

- **GAME-001 · Major: the game is blank when localStorage is blocked.**
  - `loadProgress()` calls `localStorage.getItem` with no try/catch (adverbs.html:592). It runs in the DOMContentLoaded handler (:1095), so the whole init aborts.
  - Error: `PAGEERROR DOMException: SecurityError: blocked at loadProgress (adverbs.html:592:22) at adverbs.html:1095:7`.
  - `smoke.mjs` reports "localStorage blocked: no crash — FAIL".
  - Screenshots: `shots/X_adverbs_lsblocked_after.png` and `shots/B_adverbs_lsblocked.png` show only the header buttons, with no zone map, questions or dashboard.
  - The same unguarded access is at :604 (save) and :1102/:1111 (dark mode).
  - **Fix:** wrap all storage access in try/catch, as magiske_verber.html:751-754 does.
- **GAME-002 · Major: the Repetition (review) flow is broken.**
  - (a) The review modal stays open over the question. `elementFromPoint` at an option returns `DIV#reviewModal`, so pointer users can't answer (`shots/B_adverbs_review_modal.png`).
  - (b) "Luk" empties `#game` (:1188-1195), and the play area stays blank until a zone is clicked.
  - (c) The end-of-review branch "Repetitionen er færdig!" (:1006-1011) is nested inside `if (reviewQueue.length > 0)`, so it can never run. Review never ends and falls through to random questions.
  - (d) Correct answers never lower the "mangler 3 rigtige svar" counter. After 8 correct review answers every word was unchanged.
  - **Fix:** close the modal when review starts, check `reviewQueue.length === 0` after the shift, and record correct answers.
- **GAME-003 · Major: there is no TTS anywhere in the game.**
  - The file has 0 matches for `speechSynthesis` or `speak(`.
  - "Lyt og vælg" shows the full sentence, answer included, for 3 s and then hides it (:905-911). There is no audio.
  - This breaks the PRD rule "TTS replay on every Danish prompt".
  - **Fix:** use `DanskSpeech`/`DanskCore.tts` like the other games and add a ▶ button to the prompt and the wrong-answer panel.
- **GAME-004 · Major: the question mode never changes and the zone is ignored after the first question.**
  - `showAnswerExplanation` calls `loadQuestion(currentMode)` without the zone (:1020).
  - 14 answers in a row were all "Lyt og vælg". After choosing "Tid", the next items came from Sted, Måde and Frekvens.
  - The boss round (`MODES.BOSS`, :927) is unreachable.
  - **Fix:** pass the active zone through and rotate modes as designed.
- **GAME-005 · Major: "Bindeordsduellen" shows the answer in the prompt.**
  - The target word is never blanked (:875-885); this happened in 10 of 10 entries.
  - Example: "Jeg har ikke set filmen endnu …" with the options når / da / endnu / men.
  - **Fix:** blank the target word as the other modes do.
- **GAME-006 · Minor:** the built-in dataset has only 10 entries, so questions repeat within a few answers.
- **GAME-007 · Minor:** typing "r" in the CSV import textarea opens the review modal, because the global keydown handler (:1211) doesn't ignore inputs. Screenshot: `shots/B_adverbs_csv_r_key.png`.
- **GAME-008 · Minor: feedback timing and content.**
  - Correct answers auto-advance after about 2,000 ms (measured 2,013–2,119 ms), not about 800 ms.
  - Wrong answers have no grammar note.
  - Ordstilling has no undo for a tapped tile.
  - The "Rigtigt!" text is covered by GAME-031.
- **Works:** reset confirmation, reload persistence, keys 1–4, the ← MENU link, and a clean console in normal play.

### 3. Magiske Verber — `magiske_verber.html` — PASS WITH ISSUES
**Tested:**
- All 7 round games on Nem, Mellem and Svær, each played to "Runde er færdig", then Spil igen and Hovedmenu.
- Hurtigduellen ends at 61.0 s with "Tiden er gået!", and quitting mid-round stops the timer.
- Gennemse fejl: 15 items, completes and removes mastered items.
- Statistik and reset (confirmation checked across a reload).
- Persistence: totals, ✓ marks and mistakes all survive a reload.
- A keyboard-only round (Tab, Enter, keys 1–3, Enter for Næste).
- Play with storage blocked works.
- Data: all 735 questions are well-formed.
- The console is clean throughout.

- **GAME-022 · Minor:** focus falls to `<body>` on every screen and question change, so keyboard users have to Tab back in.
  - **Fix:** focus the first option or the Næste button after each render.
- The PRD feedback deviations are covered by GAME-031: no auto-advance outside Hurtigduel (750 ms), and random encouragement text from OK_MSGS/NO_MSGS (:933-934). Wrong-answer feedback is otherwise complete: the correct answer, an explanation and ▶.

### 4. Idiomjægeren — `idiomjaeger.html` — PASS WITH ISSUES
**Tested:**
- All 13 game types reached their end screens: the multiple-choice games, fill-in, complete, memory (also keyboard-only), match with a miss, Tidsjagten ending at 60.0 s, and Overlevelse ending on the 3rd miss.
- Øve-tilstand, Svage idiomer, Læring (171 cards), Ordbog search, Statistik and Badges.
- Reset (both paths), persistence, the level-filter × game matrix, and play with storage blocked.

- **GAME-009 · Major: "Modersmålstaleren" crashes when level A2 or B1 is selected.**
  - `launchGame('native')` keeps only B2/C1 items from `levelPool()` (idiomjaeger.html:1056). With an A2 or B1 filter the pool is empty, `pickWeighted` returns undefined, and `d.id` throws at :825.
  - Error: `PAGEERROR: Cannot read properties of undefined (reading 'id')`.
  - Repro: Niveau A2 → Spil → Modersmålstaleren. Nothing happens apart from the error.
  - Screenshot `shots/B_idiom_native_A2.png` shows the game menu unchanged after the click.
  - **Fix:** fall back to all B2/C1 items when the filtered pool is empty, or disable the card with a message.
- **GAME-010 · Minor:** "Fuldfør udtrykket" shows "Tak for kaffe!" with nothing blanked, because the regex `kaffe\s*$` doesn't match before the "!" (:1049). **Fix:** allow trailing punctuation in the regex.
- Legacy feedback style (motivational text, no auto-advance, no number-key shortcuts) is covered by GAME-031.

### 5. Præpositionsmester — `dansk-praepositioner.html` — PASS WITH ISSUES
**Tested:**
- Six modes with right and wrong answers each: fill, multiple choice, drag, find the error, correct the sentence, translation.
- Forvekslingspar: all 6 groups at every level.
- Gentag fejl: 41 items, worked down to empty.
- Lynrunde ends at 60.2 s with a result screen and a record.
- Statistik, reset (both paths), persistence, Tab order, and play with storage blocked.
- Wrong answers show the correct answer, a TIP note and ▶.

- **GAME-011 · Major: Forvekslingspar serves unanswerable questions when a level is selected.**
  - `randItem` filters by level first. When the pair filter then finds nothing, it falls back to *all* ITEMS (dansk-praepositioner.html:711-719).
  - `nextPair` still offers only the two pair options (:1161-1163), so the right answer often isn't offered and every choice is marked wrong.
  - Measured: 7–10 of 10 questions unanswerable in several level/group combinations, for example A2 group 1 (10/10), A1 group 5 (9/10) and B1 group 5 (9/10).
  - Example: "Vi mødes om natten." with the options [til, i].
  - At "Alle niveauer", 0 of 72 questions were unanswerable.
  - **Fix:** when the level and pair filters together give nothing, fall back to the pair-filtered pool across all levels, not to all ITEMS.
- **GAME-012 · Minor: Lynrunde and Statistik break when storage is blocked.**
  - `endSpeed` (:1236-1237), `renderStats` (:1302) and `resetProg` (:1348) access localStorage directly.
  - Lynrunde freezes at "0s" with `PAGEERROR: blocked` and no result screen (`shots/B_praep_lsblocked_speed.png`).
  - The normal modes still work.
  - **Fix:** use try/catch storage helpers.
- **GAME-013 · Minor:** Lynrunde gives 15 XP per correct answer: `prog.xp += 5` (:1223) is added on top of the +10 in `record()`. Measured: 224 hits gave 3,360 XP.
- The legacy feedback text, the missing auto-advance and the practice modes having no summary are covered by GAME-031.

### 6. Danske modsætninger — `danish-antonyms-game.html` — PASS WITH ISSUES
**Tested:** all 8 modes to their summaries, Spil igen, the 60 s speed round, the topic and difficulty pickers, reload (310 XP restored from `modsat_danish_antonyms_v1`), reset confirmation, and play with storage blocked.

- **GAME-014 · Major: no mode starts when localStorage is blocked.**
  - `save()` has no try/catch (danish-antonyms-game.html:853).
  - Error: `PAGEERROR: blocked`, stack `save (:853) ← touchDailyStreak (:964) ← startSession (:1042) ← launchMode (:1378)`.
  - Screenshot `shots/C_ant_lsblocked_afterclick.png` shows the dashboard still displayed after clicking a mode.
  - **Fix:** wrap `save()` in try/catch (flashcards, Dansk Mester and forbindenor already do this).
- **GAME-015 · Minor: words with several antonyms accept only one.**
  - 66 words have more than one antonym, e.g. `mild` → bitter/intens/alvorlig/skarp/stærk/syrlig.
  - In multiple choice, another valid antonym can appear as a "wrong" option (5 of 3,000 simulated questions, e.g. "sød" with both besk and sur).
  - In typed mode a valid alternative is marked wrong.
  - Some pairs are duplicated (mørk/lys, retfærdig/uretfærdig).
  - **Fix:** exclude every valid antonym from the distractors (:1101), accept all of them in typed mode (:1194), and remove the duplicate pairs.
- **GAME-016 · Minor:** a wrong match in "Find par" only flashes red. It shows no correct partner, note or TTS, and the miss is recorded against the wrong pair (:1240).
- **GAME-017 · Minor:** focus drops to the page after an answer, so Enter doesn't press "Fortsæt".
- **GAME-018 · Minor (cosmetic):** when the speed-round timer ends, a pending timeout still draws a question into the hidden play screen (:1301). Nothing is visible.

### 7. Bøjningsværkstedet — `boejningsvaerkstedet/index.html` — PASS WITH ISSUES
**Tested:**
- All 6 modes, 10 items each with 3 wrong per mode.
- A correct answer plays its sound and auto-advances after about 830–900 ms.
- A wrong answer shows the correct form, a grammar note, TTS replay that works, and a focused "Videre".
- The summary screen, Spil igen, Escape back to start, reload persistence, and mute and dark mode remembered.
- Keyboard-only play and play with storage blocked.
- The smoke matrix passed, with a clean console.

- **GAME-019 · Major: in modes 5 and 6 the correct answer is always option 1.**
  - Options are rendered in data order with no shuffle (boejningsvaerkstedet/index.html:1152-1159). The correct option is first in 250 of 250 mode 5 items and 221 of 221 mode 6 items.
  - Pressing "1" every time scored 10/10 in both modes.
  - **Fix:** shuffle the options and check the answer by value, as pronomenmysteriet/index.html:486 does.
- **GAME-020 · Minor: Escape during the 800 ms auto-advance leaks state.**
  - `showStart()` doesn't cancel the pending advance (timers at :795, :896, :999, :1089, :1185).
  - The hidden round moved on to 2/10. Number keys pressed on the start screen answered the invisible item and wrote progress: the saved item count went from 1 to 2.
  - Pronomenmysteriet and Tidsmaskinen clear this timer.
  - **Fix:** `clearTimeout` the advance timer in `showStart()`.
- **GAME-021 · Minor:** on the summary screen, focus is set before the screen is shown (:670-675, :1337), so it lands on `<body>`. Tidsmaskinen (:891-897) has the right order.
- The "Rigtigt!" text on correct answers is covered by GAME-031, and the missing reset by GAME-032.

### 8. Verb-glosekort — `danish_flashcards/danish_flashcards_game/index.html` — PASS WITH ISSUES
**Tested:** all 150 cards played to the "done" panel, card flip with Enter, the note and TTS on "Det vidste jeg ikke", Gentag fejlene, the level filter, reload persistence, and play with storage blocked. The console is clean.

- **GAME-023 · Major: "Start forfra" wipes all progress with one click and no confirmation.**
  - The handler in script.js:609-623 resets every status and calls `saveProgress()` with no `confirm()`.
  - Repro: finish the deck, then click "Start forfra". It shows `Kort 1 af 150 / Rigtige: 0 / Forkerte: 0` straight away and no dialog appears.
  - This breaks the PRD rule "reset needs confirmation".
  - **Fix:** add a confirmation dialog.
- **GAME-024 · Minor: the player can get stuck on a card that has already been answered.**
  - Repro: answer all 52 A1 cards with the A1 filter on, then switch to "Alle". Both answer buttons are disabled and there is no Next control (`shots/C_flash_filter_stuck.png`).
  - The only way out is a sidebar list item, and those are mouse-only `<li>` elements (script.js:478), so keyboard users are stuck.
  - The root cause is that `goToNext()` (:553) can land on cards that are already answered.
  - **Fix:** skip to the next unanswered card and make the list items buttons.
- **GAME-025 · Minor:** in review mode, double-clicking "Det vidste jeg ikke" within 1.2 s skips a card (:570).

### 9. Dansk Mester — `danske-phraser/dansk-mester.html` — PASS WITH ISSUES
**Tested:** all 7 modes in a category, the 80 % unlock of the next category, the timed mode running out and advancing, reload (XP and the "continue" card), stats reset confirmation, and play with storage blocked.

- **GAME-026 · Minor: uncaught error when quitting right after an answer.**
  - Error: `PAGEERROR: Cannot set properties of null (setting 'innerHTML')` at dansk-mester.html:952.
  - Repro: answer, then click "‹ Afslut" within 750 ms (1.5 s after a wrong answer).
  - The pending next-question timeout (:1020) is never cancelled. This breaks the zero-console-errors rule but has no visible effect.
  - **Fix:** store the timeout ID and clear it when quitting.
- **GAME-027 · Minor: English text and missing TTS.**
  - The match result button says "Continue ▸" (:1131).
  - English→Danish items have no TTS button, even after a wrong answer (:968).
  - A wrong match shows no correct answer.

### 10. En/Et-træner — `en og et/index.html` — PASS WITH ISSUES
**Tested:**
- Every mode: en/et with keys 1/2, the three typed modes, both word-pair games in all 3 styles, the speed mode, and Svage ord.
- End screens, Igen, Til menuen, reload persistence, and play with storage blocked.
- The console is clean.

- **GAME-028 · Major: weak words can never be cleared.**
  - A word stays weak while its lifetime correct count is below its lifetime attempts (en og et/index.html:915-926, :1344-1347). Both counts only grow, so one miss keeps a word weak forever.
  - Evidence: after a 15/15 Svage ord round the end screen showed "Ryddet: 0 / 15" and the card still listed 16 weak words.
  - **Fix:** base weakness on a recent streak or the last result, or use `DanskCore.srs`.
- **GAME-029 · Minor:** there is no progress reset. In the word-pair multiple-choice style, number keys don't select options (Tab works).
- The feedback deviations are covered by GAME-031: no auto-advance, praise and encouragement text, an English-only explanation in the sentence mode, and no sound effects or mute.
- smoke.mjs also flagged dark-mode contrast of 1.09 on the mode-card glyphs ("?", "-en", "-er", "___"). That belongs to the a11y review and isn't counted here.

### 11. Forbindeord — `forbindenor/Forbindenor.html` — PASS WITH ISSUES
**Tested:** all 359 sentences played to the win screen, all 6 energy lost to reach the lose screen, best score kept across reload, and play with storage blocked. The console is clean.

- **GAME-033 · Minor: weak mode can never be emptied.**
  - A word stays "weak" for good after a single miss (Forbindenor.html:838-842).
  - After 3 perfect weak loops, `før {t:16,c:15}` was still weak.
- **GAME-034 · Minor: progress and controls.**
  - A reload mid-run restarts at 1/359.
  - There is no way to reset saved stats.
  - Focus drops after an answer.
  - Some English text: "+1 ENERGY" (:760).
- UNCONFIRMED (content): distractors come from the same category, so near-synonyms such as "til slut" and "afslutningsvis" might both fit. This needs language review.

### 12. Konjunktion Crush — `konjunktioner/konjunktioner.html` — PASS WITH ISSUES
**Tested:** the level filter, number keys 1–4, combo scoring, game over with a new record, review of mistakes, reload of the high score, and play with storage blocked. The smoke matrix passed. The game is endless by design and ends only when all lives are lost.

- **GAME-035 · Minor:** Enter stops working in review mode after game over, because the key handler requires `lives > 0` (konjunktioner.html:980). The same happens on the "review finished" screen. **Fix:** also allow the key while reviewing.

### 13. Ordstillingsdetektiven — `ordstilling-detektiv/index.html` — PASS WITH ISSUES
**Tested:**
- All 12 cases solved by keyboard, which unlocks the finale: 100 timed questions, 97 %, and the timer stops at the end.
- A failed case and weak mode.
- The rank survives reload, and leaving the finale stops the timer.
- `Nulstil alle fremskridt` asks for confirmation.
- Play with storage blocked works.

- **GAME-036 · Minor:** some buttons are in English ("Next ▸" / "Finish ▸", ordstilling-detektiv/index.html:1086), and focus drops after "Tjek".
- UNCONFIRMED (content): only one exact word order is accepted (:1052), so a valid alternative order (for example a fronted adverbial) would be marked wrong. This needs language review.

### 14. Pronomenmysteriet — `pronomenmysteriet/index.html` — NOT READY
**Tested:** all 6 modes, number keys, auto-advance, wrong-answer feedback, the summary, reload persistence, Escape during auto-advance (handled correctly), keyboard-only play, and play with storage blocked. The console is clean. `tests/pronomenmysteriet.mjs` passed 16 of 22 checks, then aborted in mode 4.

- **GAME-037 · Critical: the dataset is placeholder data, and modes 4 and 5 are empty.**
  - All 760 items in `pronomenmysteriet/data.js` are placeholders: `grep -c "Test sentence" pronomenmysteriet/data.js` returns 760. The options are "opt1"/"opt2" and every note is "Test note."
  - The data's mode keys (`anaphoric_agreement`, `indefinite_pronouns`) don't match the game's `den_det_de` and `nogen_nogle_noget` (index.html:162-167). Modes 4 and 5 show "Der er ingen opgaver til dette valg."
  - The data levels are A1/A2/B1 but the level chips are A2/B1/B2, so B2 alone gives nothing.
  - Screenshots: `shots/A_pron_mode1_play.png` shows a "Test sentence N." item with the options opt1/opt2. `shots/A_pron_mode4_play.png` shows the empty-mode message.
  - Git history (read only): commit `2d606e5` ("create data.js with 760 items") overwrote the curated data. `b9abb96` is the last version without placeholders.
  - The game can't teach anything in its current state.
  - **Fix:** restore `data.js` from `b9abb96` and re-run `shared/validate.js` and `tests/pronomenmysteriet.mjs`. Make the validator reject placeholder text and unknown mode keys.
- **GAME-038 · Minor:** an item you just missed doesn't come back first in the next round, because unseen items count as due and outnumber the missed ones. The spec test failed this check in 2 modes. Bøjningsværkstedet works the same way (:595); Tidsmaskinen brings missed items back.
- The summary focus has the same pattern as GAME-021 (index.html:390-395, :651). This was confirmed from the code only.

### 15. Tidsmaskinen — `tidsmaskinen/index.html` — PASS
**Tested:**
- The existing spec test covered all 9 modes, Træning and Med tid, the two-blank mode, the mode 3 build step, alternative answers, SRS, keyboard play per mode and reduced motion. It reported 125 passes and 1 failure.
- That failure (auto-advance measured at up to 2,087 ms) is a timing artefact of the test under load. The code uses a fixed 800 ms (tidsmaskinen/index.html:1030), and our runs measured 829–950 ms.
- Our own checks:
  - Escape during auto-advance doesn't leak state.
  - It can be started and played with the keyboard alone.
  - Mute and dark mode are remembered.
  - It plays with storage blocked.
  - Focus lands on "Spil igen".
- The smoke matrix passed.

No game-specific findings. The missing reset is GAME-032.

### 16. Sætningsmaskinen — `saetningsmaskinen/` — NOT TESTED (no playable game)
- The folder has only `data.js`, which builds 1,020 items across 7 modes as specified. There is no `index.html`.
- PROGRESS.md lists `saetning-game-1` and `saetning-game-2` as `todo`.
- The portal and `sitemap.xml` correctly don't link to it, so there is no broken link. This is unfinished work, not a defect, so no finding is filed.

### 17. Pixel animation — `pixel-animation.html` — PASS (demo page)
**Tested:** load, animation running, Space and click to jump, reduced motion (shows one still frame), no horizontal scroll at 360 px, clean console.

- **GAME-039 · Minor:** this standalone demo isn't linked from the portal and has no `← MENU` bar or `sjovt.css`. Anyone who lands on it has no way back.
  - **Fix:** remove it from the deploy set or add the MENU bar.

---

## Cross-cutting findings

- **GAME-031 · Minor: the legacy games don't follow the PRD feedback rules.**
  - The PRD says correct = animation + sound + about 800 ms auto-advance with no praise text, and wrong = correct answer + grammar note + TTS with no encouragement.
  - **Affected:** adverbs, magiske_verber, idiomjaeger, dansk-praepositioner, danish-antonyms-game, flashcards, dansk-mester, en og et, forbindenor, konjunktioner and ordstilling-detektiv.
  - **What happens instead:** these games show praise or encouragement text. Most also need a manual "Næste" click instead of auto-advancing.
  - **Examples:** antonyms :1276; dansk-mester praise arrays around :1011; magiske_verber OK_MSGS/NO_MSGS :933-934; konjunktioner `showRule`; ordstilling "✓ Sagens logik holder!"; en og et "Storartet!".
  - Bøjningsværkstedet's "Rigtigt!" also falls under this.
  - It's filed once as Minor because specs.md marks these games "Complete" and wrong answers mostly do show the correct answer, a note and TTS. The exceptions (adverbs, Find par, match modes) are filed separately.
  - **Fix:** a shared feedback helper, rolled out game by game.
- **GAME-032 · Minor: there is no progress reset in the DanskCore games** (Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen).
  - The PRD requires a reset with confirmation. A search for reset or confirm code in these three games finds nothing.
  - Progress is held in `srs:<game-id>`.
  - **Fix:** add "Nulstil fremskridt" with a `confirm()` that uses `DanskCore.store`.

## Severity counts

| Severity | Count | IDs |
|---|---|---|
| Critical | 1 | GAME-037 |
| Major | 11 | GAME-001, 002, 003, 004, 005, 009, 011, 014, 019, 023, 028 |
| Minor | 27 | GAME-006, 007, 008, 010, 012, 013, 015, 016, 017, 018, 020, 021, 022, 024, 025, 026, 027, 029, 030, 031, 032, 033, 034, 035, 036, 038, 039 |
| UNCONFIRMED (content) | 2 | Forbindeord near-synonym distractors; Ordstilling single accepted order |

**Top issues:**
1. Pronomenmysteriet ships placeholder data, and 2 of its 6 modes are empty (GAME-037).
2. Adverbs: no TTS, review flow broken, answer shown in the prompt, mode stuck, and a blank page when storage is blocked (GAME-001 to 005).
3. Answer leaks or unwinnable states:
   - Bøjningsværkstedet modes 5 and 6 always have the correct answer at option 1 (GAME-019).
   - Præpositioner Forvekslingspar is unanswerable with a level filter (GAME-011).
4. Idiomjægeren "Modersmålstaleren" crashes at A2/B1 (GAME-009).
5. Storage blocked crashes the antonyms game (GAME-014).
6. Progress and reset handling:
   - Flashcards "Start forfra" wipes progress without confirmation (GAME-023).
   - En/Et weak words can never be cleared (GAME-028).
