# VERIFY-B5a - shared building blocks (V5a)

Scope: NEW shared/tts-button.css, NEW shared/sd-extras.css, shared/dansk-core.js (ttsButton), shared/explainer/modal.js + modal.css. Per-game adoption is Batch 5b (not judged here). Scripts/screenshots: scratchpad `impl/v5a/`.

## Per-criterion table (shared parts only)

| Criterion | Result | Evidence |
|---|---|---|
| US-029: One shared speaker sprite or icon (base: Antonymer 8x8 path), rendered via `DanskCore.ui.ttsButton` / `.dc-tts-button` | PASS (shared part) | `tts-button.css` mask path `M0 3h2V2h1V1h1v6H3V6H2V5H0zM5 2h1v1H5zM6 3h1v2H6zM5 5h1v1H5z` is identical to `speakerBtn` in danish-antonyms-game.html:939. Computed `::before` content `""` 24px with mask on every test. Screenshots: crisp pixel speaker light+dark. |
| US-029: All 14 games use it; grep finds no ♪ or ▶ used for TTS | NOT VERIFIED | Batch 5b. Theme `::before "▶"` rules still in boejningsvaerkstedet/pronomenmysteriet/tidsmaskinen.css (dead, overridden) |
| US-029: aria-label "Lyt" (or "Lyt til sætningen"), >=44x44, visible focus ring | PASS | Template games + Adverbier: label and title "Lyt", 48x48 (Adverbier 44 -> 48 with css linked in a scratchpad copy). Custom 3rd arg gives "Lyt til sætningen". No-Danish-voice path (forced en-US voice list): "Lyt (ingen dansk stemme fundet på denne enhed)" / title "Ingen dansk stemme..." / opacity .5, reads sensibly. Focus ring 4px blue (light) visible in screenshot (sm and 48px). |
| US-029: VID/UI harness no regressions in tap-target/focus | PASS | smoke: Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen full PASS (exit 0). Adverbier: only legacy rows (4x `#btn-play`, dark/light/reduced-motion "console clean + still playable"). |
| US-039: Selects use `appearance:none` with a pixel chevron | PASS (shared part) | computed `appearance:none`, 48px high, pixel chevron light+dark with Tidsmaskinen/Bøjningsværkstedet themes. FAILS to win against idiomjaeger theme (see issues). |
| US-039: A single `.sd-gap` style used in the 4 games | PASS (shared part) / adoption NOT VERIFIED | empty "?" dashed, filled, ok, bad all render. Colour issue below. |
| US-039: Level badges use `.sd-badge`; green/red reserved for feedback | PASS (shared part) | `.sd-badge.sd-badge--panel` neutral, follows tokens in dark. Existing `.sd-badge` not redefined. |
| US-039: One documented dark-surface rule applied to the 4 outlier games | PASS (rule exists, documented) / application NOT VERIFIED | `.sd-surface/--2` dark in tidsmaskinen + idiomjaeger dark themes. |
| US-039: Idiomjæger inline TTS uses the small variant | PASS (shared part) / adoption NOT VERIFIED | `.dc-tts-button--sm` 32x32, `::after` 44x44 hit area, paragraph height unchanged vs text-only look; viewed. |
| US-039: CDP platform-font check shows no system fallback for the explainer ▶ | PASS | modal.js now inline SVG (7 rects, 8x14, crispEdges); no U+25B6 in `.xpm-btn` text at 3 viewports x 4 games; grep of shared/explainer/*.js,*.css finds no ▶ ▼ ← glyph text. Zoomed screenshots crisp. |
| US-039 other criteria (bar arrow/back control, portal, results, grid) | NOT VERIFIED | Not in B5a scope |

## Check details
1. dansk-core.js diff limited to ttsButton (label default "Lyt", optional 3rd arg, title, voice-state label); `node --check` ok. Callers: Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen, Adverbier each: one button, label "Lyt", click -> exactly one `speechSynthesis.speak` with lang da-DK, no console errors. Confirmed: `tests/tidsmaskinen.mjs:304` requires `/Afspil igen/` against `aria-label|text` of the slip buttons (line 76) -> it will now FAIL (only occurrence in tests). Not edited.
2. tts-button.css: tested over real sjovt.css + themes tidsmaskinen, boejningsvaerkstedet, adverbs, idiomjaeger, light/dark, 360/1366. 48x48, sm 32x32 with 44x44 `::after`; legacy markup (emoji span, "♪" text) hidden; normal/hover/focus/disabled/is-playing/aria-pressed all distinct; theme `::before` "▶"/old backgrounds overridden (specificity 0,4,0, only `transform:none !important` in reduced-motion). Tokens with fallbacks used. Adoption snippet applied to scratchpad copies of tidsmaskinen/index.html (template) and adverbs.html (legacy): 48x48, mask speaker, click -> da-DK, zero console errors, light and dark.
3. sd-extras.css: no conflicting redefinition: `.sd-gap`, `.sd-surface` absent from sjovt.css; `.sd-badge` only extended with a new modifier; `.sd-select` (sjovt.css:189, white bg) overridden by `select.sd-select` for bg/colour/appearance only.
4. Explainer: Tidsmaskinen (10 scenes), Præpositioner (3), En/Et (3), Pronomenmysteriet (6) at 360, 390, 1366: button 44px high (77x44 HJÆLP at <=420, 127x44 FORKLARING above), 7 rects, no ▶ text, label "Hjælp: se en forklaring", opens with focus on close, `__explainerDone` true, Esc closes and focus returns to `.xpm-btn`, events `explainer:open`,`explainer:close` once each, zero console errors, chooser intact. Timer pause: En/Et speed round "Tid: 59" held at 59 for 4 s with modal open, resumes after close; Tidsmaskinen timed mode "19 s" held for 4 s, resumes.
5. Frozen files: `git diff HEAD --stat -- shared/sjovt.css shared/sjovt.js index.html prd.md` empty. No stray files left by me (status differences are other workers' files).

## Issues / risks
- MEDIUM `.sd-gap` uses `color: inherit` with a token background. Tidsmaskinen's `.target` is cream with hard-coded `#101010` text in dark mode (tidsmaskinen.css:120), so a gap inside it in dark is dark text on dark panel-2 (unreadable, seen in screenshot, also filled/ok/bad). Fix: set `color: var(--sd-text)` (and keep the sentence card surface tokenised) or give gaps their own colour.
- MEDIUM `select.sd-select` (0,1,1) loses to game themes that style bare `html.sd-page select` (0,1,2), e.g. idiomjaeger.css:107-113: in dark the select stays white with a checker pattern showing through (seen). Adopting games must remove those theme select rules or specificity must be raised.
- LOW disabled TTS (`#CFC6AA`/`#5b5646`) and hover colour `#101010` are hard-coded (same as `.sd-btn:disabled` in sjovt.css); in dark mode the disabled button is a light beige tile. Consistent with sjovt, acceptable.
- LOW disabled select in dark is grey with low-ish contrast (opacity .6).
- LOW games with their own `#id .dc-tts-button` CSS will win; theme dead rules (listed in tts-button.css header) must be deleted in 5b. Adverbs theme `.tts-row .dc-tts-button` rule (44px) is overridden (now 48).
- LOW hover lifts 2px; check clipping in tight rows. sm button frame slightly overlaps neighbouring lines.
- INFO `.is-playing` is a CSS hook only; ttsButton never sets it.
- INFO My adverbs test page showed horizontal scroll at 360 (test page layout with theme, not the game); not investigated, smoke on the real game shows no overflow row failing.
- No scope creep: dansk-core.js diff is 8 added/4 removed lines, all in ttsButton; modal.css one line.

Verification: NOT VERIFIED - all shared-part criteria PASS (with the two MEDIUM adoption risks above), but US-029/US-039 criteria requiring per-game adoption (14 games, 4 gap games, 4 outlier surfaces, Idiomjæger inline) are Batch 5b, and tests/tidsmaskinen.mjs:304 needs updating to "Lyt".
