# VERIFY4 US-037 Præpositioner retry (verifier V4-R)

Own script `impl/V4-R/prep.cjs` (Edge headless, file://), screenshots viewed at 320 and 360 (menu, feedback, Lynrunde results).

| Criterion | Result | Evidence |
|---|---|---|
| No h-scroll at 320, 360, 390, 1366 on start/menu | PASS | scrollWidth == clientWidth (also body.scrollWidth) at all four widths. |
| No h-scroll on every one of the 10 mode first screens | PASS | fill, mc, drag, mistake, correct, trans, pairs, speed, review (empty and with queued errors), stats: all equal at 320/360/390/1366. |
| Feedback state in 2 modes | PASS | fill and mc after a click: equal at all widths. Screenshot 320 (mc feedback): verdict, "Rigtigt svar", TIP and "NÆSTE" all inside the card, no clipping. |
| Results screen of a finished Lynrunde | PASS | Real clicks in the round, then `speedLeft=1` to end it; "Tiden er gået!" reached at all four widths, scroll equal. 360 screenshot: trophy, 4 stat tiles, "SPIL IGEN"/"MENU" intact. |
| Stats screen | PASS | equal at all widths. |
| Headings/tiles break only at soft hyphens at 360 | PASS | 360 screenshot: h1 "PRÆPOSITIONS-/MESTER"; tiles "RET SÆT-/NINGEN", "OVER-/SÆTTELSE", "FORVEKS-/LINGSPAR", "STATISTIK" whole, "TRÆK OG / SLIP", "FIND / FEJLEN". No mid-word break in any heading. |
| Mid-word breaks at 320 only via the documented last-resort media query | PASS | 320: h1 "PRÆPOSITIO/NSMESTER" and the `.d` descriptions break mid-word, which is the `@media (max-width:359px){ ... overflow-wrap:anywhere }` rule; tile titles still break only at the soft hyphens (STATI-/STIK, RET SÆT-/NINGEN). |
| Earlier Præpositioner work intact | PASS | `git diff HEAD` is only the 4 MODES lines (soft hyphens) and 2 CSS hunks (grid `minmax(0,1fr)`, `min-width:0`, 359px media rule). Against b9242ca the committed changes (Flervalg label, speed no longer adds XP itself, sentence edits, h1 shy) are the batch-4 work. Blocked-localStorage run (US-004): 10 tiles, mc feedback shows, 0 errors. Flervalg label, `revealFeedback` and the `explainer:open` listener present and exercised (feedback with Næste visible). 0 console errors on all 4 widths. |
| Smoke | PASS (legacy aside) | only "#btn-play found" and "console clean + still playable" rows fail (legacy artefact). |
| Diff limited to the two files | PASS | `git diff HEAD`: `shared/themes/praepositioner.css`, `dansk-praepositioner.html` (code files). |

Observation (not a regression): tile description text (`.d`, e.g. "Træk præpositionen ind") still wraps mid-word at 360 ("præpositione/n ind"). Baseline b9242ca had `overflow-wrap:anywhere` on tiles, so this is not new and descriptions are not headings.
US-009 pair filter, US-019 data, US-044 XP content were not changed by the retry (diff proves it); not re-tested functionally beyond the above. UNCERTAIN: none.

Verification: VERIFIED
