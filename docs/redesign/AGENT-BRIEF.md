# Sjovt Dansk redesign — per-game brief

You are reskinning ONE OR TWO existing Danish learning games to the shared "Sjovt Dansk" pixel-arcade identity.
The design system is DONE and frozen. Read: `shared/sjovt.css` (tokens + components), `shared/sjovt.js` (window.Sjovt API),
`index.html` (reference implementation of the look), `docs/sjovt-sprites.html`.

## Visual identity (match it)
Each game has ONE colour, set once in its theme file as `--game` (e.g. Præpositioner `#2ED0EE`); the theme maps it onto the tokens
(`--sd-primary`, `--sd-bg`, `--sd-panel`, `--sd-line`, dark-mode variants). The portal and the shared bar keep the brand mustard `#E1AD12` / orange `#F94F37` / cream `#FFC25A`.
Look at an existing theme (`shared/themes/praepositioner.css`) before writing a new one. Black `#101010` 4px notched pixel frames (`box-shadow: var(--sd-box)`) with hard
offset drop shadows (`var(--sd-drop)`), a faint 32px grid (painted on `<html>` and `<body>`), warm panels (`--sd-panel`) for reading text.
Buttons: `.sd-btn` (game-coloured primary, ink frame, bevel); the portal "Vælg spil" and card buttons use it too.
Fonts (all local in `shared/fonts/`, never Google Fonts): `--sd-font-display` and `--sd-font-body` are both **SD Mono** (JetBrains Mono, bold for headings/buttons/labels, regular for reading text,
digits and level badges, so B/0, 1/I, 2/8 stay unambiguous). `--sd-font-logo` (Press Start 2P) ONLY for the SJOVT DANSK wordmark (its Ø looks like 0). There is no Pixelify Sans.
No border-radius, no soft/blurred shadows, no gradients except pixel stripes, animations use `steps()`.
Sprites: all are 32x32 shaded grids (one density everywhere). `Sjovt.sprite(name,{scale})` or `<span data-sd-sprite="polle" data-scale="4">`.
Names: `Sjovt.sprites` lists them; meanings are in `docs/redesign/icon-map.md` (one meaning per sprite; pick from the map, e.g. `stopur` speed, `bland` mixed, `statistik` stats, `vend` flip).
Scale note: `spriteSVG` renders a 32px grid at half the scale, rounded up, so use even scales (2, 4, 6); scale 2 gives a 32px box. Replace decorative emoji with sprites where easy.
Arrows: never type ← → ▶ ▼ as text where it can be avoided (fonts lack them). Use `<span class="sd-arr" aria-hidden="true"></span>` (`sd-arr--r`, `--d`, `--u` for other directions).
Shared parts to reuse instead of restyling per game: `.sd-gap` (sentence blank), `.sd-badge--panel` (neutral level badge; green/red are only for correct/wrong), `select.sd-select` (pixel chevron) and
`.sd-surface` (dark-mode-safe card) from `shared/sd-extras.css`; `.dc-tts-button` (the one Lyt button) from `shared/tts-button.css`; `.sd-results*` (results screen look) from `shared/sjovt.css`.
Dark mode rule: cards and tiles use panel tokens (`--sd-panel`, `--sd-text`, `--sd-line`), never hard-coded white/pastel fills; game colour is an accent only. Anything on a cream hover/selected fill sets `color:#101010`.
Dark mode: tokens flip automatically via `prefers-color-scheme` / `[data-theme=dark]`. Theme and sound are controlled ONLY by the shared bar (`sd:theme`, `dc:sound-enabled`); do not add per-game toggles.

## How to integrate (per game)
1. In `<head>`, AFTER the game's own `<style>` blocks (so cascade wins) add (paths relative to the game file):
   `<link rel="stylesheet" href="PATH/shared/sjovt.css"><link rel="stylesheet" href="PATH/shared/themes/<game-id>.css"><script src="PATH/shared/sjovt.js"></script>`
   Better: put the `<script src=sjovt.js>` as the FIRST thing in head after the css link so the preloader covers first paint.
   (Games must keep working from `file://`; no CDN/network; remove Google Fonts links if present — fonts are local now.)
2. Write `shared/themes/<game-id>.css`: restyle every screen/component of the game to the identity above, mapping the game's existing CSS
   variables onto `--sd-*` tokens and overriding component rules (use `html.sd-page` prefix for specificity, `!important` only when fighting inline styles).
   You may also edit the game's own inline CSS directly where cleaner. You MAY edit game HTML/JS minimally to: add hooks for fx, swap emoji for sprites,
   add accessible labels. You MUST NOT change learning content, data, rules, scoring, SRS/progress logic, or localStorage/DanskCore keys.
