# US-031 — Antonymer slice (W-ANT)

1. **Summary.** Added `focusEl()` (focus with preventScroll). `showScreen(name, noFocus)` now focuses after the screen is visible: summary -> "Spil igen" (`#sumAgain`), other screens -> first back-link / mode button / button; the play screen focuses its own control; initial load does not steal focus. Each render focuses its first control: first option (choice/reverse/speed), the text input (missing), first left word (Find par). After an answer: normal modes focus Fortsæt (existing `revealNext`); speed mode focuses `#feedbackArea` (now `tabindex="-1"`) because answered options are disabled, and the next render refocuses.
   Real bug found and fixed: pressing Enter in the typed-answer field submitted on keydown, focus moved to Fortsæt, and the same Enter's keypress then clicked Fortsæt, so the feedback vanished immediately (HEAD version: one Enter -> no feedback, next question). The keydown handler now calls `preventDefault()` and ignores a disabled input.
2. **Status:** IMPLEMENTED
3. **Tests.** Own puppeteer keyboard drive at 390x844, 0 page/console errors. activeElement: choice render = option; after answer = `#nextBtn`; Enter on Fortsæt -> next option; speed after answer = `#feedbackArea`; speed end and Find par end = `#sumAgain`; missing render = input; after typed Enter = `#nextBtn` (HEAD: input, feedback skipped), second Enter advances (asked=1) and refocuses input; Find par render = first match item; quit -> first mode button. BODY only on first page load (intended). `smoke.mjs`: only known artefact rows fail (no `#btn-play`).
4. **Manual.** Keyboard drive as above.
5. **Files.** `danish-antonyms-game.html`: `focusEl`/`showScreen`, `renderChoice`, `renderReverse`, `renderMissing`, `renderMatch`, `showFeedback` speed branch, `#feedbackArea` markup.
6. **Risks.** `showScreen` now moves focus on every screen change (settings/review/category too).
7. **Newly discovered.** The Enter double-activation (fixed here).
8. **Needs native review.** None.
9. **Acceptance.**
- In every listed game, activeElement is never BODY after an answer, screen change or summary: PASS for Antonymer (others = other owner)
- Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen": other owner
- Adverbier modals use DanskCore.ui.focusTrap: other owner
- Enter on the focused Next control advances in Antonymer: PASS
