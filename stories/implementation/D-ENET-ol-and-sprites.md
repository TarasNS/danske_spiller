# D-ENET: decisions #7 (øl en/et) and #8 (mode sprites), W-ENET

Status: IMPLEMENTED (Task A and Task B); content/art choices need owner and native review (below).

## Task A: øl accepts en and et
- Data: `{w:"øl",a:"en",d:"øllen",a2:"et",d2:"ølet",p:"øl",...}`. New optional fields `a2` (second article) and `d2` (its definite form). Other words untouched.
- Three tiny helpers (before `pick()`): `artLabel(it)` ("en/et" if `a2`), `artOk(it,sel)`, `defTargets(it)`. Used in `showQuestion` (definite/plural prompt shows "en/et øl"), `answerArticle` (en/et, speed, weak: either button correct), `submitTyped` (definite accepts "øllen" or "ølet"; plural unchanged; wrong-answer text shows "øllen / ølet"). Sentence mode has no øl item. No change to storage key, US-012 streak, US-030 reset, US-034/047, explainer listener. Stats stay keyed by word (`enet:øl`, etc.).
- Note: "Både en øl og et øl bruges. Bestemt form: øllen / ølet."
- Tests (scratchpad `impl/d3-enet/t.cjs`, `t2.cjs`; Edge, 390x844): enet Et and En both correct, streak/ws 1 then 2; weak mode Et and En correct; speed Et and En correct (forced current=øl; speed picks random words); wrong word still wrong (bil + Et wrong, hus + Et right); definite "ølet" ok, "øllen" ok, "ølen" and "xyz" wrong; plural "øl" ok, "øler" wrong; other word (bil/bilen) unchanged; weak pool contained øl, after two correct answers (et, en) it cleared (ws=2); reload kept ws=2 and perItem keys enet/weak/definite/plural:øl; blocked localStorage: answer works, no errors; zero console/page errors. Smoke: only the known legacy rows fail (4x `#btn-play`, 3x "console clean + still playable"); contrast rows PASS (the 1.09 row did not appear this run).
- Quiz "styles" (mc/typing/flash/match) belong to the opposites/synonyms pair games and contain no en/et items, so they are not affected.

## Task B: sprite mapping (all existing Sjovt sprites, no new art, no frozen file edits)
Inventory (read from `shared/sjovt.js`, rendered in `impl/d3-enet/contact-sheet.png` and `contact-sheet-large.png`, light and dark): 16px-class flat: polle 16, snegl 14, molle 16, cykel 16, stjerne 9, hjerte 11, pokal 11, hat 12, flag 17; 32px shaded: modsat, kort, tryllestav, pin, snak, terning, slik, lup, net, kiste, tandhjul, ur, bog, tidsstjerne. Notably `ur` is two chat bubbles with a red chain link (not a clock); `net` is a blue/red capsule with a ring; `kort` is a "Vb." card over a red card; `bog` is a "?" bubble with a person.

| Slot | Before | After | Reason |
|---|---|---|---|
| En eller et? | terning | terning (kept) | the en/et card pair is literally the mode |
| Bestemt form | bog | pin | a pin marks one specific thing ("the" one) |
| Flertal | kiste | kort | two overlapping cards read as "more than one"; weak because of the tiny "Vb." label |
| Dronningens gåder | snak | snak (kept) | sentence/speech bubble |
| Spejlordene | modsat | modsat (kept) | two opposing arrows |
| Tvillingordene | slik | slik (kept) | two joined twin blobs |
| Kaninens ræs (speed) | ur | tryllestav | NO ACCEPTABLE SPRITE: no clock/stopwatch/bolt exists. Least bad 32px sprite (magician's wand, "pull a rabbit"). `cykel` fits race best but is 16px flat, rendered illegibly thin and mixes density (tried, rejected). |
| Svage ord | lup | lup (kept) | magnifier = find weak spots |
| Style: Quiz | pokal | bog | "?" question bubble; pokal is 11px flat and would mix density |
| Style: Vendekort | kort | terning | en/et words on cards read as flip cards, no verb label |
| Style: Find par | tandhjul | net | two halves joined by a ring = matching pair |

All 11 slots are now 32px shaded sprites (one density; the 16px pokal and cykel are gone). Contact sheet: `impl/d3-enet/contact-sheet.png`.
- Screenshots (`impl/d3-enet/menu-before-*.png`, `menu-after-*.png`, `sub-after.png`): 360x740, 390x844, 1366x768, light and dark. Looked at after-1366-light, after-360-dark, sub-after: sprites crisp (hard pixel edges, no blur), nothing clipped, cards the same size as before (64px emblem), no horizontal scroll (scrollWidth == viewport in all 6 shots), cards 308-592 px wide and >= 96 px tall (targets >= 44px). The greyed Svage ord card is unchanged.
- No change was needed in `shared/themes/en-og-et.css` (emblem rules are sprite-agnostic).

## Files changed
- `en og et/index.html`: øl data row (L566), helpers before `pick()`, `showQuestion` (2 lines), `answerArticle`, `submitTyped`, 11 `data-sd-sprite` values (L305-361).

## Risks and review
- Duplicates: header `.rule` terning and Vendekort now both use terning (header duplicate pre-existing); Flertal's kort carries a tiny "Vb." label.
- Speed icon is a compromise (see table); a real clock would need a new sprite (frozen file, US-038 art task).
- Needs native review: is the definite "øllen" correct? (the existing form is kept; "ølen" is rejected as wrong, "ølet" is accepted as the neuter form; I did not verify either against DDO). Note wording unchanged in spirit.
- Newly discovered: speed mode feedback after an answer has no wrong-note flow issues; none new.
