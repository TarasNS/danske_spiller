# B5b - Glosekort (W-GLOSE)

Status: IMPLEMENTED

## Summary
- TTS: `speakerBtn()` in script.js now creates `<button class="dc-tts-button speaker-front|speaker-back" aria-label="Lyt">` (no glyph; was "▶" / "Udtal"). `speak()` untouched. Linked `../../shared/tts-button.css` after the theme and `../../shared/sd-extras.css` in index.html. Removed dead `.speaker*` rules from style.css and `html.sd-page .speaker*` from flashcards.css.
- Current-card marker in the sidebar: `li.now::before` is now an 8x8 solid pixel square (currentColor) instead of "▶"; `aria-current="true"` already existed on the item button.
- Dark outlier: `.card-front` used the fixed `--sd-paper` (stayed light in dark mode); now `var(--sd-panel)` / `var(--sd-text)` via the theme (token approach from the snippet; the back face is intentionally dark). `.sd-surface` class not added because the theme tokens do the job.
- Back wording: review-mode exit button "Tilbage til hele bunken" gets a CSS "← " prefix (text unchanged, behaviour unchanged). "Tilbage: N" is a counter, not a control.
- Badges: none in this game (level chips are toggle controls, left). Select/gap: none. Identity sprite `kort` (index.html:76) already matches the map. No mode sprites (map: text-only).
- US-011/017/028/037/043 untouched (verbs array, reset spacing/confirm, chips above card at <=480, sidebar list buttons).

## Tests (scratchpad impl/b5b-glose)
- 1366x768, 390x844, 360x640, light and dark: 2 TTS buttons (front, back after flip) 48x48, aria-label "Lyt"; click -> exactly 1 `speechSynthesis.speak`, lang da-DK, card did not flip; no h-scroll; 0 console errors. Screenshots viewed (1366 dark, 360 light): pixel speaker crisp, card panel dark in dark mode, marker visible, chips above card on phone.
- `node tests/smoke.mjs ../danish_flashcards/danish_flashcards_game/index.html`: all PASS except the known legacy `#btn-play` rows (4) and the 3 "console clean + still playable" rows (same artefact). localStorage-blocked PASS, contrast PASS, focus ring PASS, icon buttons labelled PASS.
- grep: no ♪/▶ in game files or flashcards.css.
- Not done: screenshots of the flipped back/feedback/results screens, a full round, before-shots, explicit focus-ring shot of the TTS button (smoke focus ring PASS).

## Files changed
- danish_flashcards/danish_flashcards_game/index.html (2 link lines after theme link)
- danish_flashcards/danish_flashcards_game/script.js (speakerBtn, ~259-266)
- danish_flashcards/danish_flashcards_game/style.css (removed .speaker block)
- shared/themes/flashcards.css (.now::before, .speaker block removed, .card-front colours, `#exit-review-btn::before`)

## Remaining risks
- The ← prefix on the review-exit button is CSS-only (screen readers read the text only; fine).
- Card back face stays #101010 in both modes by design.

## Newly discovered
- A loader overlay covers the page for ~2 s on load; clicks before it clears are swallowed (not a regression).

## Needs native review
None.

## Criteria
| Slice | Criterion | Result |
|---|---|---|
| US-029 | one shared TTS button, aria-label "Lyt", >=44x44 | PASS (48x48) |
| US-029 | one speak per click, da-DK, behaviour unchanged | PASS |
| US-029 | no ♪/▶ for TTS; ▶ marker replaced | PASS |
| US-029 | old theme glyph rules deleted | PASS |
| US-038 | identity sprite per map (kort), single density | PASS (no change needed) |
| US-038 | mode sprites | NA (text-only modes) |
| US-039a | .sd-gap | NA |
| US-039b | badges | NA (chips are toggles) |
| US-039c | selects | NA |
| US-039d | dark-surface outlier | PASS (card front follows panel tokens) |
| US-039e | Idiomjæger inline | NA |
| US-039f | back wording "← TILBAGE" | PASS-ish: review exit gets "←" prefix, wording kept "Tilbage til hele bunken" (descriptive); NEEDS REVIEW if exact "TILBAGE" required |
