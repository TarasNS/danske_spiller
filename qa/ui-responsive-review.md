# UI/UX & Responsive QA — Sjovt Dansk (QA Agent 4)

Date: 2026-10-04 · Scope: layout, overflow, fold and scrolling, tap targets, modals, focus and keyboard (spot check), dark mode and reduced motion (spot check).
I only reviewed. No production files were changed. All scripts and screenshots are in the scratchpad (`SP` below):
`SP = C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\qa-ui\`
Screenshots: `SP\shots\<game>-<viewport>-<state>.png`. Contact sheets: `SP\mont\*.png`. Raw metrics: `SP\*.json`.

## Method

- Headless Chrome (`%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe`), driven by puppeteer-core from `tests/node_modules`. Pages were opened over `file://` with localStorage cleared.
- Viewports:
  - `m390`: 390×844, touch, isMobile, DPR 3
  - `m430`: 430×932, touch, DPR 3
  - `m360`: 360×740, touch, DPR 2
  - `d1366`: 1366×768
  - `d1440`: 1440×900
- Scripts:
  - `survey.mjs`: start screen on every page × every viewport.
  - `explore.mjs` / `play.mjs`: real clicks into each game, then up to 30 answers. Captures feedback states (`fb0..fb2`, a mix of correct and wrong) and the results screen (`end`). Full runs at m390 and d1366; 3 answers at m360, m430 and d1440.
  - `deep.mjs`: magiske verber and dansk mester flows, antonyms and præpositioner feedback geometry.
  - `modals.mjs`: explainer modal in all 10 games that have it, settings, import, stats, reset.
  - `fold.mjs` / `ord2.mjs`: positions of key controls relative to the fold.
  - `phr360.mjs`: the 360 px overflow hunt.
  - `a11y.mjs`: 14×Tab focus walk at d1366, then dark + reduced motion at m390 for every page.
- Checks on every captured state:
  - `documentElement.scrollWidth > clientWidth`
  - visible elements whose right edge is past the viewport (ignoring ones clipped by an overflow ancestor)
  - interactive elements smaller than 44×44
  - feedback and next-button position relative to `innerHeight`
  - focus ring present (outline or box-shadow)
  - running Web Animations under `prefers-reduced-motion`
  - text contrast below 3:1 in dark mode (coarse)
- I looked at every contact sheet and at the key single screenshots myself, not just the measurements.
- Not covered: real devices and iOS Safari, landscape, tablet, 200% zoom, screen readers. Speech and TTS output were not listened to. Magiske verber and dansk mester gameplay was only driven at m390 and d1366 (start screen only at the other viewports).
- Test artefact, not a finding: ordstilling-detektiv threw `Invalid count value: -1 (String.repeat)` in one run. My script called `.click()` on the hidden `#checkBtn`, which pushed lives below 0. A real user cannot click a hidden button. The fix is still cheap: clamp `G.lives` in `ordstilling-detektiv/index.html:959`.

### Global positive results (all pages, all viewports tested)

- **No horizontal scroll** on any captured state. The one exception is dansk mester at 360 px (UI-007, 1 px).
- **No interactive element below 44×44** on any captured screen. `smallTapTargets` was empty everywhere.
- **The `← MENU` bar is present** on all 15 game pages (the pixel animation page has no bar, see UI-016). It is 44 px tall and sticky.
- **Focus ring is visible** on every element reached with Tab on all 15 game pages. No focus traps outside modals.
- **Explainer modal** (10 games): it fits at 390 px, focus starts on `LUK` (53×44), Tab cycles inside the modal, and Esc closes it and returns focus. At 1366×768 its controls end up below the fold (UI-006).
- **Reduced motion**: 0 running animations on start or in-game screens for all 16 pages. Confetti does not run.
- **Dark mode**: every page switches to a dark background, and I found no unreadable text in-game.
- **Feedback is never colour-only**: there are ✓ / ✗ marks on options and in verdicts everywhere.

## Coverage matrix

