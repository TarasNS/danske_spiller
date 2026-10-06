# VERIFY-US-013 (slice W-PREP, Praepositioner only) - verifier V-PREP

File: `dansk-praepositioner.html`. Antonymer and Ordstillingsdetektiven slices are NOT covered here. Scripts: scratchpad `impl/v-prep/t13.cjs` (+ t13b, tlong, treg).

Method: real clicks/keys in Edge (puppeteer-core, file://), 3 viewports (1366x768, 390x844 touch, 360x640 touch) x normal and `prefers-reduced-motion: reduce` x 8 modes (fill, mc, drag, mistake, correct, trans, pairs, review) x wrong AND correct answer = 96 runs per version. After the answer: wait 1100 ms (normal, smooth scroll) or 120 ms (reduced), then measure `#fb` and the Naeste button rects against `innerHeight`, and `document.activeElement`.

| Criterion | Result | Evidence |
|---|---|---|
| Praepositioner: `#fb` renders above NAESTE or is scrolled into view. At 1366x768 the verdict and TIP are fully inside the viewport after answering in Flervalg. | PASS | Current d1366 mc wrong: fb 553-676, Naeste 700-752, innerHeight 768; mc correct fb 585-676. In mc/drag/mistake/pairs/review Naeste is now inserted after `#fb` (`document.getElementById("fb").after(nb)`), in fill/correct/trans the Naeste is the check button above `#fb` (unchanged placement), plus `revealFeedback()` scroll. |
| A geometry check at d1366, m390 and m360 shows feedback and Next inside `innerHeight` (or reached by automatic scroll). | PASS | Current: 96/96 runs have fb fully inside (top>=0, bottom<=innerHeight), Naeste fully inside and focused (one harness miss - mistake/wrong at 360x640 reduced "no sentence with 2 prepositions found" - re-run 3x: all PASS, e.g. fb 266-548, next 572-624, vh 640). Worst case sweep (tlong.cjs): the 25 longest items (text+TIP) in mc and Find fejlen: 42/42 in view at 360x640 (block height 391 of 640), 390x844 and 1366x768. |
| With reduced motion, scrolling is instant. | PASS | `revealFeedback` uses `behavior:"auto"` when `matchMedia('(prefers-reduced-motion: reduce)')` or `data-sd-motion="off"`; measured in view 120 ms after the click in all reduced-motion runs (e.g. m360x640 reduced mc fb 362-548 next 572-624). |
| After each answer ... focus moves to Next (Expected behavior) | PASS | `focus:true` in all 96 runs. Real Enter on focused Naeste advances once (mc: n 1->2). |
| Enter in text inputs does not double-advance | PASS | 15 runs (fill/correct/trans x5): 1st Enter shows feedback, session counter unchanged, focus on "Naeste ->"; 2nd Enter advances exactly one question (n 1->2). `e.preventDefault()` on Enter at l.986/1150/1188. |
| Lynrunde unaffected | PASS | Speed round: no Naeste button, option click auto-advances after ~160/520 ms (as at HEAD), scrollY stays 0; ends normally with blocked storage too. Speed code only changed in `distractorsFor(...,item)` (US-019) and the storage try/catch. |
| "HEAD had them out of view" claim | CONFIRMED | HEAD copy (git show, same harness, wrong answers): at 1366x768 fb 773-896 (mc), 707-831 (fill), 675-830 (mistake) vs innerHeight 768; at 360x640 fb 702-1033 vs 640 and Naeste also off-screen (706-784). HEAD: 96/96 runs fail (feedback not in view in 94/96, Naeste not focused in 96/96); focus was never moved, sy stayed 0. |
| No auto-advance added (US-026 blocked) | PASS | No timers in answer handlers other than Lynrunde. |

## Regression / scope notes
- Layout order change (Naeste after `#fb` in 5 modes) is what the story offered ("`#fb` renders above NAESTE"). Not a regression.
- Smooth scroll may still be running if Enter is pressed instantly; harmless.
- Drag mode: keyboard/tap path via chip click; HTML5 drop event path calls the same `place()`.
- Console: 0 errors in all runs; smoke.mjs only legacy-artefact rows fail. Progress persists across reload; blocked localStorage no crash (US-004 guards intact).
- No stray files in the repo (git status unchanged after tests).

Verification: VERIFIED (Praepositioner slice only; the Antonymer and Ordstillingsdetektiven slices of US-013 are outside this verifier's scope)
