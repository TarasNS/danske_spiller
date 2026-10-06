# Implementation Plan: Sjovt Dansk QA stories

**Coordinator:** Claude Sonnet 5.5. **Input:** `stories/QA-USER-STORIES.md` (53 stories), `qa/FINAL-QA-REPORT.md`.
**Branch:** `qa-implementation` (created from `feature/explainer-pronomenmysteriet` @ `0550623`; no tracked changes at start, only untracked `CLAUDE.md`, `qa/`, `stories/`). Baseline for diffs = `0550623` (`git diff 0550623 -- <file>`). Nobody commits; the user decides about commits afterwards.

## Phase 1: intake result

- All 53 stories exist; each has priority, acceptance criteria, dependencies. None was marked implemented.
- Git is safe: no tracked modifications, no extra worktrees, no stashes.
- Browser for tests: `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"` (Chrome is not installed). `tests/node_modules` is gitignored, so **no worktrees are used**: all workers share one working tree and are separated by **strict file ownership**.

## Execution rules

1. **One owner per file per batch.** No two concurrent workers edit the same file. Cross-game stories are split into per-game slices, each given to the game's owner.
2. **Status bookkeeping:** workers do NOT edit `stories/QA-USER-STORIES.md` (one shared file, many writers = conflicts). Each worker writes `stories/implementation/US-XXX.md` (one file per story, with a `Status:` line). The coordinator alone updates statuses in the plan and result files.
3. **Frozen files** (`shared/sjovt.css`, `shared/sjovt.js`, `index.html` (portal), `prd.md`, `specs.md`) are **not edited** in this run: no owner approval was given. Stories or slices that need them are `BLOCKED`.
4. **Native-speaker sign-off:** the stories require it before merge. Workers apply only corrections that the QA evidence shows to be unambiguous, leave doubtful items alone and list them. Such stories can end at most as `IMPLEMENTED BUT NOT VERIFIED` (native sign-off criterion = NOT VERIFIED).
5. **No commits, no pushes, no dependency changes.** Debug files go to the scratchpad only.
6. P0/P1 stories are verified by an independent agent (not the implementer) before `VERIFIED`.

## Owners (file ownership)

| Owner | Files owned |
|---|---|
| W-PRON | `pronomenmysteriet/*`, `shared/themes/pronomenmysteriet.css`, new `tests/pronomen-data-guard.mjs` |
| W-TIDS | `tidsmaskinen/*`, `shared/themes/tidsmaskinen.css` |
| W-BOEJ | `boejningsvaerkstedet/*`, `shared/themes/boejningsvaerkstedet.css`, `shared/data/nouns.js`, `shared/data/adjectives.js` |
| W-STOR | `adverbs.html`, `danish-antonyms-game.html`, `dansk-praepositioner.html` (Batch 1 only; US-004) |
| W-ADV | `adverbs.html`, `shared/themes/adverbs.css` |
| W-ANT | `danish-antonyms-game.html`, `shared/themes/antonyms.css` |
| W-PREP | `dansk-praepositioner.html`, `shared/themes/praepositioner.css` |
| W-IDIOM | `idiomjaeger.html`, `shared/themes/idiomjaeger.css` |
| W-GLOSE | `danish_flashcards/danish_flashcards_game/*`, `shared/themes/flashcards.css` |
| W-ENET | `en og et/index.html`, `shared/themes/en-og-et.css` |
| W-FORB | `forbindenor/Forbindenor.html`, `shared/themes/forbindeord.css`; in Batch 2 also `konjunktioner/konjunktioner.html` (US-022) |
| W-KONJ | `konjunktioner/konjunktioner.html`, `shared/themes/konjunktioner.css` (Batch 4) |
| W-ORD | `ordstilling-detektiv/index.html`, `shared/themes/ordstilling.css` |
| W-DM | `danske-phraser/dansk-mester.html`, `shared/themes/dansk-mester.css` |
| W-MV | `magiske_verber.html`, `shared/themes/magiske-verber.css` |
| W-EXPL | `shared/explainer/*` (incl. scenes), `.claude/skills/grammar-explainer-video/*` docs/examples; plus the `data-explainer` attributes in game files **only in Batch 3, when no game owner is active** |
| W-DATA | `shared/data/verbs.js`, `pronouns.js`, `clause-patterns.js`, `saetningsmaskinen/data.js` |