PASS = no finding at this viewport. ISSUE = see the finding IDs. "start" = start screen only. Cells marked † were inferred from neighbouring viewports with the same layout rules rather than measured directly.

| Game / page | m390 | m430 | m360 | d1366 | d1440 |
|---|---|---|---|---|---|
| Portal `index.html` | PASS (start) | PASS (start) | PASS (start) | PASS (start) | PASS (start) |
| `adverbs.html` | PASS | PASS | PASS | PASS | PASS |
| `magiske_verber.html` | PASS | PASS (start) | ISSUE UI-008 (start) | PASS | PASS (start) |
| `idiomjaeger.html` | ISSUE UI-012 | PASS | PASS | ISSUE UI-012 | PASS |
| `dansk-praepositioner.html` | ISSUE UI-004, 008, 011 | ISSUE UI-004 | ISSUE UI-004, 008 | ISSUE UI-004 | ISSUE UI-011 |
| `danish-antonyms-game.html` | ISSUE UI-002 | ISSUE UI-002† | ISSUE UI-002, 008 | ISSUE UI-002 | ISSUE UI-002† |
| `boejningsvaerkstedet/` | ISSUE UI-009 | ISSUE UI-009† | ISSUE UI-009† | ISSUE UI-009 | ISSUE UI-009 |
| `danish_flashcards/.../index.html` | ISSUE UI-005, 013 | ISSUE UI-005 | ISSUE UI-005 | ISSUE UI-005 | ISSUE UI-005 |
| `danske-phraser/dansk-mester.html` | ISSUE UI-011 | ISSUE UI-011 | ISSUE UI-007, 011 | ISSUE UI-011 | ISSUE UI-011 |
| `en og et/index.html` | ISSUE UI-010 | ISSUE UI-010 | ISSUE UI-010 | ISSUE UI-010 | ISSUE UI-010 |
| `forbindenor/Forbindenor.html` | PASS | PASS | PASS | PASS | PASS |
| `konjunktioner/konjunktioner.html` | ISSUE UI-010 | ISSUE UI-010 | ISSUE UI-010 | ISSUE UI-010 | ISSUE UI-010 |
| `ordstilling-detektiv/` | ISSUE UI-003, 008, 011 | ISSUE UI-003† | ISSUE UI-003 | ISSUE UI-003 | ISSUE UI-003 |
| `pronomenmysteriet/` | **ISSUE UI-001** | **ISSUE UI-001** | **ISSUE UI-001** | **ISSUE UI-001** | **ISSUE UI-001** |
| `tidsmaskinen/` | PASS | PASS | PASS | PASS | PASS |
| `pixel-animation.html` | ISSUE UI-016 (start) | ISSUE UI-016 (start) | ISSUE UI-016 (start) | ISSUE UI-016 (start) | ISSUE UI-016 (start) |

Modals and overlays tested at m390 and d1366:

| Modal | Result |
|---|---|
| Explainer, 10 games: adverbs, verber, præp, bøjning, en/et, forbind, konj, ordstil, pronomen, tid | PASS at m390; ISSUE UI-006 at d1366 |
| Adverbs settings and import | Fits; ISSUE UI-015 |
| Antonyms settings | In-page screen, PASS |
| Verber NULSTIL, ordstil "Nulstil alle fremskridt" | Native `confirm()`, PASS |
| Idiom and verber stats/badges | In-page screens, PASS |
| Flashcards "START FORFRA" | ISSUE UI-005 |

---

## Findings — Desktop

### UI-004 — Desktop 1366×768 (also partly mobile) → Præpositionsmester → grammar note and correct answer appear below the fold, under the NÆSTE button
- **Problem:** After answering in FLERVALG, the `#fb` feedback panel (verdict, "Rigtigt svar", TIP) is rendered under the full-width NÆSTE button.
  - At 1366×768 the panel is completely off-screen and the page does not scroll to it. The only visible feedback is the ✓/✗ on the options, so learners who press NÆSTE never see the grammar note the PRD requires.
  - At 390×844 only the first line of the verdict is visible.
  - At 1440×900 it fits.
