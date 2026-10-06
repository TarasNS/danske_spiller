# Sjovt icon map (US-038)

Scope: which sprite means what, and the per-game change list. Updated for US-038 remainder (owner decisions #32-34): the 9 generic sprites were redrawn as shaded 32x32 and 4 new sprites were added to `SPR` in `shared/sjovt.js`. Game menus are NOT yet rewritten; section 7 is the change list. Line numbers in sections 2 and 5 refer to the working tree on 2026-10-04.

## 1. Sprite inventory (all 32x32 shaded now)

Every sprite is a 32x32 grid, 1px ink outline, light from top-left, ramps from `PAL`. `spriteSVG` halves the scale for 32px grids, so footprint = 16 x `data-scale` px (scale 2 = 32px box, scale 4 = 64px, scale 6 = 96px); odd scales round up (3 renders like 4). The minimum is 32px (scale 1 or 2). Subjects are centred, so the visible art is roughly 24-28px of the box. Contact sheet (light and dark, scale 4/8): scratchpad `sheet-real.png`.

Generic family (redrawn, same names and meaning):

| Sprite | Actually depicts | One meaning |
|---|---|---|
| polle | Hot-dog mascot (bun, sausage, smiling face, feet) | brand / home only (bar logo, preloader) |
| snegl | Cinnamon roll, spiral | retired from mode rows (no meaning), decorative only |
| molle | Windmill, white sails | streak |
| cykel | Bicycle with red frame, blue wheels (readable on dark) | retired from mode rows (no meaning) |
| stjerne | Gold faceted star | XP / coins / reward / difficulty stars |
| hjerte | Red heart with gloss | lives |
| pokal | Gold trophy with star, orange plinth | level / results / achievements |
| hat | Grey bowler hat, red band (readable on dark) | portal empty state only; retired from mode rows |
| flag | Danish flag, Dannebrog cross shaded | Danish / language only (now a literal grid, no longer generated) |

New (one meaning each):

| Sprite | Depicts | One meaning |
|---|---|---|
| stopur | Blue stopwatch with crown, side button, red elapsed wedge | speed / timed rounds (replaces `tryllestav` as "speed") |
| bland | Blue and orange arrow crossing (shuffle) | mixed / shuffled / random order |
| statistik | Four coloured bars on a grey baseline | stats / progress / results page |
| vend | Blue card back with an orange turn arrow below | flip card (Vendekort) |

Per-game family (unchanged):

| Sprite | Actually depicts | Portal card of |
|---|---|---|
| modsat | Blue arrow right over red arrow left | Antonymer |
| kort | White "Vb." card over a red card | Glosekort |
| tryllestav | Purple magic wand with gold star and sparkles | Magiske Verber |
| pin | Red map pin with four black arrows (pointer to one spot) | Præpositioner |
| snak | White speech bubble with three typing dots | Dansk Mester |
| terning | Two cards "en" (blue) and "et" (red) with sparkles (not a die) | En/Et |
| slik | Blue and red candy blobs joined (twins) | Konjunktioner |
| lup | Magnifying glass with spectacles | Ordstillingsdetektiven |
| net | Blue and red capsule joined by a gold ring (connector) | Forbindeord |
| kiste | Wooden treasure chest with a lock and a small scroll | Idiomjæger |
| tandhjul | Grey gears with an "A" card (workshop) | Bøjningsværkstedet |
| ur | Two chat bubbles joined by a red chain link (NOT a clock) | Adverbier |
| bog | White "?" speech bubble with a blue person (NOT a book) | Pronomenmysteriet |
| tidsstjerne | Gold star with eyes (the "time machine" star) | Tidsmaskinen |

Names still misleading (kept so existing uses work): `ur`, `bog`, `terning`, `net`, `slik`. Use the new sprites for the missing roles instead of stretching these names (section 7).

## 2. Current usage (mode menus and headers)

"Dens." F = flat 16px family, S = shaded 32px family. A row that has both is marked MIX.

| Game / screen | Slot (mode) | Sprite now | Dens. | Role now |
|---|---|---|---|---|
| Antonymer menu | Vælg modsætningen | modsat | S | quiz (duplicates the header sprite) |
| | Find par | snegl | F | pairs |
| | Omvendt oversættelse | molle | F | translation |
| | Det manglende ord | cykel | F | typing |
| | Hurtigrunde | stjerne | F | speed |
| | Gentag fejlene | hjerte | F | review |
| | Øv efter emne | pokal | F | category |
| | Øv efter sværhedsgrad | hat | F | difficulty |
| Antonymer HUD chips | level / xp / streak / accuracy | pokal / stjerne / hjerte / flag | F | stats (streak is a heart, accuracy is a flag) |
| Præpositioner menu | Udfyld hullet | pin | S | typing (equals header) |
| | Flervalg | stjerne | F | quiz |
| | Træk og slip | cykel | F | drag |
| | Find fejlen | hat | F | error-hunt |
| | Ret sætningen | snegl | F | correct |
| | Oversættelse | flag | F | translation |
| | Forvekslingspar | hjerte | F | confusable pairs |
| | Lynrunde | molle | F | speed |
| | Gentag fejl | snegl | F | review (same as "Ret sætningen") |
| | Statistik | pokal | F | stats |
| Magiske Verber menu | Verbumarenaen | hat | F | quiz |
| | Tidsmaskinen | snegl | F | time/tense |
| | Førnutidsbyggeren | cykel | F | build |
| | Laboratoriet (uregelmæssige) | hjerte | F | irregular verbs |
| | Sætningsværkstedet | molle | F | repair |
| | Verbumdetektiven | flag | F | error-hunt/detective |
| | Hurtigduellen | stjerne | F | speed |
| | Blandet repetition | pokal | F | mixed |
| | Difficulty Nem / Mellem / Svær | snegl / cykel / molle | F | difficulty |
| Idiomjæger menu | Lærings-tilstand | molle | F | learn |
| | Øve-tilstand | stjerne | F | practice |
| | Spil | cykel | F | games hub |
| | Svage Idiomer | hjerte | F | review/weak |
| | Statistik | pokal | F | stats |
| | Idiom-ordbog | hat | F | dictionary |
| Idiomjæger streak / coins | streak `molle`, coins `stjerne`, lives `hjerte` | | F | chips (fine) |
| Idiomjæger achievements | 9 badges | stjerne, kort, kiste, pokal, lup, molle, pin, bog, flag | MIX | badge (one meaning per sprite lost) |
| Dansk Mester modes | Flervalg / Vendekort / Find par / Tidsudfordring / Blandet / Intervalrepetition / Svage ord | stjerne / snegl / hjerte / cykel / molle / pokal / hat | F | quiz / flip / pairs / speed / mixed / review / weak (molle here is "mixed", elsewhere "streak") |
| Dansk Mester chrome | header brand `flag`; chips xp `stjerne`, streak `molle`; bottom nav Hjem `snak`, Statistik `pokal`, Emblemer `stjerne` | | MIX in nav | identity wrong (portal card = snak); nav mixes S and F |
| Dansk Mester badges | 9 badges | stjerne, pokal, hjerte, snegl, molle, cykel, hat, flag, snak | MIX | badge |
| En/Et menu | 11 slots | already re-picked (D-ENET, decision #8), all S | S | see section 3 |
| Tidsmaskinen / Bøjningsværkstedet / Pronomenmysteriet / Glosekort / Forbindeord / Konjunktioner / Ordstillingsdetektiven / Adverbier | mode lists are text-only buttons | none | | no mode sprites, identity only (section 4) |

Cross-game meaning clashes (QA-061): `hat` = quiz arena, error-hunt, difficulty, dictionary, weak words, empty state. `molle` = translation, speed, repair, learn, mixed, streak, hard. `snegl` = pairs, review, correct, time, flip, easy. `pokal` = stats, mixed, category, SRS, level, results. `flag` = accuracy, translation, detective, header, "continue", Danish.

## 3. The map (one sprite per role)

Rule: a mode row uses ONLY the shaded 32px family. Each role has one sprite; a sprite has one role (identity use on its own game's header/portal card is allowed in addition). Where the En/Et re-pick (owner-approved, decision #8) differs, En/Et wins inside En/Et and is listed.

| Role | Sprite | Why | Used for |
|---|---|---|---|
| quiz / multiple choice | `bog` ("?" bubble) | question | Flervalg, Vælg modsætningen, Verbumarenaen, En/Et Style: Quiz (same) |
| typing / fill-in | `snak` (bubble with typing dots) | you type | Udfyld hullet, Det manglende ord, En/Et Dronningens gåder (same) |
| pairs / matching | `net` (two halves joined by a ring) | join two | Find par everywhere, En/Et Find par (same) |
| speed / timed | `stopur` | stopwatch (was `tryllestav`, a compromise; En/Et Kaninens ræs may keep its pick or move to `stopur`) | Hurtigrunde, Lynrunde, Hurtigduellen, Tidsudfordring, En/Et Kaninens ræs (same) |
| review / weak spots | `lup` | find weak points | Gentag fejl(ene), Svage ord/Idiomer, En/Et Svage ord (same) |
| flip cards | `vend` | card with turn arrow | Vendekort, Lærings-tilstand, irregular verbs card. En/Et exception: Vendekort = `terning` (kort is already En/Et Flertal) |
| mixed / random | `bland` | crossing arrows (was `terning`, which is En/Et's identity) | Blandet repetition, Øve-tilstand |
| translation / direction | `modsat` (two opposite arrows) | EN to DA | Oversættelse, Omvendt oversættelse. En/Et Spejlordene (same sprite, "opposite") |
| confusable / twin pairs | `slik` (twins) | twins | Forvekslingspar. En/Et Tvillingordene (same) |
| error-hunt / detective | `pin` (marks the spot) | mark the faulty word. En/Et Bestemt form also `pin` ("this one exact thing"); same idea | Find fejlen, Verbumdetektiven |
| repair / correct / tools | `tandhjul` | workshop | Ret sætningen, Sætningsværkstedet, games hub (Idiomjæger Spil) |
| build sentence | `ur` (chat bubbles + chain) | linked sentence parts | Førnutidsbyggeren (Adverbier is the "Sætningsbyggeren") |
| time / tense | `tidsstjerne` | Tidsmaskinen identity | Magiske "Tidsmaskinen", Tidsmaskinen header |
| collection / category / dictionary / SRS box | `kiste` | chest = Leitner box, topic set | Øv efter emne, Idiom-ordbog, Intervalrepetition |
| definite form | `pin` | En/Et only | Bestemt form |
| plural | `kort` | En/Et only (two cards) | Flertal |
| difficulty | `stjerne` x1/2/3 at one scale | stars, now 32px shaded like the rest | Nem/Mellem/Svær, Øv efter sværhedsgrad |
| stats | `statistik` | bar chart (`pokal` stays for level / results / achievements) | Statistik, results hero |

Chip/HUD context (scale 2 = 32px box; all sprites share one density now):
- `molle` = streak only, `hjerte` = lives only, `stjerne` = XP / coins / reward star, `pokal` = level, results and achievement badges only, `flag` = Danish / language only (never accuracy: use text "%"), `polle` = brand / home only.
- Badge grids use `stjerne` and `pokal` only (one density), not nine different sprites.
- `snegl`, `cykel`, `hat` are retired from mode rows (no meaning, `cykel` and `hat` unreadable in dark mode). `hat` is still used by the frozen portal empty state.

### Differences from the En/Et choice
All En/Et picks are kept as the map (Quiz `bog`, Vendekort `terning`, Find par `net`, speed `tryllestav`, Bestemt form `pin`, Flertal `kort`, Svage ord `lup`, En/et `terning`, Spejlordene `modsat`, Tvillingordene `slik`, Dronningens gåder `snak`). The only deviation is the generic role "flip cards" = `kort`; in En/Et the owner-approved `terning` wins (En/Et only). `terning` is "mixed" everywhere else.

## 4. Header / identity rule
Header and title sprite = the sprite of the game's portal card (`index.html:241-267`): Antonymer modsat, Glosekort kort, Magiske tryllestav, Præpositioner pin, Dansk Mester snak, En/Et terning, Konjunktioner slik, Ordstillingsdetektiven lup, Forbindeord net, Idiomjæger kiste, Bøjningsværkstedet tandhjul, Adverbier ur, Pronomenmysteriet bog, Tidsmaskinen tidsstjerne. One title per screen; both slots use the same sprite. `polle` is the SJOVT DANSK bar logo only.

## 5. Per-game application table (blueprint for game workers)

| File : line | Slot | Now | Target |
|---|---|---|---|
| `tidsmaskinen/index.html:158` | header brand | ur | tidsstjerne |
| `tidsmaskinen/index.html:165` | start h1 | ur | tidsstjerne |
| `boejningsvaerkstedet/index.html:366` | header brand (duplicate title) | molle + text | remove the brand title (keep `:373` h1 with `tandhjul`) or, if the bar needs a brand, `tandhjul`; one title only |
| `boejningsvaerkstedet/index.html:373` | start h1 | tandhjul | keep |
| `boejningsvaerkstedet/index.html:650` | empty state | hat | `tandhjul` (hat is retired) |
| `pronomenmysteriet/index.html:119,126` | brand and h1 | bog, bog | sprite OK; title is duplicated (VIS-021), keep one |
| `danske-phraser/dansk-mester.html:757` | header brand | flag | snak |
| `danske-phraser/dansk-mester.html:802` | "Fortsæt" card | flag | snak |
| `danske-phraser/dansk-mester.html:865` `MODE_SPR` | modes | mc stjerne, flash snegl, match hjerte, timed cykel, mixed molle, sr pokal, weak hat | `{mc:'bog',flash:'kort',match:'net',timed:'tryllestav',mixed:'terning',sr:'kiste',weak:'lup'}` (all S) |
| `danske-phraser/dansk-mester.html:879` | mode emblem | data-scale 4 | keep |
| `danske-phraser/dansk-mester.html:764-765` | bottom nav | snak, pokal, stjerne at scale 2 | `polle`, `pokal`, `stjerne` (one flat family, scale 2) |
| `danske-phraser/dansk-mester.html:759-760,533` | chips | stjerne, molle | keep (xp, streak) |
| `danske-phraser/dansk-mester.html:789` | path cards | cykel (verbs) / snegl | `kort` (verbs) / `snak` (expressions) |
| `danske-phraser/dansk-mester.html:1261` `BADGE_SPR` | badges | 9 mixed | `['pokal','stjerne']` cycle (one density) |
| `danish-antonyms-game.html:1428-1435` `MODES.emoji` | modes | modsat, snegl, molle, cykel, stjerne, hjerte, pokal, hat | choice `bog`, match `net`, reverse `modsat`, missing `snak`, speed `tryllestav`, review `lup`, category `kiste`, difficulty `stjerne` (BLOCKED, see 6) |
| `danish-antonyms-game.html:317-320` | HUD chips | pokal, stjerne, hjerte (streak), flag (acc) | pokal, stjerne, `molle` (streak), no sprite for accuracy (text "%") |
| `dansk-praepositioner.html:863` `MODE_SPR` | modes | fill pin, mc stjerne, drag cykel, mistake hat, correct snegl, trans flag, pairs hjerte, speed molle, review snegl, stats pokal | `{fill:'snak',mc:'bog',drag:'tandhjul',mistake:'pin',correct:'ur',trans:'modsat',pairs:'slik',speed:'tryllestav',review:'lup',stats:'pokal'}` (see note) |
| `magiske_verber.html:729` `GAME_SPR` | game cards | arena hat, timemachine snegl, perfect cykel, irregular hjerte, repair molle, detective flag, speed stjerne, mixed pokal | `{arena:'bog',timemachine:'tidsstjerne',perfect:'ur',irregular:'kort',repair:'tandhjul',detective:'pin',speed:'tryllestav',mixed:'terning'}` |
| `magiske_verber.html:741` `DIFF_SPR` | difficulty | snegl, cykel, molle | stars 1/2/3 (`stjerne`, same scale) |
| `idiomjaeger.html:688-693` | main menu | molle, stjerne, cykel, hjerte, pokal, hat | learn `kort`, practice `terning`, Spil `tandhjul`, Svage `lup`, Statistik `pokal`, Idiom-ordbog `kiste` |
| `idiomjaeger.html:661-669` `ACHS.ico` | badges | 9 mixed | `stjerne` / `pokal` only |
| `en og et/index.html:305-361` | 11 slots | done in D-ENET | no change |
| `adverbs.html:367`, `danish-antonyms-game.html:311`, `forbindenor/Forbindenor.html:214`, `konjunktioner/konjunktioner.html:273`, `ordstilling-detektiv/index.html:291`, `danish_flashcards/danish_flashcards_game/index.html:76`, `idiomjaeger.html:308`, `dansk-praepositioner.html:264`, `magiske_verber.html:273` | identity | ur, modsat, net, slik, lup, kort, kiste, pin, tryllestav | already match the portal, no change |

Note on Præpositioner: 10 rows need 10 distinct 32px sprites. `drag` has no matching sprite; least bad is `tandhjul` (move the parts), and `correct` takes `ur` (reassemble the sentence). The header `pin` no longer repeats in the grid because `fill` becomes `snak`.

## 6. Was BLOCKED, now resolved
All items of the old BLOCKED list are resolved by the redraw and the four new sprites (stats = `statistik`, speed = `stopur`, flip = `vend`, mixed = `bland`, chips and difficulty are 32px shaded, `cykel` and `hat` are visible in dark mode). Still frozen and unchanged: portal `index.html:216` (empty-state `hat`) and `:228` (footer `flag`).

## 7. Change list for the approximate uses (game menus are not rewritten yet)

| Where | Slot | Now | Replace with |
|---|---|---|---|
| Antonymer `MODES.emoji` | Hurtigrunde | stjerne / tryllestav | `stopur` |
| | Øv efter sværhedsgrad | hat | `stjerne` (stars) |
| | Statistik (if present) | pokal | `statistik` |
| Præpositioner `MODE_SPR` | speed | molle / tryllestav | `stopur` |
| | stats | pokal | `statistik` |
| Magiske Verber `GAME_SPR` | Hurtigduellen | stjerne / tryllestav | `stopur` |
| | Blandet repetition | pokal / terning | `bland` |
| Idiomjæger menu | Øve-tilstand (mixed) | terning | `bland` |
| | Statistik | pokal | `statistik` |
| Dansk Mester `MODE_SPR` | timed | cykel / tryllestav | `stopur` |
| | mixed | molle / terning | `bland` |
| | flash (Vendekort) | snegl / kort | `vend` |
| Dansk Mester bottom nav | Statistik | pokal | `statistik` |
| En/Et | Kaninens ræs (speed) | tryllestav | `stopur` (optional, owner call) |
| | Vendekort | terning | `vend` (optional; today `terning` is its identity pick) |
| Anywhere | clock / timer meaning | `ur` | `stopur` (`ur` is two chat bubbles and a chain; Adverbier identity only) |
| Anywhere | random / shuffle meaning | `terning` | `bland` (`terning` stays En/Et identity) |
| Anywhere | pairs meaning | `net` | keep (it is Forbindeord identity and reads as "join") |
| Anywhere | twins meaning | `slik` | keep for Konjunktioner / Forvekslingspar |
| Anywhere | quiz meaning | `bog` | keep (a "?" bubble; name is misleading, art is right) |

Chip scale changes already applied in this task (32px grids grow smaller old footprints): `konjunktioner` lives `hjerte` 3 to 2, `idiomjaeger` memory card back `stjerne` 3 to 2, `ordstilling-detektiv` result `pokal` and `stjerne` 3 to 2, `danish_flashcards` result `pokal` 5 to 4. Chips at scale 2 are now 32px boxes (were 18-22px for stjerne/hjerte/pokal) and cannot go smaller; checked at 360px, no overflow.
