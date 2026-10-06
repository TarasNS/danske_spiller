# US-031 - Forbindeord slice (W-FORB)

Status: IMPLEMENTED

## Summary
Added `focusEl()` (focus with preventScroll plus scrollIntoView nearest). After each `render()` focus goes to the first option (not on the initial page load); after an answer focus goes to the "Næste »" / "Se resultat »" button; on the result screen focus goes to "Spil igen" after the screen is shown; reset, "Spil igen", weak-mode enter/exit all go through `render()` and focus the first option.

## Tests
- Own puppeteer drive (activeElement): answer -> BUTTON#next; Enter on Next -> first .opt; end screen -> BUTTON#again; Enter on "Spil igen" -> first .opt; after reset -> first .opt. BODY never seen after answer/screen change/summary. On a fresh load or reload focus stays on BODY (deliberate, no focus stealing at load).
- smoke.mjs: only the known #btn-play artefact rows fail; focus-ring row PASS.

## Files changed
`forbindenor/Forbindenor.html` (render, choose, end, focusEl).

## Risks
When a reload restores an already-answered item, focus is not moved (page load).

## Needs native review
None.

## Acceptance criteria
- In every listed game, `document.activeElement` is never `BODY` after an answer, screen change or summary: PASS for Forbindeord; other games: other owner
- Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen": other owner
- Adverbier modals use `DanskCore.ui.focusTrap`; Esc closes them and focus returns to the opener: other owner
- Enter on the focused Next control advances in Antonymer: other owner