- **Evidence:**
  - d1366: `#fb top=773–776 bottom=890–925`, `innerHeight=768`, `scrollY=0`; NÆSTE at `top=700 bottom=752`.
  - m390: `#fb top=785 bottom=934–959` vs 844.
  - m430: `#fb top=798 bottom=940` vs 932.
  - Screenshot `SP\shots\praep-d1366-fb0.png` shows the options marked ✗ A) over / ✓ B) om and the NÆSTE button at the bottom edge, with no feedback text visible. Also `SP\shots\praep-d1366-fb-full.png` (full page) and `SP\mont\fba.png` (last panel).
  - Code: `dansk-praepositioner.html:879` puts `<div class="fb" id="fb">` after the options; the NÆSTE button is created at line 966.
- **Severity:** Major (desktop 1366×768); Minor at m390 / m430.
- **Suggested fix:** Render `#fb` above the NÆSTE button. Or call `fb.scrollIntoView({block:'nearest'})` and move focus to NÆSTE after an answer, as Tidsmaskinen already does.

### UI-006 — Desktop 1366×768 → all 10 games with the explainer (`shared/explainer/modal.css`) → playback controls hidden below the visible panel
- **Problem:**
  - At 1366×768 the explainer "monitor" is sized only by width (`width:100%; aspect-ratio:48/40`), which makes it 696×580. The panel is capped at `100dvh-24px`, so the Pause / Næste trin / Forfra controls and the step dots are pushed out of view inside an internally scrolling panel.
  - Users see a cut-off monitor stand and no controls, with no visible cue that the panel scrolls.
  - Not a problem at 390×844 or 1440×900.
- **Evidence:**
  - `.xpm-panel` `clientH=744`, `scrollH=822` in 9 games and `876` in tidsmaskinen; the monitor's bottom edge is exactly 768 in tidsmaskinen.
  - Screenshot `SP\shots\tid-d1366-explainer.png` shows the monitor filling the panel and the stand cut off at the bottom edge, with no controls visible. For comparison, `SP\shots\adverbs-m390-explainer.png` shows the whole panel with the controls.
  - Code: `shared/explainer/modal.css:15` (`max-height: calc(100dvh - 24px); overflow-y:auto`) and `:31` (`.xpm-monitor{width:100%; aspect-ratio:48/40}`).
- **Severity:** Minor. The controls can be reached by scrolling inside the panel or with Tab, and the animation autoplays.
- **Suggested fix:** Limit the monitor by height, e.g. `.xpm-monitor{width:min(100%, calc((100dvh - 300px) * 1.2)); margin-inline:auto}`. This is a shared-file change, so it should be raised as a request.

### UI-009 — Desktop 1366×768 / 1440×900 and mobile → Bøjningsværkstedet, Pronomenmysteriet → primary SPIL button below the fold on the start screen
- **Problem:** The mode list and level chips come first and the SPIL button sits under them. After picking a mode the user must scroll to find SPIL. Tidsmaskinen puts SPIL first, which is the better pattern.
- **Evidence:**
  - Bøjning `#btn-play`: top=1001–1065 at d1366 (vh 768) and d1440 (vh 900); top=1164 at m390 (vh 844).
  - Pronomen `#btn-play`: top=753–817 at d1366 (partly below); top=1008 at m390.
  - Screenshots: `SP\shots\boejning-d1366-start.png`, `SP\shots\pronomen-m390-start.png`.
  - Markup: `boejningsvaerkstedet/index.html:382`.
- **Severity:** Minor.
- **Suggested fix:** Pick one of these:
  - Move SPIL above the mode list (the tidsmaskinen layout).
  - Make the SPIL bar `position:sticky; bottom:0`.
  - Start the round when a mode is chosen.

## Findings — Mobile

