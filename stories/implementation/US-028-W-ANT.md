# US-028 — Antonymer slice (W-ANT)

1. **Summary.** Button "Check" -> "Tjek" (`#checkBtn`, renderMissing). Speaker button `aria-label` "Pronounce" -> "Udtal" (same word idiomjaeger.html uses; matches the story criterion; US-029 may rename to "Lyt" later, a one-line change in `speakerBtn`). No other English UI strings remain in the file (English word glosses are content).
2. **Status:** IMPLEMENTED
3. **Tests.** Own puppeteer drive (Edge, scratchpad `impl/W-ANT/t.js`), 0 console/page errors. Live DOM: `#checkBtn` text "Tjek", `.speaker` aria-label "Udtal". Grep of the file for `CORRECT|WRONG|Continue|Next ▸|Finish ▸|Multiple choice|"Check"|Pronounce|ENERGY`: 0 hits. `smoke.mjs ../danish-antonyms-game.html`: all PASS except known legacy artefact rows (no `#btn-play`: 4 "play button found" + 3 "still playable"). `validate.js` not run (no shared data change).
4. **Manual.** DOM read in the script above.
5. **Files.** `danish-antonyms-game.html`: `speakerBtn` aria-label, `checkBtn` markup in `renderMissing`.
6. **Risks.** If US-029 standardises on "Lyt" the label changes again (trivial).
7. **Newly discovered.** None.
8. **Needs native review.** None new.
9. **Acceptance.**
- Every string listed is replaced: PASS for Antonymer rows (others = other owner)
- Grep returns 0 user-visible hits: PASS for this file (others = other owner)
- Accessible names are Danish: PASS for this file
