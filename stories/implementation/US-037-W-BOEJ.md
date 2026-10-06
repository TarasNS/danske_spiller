# US-037 (W-BOEJ slice) - Layout polish in Bøjningsværkstedet

## 1. Implementation summary
- SPIL above the fold: `#btn-play` is `position: sticky; bottom: 12px` in the theme CSS, so it is visible on load (it keeps its place after the mode list and below it sits the reset row). Measured on load: 1366x768 top 692 / bottom 756 (<768); 390x844 top 768 / bottom 832 (<844); 360x740 top 664 / bottom 728 (<740).
- Hyphenation: soft hyphens in the `h1` ("Bøjnings&shy;værkstedet") and the long mode names (Adjektiv&shy;værkstedet, Sammenlignings&shy;pressen, Mængde&shy;værkstedet), so they break only at compound points.
- No horizontal scroll at 360/390/1366 (scrollWidth == clientWidth).

Status: IMPLEMENTED

## 3. Tests run
`t4.mjs` position + scroll checks PASS at 1366x768, 390x844, 360x740. Smoke PASS (28/28). Screenshot at 360 checked: title on one line, no mid-word break, SPIL visible.

## 5. Files changed
`boejningsvaerkstedet/index.html` (h1 line ~373, MODES names ~428-433); `shared/themes/boejningsvaerkstedet.css` (end of file, sticky `#btn-play`).

## 6. Remaining risks
The sticky button overlaps content scrolled underneath (mode list) with the brutalist drop shadow; acceptable. The soft hyphens are in the DOM text (`textContent` of the mode name contains U+00AD).

## 7. Newly discovered issues
None.

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| At 360×740, Dansk Mester `scrollWidth === clientWidth`; mode and badge labels fit. | other owner |
| Listed headings break only at `&shy;` compound points, or fit via `clamp()`. | PASS (Bøjningsværkstedet h1 and mode names); other games: other owner |
| Bøjningsværkstedet and Pronomenmysteriet: SPIL is visible at 1366×768 and 390×844 on load. | PASS for Bøjningsværkstedet; Pronomenmysteriet: other owner |
| Confetti spawns behind the results text (z-index) or only from the trophy area. | other owner (not in this slice) |
| Glosekort shows a compact level-chip row above the card at ≤480 px. | other owner |


## Regression retry (W-BOEJ, after R2 finding N1)

**Cause.** The Batch 4 `#btn-play { position: sticky; bottom: 12px }` floats over whatever is scrolled beneath the viewport bottom. At 1366x768 (mode 5), 390x844 (mode 4) and 360x640 (modes 2-6) it sat on top of mode buttons, so a click at their centre hit SPIL and started mode 1. A sticky overlay cannot satisfy "never covers a mode button" when the mode list is longer than the viewport.

**Change.** Sticky removed. SPIL is moved in the DOM to directly after the lede, above "Vælg værksted" (the Pronomenmysteriet approach), so it is in the viewport on load without any overlay. `boejningsvaerkstedet/index.html` (one line moved, start screen ~l.376) and `shared/themes/boejningsvaerkstedet.css` (l.227-228: sticky rule replaced by `#start-screen #btn-play { margin-bottom: var(--sd-3) }`). The reset row stays after the level chips. Keyboard order change: Tab now reaches SPIL first, then the modes, chips, reset (needed so SPIL is visible; focus() on SPIL after mode/chip selection is unchanged). No JS touched; US-010/015/030/031/041/042/050 and explainer wiring untouched.

**Measurements** (Edge, file://, after the intro splash, localStorage cleared).

| Viewport | SPIL top-bottom on load | Mode buttons 1-6: elementFromPoint at centre (top and bottom scroll) | Real click selects exact mode, SPIL then starts it | h-scroll | targets <44px |
|---|---|---|---|---|---|
| 1366x768 | 338-402 (<768) | 12/12 | 6/6 | none | none |
| 1440x900 | 338-402 | 12/12 | 6/6 | none | none |
| 390x844 | 399-463 (<844) | 12/12 | 6/6 | none | none |
| 360x640 | 423-487 (<640) | 12/12 | 6/6 | none | none |
| 360x740 | 423-487 (<740) | 12/12 | 6/6 | none | none |

- Sweep scrolling the whole start screen in 60px steps: no mode button, chip, reset or SPIL centre is covered by another element (only the fixed top bar / XP icon when an element is scrolled under them, which is page chrome and normal).
- Level chips toggle; reset opens the Danish confirm ("Vil du nulstille alle fremskridt i Bøjningsværkstedet? Det kan ikke fortrydes."), cancel leaves progress.
- Full rounds finished in mode 5 and mode 6 (summary "Runden er færdig 6/10"), zero console errors.
- `node tests/smoke.mjs ../boejningsvaerkstedet/index.html`: all 28 rows PASS.
- Screenshots of start screen top and bottom at 4 viewports viewed (390x844 and 1440x900 also captured); layout clean.

**Risk.** SPIL is no longer a persistent sticky control: after choosing a mode lower in the list on a small phone the user scrolls back up to SPIL (after a mode click focus stays on the mode button; the keyboard path is Shift+Tab or Tab order from the top). Page height grows by about 90px. A scrolled-under-header click target (puppeteer `scrollIntoView({block:'nearest'})`) can land behind the fixed top bar; real use unaffected.

Status: IMPLEMENTED
