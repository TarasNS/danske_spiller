# US-028 — W-GLOSE slice (Glosekort)
1. Summary: flashcards speaker button accessible name "Pronounce" -> "Udtal". No other English UI strings in the game.
2. Status: IMPLEMENTED
3. Tests: puppeteer drive: `.speaker` aria-label = "Udtal"; console errors none. smoke.mjs run (see US-043 report).
4. Manual: grep of the game folder for Pronounce/CORRECT/WRONG/Continue returns no UI hits.
5. Files: script.js speakerBtn (1 line).
6. Risks: none.
7. Newly discovered: none.
8. Native review: "Udtal" is the string named in the story.
9. Criteria: every string listed (Glosekort row) - PASS; grep 0 hits (this game only; other games: other owner) - PASS for this slice; accessible names Danish - PASS for this slice.
