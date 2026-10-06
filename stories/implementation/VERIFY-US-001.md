# VERIFY US-001 - Pronomenmysteriet data restore + placeholder guard

Verifier: independent (B1b). Repo untouched except this file. My scripts: `scratchpad/impl/verify-b1b/` (`drive-pron.cjs`, mutation runs). `tests/pronomenmysteriet.mjs` was run with `OUT` redirected to the scratchpad; no files were written into the repo (checked with `git status`).

## Data facts (own evidence)
- `git diff b9abb96 -- pronomenmysteriet/data.js`: empty (only an LF/CRLF warning).
- `grep -ciE "Test sentence|opt1|opt2|Test note|TODO|placeholder|dummy"` on data.js: 0.
- Loaded in a vm: 6 modes, subject_object 120, possessive_agreement 120, reflexive_possessive 180, den_det_de 100, nogen_nogle_noget 140, demonstrative 100 = 760; levels A2 304 / B1 288 / B2 168 (matches story). Ids unique; correct answer is in options for all 760 (0 violations).
- `pronomenmysteriet/index.html:162-167` MODES keys are those 6 keys, LEVELS = A2/B1/B2; every mode is non-empty at every level.

## Real-game drive (own script, Edge, file://)
6 modes x {A2, B1, B2, all levels} = 24 fresh sessions, 10 items each = 240 answers (120 correct, 120 wrong, alternating). Per item I matched the rendered sentence and options to the data file, checked the level is within the chip, and checked there is no "Test"/"opt\d" text. Correct: `chosen-correct`, no slip, auto-advance. Wrong: slip shows `Rigtigt svar: <correct>` and the exact Danish `note` from the data, plus a Videre button. Every session reached the summary screen. Result: 0 failures and **0 console/page errors**. Mode 4 (A2) and mode 5 (B2) both serve real items.

## Guard (`tests/pronomen-data-guard.mjs`)
- Current data: PASS (6 modes, 760 items), exit 0.
- `git show 2d606e5:pronomenmysteriet/data.js`: FAIL, 1310 problems, exit 1 (missing den_det_de / nogen_nogle_noget, unknown anaphoric_agreement / indefinite_pronouns, no B2, level A1, no blank, "Test sentence").
- Mutation checks on copies of the good data: "TODO" in note -> FAIL; "opt1" in options -> FAIL; "Lorem ipsum" -> FAIL; all B2 relabelled B1 -> FAIL; empty note -> FAIL; renamed mode key -> FAIL. Not caught: the bare words "dummy" and "placeholder" (not in the story's list; structural checks would still catch a wholesale placeholder file, as the 2d606e5 run shows).
- Judgement: it catches every original failure type (placeholder text, wrong mode keys, missing level coverage, A1 level) and reads mode keys and levels from the game, so it follows the game. Only a minor gap.
- **Wiring:** NOT called from `tests/pronomenmysteriet.mjs` or any other test run. The criterion "fails the test run" is therefore met only if someone runs the guard standalone.

## The failing checks in `tests/pronomenmysteriet.mjs` (my run: 60/65, `OUT` redirected)
The data is byte-identical to `b9abb96`, and `index.html` did not exist at b9abb96, so running the same check "on the b9abb96 data" cannot behave differently. I attributed each failure by reading what the check asserts.
1. `subject_object` and `reflexive_possessive: due items first on new round` (also failed in my run). The check asserts the 3 missed items reappear in the next round. `buildRound` (index.html ~349) shuffles the pool, keeps items where `DC.srs.isDue` is true, and takes the first 10. `srsIsDue` (shared/dansk-core.js:234) returns true for never-seen items, so with pools of 120/180 the 3 missed items are drawn at random. Cause: game selection logic vs spec. Not data.
2. `Space toggles a chip`: the chip is a `<button>` with a click handler; the harness does `focus()` + `keyboard.press('Space')`. Not data related. Pre-existing game/harness behaviour.
3. Extra failures in my run, which are flaky and not caused by the restore: `correct answer: no congratulatory text` failed because the snapshot included the item's English gloss "Hanne corrects mistakes in Claus's report", which matches the harness regex `/correct/`. This is a data-dependent false positive that varies with the random draw. `Videre is focused after wrong; Enter advances` is a timing flake (the implementer saw it once too).
So 5 failures in my run: 2 + 1 consistent (game/harness), 2 flakes. None is caused by the data restore.

## Acceptance criteria
| Criterion | Result | Evidence |
|---|---|---|
| data.js equals `git show b9abb96:...` | PASS | empty `git diff b9abb96` |
| `grep -c "Test sentence\|opt1\|Test note"` = 0 | PASS | 0 (also 0 for TODO/placeholder/dummy/opt2) |
| Keys match index.html 162-167; every mode >0 items for every chip | PASS | vm count + guard + 24 live sessions |
| Guard fails the test run on placeholder/unknown key | FAIL (partial) | Guard works standalone (proved on 2d606e5 and mutations) but is not called from `tests/pronomenmysteriet.mjs` or any run |
| `node tests/pronomenmysteriet.mjs` passes all checks incl. modes 4-5 | FAIL | 60/65; modes 4-5 run through; failures are spec-vs-game (due-first x2, Space) plus flakes |
| Hide portal card if restore can't land | N/A | restore landed |

## Regressions
None found. 0 console errors. No repo files written by my runs.

## Verdict
Verification: NOT VERIFIED. The data restore and live gameplay are fully verified (PASS). The guard is not wired into the test run, and `tests/pronomenmysteriet.mjs` does not pass all checks (failures are in game code or the spec, not caused by the restore). Native review of the content: NOT VERIFIED (US-035).
