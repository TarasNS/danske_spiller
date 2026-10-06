# VERIFY US-013 (Ordstillingsdetektiven slice), retry W-ORD2 - verifier V-ORD2

File: `ordstilling-detektiv/index.html` (`keepAnswerInView()` ~1012-1021). Own script: scratchpad `impl/V-ORD2/v.cjs` (Edge headless, real DOM clicks on tiles / UNDERSØG, Enter or click on NÆSTE; progress seeded in localStorage so cases 3 and 5, weak and final are reachable). 5 configs: 1366x768, 390x844, 360x640, 360x640 reduced motion, 430x932. Per config: cases 1, 3, 5 x correct (12 statements) and wrong (ends after 3, lives) x 3 repeats = 18 runs, plus weak and final (6 statements each) = 20 runs/config, 100 runs total (about 630 statements checked). Measured per statement: `.sd-bar` MENU bar, `#promptLbl`, `#enLine`, `#pool`, `#checkBtn` (before check), `#nextBtn` + `document.activeElement` (after check). Checks for statements 2..N: prompt top >= MENU bottom, English line / pool / UNDERSØG bottom <= innerHeight, after check NÆSTE inside viewport and focused, no horizontal scroll, no auto-advance (prompt text unchanged 1.2 s after check on statement 2), zero console/page errors.

## Criteria (Ordstillingsdetektiven slice, verbatim from `stories/QA-USER-STORIES.md`)

| Criterion | Result | Evidence |
|---|---|---|
| Ordstillingsdetektiven: from the 2nd statement on, the tiles and UNDERSØG are visible without scrolling at 1366×768 and 390×844 (collapse the story in `<details>`, or scroll `#answer` into view in `loadQuestion()`). After checking, Next is in view and focused. | PASS | 100 runs, 0 violations. d1366 stmt 2: English 205-232 (case 5: 179-206), pool 340-396, UNDERSØG 416-468, NÆSTE 642-694 (vh 768). m390 stmt 2: English 96-151, pool 259-383, UNDERSØG 403-455, NÆSTE 751-838 (vh 844). Over all 128 m390 statements >=2: min prompt top 64 (MENU bottom 56), max UNDERSØG bottom 550, max NÆSTE bottom 841 (<844). `activeElement.id==="nextBtn"` after every check, correct and wrong. 3/3 repeats identical at every config: the earlier 390 intermittency (prompt at -1/-12 under MENU) did not recur. |
| A geometry check at d1366, m390 and m360 shows feedback and Next inside `innerHeight` (or reached by automatic scroll). | PASS | m360 (vh 640): stmt 2 English 96-150 (case 3: 96-177), pool 258-382, UNDERSØG 478-530 (case 3 505-557), NÆSTE 582-634; over 127 statements max UNDERSØG bottom 625, max NÆSTE bottom 637. m360 reduced motion: NÆSTE 588-640 (exactly at vh, still inside), max UNDERSØG bottom 625. m430x932: stmt 2 English 96-284 range, UNDERSØG 403-520, NÆSTE 752-895 (vh 932). Previous failure (English line at -310..-188 from stmt 2 on at 360x640) fixed: min prompt top 64 everywhere. |
| With reduced motion, scrolling is instant. | PASS | All scrolls use `behavior:"auto"` (`keepAnswerInView`, `showExplain`); no `smooth` anywhere in the file. m360 reduced-motion runs: 20/20 runs, 0 violations. |

(Other criteria of US-013 belong to the Antonymer / Præpositioner slices and are out of scope here.)

## Additional checks

- Zero console/page errors in all 100 runs (cases, weak, final; all 5 configs). No horizontal scroll flagged.
- No auto-advance: prompt text unchanged 1.2 s after checking (statement 2, every run).
- First load: `scrollY` 0 at all viewports, page title (`h1`) top 80-105 px (visible); the scroll only fires from `loadQuestion()` with `G.i>0`, i.e. not on load or case start. PASS.
- Statement 1 (recorded for owner, not a failure; unchanged from earlier verdict): still below the fold. d1366 pool 855-911, UNDERSØG 931-983 (vh 768), English 720-747; m390 pool ~971-1102, UNDERSØG ~1115-1216, English 808-938 (vh 844); m360 pool ~996-1101, UNDERSØG ~1197-1438, English 833-990 (vh 640); m430 UNDERSØG 1165-1266 (vh 932). The `storybox` is open on statement 1 by design. Owner decision needed (collapse or auto-scroll on statement 1).
- Weak mode and final mode: 6 statements each at all 5 configs, 0 violations, 0 errors (story box open on stmt 1, collapsed afterwards).
- `tests/smoke.mjs ../ordstilling-detektiv/index.html` (Edge via CHROME_PATH): all PASS except the known legacy rows (`#btn-play` x4, "console clean + still playable" x3). "localStorage blocked: no crash" PASS.
- Residual risk (from implementer, confirmed plausible): m360 reduced motion case 5 UNDERSØG bottom 625 vs 640 and NÆSTE bottom exactly 640 - fits, but no margin; the prompt is prioritised over UNDERSØG on very short viewports. A scroll triggers only on statement change, not on manual resize.

## Diff review

`git diff` is against baseline HEAD and therefore also contains other stories' changes (not attributable to the retry): `alt` answer variants and `cur.builtText` in `checkBtn`/`showExplain` (word-order alternatives, case 1), `renderHUD` lives clamp, reworded grammar tips/story for cases 7, 8, 11, 12, `<details class="storybox">` in three headers. US-013 first-pass items: `loadQuestion` tail (`storybox` open/closed, `keepAnswerInView()` call), `showExplain` focus + `scrollIntoView({block:"nearest",behavior:"auto"})`. The retry itself (`keepAnswerInView()`: `scrollMarginTop=64px`, prompt-position condition `pr.top<64||pr.top>innerHeight`) is confined to that one function; I cannot isolate it from a pre-retry snapshot (no commit), but the function body is self-contained, instant-scroll, and has no debug code. Other changes are outside this story (flag: the `alt` variants and grammar-tip rewrites belong to other stories, e.g. US-023). No stray files created by me in the repo (`git status` untracked: `CLAUDE.md`, `qa/`, `stories/`, `tests/pronomen-data-guard.mjs`, all pre-existing).

## Regressions / UNCERTAIN

Regressions: none found. UNCERTAIN Danish content: none reviewed (no content change in this retry).

Verification: VERIFIED. All three Ordstillingsdetektiven criteria PASS in 100 runs (5 viewports incl. reduced motion, correct and wrong sequences, cases 1/3/5, weak, final; 0 violations, 0 console errors, NÆSTE focused every time); the 360x640 hidden-prompt defect and the 390 intermittent MENU-bar overlap are gone. Caveat for owner: statement 1 remains below the fold at every viewport (outside the written acceptance criterion).
