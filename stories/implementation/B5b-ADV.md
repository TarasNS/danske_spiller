# B5b-ADV - Adverbier (adverbs.html, shared/themes/adverbs.css)

Status: IMPLEMENTED

## Summary
- Linked `shared/tts-button.css` and `shared/sd-extras.css` after the theme CSS (adverbs.html head).
- Deleted the old `.tts-row .dc-tts-button` glyph/box rule in `adverbs.css` (was line 167); `.tts-row` layout rule kept. `DanskCore.ui.ttsButton` call unchanged, so the button is now the shared 48x48 "Lyt" with the pixel speaker.
- Gap blanks (`______` in the gap and connector sentence modes) are now rendered through new helper `appendGapText()` as `<span class="sd-gap" role="img" aria-label="mellemrum">`. The spoken text (`spokenGap`) and the no-voice fallback text are unchanged.
- Review-finish back button text changed from "Tilbage til øvelserne" to "← Tilbage" (title keeps the long wording; id and behaviour unchanged).
- Identity sprite already `ur` at `data-scale=3` in the h1 (matches the map, no change). Mode/zone buttons are text-only per the map. Empty-zone hiding (decision #3) and the US-031 focus trap code were not touched.

## Tests
- Edge puppeteer at 1366x768 (light), 390x844 (dark), 360x640 (light): zero console/page errors; no h-scroll; TTS button 48x48, aria-label "Lyt"; a click gives exactly one `speechSynthesis.speak` with lang `da-DK`; `.sd-gap` found in a gap question in light and dark (DOM check).
- `node tests/smoke.mjs ../adverbs.html`: only the known legacy artefact rows fail (`#btn-play` x4, "console clean + still playable" x3); all other rows PASS, including localStorage blocked, contrast, focus ring, no h-scroll.
- Not done: a full before/after screenshot set. My one gap screenshot caught the loading screen, so the visual look is not eyeballed.
- Not run: full round and blocked-storage round beyond smoke.
- `grep` for TTS glyphs (♪, ▶) in the game and theme: none.
- `git status` shows many files changed by other workers; mine are `adverbs.html` and `shared/themes/adverbs.css` only.

## Files changed
- `adverbs.html`: link tags after line 361, `appendGapText` plus 2 call-site changes in the gap and connector renderers (~735-775, 955+, 1100+), back button text (~1385).
- `shared/themes/adverbs.css`: removed line 167.

## Slice tables
US-029 (TTS)
| Item | Result |
|---|---|
| shared `.dc-tts-button`, aria-label "Lyt", >=44x44 | PASS (48x48) |
| tts-button.css linked after theme; old glyph rules removed | PASS |
| one speak, da-DK, behaviour unchanged | PASS |
| ▶ used elsewhere (e.g. a current-item marker) | NA, none in this game |
| Visible focus ring on TTS button | NOT VERIFIED (smoke focus-ring row passes generally) |

US-038 (icons)
| Item | Result |
|---|---|
| Identity header `ur` | PASS (already matches map) |
| Mode/zone sprites | NA, text-only modes |
| Achievement sprites (pokal, stjerne) | NA, unchanged and not in the map's Adverbier rows |

US-039
| Item | Result |
|---|---|
| (a) gap placeholders to `.sd-gap` | PASS |
| (b) level/category badges | NA, no badge elements (level shown as a dashboard stat) |
| (c) selects | NA, the game has none |
| (d) `.sd-surface` | NA, Adverbier is not one of the listed outliers |
| (e) Idiomjæger inline TTS | NA, other game |
| (f) back wording "← TILBAGE" | PASS (only in-game back control, the review-finish button) |

## Remaining risks
- The blank now reads "?" in a dashed box instead of `______`; any test matching `______` in the DOM text would break (none found in smoke).
- Top-level modal buttons ("Luk", "Annullér", "Afslut repetition") were left as is; they are not back-to-game controls.

## Newly discovered issues
- Zone buttons are cream in dark mode (looks like a light-surface outlier); not on the story's list, not changed.

## Needs native review
None (no Danish content changed except the "← Tilbage" label).
