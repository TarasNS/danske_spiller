# US-028 (Ordstilling slice) - W-ORD
Status: IMPLEMENTED. `ordstilling-detektiv/index.html`: "Finish ▸/Next ▸" now "Afslut ▸/Næste ▸" (showExplain). No other English UI strings in this file (grep: no CORRECT/WRONG/Continue/Check/Pronounce; TTS aria is "Lyt til sætningen").
Tests: puppeteer drive of a full 12-question case at 390x844: nextBtn text "Næste ▸", last "Afslut ▸"; 0 console/page errors. Smoke: only the known "#btn-play not found"/"still playable" legacy-selector artefacts fail.
Criteria: "Every string listed is replaced" PASS (this file's row); grep zero hits PASS for this file (other games: other owner); Danish accessible names PASS for this file.
Risks: none. Newly discovered: none.
