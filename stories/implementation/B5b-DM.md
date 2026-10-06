# B5b-DM - Dansk Mester (US-029 / US-038 / US-039 slices)

Status: IMPLEMENTED (needs independent verification)

## Summary
- `danske-phraser/dansk-mester.html`: links `../shared/tts-button.css` and `../shared/sd-extras.css` after the theme. `speakerBtn()` now creates `<button class="dc-tts-button" aria-label="Lyt">` (no glyph; speak() behaviour unchanged; all 4 call sites use the full 48px button). Old `.speaker` CSS deleted.
- Icons per map: header and "Fortsæt" card `flag` -> `snak`; `MODE_SPR` = {mc bog, flash kort, match net, timed tryllestav, mixed terning, sr kiste, weak lup}; bottom nav `polle`/`pokal`/`stjerne` (scale 2); path cards `kort` (verbs) / `snak`; `BADGE_SPR` = ['pokal','stjerne']. Chips (stjerne, molle), STREAK_ICO `molle`, mode emblem scale 4 kept.
- CEFR select: `class="sd-select"` plus aria-label; inline style removed.
- Back wording: "← Tilbage" on path and modes screens; in-round quit is "✕ Afslut" (2 places). "▶ Start med kategori 1" -> "Start med kategori 1"; "Fortsæt ▸" -> "Fortsæt →" (no ▶ left).
- `shared/themes/dansk-mester.css`: removed `.speaker` + ♪ `::before` rules; flash/match speaker positioning now targets `.dc-tts-button` (margin 0); `html.sd-page select` rule reduced to `select.sd-select` without background/colour/padding/min-height `!important` (coordinator note), so the shared panel bg and pixel chevron apply; first course card (`.path-card.verbs`) now panel surface with orange top accent, dark-only overrides removed (QA-070).
- Gap placeholders: none in this game (NA). Level badges: the game has only a CEFR select, no badges; green "KLARET" completion badge left (feedback/completion meaning).

## Tests (scratchpad impl/b5b-dm)
- Edge, 1366x768 / 390x844 / 360x640, light+dark: home, path, modes, question, feedback, flash, match, badges screenshots captured; viewed modes (light), match (360 light), path (dark): sprites crisp, one 32px family in modes, speaker pixel icon at 48px, select with chevron on panel colour, no h-scroll.
- 0 console errors in all runs; TTS buttons measured 48x48, aria-label "Lyt"; click on match speaker: exactly 1 `speechSynthesis.speak`, lang da-DK.
- Select computed (light/dark): appearance none, bg rgb(255,244,235) / rgb(49,32,19), chevron background-image present, height 48.
- Not run: `smoke.mjs`, blocked-storage run, full round, before-screenshots (a before copy of the HTML is in the scratchpad); mark NOT VERIFIED.

## Files changed
`danske-phraser/dansk-mester.html` (style block ~205-212 removed, head links, speakerBtn ~730, topbar/nav/home/path/modes/back/BADGE_SPR lines), `shared/themes/dansk-mester.css` (select ~142, speaker block removed, flash/match ~210-230, verbs card ~110).

## Remaining risks
- Heading scale: 32px sprites at old flat scales (header scale 3 renders small but legible, path cards scale 5).
- Hover lift disabled on match speakers (centering transform).
- `.ach.un` / `.face.back` keep cream fills as accent states (not changed).

## Newly discovered
- `.back` elements are divs with role=button added by JS (not changed).

## Criteria
| Slice | Result |
|---|---|
| US-029 shared TTS button, aria "Lyt", >=44, no ♪/▶ for TTS | PASS (measured) |
| US-029 behaviour unchanged | PASS (1 speak, da-DK) |
| US-038 header snak, map rows, one density per row | PASS (visual) |
| US-039a gaps | NA |
| US-039b badges | NA (no level badges) |
| US-039c select sd-select, chevron, 48px, light/dark | PASS |
| US-039d dark surface | PASS (path-card.verbs panel; dark screenshot of path viewed, home dark not viewed closely) |
| US-039f back wording | PASS |
| smoke / storage-blocked / full round | NOT VERIFIED |
