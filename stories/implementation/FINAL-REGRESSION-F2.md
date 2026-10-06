# FINAL-REGRESSION-F2 (branch qa-implementation, HEAD b0083ce)

Games: Bøjningsværkstedet, Glosekort, Dansk Mester, En/Et, Forbindeord. Real Edge, file://, 1366x768 / 390x844 / 360x640, light and dark. Scripts, logs and screenshots: scratchpad `impl\F2\{boej,glose,dm,enet,forb}\RESULT.md`. Five sub-testers (one per game); `node shared/validate.js`: 0 errors, 0 warnings. Repo untouched (no dump files).

Verdict: **no P0, no P1, no regression from Batch 4/5.** Open issues are P2/P3 and all pre-existing except two small P3 notes.

## Per-game table

| Check | Bøjning | Glosekort | Dansk Mester | En/Et | Forbindeord |
|---|---|---|---|---|---|
| (a) Zero console/page errors, no failed requests | PASS | PASS | PASS | PASS | PASS |
| (b) Every mode starts | PASS (1-6) | PASS (150 cards, filters) | PASS (all; Svage ord toast on fresh profile by design) | PASS (all incl. seeded weak) | PASS (normal + weak) |
| (c) Right/wrong feedback, scoring/XP/SRS | PASS | PASS | PASS (XP 72 for 7/1) | PASS | PASS (+110, energy) |
| (d) Completion screen | PASS | PASS (150-card run) | PASS | PASS | PASS (359 / energy out) |
| (e) Restart / back / quit | PASS (Gentag fejl click UNCONFIRMED) | PASS (confirm accept+cancel, menu link) | PASS | PASS | PASS |
| (f) Reload persistence, no double count | PASS | PASS | PASS | PASS (key unchanged) | PASS (mid-run resume) |
| (g) Blocked localStorage (getter + methods) | PASS | PASS | PASS | PASS | PASS |
| (h) Explainer, Esc, timer | PASS (5 tabs) | n/a | n/a | PASS (3 tabs, timer pause) | PASS (2 tabs) |
| (i) Keyboard-only round | PASS (1366 only) | PASS | PASS (focus drops to body) | PASS (see P3) | PASS |
| (j) Layout: no h-scroll, targets >=44px, screenshots | PASS | PASS | **FAIL P2 N2** (pre-existing) | PASS | PASS |
| (k) Lyt button: label "Lyt", 1 speak da-DK per click | PASS | PASS | PASS | PASS | PASS (aria "Lyt til sætningen", title "Lyt") |
| (l) smoke.mjs | PASS (full) | only legacy rows | only legacy rows | only legacy rows | only legacy rows |

Bøjning specifics: SPIL static, inside viewport above mode list at all viewports (top 338/399/423); elementFromPoint at each of 6 mode buttons returns the button, both themes. Gap contrast light: empty 4.86, ok 15.47, bad 13.89; dark: empty 5.56, ok 11.57, bad 13.75 (all >=4.5). En/Et menu sprites viewed light+dark at 3 viewports: fine.

## P0/P1 re-test

| Story | Result | Evidence |
|---|---|---|
| US-002 Forbindeord distractors | PASS | 359 items x 300 draws: 4 unique options, answer present, 0 violations. Native sign-off UNCONFIRMED |
| US-010/015 Bøjning shuffle + counts | PASS | 260 presentations/mode (+120 at each mobile vp): max position 53.3%; clicks/number keys hit displayed option (0 mismatches). Counts 1260/561/746/176/250/221 confirmed; "den mest typiske" accepted, "den mest typisk" rejected; 8 adjectives removed. Native review UNCONFIRMED for rigtig, dødelig, tilfældig, selvstændig, almindelig, naturlig, personlig, hemmelig |
| US-011/017 Glosekort | PASS | Danish confirm; accept resets, cancel keeps counts/card/storage; reset button 56 px below answers; `mødtes` present. Note/example wording UNCONFIRMED (native) |
| US-012 En/Et weak | PASS | Old save 16 weak -> 2 -> 0 over 3 perfect rounds; card "Ingen fejl endnu"; key `en_et_traener_v1` unchanged, `ws` added |
| US-012 Forbindeord weak | PASS | Old save migrated; 12 weak items answered -> pool 0, button hides, toast "Ingen svage ord tilbage!" |
| US-021 Dansk Mester | PASS | "Mangler" note exact; QA-113 notes present; glosses unique (verbs 50, phrases 100); distractor filter OK. Native sign-off UNCONFIRMED |
| US-022 Forbindeord part | PASS | Key "oven i købet" (old counts carried over); "ligesom" correct in both sentences |
| US-024 + decision #7 En/Et øl | PASS | en and et both correct ("en/et øl"); definite øllen/ølet accepted, ølen/øllet rejected; note "Både en øl og et øl bruges."; wrong article still wrong for other nouns |
| US-036 En/Et speed timer pause | PASS | Held at 60 for 6.7 s (mouse) and 55 for 4.5 s (keyboard); resumes 1/s; 3 open/close cycles drop exactly 3 s (no double tick) |

## New issues

No P0/P1. 

| # | Sev | Game | Issue | Pre-existing? |
|---|---|---|---|---|
| 1 | P2 | Dansk Mester | Wrong-answer note below the fold at 1366x768 (bottom ~824-837 > 768) and 360x640; no auto-scroll, advance after 1.5 s. Fits at 390x844 (R2 N2, still open) | Yes (layout as baseline) |
| 2 | P2 | Dansk Mester, En/Et | Praise/consolation text ("Godt klaret!", "Øv!", "Sådan!") and En/Et has no ~800 ms auto-advance outside speed mode (R2 N3/N5) | Yes (same at 0550623) |
| 3 | P2 | Glosekort | ~150 sidebar Tab stops before answer buttons (153 Tabs) (R2 N4) | Yes |
| 4 | P3 | Glosekort | Cancelling the reset confirm still clears the `#sd-fb` feedback line (Sjovt restart hook ignores confirm result). Repro: answer a card, "Start forfra", Cancel. Data untouched | New with US-011 interplay (UNCONFIRMED vs baseline, baseline had no confirm) |
| 5 | P3 | Bøjning | SPIL no longer sticky, so scripted scrollIntoView can put it under the fixed MENU bar (a click then hits the bar). Normal scrolling unaffected; `scroll-margin-top` would harden | New (consequence of N1 fix); UNCONFIRMED real-user impact |
| 6 | P3 | Bøjning | Mode 2 question has no Lyt button (feedback only) | Yes |
| 7 | P3 | En/Et | Enter on a focused Lyt button advances (global Enter handler -> NÆSTE); Space works. Disabled "Svage ord" card is only a CSS class, still tabbable, no aria-disabled. Explainer tab strip at 360 clips last tab label (touch scroll UNCONFIRMED) | Yes (handler same at baseline) |
| 8 | P3 | Dansk Mester | Focus drops to BODY after every render (no focus() calls); stale header XP on results | Yes |
| 9 | P3 | Forbindeord | At 360x640 page stays scrolled ~441 px after NÆSTE so sentence/Lyt sit under MENU bar; "ENERGI FULD" toast overlaps HUD on results; weak mode resets normal index | R2 carry-overs |
| 10 | P3 | Glosekort | C1 filter button does nothing (no C1 cards, exists at baseline); scoreboard updates after advance; stale feedback text in Gentag fejl | Yes |

UNCONFIRMED: native-speaker sign-off (US-002, 015, 017, 021); Bøjning "Gentag fejl" click and keyboard round at 390/360; Bøjning/En/Et explainer tab strip touch scroll.
