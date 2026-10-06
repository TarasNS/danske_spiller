# VERIFY4 US-031 - Magiske Verber slice (V4-D)

| Criterion | Result | Evidence |
|---|---|---|
| activeElement never BODY after answer, screen change, summary | PASS | 360x740: diff screen -> DIV.diff.active; game -> first .opt; after answer -> BUTTON#nextBtn; result -> "Spil igen"; goMenu -> first game card; stats -> back link; speed mode: after click stays on locked option, after 2.5 s auto-advance -> first option, timer end -> "Spil igen". Initial load BODY by design. 0 console errors. |
| Enter after a mouse click on an option advances | PASS | Reproduced on b9242ca copy: mouse click on option then Enter / Space / key 2+Enter never advances (idx stays 0). Current: Enter idx 0->1, focus on next first option. |
| No double advance on Space | PASS | Space on focused option only answers (idx unchanged, focus on Næste); a second Space advances by exactly 1. |
| Speed-mode timers | PASS | auto-advance works; explainer:open freezes the timer (59,59 over 2.2 s); explainer:close resumes (57). |

Regressions: none. Scope creep: none (focus code only).
Verification: VERIFIED
