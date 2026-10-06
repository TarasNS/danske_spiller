# US-037 — W-PREP slice (Præpositioner)

1. Summary: h1 is now `Præpositions&shy;mester`, and the mode tile title is `Forvekslings&shy;par`. In shared/themes/praepositioner.css the h1 and `.mode-btn` now use `overflow-wrap: break-word; hyphens: manual` instead of `overflow-wrap: anywhere` / `hyphens: auto`. The h1 therefore breaks only at the soft hyphen, with a visible hyphen, and not mid-word.
2. Status: IMPLEMENTED
3. Tests: own puppeteer script at 360x740: scrollWidth 360 = clientWidth 360; h1 wraps in 2 lines (48 px); 0 mode titles overflow; 0 console errors. At 320 px scrollWidth is 352 (below the PRD minimum; not investigated, probably pre-existing). smoke.mjs result: see the line appended below (if empty, it was still running).
4. Manual: DOM measurements only; no visual screenshot review.
5. Files: dansk-praepositioner.html (h1 line ~266; MODES `pairs` entry ~858); shared/themes/praepositioner.css lines 45, 82.
6. Risks: `hyphens: manual` on `.mode-btn` also disables auto-hyphenation of the `.d` descriptions (short; no overflow seen).
7. Newly discovered: at 320 px the page scrolls horizontally (352).
8. Native review: none.
9. Criteria (slice):
- At 360x740 Dansk Mester scrollWidth === clientWidth: other owner (Præpositioner at 360: PASS)
- Listed headings break only at &shy; compound points, or fit via clamp(): PASS for "PRÆPOSITIONSMESTER"
- SPIL visible (Bøjningsværkstedet, Pronomenmysteriet): other owner
- Confetti behind results text: other owner
- Glosekort level-chip row: other owner

## Retry (320 px regression fix)

Change: the 320 px h-scroll was a regression, not pre-existing (the `1fr` grid columns took their min-content width from long unbreakable words once `anywhere` was removed). In `shared/themes/praepositioner.css`: `.menu-grid` now has `grid-template-columns: repeat(2, minmax(0, 1fr))`; `.mode-btn` and `.dex h1` get `min-width: 0`; a new `@media (max-width: 359px)` rule (placed after the `.mode-btn` rule, line ~250) restores `overflow-wrap: anywhere` as a last resort below the PRD minimum only. In `dansk-praepositioner.html` MODES: soft hyphens added to `Forveks&shy;lings&shy;par`, `Over&shy;sættelse`, `Ret sæt&shy;ningen`, `Stati&shy;stik` (the original `Forvekslings&shy;par` was too wide at 360 and broke mid-word as FORVEKSLIN|GSPAR). All other Præpositioner work is untouched.

Measurements (own puppeteer, Edge; scrollWidth vs clientWidth on menu + all 10 mode first screens incl. Statistik; "new" = after fix, "base" = b9242ca copy; scripts in scratchpad `impl\w-prep2\`):

| Width | new | b9242ca | Overflowing elements | Console errors |
|---|---|---|---|---|
| 320 | 320 = 320 (11/11 screens) | 320 | none | 0 |
| 360 | 360 = 360 (11/11) | 360 | none | 0 |
| 390 | 390 = 390 (11/11) | 390 | none | 0 |
| 1366 | 1366 = 1366 (11/11) | 1366 | none | 0 |

Screenshots viewed (full page, `v-320.png`, `v-360.png`): at 360 the h1 breaks only at "PRÆPOSITIONS-/MESTER" and the tile titles only at soft hyphens (OVER-/SÆTTELSE, FORVEKS-/LINGSPAR, RET SÆT-/NINGEN); no mid-word break in any heading or tile title. At 320 no overflow; the h1 breaks mid-word as PRÆPOSITIO/NSMESTER (last-resort `anywhere`, below PRD minimum). Results screen not separately driven (not reachable by a first-screen click).
Smoke: only the known legacy `#btn-play` rows (play button found x4, "console clean + still playable" x3) fail; all console-clean, no-h-scroll, contrast, focus, localStorage-blocked rows PASS.
Risk: below 360 px mode descriptions (.d) may break mid-word ("præpositi|on"); at 360 the .d "Træk præpositione|n ind" still breaks mid-word (description text, not a heading; not changed).
Status: IMPLEMENTED
