# US-037 — W-GLOSE slice (Glosekort mobile filter)
1. Summary: at <=480 px the level-chip row (#cefr-filter) is moved by JS (matchMedia, live) from the sidebar to above the scoreboard/card in .main-content; moved back on wider screens. CSS: compact gap/padding, 44 px min targets kept.
2. Status: IMPLEMENTED
3. Tests: puppeteer at 360x740: filter top y=168 (height 44), card top y=366, scrollWidth 360, no console errors. At 1000 px filter stays in sidebar.
4. Manual: screenshot checked via script (no visual sign-off by human).
5. Files:
- `danish_flashcards/danish_flashcards_game/script.js` (aria-label ~L264; filter handler + `buildCefrFilter` matchMedia block; `renderVerbList`; `nextUnanswered`/`skipToUnanswered`/`goToNext`/advance lock ~L552-625; wrong/right handlers; init; Sjovt hook checks)
- `shared/themes/flashcards.css` (li/button rules ~L45-55, 480px media block)
6. Risks: filter row adds ~52 px above the card on phones (card moves down).
7. Newly discovered: filter chips have no aria-pressed (not fixed).
8. Native review: n/a
9. Criteria: "Glosekort shows a compact level-chip row above the card at <=480 px" - PASS. Other criteria in the story - other owner.

Smoke (smoke.mjs): all PASS except the 4 "#btn-play found" and 3 "console clean + still playable" rows, the known artefact (no #btn-play in this legacy-style game).
