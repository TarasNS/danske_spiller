# D-TIDS: Tidsmaskinen "six planned-future duplicates across modes" (DECISIONS row 10)

Read-only analysis of `tidsmaskinen/data.js` (nothing removed). Harness: scratchpad `impl\d6-dups\a.js..d.js`.

## What the QA finding says
`qa/language-review.md` LANG-012: "Six planned-future items appear in both present_vs_preterite and future." (QA-079, Minor.) It gives no ids, so the six had to be inferred.

## What exists (counts)
- Bank: 1260 items, 9 modes. Item ids are unique across the whole file (no id appears twice).
- Exact duplicate sentences cross-mode with the correct answer filled in: **0** for present_vs_preterite/future. Only the "future" planned items are word-order or small-wording variants of items in present_vs_preterite, so exact-string matching finds none.
- Other filled-sentence exact matches (NOT the six; listed for completeness, all legitimate two-blank splits except where noted):
  - `future` `boernene-er-ved-at-falde-i-soevn` / `infinitive` `...-soevn-2` (same sentence, different blank; cross-mode).
  - 12 conditional pairs (`hvis ... ville ...` two-slot items split into id / id-2) and 2 imperative pairs (`luk-doeren-tak`, `saet-dig-ned`): same mode, one blank per copy, intentional.
- present_vs_preterite items #94-#113 (20 items, ids from `toget-til-odense-afgaar-...` to `i-morgen-arbejder-jeg-hjemmefra`) are all "planned future event in present tense" and almost all have a sibling in `future` (#0-#16, #95). 16 pairs found by token similarity; two tiers below.

## The six (best match to the QA finding)
Defined as: same event, same context/learning point, one copy is the other reordered or with one phrase added/dropped. The number differs from QA only in that 10 more near-pairs exist (tier 2); the six below are the clear ones.

