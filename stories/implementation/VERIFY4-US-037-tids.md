# VERIFY4 US-037 - Tidsmaskinen slice (verifier V4-F)

Scope: `shared/themes/tidsmaskinen.css` lines 214-217 (3 rules). Baseline copy of b9242ca html+css+data built in scratchpad `impl/V4-F/b4/` for side-by-side screenshots (`us037.mjs`: plays 10 correct answers, screenshots the finished round).

| Criterion | Result | Evidence |
|---|---|---|
| Confetti spawns behind the results text (z-index) or only from the trophy area (Tidsmaskinen) | PASS | Computed `.sd-conf` z-index: 9990 in b4 copy, 1 in current. Screenshots 360x740: b4 (`sum-b4-360.png`) has confetti squares drawn across "PRÆCISION" and "SPIL IGEN"; current (`sum-new-360.png`) text, stat boxes, hint bar and both buttons are drawn above the confetti (confetti only visible between/around them). 1366x768: b4 shows a piece on top of the SPIL IGEN button; current shows none over text/buttons. Confetti is still falling (40 pieces) and visible on the page. |
| No other regression in entrance animation | PASS | `.sd-enter` keyframes end at `opacity:1; transform:none` so `animation-fill-mode: backwards` (replacing `both`) yields the same end state; summary renders identically, buttons clickable (round replay in tests/tidsmaskinen.mjs passes), 0 console errors. smoke PASS (reduced motion, dark, light too). |

Scope creep: none (CSS only, Tidsmaskinen theme). Side effect noted by implementer: confetti now also paints over non-positioned page content outside the card (pointer-events none) - acceptable, topbar unaffected.

Verification: VERIFIED
