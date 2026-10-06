---
name: grammar-explainer-video
description: Use when asked for a short silent explainer video, animation or visual demo of a Danish grammar rule (en/et, V2 word order, ikke placement, prepositions, conjunctions), where a sentence changes on a pixel-art computer screen to show which form goes where. Also for exporting such an animation as WebM. Not for narrated video, game levels or data.js content.
---

# Grammar explainer video

A silent, 20-40 s animation inside a pixel-art CRT monitor. A Danish sentence with a gap changes on screen: the wrong option fails, the right one locks in, a rule card appears, then 2-3 new examples repeat the pattern. No narration, no audio. All visible text is Danish.

Files live next to this skill:

| Path | Purpose |
|---|---|
| `reference/scene-schema.md` | The scene contract (step types, player API). Read it before writing a scene. |
| `templates/explainer.html` / `.js` / `.css` | The player and demo page. Loads one scene via `<script src>`. |
| `templates/monitor.txt`, `monitor.meta.json` | Pixel monitor sprite (48x40 grid, screen rect x6 y5 36x24, `z` = screen). |
| `examples/*.scene.js` | `en-et`, `v2-ordstilling`, `ikke-placering`, `i-paa` (place prepositions), `konjunktioner` (conjunction word order). Copy the closest one. |
| `scripts/validate-scene.mjs` | Checks a scene: fields, step types, indices, gaps, `ok` flags, 20-40 s. |
| `scripts/record.mjs` | Records one loop of a page to WebM. |

## Workflow

1. **Pin the rule.** One rule per video, stated in one sentence. Pick the contrast that makes it visible (en vs et, before vs after the verb). If a rule needs more than one contrast, make two videos.
2. **Choose sentences you are certain of.** Apply the `danish-grammar-qa` "one defensible answer" test: given only what is shown, a native could not choose a different option. Anything doubtful gets `verify: true` in the scene and is reported as needing a native check. Never guess Danish.
3. **Storyboard in this order:** sentence with gap, wrong `try`, right `try`, `rule` card (max 3 short lines), then 2-3 `cycle` examples. For word order use `move`/`swap`/`arrow`/`highlight` instead of gaps.
4. **Write the scene** as `window.EXPLAINER_SCENE = {...}` per `reference/scene-schema.md`. Rules that trip people up:
   - In `{n}` gaps, `n` equals the gap's word index.
   - A position where no word fits is `slots: {n: {none: true}}`; every `try` there is `ok: false`.
   - Set `t` on every step and put the running total in a comment; the video must be 20-40 s.
   - Keep tiles lowercase if a tile will `move` (the player does not re-capitalise).
   - Colours are Sjovt PAL letters only.
5. **Validate:** `node scripts/validate-scene.mjs path/to/x.scene.js`. Fix every FAIL.
6. **Preview** in a real browser: open `templates/explainer.html?scene=../examples/<name>.scene.js` via `file://` (extra params: `manual=1` steps only on demand, `speed=2`, `loop=0`, `tts=1`). For scripted checks use `window.explainerPlayer.step()` and `window.__explainerDone`; set `CHROME_PATH` to Edge if Chrome is missing. Check it at 360 px width, in dark mode, and with reduced motion (manual stepping). Follow the `game-ui-verification` skill for console errors and overflow.
7. **Review the frames, not just the code.** Take screenshots at the wrong try, the right try, and the rule card; look at them. A scene that validates can still read badly (tile overlap, text too long for the screen).
8. **Export (optional):** `node scripts/record.mjs <page.html> <out.webm> [--width 720 --height 540]`. The page must autoplay with `?autoplay=1` and set `window.__explainerDone = true` after one full loop. Needs `npm install` in `tests/` first (puppeteer-core). Limits:
   - With ffmpeg on PATH (or `FFMPEG_PATH`) it writes the `.webm` directly; this branch was never run on the build machine, so check the output file plays.
   - Without ffmpeg it writes PNG frames to `<out>_frames/` and prints the exact ffmpeg command; no `.webm` exists until you run it.
   - It starts recording after page load and misses roughly the first 100-300 ms, so the page should hold its first frame briefly.
   - Frame capture may run below 15 fps (about 8-9 fps measured), so the fallback video is choppy.

## Adding an explainer to a game

The shipping copy lives in `shared/explainer/` (`explainer.js`, `explainer.css`, `monitor.svg`, `modal.js`, `modal.css`, `scenes/<id>.scene.js`). Wiring a game takes three additive lines and touches no game logic, content or storage:

1. `<html lang="da" data-explainer="scene-id[,scene-id]">` (several ids show a chooser).
2. After the game's theme css: `<link rel="stylesheet" href="../shared/explainer/modal.css">` and `<script src="../shared/explainer/modal.js"></script>` (drop `../` for root-level games).
3. Put the scene in `shared/explainer/scenes/<id>.scene.js` (copy it into `examples/` too).

`modal.js` adds a FORKLARING button to the shared `.sd-bar` (HJÆLP at 420 px and below; floating corner button if there is no bar), opens an accessible dialog (Esc closes, focus trap, focus returns, 44 px targets) and loads the player and scene on demand, so nothing runs at page load. If the player or every scene fails to load, the dialog shows a Danish error message instead of nothing. While it is open it stops keys from reaching the game.

With several scenes the chooser is one horizontally scrolling row of tabs (active tab always scrolled into view; Left/Right/Home/End move between tabs, Tab goes on to the controls).

**Events.** `modal.js` dispatches `explainer:open` and `explainer:close` (a `CustomEvent` on `document`, `detail.ids`) when the dialog is shown and removed. Each open is followed by exactly one close. A game with a running countdown listens to both: on `open` stop/hold the timer and remember that *it* paused it; on `close` resume only if it paused it and the round is still running (same round object, time left > 0, game screen visible), so a timer is never resumed twice or after the round ended. Wired so far: `en og et` (Den Hvide Kanins ræs), `dansk-praepositioner.html` (Lynrunde), `magiske_verber.html` (Hurtigduellen), `tidsmaskinen` (Med tid). `ordstilling-detektiv` has a count-up elapsed timer that is not paused.

**Dev flag.** Scenes with `verify: true` show a "Skal tjekkes" badge in the screen header only when the page is opened with `?dev=1` or `localStorage["sd-dev"] = "1"` (read inside try/catch). Production never shows it. Review the list of `verify: true` scenes in the report instead.

The skill's `templates/` copy of the player is for previewing. The shipping copy is `shared/explainer/`; after changing the player there, copy `explainer.js` and `explainer.css` (change the `../fonts/` path to `../../../../shared/fonts/`) back to `templates/` so they stay identical. Verify by opening the game, clicking the button, and checking mobile, desktop and dark mode, Esc, and no console errors.

## Design rules

- The rule must be visible without reading: movement and colour carry it, the rule card only confirms it.
- One contrast per video; at most 3 `cycle` examples; at most 3 rule lines of about 24 characters each (the screen is small).
- Wrong = red mark and the tile flies back. Right = green lock. No congratulatory text and no encouragement (matches the games' platform rules).
- Restraint: at most one thing moves at a time.
- Danish UI labels. The speech option (`tts`) is off by default and never the only way to get the point.

## Reporting

Say which sentences are `verify: true`, the total duration, and where the files are. Do not call a video done until the validator passes and you have looked at screenshots from a real browser run.
