# VERIFY-US-009 - Forvekslingspar serves only answerable items (verifier V-PREP)

File: `dansk-praepositioner.html` (working tree vs HEAD 0550623). Scripts/screenshots only in scratchpad `impl/v-prep/` (t9.cjs).

| Criterion | Result | Evidence |
|---|---|---|
| `randItem` fallback order: (level AND filter) -> (filter, all levels) -> only then any other fallback. The pair mode never falls back to unfiltered ITEMS. | PASS | `randItem` (l.727-737): `pool = filter ? byLvl.filter(filter) : byLvl; if(pool.length===0 && filter) pool = ITEMS.filter(filter); if(pool.length===0) pool = byLvl; ...ITEMS`. The last two fallbacks are unreachable with a pair filter (every group has >=16 items). `nextPair` additionally requires `it.a===p.a \|\| it.a===p.b` (l.1212). |
| A scripted run of 10 questions x every level x all 6 groups gives 0 items whose answer is outside `[p.a, p.b]`. | PASS | My own run (t9.cjs, real `nextPair()` calls, `randItem` wrapped to record the served item): levels "", A1, A2, B1, B2, C1 x 6 groups x 30 questions = 1080 questions. HEAD: 283/1080 questions had answer outside the pair AND not among the displayed options (e.g. A1 hos\|i 26/30, B1 om\|på 28/30, B2 med\|uden 28/30, A2 i\|til 26/30). Current: 0/1080 outside pair, 0/1080 where the correct answer is missing from the two rendered `#prOpts .opt` buttons. 0 page errors on both. |
| Other modes behave as before. | PASS | Diff review: only the filtered-pool fallback changed; non-filtered calls take the same path (`byLvl`, then ITEMS if empty). Mistake/correct now use `hasSafeErr` (that is US-019). Regression run (treg.cjs): all 8 modes + Lynrunde load and play, 0 console errors, progress (reviewQ) persists across reload, localStorage-blocked run (getter throws) plays mc/pairs/review, finishes Lynrunde and opens stats with 0 errors (US-004 guards at l.680-687, 1288-1289, 1355, 1401 intact). `tests/smoke.mjs`: all rows PASS except the known legacy-game rows (`#btn-play` x4, "still playable" x3). |

## Observations
- With a level selected, 510 of the 900 level-selected questions are served from another level (levels with no items for that pair, e.g. any pair at B2/C1, om\|på at A1). This is exactly what the story asks for; no label tells the learner the level was widened (not required).
- Pair-group sizes after US-019: i\|på 44, i\|til 34, af\|fra 37, hos\|i 28, med\|uden 21, om\|på 16 - every group starts and plays.
- Pre-existing, out of scope: some pair items accept both options as valid Danish ("Jeg arbejder hos/i Netto", "Han gik ud med/uden jakke"); see VERIFY-US-019.

## Regressions / scope creep
None found in the US-009 changes.

Verification: VERIFIED
