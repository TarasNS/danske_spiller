# US-030 (W-BOEJ slice) - Nulstil fremskridt in Bøjningsværkstedet

## 1. Implementation summary
A visible "Nulstil fremskridt" button sits on the start screen under SPIL (`#btn-reset`). It asks `confirm('Vil du nulstille alle fremskridt i Bøjningsværkstedet? Det kan ikke fortrydes.')`. Cancel (or a throwing confirm) does nothing. Accept empties the in-memory SRS state and removes only `srs:boejningsvaerkstedet` through `DanskCore.store.remove`; a visible status "Fremskridt nulstillet." is shown and announced. Preferences (`boejningsvaerkstedet:mode/levels/sound`) are kept. No key names changed. Deviation: the button is not in the topbar next to LYD/MØRK (a long label would overflow at 360 px); it is on the start screen.

Status: IMPLEMENTED

## 3. Tests run
Own puppeteer script (`scratchpad/impl/W-BOEJ/t4.mjs`, Edge): reset >=44x44 (231x48) PASS; cancel keeps `srs:` key PASS; accept removes it PASS; prefs kept PASS; status text PASS; Enter on focused button opens confirm PASS; no console errors PASS; with `localStorage` getter throwing, click + accept raises no error PASS. `tests/smoke.mjs ../boejningsvaerkstedet/index.html`: PASS (28/28 rows).

## 4. Manual verification
Screenshot at 360x740 checked (start screen layout).

## 5. Files changed
- `boejningsvaerkstedet/index.html`: reset markup in start card (~line 385-389), handler before the `btn-play` listener (~515-528).
- `shared/themes/boejningsvaerkstedet.css`: `.reset-row`, `.reset-status` (end of file).

## 6. Remaining risks
Reset empties `srsState` by reassigning `items`/`patterns` (same object, used by closures); verified by reload-free test only via storage check.

## 7. Newly discovered issues
None.

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| Each game has a visible reset, at least 44×44, keyboard-operable. | PASS (Bøjningsværkstedet); others: other owner |
| A Danish `confirm()` (or accessible dialog) appears. Cancel changes nothing. | PASS (Bøjningsværkstedet) |
| Accept clears only that game's namespace (`DanskCore.store` / the game's LS key). | PASS (only `srs:boejningsvaerkstedet`) |
| It works when storage is blocked (no crash). | PASS (Bøjningsværkstedet) |
