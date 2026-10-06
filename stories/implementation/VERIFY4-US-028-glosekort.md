# VERIFY4 US-028 - Glosekort slice (verifier V4-B)

Files: `danish_flashcards/danish_flashcards_game/script.js`, `index.html`.

| Criterion | Result | Evidence |
|---|---|---|
| Every string listed is replaced (flashcards `script.js:264` aria-label "Pronounce" -> "Udtal") | PASS | `script.js:264` now `setAttribute("aria-label","Udtal")`; live DOM `.speaker` aria-label = "Udtal". |
| Grep returns 0 user-visible hits | PASS | Grep of index.html, script.js and `shared/themes/flashcards.css`: 0 hits. |
| Accessible names are Danish | PASS | Remaining aria-label "Vend kortet" is Danish. Smoke "icon buttons labelled" PASS. |

Regressions: none. Smoke: only legacy artefact rows fail. Scope creep: none. UNCERTAIN: none.

Verification: VERIFIED
