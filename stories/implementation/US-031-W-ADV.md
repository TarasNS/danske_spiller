# US-031 — Adverbier slice (W-ADV)

## 1. Implementation summary
`adverbs.html` only (`shared/themes/adverbs.css` unchanged).
- Import, Settings and Review dialogs now go through `openModal(id)` / `closeModal(id, restore)`: the first visible control gets focus, Tab is trapped inside the dialog, Esc closes the open dialog, and focus returns to the opener. The dialogs have `role="dialog" aria-modal="true" aria-labelledby`.
- I used a small local Tab trap instead of `DanskCore.ui.focusTrap`. The core helper also counts the hidden (display:none) export textarea as the last focusable element, so Tab escaped the Settings dialog. Core is frozen, so this is recorded as a shared-dependency note.
- After every `renderGame()`, `focusFirstControl()` focuses the first answer button (or the first tile in order mode), with `preventScroll`. Focus is only moved once the learner has interacted (`userActive`), so the page doesn't grab focus on load. It is never left on BODY after the 2 s auto-advance replaces the buttons.
- Closing the review dialog via start/end/continue skips opener-restore and focuses the game instead. The "Tilbage til øvelserne" button gets focus after the review ends.
- The R shortcut and the existing dialog-open shortcut guard are intact.

Status: IMPLEMENTED

## 3. Tests
- Own puppeteer script (scratchpad `impl/W-ADV/t.cjs`, Edge): for each of the three dialogs, open with Enter, check focus lands inside (csvInput / exportProgressBtn / closeReviewBtn), press Tab 8 times and stay inside (all true; the Settings case failed with the core trap, true after the local trap), then Esc closes it and focus returns to the opener (importBtn / settingsBtn / reviewBtn). Result: all PASS. Four answers via key "1" plus auto-advance: activeElement was a BUTTON each time, never BODY. 0 console/page errors.
- `smoke.mjs ../adverbs.html`: all PASS except the known legacy artefact rows ("play button #btn-play found" x4, "console clean + still playable" x3 for dark/light/reduced-motion), which fail because root-level games have no `#btn-play`. Console-clean, h-scroll, contrast, focus-ring and localStorage-blocked rows PASS.
- No dump files were created. `git status` shows only `adverbs.html` from my work plus the stories/implementation reports.

## 4. Manual verification
Keyboard-only: opened and closed all dialogs and played several questions.

## 5. Files changed
`adverbs.html`: dialog markup attrs (~l.382-422); `renderGame` end plus new `focusFirstControl`/`openModal`/`closeModal`/`closeSettingsModal` (~l.869-915); `openReview`/`closeReviewModal`/`startReview`/`endReview`/`finishReview`; the import/settings/review event bindings and the new Esc handler in the DOMContentLoaded block.

## 6. Remaining risks
- The 2 s auto-advance is unchanged, so a keyboard user must answer within the feedback window. There is no Next button; that is out of scope here.
- `alert()`/`confirm()` after import or reset steal and then return focus natively.

## 7. Newly discovered issues (not fixed)
- Stray "," in the spoken gap text (`spokenGap`).
- One-directional exclusion in US-007.
- Shared dependency: `DanskCore.ui.focusTrap` counts hidden focusables, so it can't trap properly when a dialog contains a hidden textarea.

## 8. Needs native review
None.

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| In every listed game, `document.activeElement` is never `BODY` after an answer, screen change or summary. | PASS for Adverbier (other games: other owner) |
| Bøjningsværkstedet and Pronomenmysteriet summaries focus "Spil igen" | other owner |
| Adverbier modals use `DanskCore.ui.focusTrap`; Esc closes them and focus returns to the opener. | PASS in behaviour (trap, Esc, focus restore). Deviation: a local trap is used instead of `DanskCore.ui.focusTrap`, because the core helper fails with hidden textareas (see section 7). |
| Enter on the focused Next control advances in Antonymer. | other owner |
