# US-050 (Idiomjæger part) — W-IDIOM
## 1. Summary
Applied in `idiomjaeger.html`: "Smide penge ud af vinduet" -> "ud ad vinduet" (d + example); "Lægge ordene i munden på nogen" -> "Lægge nogen ord i munden"; "Have en finger på pulsen" -> "Have fingeren på pulsen" (+ example); "Tale for døve øren" example "Mine advarsler talte…" -> "Jeg talte for døve øren." (translation adjusted); "Til mødet følte jeg mig" -> "På mødet…"; "Native-niveau" -> "Modersmålsniveau" (3 places, results line reworded "Forståelse på modersmålsniveau!"); completion regex now `[\s!?.]*$` so "Tak for kaffe!" is blanked ("Tak for _____"). To keep progress keys stable, the id line now honours an explicit `id` (`d.id=d.id||…`) and the three renamed idioms carry their old ids. US-018 data/`g` groups untouched (168 entries, 0 duplicate ids, old ids verified present).
## 2. Status: NEEDS REVIEW (native sign-off outstanding)
## 3. Tests: scripted check: ids present, 168 entries, 0 duplicates, "Tak for kaffe!" blanked; no console issues at 360/1440.
## 5. Files: `idiomjaeger.html` lines ~374, 444, 453-454, 517, 531, 604, 862, 923, 1050.
## 7. Newly discovered: none new.
## 8. Needs native review (unchanged): "Stå last og brast" (standard "dele last og brast"), "Gå under radaren" ("flyve under radaren"), "Have noget i ærmet", "Få sig en gang på frakken"; also whether "ud ad vinduet" and "ører/øren" forms are right; new example "Jeg talte for døve øren." Other games/portal parts of US-050: other owners / BLOCKED (portal frozen).
## 9. Criteria
| Criterion | Result |
|---|---|
| Each listed correction applied (Idiomjæger) | PASS (clear ones); UNCONFIRMED not applied |
| UNCONFIRMED sub-items change only after native confirmation | PASS (left unchanged) |
| Completion regex allows trailing punctuation; "Tak for kaffe!" blanked | PASS |
| Bøjning verify:true, Portal, validate.js | other owner / not applicable |
