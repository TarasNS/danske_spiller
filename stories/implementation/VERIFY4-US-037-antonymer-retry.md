# VERIFY4 US-037 Antonymer retry (verifier V4-R)

Own scripts in scratchpad `impl/V4-R/` (`ant.cjs`, `ant2.cjs`, `sticky.cjs`); Edge headless over file://.

| Criterion | Result | Evidence |
|---|---|---|
| Confetti spawns behind the results text (z-index) or only from the trophy area | PASS | Real rounds played through the UI (mode 1, click options / "Fortsæt") to `#screen-summary` in ALL 6 combinations: 360x740, 390x844, 1366x768 x light/dark (all reached the summary, including 1366 light). 12 samples each while falling (40 `.sd-conf` pieces live): `elementFromPoint` at the centre of `#sumScore`, `#sumLine`, `#sumAgain`, `.topbar .brand`, `.topbar` and the sticky MENU bar was never inside `.sd-conf`. Screenshots viewed (all 6): card, trophy, "N / 10 RIGTIGE", text and both buttons fully clear; confetti squares only fall around/below the card on the grid background, topbar and MENU bar clean (light: pink grid, dark: dark grid; same at 360, 390, 1366). |
| No other screen's layout changed | PASS | Compared against HEAD css (the retry diff is uncommitted; HEAD = first US-037 attempt) with deterministic Math.random at 360 and 1366: start, question, feedback, settings: key rects (topbar, prompt, options, feedback, next) identical; screenshots visually identical (remaining pixel deltas 0.1-1% are sub-pixel/antialias from the removed compositing layer; 1366 start is byte-identical). |
| Topbar still on top, MENU bar sticky | PASS | `.sd-bar` is `position:sticky; z-index:900`, stays at top 0 after scrollY=400. `header.topbar` is now `relative; z-index:2` (was `static`, its z-index 30 was inert); no rect change. |
| No h-scroll | PASS | scrollWidth == clientWidth on summary at 360, 390, 1366 (light and dark). |
| Zero console errors | PASS | 0 console/page errors in all 6 runs. |
| Smoke | PASS (legacy artefact aside) | `node smoke.mjs ../danish-antonyms-game.html`: only the known "#btn-play found" and "console clean + still playable" rows fail; start/no-h-scroll/contrast/focus ring/localStorage-blocked rows pass. |
| Diff limited to `shared/themes/antonyms.css` | PASS | `git diff HEAD` for the game: 3 added lines in that file only. |

Regressions: none. Scope creep: none (the topbar `position:relative; z-index:2` line is justified by the retry). UNCERTAIN: none.
Note: "INDSTILLINGER" wraps mid-word at 360 (pre-existing, not part of this retry).

Verification: VERIFIED
