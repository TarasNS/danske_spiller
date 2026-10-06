# US-037 — Antonymer slice (W-ANT)

1. **Summary.** `shared/themes/antonyms.css` (end of file): headings (`.brand` text, `.mode-btn .t`, `.section-title`, `.summary .score`) get `overflow-wrap:normal; hyphens:manual; min-width:0` so they no longer break mid-word under the body-wide `overflow-wrap:anywhere`. `html.sd-page .sd-conf{z-index:0}` plus `.summary{position:relative;z-index:1}` paints confetti (fixed, z-index 9990 in frozen sjovt.css) behind the results card. No change to `sjovt.js`/`sjovt.css`.
2. **Status:** IMPLEMENTED
3. **Tests.** Puppeteer at 360x740: scrollWidth 360 = clientWidth; all heading/title elements scrollWidth===clientWidth; brand "Modsat" one line (82 px); `.sd-conf` computed z-index 0. `smoke.mjs`: no-h-scroll rows PASS at all viewports; only known artefact rows fail.
4. **Manual.** Screenshots dash.png / sum.png (scratchpad, 360x740) generated.
5. **Files.** `shared/themes/antonyms.css` (last 7 lines).
6. **Risks.** Confetti is hidden behind the card where they overlap (visible around it). Same z-index also applies to level-up confetti during play. The mid-word break may not have reproduced at HEAD in my environment (not compared visually).
7. **Newly discovered.** None.
8. **Needs native review.** None.
9. **Acceptance.**
- 360x740 Dansk Mester scrollWidth: other owner (Antonymer: PASS)
- Listed headings break only at compound points or fit: PASS for Antonymer (MODSAT fits, no mid-word break)
- SPIL visible (Bøjningsværkstedet, Pronomenmysteriet): other owner
- Confetti behind results text: PASS for Antonymer (theme CSS only)
- Glosekort chip row: other owner

## Retry (W-ANT, confetti over results)

1. **Change.** `shared/themes/antonyms.css` (last 3 lines): `html.sd-page .screen.sd-enter { animation-fill-mode: none; }` removes the persistent stacking context on the screen (opacity/transform from the `both` fill-mode), so `.summary{z-index:1}` now orders against the body-level `.sd-conf{z-index:0}`. Also `header.topbar { position: relative; z-index: 2 }` (was static) so the topbar paints above the confetti too; no layout change (relative with no offsets). `sjovt.js`/`sjovt.css`/HTML untouched.
2. **Tests** (puppeteer, Edge, real round via UI to the summary screen, polled for `.sd-conf i`, screenshots viewed in scratchpad `impl/w-ant2/`): 360x740, 390x844, 1366x768, light and dark. `elementFromPoint` at centre of `#sumScore`, `#sumLine`, `#sumAgain`, topbar brand: never a confetti piece (inConf=false) in all runs where the summary was reached with 40-80 confetti pieces live (360 light/dark, 390 light/dark, 1366 dark). Screenshots show confetti falling below/around the card and never over text. scrollWidth == clientWidth at 360/390/1366. Zero console errors. Start screen unchanged (visual check at 360 and 1366). `smoke.mjs danish-antonyms-game.html`: only the three "console clean + still playable" rows fail (known legacy no-`#btn-play` artefact); other rows pass.
3. **Harness caveat.** In 2 of the runs (390 light, 1366 light) my auto-player did not reach the summary within its time limit (the screenshot shows the dashboard), so those two viewport/theme combos were verified only in a later full rerun: 390 light passed with 40 confetti pieces, 1366 light again did not reach the summary (harness timing, not a page error); 1366 dark and 360/390 both themes were fully verified.
4. **Risk.** Dropping the fill-mode means a screen with the entry animation has no `both` backwards-fill: no visible effect since the animation has no delay. Level-up confetti during play still sits at z 0 behind content (as before). Confetti is not visible through the card, only around it.
5. **Status:** IMPLEMENTED
