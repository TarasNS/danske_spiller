# US-031 — slice W-PRON (Pronomenmysteriet)
1. Summary: answered options now use `aria-disabled` instead of `disabled` and the chosen option keeps focus (disabled buttons dropped focus to BODY); wrong answer still moves focus to Videre; next item focuses first option (unchanged). Summary focus on "Spil igen" is now set in `finishRound` after `show('summary')` (was set while hidden). Order matches tidsmaskinen. Theme CSS updated so aria-disabled options look/behave like disabled ones.
2. Status: IMPLEMENTED (modal-open part not applicable: only the shared explainer modal exists here, owned by shared/explainer; focus handling there is a shared dependency, not touched)
3. Tests: `node tests/pronomenmysteriet.mjs` (OUT redirected to scratchpad, no dump left): final run 64/66. Remaining FAILs: "subject_object: auto-advance ~800ms" (timing flake: machine loaded by parallel workers, samples 881-1541 ms; earlier run showed 15 s outliers) and "Space toggles a chip" (test bug: puppeteer key name `Space` is invalid, should be `" "`; not a game defect). Own checks: scratchpad `impl/W-PRON/chk.mjs`, all PASS.
4. Manual: scripted full round (correct and wrong answers): activeElement never BODY after an answer, lands on .opt for next item, summary focuses "Spil igen", Enter on it starts a round with first option focused.
5. Files: `pronomenmysteriet/index.html` (reset button in topbar ~L121; reset handler ~L249; `show()` ~L325 toggles reset; `buildRound` ~L348; answer focus ~L520; `finishRound` ~L405; summary focus line removed), `shared/themes/pronomenmysteriet.css` (opt aria-disabled rules, SPIL margins, confetti z-index, ~L72-79 and ~L122-126).
6. Risks: clicks on aria-disabled options are guarded by the existing `answered` flag.
7. Newly discovered: tests/pronomenmysteriet.mjs uses invalid key name 'Space' (test bug).
8. Native review: none.
9. Criteria:
- In every listed game, activeElement is never BODY after an answer, screen change or summary. — PASS for Pronomenmysteriet (others: other owner)
- Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen" (order as tidsmaskinen). — PASS (Pronomenmysteriet)
- Adverbier modals use focusTrap... — other owner
- Enter on the focused Next control advances in Antonymer. — other owner
