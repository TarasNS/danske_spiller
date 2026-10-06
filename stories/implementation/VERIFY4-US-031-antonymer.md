# VERIFY4 US-031 - Antonymer slice (verifier V4-B)

Files: `danish-antonyms-game.html`. Baseline `b9242ca` copied to the scratchpad (with `shared/`) and driven with the same script (`impl/V4-B/ant.cjs`) at 390x844 with real keyboard events.

| Criterion | Result | Evidence |
|---|---|---|
| In every listed game, `document.activeElement` is never BODY after an answer, screen change or summary (Antonymer) | PASS | Current: Choice render = option; after answer = `#nextBtn`; summary = `#sumAgain`; "Spil igen" = first option; quit = first `.mode-btn`; Missing render = `#answerInput`; Reverse render = option, after answer = `#nextBtn`; Speed render = option, after answer = `div#feedbackArea` (tabindex -1; options are disabled), next render = option; Speed ended by timer = `#sumAgain`; Find par render = first `.match-item`, after miss = `.match-item`, after completion = `#sumAgain`; category/difficulty/review screens = `.back-link`, back = `.mode-btn`. Baseline: BODY in all of these (choice render, after answer, summary, quit, reverse, speed, match). BODY only on first page load (intended, not a screen change). |
| Enter on the focused Next control advances in Antonymer | PASS | Choice: Enter on `#nextBtn` -> next option, `session.asked` 1. |
| Enter double-activation fix (found by implementer) | PASS | Baseline reproduced: typed answer + one Enter -> `asked=1`, `feedback present=false`, Fortsæt hidden, focus stays in input (feedback skipped). Current: one Enter -> `asked=1`, feedback present, Fortsæt visible and focused; second Enter -> next question, `asked` still 1, focus back in input. |
| Bøjningsværkstedet / Pronomenmysteriet / Adverbier rows | NOT VERIFIED | Other game, outside this verifier's slice. |

Regressions: none seen. 0 console errors across a drive of Choice, Reverse, Missing, Speed, Find par and the category/difficulty/review screens. Note: `showScreen` now moves focus on every screen change, and the settings screen was not walked.
Scope creep: the `preventDefault` fix is justified by the story (Enter must advance). `tabindex="-1"` on `#feedbackArea` is justified.
UNCERTAIN: none.

Verification: VERIFIED (Antonymer slice only; other games' rows left to their verifiers)
