# B5b-ORD - Ordstillingsdetektiven (W-ORD)

Status: IMPLEMENTED

## Summary
Files: `ordstilling-detektiv/index.html`, `shared/themes/ordstilling.css` (only these).
- TTS: the solution-sentence listen button (only TTS in the game) is now `.dc-tts-button` (aria-label "Lyt til sætningen", title the same, no glyph). Local `.speaker` CSS (index.html) and theme `.speaker` rules deleted; `../shared/tts-button.css` and `../shared/sd-extras.css` linked after the theme. Behaviour unchanged (`speak(text)`).
- Badges: rank badge, static A1..B2 tier pills, case-card level badges and FINALE badge now `sd-badge sd-badge--panel` (neutral); the green/blue/amber/red per-level colour rules (`.t-*`, `.lb-*`) removed from the theme. The filter buttons (`lvlFilter`) are interactive controls and keep their own styling.
- Back wording: `#backBtn` and the 3 result-screen `#mapBtn2` buttons read "← TILBAGE" (aria-label "Tilbage til sagskort"). Behaviour unchanged.
- Icons: identity `lup` already matches the map (no change). Result-screen `pokal`/`stjerne` (flat) were mixed with `lup` (shaded) in one row; set to data-scale 3 (half of lup's 6) so pixel size matches (map interim rule).
- Decision #4 work, US-013/023/028/031/050, explainer wiring, timer untouched.

## Tests
- Own harness (Edge, fresh browser per config, 1366x768 / 390x844 / 360x640, light, dark, light+reduced motion; case 1 statement 1 then solve): 9/9 zero console errors, no h-scroll; prompt top 391 / 276-469 / 64 px (>=56), pool and UNDERSØG inside viewport (bottom <= 720 / 667-792 / 530 of 844/844/640), NÆSTE visible (bottom 756/768, 832/844, 628/640) and focused every time. Before/after geometry identical (before run: same values).
- TTS: button 48x48, label "Lyt til sætningen", click -> exactly one speechSynthesis.speak with lang da-DK; focus ring from shared CSS. Screenshots (map, question, feedback, result, light+dark) viewed: pixel speaker crisp, badges neutral, results sprites consistent.
- `node smoke.mjs ../ordstilling-detektiv/index.html .casebtn`: Verdict PASS (all rows).
- grep: no ♪/▶ left in index.html or theme. Blocked-storage: smoke row PASS.
- Harness note: `page.click('.casebtn')` right after load is flaky (~50%, also on the pre-change file, game never starts so nextBtn click throws on null G); programmatic `.click()` is stable. Not a game defect observed in real use, but worth a look: `nextBtn.onclick` at index.html ~1127 throws if clicked with G=null.

## Files changed
index.html: link tags (~282-286), removed `.speaker` CSS (~246-253), `speakerBtn` (~806), rank/tier/lvl class names, back/map button text, result sprite scales. ordstilling.css: rank (~39), tier-pill (~53-57), removed `.lb-*`, removed `.speaker` rules (~195-200).

## Remaining risks
Level colour coding on the map is gone (levels distinguished by text only, per VIS-019). Result-screen pokal/stjerne are smaller (interim until a 32px pokal exists). Native review: none (no Danish content changed except button text "← TILBAGE").

## Newly discovered
`.casebtn.lvl` inline `.lb-*` classes remain as unused values in CASES data (`lvl:"lb-a1"`), harmless.

## Tables
US-029: TTS button shared class, 48x48, label, one speak da-DK, old CSS deleted, no ♪/▶: PASS. Glosekort ▶ marker: NA.
US-038: identity lup matches map: PASS; mode sprites: NA (text-only modes); result row one density: PASS (interim half-scale).
US-039: (a) .sd-gap: NA (tile builder, no blanks); (b) badges .sd-badge--panel: PASS; (c) selects: NA (none); (d) dark surface outliers: NA (not this game); (e) Idiomjæger: NA; (f) back wording "← TILBAGE": PASS.