### UI-007 — Mobile 360×740 → Dansk Mester → game-type grid overflows (label clipped, 1 px horizontal scroll)
- **Problem:** On the "vælg en spiltype" screen (Verbalkombinationer → Start med kategori 1):
  - The card label "INTERVALREPETITION" is wider than its card and sticks out past the viewport.
  - "TIDSUDFORDRING" touches the card edges.
  - This is the only state in the whole review with horizontal overflow.
- **Evidence:**
  - At m360: `scrollWidth 361 > 360`; offending element `div.mname "INTERVALREPETITION" L171 R361 W190`.
  - Screenshot `SP\shots\phraser-m360-modes.png` shows the right-hand card label running out of its box ("NTERVALREPETITIO" visible, both ends clipped).
  - At m390: scrollWidth 390, OK.
  - CSS: `shared/themes/dansk-mester.css:137` (`.mode .mname` 17 px, uppercase, letter-spacing .02em; no wrapping rule).
- **Severity:** Minor. The overflow is only 1 px and the cards still work, but it does break the "360 px, no h-scroll" rule.
- **Suggested fix:** Add `overflow-wrap:anywhere; hyphens:manual` and `font-size:clamp(14px,4.2vw,17px)` to `.mode .mname`. Or insert a soft hyphen: `INTERVAL&shy;REPETITION`.

### UI-013 — Mobile 390×844 → Verb-glosekort (flashcards) → level filter and verb list pushed below the card
- **Problem:** On desktop the CEFR filter (Alle/A1…C1) and the verb list are a left sidebar. On mobile they stack after the card, the answer buttons and START FORFRA, so a mobile user never sees that filtering exists.
- **Evidence:** Filter buttons at y=1121–1225 (vh 844). Screenshot `SP\shots\flash-m390-start.png` shows only the card and the answer buttons; compare `SP\shots\flash-d1366-start.png` with its sidebar.
- **Severity:** Minor.
- **Suggested fix:** On mobile, move the filter row above the card as a compact chip row, or behind a "Niveau" toggle.

### UI-014 — Mobile ≤420 px → all 10 games with the explainer → explainer button shrinks to a bare "▶" square
- **Problem:** At ≤420 px the `FORKLARING` label is hidden, which leaves an orange square with a play glyph right next to `← MENU`. It reads as "play the game" or a media control, not "watch the explanation". It does have `aria-label="Se en forklaring"`.
- **Evidence:** `shared/explainer/modal.css:11` (`@media (max-width:420px){.xpm-btn .xpm-btn-t{display:none}}`). Screenshot `SP\mont\m390-portal.png` (adverbs, verber panels).
- **Severity:** Minor.
- **Suggested fix:** Keep a short visible label such as "▶ HJÆLP" or "?". The bar has room at 360 px.

---

## Findings — Cross-device

### UI-001 — All viewports → Pronomenmysteriet → game shows placeholder test data
- **Problem:** Every question shows "Test sentence N.", the answer options are literally "opt1" / "opt2", and wrong-answer notes say "Test note.". The review lists on the results screen show "Test sentence 31." and so on.
- **Cause:** `pronomenmysteriet/data.js` (236 KB, modified 2026-10-03 07:24) consists entirely of fixtures. The string "Test sentence" appears 760 times, and every item has `options:["opt1","opt2"], correct:"opt1"`.
- **Impact:** The layout itself is fine (no overflow, targets ≥44 px), but the game is unusable for learning at every viewport. A real data file appears to have been overwritten, possibly by a test run. This should also go to the content/data QA agent.
- **Evidence:**
  - Screenshots: `SP\shots\pronomen-m390-play0.png` (question card "Test sentence 67." with options "1 opt1" / "2 opt2"), `SP\shots\pronomen-m390-fb0.png`, `SP\shots\pronomen-m390-end.png` (results "ØV DISSE IGEN: Test sentence 71.").
  - `pronomenmysteriet/data.js:1-14`.
- **Severity:** Critical.
- **Suggested fix:** Restore the real `data.js` from git history or upstream, and check which script wrote the fixtures.

