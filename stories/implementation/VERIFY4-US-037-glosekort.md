# VERIFY4 US-037 - Glosekort slice (verifier V4-B)

Files: `danish_flashcards/danish_flashcards_game/script.js`, `shared/themes/flashcards.css`. Script `impl/V4-B/glose.cjs`; screenshots `glose360-head.png`, `glose-desk-head.png`.

| Criterion | Result | Evidence |
|---|---|---|
| Glosekort shows a compact level-chip row above the card at <=480 px | PASS | 360x740: `#cefr-filter` parent is `.main-content`, top y=168, height 44; card top y=366 (baseline QA: y=1121 below the card). One row: Alle, A1, A2, B1, B2, C1. Screenshot confirms the row sits above the scoreboard and card. |
| 44 px targets | PASS | Chip sizes 52x44 (Alle) and 44x44 (the rest); answer buttons 152x104. |
| No h-scroll | PASS | scrollWidth 360 = clientWidth. |
| Live resize | PASS | At 1000 px the filter returns to the sidebar; back at 360 px it moves above the card. |

Regressions: none. Desktop layout unchanged (chips in the sidebar). Phone cost: the card moves down by about 52 px (noted by the implementer). Chips still lack `aria-pressed` (pre-existing, not required).
Scope creep: none. UNCERTAIN: none.

Verification: VERIFIED
