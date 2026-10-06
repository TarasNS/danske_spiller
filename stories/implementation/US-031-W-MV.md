# US-031 - Magiske Verber slice (W-MV)

Status: IMPLEMENTED (other games: other owners)

## 1. Summary
`magiske_verber.html`: `showScreen(name, noFocus)` now focuses, after the screen is visible, the first sensible control (menu: first mode card; diff: active difficulty; result: "Spil igen"; stats: back link). `renderQuestion` focuses the first option. After an answer (non-speed) focus moves to "Næste". This also fixes the pre-existing quirk: after a mouse click on an option, Enter now advances (focus is on Næste, a native button). First paint does not steal focus. Explainer listener block and wiring untouched.

## 3/4. Tests (Edge headless, file://, 360x740, own script in scratchpad)
- Start: activeElement BODY (intended, no focus steal). Menu->diff: `DIV.diff active`. Diff->game: first `.opt`. Mouse click on option: activeElement = `Næste →` button (was BODY). Enter: 1/10 -> 2/10, focus on next first option. Space on a focused option does not double-advance (keyup does not trigger Næste). Key 2 then Enter works. Result: "Spil igen" focused. Stats: back link focused. Console errors: none.
- `tests/smoke.mjs ../magiske_verber.html`: FAIL only on known legacy artefact (4x no `#btn-play`, 3x "still playable"); everything else PASS.

## 5. Files changed
`magiske_verber.html`: showScreen ~768-785 (+focusScreen), renderQuestion end (~955), answer() nextBtn focus (~1005), init call.

## 6. Risks
Focus on hidden `speed` mode timer-based advance only focuses when game screen visible. Smooth scroll + focus uses preventScroll.

## 7. Newly discovered issues
Speed-mode auto-advance setTimeout is not cancelled on quit (QA-019, not mine).

## 9. Criteria
| Criterion | Result |
|---|---|
| In every listed game, `document.activeElement` is never `BODY` after an answer, screen change or summary. | PASS for Magiske Verber (initial load excluded by design); others: other owner |
| Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen" | other owner |
| Adverbier modals use focusTrap... | other owner |
| Enter on the focused Next control advances in Antonymer. | other owner (MV equivalent PASS) |
