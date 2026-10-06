# R2 Glosekort: reset Cancel keeps feedback line

Status: IMPLEMENTED

## Summary
A second click listener on `#restart-btn` (Sjovt hooks block, script.js) cleared `#sd-fb` unconditionally, even when `confirm()` returned false. Removed that listener; the clearing now sits at the end of the main restart handler, after the confirm and the reset. Cancel changes nothing visible. Confirm wording, spacing, `.dc-tts-button`, sidebar buttons and `.sd-surface` are untouched.

## Tests (Edge, scratchpad impl\r2-glose\t.js)
- Answer "Det vidste jeg", then `confirm` stubbed false and "Start forfra" clicked: feedback text/class, counters, page text and `verb_glosekort_v1` are identical before and after (PASS).
- `confirm` stubbed true: feedback cleared, storage reset (PASS).
- Console errors: none.
- Other reset paths: the only `confirm` is this one. "Tilbage til hele bunken" (exit review) has no confirm and does not touch the feedback line; unchanged.
- smoke.mjs: only the legacy `#btn-play` rows fail (known artefact); everything else passes.

## Files
`danish_flashcards/danish_flashcards_game/script.js`: restart handler (~l. 692-696), hooks block (~l. 753).

## Risks / issues
None new.
