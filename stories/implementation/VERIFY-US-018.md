# VERIFY-US-018 - Idiomjaeger: reversed idiom, calque entry, synonym distractors (verifier V-IDMV)

Verified file: `idiomjaeger.html` (working tree vs `git show HEAD:idiomjaeger.html`, full diff read). Scripts: scratchpad `impl/V-IDMV/idiom2.js`, `idiom3.js`.

## Criteria
| Criterion | Result | Evidence |
|---|---|---|
| QA-100: m "To come together perfectly / form a harmonious whole". Rewrite x, e and t (e.g. "Musikken og billederne gik op i en højere enhed."). Category is no longer "Problems & Challenges". | PASS (wording UNCERTAIN) | `DATA_BY_ID.gaa_op_i_en_hoejere_enhed` at runtime: m "To come together perfectly / form a harmonious whole" (exact), x "For different parts to fit together into a harmonious whole.", e "Musikken og billederne gik op i en højere enhed.", t "The music and the images came together as a harmonious whole.", l C1, c "Everyday Life", k "enhed", id unchanged. Fill-in: `blankWord(e,'enhed')` still blanks "enhed" in the new example (fillMissing played at all levels, no errors). Meaning is now the real idiom sense (merging into a harmonious whole), judged correct. |
| QA-101: delete the entry. If it is kept, the example uses "har vist rejst mig". | PASS | "Have rejst sig på den forkerte side" absent from `DATA` (runtime check false). "Stå op med det forkerte ben først" still present (kept, exactly one such entry). |
| QA-102: merge the exact duplicates and add a synonym-group field. The pickers exclude every member of the answer's group. | PASS | Diff: "Slå hovedet på sømmet" deleted, "Ramme hovedet på sømmet" kept; "Det er ikke nogen sag" deleted, "Det er ingen sag" kept (both deleted ones absent at runtime, kept ones present). Count 171 -> 168 (HEAD 171 by `git show`, current 168 at runtime); 168 unique ids, 168 unique `d`, 0 shared `m` strings. Field `g` on 5 groups: rammeplet {Ramme plet, Ramme hovedet på sømmet, Være lige i skabet}; fejle {Gå i vasken, Gå i fisk}; sigedet {Tage bladet fra munden, Tale lige ud af posen, Sige rent ud}; glat {Det går som smurt, Det kører på skinner}; forkert {Det er hen i vejret, Være ude i hampen}. Sampling: for every group member as the answer, 1000 draws each of `otherMeanings`, `otherIdioms`, and the built questions `bIdiomMeaning`, `bMeaningIdiom`, `bContext`, `bExampleDetective` (checking the actual option lists, not just the picker): 2000-3000 draws per group, **0 violations** in all 5 groups. |
| Badge, achievement and mastery counts still work after any entry deletion. Check `masteredCount` and the stored per-idiom keys; idioms are keyed by `d`/`k`. | PASS | Seeded `idiomjaeger_v2` before load with: `ghost_key`, the ids of all 3 deleted idioms (`have_rejst_sig_paa_den_forkerte_side`, `slaa_hovedet_paa_soemmet`, `det_er_ikke_nogen_sag`, box 4-5), 70 orphan keys `orph_N` (seen 3), null/number/{} entry values, `ach` with unknown id. `masteredCount()` = 0 (orphans ignored), stats screen "0 IDIOMER LÆRT", "Idiomopdager" not granted from 70+ orphan keys (the original `Object.values` count would have granted it), all 12 modes + weak + practice + stats + achievements run: 0 pageerrors/console errors. Malformed storage shapes (`{"idiom":[],"ach":"x"}`, `{"idiom":null}`, `{"idiom":{"a":null,"b":5},"ach":null}`, non-JSON) all load and play without error. Ids are still derived from `d`, so existing progress for kept idioms is preserved; progress for the 3 deleted idioms is simply not counted. |
| Native-speaker sign-off. | NOT VERIFIED | Requires a native speaker. |

## Diff review
- All data hunks are limited to: the rewritten entry, 3 deletions, `g` additions on 11 entries (5 groups). `sameGroup()` + two filter conditions in the pickers, `load()` normalisation, `explorer` achievement and stats "mødt" count restricted to `DATA_BY_ID` keys, one comment line. No formatting churn.
- Scope note (mild, justified): the story names three groups (gå i vasken/gå i fisk, sige-rent-ud trio, ramme plet/lige i skabet); the implementer added two more (glat, forkert). The same defect class, no rule violated; flagged in the report and accepted here, but the group membership needs native review.
- `load()` accepts `idiom` as an array (typeof 'object'); harmless (tested).

## Regressions
None. Zero errors at A2/B1/B2/C1/all and with blocked localStorage; reload persistence OK.

## Remaining weakness (not an acceptance failure)
- Synonym pairs can still meet as cards in Memory and as left/right columns in "Find par" (these are not distractor pickers, the story only covers pickers). Candidate additional near-synonyms not grouped: "Lægge kortene på bordet" (be open/honest) vs the "sigedet" group; "Gå i hundene" vs "Gå i vasken/fisk" (fail/deteriorate, different enough). Implementer already notes that no systematic audit was done.

## UNCERTAIN content (native review needed)
1. New meaning/example of "Gå op i en højere enhed": "Musikken og billederne gik op i en højere enhed." / "...came together as a harmonious whole." Reads correct to me; category "Everyday Life" and level C1 are a judgement call (arguably "Art"/abstract, no such category exists).
2. Which duplicate was kept ("Ramme hovedet på sømmet" B2 over "Slå hovedet på sømmet"; "Det er ingen sag" A2 over "Det er ikke nogen sag"): both choices look standard Danish, native to confirm.
3. Group memberships: especially "Ramme plet" (say/do exactly the right thing) vs "Være lige i skabet" (be spot on) vs "Ramme hovedet på sømmet" (describe exactly right) - near but not identical; "Det går som smurt" vs "Det kører på skinner"; "Det er hen i vejret" vs "Være ude i hampen" (nonsense vs completely wrong).
4. The "Hvilket idiom?"/context modes use `x` as prompt; now generic "For different parts to fit together into a harmonious whole." - plausible but could also fit other idioms (judge by a native).

Verification: NOT VERIFIED
All machine-checkable criteria PASS (QA-100/101/102 data and pickers, stored-key hardening, 0 errors). The last criterion "Native-speaker sign-off" is NOT VERIFIED (cannot be checked here); the Danish/English content items above are UNCERTAIN.
