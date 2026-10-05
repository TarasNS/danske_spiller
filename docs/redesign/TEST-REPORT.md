# Sjovt Dansk redesign — test report

Tested in headless Chrome 153 (puppeteer-core) from `file://` at 390×844 (mobile), 820×1180 (tablet), 1440×900 (desktop). Per-game detail: `reports/<game>.md`; screenshots: `screenshots/<game>/` (≈ 300 PNGs).

## References
- beigeforce.com: inspected live. Mustard `#E1AD12`, pure-black pixel grid, boxed "PLAY!" button, monospace type. Fonts there: Monaspace Neon + Kongtext.
- andrewalfordcreative.com: inspected live. Preloader is `#F94F37` with stacked, outlined `#FFC25A` words (also `#FD9E4F`).
- The supplied screenshot/CSS was **not visible to me**, so the palette is sampled from the two live sites. Compare it against your screenshot and tell me which swatches to adjust (tokens are at the top of `shared/sjovt.css`).
- Fonts are bundled locally (JetBrains Mono, loaded as "SD Mono", for UI labels and reading text; Press Start 2P for the wordmark only). Press Start 2P draws Ø like a zero, so it is not used for Danish words.

## Shared system
`shared/sjovt.css` (tokens, buttons, panels, forms, feedback, preloader), `shared/sjovt.js` (sprites, preloader with real progress, page curtain, game bar, fx helpers), `shared/themes/<game>.css` (12 themes), `shared/fonts/`.

| Check | Result |
|---|---|
| Home + 12 games: 0 console errors/warnings/failed requests, 3 viewports (final independent run, 36 loads) | PASS |
| No horizontal overflow, 3 viewports | PASS |
| Preloader: full intro once per tab session, quick curtain on later navigations, tied to real load + fonts, 6 s failsafe | PASS |
| Preloader with fonts blocked (failed assets) | PASS (still opens) |
| Reduced motion (preloader, mascot, fx) | PASS |
| Tap targets ≥ 44px, focus rings, ✓/✗ icon + text feedback | PASS (agent-measured, all games) |
| æ/ø/å rendering, long Danish words wrap | PASS |
| Dark mode readable | PASS (spot-checked; fixed contrast bug in Præpositioner/Magiske Verber) |

## Game by game (details in per-game reports)
| Game | Flow (start→correct→wrong→results→restart→menu) | Saved progress | Notes |
|---|---|---|---|
| Home | PASS | n/a | Added missing Adverbier card; Danish copy |
| Antonymer | PASS | PASS | Settings switches now keyboard-reachable |
| Verb-glosekort | PASS | PASS | Added completion panel; fixed card-back overlapping buttons; verb list still click-only |
| Magiske Verber | PASS (8 games) | PASS | Removed missing hogwarts.jpg; Enter double-advance on buttons fixed |
| Præpositioner | PASS (9 modes) | PASS | Drag & drop only tested via tap |
| Dansk Mester | PASS | PASS | Wrong-answer auto-advance is 1.5 s (original) |
| En/Et | PASS (all modes) | PASS | Tiles made keyboard-operable |
| Konjunktioner | PASS | PASS | Pre-existing Enter double-fire on "Næste" left as-is |
| Ordstilling | PASS (core flow) | PASS | Timed final investigation not played through |
| Forbindeord | PASS | PASS | No start screen in original |
| Idiomjæger | PASS | PASS | Match Pairs stacks in one column on phones (as original) |
| Bøjningsværkstedet | PASS (6 modes) | PASS | Modes 1–4 only tested with injected data; shipped data.js has none ("kommer snart") |
| Adverbier | PASS | PASS | Endless game, no results screen: confetti on level-up instead |

## Not verified / known limits
- Audio and Danish TTS (headless Chrome has none); no real devices, screen readers or Safari/Firefox.
- Animation smoothness judged from stills and code (stepped CSS, no layout-thrashing), not a frame-rate trace; slow-network behavior checked only for the blocked-font case.
- Contrast reviewed visually, not numerically.
- Some games keep English UI/learning text (Ordstilling, Verb-glosekort) because content was out of scope.
- A few emoji remain inside running text in Idiomjæger/Dansk Mester.
- Adverbier settings text contains a stray `【…】` citation artifact from the original.
