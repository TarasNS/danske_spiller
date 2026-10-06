# US-030 - Tidsmaskinen slice (W-TIDS)

## 1. Summary
Added a "NULSTIL" button (aria-label/title "Nulstil fremskridt", 91x48 px) in the top bar next to MORK/LYD in `tidsmaskinen/index.html`. Click/Enter/Space opens `window.confirm('Nulstil al fremgang i Tidsmaskinen? Det kan ikke fortrydes.')` (in try/catch). Cancel = nothing changes. OK removes `srs:tidsmaskinen` and `tidsmaskinen:totalCorrect|hintDone|timed`, reloads in-memory SRS state, locks "Med tid" again and rebuilds the start screen (returns to start if pressed mid-round). Sound, mode and level preferences, dark mode and other games' keys are kept. No key names changed. Storage failures are swallowed by DanskCore.store / try-catch.
Status: IMPLEMENTED

## 3. Tests
- Own puppeteer check (Edge, file://): cancel keeps srs + totalCorrect (srs true, totalCorrect '15'); accept -> srs null, totalCorrect null, `tidsmaskinen:sound` kept, `srs:other` kept; keyboard (focus + Enter) opens the dialog; storage-blocked (localStorage getter throws) click -> no console errors, game still present. Dialog text verified.
- Layout: reset button 91x48, no h-scroll at 360 and 1440, no tap target <44.
- `node tests/smoke.mjs tidsmaskinen/index.html`: Verdict PASS (all rows).
- `tests/tidsmaskinen.mjs`: see US-050-W-TIDS.md section 3.
## 4. Manual verification: screenshots of top bar at 360 px (no overlap).
## 5. Files: `tidsmaskinen/index.html` lines ~161 (button), ~306-316 (handler).
## 6. Risks: reset also re-locks "Med tid" (needs 10 correct answers again) - intended since totalCorrect is cleared. Uses native confirm() (allowed by the story).
## 7. Newly discovered issues: none.
## 8. Needs native review: confirm wording "Nulstil al fremgang i Tidsmaskinen? Det kan ikke fortrydes."
## 9. Acceptance criteria
- Each game has a visible reset, at least 44x44, keyboard-operable: PASS (Tidsmaskinen; other games: other owner)
- A Danish confirm() appears. Cancel changes nothing: PASS
- Accept clears only that game's namespace: PASS
- It works when storage is blocked (no crash): PASS
