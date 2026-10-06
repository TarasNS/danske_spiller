# US-030 — W-ENET slice (En/Et)
1. Summary: En/Et had no reset (checked). Added a visible "Nulstil fremskridt" button under the level filter in the menu (`#resetBtn`, min 44x44, native button so keyboard-operable). Click shows a Danish `confirm()`; Cancel changes nothing; OK removes only `en_et_traener_v1` (which includes the streak field `ws`), resets in-memory progress and refreshes the Svage ord card. confirm and removeItem are in try/catch so blocked storage does not crash.
2. Status: IMPLEMENTED
3. Tests: own puppeteer probe (Edge, scratchpad `impl/W-ENET/t.cjs`) at 360/390/1366, zero console/page errors; `tests/smoke.mjs "en og et/index.html"`: all rows PASS except the known legacy artefact (no `#btn-play`: 4x "play button found" + 3x "console clean + still playable"); contrast rows PASS, localStorage-blocked PASS. Files changed: `en og et/index.html`, `shared/themes/en-og-et.css` only (no git state changes). Probe: cancel kept the key; accept removed it (null); button 204x44 px.
4. Manual: drove menu reset via puppeteer with dialog dismiss then accept.
5. Files: `en og et/index.html` (reset-row/.reset-btn CSS, button in menu after cefr-filter, `resetProgress()` after `saveProgress`, click listener before the keydown listener); `shared/themes/en-og-et.css` (.reset-row/.reset-btn skin).
6. Risks: Confirm wording "Nulstil al fremgang i denne øvelse? Det kan ikke fortrydes." not natively reviewed. Reset not offered inside a running round (menu only).
7. Newly discovered: none.
8. Native review: the confirm wording.
9. Criteria (En/Et slice; other games = other owner):
- Each game has a visible reset, at least 44x44, keyboard-operable: PASS (En/Et)
- A Danish confirm() appears. Cancel changes nothing: PASS
- Accept clears only that game's namespace: PASS
- Works when storage is blocked (no crash): PASS (smoke blocked-storage row; code guarded)