| # | id A (present_vs_preterite) | id B (future) | sentence with answer | options A (correct bold) / B distractors, accepted | context A / B | same lesson? |
|---|---|---|---|---|---|---|
| 1 | `naeste-sommer-rejser-vi-til-graekenland` (B1, #103) | `vi-rejser-til-graekenland-naeste-sommer` (B1, #9) | Næste sommer **rejser** vi til Grækenland. / Vi **rejser** til Grækenland næste sommer. (word order only) | A: **rejser**, rejste, havde rejst. B: accepts rejser, skal rejse; distractors rejste, har rejst, ville rejse | identical: "Det er planlagt og betalt." | Yes, identical |
| 2 | `i-aften-kommer-der-gaester-til-middag` (A2, #106) | `der-kommer-gaester-til-middag-i-aften` (A2, #11) | I aften **kommer** der gæster til middag. / Der **kommer** gæster til middag i aften. (word order only) | A: **kommer**, var kommet, kom. B: kommer, skal komme; distractors kom, er kommet, ville komme | identical: "Du har inviteret gæster." | Yes, identical |
| 3 | `i-morgen-arbejder-jeg-hjemmefra` (B1, #113) | `jeg-arbejder-hjemmefra-i-morgen` (A2, #16) | I morgen **arbejder** jeg hjemmefra. / Jeg **arbejder** hjemmefra i morgen. (word order only; levels differ B1 vs A2) | A: **arbejder**, arbejdede, havde arbejdet. B: arbejder, skal arbejde; distractors arbejdede, har arbejdet, ville arbejde | "Det er aftalt med chefen." / "...med din chef." | Yes |
| 4 | `toget-til-odense-afgaar-klokken-otte-i-morgen` (A2, #94) | `toget-afgaar-klokken-otte-i-morgen` (A2, #0) | Toget (til Odense) **afgår** klokken otte i morgen. | A: **afgår**, afgik, var afgået. B: afgår, skal afgå; distractors afgik, ville afgå, kommer til at afgå | identical: "Afgangen står i køreplanen." | Yes, identical (copy A adds "til Odense") |
| 5 | `moedet-starter-i-naeste-uge-paa-tirsdag` (A2, #97) | `moedet-starter-paa-tirsdag` (A2, #2) | Mødet **starter** (i næste uge) på tirsdag. | A: **starter**, havde startet, startede. B: starter, skal starte; distractors startede, har startet, ville starte | identical: "Det står i kalenderen." | Yes (copy A adds "i næste uge") |
| 6 | `butikken-aabner-foerst-kl-10-i-morgen-paa-grund-af-en-kursusdag` (B1, #105; full id begins `butikken-aabner-foerst-kl-10-i-morgen-paa-grund-af-en`, see file) | `butikken-aabner-foerst-kl-10-i-morgen` (B1, #10) | Butikken **åbner** først kl. 10 i morgen (på grund af en kursusdag). | A: **åbner**, havde åbnet, åbnede. B: åbner, skal åbne; distractors åbnede, har åbnet, ville åbne | "Butikken har åbningstider." / "...har skiftet åbningstid." | Yes (A adds the reason; A's context is weaker, "åbningstider" does not explain a changed time) |

Pairs 1-3 are the strongest (token overlap 1.00); 4-6 are 0.75/0.57/0.58 but share event + context.

## Tier 2: near-pairs (same pattern, one element changed; harmless to keep)
| id A (present_vs_preterite) | id B (future) | difference |
|---|---|---|
| `vi-rejser-paa-fredag` #95 | `jeg-rejser-paa-fredag` #1 | Vi / Jeg |
| `min-tante-kommer-i-morgen-kl-16` #96 | `min-kusine-kommer-i-morgen-kl-15` #4 | tante/kusine, 16/15 |
| `jeg-gaar-til-tandlaege-paa-mandag` #98 | `jeg-gaar-til-tandlaege-i-morgen` #3 | på mandag / i morgen |
| `gymnasiet-lukker-for-sommerferie-den-25-juni` #99 | `folkeskolerne-lukker-for-sommerferie-den-24-juni` #5 | subject and date |
| `flyet-lander-i-rom-klokken-fjorten-paa-mandag` #102 | `flyet-lander-i-rom-klokken-fjorten-i-morgen` #7 | på mandag / i morgen |
| `jeg-ringer-til-dig-klokken-elleve-i-morgen` #104 | `jeg-ringer-til-dig-klokken-ti-i-morgen` #8 | 11/10; future copy accepts "ringer til" |
| `auktionen-finder-sted-den-3-marts` #109 | `operationen-finder-sted-den-3-marts` #14 | auktionen / operationen |
| `vi-bor-paa-hotel-i-tre-naetter-naar-vi-kommer-til-rom` #110 | `vi-bor-paa-hotel-i-to-naetter-naar-vi-kommer-til-rom` #15 | tre / to nætter |
| `min-bror-bliver-30-i-naeste-maaned` #111 | `min-bror-bliver-30-i-marts` #95 | "næste måned" / "marts" |
| `boernehaven-begynder-igen-paa-mandag-efter-ferien` #112 | `skolen-begynder-igen-paa-mandag-efter-ferien` #13 | børnehaven / skolen |

Other cross-mode near-matches found by the scan are NOT planned-future and are out of scope (e.g. preterite_vs_perfect `telefonen-ringede-for-fem-minutter-siden` vs present_vs_preterite `for-fem-minutter-siden-ringede-telefonen`, Jaccard 1.00, same reordering pattern: worth a separate look; modal `her-maa-man-ikke-ryge` vs infinitive `man-maa-ikke-ryge-her`, 1.00).

## Effect of removal
Mechanics: SRS key = `tidsmaskinen:<item.mode>:<id>` stored under `srs:tidsmaskinen`, so progress on a removed id is orphaned (harmless but lost; the remaining copy has its own separate key, no merge). Pattern keys are mode-level and unaffected. `tests/tidsmaskinen.mjs:223` asserts pools 120/180/100/140/180/140/140/180/80 and would need updating (and possibly `:522` if a removed pvp id is hit, which uses a random item so no). `shared/validate.js` has no per-mode pool count. Total bank 1260.

| Mode | Now | Remove the six pvp copies (A) | Remove the six future copies (B) | Remove both (not advised) |
|---|---|---|---|---|
| present_vs_preterite | 120 (A2 73 / B1 41 / B2 6) | 114 (A2 70 / B1 38 / B2 6) | 120 | 114 |
| future | 140 (A2 51 / B1 72 / B2 17) | 140 | 134 (A2 47 / B1 70 / B2 17) | 134 |
| all other modes | unchanged | unchanged | unchanged | unchanged |
| total | 1260 | 1254 | 1254 | 1248 |

Orphaned SRS keys in option A: `tidsmaskinen:present_vs_preterite:` + the six A ids; option B: `tidsmaskinen:future:` + the six B ids.

## Recommendation
- Keep the `future` copies (B). They carry the grammar point of the future mode: they accept both the present form and the "skal" form and have future-specific distractors ("ville ...", "har ..."), so they teach "planned future may be present tense, or skal" with a typed answer, which the 3-option present_vs_preterite copies do not.
- If anything is removed, remove the six pvp copies (A), choosing the version-with-the-extra-phrase ones deliberately: pairs 4-6 A copies are the longer variants (arguably the better sentence); if the owner prefers fewer deletions, keep A for 5 and 6 and drop only the B copies of 1-3? Simplest and cleanest is: remove A for pairs 1-3 (pure reorderings, zero extra teaching) and keep 4-6 as harmless variants.
- Tier 2 pairs: keep all; they differ in a content word and teach the same pattern in a different mode, which is normal reinforcement.
- Note on mode coherence: the whole present_vs_preterite block #94-#113 (20 items) teaches "present for planned future", which belongs in `future`; the pvp mode already has its own note text for it. That is a design question for the owner, not a duplicate fix.

## Summary for the owner
The QA review says six planned-future sentences appear in both present_vs_preterite and future. No sentence is a byte-identical copy; the six are the pairs where the same planned event with the same context appears in both modes as a reordering (Næste sommer rejser vi til Grækenland, I aften kommer der gæster, I morgen arbejder jeg hjemmefra) or with a phrase added or dropped (Toget (til Odense) afgår, Mødet starter (i næste uge) på tirsdag, Butikken åbner først kl. 10 i morgen (...)). Ten more pairs differ by one word and are harmless. Only these six are real duplicates; removing either side of any of them orphans the SRS progress stored under that item's id and shrinks one mode's pool by six (120 -> 114 or 140 -> 134), and a test asserts the pool sizes. Recommended decision: keep all as they are for now (no learner-visible harm, the copies train different formats), or if the owner wants them gone, drop the three pure reorderings (pairs 1-3) from present_vs_preterite (pool 120 -> 117) and update `tests/tidsmaskinen.mjs` pool expectation accordingly; keep the future copies in every case.
