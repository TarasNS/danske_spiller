# VERIFY US-004 - Guard all localStorage access in legacy games

Verifier: independent (own scripts in scratchpad `impl/verify-b1/`: `v4.mjs`, `ant2.mjs`, `persist.mjs`, `sb.mjs`; Edge via puppeteer-core, file://). Baseline = `git show HEAD:<file>` copies with a `<base href>` pointing at the repo so shared assets load.

## Method
- Blocking modes: (proto) `Storage.prototype.getItem/setItem/removeItem` throw SecurityError; (getter) `window.localStorage` getter throws; (normal) control. Injected with `evaluateOnNewDocument`.
- Adverbier: zone map count, start zone, answer until feedback, toggle dark mode.
- Antonymer: all 8 modes launched from `#modeGrid` (category/difficulty pickers started via their Start buttons), then 10-12 random clicks in `#screen-play`.
- Præpositioner: all 10 menu entries; Lynrunde played for real until the 60 s timer ends (no forced `endSpeed()` call); Statistik opened.
- Persistence with normal storage: play, dump all keys, reload, dump again.

## Results
| Game | HEAD proto/getter | After proto/getter | After normal |
|---|---|---|---|
| Adverbier | 0 zones, `pageerror: SecurityError` (both modes) | 6 zones, zone starts, answer gives feedback, dark toggle OK, 0 errors (both) | same as HEAD normal, 0 errors |
| Antonymer | modes 0-4, 6, 7 stay on dashboard/picker with `SecurityError` pageerror; only review (5) opens | all 8 modes reach their screen (play/review); questions answered/advanced in modes 0,2,3,4,6,7; match mode 1 renders but my random clicks did not complete a pair; 0 errors | same, 0 errors |
| Præpositioner | Lynrunde: timer frozen at "0s", no result after 80 s, pageerror; Statistik: pageerror | all 10 entries start; mc/drag/mistake show feedback; Lynrunde reached "TIDEN ER GÅET! ... Rekord" naturally in 60 s; Statistik renders; 0 errors (both modes) | same, 0 errors |

Persistence (normal storage, reload): Adverbier keys `danishSentenceBuilderProgress` + `danishDarkMode` identical after reload (score 10, dark theme restored); Antonymer `modsat_danish_antonyms_v1` identical; Præpositioner `praep_mester_v1` identical; forcing a Lynrunde end with speedScore=70 stored `praep_speed_best=70`, which survived reload and shows in Statistik. 0 errors.

Smoke: `node smoke.mjs ../<game>.html` prints `PASS localStorage blocked: no crash` for all three. The other FAILs (`#btn-play` x4, dark/light/reduced-motion "still playable") are the known harness mismatch for legacy games (no `#btn-play`), not storage related.

Grep (`localStorage|sessionStorage|indexedDB|document.cookie`) on the three files: every access is inside try/catch (adverbs 593, 606, 1106, 1116, 1168; antonyms 844 (pre-existing try), 853, 1459; praep 664 (pre-existing try), 671, 1237, 1238, 1304, 1350). Remaining text hits are comments. No `sessionStorage` anywhere.

Diff review (`git diff`, 3 files): only guard lines are touched (try/catch wrapping, plus local defaults `darkPref`, `let best=0`, `let speedBest=0`). No key string, data shape, scoring or UI change.

## Acceptance criteria
| Criterion | Result | Evidence |
|---|---|---|
| Every localStorage/sessionStorage read/write in the 3 files in try/catch | PASS | grep + diff above |
| `smoke.mjs ../adverbs.html` passes "localStorage blocked: no crash" | PASS | rerun: PASS (also the other two games) |
| Getter throwing: Adverbier zone map + questions; Antonymer starts every mode; Præp Lynrunde result + Statistik | PASS | table above, getter mode, natural 60 s Lynrunde |
| 0 pageerrors in all three cases | PASS | 0 pageerror/console.error in proto, getter, normal for all games |
| Storage keys unchanged | PASS | diff touches no key strings; keys seen after play match the story |

## Regressions / notes
- None found. HEAD failure reproduced exactly as described (Adverbier 0 zones, Antonymer modes dead, Lynrunde "0s", Statistik pageerror).
- Known limitation (not a criterion): Lynrunde "Rekord" cannot persist when storage is blocked.
- Antonymer match mode was only started/rendered by my generic clicker, not completed.

Verification: VERIFIED
