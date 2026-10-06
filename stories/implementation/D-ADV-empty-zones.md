# D-ADV-empty-zones - Adverbier: hide empty topic zones (DECISIONS #3)

Owner: W-ADV. Status: IMPLEMENTED

## Summary
- `populateMap()` in `adverbs.html` now skips any zone with no entries (`!dataset.some(zone.filter)`), so Måde and Frekvens are no longer shown. Zones are derived from the data via each zone's existing filter; no zone names hard-coded. They reappear automatically when entries exist (also after CSV import, which already calls `populateMap()`).
- Unlock levels unchanged: the unlock index still comes from `zones.indexOf(zone)` in the full list, so Sted, Bindeord keep their old thresholds (levels 2 and 4 positions as before).
- Initial zone at load is the first zone that has entries (`zones.find(...) || zones[0]`); previously `zones[0]` (Tid), which is the same today.
- Header comment corrected: states the built-in dataset has only 10 entries (not ~500), that a CSV can load a larger list, and that zones show only while non-empty.
- Hiding (not "Kommer snart") chosen: least invasive, no layout/focus-order change; the map is a flex list of buttons.
- No CSS change needed (`shared/themes/adverbs.css` untouched). Dataset, unlock levels, scoring, storage keys unchanged.

## Tests (scratchpad `impl\d1-adv\`, Edge)
- Zone picker, real page, 1366x768 / 390x844 / 360x640: buttons = Tid, Sted(disabled), Bindeord(disabled), Sætningsbygning(disabled); no Måde/Frekvens; no horizontal scroll; 0 console errors. Locked state at level 0 is pre-existing.
- Copy of page with one temporary Frequency entry (`copy.html`, scratchpad only): Frekvens appears (in position, disabled at level 0 as before); no h-scroll; 0 errors.
- Level forced to 4 (`progress.level=4; populateMap()`) at 360x640: Tid, Sted, Bindeord start correctly; Sætningsbygning disabled (pre-existing, see issues); 0 errors.
- Keyboard (390): Tab order MENU, HJÆLP, darkToggle, importBtn, reviewBtn, settingsBtn, Tid, then the game; no stray stops.
- Blocked localStorage: 4 buttons, 0 errors.
- Smoke `node smoke.mjs ../adverbs.html`: all console/h-scroll/contrast/ring/blocked-storage rows PASS; only the 4 `#btn-play` rows and the 3 "still playable" rows FAIL (known legacy artefact: no `#btn-play`).
- Screenshots viewed (orig-360, copy-360); map sits below the fold at 360 px so verification of the buttons was by DOM query. Nothing repo-side left behind; `git status` shows `adverbs.html` as my only game change (other modified files belong to other workers).

## Files changed
- `adverbs.html`: header comment (lines 10-15), `populateMap` (~lines 692-695), initial `startZone` call in DOMContentLoaded (~line 1403).

## Risks
- If every zone but Sætningsbygning is empty, only that one shows (it is the catch-all). After a CSV import, `currentZone` may be a now-hidden zone; the existing empty-zone message handles it.

## Newly discovered issues (recorded only)
- Pre-existing: Sætningsbygning can never unlock (needs level 5, top level index is 4).
- Hiding zones leaves the current thresholds meaningful only by list position; adding Måde/Frekvens later changes nothing in unlocking.
