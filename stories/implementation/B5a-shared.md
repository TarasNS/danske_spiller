# B5a - shared building blocks (W-SHARED)

Status: IMPLEMENTED (shared files only; per-game adoption is Batch 5b)

## Summary
- NEW `shared/tts-button.css`: the one listen button (48x48 framed, pixel speaker from the Antonymer 8x8 path drawn as a CSS mask), small inline variant `.dc-tts-button--sm` (32px, 44px hit area via invisible `::after`, negative block margins keep the line rhythm), hover/active/focus/disabled, `.is-playing` / `[aria-pressed=true]` hook (the existing code has no playing state; the hook is CSS only), reduced-motion safe. Specificity is `:root:root .dc-tts-button.dc-tts-button` (0,4,0), so it beats the theme rules (`html.sd-page .target .dc-tts-button` 0,3,1) regardless of link order, no `!important` (only `transform:none !important` in the reduced-motion block).
- `shared/dansk-core.js` `ui.ttsButton(text, container[, label])`: default aria-label AND title "Lyt", optional 3rd arg custom label ("Lyt til sætningen"); no-voice state becomes `<label> (ingen dansk stemme ...)`. Class stays `dc-tts-button`, base style keeps min 44px. Inner emoji span unchanged (hidden by the new CSS; without the CSS nothing changes visually).
- NEW `shared/sd-extras.css`: `.sd-gap`, `.sd-badge.sd-badge--panel`, `select.sd-select` with pixel chevron (light/dark), `.sd-surface` / `.sd-surface--2`.
- Explainer: the only glyph was the FORKLARING/HJÆLP "▶" (`modal.js`); now an inline pixel-triangle SVG (4x7 grid, 2px/pixel, crispEdges). The player (`explainer.js/css`) already used pixel SVG icons and has no ▶/▼/arrow glyphs, so they and the skill template copies are unchanged (modal.* is not mirrored in templates).

## Decisions
- Gap: dashed 4px underline box (explainer `.xp-tile.is-gap` look), empty shows "?" (as Konjunktioner/Tidsmaskinen), `is-filled/is-ok/is-bad`. Replaces Forbindeord `_____`, Konjunktioner and Tidsmaskinen gaps. Bøjningsværkstedet's "·" is a table-cell filler, leave.
- Badge: `.sd-badge` ALREADY exists in sjovt.css (ink bg/cream text, `--orange`, `--cream`; the portal uses `sd-badge sd-badge--cream` for levels). Not redefined. Added `sd-badge--panel` (panel bg, text colour, line-colour frame). For levels use `sd-badge sd-badge--panel` or the existing `sd-badge--cream`; never green/red.
- `.sd-select` already exists in sjovt.css (white box); my `select.sd-select` rules (0,1,1) override bg/colour with panel tokens so dark works.

## Adoption snippets (per game)
```html
<link rel="stylesheet" href="../shared/sjovt.css">
<link rel="stylesheet" href="../shared/themes/<game>.css">
<link rel="stylesheet" href="../shared/tts-button.css">   <!-- after theme -->
<link rel="stylesheet" href="../shared/sd-extras.css">    <!-- only if the game uses gap/badge/select/surface -->
```
(root-level games: `shared/...` without `../`; `en og et/`: `../shared/...`.)
- TTS: `DanskCore.ui.ttsButton(text, el)` or `DanskCore.ui.ttsButton(text, el, "Lyt til sætningen")`; hand-made: `<button type="button" class="dc-tts-button" aria-label="Lyt"></button>` (no inner glyph needed; any inner text/span is hidden). Small inline: `class="dc-tts-button dc-tts-button--sm"`. Native games' own `speak()` onclick stays; just swap class/markup, remove ♪/▶ and local `.speaker`-style CSS.
- Gap: `<span class="sd-gap" role="img" aria-label="mellemrum"></span>`; filled: `<span class="sd-gap is-filled">word</span>`; result: add `is-ok` / `is-bad`.
- Badge: `<span class="sd-badge sd-badge--panel">B1</span>`.
- Select: `<select class="sd-select">` (keep own class too if needed).
- Dark surface: add `class="sd-surface"` on the outlier cards (Magiske Verber mode cards, Præpositioner mode cards, Dansk Mester first course card, Flashcards card) or use `background:var(--sd-panel);color:var(--sd-text);border-color:var(--sd-line)` in their theme; game colour as accent only.
- Theme rules a game worker must DELETE (they still lose visually, but are dead/confusing): `boejningsvaerkstedet.css:198-201`, `pronomenmysteriet.css:149-152` (+ `:108`), `tidsmaskinen.css:197-200` (+ `:121`), `adverbs.css:167`, plus ♪ `::before` rules in `idiomjaeger.css` (~171) and `dansk-mester.css` (~204). Documented in the tts-button.css header.

## ttsButton callers (grep)
- `boejningsvaerkstedet/index.html` 750, 880, 1066, 1178, 1279; `pronomenmysteriet/index.html` 478, 578; `tidsmaskinen/index.html` 981, 1012; `adverbs.html` 757-758 (wrapper `DanskCore.ui.ttsButton`); `dansk-core.js` quiz renderers 714, 781. All call with 2 args, so all now get "Lyt". Other games have their own speak buttons (not DanskCore).
- Existing test dependency: `tests/tidsmaskinen.mjs:304` requires a button label matching `/Afspil igen/` on the wrong-answer slip; it will now FAIL until the test is updated to "Lyt" (tests not mine to edit).