### UI-002 — All viewports (measured 390, 360, 1366) → Danske antonymer (Modsat) → "FORTSÆT →" is below the fold after every answer
- **Problem:** In every non-speed mode an answer reveals a tall feedback panel (verdict, word pair with speakers, examples, explanation). The only way forward, `#nextBtn` "Fortsæt →", sits under that panel.
  - There is no auto-advance, even on a correct answer.
  - There is no `scrollIntoView` and no focus move.
  - So the user must scroll down on every question, on desktop as well as mobile.
- **Evidence:**
  - m390: feedback `top=775 bottom=1151–1330`; FORTSÆT `top=1168` (vh 844, scrollY 66).
  - d1366: feedback `top=699 bottom=1017`; FORTSÆT `top=1034` (vh 768).
  - Screenshots: `SP\shots\antonyms-m390-fb-full.png` (full page: options, then a ~550 px feedback card, then FORTSÆT at the very bottom), `SP\shots\antonyms-d1366-fb0.png` (viewport shows only the options and the "✗ IKKE HELT" heading).
  - Code: `danish-antonyms-game.html:376-379` (`#nextWrap` after `#feedbackArea`) and `:1299-1304` (only `speed` mode auto-advances).
- **Severity:** Major.
- **Suggested fix:** Do all three:
  - After `showFeedback`, call `$("#nextBtn").focus({preventScroll:true})` and `scrollIntoView({block:'nearest'})`.
  - Put FORTSÆT above the long explanation, or make it sticky at the bottom.
  - Auto-advance on correct (about 800 ms) as the PRD asks. That part is functional, for the functional QA agent.

### UI-003 — All viewports → Ordstillingsdetektiven → puzzle area (word tiles and UNDERSØG) and NEXT below the fold on every statement
- **Problem:** Opening a case renders the case header and story (sprite, title, rank badge, story paragraph, focus line, progress) before the answer box and tiles. The page stays at the top (`scrollY 0`), so the tiles and the UNDERSØG button are below the fold. This repeats for each of the 12 statements. After checking, the NEXT button is below the fold again.
- **Evidence:**
  - d1366: tiles `top=811–859`, `#checkBtn top=883–935`, vh 768; after check, NEXT `top=842`.
  - d1440: `#checkBtn 883–935`, vh 900.
  - m390: tiles `top=1002`, `#checkBtn top=1074`, vh 844; after check, NEXT `top=1087`.
  - Screenshot `SP\shots\ordstil-d1366-caseopen.png` shows the viewport ending at the empty answer box "Tryk på ordene nedenfor…" with no tiles visible. `SP\shots\ordstil-d1366-checked.png` shows the verdict panel continuing past the bottom edge with no button in view.
  - Markup: `ordstilling-detektiv/index.html:326-336`.
- **Severity:** Major.
- **Suggested fix:**
  - Collapse the case story after the first statement (`<details>`), or move it into a modal or intro screen.
  - Scroll `#answer` into view in `loadQuestion()`, and scroll `#nextBtn` into view in `showExplain()`.

### UI-005 — All viewports → Verb-glosekort (flashcards) → "START FORFRA" wipes all progress without confirmation, right under the answer buttons
- **Problem:** `#restart-btn` resets every card's status, the score and the saved localStorage progress in one tap. There is no confirmation. The PRD says "reset needs confirmation".
  - On mobile it sits 28 px below the large "DET VIDSTE JEG / DET VIDSTE JEG IKKE" buttons, so a mis-tap is easy.
  - `GENTAG FEJLENE` is right below it.
- **Evidence:**
  - Code: `danish_flashcards/danish_flashcards_game/script.js:609-623` resets the statuses and calls `saveProgress()`. When clicked, no `dialog` event fired (verified in `modals.mjs`).
  - m390: answer buttons y=730–834, restart y=862–910.
  - Screenshot `SP\shots\flash-m390-restart.png`.
