# VERIFY US-021 — Dansk Mester: notes and glosses (verifier V-GEM)

Diff read in full (`git diff --stat`: 11 insertions / 11 deletions). All `da:"..."` tokens are identical to HEAD (diff = same), so stats keyed `path|da` in `danskMester.v1` are unaffected.

Play-through (real clicks, Edge, 390x844): Flervalg, Tidsudfordring, Vendekort, Find par, Blandet repetition, Intervalrepetition and Svage ord all ran to the end screen. In every multiple-choice question: 4 distinct options. Progress keys remain `path|da`; XP and streak recorded. Zero console/page errors.

Distractor builder (l.945): `others = allItems(path).filter(da !== q.da && en !== q.en)`. In-page data check: 2 paths (verbs 50 items, phrases 100); minimum candidate count over every item = 49 (needs 3); no duplicate `en` or `da` left within a path. HEAD had one exact duplicate (`take care of`: passe på / tage sig af). So the filter is a safety net and cannot leave fewer than 3 distractors.

| Criterion | Result | Evidence |
|---|---|---|
| QA-112: note "»Mangler« betyder her, at der stadig er noget tilbage." | PASS | l.512 exact. |
| QA-113: enig i en sag / enig med en person; begynde på (en opgave) / begynde med (at ...); var + intetkøn -t. | PASS (wording adapted) | l.386, 387, 422 (enig i sag, enig med person); l.363 (begynde på en opgave, men begynde med at + infinitiv); l.484 ("»Var« + »hyggeligt« (intetkøn af »hyggelig«)"). |
| QA-114: glosses disambiguated, or the option builder excludes same-gloss items. | PASS | passe på "look after / watch out", tage sig af "take care of (a task)", se på "watch" (kigge på stays "look at"), "Det tror jeg" "I believe so"; plus builder filter. |
| Native-speaker sign-off. | NOT VERIFIED | Pending. |

UNCERTAIN (native review): (a) "passe på" = "look after / watch out" vs "se på" = "watch": "watch out"/"watch" stay close in en->da questions, and "se på" loses its "look at" meaning (now taught only via note); (b) "Det tror jeg" = "I believe so" vs "...også" = "I think so too"; (c) begynde-på note formulation; (d) enig-note wording; (e) "»Mangler« betyder her, at der stadig er noget tilbage." is a little vague (story text); (f) "Det var hyggeligt" note.

Scope: only `en`/`note` strings and the one-line filter; no creep. Regressions: none. I did not obtain an independent `smoke.mjs` result for this game (my run timed out in the harness); I rely on the zero-error play-through above plus the implementer's reported smoke.

Verification: NOT VERIFIED — every machine-checkable criterion passes, but the native-speaker sign-off criterion is outstanding and the rewrites are the implementer's own wording.
