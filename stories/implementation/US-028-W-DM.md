# US-028 - W-DM slice (Dansk Mester)

1. Summary: CSS `.opt.correct/.wrong::after` now "✓ RIGTIGT" / "✗ FORKERT" (dansk-mester.css:181-182); match "◀ PICKED" -> "◀ VALGT" (css ~237); "Continue ▸" -> "Fortsæt ▸" (html ~1131).
2. Status: IMPLEMENTED
3. Tests: own puppeteer drive (Edge, file://) 360x740 + 1440x900: no h-scroll, zero console/page errors. `node tests/smoke.mjs danske-phraser/dansk-mester.html`: all rows PASS except the known legacy artefact (no `#btn-play`: "play button found" x4 and "console clean + still playable" x3 FAIL; console itself is clean).
4. Manual: grep of dansk-mester.html/css for CORRECT|WRONG|Continue|PICKED|Pronounce: 0 hits (aria "Udtal" was already Danish).
5. Files: shared/themes/dansk-mester.css:181,182,~237; danske-phraser/dansk-mester.html:~1131.
6. Risks: US-029 may rename speaker aria "Udtal" to "Lyt" (not touched).
7. Newly discovered: none.
8. Native review: none.
9. Criteria:
- Every string listed is replaced - PASS (Dansk Mester rows; other games: other owner)
- A grep across game files for the English strings returns 0 user-visible hits - PASS for my files; other games other owner
- Accessible names are Danish - PASS for my files
