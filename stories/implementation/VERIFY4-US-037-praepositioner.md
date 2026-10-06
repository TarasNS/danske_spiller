# VERIFY4 US-037 - Præpositioner slice (verifier V4-B)

Files: `dansk-praepositioner.html` (h1, MODES `pairs`), `shared/themes/praepositioner.css`. Compared with a `b9242ca` copy (`impl/V4-B/prep.cjs`; screenshot `prep360-head.png`).

| Criterion | Result | Evidence |
|---|---|---|
| Listed headings break only at `&shy;` compound points, or fit (PRÆPOSITIONSMESTER, mode tiles) | PASS | 360x740: h1 "PRÆPOSITIONS-/MESTER" on two lines (48 px), visible hyphen, confirmed in the screenshot. A text-range check finds only the two soft-hyphen words ("Præpositions­mester", "Forvekslings­par") split. Baseline split "Præpositionsmester", "Oversættelse" and "Forvekslingspar" mid-word with no hyphen. No title or tile overflows. |
| No h-scroll at 360 | PASS | scrollWidth 360 = clientWidth at 360 and 390. |
| Other games' rows | NOT VERIFIED | Other verifiers. |

Regression found: at 320 px, `scrollWidth` is 352 on the menu. The implementer and the brief call this pre-existing. My measurement of the baseline copy says it is NOT: baseline 320 -> scrollWidth 320. The baseline fits only by breaking words mid-word anywhere (`overflow-wrap:anywhere`). With `overflow-wrap:break-word; hyphens:manual`, the unbreakable word "OVERSÆTTELSE" or the mode-tile content sets a min-content width, so the grid columns (`.mode-btn`, right edge 352) overflow. 320 px is below the PRD minimum of 360 and the story criterion is met, but this is a new h-scroll at 320 introduced by this change.
Scope creep: none. UNCERTAIN: none.

Verification: VERIFIED for the story criteria (regression at 320 px, below the PRD minimum, reported above)
