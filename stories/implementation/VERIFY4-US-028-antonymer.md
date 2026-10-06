# VERIFY4 US-028 - Antonymer slice (verifier V4-B)

Files: `danish-antonyms-game.html`. Baseline for comparison: `b9242ca`.

| Criterion | Result | Evidence |
|---|---|---|
| Every string listed is replaced (Antonymer rows: button "Check" -> "Tjek", aria-label "Pronounce" -> "Udtal") | PASS | Live DOM: `#checkBtn` text "Tjek" (baseline "Check"); `.speaker` aria-label "Udtal" on all 5 speaker buttons (baseline "Pronounce"). Diff shows only those two lines changed for this story. |
| Grep across game files for `CORRECT\|WRONG\|Continue\|Next ▸\|Finish ▸\|Multiple choice\|"Check"\|Pronounce\|ENERGY` returns 0 user-visible hits | PASS | `grep -n -E "CORRECT|WRONG|Continue|Next ▸|Finish ▸|Multiple choice|\"Check\"|>Check<|Pronounce|ENERGY"` on the game file and `shared/themes/antonyms.css`: 0 hits. |
| Accessible names are Danish | PASS | All aria-labels in the live DOM are Danish ("Udtal"). Smoke "icon buttons labelled" PASS. |

Regressions: none. Smoke (`tests/smoke.mjs`): only the legacy artefact rows fail (no `#btn-play`); console clean, no h-scroll, localStorage-blocked run clean. Blocked-storage play of a Choice round + Find par: 0 console errors.
Scope creep: none.
UNCERTAIN: none ("Udtal" vs a possible later "Lyt" under US-029 is a coordination point, not a defect).

Verification: VERIFIED