## Tests (scratchpad `impl/b5a/`)
- Test page with real sjovt.css + tidsmaskinen theme (still containing its old `▶` rule) + new CSS, light/dark, 360/1366: TTS button 48x48 (also for legacy `♪` / emoji-span markup, old `::before` ▶ overridden), sm 32x32 inline, paragraph line pitch unchanged at 25.6px (51.2px for 2 lines), select 48px high with `appearance:none`, gap shows "?", badges neutral, `.sd-surface` dark vs hard-coded white outlier. Screenshots viewed: pixel speaker crisp, focus ring and hover correct, chevron/gap/badge readable in dark.
- smoke (cwd tests): Bøjningsværkstedet PASS, Pronomenmysteriet PASS, Tidsmaskinen PASS (all rows); Adverbier: only the known legacy rows fail (`#btn-play` x4, "console clean + still playable" x3).
- With the new CSS NOT linked: in the 3 template games the button has label/title "Lyt", 48x48 (theme), 1 per screen, click calls `speechSynthesis.speak` once (spied), no console errors.
- Explainer on Tidsmaskinen, Præpositioner, En/Et at 360x740 and 1366x768: button 44px high (77x44 / 127x44), svg 7 rects crispEdges, no ▶ text (`textContent` has no U+25B6), opens, steps reach `__explainerDone=true`, Esc closes, events `open,close` once each, HJÆLP visible <=420px / FORKLARING above, 0 console errors. Triangle viewed at 10x: clean pixel stairs. (Game-side timer pause on `explainer:open` is unchanged game code; event emission verified.)

## Files changed
- `shared/tts-button.css` new (65 lines); `shared/sd-extras.css` new (54 lines)
- `shared/dansk-core.js` ~605-628 (`ttsButton` signature/label/title; also the voice-state label)
- `shared/explainer/modal.js` ~205-210 (PLAY_ICO + button markup); `shared/explainer/modal.css` one line after `.xpm-btn:focus-visible`-block (`.xpm-btn .xpm-ico`)
- Frozen files and `.claude/skills` untouched; no git state changes; no test files left in the repo.

## Remaining risks
- Until per-game workers delete theme `::before` rules, those themes carry dead rules (overridden). Games with their own `.dc-tts-button` CSS at higher specificity (e.g. `#id .dc-tts-button`) would still win: check on adoption.
- Hover lifts the button 2px (like `.sd-btn`); inside tight rows verify no clipping.
- sm button frame (2px) slightly overlaps neighbouring lines on narrow wraps; acceptable per VIS-025 intent, check on Idiomjæger.
- Native speech/Android untested; no-voice state still uses inline `opacity:.5`.

## Newly discovered
- `tests/tidsmaskinen.mjs:304` hardcodes "Afspil igen" (see above).
- My first edit of `dansk-core.js` corrupted the file (wrong index match); I restored it from `git show HEAD:` and redid it; final diff is 8 added / 4 removed lines, verified.

## Retry (W-SHARED, narrowed): `shared/sd-extras.css` only
Changes
1. `.sd-gap`: `color: inherit` -> `color: var(--sd-text, #101010)` (all states inherit it). Gap text no longer depends on the parent's colour (Tidsmaskinen `.target` hard-codes `#101010`).
2. `select.sd-select` rules now use `:root:root:root select.sd-select` (0,4,1; dark variants `:root:root[data-theme="dark"]` / `:root:root:not([data-theme="light"])` also 0,4,1 and later in the file), no `!important`. It beats `html.sd-page select` (0,1,2). `:disabled` now `opacity:1` with `--sd-panel-2` background and `--sd-text-soft` text (no more faded 0.6).
Tests (scratchpad `impl/b5a2/t.mjs`, real sjovt.css + theme + tts-button.css + sd-extras.css; Edge; screenshots viewed)
- Gap text/background contrast, empty/filled/ok/bad, inside `.target`: Tidsmaskinen light 15.89/15.89/15.47/13.89, Tidsmaskinen dark 15.89/15.89/15.47/13.89 (theme keeps light panel-2 there, dark text on it), Idiomjaeger dark 9.66/9.66/11.57/13.75, Dansk Mester dark 10.69, Praepositioner dark 9.68 (all >= 4.5).
- `select.sd-select` (appearance:none, 48px high, padding-right 44px, chevron background-image from `.sd-select`): Tidsmaskinen, Idiomjaeger, Praepositioner light+dark OK; enabled ratios 12.3-17.9, disabled 6.7-10.5 (was ~opacity .6). Idiomjaeger dark: previously white with chevron missing/overlaid, now dark panel with cream chevron. Badge (`sd-badge--panel` 12.3-17.9) and `.sd-surface` unchanged.
- `git diff HEAD --stat -- shared/sjovt.css shared/sjovt.js index.html`: empty.
Theme `select` rules found (grep)
- `idiomjaeger.css:107,113` (`html.sd-page select`, no !important): now loses to `.sd-select`; dead, may be deleted by the game worker (the `:disabled` rule 113 also loses).
- `dansk-mester.css:142-145` (`html.sd-page select` WITH `!important` on background/color/border/radius/padding/font): still WINS (white, no chevron, verified). Game worker must delete/relax these !important declarations.
- `praepositioner.css:71-74` (`html.sd-page #lvlSel` with `!important`, id selector): still WINS. Game worker must delete it (and keep label rule).
- Other hits (`adverbs.css:114`, `antonyms.css:174`, `.selected` classes) are not select elements. No other theme styles `select`.
Status: IMPLEMENTED (shared CSS); per-game theme cleanup required for Dansk Mester and Praepositioner before `.sd-select` shows there.
