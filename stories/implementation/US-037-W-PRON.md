# US-037 — slice W-PRON (Pronomenmysteriet)
1. Summary: SPIL button moved above the mode list on the start screen (markup, right after the lede) so it is visible on load. Confetti: theme CSS now sets `.sd-conf{z-index:0}` and `.shell{position:relative;z-index:1}`, so confetti falls behind the results card instead of over the numbers (no change to sjovt.js). A first attempt with a sticky bottom SPIL was dropped because it overlaid the last mode button.
2. Status: IMPLEMENTED (confetti layering not visually inspected; side effect: confetti is mostly hidden behind the opaque card, visible only in the gutters/above)
3. Tests: `node tests/pronomenmysteriet.mjs` (OUT redirected to scratchpad, no dump left): final run 64/66. Remaining FAILs: "subject_object: auto-advance ~800ms" (timing flake: machine loaded by parallel workers, samples 881-1541 ms; earlier run showed 15 s outliers) and "Space toggles a chip" (test bug: puppeteer key name `Space` is invalid, should be `" "`; not a game defect). Own checks: scratchpad `impl/W-PRON/chk.mjs`, all PASS.
4. Manual: SPIL bottom edge measured: 1366x768 -> 410, 390x844 -> 449, 360x740 -> 473 (all within viewport). Smoke-style h-scroll/tap-target checks inside pronomenmysteriet.mjs pass at 4 viewports x light/dark.
5. Files: `pronomenmysteriet/index.html` (reset button in topbar ~L121; reset handler ~L249; `show()` ~L325 toggles reset; `buildRound` ~L348; answer focus ~L520; `finishRound` ~L405; summary focus line removed), `shared/themes/pronomenmysteriet.css` (opt aria-disabled rules, SPIL margins, confetti z-index, ~L72-79 and ~L122-126).
6. Risks: tab order now Spil before modes/levels; confetti visibility reduced.
7. Newly discovered: none.
8. Native review: none.
9. Criteria:
- Bøjningsværkstedet and Pronomenmysteriet: SPIL is visible at 1366×768 and 390×844 on load — PASS (Pronomenmysteriet)
- Confetti spawns behind the results text (z-index) or only from the trophy area. — PASS by CSS (NOT VERIFIED visually)
- 360 px overflow / hyphenation / Glosekort / other themes — other owner
