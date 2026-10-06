# VERIFY4 US-037 - Antonymer slice (verifier V4-B)

Files: `shared/themes/antonyms.css`. Compared with a `b9242ca` copy in the scratchpad (`impl/V4-B/ant2.cjs`, `conf.cjs`, `conf2.cjs`; screenshots `sum360-*.png`, `conf360-*.png`, `flow390-600.png`).

| Criterion | Result | Evidence |
|---|---|---|
| Listed headings break only at compound points, or fit (Antonymer "MODSAT") | PASS | 360x740: baseline renders "MODSA / T" (a text-range check found "Modsat" split across lines); current renders "MODSAT" on one line. `scrollWidth === clientWidth === 360` on dashboard and summary. No overflowing heading. |
| 360 h-scroll (Antonymer) | PASS | scrollWidth 360 on the dashboard and summary screens. |
| Confetti spawns behind the results text (z-index) or only from the trophy area | **FAIL** | Screenshots at 360x740 (`conf360-600.png`) and 390x844 after a real round (`flow390-600.png`) show confetti squares painted ON TOP of the results text ("Runden er slut - træfsikkerhed ...") and the trophy. `.sd-conf` computed z-index is 0 as intended, but `.sd-conf` is appended to `<body>` after `.app`, and `section.screen.sd-enter` keeps a stacking context (its `sd-enter` animation uses `fill-mode: both`, computed transform `matrix(1,0,0,1,0,0)`). The `.summary{z-index:1}` therefore only orders inside that section, and the later `z-index:0` confetti paints above the whole section. The implementer's check (computed z-index only) did not detect this. The confetti also overlays the topbar card ("INDSTILLINGER", XP pills). |
| Bøjningsværkstedet / Pronomenmysteriet SPIL, Dansk Mester, Glosekort rows | NOT VERIFIED | Other games. |

Regressions: none from this change. Pre-existing, outside the listed headings: the "INDSTILLINGER" button wraps mid-word at 360px ("INDSTILLING/ER"), same as baseline.
Scope creep: none (7 CSS lines).
UNCERTAIN: none.
Suggested fix: give the `.screen` (or the results card's stacking context) a z-index above the confetti, for example `html.sd-page .screen{position:relative;z-index:1}`, or remove the persistent animation fill on `.screen`.

Verification: FAILED (confetti still paints over the results text in Edge at 360 and 390 px)
