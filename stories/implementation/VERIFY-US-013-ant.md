# VERIFY US-013 (Antonymer slice) - verifier V-ANTORD

Scope: `danish-antonyms-game.html`, report `US-013.md` section "Slice: W-ANT". Scripts in scratchpad `impl/V-ANTORD/` (ant1.cjs, ant2.cjs, ant5.cjs). Edge headless, file://.

| Criterion | Result | Evidence |
|---|---|---|
| After `showFeedback`, Next is focused (`focus({preventScroll:true})`) and scrolled into view; either move Fortsæt above the explanation or make it sticky | PASS | `revealNext()` (~l.1334-1352) called from `showFeedback` on the non-speed path; focus uses preventScroll, then scrollBy / scrollIntoView({block:"nearest"}). Fortsæt not moved/sticky; scroll approach allowed ("or"). Measured Next top-bottom vs innerHeight: d1366x768 708-756 / 768; m390x844 784-832 / 844; m360x640 580-640 / 640. Choice and typed, wrong and right: all 12 runs in view, `document.activeElement.id==="nextBtn"`. |
| HEAD failure reproduced | PASS (repro) | Same script on a HEAD copy: Next top 1200 (d1366), 1258/1498 (m390), 1241/1274 (m360), 948-1168 in typed; never in view, nothing focused, scrollY 0. |
| Geometry check at d1366, m390, m360 shows feedback and Next inside innerHeight (or auto scroll) | PASS with caveat | Next always inside. Feedback panel top: d1366 370, m390 243-398, m360 -17 (wrong answer, choice and typed) / 38-160 (others). At 360x640 after a wrong answer feedback+Fortsæt is taller than the viewport (and the fixed 56px MENU bar covers the top) so the verdict line and part of the pair line are scrolled off the top ("button wins" fallback). Explanation, examples and Next are visible. Judged acceptable, not clean. |
| With reduced motion, scrolling is instant | PASS (code) | `behavior = reduce ? "auto" : "smooth"`; not exercised in the browser by me. |
| Next stays operable by keyboard | PASS | Focus on #nextBtn after every answer; all 8 modes advanced via `#nextBtn`. |

## Batch 1 US-004 guards (Antonymer)
Intact: `save()` wrapped in try/catch (l.856), `loadState()` try/catch, reset `localStorage.removeItem` wrapped (l.1505). Run with the `window.localStorage` getter throwing: choice and typed round, Fortsæt, quit, settings toggle, reset (confirm accepted): zero page/console errors, ends on dashboard.

## Regression
- All 8 modes (choice, match, reverse, missing, speed, review, category, difficulty) start and finish to `screen-summary`, zero console/page errors (speed finished by forcing timeLeft=1).
- Progress persists across reload (total 1 -> 1; `modsat_danish_antonyms_v1` is the only key).
- `node tests/smoke.mjs ../danish-antonyms-game.html`: all PASS except the known legacy rows (`#btn-play` x4, "console clean + still playable" x3); "localStorage blocked: no crash" PASS.
- Speed mode unchanged (auto-advance, no revealNext).

## Scope creep / diff
Slice change is `revealNext()` + one call. The HEAD diff of this file also contains US-020 changes and Batch 1 (US-004) guards; no debug code, no formatting churn found, no CSS change.

## UNCERTAIN
None (layout only). Minor: smooth scroll may still be in flight if Enter is pressed very quickly (harmless).

Verification: VERIFIED (Antonymer slice only; Ordstillingsdetektiven and Præpositioner slices are covered elsewhere). Caveat: verdict line clipped at 360x640 after a wrong answer.
