# QA stories: status (2026-10-06)

Both QA rounds (US-001..057) are implemented and merged into the branch history. Detail lives in git (`git log -- stories/`), not in per-story files.

## Open work
- **US-058..061**: Danish content fixes (Tidsmaskinen passive, Præpositioner distractors, Konjunktioner distractors, Bøjningsværkstedet `deres`/`sin`). See `OPEN-STORIES.md`.
- **US-029**: owner to accept the 32 px visible / 44 px hit-area inline listen button.
- **US-051**: ~920 Sætningsmaskinen items to author after release (native review needed).
- **US-027**: needs the `specs.md` wording from the owner.
- **Manual play-through on real devices**: never done; last step before publishing.

## Recorded minor issues, status not re-checked
Fixed in round 2 and left off this list: Adverbier unlock, below-the-fold feedback, Dansk Mester note, Glosekort reset-cancel, dead `.blank` CSS, spec-test fixes.
- Præpositioner "Find fejlen" always scores correct on single-preposition sentences.
- Focus drops to BODY: Idiomjæger, Dansk Mester, Konjunktioner game over.
- Forbindeord keeps its scroll after NÆSTE at 360x640; Konjunktioner NÆSTE below the fold at 1366x768.
- En/Et: Enter on a focused Lyt button advances the question.
- Glosekort: ~150 Tab stops before the answer buttons; C1 filter does nothing.
- Antonymer "INDSTILLINGER" and Præpositioner title break mid-word at 360/320 px.
- Light surfaces left in dark mode: Præpositioner `.opt`/`.drop`, Forbindeord `.opt`, Ordstilling cards/tiles, Adverbier locked zones.
- `DanskCore.ui.focusTrap` counts a hidden textarea as focusable (shared; test 3 games).
- Tidsmaskinen: explainer opened within ~800 ms of a correct answer lets auto-advance run behind it.
- Bøjningsværkstedet: ten `verify:true` nouns are filtered out of Mode 1 until a native speaker clears the flags.
- `SCRATCHPAD.md` still says Sætningsmaskinen is complete (1,020 items); append-only, leave or add an owner note.
