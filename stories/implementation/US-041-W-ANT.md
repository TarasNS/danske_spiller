# US-041 — Antonymer slice (W-ANT)

1. **Summary.** New `later(fn,ms)` / `clearPending()` keep advance timeouts in `pendingTimers`: speed auto-advance (650 ms) and Find par summary delay (500 ms). `endSession()` (quit, summary, speed end) clears them and sets `session.over`; `startSession` clears too; `nextQuestion` returns when `session.over`; the speed interval stops itself when `session.over`.
2. **Status:** IMPLEMENTED
3. **Tests.** Puppeteer 390x844, 0 errors. Speed answer then Afslut within 650 ms -> `#playArea` unchanged 900 ms later, pendingTimers 0. Speed round ended by timer with an answer pending -> no hidden render after 900 ms. Find par last pair then Afslut within 500 ms -> stays on dashboard (no summary). `smoke.mjs`: only known artefact rows fail.
4. **Manual.** Drive as above.
5. **Files.** `danish-antonyms-game.html`: `later`/`clearPending` (after `QUESTIONS_PER_ROUND`), `startSession`, `endSession`, `nextQuestion`, `showFeedback`, `renderMatch`, `startSpeedTimer`.
6. **Risks.** Cosmetic 200/400 ms class-toggle timeouts in Find par stay untracked. I did not re-run the HEAD version for a before-capture; the bug is evident from the code (untracked 650 ms timeout calling `nextQuestion`).
7. **Newly discovered.** None.
8. **Needs native review.** None.
9. **Acceptance.**
- Each listed timer id is stored and cleared in quit/showStart/end handlers: PASS for Antonymer (others = other owner)
- Repro: no hidden render, no progress write, no pageerror: PASS for Antonymer
