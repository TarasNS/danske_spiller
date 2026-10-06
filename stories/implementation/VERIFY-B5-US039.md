# VERIFY-B5-US039 (V5-C): shared UI parts, unblocked slice

Verifier: V5-C (independent). Scope: `shared/sd-extras.css`, `shared/tts-button.css`, per-game adoption (B5a incl. Retry, B5b-*). Out of scope (BLOCKED, frozen): bar/explainer/portal pixel arrows, portal radius/theme button, shared results component, grid/bar-height token, arrow glyph coverage.

Method: Edge (puppeteer-core), 14 games x 1366x768 / 390x844 / 360x640 x light + dark (prefers-color-scheme emulation), 3.2 s wait after load, real play to the relevant screens (menu, question, feedback, results/stats, level screens, back screens). Probe computes text/background contrast (composited ancestors), badge hue, select appearance/height/chevron, `.dc-tts-button` size, back controls (text + CSS `::before` + text-transform) and, in dark, every large element with a light fill. Screenshots viewed for all four outlier games and the problem screens. Scripts and ~700 screenshots in `scratchpad\impl\v5c-ui\` (`lib.cjs`, `run.cjs`, `advflow.cjs`, `gloseflow.cjs`, `idiomtts.cjs`, `hit.cjs`, JSON dumps). HEAD copy for Idiomjæger via `git archive` into the scratchpad only.

Frozen files: `git diff HEAD -- shared/sjovt.css shared/sjovt.js index.html prd.md` is empty. PASS.
Repo hygiene: `git status` shows no stray files from me (only untracked implementer/verifier reports and the two new shared CSS files).

## Per-criterion table (US-039, in-scope criteria)

| Criterion (verbatim) | Result | Evidence |
|---|---|---|
| A single `.sd-gap` style is used in the 4 games | PARTIAL | Adopted in all 10 games that have blanks (ADV, BOEJ M5/M6, ENET, FORB, IDIOM x2 modes, KONJ, MV, PREP, PRON, TIDS), identical dashed 4px underline box, "?" when empty, `is-filled/is-ok/is-bad`. Empty, ok and bad contrast measured >= 4.5 everywhere EXCEPT Bøjningsværkstedet M5/M6 filled gap in dark mode: text `#101010` on `--sd-ok-bg`/`--sd-bad-bg` which are DARK in dark mode (`rgb(18,51,28)` / `rgb(58,16,32)`): contrast 1.37:1 (ok) and 1.16:1 (bad); screenshot `boej-gap-dark.png` shows the answer is barely legible. See issue I-1. Contrast table below. |
| Level badges use `.sd-badge`; green and red are reserved for feedback | PASS | `sd-badge sd-badge--panel` on ORD (rank, tier pills, level badges, FINALE), KONJ (legend + category chip), FORB `#cat`, PREP mode/theme badges, TIDS `.case-tag`, IDIOM `lvl-badge`, MV result badges. Computed backgrounds are panel tokens (hue neutral or the game's dark tint), text contrast 12.2-18.2. No green/red level or category colour left (grep of per-level colour rules: `.t-*`, `.lb-*` removed; hue scan of all badge-like elements shows only game-accent hues). Level/category is told apart by TEXT ("A1 · SAG 1-3", "Hovedsætning/Bisætning/Hv-ord"); still readable, see notes. |
| One documented dark-surface rule is applied to the 4 outlier games | PASS (with notes) | Rule documented in `sd-extras.css` section 4 (`.sd-surface` / panel tokens, game colour as accent). Viewed dark menu/question/feedback/results: MV (menu cards, difficulty, question, result) dark panels; PREP (menu cards dark with colour top stripe); DM (home, path, modes, question, feedback, match, flash front) dark; Glosekort (front card dark; review mode dark). Remaining light surfaces listed in the dark-surface section below: PREP `.opt`/`.drop`/inputs are white (recorded by implementer, not in the outlier list but an outlier symptom), DM earned `.ach` card, flash back face and sprite wells are peach accents. |
| Selects use `appearance:none` with a pixel chevron | PASS | All 7 selects in the repo (IDIOM `#fPlayLvl`, `#fCat`, `#fLvl`, `#fMast`; DM CEFR; PREP `#lvlSel`; KONJ `#lvlSelect`): `appearance:none`, background-image data-URI chevron, height 48px, padding-right 44px, panel background in dark (e.g. IDIOM `rgb(19,44,37)` + cream text 12.4; DM `rgb(49,32,19)` 13.0; PREP `rgb(20,43,47)`; KONJ `rgb(34,33,49)` 13.2). `grep -n select shared/themes/*.css`: no `!important` on background/colour left; IDIOM theme `select, input[type=text]` rule (line 107) now only gives font/min-height/box-shadow (it loses to `.sd-select` for bg/colour); DM keeps `border/radius/font !important` only. Chevron viewed in IDIOM learn screen at 360. |
| Idiomjæger inline TTS uses the small variant | PASS | Explanations (2 call sites), learn/dictionary idiom title and example use `dc-tts-button dc-tts-button--sm` (32x32 visible, `::after` 44x44). Line rhythm vs HEAD (`git archive` copy, same viewport): HEAD button 44x44 with 4px margins gave line pitches 37-38 px in text rows (e.g. `.explain` pitches 37,24,23,37,38,23 at 360); now 23-26 px with `line-height` unchanged (25.2 / 24 / 23.25 px computed both times), margins -6px. Hit area real: `elementFromPoint` 5 px outside the 32px box on all four sides returns the button, 8 px outside does not. Frame overlap: at 360 px the 32px frame sticks 3.5 px above/below its line box and touches the next/previous line on wraps (probe `textOverlap=1` on 6 of the sampled rows); screenshot `itx-NOW-explain.png` shows the frame close to but not covering glyphs. Quiz prompt button and match items are the normal 48px button (match items were `small` 44 at HEAD, now 48; see I-4). |
| Every in-game back control uses one glyph and one wording ("← TILBAGE"; ✕ only to quit a round) | PARTIAL | Glyph: ← everywhere for back (no `‹`, `⟵` left); ✕ only on round quits (ANT/DM "✕ Afslut", MV "✕ Forlad spil", BOEJ/PRON/TIDS bare "✕" with aria "Tilbage til start" which quits the round). Wording "← TILBAGE" (CSS uppercase) in ANT, ENET, IDIOM, MV, ORD, ADV ("← Tilbage"), DM ("← Tilbage"), PREP ("← Tilbage"), BOEJ/PRON/TIDS empty states. Still deviating: FORB "← Tilbage til normalt spil"; GLOSE "Tilbage til hele bunken" with CSS-generated "← " (computed `::before` `"← "`, uppercase; the arrow is not in the DOM text, visible only; text differs from "TILBAGE"); quit wording is not one wording (AFSLUT / FORLAD SPIL / bare ✕); end-of-round buttons "Menu" (IDIOM, PREP), "Hovedmenu" (MV), "Til menuen" (ENET), "Tilbage til menu" (PREP) are results-screen buttons (results component BLOCKED). KONJ has no in-game back (bar only). See I-3. |
| Frozen files untouched | PASS | empty diff, see above |
| No horizontal scroll, no console errors, smoke | PASS | 0 h-scroll and 0 console/page errors in 14 games x 6 configs x all visited screens (~540 probes). `tests/smoke.mjs` run per game: BOEJ, PRON, TIDS, ORD (`.casebtn`) Verdict PASS (29/29); the 10 legacy games show 13 PASS / 8 FAIL where every FAIL row is a known legacy artefact row (name filter on `#btn-play` / "console clean + still playable" leaves no other FAIL). localStorage-blocked, contrast, focus ring rows PASS in all. |
| Out of scope (BLOCKED): pixel arrows, portal radius/theme button, shared results component, grid/bar-height token, arrow glyph coverage | BLOCKED | not assessed, not failed. Observed only: ORD still shows "Næste ▸" / "▸ GENOPBYG" (glyph coverage, BLOCKED); end screens still differ (BLOCKED). |

## Contrast of `.sd-gap` (computed, text vs composited background)

| Game | Empty light | Empty dark | Filled ok light/dark | Filled bad light/dark |
|---|---|---|---|---|
| Magiske Verber | 14.4 | 11.4 | gap is never marked ok/bad (stays plain) | n/a |
| Præpositioner | 16.0 | 9.7 | 15.5 / 11.6 | 13.9 / 13.75 (new red wrong gap, readable; shows correct word in red, owner should judge semantics) |
| Idiomjæger | 16.0 | 9.7 | gap never filled by game | n/a |
| Bøjningsværkstedet M5/M6 | 17.6 | 12.9 | 15.5 / **1.37 FAIL** | 13.9 / **1.16 FAIL** |
| Forbindeord | 16.8 | 9.1 | 15.5 / 11.6 | n/a (filled always ok) |
| Konjunktioner | 14.9 | 10.9 | 15.5 / 11.6 | 13.9 / 13.75 |
| Pronomenmysteriet | 18.3 | 18.3 | 10.4 / 10.4 | 8.9 / 8.9 (pinned colours inside the cream `.target`) |
| Tidsmaskinen (cream `.target` box) | 15.9 | 15.9 | 15.5 / 15.5 | 13.9 / 13.9 |
| En/Et | 15.9 | 9.8 | gap stays "?" after answer (unchanged behaviour) | n/a |
| Adverbier | 14.6 | 11.25 | gap replaced by feedback block after answer | n/a |
No old `.blank` look remains visible. Dead/leftover `.blank` rules (not used by the markup): `magiske_verber.html:199,201`; `boejningsvaerkstedet/index.html:288-295` and theme `:114` (`.context .blank`; the `.frame .blank` Mode 3 use is legitimate); `pronomenmysteriet/index.html:65-69` (inline). Tidsmaskinen still carries `.blank` as an extra class with inline rules (`index.html:72-76`) and theme `.blank.done-*` animation/marker rules that DO still apply (not dead). Forbindeord keeps the class `blank` on the element with no rules (harmless).

## Dark surfaces: all 14 games (light fills still present in dark, probe + screenshots)

| Game | Remaining light fills in dark | Judgement |
|---|---|---|
| Magiske Verber (outlier) | none besides sprite plates and the purple timer chip | Fixed |
| Præpositioner (outlier) | `.opt` buttons white (incl. `.opt.dim`), `.drop` zone white, text inputs white, cyan `.dex` bar and primary buttons | Menu cards FIXED. `.opt`/`.drop` white in dark is the same QA-070 symptom (not listed as outlier surface by the story, left by implementer): Minor remaining |
| Dansk Mester (outlier) | peach sprite wells (`.pico/.mico/.aico`), `.ach` earned card, `.face.back` (flash back side) | Home/path/modes/question/feedback/match viewed dark. Wells and earned badge are intentional accents; `.face.back` is a light card in dark (answer side), judged accent but arguable: Minor, owner decision |
| Glosekort (outlier) | `li.now` yellow marker, review/"Gentag fejlene" cream button (disabled state) | Card front now panel, back intentionally dark: Fixed |
| Forbindeord | `.opt` option buttons cream (7.3) / white in weak mode | Not in outlier list, same symptom: Minor, report |
| Ordstillingsdetektiven | map cards, filter buttons, stat boxes, word tiles white, feedback card light green | Not in outlier list, large light surfaces in dark: Minor, report |
| Adverbier | locked zone buttons cream (7.3) | disabled-state accent: Minor |
| En/Et | answer input white, xpm/active buttons green, `Svar` disabled cream | inputs normal, accents: info |
| Idiomjæger | text inputs white, mint primary tiles/mem-cards (accent fills), earned badge mint | accents/inputs: info |
| Konjunktioner | lavender `.candy` answer buttons (dark text 11.7) | accent: info |
| Antonymer | pink prompt card and "Fortsæt" button | accent fills with dark text 10.3: info |
| Pronomenmysteriet | cream/tan `.target` evidence card | by design, text readable: info |
| Tidsmaskinen | cream `.target` card | by design (QA-070 not listed), readable: info |
| Bøjningsværkstedet | none | clean |

## Per-game table

| Game | Gaps | Badges | Select | Dark surface | TTS / back | Console / h-scroll | Smoke | Verdict |
|---|---|---|---|---|---|---|---|---|
| Adverbier | PASS (sd-gap, 14.6/11.25; found 3 of 6 runs, random question type) | n/a | n/a | locked zones cream (Minor) | back "← Tilbage" | clean | legacy rows only | PASS |
| Antonymer | n/a | chips are stats, not levels | n/a | accents | "← TILBAGE" x4, "✕ Afslut" | clean | legacy rows only | PASS |
| Bøjningsværkstedet | FAIL dark filled ok/bad (1.37 / 1.16) | n/a (level chips are toggles) | n/a | clean | "✕" quit + "← TILBAGE" | clean | 29/29 PASS | FAIL (I-1) |
| Dansk Mester | n/a | n/a | PASS (48px, chevron, dark panel) | PASS (accents noted) | "← Tilbage", "✕ Afslut" | clean | legacy rows only | PASS |
| En/Et | PASS | n/a | n/a | inputs/accents | "← TILBAGE" | clean | legacy rows only | PASS |
| Forbindeord | PASS | PASS (`#cat` panel) | n/a | `.opt` cream (Minor) | "← Tilbage til normalt spil" (wording) | clean | legacy rows only | PASS with Minor |
| Glosekort | n/a | n/a | n/a | PASS | "← " CSS prefix + "Tilbage til hele bunken" | clean | legacy rows only | PASS with Minor |
| Idiomjæger | PASS | PASS (`lvl-badge` panel) | PASS x4 | accents | sm TTS PASS; "← TILBAGE" | clean | legacy rows only | PASS |
| Konjunktioner | PASS | PASS (legend neutral) | PASS | accents | no back control | clean | legacy rows only | PASS |
| Magiske Verber | PASS | PASS | n/a | PASS | "← TILBAGE", "✕ Forlad spil" | clean | legacy rows only | PASS |
| Ordstillingsdetektiven | n/a | PASS (neutral, text-distinguished) | n/a | white cards in dark (Minor) | "← TILBAGE" x4 | clean | PASS (`.casebtn`) | PASS with Minor |
| Præpositioner | PASS (new red wrong gap readable) | PASS | PASS | PASS for cards; `.opt` white (Minor) | "← Tilbage" x4 | clean | legacy rows only | PASS with Minor |
| Pronomenmysteriet | PASS | n/a | n/a | by design | "✕" quit, "← TILBAGE" empty | clean | 29/29 PASS | PASS |
| Tidsmaskinen | PASS (cream target ok) | PASS (`case-tag`) | n/a | by design | "✕" quit, "← TILBAGE" empty | clean | 29/29 PASS | PASS |

Level distinguishability after losing per-level colour: Ordstilling map cards show the level as a text badge "A1/A2/B1/B2/FINALE", tier pills "A1 · Sag 1-3"; the filter row is still coloured per level-filter toggle (white buttons, active pink), the screen reads well. Konjunktioner legend/chip distinguish Hovedsætning / Bisætning / Hv-ord by text only; reads well in light and dark. No usability regression found; trade-off is the intended VIS-019 one.

## Issues

| Id | Severity | Issue |
|---|---|---|
| I-1 | Major (regression, readability/a11y; QA-068 criterion fail in dark) | Bøjningsværkstedet M5/M6: after answering, the filled `.sd-gap.is-ok/is-bad` in dark mode has text `#101010` on the dark `--sd-ok-bg` / `--sd-bad-bg` (`shared/themes/boejningsvaerkstedet.css:165-166`, forced `color:#101010` written for the light tokens). Contrast 1.37:1 / 1.16:1, the learner's answer is nearly invisible (✓/✗ prefix and the option buttons still signal correctness). B5b-BOEJ claimed "verified at 360 dark": not reproduced; viewed `boej-gap-dark.png`. Fix: drop the forced colour so `--sd-text` applies in dark (or scope the dark pair). |
| I-2 | Minor | Remaining light-in-dark surfaces beyond the 4 listed outliers: Præpositioner `.opt`/`.drop`, Forbindeord `.opt`, Ordstilling cards/tiles, Adverbier locked zones; Dansk Mester `.face.back`/`.ach` accents. QA-070 text only names 4 games, so not a fail, but "one dark-surface rule" is not applied to these. |
| I-3 | Minor | Back wording not fully one: FORB "Tilbage til normalt spil", GLOSE "Tilbage til hele bunken" (arrow only via CSS `::before`, so text-only readers and the DOM lack the glyph), quit wording split (AFSLUT / FORLAD SPIL / bare ✕), results buttons "Menu/Hovedmenu/Til menuen/Tilbage til menu". The Glosekort CSS prefix achieves the glyph visually but not the wording; judged PARTIAL against the criterion (it is an exit-review control, so a long label is defensible, owner call). |
| I-4 | Minor | Idiomjæger match-item TTS was the small 44px `speaker small` at HEAD, now the normal 48px button (`match` rows get taller, e.g. 76-100 px). Not inline in running text, so criterion unaffected; spacing change only. |
| I-5 | Minor | At 360 px the 32px `sm` frame (sticks out 3.5 px vertically) touches the adjacent line on wrapped Idiomjæger text; glyphs not covered. Line pitch fixed (23-26 vs 37-38 at HEAD); one pitch of 26 (3 px extra) appears in the explanation. |
| I-6 | Minor | Præpositioner: wrong answers now colour the gap red but fill it with the CORRECT word (red box showing the right answer), same in Konjunktioner; semantics worth an owner look (implementer already flagged for PREP). |
| I-7 | Info | Dead `.blank` CSS: MV `:199,201`, BOEJ inline `:288-295` and theme `:114`, PRON inline `:65-69`. Non-colour cue ✓/✗ exists only in BOEJ/PRON/TIDS gaps (pre-existing; others rely on colour + option state). En/Et gap bg is green-tinted because its theme panel tone is green (game accent, not feedback). |
| I-8 | Info | Process: my first batch used `pkill` which does not exist here (no process was killed); my stale jobs ended by themselves. |

Not verified: native TTS voice behaviour; Android; before/after of every screen at HEAD (HEAD copy used only for Idiomjæger line-rhythm); Adverbier gap in light at 1366/390 (random question type did not appear within 60 tries; light verified at 360, dark at 1366/390/360); Magiske Verber filled/ok/bad gap states (game never sets them).

Verification: FAILED. Reason: US-039 criterion "A single `.sd-gap` style is used" fails in practice for Bøjningsværkstedet M5/M6 filled gaps in dark mode (contrast 1.37:1 / 1.16:1, I-1); the back-control criterion is PARTIAL (I-3). All other in-scope criteria (badges, selects, Idiomjæger small TTS, dark-surface rule for the 4 outliers, frozen files untouched, no console errors/h-scroll, smoke) PASS; frozen-file items are BLOCKED and not counted.
