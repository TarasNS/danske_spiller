# VERIFY4 US-037 (Pronomenmysteriet + Bøjningsværkstedet slice) - Layout polish

| Criterion | Result | Evidence |
|---|---|---|
| Listed headings break only at `&shy;` compound points, or fit via `clamp()`. | PASS | Boej `h1` "Bøjnings&shy;værkstedet" and mode names Adjektiv&shy;værkstedet / Sammenlignings&shy;pressen / Mængde&shy;værkstedet (diff). At 360x640 the title is on one line (`boej-start-360x640.png`); h1 and mode names have `scrollWidth <= clientWidth` at 1366/390/360; no document h-scroll (sw == cw) at 1366x768, 390x844, 360x640, 360x740. Pron `h1` "PRONOMENMYSTERIET" fits on one line at 360 (`pron-start-360x640.png`); no heading change was needed. |
| Bøjningsværkstedet and Pronomenmysteriet: SPIL is visible at 1366x768 and 390x844 on load (moved above the mode list, or a sticky bottom bar). | PASS | Pron (moved above the mode list): SPIL bottom 410 @1366x768, 449 @390x844, 473 @360x640 and 360x740, all < viewport height. Boej (sticky bar, `position: sticky; bottom: 12px`): SPIL top/bottom 692/756 @1366x768, 768/832 @390x844, 564/628 @360x640, 664/728 @360x740, all inside the viewport. Scrolled to the bottom, the Boej reset row is not covered; the explainer modal still stacks above the sticky SPIL (`elementFromPoint` = `.xpm` modal in both games). At 360x640 the sticky SPIL overlays the first part of the mode list on load (the story allows a sticky bar). |
| Confetti spawns behind the results text (z-index) or only from the trophy area. | PASS (Pronomenmysteriet) | I looked at the results screen (`pron-results-a.png`, taken right after the last advance): confetti is visible in the gutters and above the card, none over "4/10 / 40%" or the card text; computed `.sd-conf` z-index 0 vs `.shell` relative z-index 1. As the implementer said, confetti is mostly hidden behind the opaque card. Bøjningsværkstedet is not in the story's confetti list and was not changed: `boej-results-conf.png` shows confetti (z-index 9990) in front of the page, not over the result numbers. |
| Dansk Mester 360 px / Glosekort compact filter | NOT APPLICABLE | other games |

- Regressions: none (smoke PASS both; `tests/pronomenmysteriet.mjs` h-scroll and tap-target rows at 4 viewports x light/dark PASS). SPIL is now first in the Pron tab order (before modes/levels), a minor keyboard-flow change.
- Scope creep: none; the Pron CSS also adds `aria-disabled` option rules (belongs to US-031).

Verification: VERIFIED (slice for these two games)
