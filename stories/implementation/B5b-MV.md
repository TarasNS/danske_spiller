# B5b-MV: Magiske Verber (US-029 / US-038 / US-039 slices)

Status: IMPLEMENTED

## 1. Summary
- TTS: `speakerBtn()` now builds `<button class="dc-tts-button" aria-label="Lyt">` (no glyph); `shared/tts-button.css` + `shared/sd-extras.css` linked after the theme. Local `.speaker` rules removed from the game `<style>` and the theme. `speak()` / what is spoken unchanged.
- Icons: `GAME_SPR` = bog, tidsstjerne, ur, kort, tandhjul, pin, tryllestav, terning (all 32px set). `DIFF_SPR` replaced by `DIFF_STARS` (1/2/3 `stjerne`, one density) via new `stars()` helper (difficulty cards scale 4, mastery rows scale 2). Result badges: `★` text replaced by `stjerne` sprite (pokal for "Troldmandsniveau"). Header sprites (tryllestav, pokal) unchanged.
- Gaps: both `blankHtml` and the two chain blanks in the verb-forms game now emit `<span class="sd-gap" role="img" aria-label="mellemrum">`. Dead `.blank` rules deleted (game + theme).
- Badges: result achievements `sd-badge sd-badge--panel badge` (neutral).
- Dark surface: mode cards and difficulty tiles get `sd-surface`; because the theme's `html.sd-page .game-card` rules (higher specificity) would still win, the theme has a dark block (data-theme dark and prefers-color-scheme) putting game-card / diff / non-feedback `.opt` on `--sd-panel-2`, text `--sd-text`. Light mode pastels unchanged; correct/wrong option colours untouched.
- Back wording: "‹ Tilbage til hovedmenu" -> "← TILBAGE" (diff + stats); "‹ Forlad spil" -> "✕ Forlad spil" (quits a round). Behaviour/keyboard/focus (US-031) unchanged; explainer listeners, OK_MSGS/NO_MSGS untouched.

## 3. Tests (scratchpad `impl/b5b-mv/`, script `shots.js`)
- Edge: 1366x768, 390x844, 360x640 x light/dark: menu, difficulty, question, feedback, result screenshots taken and viewed (dark menu/diff, 390 light question, 360 dark question, 360 light result). Zero console/page errors in all 6 runs; no h-scroll.
- TTS button: 48x48 at every viewport, aria-label "Lyt", click -> exactly one `speechSynthesis.speak` with `da-DK`; pixel speaker crisp; focus ring visible (smoke "keyboard focus ring visible" PASS).
- `node tests/smoke.mjs ../magiske_verber.html`: all rows PASS except the known legacy artefact rows (`#btn-play` x4, "console clean + still playable" x3); "localStorage blocked: no crash" PASS, contrast PASS (light+dark).
- grep: no ♪/▶ left in `magiske_verber.html` or the theme.
- `git status`: my files are `magiske_verber.html` and `shared/themes/magiske-verber.css` (plus this report); the rest of the dirty tree belongs to other workers.

## 5. Files changed
- `magiske_verber.html`: link tags (~l.266-270), removed `.speaker` CSS (~l.203), `GAME_SPR`/`DIFF_STARS` + `stars()` (~l.729-770), `blankHtml` and chain blanks (~l.608/713/723), `speakerBtn` (~l.814), class additions in `buildMenu`/`openDiff`, back-link texts (3 buttons), result badges.
- `shared/themes/magiske-verber.css`: deleted `.speaker` and `.blank` rules; appended dark-surface block at end.

## 6. Remaining risks
- A full round was only partly driven (result screen reached at 2/7 accuracy), so the achievement-badge row with the star sprite was not seen on screen; markup is simple.
- Mastery rows: 3 stars at scale 2 inside the `.ml` label (width 88-104px) was not inspected visually on the stats screen.
- Difficulty is now by star count; the three tiles are still told apart by text (Nem/Mellem/Svær).

## 7. Newly discovered issues (not fixed)
- Menu "Hovedmenu" button on the result/stats screens is a button, not a back-link; wording left as is.
- Tests/other scripts that match the blank text "_____" would need updating (none found in this game's smoke).

## 9. Criteria tables
US-029 (TTS): button replaced by shared `.dc-tts-button` PASS; label "Lyt" PASS; >=44x44 PASS (48); one speak call da-DK PASS; no ♪/▶ for TTS PASS; old glyph CSS removed PASS; shared CSS after theme PASS; behaviour unchanged PASS.
US-038 (icons): GAME_SPR per map PASS; DIFF 1/2/3 stars PASS; one density per row PASS (game cards all 32px, difficulty all 16px stjerne); identity sprite unchanged PASS; achievements stjerne/pokal PASS (visual of badges NOT VERIFIED).
US-039: gaps -> `.sd-gap` PASS; badges `.sd-badge--panel` PASS; selects NA (none); dark-surface PASS (viewed 1366 dark menu/diff, 360 dark question); back wording PASS; Idiomjaeger inline TTS NA; green/red only for feedback PASS.
