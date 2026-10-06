# B5b-FORB - Forbindeord (W-FORB)

Status: IMPLEMENTED

## Summary
- TTS: `speakerBtn()` now renders `class="dc-tts-button"` (no "♪" text), title "Lyt", aria-label "Lyt til sætningen"; click handler/speak() unchanged. Removed inline `.speaker` CSS and theme `html.sd-page .speaker*` rules. Linked `../shared/tts-button.css` and `../shared/sd-extras.css` after the theme.
- Gap: `_____` span -> `<span class="sd-gap blank" id="bk" role="img" aria-label="mellemrum">` (empty shows "?"). On answer (`choose`, `showAnswered`) role/aria-label removed and `filled is-filled is-ok` added (old `filled` kept). Removed old `.blank` rules (inline and theme).
- Category badge: `#cat` gets `sd-badge sd-badge--panel` (neutral); theme orange bg rule reduced to padding/margin. Level (`lvl`) is not displayed in this game.
- Back control: weak-mode exit "Tilbage til normalt spil ✕" -> "← Tilbage til normalt spil" (behaviour unchanged).
- Identity: `net` already matches the map (hero + end sprites unchanged; end row all 32px sprites at same scale).
- Untouched: US-002 distractor block, US-012/022/028/030/031/048, resume/retry, explainer wiring.

## Tests (scratchpad impl/b5b-forb/t.js, Edge)
- 1366x768, 390x844, 360x640 x light/dark: zero console errors, no h-scroll, TTS 48x48, aria "Lyt til sætningen", click -> exactly one speak with `da-DK`, gap "?" pseudo present when empty, after answer class `sd-gap blank filled is-filled is-ok`. Screenshots (question/feedback) viewed at 1366 light and 390 dark: pixel speaker crisp, badge neutral framed, gap green underline when filled, wrong/right option feedback intact.
- `node tests/smoke.mjs ../forbindenor/Forbindenor.html`: only legacy rows fail (`#btn-play` x4, "console clean + still playable" x3, known artefact); all others PASS incl. console clean, no h-scroll, icon buttons labelled, focus ring, contrast, localStorage blocked.
- Full-round: answered options (feedback + next) via script; resume state restored in later runs without errors.
- No BEFORE screenshots taken (time); before state = `♪` 36px round button, `_____` tinted box, orange category block.
- `git status`: repo has many other workers' changes; my files only: forbindenor/Forbindenor.html, shared/themes/forbindeord.css.

## Files changed
- `forbindenor/Forbindenor.html`: head CSS (~114-121 removed .speaker/.blank), links (~196), `#cat` (~221), back button (~218), `speakerBtn` (~671), gap markup (~881), fill (~922, ~936).
- `shared/themes/forbindeord.css`: ~66-72 (cat badge, speaker/blank rules removed).

## Tables
US-029: TTS button shared class PASS; aria-label PASS; >=44 PASS (48); behaviour unchanged PASS; no ♪/▶ for TTS PASS (grep); old theme rules deleted PASS.
US-038: identity `net` PASS (no change per map); mode sprites NA (none); single density PASS.
US-039: (a) gap PASS; (b) badge PASS (neutral; no level shown); (c) select NA; (d) dark surface NA; (e) NA; (f) back wording PASS (✕ removed; no round-quit control in this game).

## Remaining risks / notes
- Filled gap always uses `is-ok` (it shows the correct answer, also after a wrong pick); the wrong pick is signalled on the option.
- Hover lift of TTS 2px inside sentence row: not clipped in screenshots.
- Newly discovered: `sentence-row` align-items is flex-start so button sits top-right on wrapped lines (pre-existing).
- Needs native review: none (no content change).
