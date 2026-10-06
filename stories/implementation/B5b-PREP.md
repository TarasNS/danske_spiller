# B5b-PREP (Praepositioner) - Batch 5b adoption

Status: IMPLEMENTED

## Summary
- `dansk-praepositioner.html` + `shared/themes/praepositioner.css`. Linked `shared/tts-button.css` and `shared/sd-extras.css` after the theme.
- TTS: `speakerBtn()` now makes `<button class="dc-tts-button [dc-tts-button--sm]" aria-label="Lyt til sætningen">` (no glyph). Speak behaviour unchanged. Old `.speaker` rules removed from game and theme CSS. No ♪/▶ left in either file.
- Icons: `MODE_SPR` = map (`fill snak, mc bog, drag tandhjul, mistake pin, correct ur, trans modsat, pairs slik, speed tryllestav, review lup, stats pokal`). First card no longer repeats the header `pin` (it is now on "Find fejlen", as the map dictates). 9 rows are 32px-family at scale 4 (64x64, 2px pixels); `pokal` is flat only, so it is rendered at scale 2 (22x24, also 2px pixels) = one pixel density. Header `pin` unchanged.
- Gaps: `.blank` -> `.sd-gap` (empty shows "?"); after answering gets `is-filled` plus `is-ok`/`is-bad` (previously only "filled" on correct). Game/theme `.blank/.filled` rules removed. `.drop` (drag zone) unchanged.
- Badges: mode/theme badges -> `sd-badge sd-badge--panel`; `.badge` rules removed.
- Select (coordinator note): `#lvlSel` now `class="sd-select"`, inline style removed, theme `#lvlSel` `!important` bg/colour/min-height/padding deleted (kept font, border 0, box-shadow, margin, max-width). Real select verified: computed `appearance:none`, height 48px, bg rgb(236,251,253) light / rgb(20,43,47) dark, pixel chevron background-image present.
- Dark surface: mode cards get `sd-surface`; theme fill is the panel token, game colour is an 8px top accent stripe (`--acc`) per `.c-*`. Review-count chip uses `var(--sd-ink)`.
- Back wording: all four in-game back buttons "‹ Menu" -> "← Tilbage" (theme uppercases). Behaviour unchanged. Results-screen buttons "Menu" / "Tilbage til menu" (not in-game back controls) untouched.

## Tests (scratchpad impl/b5b-prep: shots.cjs, meas.cjs; before-/after-*.png)
- Console errors: 0 in 6 viewport/theme runs (menu, Flervalg question, feedback, stats).
- scrollWidth == viewport at 320/360/390/1366, light and dark, on menu and all 10 modes: no h-scroll.
- TTS: 48x48 (sm variant 32px + 44px hit area, from shared css), aria-label "Lyt til sætningen", click -> exactly one `speechSynthesis.speak`, lang da-DK; focus ring 4px solid on keyboard focus.
- Screenshots viewed (390 dark menu, 390 light feedback): mode cards dark in dark mode with coloured top stripes, sprites crisp, select panel-coloured with chevron, speaker pixel icon, gap shows underlined filled word green on correct, badges neutral framed.
- smoke (cd tests): all pass except the known legacy rows (`#btn-play` x4, "console clean + still playable" x3). localStorage-blocked row PASS.
- Not run separately: full multi-round play beyond the 10-mode loop and one answered question; retry fixes (soft hyphens kept untouched, `revealFeedback`, explainer listener untouched).

## Files changed
- dansk-praepositioner.html: CSS head (removed .badge/.blank/.filled/.speaker rules), link tags ~l.255-258, select ~l.280, `speakerBtn` ~l.782, MODE_SPR/renderMenu ~l.857-866, exShell, gap code in fill/mc/pairs/speed/review, back buttons.
- shared/themes/praepositioner.css: #lvlSel, .mode-btn/.c-*, removed .badge/.blank/.speaker blocks.

## Remaining risks / recorded
- 🎯 emoji still in the "Flervalg" label `MODES.e` (l.~846); `e` is never rendered in the menu, but `exShell("🎯 Flervalg")` passes it through `noEmoji()` so it is stripped from the badge. Left, as instructed.
- Wrong-answer gap now shows `is-bad` (red) with the correct word; previously neutral. Needs owner eyes.
- `.opt` option buttons remain hard white in dark mode (not in the outlier list; recorded).
- Sticky bar overlays header in fullPage screenshots only (capture artefact).
- No shared dependency needed.

## Tables
US-029: TTS button shared class, label, >=44, one speak, no ♪/▶: PASS. Link after theme: PASS.
US-038: map applied, header kept, one density per row (pokal at half scale per map note): PASS (pokal flat is the documented interim).
US-039: (a) gaps PASS; (b) badges PASS; (c) select PASS (note applied); (d) surface PASS; (e) Idiomjaeger NA; (f) "← TILBAGE" PASS.
