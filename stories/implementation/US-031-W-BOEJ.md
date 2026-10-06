# US-031 (W-BOEJ slice) - Focus management in Bøjningsværkstedet

## 1. Implementation summary
- Summary: focus on "Spil igen" is now set in `finishRound()` after `show('summary')` (before it was set inside `renderSummary()` while the screen was still hidden, so it failed). Same order as `tidsmaskinen/index.html:891-897`.
- After a correct answer the answer controls (input/options/tiles) become disabled and focus fell to BODY during the 800 ms wait. `buildSlip()` now moves focus to the first button in the slip (the TTS replay button) when there is no Next button; the next `renderItem()` then focuses the new first control. Wrong answers already focused "Videre".

Status: IMPLEMENTED

## 3. Tests run
`t4.mjs`: after a correct answer in Mode 5 and Mode 1 `activeElement` is BUTTON (not BODY) PASS; full 10-item Mode 5 round with wrong + right answers: 0 BODY hits PASS; summary shows and focuses "Spil igen" PASS; "Gentag fejl" focus not BODY PASS; no console errors PASS. Smoke PASS.

## 4. Manual verification
None beyond scripts.

## 5. Files changed
`boejningsvaerkstedet/index.html`: `buildSlip` else-branch (~1290-1300), `finishRound` (~706-716), removal of early `again.focus()` in `renderSummary`.

## 6. Remaining risks
Focus on the TTS button means a screen reader announces it during the 800 ms; acceptable. Mode 2 slot buttons are never disabled; not changed.

## 7. Newly discovered issues
None.

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| In every listed game, `document.activeElement` is never `BODY` after an answer, screen change or summary. | PASS for Bøjningsværkstedet (scripted Modes 1 and 5); other games: other owner |
| Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen" (order as in `tidsmaskinen/index.html:891-897`). | PASS for Bøjningsværkstedet; Pronomenmysteriet: other owner |
| Adverbier modals use `DanskCore.ui.focusTrap`; Esc closes them and focus returns to the opener. | other owner |
| Enter on the focused Next control advances in Antonymer. | other owner |