3. The shared bar (arrow + MENU, wordmark, MØRK and LYD buttons) is auto-injected at top of body (sticky). `--sd-bar-h` is set to its measured height (56px by default). Fix any `100vh` layouts so nothing is clipped/scrolls twice
   (use `calc(100dvh - var(--sd-bar-h))`). Don't duplicate a back-to-menu control unless the game already needs one for in-game “quit”; in-game back is "← TILBAGE" and ✕ only quits a round.
4. Animations (lightweight, reduced-motion safe — the helpers already no-op under reduced motion):
   - screen/panel changes: `Sjovt.watchScreens("<selector for screens>")` or `Sjovt.fx.enter(el)`
   - correct answer: `Sjovt.fx.correct(buttonEl)`; wrong: `Sjovt.fx.wrong(buttonEl)`; score/streak change: `Sjovt.fx.bump(scoreEl)`; finished/results: `Sjovt.fx.celebrate()` + a sprite (pokal/stjerne)
   - at least one animated character (sprite with class `sd-bob`/`sd-hop`/`sd-wig`) on the start and results screens.
   - Keep motion OFF the text the learner is reading; no looping motion near question/answer text.
   - If the game does heavy init before it's usable, `Sjovt.hold(promise)` keeps the curtain up (optional).
   Wire these in with small additive hooks (e.g. a wrapper around the existing feedback function), never altering logic.
5. Accessibility: 44×44px min touch targets, visible focus (global rule exists; don't remove outlines), feedback never colour-only (✓/✗ icon + text),
   keyboard operable, 360px min width with NO horizontal scroll, long Danish words wrap (`overflow-wrap:anywhere`/hyphens), æøå render in mono+label fonts.
   Body text ≥ 16px (≥ 14px for secondary meta). Contrast ≥ 4.5:1 for text.
5b. Keep every game's own text language; do not translate learning content.

## DO NOT TOUCH
`shared/sjovt.css`, `shared/sjovt.js`, `shared/sd-extras.css`, `shared/tts-button.css`, `shared/fonts/`, `index.html`, other games' files, `prd.md`, `specs.md`, `PROGRESS.md`, `improvements.md`.
Need a shared change? Don't make it — put the override in your theme file and list the request in your report.
Do NOT run git commands that write (no add/commit/stash/checkout) — the lead commits. Shared `shared/dansk-core.js` / `shared/data/*` : read-only unless the game truly needs it (tell me).

## Testing (mandatory — look at real rendered screens, not just code)
Chrome + puppeteer-core are available. Scratchpad (has node_modules/puppeteer-core): 
`C:/Users/taras/AppData/Local/Temp/claude/c--Users-taras-Downloads-danske-spiller/8d901412-56e5-48d2-83c5-b83061cde30e/scratchpad`
Write your scripts INSIDE that folder (so `import puppeteer from 'puppeteer-core'` resolves), name them `<game-id>-*.mjs`. Launch with
`executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:'new'`; open games via `pathToFileURL`. Reference: `shot.mjs`, `pre.mjs` there.
Use the Read tool on the PNGs to actually look at them.
For each game capture at 390×844 (mobile), 820×1180 (tablet), 1440×900 (desktop): start screen, instructions/mode/level select (if any), question/gameplay,
correct feedback, wrong feedback, pause/menu overlay (if any), results/completion. Drive the real UI (click through; use keyboard too). Check:
 - console errors/warnings & failed requests (zero tolerated), `document.documentElement.scrollWidth <= clientWidth` on every screen,
 - full flow: start → correct answer → wrong answer → complete → restart → back to menu works; scoring unchanged,
 - saved progress: play, reload, confirm same localStorage keys/values behave as before (compare with `git stash`-free approach: read the code to see keys; test they still write/read),
 - reduced motion: `page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}])` → no motion, still functional,
 - dark mode: `emulateMediaFeatures prefers-color-scheme dark` readable,
 - æ/ø/å rendering and long-word wrapping, focus rings visible on Tab, tap targets ≥ 44px (measure with getBoundingClientRect on buttons/inputs).
Fix problems, then RE-capture the affected screens. Don't stop at CSS-only; exercise gameplay.
Save the final representative screenshots (PNG, keep each < 400KB; use clip/viewport not huge fullPage when possible) to
`docs/redesign/screenshots/<game-id>/<viewport>-<screen>.png` (viewport = mobile|tablet|desktop; ≈ 6–10 per viewport... at least start, play, feedback, results for all 3 viewports).
Write a concise report `docs/redesign/reports/<game-id>.md`: table of checks (PASS / FAIL / NOT VERIFIED with reason), what changed (files), known issues, shared-system requests.
Final message to lead: ≤ 15 lines: files changed, pass/fail summary, unresolved issues.