Not touched by anyone: `shared/dansk-core.js`, `shared/dansk-speech.js` (if a worker finds it must change, it stops and reports a shared-component conflict), `shared/validate.js`, `index.html`, `shared/sjovt.*`.

## Batches

| Batch | Contents | Parallel workers | Gate |
|---|---|---|---|
| 1 | P0 stories + storage guard blocker | W-PRON (US-001), W-FORB (US-002), W-TIDS (US-003), W-STOR (US-004) | Independent verification, diff review |
| 2 | P1 gameplay + language per game (stories in dependency order inside each owner) | W-ADV, W-IDIOM, W-PREP, W-BOEJ, W-GLOSE, W-ENET, W-FORB (+konjunktioner), W-ANT, W-ORD, W-MV, W-DM, W-TIDS | Independent verification of every P1 story |
| 3 | P1 explainers (+ P2/P3 explainer stories, same files) | W-EXPL alone (touches game files for wiring) | Run explainer harness on all 10 games |
| 4 | P2/P3 per-game slices, cross-game slices, latent data | all owners + W-DATA | Diff review, targeted verification, final regression |

## Story graph

Classification: `PARALLEL-SAFE`, `SEQUENTIAL` (must follow a same-file or logical predecessor), `SHARED-COMPONENT` (multi-game/shared files), `BLOCKED`.

