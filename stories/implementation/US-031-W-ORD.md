# US-031 (Ordstilling slice) - W-ORD
Status: IMPLEMENTED
Summary: focus never falls to BODY. loadQuestion() -> focusFirstTile() (first unused pool tile, preventScroll, after US-013 keepAnswerInView); placing a tile moves focus to the next unused tile or UNDERSØG when enabled; returning a chip focuses its tile; Ryd focuses first tile; used tiles get tabindex=-1; result screens focus "againBtn"; returning to the case map (back / "Sagskort") focuses first enabled case button (focusMapStart). showExplain already focused Næste (kept).
Tests: scripted keyboard/click run through a whole case: activeElement after start, after placing, before/after Tjek (nextBtn), after Næste (tile), at the result (againBtn), after Enter on againBtn (tile) - never BODY; 0 errors. US-013 keepAnswerInView, US-023 alt logic, explainer ids, timer untouched.
Files: ordstilling-detektiv/index.html (loadQuestion end ~1009-1017, placeTile ~1030-1062, clearBtn, focusMapStart ~887, finishSession x3).
Criteria (slice): activeElement never BODY after answer/screen change/summary PASS (Ordstilling); other games: other owner. Manual screen-reader/Tab-walk beyond scripted run NOT VERIFIED.
Risks: auto-focusing the first tile may show a focus ring on touch devices only on keyboard modality (:focus-visible), acceptable.
