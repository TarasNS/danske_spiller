# US-028 - Forbindeord slice (W-FORB)

Status: IMPLEMENTED

## Summary
- Toast "+1 ENERGY" -> "+1 ENERGI".
- English category labels ("/ Time", "/ Order / sequence" ...) removed: `#catEn` span, `CAT_EN` map, `catEn` record field and the `.cat .en` theme rule deleted.
- Theme CSS already used RIGTIGT/FORKERT (no change). The English sentence translation shown after an answer (label "Oversættelse") is a product feature and was left.

## Tests
- Own puppeteer drive (Edge, scratchpad impl/W-FORB/t.cjs, d.cjs): 0 page/console errors.
- `node smoke.mjs ../forbindenor/Forbindenor.html`: all rows PASS except the known legacy artefact rows (4x "play button #btn-play found", 3x "console clean + still playable", which depend on #btn-play). "localStorage blocked: no crash", contrast, focus ring, h-scroll: PASS.
- Grep `CORRECT|WRONG|Continue|Next ▸|Finish ▸|Multiple choice|"Check"|Pronounce|ENERGY` over Forbindenor.html and forbindeord.css: 0 hits. Rendered body text has no English category text.

## Files changed
`forbindenor/Forbindenor.html` (category header markup, render(), toast call, CAT_EN/records), `shared/themes/forbindeord.css` (.cat .en rule removed).

## Risks / issues
Reveal block still shows English translations by design (not in the story table).

## Needs native review
None.

## Acceptance criteria
- Every string listed is replaced: PASS (Forbindeord slice; other games: other owner)
- A grep across game files for `CORRECT|WRONG|Continue|Next ▸|Finish ▸|Multiple choice|"Check"|Pronounce|ENERGY` returns 0 user-visible hits: PASS for forbindenor files; other games: other owner
- Accessible names are Danish: PASS for Forbindeord (speaker "Lyt til sætningen"); other games: other owner
