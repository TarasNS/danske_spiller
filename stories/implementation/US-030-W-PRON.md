# US-030 — slice W-PRON (Pronomenmysteriet)
1. Summary: new "NULSTIL" button (aria-label/title "Nulstil fremskridt", 91x48 px) in the topbar next to MØRK/LYD, shown on the start screen only. Click asks `confirm('Vil du nulstille alle fremskridt? Det kan ikke fortrydes.')` (same wording as magiske_verber / flashcards). Cancel does nothing; accept empties the in-memory SRS state and removes only `srs:pronomenmysteriet` via `DanskCore.store.remove` (mode/level/sound prefs kept), then announces "Fremskridt nulstillet." Key names unchanged.
2. Status: IMPLEMENTED
3. Tests: `node tests/pronomenmysteriet.mjs` (OUT redirected to scratchpad, no dump left): final run 64/66. Remaining FAILs: "subject_object: auto-advance ~800ms" (timing flake: machine loaded by parallel workers, samples 881-1541 ms; earlier run showed 15 s outliers) and "Space toggles a chip" (test bug: puppeteer key name `Space` is invalid, should be `" "`; not a game defect). Own checks: scratchpad `impl/W-PRON/chk.mjs`, all PASS.
4. Manual: confirm text, cancel, accept via keyboard Enter, reload shows empty srs, other localStorage keys untouched, storage-blocked page (getter throws) no page error.
5. Files: `pronomenmysteriet/index.html` (reset button in topbar ~L121; reset handler ~L249; `show()` ~L325 toggles reset; `buildRound` ~L348; answer focus ~L520; `finishRound` ~L405; summary focus line removed), `shared/themes/pronomenmysteriet.css` (opt aria-disabled rules, SPIL margins, confetti z-index, ~L72-79 and ~L122-126).
6. Risks: only the SRS record is cleared, not prefs (judged "progress"); reset affects all modes (single shared srs key).
7. Newly discovered: none.
8. Native review: wording copied from existing games.
9. Criteria:
- Each game has a visible reset, at least 44×44, keyboard-operable. — PASS (Pronomenmysteriet; other games: other owner)
- A Danish confirm() appears. Cancel changes nothing. — PASS
- Accept clears only that game's namespace. — PASS
- It works when storage is blocked (no crash). — PASS
