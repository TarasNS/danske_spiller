# VERIFY4 US-028 - Forbindeord slice (V4-D)

| Criterion | Result | Evidence |
|---|---|---|
| "+1 ENERGY" -> "+1 ENERGI" | PASS | Forbindenor.html choose(): `energyPopup('+1 ENERGI')`; page source contains no "ENERGY" (puppeteer outerHTML check). |
| English category labels next to Danish ones: remove | PASS | `#catEn`, `CAT_EN`, `catEn` and `.cat .en` CSS removed (git diff b9242ca..HEAD); `getElementById('catEn')` = null; rendered body text "HOLDNING / Hun er _____ hjemme nu." has no English. Consistent with PRD (English only to resolve semantic ambiguity: the post-answer "Oversættelse" remains by design). |
| Accessible names Danish | PASS | speaker "Lyt til sætningen"; no English strings in visible UI text. |

Regressions: none (smoke, console clean). Scope creep: none. UNCERTAIN: none.
Verification: VERIFIED
