# R2 W-PRON cleanup (pronomenmysteriet)

Status: IMPLEMENTED

## Changes
1. `pronomenmysteriet/index.html` (former l.65-69): removed the five dead `.blank` / `.blank.done-*` / dark `.blank.done-*` rules. Proof of dead code: grep for `blank` in the game and theme shows the only DOM element created is `className='sd-gap'` (l.~468); no `.blank` class is ever assigned (innerHTML, classList or markup). The `done-correct/done-wrong` classes (JS l.~527) were only styled by these rules; the JS still adds them (harmless, left untouched, game logic unchanged). The filled look comes from `.sd-gap.is-filled.is-ok/.is-bad` in shared/sd-extras.css.
2. `tests/pronomenmysteriet.mjs` (~l.220-226): the row now asserts the real behaviour: chip 2 starts pressed, 1st Space -> aria-pressed 'false', 2nd Space -> 'true'. Row renamed 'Space toggles a chip (true -> false -> true)'.
3. `tests/pronomenmysteriet.mjs` (imports l.5-6, dump at end ~l.296-299): default dump path is `os.tmpdir()/pm-items.json`; `OUT` still overrides; the path is printed ("items dump written to ...").
4. Auto-advance timing rows untouched.

## Tests (Edge, run from repo root)
- Before (baseline): 60/66. FAILs: 4 auto-advance timing rows (flaky under load), 'correct answer: no congratulatory text' (SAG 3 header text, flaky/pre-existing), 'Space toggles a chip' (false).
- After, default output: 66/66; prints dump path in OS temp (removed afterwards). After, with OUT=scratchpad: 66/66, dump written to the OUT path. The timing/congratulatory rows passed this time; they are load-sensitive, code for them unchanged. All other rows identical PASS.
- Fixed row: `PASS Space toggles a chip (true -> false -> true) :: after 1st Space=false; after 2nd=true`.
- `node tests/pronomen-data-guard.mjs`: PASS (6 modes, 760 items).
- `node tests/smoke.mjs ../pronomenmysteriet/index.html`: Verdict PASS.
- Filled gap before/after (desktop, light+dark, correct+wrong): computed styles byte-identical (`gap-before.json` vs `gap-after.json`, cmp OK); screenshots `gap-before-*.png` / `gap-after-*.png` in C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\impl\r2-pron.
- `git status --short`: no `pm-items.json` in repo; of my files only `pronomenmysteriet/index.html` and `tests/pronomenmysteriet.mjs` modified (other modified files in the tree belong to other workers). `pronomen-data-guard.mjs`, theme CSS and data.js untouched.

## Risks / notes
- None beyond the flaky timing rows (recorded only). Leftover JS adding `done-*` classes is now unstyled; could be removed in a later logic cleanup.
