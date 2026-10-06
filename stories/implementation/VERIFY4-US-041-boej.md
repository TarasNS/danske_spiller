# VERIFY4 US-041 (Bøjningsværkstedet slice) - Cancel pending timers

Method: for each of the 6 modes, play one forced-correct answer, leave within about 250 ms by Escape or by the back button (`#btn-back`), wait 1.5 s, assert start screen visible / play and summary hidden, then press 1, 2, 3, 4 on the start screen and compare the number of saved SRS items. Same script on baseline `b9242ca`.

| Criterion | Result | Evidence |
|---|---|---|
| Each listed timer id is stored and `clearTimeout` is called in quit/showStart/end handlers (pattern: Pronomenmysteriet and Tidsmaskinen). | PASS | Diff: the five `setTimeout(advance, 800)` sites go through `scheduleAdvance()` storing `advanceTimer`; `clearPending()` (clearTimeout + key handler) is called from `showStart`, `startRound`, `renderItem`, `finishRound` and "Gentag fejl"; `advance()` returns early if the play screen is hidden. |
| Repro scripts: no hidden render, no progress write after Escape, and no pageerror on a quick Afslut. | PASS | Current: 12 of 12 combinations (6 modes x Escape/back) stay on start, the saved SRS count is unchanged by number keys, zero page errors/console issues. Baseline: modes 5 and 6 FAIL in both Escape and back variants (saved SRS count 1 -> 2 after number keys on the start screen, the QA repro); modes 1-4 pass there (number keys do not answer in those modes), so the original defect is reproduced and fixed. |

- Regressions: none; normal rounds finish and "Spil igen" works (see the US-031 file). Scope creep: none.
- The Antonymer and Dansk Mester parts of the story belong to other verifiers.

Verification: VERIFIED
