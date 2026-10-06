# VERIFY-US-035 (verifier V-EXPL)

Scope: til, er-perfect, meaning scenes for Konjunktioner/Adverbier, QA-057 wording, "Skal tjekkes" badge gate, sin-hans. Same harness and evidence base as VERIFY-US-025 (10 games x 4 viewports x all tabs; frames viewed at 360 and 1440).

| # | Criterion (verbatim) | Result | Evidence |
|---|---|---|---|
| 1 | A native speaker reviews `sin-hans` (incl. U-03). If the red colouring is confirmed misleading, use a neutral colour plus a gloss ("= en andens bror"). Then set `verify:false`. | NOT VERIFIED | Needs a native speaker. `sin-hans.scene.js` is unchanged and still `verify: true`; U-03 undecided. |
| 2 | Production never renders the "Skal tjekkes" badge: gate it behind a dev flag in `explainer.js`. | PASS | `explainer.js` `devMode()` (`?dev=1` or `localStorage["sd-dev"]==="1"`, each in try/catch) gates the badge. Measured on pronomenmysteriet tab "sin eller hans" (`verify:true`): 360 production badges `[B1]`; `?dev=1` `[B1, Skal tjekkes]`; localStorage flag at 1366 `[B1, Skal tjekkes]`; 1366 production `[B1]`. No badge in any matrix run. Title never truncated (`scrollWidth <= clientWidth`; bar wraps). |
| 3 | A "til" scene is added and wired in Præpositioner. | PASS | `til.scene.js` (30.1 s) in `dansk-praepositioner.html` line 2 `i-paa,til,af-fra`; 16 steps reach done at all 4 viewports; frames viewed. Content: i (place) vs til (goal): "Jeg bor i København / Jeg skal til København i morgen". |
| 4 | `foernutid-har` gains an er-verb step, or a sibling scene `foernutid-er` is added and wired in Magiske Verber. | PASS | `foernutid-er.scene.js` (27.8 s); `magiske_verber.html` line 2 `tider-nutid-datid,foernutid-har,foernutid-er`. Scene: Toget er kommet, Børnene er gået, Vejret er blevet, Min mor er kommet; rule "er + tillægsform / komme, gå, blive / ikke: har kommet". Frames viewed. (`foernutid-har.scene.js` header comment still says er-verbs omitted: a code comment, not learner-visible.) |
| 5 | Konjunktioner and Adverbier get a meaning scene (or the existing scene is clearly labelled as word order). | PASS | `konjunktioner-betydning` (og/men/fordi/så) wired in `konjunktioner/konjunktioner.html`; `adverbier-betydning` (alligevel/stadig/derfor) wired in `adverbs.html` line 44. Both reach done, no clipping; they are the last tab (games open on the word-order tab first). |
| 6 | QA-057 wording fixes are applied, with punctuation or capitalisation where the player supports it. | PASS | Diff vs 0550623 plus rendered frames: flertal rule "Hvert ord" -> "Nogle ord: barn → børn"; inversion-derfor tiles "Han var syg," / "Hun var dygtig," / "Han var træt,"; konjunktioner tiles "Jeg er glad," / "Han er glad,"; tider-nutid-datid highlight `words:[0,1]` (frame shows both "I" and "går" highlighted). Moving tiles stay lowercase (player cannot re-capitalise), disclosed. |
| 7 | VID harness passes on all affected games. | PASS | adverbs, magiske_verber, dansk-praepositioner, konjunktioner, forbindenor, en og et, ordstilling, pronomenmysteriet: all tabs done, nothing clipped, zero console errors at 360/390/1366/1440; dark 360 clean; reduced motion 360 clean. |

## Content / scope notes
- All new US-035 scenes ship `verify:false` without native review (same issue as VERIFY-US-025 criterion 5; no US-035 criterion forbids it).
- UNCERTAIN (native review): `konjunktioner-betydning` "Mor laver kaffe, og/men far smører brød" (two defensible answers); `adverbier-betydning` comma splice "Det regnede, derfor blev vi inde" and wrong try "jeg nåede derfor mødet"; `til` recipient example "gav gaven til sin mor" under "mål"; `foernutid-er` only komme/gå/blive; comma after first clause in inversion/konjunktioner scenes.
- Diff scope: only the 4 edited scenes (+ `examples/` copies) and `data-explainer` lines; nothing else attributable.

Verification: NOT VERIFIED - criterion 1 (native review of `sin-hans` incl. U-03, then `verify:false`) cannot be verified here. All other criteria PASS.
