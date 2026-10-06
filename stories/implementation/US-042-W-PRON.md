# US-042 — slice W-PRON (Pronomenmysteriet)
1. Summary: `buildRound` now queues: just-missed items (SRS box 1, newest lastSeen first), then due items (box>1, dueAt passed), then unseen, then not-yet-due (soonest first); first 10, shuffled. Ported from tidsmaskinen. SRS keys and storage untouched.
2. Status: IMPLEMENTED
3. Tests: `node tests/pronomenmysteriet.mjs` (OUT redirected to scratchpad, no dump left): final run 64/66. Remaining FAILs: "subject_object: auto-advance ~800ms" (timing flake: machine loaded by parallel workers, samples 881-1541 ms; earlier run showed 15 s outliers) and "Space toggles a chip" (test bug: puppeteer key name `Space` is invalid, should be `" "`; not a game defect). Own checks: scratchpad `impl/W-PRON/chk.mjs`, all PASS. Before the change the "due items first on new round" check failed (unseen items outnumbered missed); after the change it passes for subject_object and reflexive_possessive (missedBack=true leaked=0). "SRS keys format" checks pass for all modes.
4. Manual: n/a beyond the spec test.
5. Files: `pronomenmysteriet/index.html` (reset button in topbar ~L121; reset handler ~L249; `show()` ~L325 toggles reset; `buildRound` ~L348; answer focus ~L520; `finishRound` ~L405; summary focus line removed), `shared/themes/pronomenmysteriet.css` (opt aria-disabled rules, SPIL margins, confetti z-index, ~L72-79 and ~L122-126).
6. Risks: items missed in earlier rounds (still box 1) also come first; if more than 10 are box 1, the oldest wait.
7. Newly discovered: none.
8. Native review: none.
9. Criteria:
- Queue order: missed in the last round, then due, then unseen. — PASS
- tests/pronomenmysteriet.mjs resurfacing checks pass. — PASS
- SRS keys are unchanged. — PASS
