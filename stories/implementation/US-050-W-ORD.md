# US-050 (Ordstillingsdetektiven part) - W-ORD
Status: IMPLEMENTED
Applied (clear): grammarTip case 8 "udfylder hele sætningen forreste plads" -> "hele bisætningen"; "Næste uge starter jeg på et nyt job" -> "I næste uge starter jeg på et nyt job" (en text unchanged); "en email" -> "en e-mail" (2 sentences, da only). US-023 alt/tips kept. Token counts change automatically (data split by space; "e-mail" is one tile).
Needs native review: whether bare "Næste uge starter jeg ..." was acceptable colloquially (changed per QA, low risk); "e-mail" as single tile with hyphen.
Tests: full case run, 0 errors; smoke failures only legacy #btn-play artefacts.
Criteria: "Each listed correction applied" PASS for Ordstilling (3 items); UNCONFIRMED items: none in this slice; portal/other games: other owner.
Newly discovered: none.
