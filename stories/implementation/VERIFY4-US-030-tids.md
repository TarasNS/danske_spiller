# VERIFY4 US-030 - Tidsmaskinen slice (verifier V4-F)

Scope: `tidsmaskinen/index.html` diff b9242ca..HEAD (button at line 161, handler 305-315; 12 added lines, nothing else). Own scripts in scratchpad `impl/V4-F/us030.mjs` (Edge, file://, seeded localStorage).

| Criterion | Result | Evidence |
|---|---|---|
| Each game has a visible reset, at least 44x44, keyboard-operable (Tidsmaskinen) | PASS | `#btn-reset` "NULSTIL" in `.topbar`, right after `#btn-sound` (LYD); measured 91.2x48 at 390 and 1440, 85.2x48 at 360 (flex-shrunk, still >=44). aria-label/title "Nulstil fremskridt". Focus + Enter opens the dialog; Space opens it too. smoke "tap targets >=44px" PASS at all 4 viewports. |
| A Danish confirm() appears. Cancel changes nothing | PASS | Dialog text "Nulstil al fremgang i Tidsmaskinen? Det kan ikke fortrydes." Full localStorage snapshot before vs after dismiss: identical (JSON equal). |
| Accept clears only that game's namespace | PASS | Seeded `srs:tidsmaskinen`, `tidsmaskinen:totalCorrect|hintDone|timed|sound|mode|levels`, `srs:other`, `other:key`. After accept: srs/totalCorrect/hintDone/timed removed; `tidsmaskinen:sound`, `:mode`, `:levels`, `srs:other`, `other:key` kept. After reload keys stay gone. "Med tid" chip re-locked (aria-disabled true, Træning pressed), start screen rebuilt, mode (4 Fremtidsværkstedet) and level (B1) selection kept. Reset mid-round returns to start screen, no console errors. |
| It works when storage is blocked (no crash) | PASS | localStorage getter throws: click NULSTIL + accept -> 0 console/page errors, start screen visible. smoke "localStorage blocked: no crash" PASS. |
| (extra) no h-scroll at 360/1440, no overlap in topbar | PASS | scrollWidth<=clientWidth at 360 and 1440; screenshot `top-small.png`: MØRK / LYD / NULSTIL fit in one row (LYD label wraps to two lines at 360 because "LYD ✗" is wider; cosmetic). |

Regressions: none found. `node tests/smoke.mjs tidsmaskinen/index.html`: Verdict PASS. Full `tests/tidsmaskinen.mjs`: 152/153 (only failure was the timing row "auto-advance 700-1000 ms" max 1591 while I ran other browsers in parallel; re-run alone with `--only=rounds`: 46/46 PASS, min 833 max 1059).
Scope creep: none. Key names unchanged.
UNCERTAIN (native): confirm wording is plain and fine; implementer asked for sign-off.

Verification: VERIFIED (Tidsmaskinen slice; wording sign-off by a native speaker still advisable but not blocking)
