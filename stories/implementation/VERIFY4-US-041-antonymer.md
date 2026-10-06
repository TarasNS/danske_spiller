# VERIFY4 US-041 - Antonymer slice (verifier V4-B)

Files: `danish-antonyms-game.html` (`later`/`clearPending`, `endSession`, `nextQuestion`, `showFeedback`, `renderMatch`, `startSpeedTimer`). Script `impl/V4-B/ant.cjs` at 390x844, with a `b9242ca` copy for comparison.

| Criterion | Result | Evidence |
|---|---|---|
| Each listed timer id is stored and cleared in quit/end handlers (Antonymer) | PASS | Diff: the 650 ms speed advance and the 500 ms Find par summary delay go through `later()` into `pendingTimers`; `endSession()` (called by quit, `showSummary`, speed end) runs `clearPending()` and sets `session.over`; `startSession` clears too; `nextQuestion` returns when `session.over`; the speed interval stops itself on `session.over`. |
| Repro: speed answer then Afslut within 650 ms | PASS | `#playArea` innerHTML identical 1.2 s later, play screen hidden, focus on `.mode-btn`, 0 errors. |
| Repro: speed round ended by the timer with an answer pending | PASS | Summary visible, `#playArea` unchanged 1.2 s later (no hidden render). |
| Repro: Find par last pair then Afslut within 500 ms | PASS | Dashboard stays visible, summary hidden 900 ms later. |
| No progress write, no pageerror | PASS | 0 console/page errors across all drives; `state` unchanged by hidden renders. |

Not reproduced on baseline: the baseline copy also showed no visible change in my speed repro (a hidden render needs the right timing), so the before-capture is by code reading only (an untracked 650 ms timeout calling `nextQuestion`). Cosmetic 200/400 ms class-toggle timeouts in Find par remain untracked (harmless).
Regressions: none. Scope creep: none. UNCERTAIN: none.

Verification: VERIFIED
