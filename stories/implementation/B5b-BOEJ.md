# B5b-BOEJ - Bøjningsværkstedet (W-BOEJ)

Status: IMPLEMENTED

## Summary
- `boejningsvaerkstedet/index.html`: linked `../shared/tts-button.css` (after theme) and `../shared/sd-extras.css`; header `molle` sprite removed; modes 5/6 blank now `<span class="sd-gap" role="img" aria-label="mellemrum">`, after answering `is-filled is-ok|is-bad` (role/aria-label dropped when filled); empty-state back button text "← TILBAGE".
- `shared/themes/boejningsvaerkstedet.css`: deleted old `.dc-tts-button` rules incl. `::before` ▶ (now one comment line); `.context .blank.done-*` rules replaced by `.context .sd-gap` / `.is-ok` / `.is-bad` (kept the ✓ / ✗ non-colour cue); `.brand` text now `font-size:0` at all widths (it already was at <=480px), so the page shows ONE title: the start-screen h1 with `tandhjul`. Brand text stays in the DOM for screen readers.
- TTS: all 5 `DC.ui.ttsButton` callers unchanged; now render "Lyt" via shared CSS.
- Not changed: level chips (toggle controls, not badges); the in-round "✕" back (quits a round, aria-label "Tilbage til start"); Mode 3 `.frame .blank` (word-in-frame, not a sentence mode) and table "·" fillers; no select exists in the game; no dark-surface outlier.

## Tests (scratchpad `impl/b5b-boej/`)
- `node tests/smoke.mjs ../boejningsvaerkstedet/index.html`: all rows PASS (console clean, no h-scroll, tap targets, focus ring, contrast, blocked localStorage).
- Own script, Edge, 1366x768 light and 360x640 dark: zero console errors; TTS button 48x48, aria-label "Lyt"; click gives exactly one `speak` with `da-DK` (modes 5 and 6); `.sd-gap` shows "?" empty, after answer `sd-gap is-filled is-ok/is-bad` with answer text; no h-scroll.
- Start screen at 1366/390/360 light+dark: SPIL top/bottom 337-401 / 398-462 / 422-486 (viewport heights 768/844/640), modes begin below (471 / 532 / 556): SPIL inside viewport, above and not covering mode list. Screenshots viewed (start 1366 light, 390 dark; feedback 360 dark): one title with gears sprite, pixel speaker crisp.
- `grep` for ♪/▶ in the game and theme: none used for TTS.

## Files changed
- `boejningsvaerkstedet/index.html`: ~359-362 (links), 366 (brand), ~655 (back text), ~1168-1170 and ~1216-1219 (gap).
- `shared/themes/boejningsvaerkstedet.css`: line 35 (brand), ~164-168 (gap), ~198 (TTS rules removed).
- Inline `<style>` `.context .blank*` rules (index.html ~288-295) are now dead but left (minimal diff).

## Remaining risks
- Brand header has no visible title on any width now (play screen shows only the shared bar + buttons); judged consistent with the existing narrow-width behaviour.
- Dark-mode `.sd-gap.is-ok/is-bad` use light ok-bg/bad-bg tokens with forced dark text; verified for mode 5 at 360 dark (readable).

## Newly discovered issues
- `tests/tidsmaskinen.mjs:304` ("Afspil igen") already reported in B5a (not mine).
- Inline `<style>` in the game keeps stale `.context .blank` and `.dc-tts-button`-era rules (dead, harmless).

## Needs native review
None (no Danish content changed; "← TILBAGE" is UI wording).

## US-029 (TTS)
| Criterion | Result |
|---|---|
| Shared `.dc-tts-button`, label "Lyt", >=44x44 | PASS (48x48, "Lyt") |
| Old ♪/▶ glyph rules deleted | PASS |
| One speak, da-DK, behaviour unchanged | PASS (modes 5, 6) |
| Focus ring visible | PASS (smoke focus row) |

## US-038 (icons)
| Criterion | Result |
|---|---|
| Bøjningsværkstedet keeps one title, with tandhjul | PASS (h1 only; header text hidden visually) |
| Existing sprites only, one density per row | PASS (tandhjul scale 5 only) |

## US-039 (per-game)
| Part | Result |
|---|---|
| (a) gap placeholders in modes 5/6 | PASS |
| (b) badges | NA (level chips are toggles, left) |
| (c) selects | NA (none) |
| (d) dark surface | NA |
| (e) Idiomjæger | other owner |
| (f) back wording | PASS ("← TILBAGE" on empty-state back; ✕ kept for quitting a round) |

## Fix round (W-BOEJ, narrowed)
Cause: `shared/themes/boejningsvaerkstedet.css` forced `color:#101010` on `.context .sd-gap.is-ok/.is-bad`; in dark mode the tokens `--sd-ok-bg`/`--sd-bad-bg` are dark, so the text was ~1.2-1.4:1. Also the empty state still used the retired `hat` sprite.

Change:
- `shared/themes/boejningsvaerkstedet.css` lines 165-166: `color: #101010` replaced by `color: var(--sd-text, #101010)` (same token the shared `.sd-gap` uses). `.context` is token-based (`--sd-panel-2`), no hard-coded cream container, so no extra pair needed (the cream `td.target` strips are Mode 1-4 grid cells, a different element, unchanged).
- `boejningsvaerkstedet/index.html` line 652: empty-state sprite `hat` -> `tandhjul`.

Contrast at the real `.sd-gap` (Edge, Modes 5 and 6; identical numbers at 1366x768, 390x844, 360x640; empty = "?" at its 0.6 opacity blended over the gap background):
| State | Light | Dark |
|---|---|---|
| empty | 4.86 (112,107,109 on 255,243,249) | 5.56 (173,152,122 on 49,31,41) |
| filled ok | 15.47 (16,16,16 on 207,241,201) | 11.57 (255,233,176 on 18,51,28) |
| filled bad | 13.89 (16,16,16 on 255,208,222) | 13.75 (255,233,176 on 58,16,32) |
(The "filled" state is always ok or bad in this game, so all four states are covered.) All >= 4.5. Screenshots viewed (m5-360-dark-bad, m6-1366-dark-ok, empty-dark): gap text readable, check/cross cue kept; empty state shows the gear sprite, "TILBAGE" button, no layout issues.

Tests (scratchpad `impl/w-boej-fix/`): zero console errors in all 6 viewport/theme runs; `node tests/smoke.mjs ../boejningsvaerkstedet/index.html`: all rows PASS; empty state (mode 4 / A1 has no data) renders `data-sd-sprite="tandhjul"` in light and dark, no errors. No other files changed; dead `.blank` CSS left as-is. `git status` shows no files from this round beyond the two owned files plus this report.

Status: IMPLEMENTED
