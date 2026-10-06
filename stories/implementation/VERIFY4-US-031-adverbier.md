# VERIFY4 US-031 - Adverbier slice (V4-D)

| Criterion | Result | Evidence |
|---|---|---|
| activeElement never BODY after answer/screen change/summary | PASS | After interaction: auto-advances and 14 answer rounds were all BUTTON, 0 BODY; review start/end -> button. Load stays BODY (no focus steal). |
| Modals focus first control | PASS | import -> #csvInput; settings -> #exportProgressBtn; review -> start/close button. |
| Tab trapped (Tab x9, Shift+Tab x9, plus export area open) | PASS | focus stayed inside all three dialogs. |
| Esc closes and restores focus to opener | PASS | importBtn, settingsBtn, reviewBtn; Close button path also restores. |
| roles/aria | PASS | all `.modal-content`: role=dialog, aria-modal=true, aria-labelledby -> heading. |
| "Adverbier modals use DanskCore.ui.focusTrap" | NOT VERIFIED (deviation) | A local Tab trap is used. Implementer's reason verified: `DanskCore.ui.focusTrap` selects `textarea` without visibility check (dansk-core.js ~631), counting the hidden export textarea. Behaviour is met; literal wording needs owner acceptance (core frozen). |
| US-004/005/006/007 intact | PASS | Throwing-localStorage run: loads, 14 answers, 0 errors; TTS spy records lang "da-DK" (normal and blocked); review path works; only key `danishSentenceBuilderProgress`. |

Regressions: none; 0 console errors.
Verification: NOT VERIFIED (focusTrap deviation needs owner approval; all behaviours PASS)
