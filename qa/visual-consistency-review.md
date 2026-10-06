# QA Agent 5: Visual system and cross-game consistency review

Date: 2026-10-04. Scope: the portal plus 15 game pages (16 files in total). This was a read-only review. No production file was changed.

`$S` = `C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\qa-visual\` (screenshots and scripts).

## 1. Method

1. I read `CLAUDE.md`, `docs/redesign/AGENT-BRIEF.md`, `TEST-REPORT.md`, `reports/pronomen-data.md`, `shared/sjovt.css`, `shared/sjovt.js` (full sprite library), `shared/explainer/*` (css, js, `monitor.svg`), the 14 theme files and the portal `index.html`.
2. **Fresh renders** in headless Chrome (local install, puppeteer-core from `tests/node_modules`, `file://`):
   - `audit.cjs`: every page at 1440×900 light and at 390×844 dark, on the start screen and after clicking "Spil/Start". For every visible text element it extracts the computed `font-family`. It also reads the font Chrome actually rendered with, via CDP `CSS.getPlatformFontsForNode`. It also collects emoji and symbol glyphs (text and `::before/::after`), non-zero `border-radius`, blurred shadows, gradients, images, inline SVGs, sprite names and scales, the background and text colour inventory, computed button styles, and whether the bar, explainer, theme, mute and TTS controls are present. Output: `$S\audit.json`, `$S\summary.txt`, `$S\<game>-<vp>-<scheme>-start|play.png`.
   - `drive.cjs`, `results.cjs`, `mester2.cjs`: drive each game to an answered question and, where possible, to its results or badge screens (`$S\fb\`, `$S\res\`).
   - `tts.cjs`: TTS button glyph, font and size per game (`$S\tts\`). `probe.cjs`: geometry of the shared bar and body. `crops.cjs` and `xp.cjs`: element crops at 2× (`$S\crops\`), including the explainer modal in light and dark.
   - Contact sheets: `$S\sheet-mobile-dark-start.png`, `sheet-fresh-fb.png`, `sheet-fb-after.png`, `sheet-results.png`. `sheet-old-*.png` is built from `docs/redesign/screenshots`. Those shots are **stale**: they still show mustard fields from before the per-game colouring, and some have English UI. I used them only as historical reference.
3. Source greps: emoji and symbol inventory across all HTML, JS and CSS (`$S\emoji.cjs`), TTS helpers, auto-advance timers, and mute and theme controls.
4. Limits: headless Chrome has no audio or TTS, so the sound findings rest on code. Most fresh renders were made with `prefers-reduced-motion: reduce` so the preloader would not cover the page. Pronomenmysteriet currently runs on placeholder data (see §6).

## 2. Design-system baseline (what the shipped code actually does)

| Area | Baseline derived from `shared/sjovt.css` / `sjovt.js` / themes |
|---|---|
| Fonts | `--sd-font-display` **and** `--sd-font-body` are both "SD Mono", which is local JetBrains Mono 400/700 (latin and latin-ext). `--sd-font-logo` is "SD Pixel", local Press Start 2P, used only for the wordmark and the portal H1. **There is no Pixelify Sans file in `shared/fonts/`**, even though the brief names it (VIS-027). Result: every page renders HTML text in JetBrains Mono (web font). No game's legacy font (Georgia, EB Garamond, Cinzel, Orbitron, Fredoka, Baloo 2, Special Elite, Nunito, Trebuchet) renders in HTML text. The exceptions are glyph fallbacks (VIS-008), SVG `<text>` (VIS-001) and `pixel-animation.html` (VIS-026). |
| Colour | Brand tokens: `--sd-ink #101010`, `--sd-paper #FFF4D6`, `--sd-orange #F94F37`, `--sd-cream #FFC25A`, `--sd-mustard #E1AD12`, `--sd-green #148A3C` (ok), `--sd-pink #D4145A` (bad), `--sd-blue #2B3FD6` (focus). **Per-game colour system** (every theme file starts with `GAME COLOUR … --game`): each theme remaps `--sd-orange`, `--sd-primary`, `--sd-cream`, `--sd-bg` and `--sd-panel` to that game's portal-card colour. So the mustard field and the orange primary apply only on the portal. Dark mode: `#1x1x1x` field, dark panels, game-coloured `--sd-line`. Pronomenmysteriet and Tidsmaskinen add "mood" palettes (navy and paper). |
| Frames and shadows | 4px notched frame drawn with 4 hard box-shadows (`--sd-box`), 8px hard drop shadow (`--sd-drop`), button bevel plus a 12px base. No radius, no blur, no gradients except pixel stripes and grid lines, motion with `steps()`. The audit confirmed **0 rounded elements and 0 blurred shadows in all 14 games**. The portal has 1 rounded element (VIS-015). |
| Buttons | `.sd-btn`: uppercase mono 700, frame, bevel and base, cream on hover, 48px min height. In practice the games restyle their own buttons to the same frame, which gives a consistent look. |
| Shared chrome | `.sd-bar`: sticky, full width, ink background, 4px game-coloured bottom border, "← MENU" link, and the Pølle sprite plus the SJOVT DANSK wordmark. It renders **56px** tall while `--sd-bar-h` is 48px (VIS-023). The explainer entry button is injected into the bar by `shared/explainer/modal.js`. |
| Sprites | `Sjovt.spriteSVG`: rect-per-run SVG with `crispEdges`. There are two families. (a) 16px-class sprites (polle, snegl, molle, cykel, stjerne, hjerte, pokal, hat, flag): flat, 1px K outline, no shade ramp. (b) 32px game icons (modsat, kort, tryllestav, pin, snak, terning, slik, lup, net, kiste, tandhjul, ur, bog, tidsstjerne): shade ramps, lit from the top left, **drawn at half the requested scale** (`sjovt.js:619`). The two families have different pixel densities (VIS-004). |
| Feedback (shared) | `.sd-fb--ok/--bad` with ✓/✗ glyph boxes. `Sjovt.fx.correct/wrong/bump/celebrate`. Feedback is never colour-only: every game observed shows ✓/✗ and text. |

## 3. Icon and sprite inventory

| Source type | Where | Style verdict |
|---|---|---|
| Sjovt sprites, 32px shaded game icons | Portal cards (scale 7, drawn at 4), game headers | Consistent with each other: 1px outline, 3-tone ramp, hard pixels. Reference quality. |
| Sjovt sprites, 16px flat set | Mode cards in Magiske Verber, Idiomjæger, Præpositioner, Antonymer and Dansk Mester (modes and badges); stat chips; results (pokal, stjerne) | Flat, no ramp, 4px pixels next to the 2px pixels of the 32px icons (VIS-004). Reused with arbitrary meanings (VIS-005). |
| Sjovt sprite `ur` used as the Tidsmaskinen identity | `tidsmaskinen/index.html:158,164` | Wrong icon: it duplicates Adverbier's icon (VIS-006). |
| Inline vector SVG (rounded rects, 2px gold strokes, Cinzel `<text>`) | `en og et/index.html:304-346` (8 mode icons), `:366-374` (emblems) | **Modern vector line icons**, left over from before the reskin (VIS-001). |
| Inline pixel SVG speaker (8×8 path) | `danish-antonyms-game.html:917` | Pixel style, but the only game with a real speaker icon (VIS-009). |
| Explainer pixel pictograms (play, pause, step, restart, speaker, check, x) | `shared/explainer/explainer.js:16-24` | Pixel style, monochrome, consistent within the explainer. |
| `monitor.svg` (48×40 pixel art, grey ramp) | Explainer modal frame | Right style, but very large pixel scale (VIS-014). |
| Inline SVG Game Boy (64×104, `crispEdges`) and CSS clouds (box-shadow pixel art) | `index.html:167-193`, `:92` | Consistent pixel art. Portal only. |
| Canvas pixel art (own palette, 8×10 hero) | `pixel-animation.html` | Separate purple palette, not part of the skin (VIS-026). |
| Emoji that render at runtime | Idiomjæger: badges 🥇🗺🧭👑🔍🔥🎯🎓🇩🇰 (the flag shows as "DK" on Windows); "Serie 🔥"; feedback "🪙 +10"; results 💪 💰 🔁; toasts 🏆. Dansk Mester: stats "🔥 Bedste serie"; "🎓 CEFR-NIVEAU" | Colour emoji, a foreign visual language (VIS-002, VIS-003). |
| Emoji in source, hidden or replaced by CSS or sprites | `dc-tts-button` 🔊 (font-size 0, `::before`); Idiomjæger `.speaker` 🔊; Magiske `ico`/`sym` emoji (sprites used instead); Idiomjæger 🏹🎣 etc. in mode titles (hidden) | OK where hidden. Dansk Mester result headlines 🌟🎉👍💪 (`dansk-mester.html:1157`) and Præpositioner `MODES[].e` ✏️🎯🧲… (`:827-836`): **UNCONFIRMED** whether these render (screens not reached). |
| Unicode symbols used as icons | ← (bar), ⟵ / ⟶ (Idiomjæger), ‹ (Dansk Mester, Magiske), ✕ (template close), ▶ (explainer, TTS, flashcard list), ♪ (TTS), ▼ (portal), → (cards, "Spil →"), ◆ (Forbindeord lives), ♥/♡ (Ordstilling), ○ (chips), ✓/✗ (feedback), ♠♥♦♣ (flashcard card corners) | Mostly rendered in JetBrains Mono, but arrows fall back to system fonts (VIS-008). There are 4 different back arrows (VIS-017). |
| Raster images | None (`<img>` count 0 on all pages) | n/a |

## 4. Per-game reskin conformity matrix

Legend: ✓ conforms · ✗ deviates · — not applicable. "Auto-adv" means a correct answer auto-advances, per the timers found in code.

| Page | sjovt css+js | Theme file | Bar full-width | Explainer btn | Per-game palette | HTML fonts = SD | Identity sprite = portal card | Icon issues | Mute ctrl | Theme toggle | TTS glyph | Auto-adv |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Portal `index.html` | ✓ | — | — (home, no bar) | — | mustard (reference) | ✓ (+ Press Start H1) | — | ✗ VIS-015/016 | — | MØRK/LYS (not persisted) | — | — |
| adverbs | ✓ | ✓ | ✓ | ✓ | blue | ✓ | ✓ `ur` | — | ✗ none | own "LYS / MØRK" | ✗ **none** | none found |
| magiske_verber | ✓ | ✓ | ✓ | ✓ | purple | ✓ | ✓ | ✗ VIS-004/005 | ✗ | ✗ | ▶ | 750 ms |
| idiomjaeger | ✓ | ✓ | ✓ | ✗ none | sea green | ✓ (⟵ in Cambria Math) | ✓ | ✗ **emoji** VIS-002 | ✗ | ✗ | ♪ | manual |
| dansk-praepositioner | ✓ | ✓ | ✓ | ✓ | ice blue | ✓ | ✓ | ✗ VIS-004/005 | ✗ | ✗ | ▶ | manual |
| danish-antonyms-game | ✓ | ✓ | ✓ | ✗ none | coral | ✓ | ✓ | ✗ VIS-004/005 | in Settings | ✗ | pixel speaker | manual |
| boejningsvaerkstedet | ✓ | ✓ | ✓ | ✓ | pink | ✓ | ✗ header `molle` + panel `tandhjul` (VIS-022) | — | LYD | MØRK | ▶ | 800 ms |
| danish_flashcards | ✓ | ✓ | ✓ | ✗ none | yellow | ✓ | ✓ | — | ✗ | ✗ | ▶ (aria "Pronounce") | 1200 ms |
| dansk-mester | ✓ | ✓ | ✓ | ✗ none | mandarin | ✓ | ✗ header `flag`, card `snak` | ✗ emoji VIS-003, overflow VIS-025 | ✗ | ✗ | ♪ | UNCONFIRMED |
| en og et | ✓ | ✓ | ✗ **inset** (body padding) | ✓ | green | ✓ (SVG text: serif fallback) | ✓ | ✗ **vector icons** VIS-001 | ✗ | ✗ | ♪ | manual |
| forbindenor | ✓ | ✓ | ✓ | ✓ | lime | ✓ | ✓ | — | ✗ | ✗ | ♪ | manual |
| konjunktioner | ✓ | ✓ | ✗ **inset** (body padding) | ✓ | lavender | ✓ | ✓ | — | ✗ | ✗ | ♪ | manual |
| ordstilling-detektiv | ✓ | ✓ | ✓ | ✓ | magenta | ✓ | ✓ | ✗ VIS-020 | ✗ | ✗ | ♪ | manual |
| pronomenmysteriet | ✓ | ✓ | ✓ | ✓ | gold + navy | ✓ | ✓ `bog` | VIS-022 (duplicate title) | LYD | MØRK | ▶ | 800 ms |
| tidsmaskinen | ✓ | ✓ | ✓ | ✓ | cyan + navy | ✓ | ✗ `ur` vs `tidsstjerne` (VIS-006) | — | LYD | MØRK | ▶ | 800 ms |
| pixel-animation | ✗ | ✗ | ✗ no bar | ✗ | own purple | ✗ Consolas | — | ✗ VIS-026 | — | — | — | — |

## 5. Findings

Format: **Component/Icon → Location → Inconsistency → Evidence → Suggested replacement**.

### VIS-001: Major: En/Et mode and emblem icons are vector line art from before the reskin
- **Location:** `en og et/index.html:304-346` (8 mode-card icons), `:366-374` (emblems).
- **Inconsistency:** Smooth vector icons with `rx` rounded rects, circles and Bézier paths, 2px gold `#c79a3a` strokes, and SVG `<text>` in `Cinzel Decorative`, a font that is not loaded and falls back to the system serif. The audit reports 13 SVGs on this page but only 2 are Sjovt sprites. This is the only game whose menu icons are not pixel art. The look is the old "Wonderland" style and conflicts with the 1px-outline pixel sprites everywhere else.
- **Evidence:** `$S\enet-desktop-light-start.png` (icons left of each mode card), `$S\sheet-mobile-dark-start.png` (enet tile).
- **Suggested replacement:** 32px Sjovt sprites in the shared shaded style. For example, reuse `terning` for "En eller et?", and draw new `bestemt`, `flertal`, `gaade`, `spejl`, `tvilling` sprites on the 32px grid with the K outline and the light-top-left ramp. Remove the SVG `<text>`.

### VIS-002: Major: Idiomjæger shows colour emoji as icons
- **Location:** `idiomjaeger.html:666-674` (badge icons), `:688` ("Serie 🔥"), `:854` ("🪙 +10"), `:856`/`:676` (🏆 toasts), `:868-875` (result line 🎓/🏴‍☠️/💪, "Guld: 💰", "Spil igen 🔁"), `:1093` and others.
- **Inconsistency:** The OS emoji font (Segoe UI Emoji) supplies full-colour, smooth, rounded glyphs on the badges screen, in feedback, on the results screen and in toasts. On the badges screen locked badges are greyscale-filtered emoji, and 🇩🇰 renders as the plain letters **"DK"** on Windows. The same game uses `stjerne` for gold and `pokal` on results, so two icon languages share one screen.
- **Evidence:** `$S\res\idiom-badges.png`, `$S\res\idiom-results.png` (💪 💰 🔁 🏆), `$S\idiom-desktop-light-start.png` (🔥 after "Serie"), `$S\fb\idiom-3.png` ("Stort fund! 🪙 +10").
- **Suggested replacement:** Map badges to sprites the way Dansk Mester already does (`pokal`, `stjerne`, `flag`, `kiste`, `lup`). Use a `stjerne` sprite (scale 2) for gold and coins, and a dedicated `flamme` sprite (new, 16px) for the streak. Remove the emoji from button labels and the result text.

### VIS-003: Minor: Dansk Mester still has emoji and two icons for "streak"
- **Location:** `danske-phraser/dansk-mester.html` stats card "Bedste serie" (🔥, `:1227`); CEFR label 🎓 (`:850`); result headlines `:1157` (🌟🎉👍💪, **UNCONFIRMED** on screen); header streak counter rendered with the `molle` sprite.
- **Inconsistency:** The header shows the streak as a windmill sprite, while the stats page shows it as the 🔥 emoji. The badges screen converts emoji to sprites, but the stats page does not.
- **Evidence:** `$S\res\mester-stats.png` (🔥), `$S\res\mester-path.png` (🎓 before "CEFR-NIVEAU"), `$S\mester-desktop-light-start.png` (molle counter).
- **Suggested replacement:** Use one streak sprite (the same new `flamme` as VIS-002) in the header and the stats. Remove 🎓 and the headline emoji.

### VIS-004: Major: The sprite library mixes two pixel densities and two rendering styles
- **Location:** `shared/sjovt.js:27-126` (16px flat set) vs `:128-601` (32px shaded set); `:619` halves the scale for 32px icons. Visible on the mode menus of Antonymer, Magiske Verber, Præpositioner and Idiomjæger, on Dansk Mester modes and badges, and in stat chips.
- **Inconsistency:** On the same card row, a 32px icon at `data-scale=4` is drawn with **2px pixels**, but a 16px sprite at the same scale is drawn with **4px pixels**. The 32px icons have a 3-tone shade ramp, lit from the top left. The 16px sprites are flat (hjerte, pokal, cykel as outline-only line art, hat). Outline weight therefore differs visibly (2px vs 4px black), and detail level and visual weight jump between neighbouring cards. Example: the Antonymer row "modsat (2px) | snegl (4px) | molle (4px) | cykel (4px outline-only)".
- **Evidence:** `$S\crops\antonym-icons.png`, `$S\antonyms-desktop-light-start.png`, `$S\magiske-desktop-light-start.png`, `$S\praep-desktop-light-start.png`, `$S\res\mester-badges2.png`.
- **Suggested replacement:** Pick one density per context. Either redraw the 9 generic sprites on the 32px grid with the same ramp and 1px outline (so the 32px rule applies to them), or render 32px icons at full scale and never mix the two sizes in one row. `cykel` in particular needs fill and shading.

### VIS-005: Minor: Generic sprites carry different meanings in different games
- **Location:** Mode cards: `magiske_verber.html:723,735`; `idiomjaeger.html` mode grid; `dansk-praepositioner.html` modes; `danish-antonyms-game.html` mode cards; Dansk Mester badges and counters.
- **Inconsistency:** `hat` means "Verbalarenaen" (Magiske Verber), "Find fejlen" (Præpositioner), "Øv efter sværhedsgrad" (Antonymer) and "Verbernybegynder" (Dansk Mester). `molle` means "Sætningsværkstedet", "Lærings-tilstand", "Omvendt oversættelse", "7 dage i træk" and the streak counter. `snegl` means "Tidsmaskinen", "Find par", "Ret sætningen" and "3 dage i træk". `pokal` means "Øv efter emne" in Antonymer but "results" elsewhere. `flag` means "Verbumdetektiven" and "Oversættelse". Icons therefore carry no transferable meaning between games.
- **Evidence:** The start screenshots of the games listed above, and `$S\res\mester-badges2.png`.
- **Suggested replacement:** Define a small semantic icon map shared by all games (e.g. quiz, typing, pairs, speed, review, translation, error-hunt, stats), each with its own sprite, and use it in every mode menu.

### VIS-006: Minor: Tidsmaskinen uses Adverbier's identity icon
- **Location:** `tidsmaskinen/index.html:158,164` (`data-sd-sprite="ur"`); portal `index.html:263` (Adverbier → `ur`), `:267` (Tidsmaskinen → `tidsstjerne`).
- **Inconsistency:** The portal card and the game header show different icons, and two games share the same header icon.
- **Evidence:** `$S\tids-desktop-light-start.png` vs `$S\adverbs-desktop-light-start.png`, `$S\portal-desktop-light-play.png`.
- **Suggested replacement:** `data-sd-sprite="tidsstjerne"` in both Tidsmaskinen header slots.

### VIS-007: Minor: The shared MENU bar is inset in En/Et and Konjunktioner
- **Location:** The game's own body styles: `en og et/index.html` (body `padding:20px 12px 56px`) and `konjunktioner/konjunktioner.html` (body `padding:20px 14px 40px`). The bar is injected inside `body`.
- **Inconsistency:** The bar sits at x=12/14, y=20 with width 1256/1252 instead of 0/0/1280. The page grid shows above and beside it, unlike the other 12 games.
- **Evidence:** `$S\probe.cjs` output (`bar {x:12,y:20,w:1256}` / `{x:14,y:20,w:1252}`), `$S\enet-desktop-light-start.png`, `$S\konj-desktop-light-play.png`.
- **Suggested replacement:** In the theme files, `html.sd-page body{padding:0}` and move the padding onto the game wrapper. Or give `.sd-bar` negative margins equal to the body padding.

### VIS-008: Minor: Arrow glyphs in the shared chrome render with system fallback fonts
- **Location:** `shared/sjovt.css:16-27`. The `SD Mono` unicode-range includes U+2191 and U+2193 but not **U+2190 (←)**, U+25B6 (▶), U+25BC (▼), U+27F5/27F6 (⟵ ⟶).
- **Inconsistency:** CDP platform fonts: `.sd-bar a` = "Cascadia Mono (sys): 1 glyph + JetBrains Mono (web): 5" on all 14 games. The explainer button reports Cascadia Mono for ▶. Idiomjæger "⟵ JAGTMENU" reports **Cambria Math (sys)**. The portal "Vælg spil ▼" reports Cascadia Mono. The arrows come out thinner and lower than the bold mono label, and they will differ by OS (Menlo, DejaVu…).
- **Evidence:** `$S\summary.txt` (platform lines), `$S\crops\bar.png`, `$S\crops\idiom-back.png`.
- **Suggested replacement:** Use a pixel-SVG arrow (like the explainer `pix()` icons) for "← MENU" and other back controls. Otherwise check whether the bundled JetBrains subset contains these glyphs and extend the `unicode-range`.

### VIS-009: Major: The TTS replay button has four visual languages, and ▶ is overloaded
- **Location:** `konjunktioner.html:736`, `Forbindenor.html:685`, `ordstilling-detektiv/index.html:810`, `en og et/index.html:894`, `themes/idiomjaeger.css:171`, `themes/dansk-mester.css:204` → **♪**. `magiske_verber.html:800`, `dansk-praepositioner.html:767`, flashcards `script.js:263`, `themes/boejningsvaerkstedet.css:200`, `themes/pronomenmysteriet.css:144`, `themes/tidsmaskinen.css:140` → **▶**. `danish-antonyms-game.html:917` → **pixel speaker SVG**. The explainer uses its own pixel speaker. **adverbs.html: no TTS button at all**: "Lyt og vælg" (`:905-911`) only shows the text, then hides it.
- **Inconsistency:** The same control looks different in nearly every game. ▶ also means "play explainer" (FORKLARING button, `modal.js:163`) and "current card" in the flashcard list, so the same glyph has three meanings. Fill varies too: game-cream in most games, navy ink in Pronomenmysteriet and Tidsmaskinen. Accessible names vary: "Udtal", "Udtal ordet", "Udtal sætningen", "Lyt til sætningen", "Afspil igen", and English "Pronounce" in Antonymer and the flashcards.
- **Evidence:** `$S\tts\*.png`, the `tts.cjs` console output (glyph, `::before`, font, bg per game), `$S\fb\konj-2.png` (♪) vs `$S\boejn-desktop-light-play.png` (▶).
- **Suggested replacement:** One shared pixel speaker sprite (the Antonymer 8×8 path is a good base), one 48×48 framed button style, and one Danish label ("Lyt"). Keep ▶ only for the explainer. Add a TTS button to Adverbier.

### VIS-010: Major: Answer-feedback behaviour differs between games
- **Location:** Auto-advance timers: `boejningsvaerkstedet/index.html`, `pronomenmysteriet/index.html`, `tidsmaskinen/index.html` (`setTimeout(advance, 800)`), `magiske_verber.html` (750 ms), flashcards `script.js` (1200 ms). No advance timer was found in Idiomjæger, Præpositioner, Antonymer, En/Et, Forbindeord, Konjunktioner, Ordstilling or Adverbier. Dansk Mester is UNCONFIRMED. Sound effects exist only in the three DanskCore-template games (no `AudioContext`/`Audio` in the other 11).
- **Inconsistency:** A correct answer auto-advances in 5 games but needs a manual click in about 8. Some games show congratulatory text, others show nothing: Konjunktioner "✓ RIGTIGT!", Idiomjæger "✓ RIGTIGT" plus "Stort fund! 🪙 +10", Antonymer "RIGTIGT!" vs nothing in the template games (prd.md: "no congratulatory text"). The continue control is labelled "NÆSTE →", "NÆSTE »", "VIDERE" or "FORTSÆT →", in different positions and colours. Captured with reduced motion. Over ~1.85 s none of the manual-advance games moved on.
- **Evidence:** `$S\sheet-fresh-fb.png`, `$S\sheet-fb-after.png`, `$S\fb\konj-2.png`, `$S\fb\idiom-3.png`, timer greps (§1).
- **Suggested replacement:** One shared feedback contract, ideally as a `Sjovt`/`DanskCore` helper. Correct: `fx.correct` plus a sound plus 800 ms auto-advance, no text. Wrong: `.sd-fb--bad` panel with the answer, a note, TTS, and one "Næste" button in the same place and style.

### VIS-011: Major: Utility controls (mute, theme, explainer) are inconsistent across games
- **Location:** Mute: a header "LYD" toggle in Bøjningsværkstedet, Pronomenmysteriet and Tidsmaskinen; a Settings switch in Antonymer (`danish-antonyms-game.html:833`); nothing in the other 10. Theme: portal "MØRK/LYS" (`index.html:299-308` sets `data-theme` only and does not persist, not even across reload); Adverbier "LYS / MØRK" (`#darkToggle`); "MØRK" in the 3 template games; no toggle in the other 9. Explainer button: present in 10 games, absent in Idiomjæger, Antonymer, Flashcards and Dansk Mester.
- **Inconsistency:** If you choose dark mode on the portal, games ignore it. Games with their own toggle use different labels and positions. The mute control exists in three different forms, or not at all.
- **Evidence:** `$S\summary.txt` ("comps theme= mute=" per game), screenshots of the headers in `$S\boejn-desktop-light-start.png`, `$S\adverbs-desktop-light-start.png`, `$S\idiom-desktop-light-start.png`.
- **Suggested replacement:** Put the theme and mute toggles in the shared `.sd-bar` (sjovt.js), stored in one key (e.g. `sessionStorage`/`DanskCore.store` `sd:theme`, `sd:muted`) and applied before first paint. Remove the per-game duplicates.

### VIS-012: Minor: The explainer modal ignores per-game and dark tokens
- **Location:** `shared/explainer/modal.css:5,15-18,24,28` (literal `#F94F37`, `#E1AD12`, dark `#1B1D2B`); `explainer.css:9-22` (dark `#12151F`, `#232842`, `--xp-bw:3px`); `explainer.js:154` (`easing:"ease-out"`).
- **Inconsistency:** In every game the entry button and panel use portal orange and mustard. Example: a mustard panel over the lavender Konjunktioner page. The dark modal uses a navy and cream palette that exists nowhere else; Sjovt dark is `#101010` with game-coloured lines. The buttons use a plain 3px ring with no notch, bevel or base, and frames are 3px instead of 4px. Control labels are mixed case ("Afspil", "Næste trin") while every other button is uppercase. Animations ease instead of using `steps()`.
- **Evidence:** `$S\crops\xp-konjunktioner-light-1280.png`, `$S\crops\xp-konjunktioner-dark-1280.png`, `$S\crops\bar.png`. Computed styles in the `xp.cjs` output (`.xpm-panel bg rgb(225,173,18)` light / `rgb(27,29,43)` dark).
- **Suggested replacement:** Use `var(--sd-primary)`, `var(--sd-panel)`, `var(--sd-box)` and `var(--sd-drop)` with the current literals as fallbacks. Use the dark values from `--sd-*`. Use `steps(4)` easing and uppercase labels.

### VIS-013: Minor: The back/exit control has many labels and glyphs
- **Location:** Bar "← MENU"; Idiomjæger "⟵ JAGTMENU"; Dansk Mester "‹ TILBAGE" and "Hjem"; Magiske Verber "‹ Tilbage til hovedmenu" and "Hovedmenu"; Antonymer "← Tilbage" and "Forside"; En/Et "← Tilbage" and "Til menuen"; template games and Forbindeord "✕" icon buttons.
- **Inconsistency:** Four different arrow glyphs (← ⟵ ‹ ✕) and seven wordings for "leave this level".
- **Evidence:** `$S\summary.txt` ("back=" lists), `$S\res\mester-path.png`, `$S\idiom-desktop-light-play.png`, `$S\tids-desktop-light-play.png`.
- **Suggested replacement:** One in-game back pattern: the same pixel arrow sprite as the bar, plus "TILBAGE". Keep "✕" only for quitting a running round, styled identically everywhere.

### VIS-014: Minor: The explainer monitor has a much coarser pixel scale
- **Location:** `shared/explainer/monitor.svg` (48×40), stretched to the panel width (≤ 720px), set in `modal.css:31-33`.
- **Inconsistency:** Each art pixel becomes about 13–15 CSS px, while sprites use 2–4px pixels. It is the chunkiest object in the system and looks like a different art set. Its grey ramp (`#D9D9D9/#8E8E8E/#5E5E5E`) does fit the 32px icons.
- **Evidence:** `$S\crops\xp-konjunktioner-light-1280.png`.
- **Suggested replacement:** Redraw the frame at about 4× the resolution (192×160) so pixels land near 4px, or cap the monitor width so pixels are a multiple of 4 CSS px.

### VIS-015: Minor: The portal SEO panel is the only rounded and soft-bordered element
- **Location:** `index.html:221` (inline `border:2px solid var(--sd-orange); border-radius:12px; box-shadow:var(--sd-box)`).
- **Inconsistency:** A 12px radius with a 2px orange line, and the notched frame shadow clipped oddly at the corners. The audit found 0 rounded elements in all games.
- **Evidence:** `$S\crops\portal-seo.png`. Audit: `radius 1 section r=12px`.
- **Suggested replacement:** `class="sd-panel sd-panel--hl"` with no inline border or radius.

### VIS-016: Minor: The portal theme button has no visible frame
- **Location:** `index.html:67-68`. The box-shadow frame is `#FFC25A`, the same as the cream fill.
- **Inconsistency:** Every other button has an ink frame. This one reads as a flat cream chip.
- **Evidence:** `$S\crops\portal-theme.png`, `$S\portal-desktop-light-start.png`.
- **Suggested replacement:** `class="sd-btn sd-btn--cream sd-btn--sm"`, or a frame shadow in `var(--sd-ink)`.

### VIS-017: Minor: The results screen pattern differs between games
- **Location:** End-of-round renderers: `konjunktioner.html:929` (`gameOver`), `Forbindenor.html:816`, `en og et/index.html:1359`, `idiomjaeger.html:862`, the `renderSummary` in the template games.
- **Inconsistency:** Five different patterns. (1) Konjunktioner: "SLUT!" modal over a near-black overlay. (2) Forbindeord: "RESULTAT 110" score panel with 3 sprites. (3) Idiomjæger: "RUNDE SLUT", pokal, stat box and emoji. (4) En/Et: "ØVELSE GØR MESTER!" with 2 buttons. (5) Template games: "RUNDEN ER FÆRDIG" with a 2-stat grid and a mistakes list. Replay is labelled "SPIL IGEN", "IGEN" or "SPIL IGEN 🔁". Some games call `fx.celebrate` and have an animated sprite; others have a static sprite.
- **Evidence:** `$S\sheet-results.png`, `$S\res\{konj,forbind,enet,boejn,idiom-results}-end.png`.
- **Suggested replacement:** A shared results card: pokal or stjerne sprite with `sd-hop`, score and accuracy stat boxes, an optional mistakes list, and "SPIL IGEN" / "TIL MENUEN" buttons.

### VIS-018: Minor: The gap/blank placeholder in sentences differs
- **Location:** Forbindeord `_____` on a game-tint box; Konjunktioner `?` over a dashed underline; Tidsmaskinen `?` in a framed box; Bøjningsværkstedet `·` in empty cells.
- **Evidence:** `$S\forbind-desktop-light-start.png`, `$S\konj-desktop-light-play.png`, `$S\tids-desktop-light-play.png`.
- **Suggested replacement:** One `.sd-gap` component, for example a dashed 4px underline box like `.xp-tile.is-gap` in the explainer.

### VIS-019: Minor: Semantic ok/bad colours reused for CEFR levels and categories
- **Location:** Ordstilling level badges (A1 green `#0F7A33`, A2 blue `#2B3FD6`, B1 pink, B2 `#D4145A` = `--sd-bad`); Konjunktioner tags "Bisætning" in blue and "Hv-ord" in `--sd-green`.
- **Inconsistency:** Green and red mean right and wrong in feedback everywhere, but here they mean "easy level" and "hard level". Other games use neutral ink or cream level badges, as the portal does.
- **Evidence:** `$S\ordst-desktop-light-start.png` (audit bg list: `(15,122,51)`, `(212,20,90)`), `$S\konj-desktop-light-start.png`.
- **Suggested replacement:** Use `.sd-badge` / `.sd-badge--cream` for levels, as on the portal cards. Keep green and red for feedback only.

### VIS-020: Minor: Dark-mode surface treatment is inconsistent
- **Location:** Magiske Verber (mode cards), Præpositioner (mode cards), Dansk Mester (first course card) and Flashcards (the card) keep light pastel or white surfaces in dark mode. The other games switch panels to dark `--sd-panel`.
- **Evidence:** `$S\sheet-mobile-dark-start.png` (magiske, praep, mester, flash tiles vs adverbs, antonyms, enet, tids).
- **Suggested replacement:** Pick one rule: either dark panels with game-colour accents (the majority), or explicitly "light card on dark field" everywhere.

### VIS-021: Minor: Duplicate title in the template games, with different sprites
- **Location:** `boejningsvaerkstedet/index.html` header (`molle`) plus the panel title (`tandhjul`). Pronomenmysteriet and Tidsmaskinen also repeat the title in the header and the panel.
- **Evidence:** `$S\boejn-desktop-light-start.png`, `$S\pronomen-desktop-light-start.png`.
- **Suggested replacement:** Keep one title. Use the portal-card sprite (`tandhjul`) for both.

### VIS-022: Minor: The grid background stops before the bottom of the viewport, and the bar height disagrees with its token
- **Location:** `sjovt.css:115-121` paints the grid on `body` only, while `html` has a flat `--sd-bg`. Bodies use `min-height: calc(100dvh - var(--sd-bar-h))` (852px). `.sd-bar` measures **56px** while `--sd-bar-h` is 48px (`sjovt.js:770`).
- **Inconsistency:** On short pages a flat band about 48px tall without the grid appears at the bottom.
- **Evidence:** `$S\boejn-desktop-light-play.png`, `$S\forbind-desktop-light-start.png`, `$S\konj-desktop-light-play.png` (bottom edge); `probe.cjs` output (`bar h:56`).
- **Suggested replacement:** Paint the grid on `html.sd-page` too (or use `body{min-height:100dvh}`), and set `--sd-bar-h` to the real 56px, or make the bar exactly 48px.

### VIS-023: Minor: Native `<select>` controls keep the OS chevron
- **Location:** Level selects in Idiomjæger, Præpositioner, Konjunktioner and Dansk Mester.
- **Evidence:** `$S\idiom-desktop-light-start.png` ("Alle niveauer ⌄"), `$S\res\mester-path.png`.
- **Suggested replacement:** `appearance:none` with a pixel chevron background (SVG data URI) in `.sd-select`. Or use the segmented level chips the other games use.

### VIS-024: Minor: Dansk Mester badge labels overflow their tiles
- **Location:** Dansk Mester Emblemer screen ("VERBERNYBEGYNDER", "VENDINGSNYBEGYNDER").
- **Evidence:** `$S\res\mester-badges2.png` (text runs past the tile border).
- **Suggested replacement:** `overflow-wrap:anywhere; hyphens:auto`, or a smaller label size in the badge tiles.

### VIS-025: Minor: Inline TTS buttons inside running text break line rhythm
- **Location:** Idiomjæger explanation panel (`speakerBtn` inside text, `idiomjaeger.html:857`).
- **Evidence:** `$S\fb\idiom-3.png`. The 48px framed ♪ boxes sit inline and push the lines apart, with no gap after "Trække i langdrag".
- **Suggested replacement:** Use a small 32px inline variant with a margin, or move TTS to the end of the line.

### VIS-026: Minor: `pixel-animation.html` is not reskinned (orphan page)
- **Location:** `pixel-animation.html:7-15`: own palette (`#0e0a1f`, `#f4e9c8`, purple frame), `ui-monospace/Consolas`. It does not use sjovt.css or sjovt.js, has no MENU bar, and is not linked from the portal or any page (grep).
- **Evidence:** `$S\pixel-desktop-light-start.png` (purple night scene, Consolas caption). Audit: `fonts: ui-monospace… platform Consolas(sys)`.
- **Suggested replacement:** If it ships, add sjovt.css and sjovt.js, map the palette to the tokens, and use Pølle as the hero. Otherwise move it out of the site root.

### VIS-027: Minor: The design docs no longer describe the shipped system
- **Location:** `docs/redesign/AGENT-BRIEF.md:8-11` (Pixelify Sans display font, mustard field, orange primary buttons); `TEST-REPORT.md:10` ("Pixelify Sans for UI labels"); `shared/explainer/modal.css:6,21,23` (fallback `"Pixelify Sans"`).
- **Inconsistency:** The real system is JetBrains Mono for display and body, there is no Pixelify file, and colours are per game (`--game`). New contributors following the brief would reintroduce a font that does not exist.
- **Evidence:** `shared/fonts/` listing, `sjovt.css:63-65`, theme headers.
- **Suggested replacement:** Update the brief with the per-game colour contract and the real font stack. Drop the "Pixelify Sans" fallbacks.

## 6. Out-of-scope observations for the coordinator (not counted)

- **`pronomenmysteriet/data.js` holds placeholder data**: 760/760 items read "Test sentence N.", options "opt1/opt2", note "Test note." (`data.js:8-14…`; file dated Oct 3 07:24). `reports/pronomen-data.md` says real content passed QA on branch `b9abb96`, so the working copy appears to have regressed. Visible in `$S\fb\pronomen-2.png`. This blocks the game's content.
- English UI strings: accessible names "Pronounce" (Antonymer, Flashcards) and the "MULTIPLE CHOICE" badge in Præpositioner's question screen (`$S\fb\praep-2.png`).
- Adverbier "Lyt og vælg" has no audio at all. It is listed under VIS-009, but it is mainly a functional gap.

## 7. Counts by severity

| Severity | Count | IDs |
|---|---|---|
| Critical | 0 | – |
| Major | 6 | VIS-001, VIS-002, VIS-004, VIS-009, VIS-010, VIS-011 |
| Minor | 21 | VIS-003, VIS-005, VIS-006, VIS-007, VIS-008, VIS-012, VIS-013, VIS-014, VIS-015, VIS-016, VIS-017, VIS-018, VIS-019, VIS-020, VIS-021, VIS-022, VIS-023, VIS-024, VIS-025, VIS-026, VIS-027 |
| **Total** | **27** | |

What is solid: all 14 games load the skin and a theme file. They render HTML text in the bundled JetBrains Mono. None has rounded corners, blurred shadows or raster images. Dark mode flips on all of them. The 32px identity icons and the portal are a coherent pixel-art reference.
