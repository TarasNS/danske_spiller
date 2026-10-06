# VERIFY-R2-C (verifier VR2-C, re-run)

Branch `qa-fixes-round2`, changes uncommitted. Browser: Edge. Scratchpad: `...\scratchpad\impl\vr2-c2\` (logs, `shot.cjs`, `before/` = HEAD copies, 96 PNGs).
Read-only on the repo; no file added by me (final `git status --short` differs from the start only by other verifiers' `VERIFY-R2-*.md`).

## Per-item table

| # | Item | Result | Evidence |
|---|------|--------|----------|
| 1 | Boej dead `.context .blank` CSS removed (`boejningsvaerkstedet/index.html`, theme css) | PASS | Diff = 8 deleted lines in index.html (`.context .blank` base + done-correct/done-wrong + 2 dark rules) and the selector `, html.sd-page .context .blank` dropped in the theme (declarations of `.frame .blank` unchanged). `grep blank`: only generator of class `blank` is Mode 3 (`index.html:887-888`, inside `.frame`; still styled by `:244` and theme `:114`, both kept). Mode 5/6 context uses `sd-gap` (`:1163`). Runtime, all 6 modes x 1366x768/360x640 x light/dark (24 states): `.blank` count 1 only in Mode 3, `.context .blank` count 0 everywhere, `.sd-gap` only in Modes 5/6, no h-scroll, zero console errors. |
| 1 | Screenshots before/after | PASS (explained) | Before = `git show HEAD:` copies. 24 shots, seeded Math.random, reduced motion. Modes 1,2,3,5,6 byte-identical (`cmp`); Mode 4 (no blank, no gap) differs between runs in some viewports, but also between two runs of the SAME unchanged HEAD copy (before vs before2) and two runs of the after copy, so it is render nondeterminism, not the change. Filled gaps (Mode 3 `.blank`, Modes 5/6 `.sd-gap.is-filled`) identical in all 4 viewport/theme combos. |
| 1 | Smoke | PASS | `node smoke.mjs ../boejningsvaerkstedet/index.html`: exit 0, 29 PASS lines, Verdict PASS. |
| 2 | Pron dead `.blank` CSS removed (`pronomenmysteriet/index.html`) | PASS | Diff = 5 deleted rules (`.blank`, `.done-correct/-wrong`, 2 dark). `grep blank` in game/theme/shared css: only `sd-gap` is ever created (`:467-468`); no `.blank` assigned anywhere. JS still adds `done-correct/done-wrong` (`:527`), now unstyled and harmless (implementer noted it). Runtime, all 6 modes x 4 viewport/theme combos: `.blank` 0, `.sd-gap` 1, filled gap class `sd-gap is-filled is-ok/is-bad done-*`; no h-scroll; zero console errors. Before/after screenshots: 24/24 byte-identical (`cmp`), text logs identical. |
| 2 | Smoke | PASS | exit 0, 29 PASS lines, Verdict PASS. |
| 2 | `tests/pronomenmysteriet.mjs` Space-chip assertion | PASS | Row `Space toggles a chip (true -> false -> true)` PASS in both runs ("after 1st Space=false; after 2nd=true"). Code read: the chip starts pressed; a first Space is issued, `spOff` read, second Space, `spOn` read; assertion `spOff==='false' && spOn==='true'`. If Space did nothing both reads are 'true' -> FAIL; if it toggled only once-per-two or never back -> FAIL. So it still detects a non-toggling Space. |
| 2 | Dump file to OS temp | PASS | Default run prints `items dump written to C:\Users\TARAST~1\AppData\Local\Temp\pm-items.json` (I deleted it afterwards); `OUT=<scratchpad>/pm-out.json` wrote there; no `pm-items.json` in the repo (`git status --short`). |
| 2 | Data guard | PASS | `node tests/pronomen-data-guard.mjs`: PASS 6 modes, 760 items. |
| 3 | `tests/tidsmaskinen.mjs` game path relative to script | PASS | `FILE = path.resolve(dirname(fileURLToPath(import.meta.url)), '..', 'tidsmaskinen', 'index.html')`. `cd tests && node tidsmaskinen.mjs --only=boot`: 8/8 passed, exit 0 (the old cwd-relative path would not resolve there). |
| 3 | Dump files to OS temp by default; NOTE line | PASS | First stdout line `NOTE dump files are written to C:\Users\TARAST~1\AppData\Local\Temp\tids-spectest` (files tids-content/rounds/dumps.json present there). With `OUT=<scratchpad>/outdir` the NOTE line shows that dir and `tids-dumps.json` lands there. No dump files in the repo (git status unchanged apart from other verifiers' VERIFY files). |
| 3 | 'timed expiry: no SRS write' compares before/after | PASS | `--only=unlock,timed` x6: row PASS 6/6 (`key before=null after=null`), each run 13/13 passed, exit 0. Code read (`tidsmaskinen.mjs:522,534-535`): `srsBefore` is taken before the round, `srsAfter` after the real 20 s expiry; assertion requires `JSON.stringify(srsBefore)===JSON.stringify(srsAfter)` over the WHOLE `srs:tidsmaskinen` store (plus per-item key equality). Any SRS write on expiry (new item key, box change, pattern key, counts) changes the JSON -> the row would FAIL; the old test only checked key absence, the new one is at least as strict. Also a write for a key that existed before would now be caught (old check would have failed on key presence anyway). |
| - | `node shared/validate.js` | PASS | 0 errors, 0 warnings for adjectives, clause-patterns, nouns, pronouns, verbs. |

## Test results

- tidsmaskinen full run from repo root (background, ~20 min): 152/153. Only failure: `correct: auto-advance 700-1000 ms (all modes)  n=144/144 min=833 max=1693`. NOTE: during this run I was running my screenshot scripts concurrently (CPU load), which may have inflated max.
- Re-run of `--only=rounds` in isolation: still FAIL on the same row (`min=833 max=1196`), 45/46. Per tester rules that is failing twice, so I report it as FAIL of that row, but it is timing-only (no wrong value, all 144 advance, upper bound 1000 ms exceeded by outliers), is untouched by this round (`tidsmaskinen/index.html` and that row's code are not in the diff) and is a known flaky timing row.
- pronomenmysteriet default run: 64/66, `OUT` run: 65/66; failures only `auto-advance ~800ms` rows for subject_object and reflexive_possessive (first-item outliers 1567/1686 ms and 1199/1395 ms; other verifiers were running in parallel). Implementer's own run had 66/66; known load-sensitive timing rows.

## Known flaky timing rows (separate)
- tidsmaskinen: `correct: auto-advance 700-1000 ms (all modes)` (outliers up to 1.2-1.7 s).
- pronomenmysteriet: `<mode>: auto-advance ~800ms` (subject_object, reflexive_possessive outliers 1.2-1.7 s on first item).

## Issues / scope creep
- No regressions found. No scope creep: diffs match the plan (8-line CSS delete + 1 selector in Boej; 5-rule delete in Pron; test-script changes only).
- Minor observations (not failures): the Pron JS still adds `done-correct/done-wrong` classes that are now unstyled; `tidsmaskinen.mjs` default OUT dir `tids-spectest` is created via `mkdirSync` in OS temp at start-up (intended); Mode 4 of Boej screenshots is nondeterministic regardless of this change.

Verification: VERIFIED for item 1 (Boej dead CSS: unused in all modes, screenshots identical/explained, smoke PASS).
Verification: VERIFIED for item 2 (Pron dead CSS + test fixes: Space row valid and fail-capable, dump to temp, data guard PASS), with the load-sensitive auto-advance timing rows reported as known flaky.
Verification: VERIFIED for item 3 (tidsmaskinen test fixes: script-relative path, temp dumps/NOTE/OUT, SRS row 6/6 and fail-capable), with the known flaky `auto-advance 700-1000 ms` row failing twice (timing outliers, unrelated to the change, game unchanged).
