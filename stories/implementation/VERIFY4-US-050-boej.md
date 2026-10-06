# VERIFY4 US-050 (Bøjningsværkstedet + shared nouns/adjectives slice, QA-089)

Method: read `git diff b9242ca HEAD` of `boejningsvaerkstedet/data.js`, `shared/data/nouns.js`, `shared/data/adjectives.js`; loaded both versions in a `vm` sandbox and compared item ids and content; `node shared/validate.js`; read US-050 text and `qa/language-review.md` LANG-021/025/026 (QA-089 row in `qa/FINAL-QA-REPORT.md:229`).

## Item counts and id stability (US-015 intact)
| Mode | baseline b9242ca | HEAD | ids removed / added | content changed for kept ids |
|---|---|---|---|---|
| fire_former | 1300 | 1260 | 40 / 0 (10 verify nouns x 4 forms) | 1 (`aeg-ubestemt-flertal` note) |
| byg_navneordet | 570 | 561 | 9 / 0 (sjov-ulv, dyr-park, god-kirke x 3 forms) | 0 |
| adjektivvaerkstedet | 746 | 746 | 0 / 0 | 4 (blaa/graa flertal + bestemt notes) |
| sammenligningspressen | 176 | 176 | 0 / 0 | 71 (daarlig variants + 70 notes "-ere/-est" to "-ere/-st") |
| bestemt_ubestemt | 250 | 250 | 0 / 0 | 0 |
| maengdevaerkstedet | 221 | 221 | 0 / 0 | 1 (`b6-meget-hjaelp` context) |

HEAD counts equal the expected 1260/561/746/176/250/221; no id added, no duplicate ids, no id renamed (storage keys stable). `node shared/validate.js`: TOTAL 0 errors, 0 warnings. `tests/pronomen-data-guard.mjs`: PASS (6 modes, 760 items, A2/B1/B2); `pronomenmysteriet/data.js` has no diff vs baseline, so Batch-1 Pronomen data and guard are intact. US-010 option/tile shuffles intact.

## Scope question: filter of the 10 `verify:true` nouns, 3 skipped Mode 2 pairs, "æg →ægget"
Decision: all three are AUTHORISED by the story, not scope creep.
- US-050 acceptance criterion 4 reads literally: "Bøjningsværkstedet filters out `verify:true` nouns from Mode 1, or a native speaker resolves them." The implementation is exactly the first alternative (`if (noun.verify) return;` in `buildFireFormer`, 40 items). LANG-025 suggests the same ("filter out `verify: true` items, or drop frygt and sol"), so filtering all ten, not only frygt/sol, is within the offered fix, though it is the broader of the two options.
- Collateral loss, as the implementer admits: LANG-025 lists 8 nouns QA rated correct (menneske, tallerken, køkken, morgen, eksamen, café, idé, app); the implementer's report says "7", the real number is 8 (the report's own list also names 8). Their Mode 1 forms are no longer practised (they remain in Mode 2/5/6 hand-written items such as `b5-mit-koekken`, `b6-mange-mennesker`). A native speaker can clear the flags to bring them back. Judged an acceptable, reversible consequence of the story's wording; flagged for the owner.
- Mode 2 SKIP_PAIRS (en dyr park, en god kirke, en sjov ulv): named in the "Problem" section of US-050 ("Implausible pairs: en dyr park, en god kirke, en sjov ulv") and in LANG-026 under "Exact text and fixes"; "Expected behavior: The corrections listed above are applied." Authorised. Only QA judged the pairs implausible; the criterion "UNCONFIRMED sub-items change only after native confirmation" does not apply because they are not marked UNCONFIRMED. Mode 2 shrinks 570 to 561 as a consequence.
- `nouns.js` "æg →ægget" to "æg → ægget": listed in the story ("Typo nouns.js:77") and LANG-026. Authorised; one-character note fix.