| Order | Story | Pri | Owner(s) | Dependencies | Expected files | Shared files | Conflict risk | Class | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | US-001 | P0 | W-PRON | none | `pronomenmysteriet/data.js`, new `tests/pronomen-data-guard.mjs` | none | Low | PARALLEL-SAFE (B1) | READY FOR DEVELOPMENT |
| 2 | US-002 | P0 | W-FORB | native sign-off | `forbindenor/Forbindenor.html` | none | Low | PARALLEL-SAFE (B1) | READY FOR DEVELOPMENT |
| 3 | US-003 | P0 | W-TIDS | native sign-off | `tidsmaskinen/data.js` (+index.html if two-blank items need it) | none | Low | PARALLEL-SAFE (B1) | READY FOR DEVELOPMENT |
| 4 | US-004 | P1 | W-STOR | none | `adverbs.html`, `danish-antonyms-game.html`, `dansk-praepositioner.html` | none | Med (3 files later edited by other owners) | SEQUENTIAL: must finish before B2 | READY FOR DEVELOPMENT |
| 5 | US-005 | P1 | W-ADV | US-004 | `adverbs.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 6 | US-006 | P1 | W-ADV | US-005 | `adverbs.html` (script include of `dansk-core.js`) | `dansk-core.js` read-only | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 7 | US-007 | P1 | W-ADV | US-005; native sign-off; owner input on dataset size | `adverbs.html` | none | Low | SEQUENTIAL; scope limited to QA-evidenced errors, no dataset expansion | READY FOR DEVELOPMENT |
| 8 | US-008 | P1 | W-IDIOM | none | `idiomjaeger.html` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 9 | US-009 | P1 | W-PREP | none | `dansk-praepositioner.html` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 10 | US-010 | P1 | W-BOEJ | none | `boejningsvaerkstedet/index.html` and/or `data.js` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 11 | US-011 | P1 | W-GLOSE | none | `danish_flashcards/.../script.js`, `index.html`, `style.css` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 12 | US-012 | P1 | W-ENET + W-FORB (2 slices) | none | `en og et/index.html`; `forbindenor/Forbindenor.html` | none | Low | PARALLEL-SAFE (W-FORB slice after its B1 work) | READY FOR DEVELOPMENT |
| 13 | US-013 | P1 | W-ANT, W-ORD, W-PREP (3 slices) | none (coordinate with blocked US-026) | the 3 game files | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 14 | US-014 | P1 | W-TIDS | US-003; native sign-off | `tidsmaskinen/data.js` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 15 | US-015 | P1 | W-BOEJ | US-010; native sign-off | `boejningsvaerkstedet/data.js`, `shared/data/adjectives.js`, `nouns.js` | derived item counts | Med | SHARED-COMPONENT; run `validate.js` + item dump | READY FOR DEVELOPMENT |
| 16 | US-016 | P1 | W-MV | native sign-off | `magiske_verber.html` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 17 | US-017 | P1 | W-GLOSE | native sign-off | flashcards `script.js` | none | Low | SEQUENTIAL after US-011 (same owner) | READY FOR DEVELOPMENT |
| 18 | US-018 | P1 | W-IDIOM | US-008 (same file); native sign-off | `idiomjaeger.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 19 | US-019 | P1 | W-PREP | US-009 (same file); native sign-off | `dansk-praepositioner.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 20 | US-020 | P1 | W-ANT | native sign-off | `danish-antonyms-game.html` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 21 | US-021 | P1 | W-DM | native sign-off | `danske-phraser/dansk-mester.html` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 22 | US-022 | P1 | W-FORB | US-002; native sign-off | `forbindenor/Forbindenor.html`, `konjunktioner/konjunktioner.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 23 | US-023 | P1 | W-ORD | native sign-off | `ordstilling-detektiv/index.html` | none | Low | PARALLEL-SAFE | READY FOR DEVELOPMENT |
| 24 | US-024 | P1 | W-ENET | native sign-off | `en og et/index.html` | none | Low | SEQUENTIAL after US-012 (same owner) | READY FOR DEVELOPMENT |
| 25 | US-025 | P1 | W-EXPL | US-001; native sign-off | `shared/explainer/scenes/*` (new), `data-explainer` in 4 game files | explainer used by 10 games | High | SHARED-COMPONENT; Batch 3 alone | READY FOR DEVELOPMENT |
| 26 | US-035 | P2 | W-EXPL | US-025; native sign-off | `shared/explainer/scenes/*`, wiring | explainer | High | SHARED-COMPONENT (B3) | READY FOR DEVELOPMENT |
| 27 | US-036 | P3 | W-EXPL | none | `shared/explainer/modal.css`, `modal.js`, `explainer.js`, skill doc | explainer | High | SHARED-COMPONENT (B3); test 3+ consumers | READY FOR DEVELOPMENT |
| 28 | US-028 | P2 | game owners | none | English strings in `dansk-mester.html`, `shared/themes/dansk-mester.css`, `ordstilling-detektiv/index.html`, praep/ant/glose/forb | none | Low per slice | PARALLEL-SAFE (B4); TTS aria label overlap with BLOCKED US-029 noted | READY FOR DEVELOPMENT |
| 29 | US-030 | P2 | W-BOEJ, W-PRON, W-TIDS, W-ENET, W-FORB | US-011 (pattern) | 5 game files | none | Low per slice | PARALLEL-SAFE (B4) | READY FOR DEVELOPMENT |
| 30 | US-031 | P2 | game owners | US-013 | the games listed in the story | none | Low per slice | PARALLEL-SAFE (B4) after US-013 | READY FOR DEVELOPMENT |
| 31 | US-032 | P2 | W-ENET | none; no new sprite in `sjovt.js` | `en og et/index.html`, theme | none | Low | PARALLEL-SAFE (B4); inline pixel SVG only | READY FOR DEVELOPMENT |
| 32 | US-033 | P2 | W-IDIOM, W-DM | none; no new sprite in `sjovt.js` | `idiomjaeger.html`, `dansk-mester.html` | none | Low | PARALLEL-SAFE (B4); reuse existing sprites only | READY FOR DEVELOPMENT |
| 33 | US-034 | P2 | W-KONJ, W-ENET | none | `shared/themes/konjunktioner.css`, `en-og-et.css` | none | Low | PARALLEL-SAFE (B4) | READY FOR DEVELOPMENT |
| 34 | US-037 | P3 | game owners | none | the games listed; confetti slice only if no `sjovt.js` change | none | Low per slice | PARALLEL-SAFE (B4) | READY FOR DEVELOPMENT |
| 35 | US-041 | P3 | W-ANT, W-BOEJ, W-DM | none | 3 game files | none | Low | PARALLEL-SAFE (B4) | READY FOR DEVELOPMENT |
| 36 | US-042 | P3 | W-PRON, W-BOEJ | US-001 | game files | none | Low | PARALLEL-SAFE (B4) | READY FOR DEVELOPMENT |
| 37 | US-043 | P3 | W-GLOSE | US-011 | flashcards | none | Low | SEQUENTIAL (same owner) | READY FOR DEVELOPMENT |
| 38 | US-044 | P3 | W-PREP | US-019 | `dansk-praepositioner.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 39 | US-045 | P3 | W-ANT | US-020 | `danish-antonyms-game.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 40 | US-046 | P3 | W-DM | US-021 | `dansk-mester.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 41 | US-047 | P3 | W-ENET | US-024 | `en og et/index.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 42 | US-048 | P3 | W-FORB | US-002, US-022 | `Forbindenor.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 43 | US-049 | P3 | W-KONJ | US-022 | `konjunktioner.html` | none | Low | SEQUENTIAL | READY FOR DEVELOPMENT |
| 44 | US-050 | P3 | W-TIDS, W-BOEJ, W-MV, W-IDIOM, W-ORD | US-014/015/016/018/023 | 5 game files; **Portal slice excluded** | none | Low | SEQUENTIAL (B4); portal slice BLOCKED | READY FOR DEVELOPMENT (portal slice BLOCKED) |
| 45 | US-051 | P3 | W-DATA | native sign-off | `shared/data/verbs.js`, `pronouns.js`, `clause-patterns.js`, `saetningsmaskinen/data.js` | validate.js | Low | PARALLEL-SAFE (B4) | READY FOR DEVELOPMENT |
| n/a | US-026 | P2 | none | Owner decision on helper location | 11 legacy games | `sjovt.js` or new shared file | High | BLOCKED | BLOCKED |
| n/a | US-027 | P2 | none | Owner decision (`specs.md`), US-007/US-018 | 3 games | `specs.md` | High | BLOCKED | BLOCKED |
| n/a | US-029 | P2 | none | Owner approval (frozen `sjovt.*`), US-006 | all games | `sjovt.css/js` | High | BLOCKED | BLOCKED |
| n/a | US-038 | P3 | none | Owner approval (frozen `sjovt.js`) | sprites | `sjovt.js` | High | BLOCKED | BLOCKED |
| n/a | US-039 | P3 | none | Owner approval (frozen) | shared chrome | `sjovt.*`, `index.html` | High | BLOCKED | BLOCKED |
| n/a | US-040 | P3 | none | Owner approval (frozen `index.html`, `sjovt.js`), US-026 | portal + games | frozen | High | BLOCKED | BLOCKED |
| n/a | US-052 | P3 | none | Owner decision | `pixel-animation.html` | none | Low | BLOCKED | BLOCKED |
| n/a | US-053 | P3 | none | Owner approval (docs, `CLAUDE.md`) | docs | none | Low | BLOCKED | BLOCKED |

(US-001..US-053 = 45 scheduled + 8 blocked = 53.)

### Same-file clusters (all assigned to one owner, executed in this order)

- `adverbs.html`: US-004 → 005 → 006 → 007 → 028/031/037 slices
- `Forbindenor.html`: US-002 → 012 → 022 → 028/030/048
- `konjunktioner.html`: US-022 (W-FORB, B2) → 034/049 (W-KONJ, B4)
- `tidsmaskinen/data.js`: US-003 → 014 → 050
- `idiomjaeger.html`: US-008 → 018 → 033/037/050
- `dansk-praepositioner.html`: US-004 → 009 → 013 → 019 → 044
- `boejningsvaerkstedet/*` + shared noun/adjective data: US-010 → 015 → 030/041/042/050
- explainer files and the 4 `data-explainer` attributes: Batch 3 only (W-EXPL)

## Worker briefing template (Phase 4)

Every dispatch states: assigned story IDs and exact slices; expected files; files NOT to touch; QA evidence pointers (`stories/QA-USER-STORIES.md` story, `qa/FINAL-QA-REPORT.md` QA-xxx, worker report IDs); required tests (`CHROME_PATH=<Edge> node smoke.mjs <game>`, `node shared/validate.js` when shared data changes, own scratchpad scripts for the specific criteria); output file `stories/implementation/US-XXX.md` with: implementation summary, status line, tests run + results, manual verification, files changed, remaining risks, newly discovered issues, acceptance-criteria table (PASS/FAIL/NOT VERIFIED).

## Execution log (updated by the coordinator)

| Time | Event | Decision |
|---|---|---|
| start | Plan created; branch `qa-implementation`; baseline `0550623` | Dispatch Batch 1 |
| B1 | W-STOR US-004 finished; diff = guard lines only; independent verifier: VERIFIED | Accept US-004 (VERIFIED) |
| B1 | W-FORB US-002 attempt 1 failed independent verification (~21/51 items offered a natural-fitting distractor; asymmetric CAT_OVERLAP). Class: IMPLEMENTATION ERROR | Retry with narrowed instructions (strict symmetric whitelist + 359-item audit) |
| B1 | US-002 retry 1: mechanical checks PASS, 1 item (172) offered natural distractors; verifier FAILED narrowly. Class: IMPLEMENTATION ERROR (single item) | Retry 2 limited to item 172 |
| B1 | US-002 retry 2: item 172 pool = derfor/dermed/følgelig/af den grund (coordinator-checked in code + implementer's 359x300 run, other 358 pools unchanged) | Accept as IMPLEMENTED BUT NOT VERIFIED: native sign-off outstanding; **owner decision needed**: all 359 items now get syntactically impossible distractors (game trains part of speech/word order more than meaning). Recorded in IMPLEMENTATION-RESULT. No further retries (would exceed scope) |
| B1 | W-PRON US-001 finished; data.js identical to b9abb96 (coordinator-checked: empty diff); guard script new; 3 spec-test checks still fail (2 = US-042 scope, 1 = Space-on-chip, recorded as new issue). Stray test outputs removed from repo root by coordinator | Await independent verification |
| B1 | W-TIDS US-003 finished; diff 24 lines in tidsmaskinen/data.js; stray `tids-*.json` outputs removed by coordinator. Rewrites place allerede at clause end ("Jeg var gået hjem allerede"): grammatical but stilted | Await independent verification; naturalness is a native-review item |
| B1 | Independent verdicts: US-001 NOT VERIFIED (guard now wired by supporting fix; spec-test criterion fails for out-of-scope game behaviours: due-items-first = US-042, Space-on-chip, timing flakes); US-003 NOT VERIFIED (content OK; stilted clause-final "allerede" in ~7 of 23 items; native review); US-004 VERIFIED | Batch 1 gate passed (no regressions); US-002/001/003 carried forward as IMPLEMENTED BUT NOT VERIFIED |
| B1 | ENVIRONMENT ISSUE: W-BOEJ ran `taskkill //IM node.exe` (kills all node processes) to stop its hung test | No other worker reported a lost run; logged. Workers/verifiers told not to kill processes (verifier brief) |
| B2 | Dispatched 12 per-game workers (disjoint files). All reported. Tree check: only owned files modified; stray `_before_prep.html`, `tids-*.json` removed (by worker/coordinator) | Dispatch 7 independent verifiers |
| B2 | V-ADV: US-005 VERIFIED, US-006 VERIFIED (note: stray ",." in spoken gap text, needs audible check), US-007 NOT VERIFIED (dataset size = owner; one-directional exclusion leaves some defensible alternatives; Måde/Frekvens zones empty: both had 1 entry at HEAD, picker doesn't say empty) | Accept |
| B2 | V-PREP: US-009 VERIFIED, US-013(prep) VERIFIED, US-019 NOT VERIFIED (native; ~69 templates can still show valid random padding option; pre-existing templates with valid alternatives) | Accept; follow-up story recommended |
| B2 | V-ANTORD: US-013(ant) VERIFIED; US-020 NOT VERIFIED (native); US-023 NOT VERIFIED (native); US-013(ord) found REGRESSION at 360x640 (English prompt scrolled out of view) = REGRESSION | Narrowed retry (W-ORD2) fixing `keepAnswerInView()` only; independent re-verify dispatched; statement 1 still below the fold (story requires 2nd statement on) = owner decision |
| B2 | V-GEM: US-011 VERIFIED; US-012 En/Et slice VERIFIED (N=2 streak: first perfect round still "Ryddet 0/15" = UX caveat for owner); US-017, US-021, US-024 NOT VERIFIED (native; US-024 note says both en/et øl, game scores only en) | Accept |
| B2 | V-IDMV: US-008 VERIFIED; US-018, US-016 NOT VERIFIED (native) | Accept |
| B2 | V-FKT: US-012 Forbindeord slice VERIFIED; US-014 NOT VERIFIED (native); US-022 FAILED: QA-119 two items still offered valid distractor (UNCLEAR line 488 `da`, eftersom item `når`) = IMPLEMENTATION ERROR; QA-120 deviates from story wording (requested "Det føles, som om…" cannot be a blank on key `at`) = UNCLEAR REQUIREMENT | Retry narrowed to the 2 items (done, coordinator checked diff); QA-120 escalated to owner/native; US-022 = IMPLEMENTED BUT NOT VERIFIED |
| B2 | V-BOEJ: US-010 VERIFIED; US-015 NOT VERIFIED (native; QA-085 list needs native; deres-bil/deres-boern same reflexive issue = follow-up) | Accept |
| B3a | Scene authors (W-EXPL-T, W-EXPL-P, W-EXPL-M) created 17 new scenes + wiring (data-explainer lines only); tree check clean | Batch 3b: single worker for shared player |
| B3b | W-EXPL-S: US-036 player changes, US-035 badge gate, compact chooser, 4 countdown listeners. Coordinator inspected the four listener blocks: self-contained, no scoring/storage changes | Independent verification V-EXPL |
| B3 | V-EXPL: US-036 VERIFIED (defect D-1: Tidsmaskinen auto-advance after a correct answer is not paused when the modal opens within ~800 ms, next item's timer runs behind the dialog = low-severity follow-up); US-035 NOT VERIFIED (sin-hans/U-03 native review); US-025 FAILED on one criterion: 17 new scenes shipped `verify:false` without native review = IMPLEMENTATION ERROR | Narrow fix: `verify: true` in 34 files (scenes + example copies); coordinator checked diff = 34 files +1/-1; US-025 -> IMPLEMENTED BUT NOT VERIFIED (native review) |
| B3 | ENVIRONMENT ISSUE (2nd): V-EXPL ran `taskkill` on node.exe/msedge.exe to clear its own hung runs | No other worker was active at that time; logged |
| PR | Draft PR TarasNS/danske_spiller#3 opened from qa-implementation (3 commits) at the user's request; follow-up commit adds verification records + verify flag | Batch 4 not started |
| B4 | User approved continuing with Batch 4 (P2/P3, per-game owners; blocked/owner-approval slices NOT done: US-026, 027, 029, 038, 039, 040, 052, 053, US-050 portal slice; frozen files untouched). Slice reports go to `stories/implementation/US-XXX-<OWNER>.md` for multi-owner stories. Nothing is pushed to the open draft PR until the user asks | Dispatch 15 workers |

## Batch 5: unblocked slices of US-029, US-038, US-039 (user-requested)

The user asked for the parts of these three stories that do **not** need the frozen files (`shared/sjovt.css`, `shared/sjovt.js`, portal `index.html`) and said to continue with the others afterwards. Status of those stories changes from BLOCKED to PARTIAL: only the slices below; the remainder stays BLOCKED.

Start condition: wait until regression testers R1-R3 finish (they read the committed tree; edits in the middle would invalidate their results). Order: 5a shared pieces (one worker, sequential) -> verify -> 5b per-game slices in parallel (disjoint files, one owner per game file) -> verify -> targeted regression of every touched game -> final result report.

| Slice | Story | In scope (no frozen file) | Stays BLOCKED |
|---|---|---|---|
| 5a-1 | US-029 | NEW `shared/tts-button.css` (one pixel-speaker, 48x48 framed `.dc-tts-button`, focus ring, small variant) and the minimal edit of `shared/dansk-core.js` `ui.ttsButton` (aria-label "Lyt"); this is the story's own alternative to frozen `sjovt.*` | nothing of the story beyond games' adoption (5b) |
| 5a-2 | US-039 | NEW `shared/sd-extras.css` hosting `.sd-gap` (one gap placeholder), `.sd-badge` (neutral level badges, green/red reserved for feedback), select reset with pixel chevron, small inline-TTS variant; explainer ▶ glyph in `shared/explainer/*` replaced by a pixel triangle (QA-063 explainer part) | bar arrow `←` (in `sjovt.js`), portal ▼, portal radius/theme button (`index.html`), grid/bar-height token (QA-071, `sjovt.css`), shared results component across 5 games (QA-067: needs a design decision and frozen help), arrow glyph coverage in `sjovt.css` |
| 5b-1 | US-029 | every game swaps its TTS button (♪, ▶, pixel speaker, none) for `.dc-tts-button` with aria-label "Lyt"; ▶ stays reserved for the explainer (also the Glosekort current-card ▶ marker) | |
| 5b-2 | US-038 | identity sprites: Tidsmaskinen header `tidsstjerne`; Bøjningsværkstedet keeps one title with `tandhjul`; Dansk Mester header `snak`; documented semantic icon map (new doc `docs/redesign/icon-map.md`) applied to mode menus using existing sprites, one pixel density per row | redrawing the 9 generic sprites (`sjovt.js`) |
| 5b-3 | US-039 | per game: gap placeholder, `.sd-badge` level badges, select chevron, dark-surface rule in 4 outlier games, Idiomjæger inline TTS small variant, in-game back control wording ("← TILBAGE"; ✕ only to quit a round) | frozen parts listed above |

Owners (same file ownership as before): W-SHARED (5a: new shared files, `shared/dansk-core.js`, `shared/explainer/*`); then W-PRON, W-TIDS, W-BOEJ, W-ADV, W-ANT, W-PREP, W-IDIOM, W-GLOSE, W-ENET, W-FORB, W-KONJ, W-ORD, W-DM, W-MV each for their game files and `shared/themes/<game>.css`. Frozen files remain untouched. Remaining BLOCKED stories after Batch 5: US-026, 027, 040, 052, 053 and the frozen remainders of 029/038/039.
| B5 | Batch 5 (user-requested): unblocked slices of US-029/038/039 + owner decisions (10 recorded in `stories/DECISIONS.md`). 5a shared pieces (V5a: all shared criteria PASS; two medium risks fixed: `.sd-gap` colour, `select.sd-select` specificity); 5b 14 per-game adoptions; verifiers V5-A (US-029: NV only for the 32px-visible small variant), V5-B (US-038 partial), V5-C (US-039: FAILED on a Major dark-mode gap contrast regression in Bøjningsværkstedet = IMPLEMENTATION ERROR → fixed, 4.86-15.47:1), V5-D (decisions: all PASS) | Narrow fixes (Bøjningsværkstedet gap + empty-state sprite; Idiomjæger Statistik pokal scale) |
| Final | Final regression F1/F2/F3 on committed tree `b0083ce`: no P0/P1 regression, no new Major; 2 new minor issues recorded. Reconciliation written: `stories/IMPLEMENTATION-RESULT.md`. Story statuses updated in `stories/QA-USER-STORIES.md` (21 VERIFIED, 27 IMPLEMENTED BUT NOT VERIFIED incl. 2 partial, 5 BLOCKED) | Verdict READY FOR FINAL MANUAL QA; stop (no new cycle) |
