# B5b-PRON - Pronomenmysteriet adoption (W-PRON)

Status: IMPLEMENTED

## Summary
- `pronomenmysteriet/index.html`: linked `../shared/tts-button.css` (after theme) and `../shared/sd-extras.css`. Sentence blank is now `<span class="sd-gap" role="img" aria-label="tomt felt">` (shows "?"); after answering `is-filled is-ok|is-bad` (old `done-correct/done-wrong` kept as extra classes, no CSS). Empty-state back button text "Tilbage" -> "← TILBAGE". In-round control stays "✕" (it quits a round, per the brief) with aria-label "Tilbage til start". `showStart()` scroll reset + `focus({preventScroll:true})`, US-030/031/037/042 untouched; `data.js` untouched.
- `shared/themes/pronomenmysteriet.css`: deleted old `.dc-tts-button` block (incl. `::before` "▶") and the `.target .dc-tts-button` line; replaced `.blank*` rules with `.target .sd-gap` (+`is-ok`/`is-bad`, the same colours as before, since the target strip is always cream), ✓/✗ prefixes, stamp/shake animations and reduced-motion rule retargeted to `.sd-gap.is-ok/.is-bad`.
- `tests/pronomenmysteriet.mjs`: `.blank` selector -> `.sd-gap`. The test never hardcoded "Afspil igen" (its regex already accepts "lyt"), so no label edit needed.
- Dead inline `.blank` rules remain in the index.html `<style>` (harmless; left to keep the diff minimal).

## Tests
- `node tests/pronomenmysteriet.mjs` (OUT in scratchpad, no dump left): 61/66. FAIL: 4x "auto-advance ~800ms" (measured 860-1240 ms except first-item outliers 1459/2640 ms; click-to-advance timing under heavy machine load from parallel workers, advance timer code unchanged at 800 ms) and "Space toggles a chip" (expects 'true' after toggling an all-true chip; looks like a test/timing issue unrelated to this change). I could not run a before-run (no git state changes allowed), so attribution to pre-existing/load is unproven. Data guard, SRS, shuffle, a11y rows, no-h-scroll/tap>=44 on all viewports/schemes, console clean: PASS.
- `node tests/smoke.mjs ../pronomenmysteriet/index.html`: Verdict PASS (all rows).
- Custom check (scratchpad vis.cjs, Edge) at 1366x768 and 360x640, light and dark: TTS button 48x48, aria-label "Lyt", click -> exactly one `speechSynthesis.speak` with `da-DK`, `.sd-gap` dashed underline, no h-scroll, 0 console errors. Screenshots viewed (question 360 dark, feedback 1366 light): pixel speaker crisp, gap readable, correct state green with check.
- grep: no ♪/▶ in `pronomenmysteriet/index.html` or the theme.
- Not run: blocked-storage run beyond smoke's (PASS), 390x844 screenshots, results-screen screenshots (results screen unchanged by this work; covered by the spec test's overflow/tap checks).

## Files changed
- `pronomenmysteriet/index.html` (head links ~113-115; blank creation ~470-476; fill ~527-532; empty-state button ~383)
- `shared/themes/pronomenmysteriet.css` (blank block ~109-114, TTS block ~146, motion ~165-170, reduced-motion ~178)
- `tests/pronomenmysteriet.mjs` line 27

## US-029 TTS
| Check | Result |
|---|---|
| Uses shared `.dc-tts-button` via `DanskCore.ui.ttsButton` (prompt + wrong-answer slip) | PASS |
| aria-label "Lyt", >=44x44 (48x48) | PASS |
| tts-button.css linked after theme; old `::before` glyph rules deleted | PASS |
| Behaviour unchanged (one speak, da-DK) | PASS |
| No ♪/▶ for TTS | PASS |
## US-038 icons
| Check | Result |
|---|---|
| Header + title sprite = `bog` (portal card sprite), same sprite in both slots, single density per slot | PASS (already correct, no change) |
| Mode/achievement sprites | NA (text-only modes per map) |
## US-039
| Check | Result |
|---|---|
| (a) blank -> `.sd-gap` | PASS |
| (b) level/category badges | NA (levels are selectable filter chips, not badges; "B1..." evidence tags are numbered evidence labels; left) |
| (c) selects | NA (none) |
| (d) dark-surface outlier | NA (not an outlier) |
| (e) Idiomjæger | NA |
| (f) back wording | PASS with note: in-round "✕" kept (quits a round); empty-state back now "← TILBAGE" |

## Risks / issues
- Test failures above need an independent before-run to attribute. Dead `.blank` inline CSS left. `git status` shows many files changed by other workers; mine are the three above.
