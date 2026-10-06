# US-037 - Tidsmaskinen slice (W-TIDS)

## 1. Summary
Only the Tidsmaskinen results-screen confetti item applies (QA-043). `Sjovt.fx.celebrate` draws `.sd-conf` (fixed, z-index 9990) over everything and cannot be edited (frozen). In `shared/themes/tidsmaskinen.css` I (a) set `.sd-conf` z-index to 1, (b) lifted the children of `#summary-host` to `position:relative; z-index:2`, and (c) set `animation-fill-mode: backwards` on `#summary-screen` so the entrance animation (`.sd-enter`, fill both) no longer leaves a stacking context around the card. Result: the card background is under the confetti, all result text/stats/buttons are above it. Entrance animation unchanged.
Status: IMPLEMENTED

## 3. Tests
- Screenshot at 360x740 of the finished summary with confetti falling: before the change confetti covered "Traen verbernes former" and "SPIL IGEN"; after, text and buttons are drawn above it (viewed `sum.png` in scratchpad).
- smoke.mjs: PASS; no console errors. No h-scroll at 360 on start/play (smoke).
## 5. Files: `shared/themes/tidsmaskinen.css` lines ~214-217.
## 6. Risks: confetti now also draws over non-positioned page content outside the card (still pointer-events:none); topbar buttons unaffected (sjovt bar z 900).
## 7. Newly discovered issues: none.
## 8. Needs native review: n/a.
## 9. Acceptance criteria
- Dansk Mester 360 scrollWidth: other owner
- Listed headings break only at &shy;: other owner (Tidsmaskinen not listed)
- Boejningsvaerkstedet/Pronomenmysteriet SPIL visible: other owner
- Confetti spawns behind the results text (z-index) or only from the trophy area: PASS for Tidsmaskinen (Idiomjaeger, Antonymer, Pronomenmysteriet: other owner)
- Glosekort compact chip row: other owner
