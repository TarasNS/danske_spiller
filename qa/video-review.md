# QA review: video and learning support (QA Agent 3)

Date: 2026-10-04. Scope: the explanatory "videos" (grammar explainers) and other learning-support flows in all games listed in the brief. QA only: no production file was changed. Scripts, raw results and screenshots are in the scratchpad:
`C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\qa-video\` (`run.mjs`, `rule.mjs`, `summarize.mjs`, `results.json`, `run.log`, `shots/`).

## What the "videos" are

- **No real media.** I found no mp4, webm, mp3, ogg, wav or m4a files, and no `<video>`, `<audio>`, `<iframe>`, YouTube or Vimeo reference anywhere outside `tests/node_modules`. The only `.webm` mentions are in the skill's optional recorder (`.claude/skills/grammar-explainer-video/scripts/record.mjs`), which has never produced a shipped file.
- **The explainers are scripted, silent animations.** `shared/explainer/explainer.js` is the player and `modal.js` / `modal.css` wrap it in a dialog. `monitor.svg` (15 KB, valid, 48x40 pixel art) is the frame, and the 18 `scenes/*.scene.js` files are the content. A game adds `data-explainer="id[,id]"` to `<html>` and loads `modal.js`. That adds a **▶ FORKLARING** button to the shared `.sd-bar`. The button loads the player and the scenes on demand.
- **They are silent by design.** `SKILL.md:8` says "No narration, no audio". `modal.js:102` mounts the player with `{controls, autoplay:true, loop:true}` and no `tts` option, so `say()` writes only to an `aria-live` region (`explainer.js:197-209`). The player has an optional `tts` mode (da-DK, rate 0.9, `DanskSpeech.normalize`), but the shipped modal never turns it on.
- The 18 scenes in `shared/explainer/scenes/` are byte-identical to `.claude/skills/grammar-explainer-video/examples/`. `explainer.js` is identical to the template. `explainer.css` differs only in the font path, which is correct, and the fonts exist in `shared/fonts/`.
- The explainers are not mentioned in `prd.md`, `specs.md`, `PROGRESS.md` or `SCRATCHPAD.md`. The only design source is the skill. No game is *required* to have an explainer, so "missing explanation" below means a coverage gap measured against each game's own modes.

## Method

1. Static review of `explainer.js`, `modal.js`, `modal.css`, `explainer.css`, all 18 scenes, `SKILL.md`, the per-game wiring (`data-explainer` grep) and the timer code in the games.
2. A headless Chrome run (puppeteer-core from `tests/node_modules`, `file://`, local Chrome via `CHROME_PATH`) using `scratchpad/qa-video/run.mjs`. Every game in scope was opened at 390x844 (mobile), and every wired game also at 360x740 and 1440x900. An init script spied on `speechSynthesis.speak`, wrapped `Explainer.mount` to get the player handle, and counted `keydown` events reaching `document`, which is how a game would receive them. For each wired game it:
   - checked the button (present, in bar, size);
   - opened the modal and checked panel fit, horizontal scroll and the size of every modal button;
   - for **every tab or scene**, walked every step with `player.step()`. After each step it checked that every tile, rule line and arrow label stays inside the screen with no tile overlap, then confirmed `__explainerDone` and the `N/N` counter;
   - on mobile, tested Forfra, Afspil/Pause (twice), Næste trin, the keys ArrowRight, Space, Space and R, game-key isolation, the Tab focus trap (14 presses), Esc (closes, focus returns to the button), reopening (replay autoplays), backdrop click and the Luk button;
   - let **every scene autoplay naturally to its end** (18 scene instances across 10 games) and checked that it loops;
   - ran one reduced-motion plus dark-mode pass (ordstilling-detektiv) and one probe that mounts the player with `tts:true` to check the shape of the speech call;
   - ran one timer probe (en og et → "Den Hvide Kanins ræs", 60 s round, modal open for 5 s).
3. Screenshots were reviewed by eye (`shots/*_open.png`, `*_rule.png`, `*_step4.png`, `ordstilling_reduced_dark_*.png`). Note that `step4` shots are taken mid-animation, so faded or half-scaled tiles in them are expected.
4. Headless Chrome has no Danish voice, so whether anything is actually audible is **UNCONFIRMED**. The explainers produce no speech in the shipped configuration anyway: there were 0 `speak` calls across all runs.

## Summary table

| Game | Explanation present | Works | Correct content | Mobile (390x844) | Problem | Evidence |
|---|---|---|---|---|---|---|
| Portal `index.html` | No (none expected) | n/a | n/a | n/a | none | `results.json`: no `data-explainer`, 0 console issues |
| `adverbs.html` | Yes: `adverbier-placering`, `konjunktioner` | Yes (15/15 and 14/14 steps; autoplay done in 29.3 s and 28.3 s; all controls pass) | Yes for the *Sætningsbygning* and *Bindeord* modes | Pass (panel 366x577, no clipping, all buttons ≥44 px) | The meaning modes (Tid/Sted/Måde/Frekvens) have no explainer (VID-007) | `shots/adverbs_mobile_*` |
| `magiske_verber.html` | Yes: `tider-nutid-datid`, `foernutid-har` | Yes (12/12, 12/12, autoplay done) | Yes, but the *er*-perfect is not covered even though the game drills "har/er + tillægsform" (VID-006) | Pass | VID-006, VID-008 (60 s Hurtigduel timer) | `foernutid-har.scene.js:1`; `magiske_verber.html:896` |
| `idiomjaeger.html` | No (vocabulary game; none expected) | n/a | n/a | n/a | none | no `data-explainer` |
| `dansk-praepositioner.html` | Yes: `i-paa`, `af-fra` | Yes (14/14, 13/13, autoplay done) | Yes; no scene for **til** although the game's title promises "i, på, til og af" (VID-005) | Pass | VID-005, VID-008 (Lynrunde) | `dansk-praepositioner.html:2,6,1196` |
| `danish-antonyms-game.html` | No (vocabulary; none expected) | n/a | n/a | n/a | none | none |
| `boejningsvaerkstedet/index.html` | Yes: `navneord-former`, `tillaegsord-form` | Yes (12/12, 12/12, autoplay done) | Yes for modes 1-3 and 5; **no explainer for mode 4 Sammenligningspressen (gradbøjning) or mode 6 Mængdeværkstedet** (VID-003) | Pass | VID-003 | `boejningsvaerkstedet/index.html:2`; start screen lists 6 modes |
| `danish_flashcards/.../index.html` | No (verb flashcards; none expected) | n/a | n/a | n/a | Informational: the existing `tider-nutid-datid` and `foernutid-har` scenes would fit | none |
| `danske-phraser/dansk-mester.html` | No (phrases and verbs with prepositions; none expected) | n/a | n/a | n/a | none | none |
| `en og et/index.html` | Yes: `en-et`, `bestemt-form`, `flertal` | Yes (12/12, 13/13, 12/12, autoplay done) | Yes (VID-014 wording nit in `flertal`) | Pass | VID-008 (timer verified running: 59→54 s while the modal was open) | `results.json` timerProbe; `en og et/index.html:1072-1078` |
| `forbindenor/Forbindenor.html` | Yes: `inversion-derfor`, `konjunktioner` | Yes (14/14, 14/14, autoplay done) | Yes (matches the game's "verbet før grundleddet" note) | Pass | VID-013 (cosmetic) | `shots/forbindenor_Forbindenor_mobile_tab1_rule.png` |
| `konjunktioner/konjunktioner.html` | Yes: `konjunktioner` | Yes (14/14, autoplay done) | Partial: the scene teaches word order (SVA/SAV), while the cloze tests conjunction **meaning** (VID-007) | Pass | VID-007 | `konjunktioner.html` data lines 11-14, 44+ |
| `ordstilling-detektiv/index.html` | Yes: `v2-ordstilling`, `ikke-placering` | Yes (17/17, 16/16, autoplay done; reduced motion OK) | Yes; existing scenes for cases 5, 7, 8 and 9-10 are not wired (VID-004) | Pass | VID-004 | start screen case list in `results.json` |
| `pronomenmysteriet/index.html` | Yes: `min-mit`, `sin-hans` | Yes (12/12, 14/14, autoplay done) | Modes 2-3 only; **modes 1, 4, 5 and 6 have no explainer** (VID-002). `sin-hans` shows "Skal tjekkes" to learners (VID-009) | Pass, but the scene title is truncated to "sin elle…" | VID-002, VID-009 | `shots/pronomenmysteriet_index_mobile_tab1_step4.png`; `sin-hans.scene.js:390` (`verify: true`) |
| `tidsmaskinen/index.html` | Yes: 4 scenes (`tider-nutid-datid`, `foernutid-har`, `datid-foernutid`, `modalverber`) | Yes (12/12, 12/12, 12/12, 11/11, autoplay done) | Modes 1, 2 and 5 only; **6 of 9 modes have no explainer** (VID-001) | Pass at 390x844 (panel bottom 738). At 360x740 the panel scrolls vertically (716 px) but controls stay reachable | VID-001, VID-008 ("Med tid" mode) | `tidsmaskinen/index.html:2,816` |
| `saetningsmaskinen/` | n/a: folder contains only `data.js`, no game page | n/a | n/a | n/a | Not playable, so not testable. Its Mode 1 is the natural home for `ikke-placering` / `adverbier-placering` later | `ls saetningsmaskinen` |
| `pixel-animation.html` | No (standalone canvas demo, not a lesson) | n/a | n/a | n/a | none | 0 console issues |

**Orphan scenes: none.** All 18 scene ids are wired into at least one game. `konjunktioner` is used in 3 games, and `tider-nutid-datid` and `foernutid-har` in 2 each.

**Results common to all 10 wired games, at all three viewports:**
- 0 console errors or warnings and 0 failed requests.
- 0 clipped or overlapping elements on any step of any scene.
- No horizontal scroll in the document or the panel.
- Every modal button ≥44x44 px.
- Focus starts on Luk; Tab never leaves the dialog; Esc closes and returns focus to the button.
- 0 game key events leaked while the modal was open.
- Forfra restarts; Afspil/Pause toggles `aria-pressed`; Næste trin advances one step; ArrowRight, Space and R work.
- Reopening replays with autoplay; backdrop click and Luk both close.
- With reduced motion there is no autoplay, the idle text "Tryk Afspil eller Næste trin" shows, and Afspil advances one step.

## Detailed findings

### VID-001: Tidsmaskinen: 6 of 9 modes have no explainer (Major)
- The game lists 9 modes on its start screen. The 4 wired scenes cover mode 1 (Nutid eller datid), mode 2 (Datid eller perfektum, via `datid-foernutid` plus `foernutid-har`) and mode 5 (Modalcentralen).
- There is nothing for mode 3 *Før fortiden* (pluskvamperfektum), mode 4 *Fremtidsværkstedet*, mode 6 *Hvis-portalen*, mode 7 *At eller ikke at?*, mode 8 *Aktiv eller passiv?* or mode 9 *Kommandoværkstedet*.
- The tabs are not tied to the selected mode: a learner in mode 8 sees "nutid og datid" first.
- Evidence: `tidsmaskinen/index.html:2`; start-screen buttons in `results.json`; `specs.md:201-210`.

### VID-002: Pronomenmysteriet: 4 of 6 modes have no explainer (Major)
- The wired scenes are `min-mit` (mode 2) and `sin-hans` (mode 3).
- There is nothing for mode 1 *Subjekt eller objekt* (jeg/mig), mode 4 *Den, det eller de?*, mode 5 *Nogen, nogle eller noget?* or mode 6 *Demonstrativsporet*.
- Evidence: `pronomenmysteriet/index.html:2`; `specs.md:160-166`.

### VID-003: Bøjningsværkstedet: no explainer for gradbøjning (mode 4) or mængdeord (mode 6) (Major)
- `navneord-former` and `tillaegsord-form` cover modes 1-3. Mode 5 (bestemt/ubestemt i kontekst) is only partly covered by the noun-form rule card.
- Mode 4 *Sammenligningspressen* (stor/større/størst) and mode 6 *Mængdeværkstedet* have no explainer.
- Evidence: `boejningsvaerkstedet/index.html:2`; `specs.md:140-146`.

### VID-004: Ordstillingsdetektiven: matching scenes exist but are not wired (Minor)
- The game's cases include *Hyppighedsadverbier* (5), *Modalverber* (7), *Førnutid (har + tillægsform)* (8), and *Bisætninger med fordi* and *Flere konjunktioner* (9-10).
- The scenes `adverbier-placering`, `modalverber`, `foernutid-har` and `konjunktioner` already ship, but the game only lists `v2-ordstilling,ikke-placering` (`ordstilling-detektiv/index.html:2`).
- Fixing this means adding ids to the attribute, with no new content needed.

### VID-005: Præpositionsmester: no explainer for "til" (Minor)
- The title and spec say "i, på, til og af" (`dansk-praepositioner.html:6`, `specs.md:36`).
- The scenes cover only i/på and af/fra. There is no "til" (direction or recipient) contrast.

### VID-006: Magiske Verber: the perfect-tense explainer leaves out the "er" auxiliary the game drills (Minor)
- The mode *Førnutidsbyggeren* is described as "Byg førnutid med **har/er** + tillægsform" (start screen).
- `foernutid-har.scene.js:1` explicitly says "Kun 'har'-verber; 'er'-verber (er kommet) er udeladt".
- The rule card reads "har + tillægsform", which a learner could over-generalise to *har kommet*.

### VID-007: Explainers teach word order, but some games test meaning (Minor)
- `konjunktioner/konjunktioner.html` is a cloze that picks og/men/fordi/selvom by meaning, as its feedback shows: "fordi — … Betyder en forklaring / årsag". The `konjunktioner` scene only shows the ikke/verb order after men versus fordi.
- `adverbs.html` modes Tid/Sted/Måde/Frekvens (meaning categories) have no matching explainer. Only Sætningsbygning and Bindeord are covered.
- What is shown is correct, but it covers only part of what these games test.

### VID-008: Game timers keep running while the explainer is open (Minor)
- **Repro:** en og et → "Den Hvide Kanins ræs" (60 s) → press ▶ FORKLARING → wait 5 s. The timer goes from **"Tid: 59" to "Tid: 54"** behind the modal (`results.json` timerProbe).
- `modal.js` never pauses the game, and `SKILL.md:49` documents "It does not pause game timers".
- The same pattern applies to countdown timers in `dansk-praepositioner.html:1196` (Lynrunde), `magiske_verber.html:896` (Hurtigduel) and `tidsmaskinen/index.html:816` ("Med tid"). Only the en og et case was run; the other three are confirmed in code only.
- `ordstilling-detektiv/index.html:966` is a count-up timer, so there it only inflates the recorded time.
- A learner who asks for help mid-round loses time or the round.

### VID-009: The "Skal tjekkes" QA badge is visible to learners in the sin-hans scene (Minor)
- `sin-hans.scene.js` has `verify: true`, so `explainer.js:97` renders a "Skal tjekkes" badge in the scene header in production (pronomenmysteriet, tab 2).
- This is internal review text showing to learners, and it means native review of this scene is still pending.
- On mobile the badge also pushes the title down to "sin elle…".
- Evidence: `shots/pronomenmysteriet_index_mobile_tab1_step4.png`.
- The sentences themselves (Peter ser sin/hans bror; Anna vasker sin/hendes bil) look grammatical. Deep language review belongs to Agent 1.

### VID-010: No narration or audio in the explainers (Info, by design; not counted)
- Silent by spec (`SKILL.md:8,59`). The modal does not pass `tts:true` (`modal.js:102`), so the player's "Lyd til" toggle never appears. Across all runs there were **0** `speechSynthesis.speak` calls.
- When `tts:true` is forced, the speech path works: `speak` was called with `lang: "da-DK"` and the texts "Jeg har, bil", "Jeg har en bil" and "en bil bliver til bilen". Gaps are normalised and arrows are spoken as "bliver til", via `DanskSpeech`. Whether anything is audible is UNCONFIRMED (no Danish voice in headless Chrome).
- The PRD's "TTS replay on every Danish prompt" rule is about game prompts. Explainer sentences are demonstrations, not prompts, so I do not count this as a defect. It is still the one place where Danish sentences are shown without a way to hear them.

### VID-011: On phones the entry button is an unlabelled ▶ next to MENU (Minor)
- `modal.css:11` hides the "FORKLARING" text at ≤420 px, leaving a bare ▶ icon. It reads as "play" or "start game" rather than "explanation".
- `aria-label="Se en forklaring"` is present, so it is fine for screen readers. The problem is visual discoverability only.
- Evidence: every `shots/*_mobile_open.png`, top bar.

### VID-012: A scene that fails to load fails silently (Minor, robustness; not observed)
- `modal.js:115` handles a load failure with `.catch(function () { state = null; })`. If a scene or player file is missing or renamed, pressing the button does nothing and shows no message.
- All 18 scenes loaded in this run. This is a latent risk only.

### VID-013: The rule card sits off-centre on the screen (Minor, cosmetic)
- Measured on konjunktioner, rule step: at 360 px the screen spans 63-297 and the card 79-295. At 390 px the screen spans 67-323 and the card 84-321. That leaves 16-17 px on the left and 2 px on the right, so the right-hand box shadow touches or is clipped by the screen edge.
- Text is not clipped (`rule.mjs` output, clip check 0).
- Evidence: `shots/forbindenor_Forbindenor_mobile_tab1_rule.png`.

### VID-014: Small Danish wording points in scenes, for Agent 1 to confirm (Minor)
- `flertal.scene.js:151`: "Hvert ord: barn → børn" is unclear as a rule line. It is meant to say "irregular, learn each word", and something like "Uregelmæssigt: barn → børn" would be clearer.
- `tider-nutid-datid.scene.js:419`: the highlight marks only "går", because "I" and "går" are separate tiles, so the time expression "I går" is only half highlighted.
- `inversion-derfor` and `konjunktioner`: clauses run together without a comma or capital letter ("han var syg derfor han blev hjemme"). This is a deliberate player limitation (`*.scene.js` comments), but it models unpunctuated Danish.
- No outright grammatical errors were found in the 18 scenes' sentences or rule cards.

### Other learning-support flows (light check; deep checks belong to Agents 1 and 2)
- Wrong-answer grammar notes exist in code for pronomenmysteriet (`index.html:541-553`, correct answer + `item.note` + replay), tidsmaskinen (`index.html:976`), bøjningsværkstedet (`index.html:794`) and konjunktioner (per-conjunction notes). Their content was not reviewed here.
- None of the games link from the wrong-answer feedback to the matching explainer. The explainer is reachable only from the top bar. This is an observation, not counted.
- There is no dedicated "how to play" screen in most games. Mode cards carry one-line descriptions, for example "Tidsudtryk først → verbet på 2. plads". This is not counted, since there is no requirement in `prd.md`.

## Counts by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 0 | none |
| Major | 3 | VID-001, VID-002, VID-003 |
| Minor | 10 | VID-004, VID-005, VID-006, VID-007, VID-008, VID-009, VID-011, VID-012, VID-013, VID-014 |
| Info (not counted) | 1 | VID-010 |

UNCONFIRMED: whether any Danish speech is audible (no Danish voices in headless Chrome; the explainers make no speech calls in the shipped configuration). VID-008 is confirmed at runtime for en og et only; the other countdown games are confirmed in code only.
