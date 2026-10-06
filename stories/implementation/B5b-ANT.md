# B5b-ANT (Antonymer) - US-029 / US-038 / US-039

Status: IMPLEMENTED

## Summary
- TTS: `speakerBtn()` now creates `button.dc-tts-button` (`+ dc-tts-button--sm` for the "sm" calls), aria-label "Lyt" (was "Udtal"); inline SVG removed (shared CSS draws the pixel speaker). Click behaviour (`speak(text)`, stopPropagation) unchanged. Linked `shared/tts-button.css` after the theme. Deleted local `.speaker` CSS in the HTML (`.speaker`, `.speaker.sm`, `.speaker:active`) and the `html.sd-page .speaker*` rules in `shared/themes/antonyms.css`.
- Icons: MODES -> choice `bog`, match `net`, reverse `modsat`, missing `snak`, speed `tryllestav`, review `lup`, category `kiste`, difficulty `stjerne` (map; the first card no longer repeats the header `modsat`). HUD: streak `hjerte` -> `molle`; accuracy chip loses its `flag` sprite (text "%" only).
- Back controls: "← Tilbage" -> "← TILBAGE" (4 screens). Behaviour unchanged. The in-round quit control is already "✕ AFSLUT".

## Tests (scratchpad impl/b5b-ant)
- Edge, 1366x768 / 390x844 / 360x640, light+dark: 0 console errors, no h-scroll; TTS button 48x48, label "Lyt", speak calls lang `da-DK` (count 2 = auto-speak on question plus my one click; auto-speak is pre-existing). Viewed screenshots: menu (sprites crisp, 8 distinct), question dark 360 (pixel speaker, frame, readable), feedback.
- `node tests/smoke.mjs ../danish-antonyms-game.html`: all rows PASS except the known legacy artefacts (`#btn-play` x4, "console clean + still playable" x3). localStorage-blocked row PASS, focus ring PASS, icon buttons labelled PASS.
- Short round: question -> answer -> feedback worked in all 6 viewport/scheme runs.

## Files changed
- `danish-antonyms-game.html`: removed `.speaker` CSS (~l.198-203), added tts-button.css link (~l.300), HUD chips (~l.317-319), back buttons, `speakerBtn` (~l.930), `MODES` (~l.1422).
- `shared/themes/antonyms.css`: removed speaker rules (~l.135-142).

## Remaining risks
- `stjerne` (flat, difficulty card) is a smaller density than the shaded 32px sprites in the same row: map marks this BLOCKED (needs art in frozen sjovt.js). `kiste`/`lup`/`tryllestav` were not individually density-checked beyond visual look (crisp).
- Pixel scale 4 of the old flat HUD sprite swaps was not changed.

## Newly discovered / notes
- No `<select>`, no sentence blanks (`.sd-gap`), no level/CEFR badges, no dark-surface outlier in Antonymer. The `.badge.weak/.master` chips in the review list are mastery/feedback status and were left as is; the HUD "Niv." chip is a stat chip, not a badge.
- Intro card (`style=` inline, ~l.331) uses `var(--card)`; looks fine in dark, not changed.
- Game has no explainer, nothing to check there.

## Needs native review
None (no Danish content changed besides the "TILBAGE" casing and "Lyt").

## Acceptance table
| Slice | Item | Result |
|---|---|---|
| US-029 | Shared `.dc-tts-button`, label "Lyt", >=44x44 | PASS (48x48) |
| US-029 | Old glyph/local speaker CSS removed; no ♪/▶ for TTS | PASS (grep clean) |
| US-029 | TTS behaviour unchanged, `da-DK` | PASS |
| US-029 | Focus ring visible | PASS (smoke) |
| US-038 | MODES / HUD per map | PASS (difficulty `stjerne` density = known BLOCKED) |
| US-038 | One density per row | PARTIAL (see risks) |
| US-039a gaps | NA (no blanks) |
| US-039b badges | NA (only status badges) |
| US-039c selects | NA (none) |
| US-039d dark surface | NA (not an outlier) |
| US-039e Idiomjaeger | other owner |
| US-039f back wording "← TILBAGE" | PASS |
| Keep US-004/013/020/028/031/037/041/045 | Not touched (focus code and confetti CSS unmodified); results-screen confetti not re-driven visually: NOT VERIFIED |