- **Severity:** Major. Silent loss of saved progress.
- **Suggested fix:**
  - Add a `confirm("Vil du starte forfra? Dine fremskridt nulstilles.")`, matching magiske verber and ordstilling.
  - Visually separate the button from the answer row (more spacing, ghost style, or move it into a menu).

### UI-008 — Mainly mobile 360–390 → Præpositionsmester, Ordstillingsdetektiven, Modsat (antonyms), Magiske verber → headings break mid-word without a hyphen
- **Problem:** Display headings use `overflow-wrap:anywhere`, and `hyphens:auto` does not produce Danish hyphenation in Chrome. Long words therefore split at arbitrary letters, which looks broken and is hard to read for learners.
- **Evidence:**
  - Breaks seen: "PRÆPOSITIONSME|STER" (390) / "PRÆPOSITIONSM|ESTER" (360), "ORDSTILLINGSDETEKT|IVEN" (390), "MODSA|T" and "INDSTILLINGE|R" (antonyms header at 360), "FØRNUTIDSBYGGERE|N" (verber card at 360).
  - Screenshots `SP\mont\s360a.png` and `SP\mont\m390-praep.png`.
  - CSS: `shared/themes/praepositioner.css:45`, `shared/themes/ordstilling.css:36`, `shared/themes/magiske-verber.css:95`, `shared/themes/antonyms.css:31`.
- **Severity:** Minor.
- **Suggested fix:** Pick one of these:
  - Use `font-size:clamp(...)` small enough that the word fits at 360 px.
  - Insert `&shy;` at compound boundaries ("PRÆPOSITIONS&shy;MESTER", "ORDSTILLINGS&shy;DETEKTIVEN").
  - For the antonyms header, let the INDSTILLINGER button wrap below the title.

### UI-010 — All viewports → Konjunktion Crush, En/Et (Ordenes Vidunderland) → `← MENU` bar is inset instead of full-bleed
- **Problem:** Body padding from the legacy page CSS wraps the shared sticky bar in a coloured frame: lavender in konjunktion, green in en/et. There is a visible strip above it. Every other game has an edge-to-edge bar, so these two look inconsistent and slightly broken.
- **Evidence:**
  - Bar `a.sd-bar-home` at x=24–26, y=24 at d1366 (other games: x=12, y=4).
  - Screenshots `SP\shots\konj-d1366-start.png` (lavender border and stripe around the bar) and `SP\mont\m390-phraser.png` (en/et panel).
  - CSS: `konjunktioner/konjunktioner.html:71` (`padding:14px`), `en og et/index.html:75` (`padding:26px 14px 70px`).
- **Severity:** Minor.
- **Suggested fix:** In the theme files, set `html.sd-page body{padding:0}` and move the padding onto the game container.

### UI-011 — All viewports → Dansk Mester, Ordstillingsdetektiven, Præpositionsmester → English UI strings in feedback and controls
- **Problem:** The UI should be in Danish, but these strings are English:
  - Dansk mester answer badges: "✓ CORRECT" / "✗ WRONG".
  - Ordstil next button after checking: "NEXT ▸" / "FINISH ▸".
  - Præp exercise tag: "MULTIPLE CHOICE".
- **Evidence:**
  - `shared/themes/dansk-mester.css:181-182` (`content:"  ✓ CORRECT"` / `"  ✗ WRONG"`).
  - `ordstilling-detektiv/index.html:1086` (`"Finish ▸":"Next ▸"`); the initial label is "Næste ▸".
  - `dansk-praepositioner.html:946` (`"🎯 Multiple choice"`).
  - Screenshot `SP\mont\vp.png` (dansk mester feedback panel with "✗ WRONG" / "✓ CORRECT").
- **Severity:** Minor.
- **Suggested fix:** Use "✓ RIGTIGT" / "✗ FORKERT", "Næste ▸" / "Afslut ▸", and "Flervalg".

