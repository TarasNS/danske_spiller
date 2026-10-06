# VERIFY-B5-US038 (verifier V5-B): icon/sprite polish, unblocked slice

Frozen files: `git diff HEAD -- shared/sjovt.js shared/sjovt.css index.html` is empty (confirmed).
Method: contact sheet of all 23 sprites from real `shared/sjovt.js` (light and dark, looked at); all 14 games loaded in Edge at 1366x768 and 360x640, light and dark (56 screenshots, 0 console/page errors in all 56), sprites resolved by name from the SVG markup and density measured as rendered pixel size per sprite pixel. Scratchpad: `impl/v5b-icons/` (sheet-*.png, shots/, names.mjs, boejn.mjs).

## (a) icon-map.md accuracy (spot-checks, 12)
Correct: grids (cykel 16x10, stjerne 9x10, hjerte 11x9, pokal 11x12, hat 12x8, flag 17x12, snegl 14x14); cykel near invisible in dark; hat outline vanishes in dark; ur = two chat bubbles + red chain (not a clock); bog = "?" bubble + person; terning = en/et cards; net = capsules joined by ring; kiste = chest + scroll; tandhjul = gears + "A" card; tidsstjerne = star with eyes; kort = "Vb." over red card; pin = red pin with arrows. Doubtful: snegl looks more like a wooden disc/coin than a cinnamon roll; polle looks like a bun with a red smiling face (map says hot-dog); minor wording. Map is accurate where it matters.

