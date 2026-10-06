# US-030 - Forbindeord slice (W-FORB)

Status: IMPLEMENTED

## Summary
The game had no reset. Added a visible "Nulstil fremskridt" button (`#resetBtn`, below the panels, visible on the game and result screens; measured 193x48 px). Click -> `window.confirm` in Danish. Cancel: nothing changes. OK: removes `forbindenor_v1` (LS_KEY) and the run key `forbindenor_run_v1` only, resets in-memory progress `P`, and restarts the run (the former "Spil igen" logic, now `startOver()`). All storage access is guarded. Styled in base CSS and in `shared/themes/forbindeord.css`.

## Tests
- Own puppeteer drive (Edge): cancel -> counter/score/stored progress unchanged; accept -> 1/359, score 0, full energy, `forbindenor_v1` removed; dialog shown with the Danish text; with a throwing localStorage getter, reset click causes no page error. 0 console errors.
- smoke.mjs: only the known #btn-play artefact rows fail; localStorage-blocked row PASS.

## Files changed
`forbindenor/Forbindenor.html` (button markup, RESET block, startOver, base CSS), `shared/themes/forbindeord.css` (reset button theme).

## Risks
Native `confirm()` used (allowed by the story). Other games' keys untouched.

## Needs native review
Dialog wording: "Vil du nulstille al fremskridt i Forbindeord? Point, rekord og svage ord slettes, og spillet starter forfra."

## Acceptance criteria
- Each game has a visible reset, at least 44×44, keyboard-operable: PASS for Forbindeord (real button 193x48); other games: other owner
- A Danish `confirm()` (or accessible dialog) appears. Cancel changes nothing: PASS (Forbindeord)
- Accept clears only that game's namespace: PASS (only forbindenor_v1 and forbindenor_run_v1)
- It works when storage is blocked (no crash): PASS (Forbindeord)
