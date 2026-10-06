# R2-boej: dead `.blank` CSS cleanup (W-BOEJ round 2)

Status: IMPLEMENTED

## Removed
- `boejningsvaerkstedet/index.html` (was l.288-295): the whole `.context .blank` block (base rule + `.done-correct` / `.done-wrong` + the two dark-mode colour rules). 8 lines deleted.
- `shared/themes/boejningsvaerkstedet.css` l.114: dropped only the `, html.sd-page .context .blank` selector; the line is now `html.sd-page .frame .blank { ... }` (declarations unchanged).

## Kept (still used)
- `index.html` l.244 `.frame .blank` and theme `.frame .blank`: Mode 3 (adjective frame) still creates `<span class="blank">` at index.html l.895-897 and styles it inline at l.930-931.

## Proof the removed rules were dead
- `grep blank` in `boejningsvaerkstedet/`: only generators of class `blank` are l.896 (Mode 3, inside `.frame`). Mode 6 (`.context`, created l.1164, blank l.1170-1172) uses `className='sd-gap'`. No `class="blank"` in markup strings, no `classList` use with `blank`; `.context` is created only in Mode 6.
- Mode 5/6 do not use `.context .blank`; the `done-correct`/`done-wrong` classes on `.context .blank` are never added (they are added to table cells / slots / inputs only, l.828, 1033, 1121).
- Runtime DOM check (all six modes, filled state): `.blank` exists only in Mode 3 (1 element, inside `.frame`); `.sd-gap` only in Modes 5 and 6; `.context .blank` matches nothing.

## Tests (scratchpad `impl\r2-boej\`)
- Script `shot.cjs`: seeded Math.random, reduced motion, plays all six modes (type a wrong answer in input modes, click first option in MC modes), screenshots each mode at 1366x768 and 360x640, light and dark = 24 shots per run. Baseline = copy of the pre-edit tree (`base/`; working tree equalled HEAD for these two files).
- All six modes load and accept an answer in every viewport/theme; no h-scroll; zero console/page errors in every run.
- Modes 3, 5, 6 with a filled gap (Mode 3 `.blank` filled with solution, Modes 5/6 `.sd-gap.is-filled`): baseline vs after byte-identical (`cmp`) for all 24 screenshots (two baseline runs vs after run, 0 diffs). Note: the very first baseline run (`pre-`) had a one-off difference in Mode 4 light (no blank/context in that mode, timing/animation flake); two further baseline runs equal the after run exactly.
- `node tests/smoke.mjs ../boejningsvaerkstedet/index.html`: all 23 rows PASS, Verdict PASS.
- `git status --short`: owned changes only `boejningsvaerkstedet/index.html`, `shared/themes/boejningsvaerkstedet.css` (plus this report); other modified files belong to other workers. Nothing staged.

## Earlier work intact
No other lines touched: SPIL above mode list, `.sd-gap` dark contrast fix, shared Lyt button, US-010/015/030/031/037/041/042/050 unchanged (diff is 8 deletions in html, 1 line edit in css).

## Files changed
- `/c/Users/TarasTsarenko/Downloads/Dansk/danske_spiller/boejningsvaerkstedet/index.html` (-8 lines at former l.288-295)
- `/c/Users/TarasTsarenko/Downloads/Dansk/danske_spiller/shared/themes/boejningsvaerkstedet.css` (l.114)
