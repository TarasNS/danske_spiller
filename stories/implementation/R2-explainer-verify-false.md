# R2: explainer scenes verify:false (W-EXPL-V2)

Native-speaker review accepted the changed Danish content (US-025, US-035), so `verify: true` became `verify: false`.

## Changed files (only the `verify` line, +1/-1 each)
In `shared/explainer/scenes/` and the identical copies in `.claude/skills/grammar-explainer-video/examples/` (18 + 18 = 36 files):
pluskvamperfektum, fremtid, hvis-betingelse, at-infinitiv, passiv, imperativ, subjekt-objekt, den-det-de, nogen-nogle-noget, demonstrativer, gradboejning, gradboejning-mere-mest, maengdeord, til, foernutid-er, konjunktioner-betydning, adverbier-betydning, sin-hans.

The pre-change `grep -l "verify: *true"` list matched exactly these 18; all had identical example copies.

## Tests
- validate-scene.mjs: 18/18 OK.
- No `verify: true` left in scenes or examples; every example copy is byte-identical to its shipping scene.
- `git diff --numstat`: all 36 scene files are 1/-1.
- Browser (Edge, `?dev=1`, file://): Pronomenmysteriet (6 tabs) and Tidsmaskinen (10 tabs): no "Skal tjekkes" badge on any tab; sin-hans, subjekt-objekt, pluskvamperfektum, fremtid reached `__explainerDone`; zero console errors/warnings.

Status: DONE
