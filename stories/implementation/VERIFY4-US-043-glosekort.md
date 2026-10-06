# VERIFY4 US-043 - Glosekort (verifier V4-B)

Files: `danish_flashcards/danish_flashcards_game/script.js`, `shared/themes/flashcards.css`. Script `impl/V4-B/glose.cjs`, `g2.cjs`.

| Criterion | Result | Evidence |
|---|---|---|
| The repro no longer gets stuck: it moves to the next unanswered card or shows the done panel | PASS | Cleared storage, A1 filter, 52 right-clicks -> "Kort 52 af 52", done panel shown, buttons disabled (correct). Switch to Alle -> "Kort 149 af 150", status `unreviewed`, both buttons enabled. Reload with saved `currentIndex=3` (answered) -> lands on "Kort 8 af 150", unanswered. |
| List items are `<button>`s, reachable with Tab and Enter | PASS | 150 `li` each contain one `button.verb-item-btn`; `aria-current="true"` on exactly one. Tab from the filter reaches a list button; Enter selects it, focus stays on it and `aria-current` follows; Tab then Space selects the next. Focus ring visible in the screenshot. |
| A second click within the advance window is ignored | PASS (wrong button) | Two synchronous clicks, a real double-click, and Wrong+Right in the window: `wrongCount` +1 only and a single card advance (the Right click is ignored). In review mode a double-click on Wrong also advances once. |
| Residual: "Det vidste jeg" double-click | note | Two real clicks on the Right button answer two consecutive cards (ok 2, idx 2); Right advances immediately and has no window. Story and QA-022 name only "Det vidste jeg ikke", so not a failure. |
| US-011 intact | PASS | Restart opens the confirm "Vil du nulstille alle fremskridt? Det kan ikke fortrydes."; dismissing keeps progress. Spacing and CSS untouched. |

Regressions: none. 0 console errors; the only dialog was my restart confirm. Blocked-storage run: 0 errors. Smoke: only the legacy artefact rows fail. `verbs` data not touched in this batch (diff is limited to script.js logic).
Scope creep: the matchMedia filter move belongs to US-037. The Sjovt hook guard `lastClickAccepted` is justified (no fx for ignored clicks).
UNCERTAIN: none.

Verification: VERIFIED
