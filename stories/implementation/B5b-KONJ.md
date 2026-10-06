# B5b-KONJ - Konjunktioner (W-KONJ)

Status: IMPLEMENTED

## 1. Summary
Files: `konjunktioner/konjunktioner.html`, `shared/themes/konjunktioner.css`.
- Linked `../shared/tts-button.css` (after theme) and `../shared/sd-extras.css`.
- TTS: `speakerBtn()` now builds `class="dc-tts-button sentence-speaker"`, no ♪, aria-label "Lyt til sætningen" (spoken text and `speak()` unchanged). Deleted dead `.speaker` rules in the game CSS and theme.
- Gap: `<span class="sd-gap" id="blank" role="img" aria-label="mellemrum">` (empty shows "?"). `choose()` now adds `is-filled` plus `is-ok`/`is-bad` instead of inline colour/border styles; role/aria-label removed once filled. Deleted old `.blank` rules (game CSS and theme).
- Badges: "Hovedsætning / Bisætning / Hv-ord" start-screen legend and the in-game category chip are now `sd-badge sd-badge--panel` (neutral, text distinguishes). Removed the coloured gradient/inline backgrounds and the green `.chip.hv`.
- Select: `#lvlSelect` has `class="sd-select"`; theme's hard-coded white bg/colour removed so dark works.
- Identity sprite `slik` (line 273) already matches the map; no change. No in-game back control exists (only the Sjovt MENU bar, untouched) so no back wording to change. US-022/034/049 and explainer wiring untouched.

## 2. Tests
- Edge puppeteer script (scratchpad `impl/b5b-konj/`): 1366x768, 390x844, 360x640 x light/dark: TTS button 48x48, aria-label "Lyt til sætningen", 1 per screen, click = exactly one `speechSynthesis.speak` with `da-DK`, no h-scroll, no console errors, gap ends `is-ok`. Wrong answer run with localStorage blocked: gap `is-bad`, no errors.
- `smoke.mjs` (CHROME_PATH=Edge): all PASS except the known legacy artefacts (`#btn-play` x4, "console clean + still playable" x3). Contrast row PASS in light and dark, localStorage-blocked PASS, focus ring PASS.
- Screenshots viewed (start dark 360, feedback 360 light, wrong 800 wide): pixel speaker crisp, gap shows dashed/pink-or-green box, neutral outlined badges, select with pixel chevron.
- `grep ♪|▶` in both files: none.
- Contrast of badges (computed): light #101010 on #F5F5FF (~17:1), dark #FFE9B0 on #222131 (~13:1). The old 4.44:1 "Hv-ord" label (white on gradient) is gone: FIXED. No separate before-run was taken.
- `git status`: only my two files changed from this worker (the tree contains other workers' changes).

## 3. Files changed
- `konjunktioner/konjunktioner.html`: link tags (~line 235), removed `.blank`/`.speaker` CSS (~123-135), legend/select markup (~275-285), `speakerBtn` (~720), `renderQuestion` blank/chip, `choose()` blank handling.
- `shared/themes/konjunktioner.css`: chip, blank (removed), speaker (removed), legend, `#lvlSelect` rules.

## 4. Remaining risks
- Chips/legend are no longer colour-coded by category (by design, US-039b); the legend now only names the types.
- Inline `.sentence` flex gap unchanged; the larger 48px button adds a row on narrow screens (viewed at 360, fine).

## 5. Newly discovered issues
- Question-screen chip/legend colour mapping removed also for `.review-badge` untouched (still gradient/ink; not a level badge, left).
- Smoke selector artefact (`#btn-play`) for this legacy game.

## 6. Needs native review
None (no content changed).

## US-029 (TTS)
| Item | Result |
|---|---|
| Replace ♪ with shared `.dc-tts-button`, aria-label | PASS ("Lyt til sætningen") |
| >=44x44 | PASS (48x48) |
| CSS linked after theme, old glyph rules deleted | PASS |
| Behaviour unchanged, one speak da-DK | PASS |
| No ▶/♪ for TTS | PASS |
| Focus ring | PASS (smoke row + screenshot) |

## US-038 (icons)
| Item | Result |
|---|---|
| Identity sprite = `slik` (map row) | PASS (already matched) |
| Mode/achievement sprites | NA (text-only modes per map) |
| One density per row | PASS (unchanged: slik 32, hjerte 16 in separate places) |

## US-039
| Item | Result |
|---|---|
| (a) blank -> `.sd-gap` | PASS |
| (b) badges -> `.sd-badge--panel`; Hv-ord contrast | PASS (contrast now ~17:1 / ~13:1) |
| (c) select -> `.sd-select` | PASS (48px, pixel chevron, dark ok) |
| (d) dark-surface outlier | NA (not an outlier game) |
| (e) Idiomjæger inline TTS | NA |
| (f) back wording | NA (only MENU bar; no in-game back) |
