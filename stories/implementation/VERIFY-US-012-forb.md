# VERIFY US-012 (Forbindeord slice, W-FORB) - verifier V-FKT

Scope: `forbindenor/Forbindenor.html` (loadProgress, recordAnswer, buildWeakPool). Scripts: scratchpad `impl/V-FKT/forb.cjs` (Edge, file://, seeded localStorage, real UI clicks).

| Criterion | Result | Evidence |
|---|---|---|
| The weakness rule uses a recent streak or the last result (or DanskCore.srs), not lifetime c<t. | PASS | `buildWeakPool` now `pw.c < pw.t && (pw.s||0) < WEAK_CLEAR_STREAK` (=2); `recordAnswer` sets `pw.s = isCorrect ? (pw.s||0)+1 : 0`. Seeded `før {t:16,c:15}` (HEAD format, no `s`): weak button shown, pool contained `før`. |
| Forbindeord: perfect weak loops empty the weak pool. | PASS | Entered Svage ord through `#weakBtn`, clicked the correct option + `#next` 8 times: pool empty, toast "Ingen svage ord tilbage!", `#weakBtn` hidden. `før` became `{t:20,c:19,s:4}`. At HEAD the rule `c<t` can never clear a word (diff). |
| Re-added on a miss | PASS | Forced a `før` item in normal mode, clicked a wrong option: `{t:21,c:19,s:0}` and `buildWeakPool()` includes `før` again. |
| Existing saved data migrates: add a streak field, defaulting to 0, without wiping c/t. | PASS | Old save loads; c/t preserved (`og {4,4}`, `før {16,15}`); `s` missing is treated as 0; `LS_KEY` `forbindenor_v1` and `weakPool/weakOrder/weakMode` names unchanged. |

## Regression checks
- Full normal round: 359 correct answers + next reaches the end screen "Du gennemførte alle 359 sekvenser", zero console errors/warnings.
- localStorage that throws: loads and answers a question, no errors (try/catch guards intact).
- US-002 draw check: `distractors(rec)` called 300 times for each of the 359 records (107,700 draws): always 4 unique options, answer present, answer never among distractors. 0 bad draws.
- US-002 block unchanged except the one stale `SYN_GROUPS` entry (`"ovenikoebet"` -> `"oven i koebet"` in the desuden group). The diff against HEAD shows the US-002 block as one added hunk; there is no Batch-1 snapshot to byte-compare, so this is a reading-based check: no ITEM_EXCL/KIND/WILDCARD/other edits relate to the oven word, and the draw check passes. Limitation: not a byte diff.
- `node tests/smoke.mjs forbindenor/Forbindenor.html`: only the known legacy rows (no `#btn-play`, "console clean + still playable") fail.

## Scope creep
None for this slice. Observation (not a defect): a word with several sequences can reach streak 2 inside a single loop; the implementer documented it.

## UNCERTAIN
None (no language content).

Verification: VERIFIED