## (b) Per game (start/mode menu + header; density = rendered px per sprite pixel)
| Game | Slot -> sprite (px) | Matches map? | Notes |
|---|---|---|---|
| Antonymer | header modsat(2); modes bog, net, modsat, snak / tryllestav, lup, kiste (all 32px family, 2) and Øv efter sværhedsgrad = stjerne flat (4); HUD pokal, stjerne, molle (2) | yes | Row 2 mixes densities: chunky flat star (4px pixels) next to 2px shaded. Header modsat repeats on "Omvendt oversættelse" (map-dictated). Streak = molle, no flag. |
| Præpositioner | header pin(3); modes snak, bog, tandhjul, pin, ur, modsat, slik, tryllestav, lup (32px,2); Statistik pokal flat (2) | yes | Last row: pokal is 2px pixels but footprint ~22x24 vs 64x64, visibly tiny and flat. pin appears in header and "Find fejlen". |
| Magiske Verber | crest tryllestav(3); cards bog, tidsstjerne, ur, kort, tandhjul, pin, tryllestav, terning (all 32px, 2) | yes | One density. tryllestav in header and Hurtigduellen (map-dictated). Difficulty stars not on start menu (not rendered here; reported by implementer, not re-checked). |
| Idiomjæger | header kiste(3); Lærings kort, Øve terning, Spil tandhjul, Svage lup, Statistik pokal, ordbog kiste | yes | Statistik pokal is flat at 4px pixels vs 2px shaded siblings: mixed density in last row (map interim says half scale, i.e. 2). Header kiste repeated on Idiom-ordbog. Chips stjerne/molle ok. Streak molle in the stats line renders large (~36px). |
| Dansk Mester | header snak(2) (was flag), chips stjerne, molle; nav polle, pokal, stjerne (all flat, 2); path cards kort/snak(3) | yes | Nav is one family. snak appears 3x on home (header, welcome, expressions card). Mode rows (MODE_SPR bog/kort/net/tryllestav/terning/kiste/lup) checked in code only, not on a screen. |
| En/Et | rule terning; modes terning, pin, kort, snak, modsat, slik, tryllestav, lup (all 32px, 2) | yes (decision #8) | Header `.rule` terning repeats on first card "En eller et?" (pre-existing, acknowledged). Style sub-screen (bog, terning, net) hidden at start, code only. |
| Adverbier | h1 ur(2) | yes | identity only |
| Bøjningsværkstedet | h1 tandhjul(3); brand sprite gone | yes | see (c); empty-state still `hat` (boejningsvaerkstedet/index.html:652), map said tandhjul. |
| Tidsmaskinen | brand tidsstjerne(2), h1 tidsstjerne(3) | yes | |
| Pronomenmysteriet | brand bog, h1 bog | yes | duplicate title (VIS-021) still shows brand + h1 sprites |
| Glosekort | h1 kort | yes | |
| Forbindeord | hero net | yes | |
| Konjunktioner | hero slik; lives hjerte (flat) | yes | |
| Ordstillingsdetektiven | masthead lup | yes | |

Light/dark and 360 views of the menus looked at (Antonymer, Præp, Idiom, Magiske, Mester, En/Et, Bøjn, Tids, Konj): sprites crisp, nothing clipped, no horizontal overflow. Retired `snegl`, `cykel`, `hat` absent from all mode rows. No meaning clashes among molle (streak only), hjerte (lives only: Konj panel), flag (not in any mode row/HUD now), pokal (stats/level/badges). Remaining cross-game reuse of the 14 shaded sprites (kort, terning, tandhjul, pin, ur, kiste each carry 2 to 4 roles) is inherent and documented.

## (c) Identity fixes
- Tidsmaskinen: `data-sd-sprite="tidsstjerne"` at index.html:160 and :167. PASS.
- Dansk Mester header: `snak` (dansk-mester.html:753). PASS.
- Bøjningsværkstedet: h1 with `tandhjul` only; header brand is `<div class="brand">Bøjningsværkstedet</div>` with `font-size:0` (theme css:35, :215). Measured: brand height 0, h1 is the one visible title at 1366 and 360; header bar is 56px and holds MØRK/LYD, not empty or broken. Screen readers: accessibility tree still exposes "BØJNINGSVÆRKSTEDET" as banner text plus the h1 on the start screen (double read, harmless). On play/summary screens no heading is visible at all (no h1 in DOM-visible state); the only title is the hidden banner text. `font-size:0` is a fragile hiding technique and the banner text is not a heading. LOW.

## (d) Compromises, remaining mixed-density spots (honest list)
1. Antonymer difficulty card: flat `stjerne` at 4px pixels among 2px shaded (visible, row 2).
2. Idiomjæger Statistik: flat `pokal` at 4px pixels among 2px shaded (visible).
3. Præpositioner Statistik: flat `pokal` at 2px pixels (matches pixel size, but footprint half and flat shading; visibly small).
4. Dansk Mester bottom nav and chips are flat-only (consistent family, fine). Konjunktioner/Ordstilling result rows use half-scale pokal/stjerne (code claim; not seen).
5. Role compromises documented and as stated: tandhjul = drag/hub, pin = error-hunt, tryllestav = speed (En/Et, Præp, MV, Antonymer, Idiom none), stars = difficulty, terning doubles as mixed and En/Et identity.
6. Redrawn 32px generic set: BLOCKED (frozen files untouched).

## (e) En/Et decision #8
Rendered: En eller et terning, Bestemt form pin, Flertal kort, Dronningens gåder snak, Spejlordene modsat, Tvillingordene slik, Kaninens ræs tryllestav, Svage ord lup (all 32px). Matches D-ENET table and icon-map section 3 (map mentions "Find par"/"Quiz" rows that exist only in the hidden style sub-screen: bog, terning, net in code). PASS.

## Smoke (magiske_verber, dansk-mester, idiomjaeger)
Only the known legacy rows fail (the "console clean + still playable" x3 per game); every other row PASS. Zero console errors in all 56 page loads. `git status` shows no stray files from me (tests wrote nothing).

## Criteria
| Criterion (US-038) | Verdict | Evidence |
|---|---|---|
| Tidsmaskinen header slots use `data-sd-sprite="tidsstjerne"` | PASS | index.html:160,167 |
| Bøjningsværkstedet keeps ONE title with `tandhjul` | PASS | one visible h1 tandhjul; brand text zero-size (a11y caveat LOW) |
| Dansk Mester header uses `snak` | PASS | dansk-mester.html:753 |
| No mode row mixes 16px and 32px sprites at different pixel densities | PARTIAL | Antonymer row 2 (stjerne 4px vs 2px), Idiomjæger last row (pokal 4px vs 2px); Præp pokal matches pixel size but flat/small. All other rows single family |
| Semantic map documented and applied to all mode menus | PASS (with caveats) | icon-map.md accurate; applied in all 6 sprite-row games and identity of all 14; one-role-per-sprite is only approximate (least-bad picks); Bøjn empty-state `hat` not switched |

## Issues
- MEDIUM: Idiomjæger Statistik `pokal` rendered at 4px (twice the row's density); map interim says half scale (px 2).
- MEDIUM: Antonymer `stjerne` difficulty at 4px; same family of issue (documented BLOCKED, but a scale of 2 would at least match pixel size).
- LOW: Bøjn start-screen empty state still `hat` (retired) at :652.
- LOW: Bøjn brand hidden with `font-size:0`, no heading on play screens.
- LOW: icon-map descriptions of snegl/polle loose; map lists En/Et rows (Quiz, Find par) not on the visible menu.
- LOW: header sprite repeated in first/other card: En/Et (first card), Antonymer, Idiom, MV, Præp (map-dictated).
- Not verified: Dansk Mester mode rows, Magiske difficulty stars and badge rows on screen (code only).

Verification: NOT VERIFIED (criterion 2 PARTIAL on remaining mixed-density spots plus BLOCKED art; no FAIL; a few in-game screens checked by code only)
