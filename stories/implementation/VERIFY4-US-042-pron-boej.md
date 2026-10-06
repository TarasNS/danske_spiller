# VERIFY4 US-042 (Pronomenmysteriet + Bøjningsværkstedet slice) - Missed items first

Method: seed `srs:<game>` in localStorage (3 box-1 items with distinct `lastSeen`, 2 box-2 items past due, 5 box-3 items not yet due, rest unseen), reload, start a round with all levels, identify each presented item, check order and keys. Pron is covered by the repo test (`tests/pronomenmysteriet.mjs`, which seeds its own state) plus code review; Boej by my script.

| Criterion | Result | Evidence |
|---|---|---|
| Queue order: missed in the last round, then due, then unseen. | PASS | Boej mode 5: presented `b5-koebte-bog, b5-saa-kat, b5-fik-brev` (the 3 missed, newest first), then `b5-moedte-mand, b5-ny-laerer` (the 2 due), then 5 unseen; none of the 5 not-yet-due seeded items appeared. Mode 6: same pattern (3 missed newest first, the two due items in either order, then unseen only). Mode 1 (input): first four presented were mand-ubestemt-ental, mand-bestemt-ental, mand-ubestemt-flertal (missed) then barn-ubestemt-ental (a due item). Code, both games: missed (box 1, `lastSeen` desc), due, unseen, not-yet-due (soonest first), cut to 10. Boej keeps that order. Pron shuffles the selected 10 afterwards, so the selection follows the story but the presentation order within the round is random (Tidsmaskinen also shuffles). |
| `tests/pronomenmysteriet.mjs` resurfacing checks pass. | PASS | HEAD run (OUT redirected to the scratchpad): "subject_object / reflexive_possessive: due items first on new round" PASS; the same rows FAIL on baseline `b9242ca` (missedBack=false). HEAD overall 64/66 in two runs; the 2 failures are unrelated (below). |
| SRS keys are unchanged. | PASS | Keys remain `srs:boejningsvaerkstedet` / `srs:pronomenmysteriet`, item keys `pronomenmysteriet:<mode>:<id>` (test row "SRS keys format" PASS for all modes); only SRS/pref keys exist after rounds. |

## The 2 failing rows of `tests/pronomenmysteriet.mjs` at HEAD, attributed independently
1. "Space toggles a chip": the implementer's explanation (puppeteer key name `Space` invalid) is WRONG. `tests/node_modules/puppeteer-core/lib/cjs/puppeteer/common/USKeyboardLayout.js:68` defines `Space: { keyCode: 32, code: 'Space', key: ' ' }`, and my probe shows `press('Space')` and `press(' ')` toggle the chip identically. The real cause is also a test bug: all three level chips are `aria-pressed="true"` by default, so Space correctly toggles chip 2 to `false` while the test expects `'true'`. The row fails identically on baseline `b9242ca`: not a regression, not a game defect.
2. "subject_object: auto-advance ~800ms": the first sample of the first mode is an outlier (1501 ms and 1772 ms in two HEAD runs; the other samples 868-1087 ms; assertion window 700-1200). Baseline `b9242ca`, same machine under parallel load, fails this row in 6 of 6 modes (samples up to 2598 ms) with the timer code (`setTimeout(advance, 800)`) unchanged, so it is a load / first-sample measurement flake, not introduced by Batch 4 (the implementer's load attribution is plausible and supported; a warm-up first-sample effect is also visible).

- Boej `buildRound` replaced (old `DC.srs.nextItems` logic removed); no other behaviour changed. US-010 option/tile shuffles are intact (`shuffle` still used at option and tile render in Boej and Pron).
- Regressions: none. Scope creep: none.

Verification: VERIFIED
