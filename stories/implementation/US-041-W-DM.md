# US-041 - W-DM slice (Dansk Mester)

1. Summary: the advance timer is stored as `G._adv` (finishAnswer 750/1500 ms; match next-round 1100 ms) and the miss-reset timer as `G._miss`. New `clearGameTimers()` is called from `quitGame()` and at the start of `startGame()` (so retry/new game cannot inherit an old timer). `nextQuestion()` and the match advance also return early if `G` or `#gamewrap` is gone.
2. Status: IMPLEMENTED
3. Tests: repro script: start MC, click an option, click "‹ Afslut" 100 ms later, wait 2.5 s: 0 pageerrors / console errors (the "before" error was not re-run here; taken from the story). Quit after a wrong match: no errors. Smoke as in US-028-W-DM.
4. Manual: none beyond the script.
5. Files: danske-phraser/dansk-mester.html (~921 startGame, ~935-936 helpers, ~938 nextQuestion, ~1021 finishAnswer, ~1108 match advance).
6. Risks: achievement-toast timeouts are not cleared (harmless).
7. Newly discovered: none.
8. Native review: none.
9. Criteria:
- Each listed timer id is stored and clearTimeout is called in quit/showStart/end handlers - PASS for Dansk Mester; other games other owner
- Repro scripts: no pageerror on a quick Afslut - PASS (Dansk Mester)
