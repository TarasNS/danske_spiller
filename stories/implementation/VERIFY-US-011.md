# VERIFY US-011 — Glosekort: confirm before "Start forfra" (verifier V-GEM)

Method: puppeteer (Edge) over file://, real clicks, old save seeded into `verb_glosekort_v1` (150 statuses, 3 correct / 2 wrong, currentIndex 5). Script: scratchpad `impl/V-GEM/glose.mjs`.

| Criterion | Result | Evidence |
|---|---|---|
| A Danish `confirm()` (or accessible dialog) appears. Cancelling leaves statuses, counts and storage unchanged. | PASS | Dialog message "Vil du nulstille alle fremskridt? Det kan ikke fortrydes." fired at 390 wide, 360 wide and 1440 wide. After dismiss, the `localStorage` string is byte-identical to the seeded string (`cancelIdentical:true`), scoreboard still "Rigtige: 3 / Forkerte: 2". |
| Accepting resets as before. | PASS | After accept: Rigtige 0 / Forkerte 0, storage changed, `correctCount` 0 (code l.609-623 unchanged apart from the guard). |
| The button has at least 24 px extra spacing or ghost style or moves out of the answer row on mobile. | PASS | Measured gap answer-row bottom -> restart top: 56 px at 390x844 and at 360 wide (answer y 730-834, restart y 890-938), 56 px at 1440. HEAD was 28 px (story); CSS `.4rem` -> `2rem`, themed `4px` -> `32px` (+28 px). 56 px exceeds the 44 px target size, so a thumb on an answer button will not hit restart; residual mis-tap risk low, and a mis-tap is now caught by the confirm. (The 640-high viewport only changes scroll position; document positions are identical.) |
| A puppeteer `dialog` event fires on click. | PASS | `page.on('dialog')` captured the message on both clicks. |

Other checks: zero console/page errors in all viewports; reload keeps progress; localStorage-blocked run does not crash; `smoke.mjs ... '#right-btn'` -> Verdict PASS.

Wording: story text says "Vil du starte forfra? Dine fremskridt nulstilles."; implementer used Magiske Verber's wording per the story's own implementation note ("match the wording used by ... reset confirms"). Accepted; flagged for owner.

Minor (not a failure): the Sjovt hook at script.js ~l.681 clears the green/red feedback line on every restart click, including a cancelled one (cosmetic; progress unaffected).

Scope: 3 files, +4 lines; no scope creep. Regressions: none.

Verification: VERIFIED (all machine-verifiable criteria PASS; confirm wording differs from the story's example text by design; no native-sign-off criterion here).
