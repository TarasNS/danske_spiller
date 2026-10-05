# Implementation Result: Sjovt Dansk QA stories

**Coordinator:** Claude Sonnet 5.5 · **Branch:** `qa-implementation` (PR #3 on `TarasNS/danske_spiller`, draft) · **Baseline:** `0550623` · **Inputs:** `qa/FINAL-QA-REPORT.md`, `stories/QA-USER-STORIES.md`, `stories/IMPLEMENTATION-PLAN.md`, owner decisions in `stories/DECISIONS.md`.

Workers implemented the stories (one owner per file); separate verifier agents checked them; three final regression testers re-tested every game and every P0/P1 story on the committed tree. Per-story records: `stories/implementation/US-XXX.md` (implementer), `VERIFY-*.md` / `VERIFY4-*.md` (verdicts), `FINAL-REGRESSION-F1..F3.md`.

## Execution Summary

| | Count |
|---|---|
| Total stories | 53 |
| **VERIFIED** (independent verifier; every checkable criterion PASS; owner-accepted deviations noted) | 21 |
| **IMPLEMENTED BUT NOT VERIFIED** (all checkable criteria pass or the open criterion needs native-speaker review / an owner decision), of which 2 are **partial** (US-038, US-039: the frozen-file remainder stays BLOCKED) | 27 |
| **BLOCKED** (need approval to edit frozen `shared/sjovt.*` / portal `index.html`, or an owner decision) | 5 |
| Deferred | 0 |
| Newly discovered issues (recorded, not fixed) | 29 (see below) |

Owner decisions taken during the run (10): see `stories/DECISIONS.md`; six were implemented and verified (Adverbier empty zones, Ordstillingsdetektiven first statement, En/Et *øl*, En/Et icons, Sætningsmaskinen docs, Spil focus fix), four need no change.

## Batch Results

| Batch | Stories | Result | Tests | Regressions | Status |
|---|---|---|---|---|---|
| 1 | US-001, 002, 003, 004 | US-004 verified; US-002 failed twice (distractors still valid) then fixed; US-001/003 implemented | per-story verifier scripts, smoke, validate | none | Done |
| 2 | US-005..024 (P1 per game) | 8 verified, 12 implemented (native review); US-013 Ordstilling regression (prompt scrolled out of view at 360x640) fixed; US-022 retry | verifiers per game group | 1 found and fixed | Done |
| 3 | US-025, 035, 036 | US-036 verified; US-025 failed once (`verify:false` without native review) → `verify:true` | explainer matrix, timer-pause probes | none | Done |
| 4 | US-028..034, 037, 041..051 | 10 verified, 8 implemented (native review / owner); retries: Antonymer confetti, Præpositioner 320 px, Forbindeord resume, Tidsmaskinen distractors; Bøjningsværkstedet SPIL overlay fixed after regression R2 | 6 verifiers + re-verifier + R1-R3 | 2 found (SPIL overlay, Spil under MENU bar) and fixed | Done |
| 5 | unblocked parts of US-029, 038, 039 + owner decisions + fixes | shared "Lyt" button, icon map, shared gap/badge/select/surface styles adopted in all 14 games; V5-C found a Major dark-mode gap contrast regression (Bøjningsværkstedet) → fixed (4.86-15.47:1) | 4 verifiers + F1-F3 | 1 found and fixed | Done |
| Final regression | all 16 pages | no P0/P1 regression, no new Major | F1, F2, F3 (14 games × 3 viewports × light/dark, explainer 35 scenes × 4 viewports) | none open | Done |

## Story Results

Owner = file owner agent (one per game). "Verification" = independent verifier verdict; NV = native-speaker/owner criterion not verified. Files: the game's `index.html`/`*.html`, `shared/themes/<game>.css`, data files as named.

| Story | Owner | Final status | Notes |
|---|---|---|---|
| US-001 Restore Pronomenmysteriet data + guard | W-PRON | IMPLEMENTED BUT NOT VERIFIED | data identical to `b9abb96`; guard wired in spec test; spec test still has non-data failures (test bug 'Space toggles a chip', timing flakes) |
| US-002 Forbindeord distractors | W-FORB | IMPLEMENTED BUT NOT VERIFIED | decision #1: accept (distractors now syntactically impossible); native sign-off NV |
| US-003 Tidsmaskinen adverb placement | W-TIDS | IMPLEMENTED BUT NOT VERIFIED | 23 sentences fixed; stilted clause-final "allerede" for native review |
| US-004 Storage guards (3 games) | W-STOR | **VERIFIED** | |
| US-005 Adverbier core loop | W-ADV | **VERIFIED** | |
| US-006 Adverbier TTS | W-ADV | **VERIFIED** | |
| US-007 Adverbier data/categories/notes | W-ADV | IMPLEMENTED BUT NOT VERIFIED | decision #3 (hide empty zones, dataset stays 10 entries); native NV |
| US-008 Idiomjæger crash A2/B1 | W-IDIOM | **VERIFIED** | |
| US-009 Præpositioner Forvekslingspar | W-PREP | **VERIFIED** | |
| US-010 Bøjningsværkstedet shuffle | W-BOEJ | **VERIFIED** | |
| US-011 Glosekort reset confirm | W-GLOSE | **VERIFIED** | |
| US-012 Weak words clearable | W-ENET, W-FORB | **VERIFIED** | both slices |
| US-013 Feedback/Næste in view | W-PREP, W-ANT, W-ORD | **VERIFIED** | all three slices; Ordstilling first statement per decision #4 |
| US-014 Tidsmaskinen contexts/notes | W-TIDS | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-015 Bøjningsværkstedet + shared data | W-BOEJ | IMPLEMENTED BUT NOT VERIFIED | native NV (NON_GRADABLE list etc.) |
| US-016 Magiske Verber auxiliaries/anchors | W-MV | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-017 Glosekort data | W-GLOSE | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-018 Idiomjæger content | W-IDIOM | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-019 Præpositioner answer validity | W-PREP | IMPLEMENTED BUT NOT VERIFIED | native NV; ~69 templates can still show valid padding options (pre-existing class) |
| US-020 Antonymer valid antonyms | W-ANT | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-021 Dansk Mester notes | W-DM | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-022 Forbindeord/Konjunktioner content | W-FORB | IMPLEMENTED BUT NOT VERIFIED | decision #2 (QA-120 sentence kept); QA-119 other `da` distractors UNCONFIRMED; native NV |
| US-023 Ordstilling tips/orders | W-ORD | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-024 En/Et øl | W-ENET | IMPLEMENTED BUT NOT VERIFIED | decision #7 (both accepted); "øllen" form for native review |
| US-025 Missing explainers | W-EXPL-T/P/M | IMPLEMENTED BUT NOT VERIFIED | 17 new scenes, `verify:true` until native review |
| US-026 Shared feedback contract | none | **BLOCKED** | owner decision on helper location / frozen `sjovt.js` |
| US-027 Danish-first content | none | **BLOCKED** | owner decision (`specs.md`); large native-reviewed content task |
| US-028 English UI strings | W-ANT/PREP/GLOSE/FORB/ORD/DM | **VERIFIED** | |
| US-029 One TTS button | W-SHARED + 14 owners | IMPLEMENTED BUT NOT VERIFIED | all 14 games adopted; small inline variant is 32 px visible / 44 px hit area (US-039 asks for 32 px: reading recorded) |
| US-030 Reset with confirmation | W-BOEJ/PRON/TIDS/ENET/FORB | **VERIFIED** | |
| US-031 Focus management | 7 owners | **VERIFIED** | Adverbier uses a local focus trap: owner accepted (decision #6) |
| US-032 En/Et pixel icons | W-ENET | **VERIFIED** | re-picked per decision #8; several sprites remain approximate |
| US-033 Emoji → sprites | W-IDIOM, W-DM | **VERIFIED** | |
| US-034 MENU bar full-bleed | W-KONJ, W-ENET | **VERIFIED** | |
| US-035 Explainer gaps + badge gate | W-EXPL-M/S | IMPLEMENTED BUT NOT VERIFIED | sin-hans native review (U-03) NV |
| US-036 Explainer modal polish | W-EXPL-S | **VERIFIED** | one low defect (Tidsmaskinen auto-advance when opened within ~800 ms) recorded |
| US-037 Layout polish | 8 owners + retries | **VERIFIED** | |
| US-038 Icon system polish | W-ICONS + 14 owners | IMPLEMENTED BUT NOT VERIFIED (partial) | icon map + identity sprites done; redraw of generic sprites BLOCKED (frozen `sjovt.js`) |
| US-039 Shared UI parts | W-SHARED + 14 owners | IMPLEMENTED BUT NOT VERIFIED (partial) | gap/badge/select/surface/small TTS/back wording done; bar arrow, portal, grid token, results component BLOCKED |
| US-040 Theme/sound controls | shared bar + 5 games + portal | IMPLEMENTED BUT NOT VERIFIED | theme (`sd:theme`) and mute (`dc:sound-enabled`) in the `.sd-bar` on every bar page; per-game toggles removed; portal themeBtn persists; U-06: no auto-play found |
| US-041 Cancel timers | W-ANT, W-BOEJ, W-DM | **VERIFIED** | |
| US-042 Missed items first | W-PRON, W-BOEJ | **VERIFIED** | |
| US-043 Glosekort polish | W-GLOSE | **VERIFIED** | |
| US-044 Præpositioner XP + language | W-PREP | IMPLEMENTED BUT NOT VERIFIED | decision #5: 10 XP per hit; native NV for wording |
| US-045 Antonymer Find-par + language | W-ANT | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-046 Dansk Mester TTS + language | W-DM | IMPLEMENTED BUT NOT VERIFIED | native NV; level relabel A1-B2 |
| US-047 En/Et polish + language | W-ENET | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-048 Forbindeord resume | W-FORB | **VERIFIED** | after one retry; level alignment/placement owner items open |
| US-049 Konjunktioner Enter + language | W-KONJ | IMPLEMENTED BUT NOT VERIFIED | native NV |
| US-050 Language polish (5 games) | 5 owners | IMPLEMENTED BUT NOT VERIFIED | portal slice BLOCKED (frozen); decision #10: six duplicates kept; native NV |
| US-051 Latent data cleanup | W-DATA | IMPLEMENTED BUT NOT VERIFIED | generators removed (99 hand-written Sætningsmaskinen items); authoring to the target needs new content + native review; docs updated per decision #9 |
| US-052 pixel-animation.html | none | **BLOCKED** | owner decision |
| US-053 Design docs refresh | none | **BLOCKED** | owner approval |

## Blockers

| Story | Blocker | Required action |
|---|---|---|
| US-026 | where the shared feedback helper lives; frozen `shared/sjovt.js` | owner decision (or approval to edit `sjovt.js`) |
| US-027 | `specs.md` decision; native-reviewed content | owner decision + native speaker |
| US-052 | decide: remove from deploy set or reskin | owner decision |
| US-053 | docs under owner control (`AGENT-BRIEF`, `CLAUDE.md`) | owner approval |
| US-038 remainder | redraw of the 9 generic sprites (32 px stats/difficulty/stopwatch) | approval to edit frozen `shared/sjovt.js` |
| US-039 remainder | bar arrow, portal radius/theme button, grid/bar-height token, shared results component, glyph coverage | approval to edit frozen `sjovt.css`/`sjovt.js`/`index.html` + a design decision for the results component |
| US-050 portal slice | frozen `index.html` | owner approval |
| 27 "not verified" stories | native-speaker sign-off on changed Danish; sin-hans + 18 `verify:true` scenes | native speaker |
| Sætningsmaskinen data | ~920 items to reach the target | native-reviewed content authoring |

## Newly Discovered Issues (recorded only; not in any story)

| Issue | Severity | Area | Evidence | Recommended next action |
|---|---|---|---|---|
| Adverbier zone "Sætningsbygning" can never unlock (needs level 5, top index 4) | Major (pre-existing) | Adverbier | FINAL-REGRESSION-F1 N1 | story: fix unlock level or zone threshold |
| Feedback + Næste below the fold after every answer (Magiske Verber, Idiomjæger; Adverbier note off-screen) | Major (pre-existing) | Gameplay/UI | F1 N2 | story like US-013 for these 3 games |
| Dansk Mester wrong-answer note below the fold at 1366x768/360x640 while auto-advance runs in ~1.5 s | Major/P2 (pre-existing) | Dansk Mester | R2 N2, F2 | story: keep note in view / pause advance |
| Præpositioner "Find fejlen" always scores correct on single-preposition sentences | Minor (pre-existing) | Præpositioner | F1 N13 | investigate |
| Idiomjæger main-menu "← TILBAGE" is a no-op (baseline no-op "Jagtmenu"; relabelled in Batch 5) | Minor | Idiomjæger | F1 N9 | remove the control on the menu or give it a target |
| Cancelling Glosekort's reset confirm clears the green/red feedback line | Minor (new) | Glosekort | F2 | one-line fix |
| Bøjningsværkstedet SPIL (no longer sticky) can end up under the MENU bar after a scripted scroll | Minor/uncertain (new) | Bøjningsværkstedet | F2 | check by hand on a device |
| Idiomjæger keyboard focus is BODY on every screen; Dansk Mester focus drops to BODY after each render | Minor (pre-existing) | Idiomjæger, Dansk Mester | F1, F2 | extend US-031 |
| Forbindeord at 360x640: page stays scrolled after NÆSTE (sentence/Lyt under the MENU bar) | Minor | Forbindeord | F2 | scroll reset |
| Konjunktioner: Næste below the fold at 1366x768; focus on body at game over | Minor | Konjunktioner | F3 | extend US-013/031 |
| En/Et: Enter on a focused Lyt button advances the question (Space works); no ~800 ms auto-advance outside speed mode | Minor/P2 | En/Et | F2 | with US-026 |
| Praise/consolation text in Dansk Mester and En/Et (PRD) | P2 (pre-existing) | Cross-game | R2/F2 | US-026 (blocked) |
| Glosekort: ~150 Tab stops before the answer buttons; C1 filter does nothing | Minor | Glosekort | F2 | story |
| Portal: MØRK button overlaps the title at 360 px; theme choice not remembered | Minor | Portal (frozen) | F1 N7/N10 | needs frozen-file approval |
| Antonymer "INDSTILLINGER" breaks mid-word at 360 px; Præpositioner title breaks mid-word at 320 px (below minimum) | Minor | Layout | F1 N8/N11 | polish |
| Adverbier: two identically labelled "Lyt" buttons in feedback; gap question wraps "." to its own line at 390 px; review is a single pass | Minor | Adverbier | F1 N4/N12 | polish |
| Dansk Mester still shows "Fortsæt ▸" (its report says "→") | Minor | Dansk Mester | V5-A | one-line fix; implementer report was inaccurate |
| Light surfaces remain in dark mode outside the QA-070 list: Præpositioner `.opt`/`.drop`, Forbindeord `.opt`, Ordstilling cards/tiles, Adverbier locked zones | Minor | Dark mode | V5-C | extend US-039 per-game |
| Dead `.blank` CSS rules remain (Magiske Verber, Bøjningsværkstedet, Pronomenmysteriet) | Info | CSS | V5-C | cleanup |
| Tidsmaskinen: opening the explainer within ~800 ms of a correct answer lets the game's auto-advance run behind it; countdown text can flicker by 1 s | Low/Info | Tidsmaskinen | VERIFY-US-036, F3 O2 | follow-up |
| Ungrammatical Tidsmaskinen passive items ("Der bliver spist ikke i klassen", …) | Major content (pre-existing) | Language | VERIFY-US-003/050 | native speaker + story |
| Other Præpositioner/Konjunktioner items still offer valid alternatives (`da` in når items, padding options) | Major content (pre-existing class) | Language | VERIFY-US-019/022 | native-reviewed story |
| Bøjningsværkstedet `b5-deres-bil`/`b5-deres-boern` need *sin/sine* (reflexive) | Major content (pre-existing) | Language | VERIFY-US-015 | story |
| `DanskCore.ui.focusTrap` counts a hidden textarea as focusable | Minor (shared) | Shared | V4-D | fix helper (shared, test 3 games) |
| Tests: `tests/pronomenmysteriet.mjs` 'Space toggles a chip' is a test bug; `tests/tidsmaskinen.mjs` 'timed expiry: no SRS write' and auto-advance rows are flaky; spec tests write dump files into the repo | Minor | Tests | V4-A, V4-F | fix tests |
| Several icons are approximate (`ur`, `tryllestav`, flat `stjerne`/`pokal` at half scale), `terning` used 3 times | Minor | Icons | VERIFY-B5-US038 | needs new sprites (frozen) |
| `SCRATCHPAD.md` still says saetning-data completed (1,020) | Info | Docs | D-DOCS | append-only log: leave or owner note |
| The ten `verify:true` nouns (8 correct forms) are filtered out of Mode 1; clearing flags restores them | Info | Bøjningsværkstedet | VERIFY4-US-050-boej | native speaker clears flags |
| Untracked/modified `.claude/*` files in the working copy (`agents/*`, `skills/agent-delegation`) are not part of this work | Info | Repo | git status | owner |

Process incidents: two agents ran `taskkill` on `node.exe` (and `msedge.exe` once); one worker's final message was an empty "placeholder" (its reports were fine); an agent staged `CLAUDE.md` (reversed before committing); several implementer reports claimed checks that verifiers could not reproduce (the dark-mode gap, the SPIL overlay, "pre-existing" 320 px scroll), which is why every story had an independent verifier.

## Regression Results (final, committed tree `b0083ce`)

- **Gameplay:** every mode of every game starts, scores, completes and restarts; both feedback paths work; reload persistence and blocked localStorage (throwing getter and methods) OK in all games. **PASS.**
- **Content:** Pronomenmysteriet shows only restored real data (byte-identical to `b9abb96`); Tidsmaskinen/Forbindeord/other P0/P1 content criteria re-test PASS; Danish correctness itself is UNCONFIRMED until native review.
- **Video/explainers:** 10 games × 35 scenes × 4 viewports: 43/43, `verify` badge hidden in production, timers pause/resume. **PASS.**
- **Desktop / Mobile:** no horizontal scroll (also 320 px where tested), targets ≥44 px (small inline listen button: 44 px hit area), dark mode readable for gaps/badges/selects. **PASS** (minor items above).
- **Visual consistency:** one listen button, one icon map, shared gap/badge/select styles; remaining density mixes and approximate icons recorded. **PASS with recorded limits.**
- **Shared components:** `dansk-core.js` (`ttsButton`) tested in 4 consumers + all call sites; `shared/explainer/*` tested in all 10 games; new `shared/tts-button.css`, `shared/sd-extras.css` verified. Frozen files untouched (`git diff` empty). **PASS.**

## Final Readiness Verdict

**READY FOR FINAL MANUAL QA**

All implementable P0/P1 stories are fixed; their machine-checkable criteria were independently verified and the final regression found no P0/P1 defects. It is **not READY TO PUBLISH**: (1) none of the changed Danish content has had native-speaker review (27 stories depend on it), (2) several pre-existing Major issues have no story yet (listed above), and (3) five stories and the frozen-file remainders await owner decisions or approval.

## Update 2026-10-05: native review accepted, round 2 merged into the branch

- **Native-speaker review:** the owner reports the reviewer accepted all changed Danish content, with no corrections (decision #14 in `stories/DECISIONS.md`). The 18 explainer scenes that were `verify:true` are now `verify:false`.
- **Round 2** (`stories/QA-USER-STORIES-2.md`, plan `stories/IMPLEMENTATION-PLAN-2.md`): US-054, 055, 056, 057 implemented and independently VERIFIED, plus a cleanup batch; US-058..061 (content) remain READY FOR DEVELOPMENT.
- **Story status now (53 stories in `QA-USER-STORIES.md`):** 43 VERIFIED, 2 VERIFIED-partial (US-050 portal slice and US-051 authoring are BLOCKED), 1 IMPLEMENTED BUT NOT VERIFIED (US-029: the small inline listen button is 32 px visible with a 44 px hit area), 2 IMPLEMENTED BUT NOT VERIFIED-partial (US-038, US-039: frozen-file remainder BLOCKED), 5 BLOCKED (US-026, 027, 040, 052, 053).
- **Verdict:** the native-review condition is met; remaining work before publishing is the blocked stories (owner decisions / frozen files), US-058..061, and the pre-existing items listed above. Updated verdict: **READY FOR FINAL MANUAL QA** (manual play-through on real devices is the last step that was never done).
- Pull requests: fork #3 (round 1, draft), fork #4 (round 2, stacked on #3), upstream **tasio1/danske_spiller#10** (both rounds, draft).

## Update 2026-10-05 (later): owner decisions unblock the remaining stories

- **Decisions #15-40** in `stories/DECISIONS.md` cover every story that was BLOCKED: US-026 (#15-18), US-027 (#19-22), US-040 (#23-26), US-052 (#27), US-053 (#28-31), US-038 remainder (#32-34), US-039 remainder (#35-37), US-050 portal slice (#38-40). Frozen-file approvals are scoped to the named story only.
- **US-052:** done. `pixel-animation.html` moved to `docs/redesign/pixel-animation.html` (design reference, out of the published root). Status IMPLEMENTED.
- **US-040 report (IMPLEMENTED BUT NOT VERIFIED):** theme (`sd:theme`, OS default) and sound-effects mute (`dc:sound-enabled`) live in the shared `.sd-bar` (`shared/sjovt.js` + `sjovt.css`), applied before first paint; `DanskCore.ui.darkMode/sound` delegate to the same keys. Removed: Adverbier `#darkToggle`, Bøjningsværkstedet/Pronomenmysteriet/Tidsmaskinen `btn-dark`/`btn-sound`, Antonymer `#setSound` (its TTS is no longer gated). The portal has no bar, so its `themeBtn` stays and now persists through `Sjovt.theme`. Headless Edge check (8 pages): reload persistence, portal carry-over, mute persistence, 44 px targets, blocked storage: all pass. `tests/pronomenmysteriet.mjs` 66/66, `tests/tidsmaskinen.mjs` (persist/kbd/theme/boot) 51/51, both updated to the new bar button ids; the full tidsmaskinen suite exceeds 9 min and its "auto-advance 700-1000 ms" check is timing-flaky on this machine (max 1.6-1.8 s outliers). U-06: no TTS auto-play without a gesture found.
- **Now READY FOR DEVELOPMENT:** US-026, US-027, US-040, US-053, and the remainders of US-038, US-039 and the US-050 portal slice.
- **US-053 progress:** the "Pixelify Sans" fallback is already absent from `shared/explainer/modal.css` (no change needed); `CLAUDE.md` gets the stale `lærerene` note removed and is committed (decision #30). `AGENT-BRIEF.md` / `TEST-REPORT.md` rewrite follows the US-040/039/038 work so the brief describes the final design.
- **Still open (owner):** US-051 authoring (~920 Sætningsmaskinen items, after release); US-029 acceptance of the 32 px visible / 44 px hit-area listen button. US-027 still needs the `specs.md` wording (owner, or explicit approval).
- **Planned order:** US-040 → US-039 → US-038 → US-050 portal → US-053 docs (shared files, sequential); US-026 helper then per-game rollout (one PR per game, folding in each game's recorded focus/Enter/Næste/"Fortsæt ▸"/reset issues); US-058..061 and US-027 content in parallel; then the unstoried issues, final regression, manual device play-through, and the PRs marked ready.