### UI-012 — All viewports → Idiomjæger, Modsat, Pronomenmysteriet, Tidsmaskinen (results screens) → celebration confetti covers score and summary text
- **Problem:** The `Sjovt.fx.celebrate()` confetti is drawn on top of the results numbers and sentences while it runs. The brief says to keep motion off text the learner is reading. It stops by itself, and it is correctly disabled under reduced motion.
- **Evidence:** Screenshots `SP\shots\idiom-m390-end.png` (confetti over "RUNDE SLUT" and the "RIGTIGE SVAR" count) and `SP\shots\antonyms-m390-end.png` (over "Runden er slut – træfsikkerhed: 30 %"). Also `SP\mont\endb.png` (pronomen and tid score tiles).
- **Severity:** Minor (transient).
- **Suggested fix:** Spawn the particles from the trophy sprite area only, or put the result text above the particle layer (`z-index`).

### UI-015 — All viewports → Adverbier (Sætningsbyggeren) → settings and import modals do not take focus
- **Problem:** Opening INDSTILLINGER or IMPORTÉR DATA shows a modal that fits on screen (342×416 at 390 px; LUK / ANNULLÉR ≥44 px), but `document.activeElement` stays on `BODY`. Keyboard and screen-reader users start behind the overlay. Esc handling was not verified.
- **Evidence:** `modals.mjs` output `active: "BODY"` for both modals at m390 and d1366. Screenshot `SP\shots\adverbs-m390-import.png`.
- **Severity:** Minor.
- **Suggested fix:** Focus the first control when opening, trap Tab, close on Esc, and restore focus to the opener on close. `DanskCore.ui.focusTrap` already exists for this.

### UI-016 — All viewports → `pixel-animation.html` → standalone page with no navigation and nothing focusable
- **Problem:**
  - There is no `← MENU` bar, no link back to the portal, and no focusable element (Tab stays on `BODY`).
  - The page is not linked from the portal or the sitemap.
  - Its title is the English "Pixel Animation".
  - It renders correctly and does not overflow at any viewport.
- **Evidence:** `grep sjovt.js|href= pixel-animation.html` → 0. Screenshot `SP\shots\pixel-m390-start.png`.
- **Severity:** Minor. It looks like a demo or asset page.
- **Suggested fix:** Either load `sjovt.js` to get the bar and a Danish title, or move the file out of the published root.

### UI-017 — UNCONFIRMED → 10 games → no visible sound-mute control
- **Problem:** The PRD requires a sound mute. A visible control exists only in:
  - Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen (`#btn-sound` LYD, 53×48)
  - Antonyms (in the settings screen, `#setSound`)

  I found no mute control in adverbs, magiske verber, idiomjæger, præp, flashcards, dansk mester, en/et, forbindeord, konjunktion or ordstil. I did not verify whether these games emit sound effects beyond user-triggered TTS. If they do, this is a Major gap.
- **Evidence:** Grep for `sound|mute|lyd` ids and labels across the game files (see Method).
- **Severity:** Minor (UNCONFIRMED).
- **Suggested fix:** Add a shared LYD toggle to the `Sjovt` bar, wired to `DanskCore.ui` sound (`dc:sound-enabled`). This is a shared-file request.

### Notes (not counted)

- **Dark mode on the portal:** the decorative Game Boy text "TRYK START" has a contrast of 1.62:1. It is decorative, so not counted.
- **Light panels in dark mode:** verber game cards and præp/konj answer buttons stay light on the dark field. They are readable, just a stylistic choice.
- **Pronomenmysteriet layout:** the "SAGSMAPPE" tab label sits close to the sprite. Cosmetic, acceptable.

---

## Counts by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 1 | UI-001 |
| Major | 4 | UI-002, UI-003, UI-004 (desktop), UI-005 |
| Minor | 11 | UI-006, UI-007, UI-008, UI-009, UI-010, UI-011, UI-012, UI-013, UI-014, UI-015, UI-016 |
| Minor (UNCONFIRMED) | 1 | UI-017 |
| **Total** | **17** | |