## Per-criterion table
| Criterion | Result | Evidence |
|---|---|---|
| Each listed correction is applied, per game, in separate PRs. | NOT VERIFIED | Applied in the working tree (list below). "Separate PRs" is a process matter, not checkable here (one batch commit). Content items need native review. |
| UNCONFIRMED sub-items change only after native confirmation. | PASS | `høne` plural, `interessantere`/`blåere`, `b6-faa-penge` / `b6-faerre-penge` "penge" note: all unchanged (diff). |
| The Idiomjæger completion regex ... | NOT APPLICABLE | other game |
| Bøjningsværkstedet filters out `verify:true` nouns from Mode 1, or a native speaker resolves them. | PASS | 40 items removed; no `menneske/tallerken/koekken/sol/morgen/eksamen/cafe/app/ide/frygt` ids in Mode 1 (id diff). Smoke and my 6-mode rounds play normally with zero console errors. |
| Portal text and level labels are corrected. | NOT APPLICABLE | other owner |
| `node shared/validate.js` gives 0 errors; smoke per game. | PASS | validate TOTAL 0 errors / 0 warnings; `tests/smoke.mjs ../boejningsvaerkstedet/index.html` Verdict PASS. |

## Listed corrections, checked in the diff
| Item | Result | Evidence |
|---|---|---|
| dårlig accepts dårligere/dårligst | PASS | Mode 4 `daarlig-sammenligning`: komparativ accepts `værre`, `dårligere`; superlativ adds `dårligst`, `dårligste`, `den dårligste`, `det dårligste` (shown key still værre/værst). |
| blå/grå note | PASS (wording UNCERTAIN) | "Blå er uændret i flertal: blå." / "...i bestemt form: blå."; only the 4 blaa/graa items change (condition `ePlur === common`). |
| "roligere → roligst" labelled "-ere/-est" | PASS (wording UNCERTAIN) | 70 notes now "-ere/-st" (-ig, -lig and -som adjectives), regular -est notes unchanged. |
| implausible pairs | PASS | see scope section. |
| "Tak for ___ hjælp" | PASS (UNCERTAIN) | Rewritten to "Hun har brug for ___ hjælp med lektierne." (key `meget`, options meget/mange unchanged) instead of QA's "Tak for hjælpen", which would not test mange/meget. Id unchanged. |
| lille note | PASS | "Lille bruges i ubestemt ental (en/et lille) og bestemt ental (den/det lille); flertal er det helt andet ord små." (adjective data only; QA noted it is never displayed). |
| spændende note | PASS | "førnutids tillægsform" to "nutids tillægsform". |
| æg typo | PASS | see scope section. |
| penge note | NOT CHANGED | UNCONFIRMED, correct per criterion 2. |

## UNCERTAIN (for native review)
- New sentence "Hun har brug for meget hjælp med lektierne." (grammatical to a non-native reader).
- Notes "Blå er uændret i flertal: blå." and "Blå er uændret i bestemt form: blå." (same for grå).
- "-ere/-st" label for -ig/-lig/-som adjectives (e.g. "Ensom gradbøjes med -ere/-st: ensommere → ensomst" where the consonant doubles).
- `dårligere/dårligst` acceptance in combination with `værre/værst` (mixed pairs such as værre + dårligst are accepted; harmless).
- The 8 correct nouns dropped from Mode 1 (owner decision whether to clear their flags); `høne` (høner vs høns) still served in Mode 1 (not `verify:true`).
- Not in the list but noted by the implementer: `b5-deres-bil` / `b5-deres-boern` reflexive sin/sine; left unchanged.

## Regressions / scope creep
- Regressions: none found. Rounds in all 6 modes complete; progress persists; storage blocked does not crash (smoke).
- Scope creep: none beyond the story's text. The only judgment call is filtering all ten flagged nouns (collateral 8 correct nouns).

Verification: NOT VERIFIED (all machine-checkable criteria PASS and the filter/pairs/typo work is authorised by the story, but the changed Danish wording needs native-speaker sign-off, and "separate PRs" cannot be assessed)
