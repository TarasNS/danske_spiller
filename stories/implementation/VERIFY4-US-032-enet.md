# VERIFY4 US-032 En/Et pixel sprites
| Criterion | Result | Evidence |
|---|---|---|
| All 8 mode icons and the emblems replaced by data-sd-sprite sprites | PASS | DOM: terning,bog,kiste,snak,modsat,slik,ur,lup + pokal,kort,tandhjul (+ header terning); all rendered an svg; existing Sjovt sprites |
| No rx= and no Cinzel | PASS | outerHTML contains neither |
| Dark-mode contrast of glyphs >= 3:1 | PASS | smoke contrast rows PASS; glyphs sit on a cream tile in both themes |

Visual (enet-menu-360/1366 light/dark, enet-sub-*): pixel-art consistent with other Sjovt menus (black outline, hard shadow, cream icon tile), dark mode fine, greyed Svage ord ok.

Semantic judgement (not a criterion, owner decision): sprite art does not always match the name. terning = en/et card pair (fits mode 1); bog (Bestemt form) shows a "?" speech bubble with a figure; kiste (Flertal) is a chest with a piglet - arbitrary; snak bubble (Dronningens gåder) fine; modsat two arrows (Spejlordene) good; slik blue+red blobs (Tvillingordene) acceptable; ur (Kaninens ræs) renders as a card with a cogwheel, NOT a clock; lup good. Style picker: pokal for Quiz ok, kort shows a "Vb." verb card for Vendekort, tandhjul gear+A card for Find par weak. Cards ~96px, no h-scroll at 360. Header terning duplicates mode 1 icon (pre-existing).

Verification: VERIFIED (criteria); sprite choices flagged for owner
