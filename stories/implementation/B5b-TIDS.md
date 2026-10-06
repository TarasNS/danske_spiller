# B5b - Tidsmaskinen (W-TIDS)

Status: IMPLEMENTED

## Summary
- Header and title sprites `ur` -> `tidsstjerne` (index.html :160, :167; line numbers shifted +2 by new links).
- Linked `../shared/tts-button.css` and `../shared/sd-extras.css` after the theme. Deleted the theme's old TTS block (`.dc-tts-button` rules incl. the `::before` ▶) and the `.target .dc-tts-button` override; `DanskCore.ui.ttsButton` (label "Lyt") unchanged in use.
- Sentence blanks: `class="blank sd-gap"` (blank class kept for test/theme hooks); fillBlank (both variants) also adds `is-filled` + `is-ok`/`is-bad`. Theme blank colour rules replaced by pinned `.target .sd-gap` colours (the target card is always cream, so panel tokens would be unreadable in dark mode). ✓/✗ non-colour cues kept.
- Mode label above the prompt (`.case-tag`) -> `sd-badge sd-badge--panel` (theme night background removed). Level chips are toggle buttons, not badges: unchanged.
- Lit-zone marker `▶` (inline CSS in index.html and theme) -> `■`.
- Empty-state back button "Tilbage" -> "← TILBAGE". The round-quit `✕` is kept (it quits a round).
- `tests/tidsmaskinen.mjs`: "Afspil igen" -> "Lyt" (the only occurrence, :304).
- Untouched: timer deadline-hold listener, `showStart()` scroll reset, data, scoring, storage.

## Tests
- `node tests/smoke.mjs ../tidsmaskinen/index.html`: all rows PASS (verdict PASS).
- Own check (Edge, 1366x768 / 390x844 / 360x640, light + dark): TTS button 48x48, aria-label "Lyt", `.sd-gap` and `.sd-badge--panel` present, brand sprite `tidsstjerne`, no h-scroll, no console errors; one click on TTS = one `speak` with `da-DK`. Screenshots viewed (dark 390 feedback, light 1366 feedback): pixel speaker crisp, gap green-tinted with ✓ after correct answer, badge neutral, ■ zone marker.
- Spec test `tests/tidsmaskinen.mjs` (OUT in scratchpad, background): first run was cut at my own 590 s timeout after 232 log lines with zero FAIL rows (slip rows with "Lyt" PASS, 2-slot blanks carry `sd-gap ... is-ok/is-bad`); full rerun result: see addendum below. No dump files left in repo (`tids-dumps.json` only in scratchpad).
- `grep` ▶/♪ in index.html and theme: none.

## Files changed
- `tidsmaskinen/index.html` (:97, :153-154, :160, :167, :897, ~:976, :979, :1124, ~:1279)
- `shared/themes/tidsmaskinen.css` (case-tag, blank block ~:117-127, zone ▶, removed TTS block)
- `tests/tidsmaskinen.mjs` (:304)

## Remaining risks
- Known flaky spec rows (auto-advance timing, 'timed expiry: no SRS write').
- Inline `.blank` rules in index.html (:72-76) remain as fallback; overridden by sd-extras/theme.
- Smoke/spec not run with native TTS voice.

## Newly discovered
- Spec test resolves `tidsmaskinen/index.html` relative to cwd: must be run from the repo root.

## Tables
US-029 TTS: PASS (shared class, "Lyt", 48x48, one speak da-DK, old glyph rules deleted, ▶ marker replaced). Focus ring: not separately screenshotted (shared CSS) - NOT VERIFIED.
US-038 icons: PASS (`tidsstjerne` in both header slots; template game has no mode sprites).
US-039: (a) gap PASS; (b) badge PASS (mode tag; level chips are toggles, NA); (c) selects NA; (d) NA; (e) NA; (f) PASS (empty-state back; round-quit ✕ kept).

## Addendum: full spec run
`tests/tidsmaskinen.mjs` full run: 152/153 passed. Only failure: "timed expiry: no SRS write" (`key present=true`), the known random-flaky row (the first, partial run passed this row). All "Lyt" slip rows and the build/keyboard/viewport/contrast rows passed. No dump files in the repo.
