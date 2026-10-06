# VERIFY-US-010 - Bøjningsværkstedet: shuffle options in modes 5 and 6

Verifier: V-BOEJ (independent; repo read-only). Scratch scripts: `scratchpad/impl/V-BOEJ/` (`drive.cjs`, `kb.cjs`, `allmodes.cjs`, `mc.js`).

## Original failure reproduced at HEAD
- Data: at HEAD `options[0] === correct` for 250/250 `bestemt_ubestemt` and 221/221 `maengdevaerkstedet` items (`mc.js`).
- Real game (HEAD copy of index.html + data.js in scratchpad, Edge, real key/click presses, 80 presentations per mode): the correct answer was displayed in position 1 in 80/80 presentations in each mode (100% for both 2- and 3-option items).

## Diff review
`git diff boejningsvaerkstedet/index.html` is 3 hunks (lines ~1150-1172): `shownOptions = shuffle((item.options||[]).slice())`, buttons built from it, `choose(i)` reads `shownOptions[i]`, reveal-correct loop reads `shownOptions[j]`. Comparison is `normalize(chosen) === normalize(item.correct)` (never index 0). No other change, no scope creep. The existing Fisher-Yates `shuffle` (index.html:1405) is reused; the copy keeps `item.options` intact.

## Per-criterion table

| Criterion | Result | Evidence |
|---|---|---|
| Options in modes 5 and 6 are shuffled each time an item is shown (pattern: `pronomenmysteriet/index.html:486`). | PASS | index.html:1152 shuffles a copy per presentation inside the renderer (called once per item display). Runtime: option order differs between presentations, option set identical to `item.options` every time (checked in `drive.cjs`, 1920 presentations, 0 mismatches). |
| The answer check compares the chosen option's text/value with `item.correct`, not with index 0. | PASS | index.html:1167-1168 (`chosen = shownOptions[i]`, normalize compare). Runtime: 640 correct-option clicks/keys all got `chosen-correct` only; 640 wrong-option clicks/keys all got `chosen-wrong` on exactly the pressed button, `reveal-correct` on the correct text, `.slip.wrong` showing the correct answer (`.sol` text equals `item.correct`). 0 failures. |
| Number keys 1–n select the displayed order. | PASS | `.onum` badges verified to read 1..n in DOM order each presentation; key N selected the Nth displayed button in all 640 key presses (320 right, 320 wrong). Keyboard-only run (Tab to mode button, Enter, Tab to Spil, Enter, then Enter-on-focused-option, digit, Tab+Space) completed a 10-item round in both modes with 0 console errors (`kb.cjs`). |
| Over 200 presentations the correct answer lands in each position about evenly (no position above 70%). | PASS | 320 presentations per mode per viewport (6 runs x 320 = 1920). Max share by option count: 2-option 55% (mode 6, 1366 and 390 wide) / 54% (mode 5, 360 and 390), 3-option 41% (mode 5, 360). All positions 21%-55%. 1366x768: M5 2-opt 50/50 (n=251), 3-opt 35/30/35 (n=69); M6 2-opt 55/45 (n=186), 3-opt 29/35/36 (n=134). 390x844 and 360x640 similar (see `out_now_*.json`). |
| SRS keys, scoring and the 800 ms auto-advance are unchanged. | PASS | The diff does not touch `recordAnswer`, `patternKey`, `item.id`, scoring or `window.setTimeout(advance, 800)`. Measured click-to-next-item after a correct answer: min 811 ms, typical avg 863-937 ms (polling at 25 ms plus page load jitter; max outliers 1.0-2.8 s under heavy machine load with six parallel browsers), never below 800. localStorage keys after a full six-mode run: `srs:boejningsvaerkstedet`, `boejningsvaerkstedet:mode` (unchanged names). |

## Other checks
- Modes 1-4 unaffected: diff only touches `makeMcRenderer`. Mode 1/3/4 are typed (inputs), Mode 2 is a tile tray that already shuffles `item.pieces` (not changed, no shuffle added elsewhere). Played all six modes to the summary screen, 0 console errors (`allmodes.cjs`; Mode 4 re-played separately with correct and wrong answers, 5 right / 5 wrong as expected, summary reached).
- `tests/smoke.mjs ../boejningsvaerkstedet/index.html` (Edge): Verdict PASS, all rows PASS incl. localStorage-blocked no crash, tap targets, no h-scroll at small/mobile/tablet/desktop, dark/light/reduced-motion.
- `node shared/validate.js`: TOTAL 0 errors, 0 warnings.
- In an earlier parallel attempt (7 concurrent browsers, 40 ms settle time) one press was recorded before the UI had updated (a timing artefact of my driver under load); the rerun with the same driver passed 100% (1920/1920). Not a product defect.
- Remaining note (not part of this story, agrees with implementer): the `.onum` digit badge is not `aria-hidden`.

## Regressions / scope creep
None found.

## UNCERTAIN content
None (no content change in US-010).

Verification: VERIFIED. All five criteria PASS by runtime evidence (HEAD failure reproduced 100%/100%, fix measured at max 55% per position over 1920 presentations at three viewports, clicks/keys/reveal use displayed order, 800 ms advance and storage keys unchanged, keyboard-only play works, modes 1-4 unaffected).
