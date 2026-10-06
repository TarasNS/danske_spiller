# VERIFY4 US-050 Idiomjæger
| Criterion | Result | Evidence |
|---|---|---|
| Listed corrections applied | PASS (content UNCERTAIN) | diff: ud ad vinduet; Lægge nogen ord i munden; fingeren på pulsen; Jeg talte for døve øren; På mødet; Modersmålsniveau (3 places) |
| UNCONFIRMED items unchanged | PASS | last og brast, under radaren etc. untouched |
| Regex allows trailing punctuation; "Tak for kaffe!" blanked | PASS | all 168 idioms: no empty/degenerate/unblanked prompt; only difference vs old regex is "Tak for kaffe!" -> "Tak for _____" |
| Ids/progress stable; US-008/018 intact | PASS | 168 entries, 0 dup ids, id set identical to b9242ca; renamed 3 keep old ids; l/c/k/g fields identical (12 g groups) |

UNCERTAIN (native): "døve øren" (dictionary form may be "døve ører"); "ud ad vinduet"; "have fingeren på pulsen"; new example "Jeg talte for døve øren." and its translation.

Verification: NOT VERIFIED (native sign-off pending; mechanics PASS)
