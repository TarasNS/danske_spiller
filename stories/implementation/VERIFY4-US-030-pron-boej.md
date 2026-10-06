# VERIFY4 US-030 (Pronomenmysteriet + Bøjningsværkstedet slice) - Nulstil fremskridt

Verifier V4-A. Scripts: scratchpad `impl/V4-A/pron.mjs`, `pron2.mjs`, `boej.mjs` (Edge, file://). Baseline `b9242ca` has no reset control in either game (the diff shows it is new).

| Criterion | Result | Evidence |
|---|---|---|
| Each game has a visible reset, at least 44x44, keyboard-operable. | PASS | Pron: `#btn-reset` "NULSTIL" in the topbar next to MØRK/LYD, 91x48 px, visible on the start screen at 1366x768 / 390x844 / 360x640 / 360x740 (right edge 348 at 360 wide, no h-scroll); hidden on the play screen (`show()` toggles `.hidden`). Boej: `#btn-reset` "Nulstil fremskridt" under SPIL, 232x48 px, reachable by scrolling at 360x640 (reset 504-552 when scrolled to the end; the sticky SPIL does not overlap it, `overlap:false` at all 4 viewports). Both opened from the keyboard: focus + Enter fired the confirm (script rows "accept (Enter)"). |
| A Danish `confirm()` (or accessible dialog) appears. Cancel changes nothing. | PASS | Captured `window.confirm` text: Pron "Vil du nulstille alle fremskridt? Det kan ikke fortrydes."; Boej "Vil du nulstille alle fremskridt i Bøjningsværkstedet? Det kan ikke fortrydes." Returning false: localStorage key list identical before/after. A throwing confirm counts as cancel (code, both games). |
| Accept clears only that game's namespace (`DanskCore.store` / the game's LS key). | PASS | Pron (mode+level changed first so prefs exist): keys before `srs:pronomenmysteriet, pronomenmysteriet:levels, pronomenmysteriet:mode`; after accept `pronomenmysteriet:levels, pronomenmysteriet:mode` (only the srs key removed, prefs kept). Boej: before `srs:boejningsvaerkstedet`, after `[]` (no prefs set in that run; code removes only `srs:` + GAME_ID through `DC.store.remove`). After reload no `srs:` key; a new round plays with no console error. In-memory `srsState.items/patterns` is emptied so old progress is not rewritten. Key names unchanged (`git diff`). |
| It works when storage is blocked (no crash). | PASS | `localStorage` getter throwing (via `evaluateOnNewDocument`): click reset + accept, then play and answer: zero page errors in both games. `tests/smoke.mjs` "localStorage blocked: no crash" PASS for both. |

## Notes
- Placement: the story's implementation note says "start screen next to LYD/MØRK". Pron follows it (topbar, start screen only). Boej puts it under SPIL (start screen) because the long label would overflow the 360 px topbar. The acceptance criteria do not require a position; judged acceptable.
- Pron gives only an `announce` (no visible status); Boej also shows a visible "Fremskridt nulstillet." status.
- Regressions: none seen (smoke PASS both; zero console issues in all my runs). Scope creep: none in this slice.

Verification: VERIFIED (Pronomenmysteriet and Bøjningsværkstedet slice only; the other three games belong to other verifiers)
