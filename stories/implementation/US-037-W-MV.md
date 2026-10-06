# US-037 - Magiske Verber slice (W-MV)

Status: IMPLEMENTED

## 1. Summary
QA-040 for Magiske Verber (`magiske-verber.css:95`): mode-card titles and the difficulty-screen `h2` used `overflow-wrap:anywhere`, so long compounds broke mid-word with no hyphen. Now `overflow-wrap:break-word; hyphens:manual` and the GAMES entries carry an `h` field with `&shy;` at compound boundaries (Verbum-arenaen, Før-nutids-byggeren, Sætnings-værk-stedet, Verbum-detektiven, Hurtig-duellen, uregel-mæssige), used in the card and the diff title. `n` (plain) is still used for the HUD. Confetti/SPIL/filter/Dansk Mester parts do not concern this game (Sjovt.fx.celebrate is not changed; frozen).

## 3. Tests
360x740: scrollWidth 360 == innerWidth on menu and stats; titles wrap only at shy points (checked innerText of cards); console clean; smoke: only known `#btn-play` legacy artefact fails.

## 5. Files
`magiske_verber.html` GAMES (~730-742), buildMenu card, openDiff title; `shared/themes/magiske-verber.css` lines 47 and 95.

## 9. Criteria
| Criterion | Result |
|---|---|
| Dansk Mester scrollWidth... | other owner |
| Listed headings break only at `&shy;` compound points, or fit via `clamp()`. | PASS for Magiske Verber (visual inspection by text only; not screenshot-reviewed) |
| SPIL visible (Bøjningsværk./Pronomen.) | other owner |
| Confetti behind results text | other owner (frozen sjovt.js) |
