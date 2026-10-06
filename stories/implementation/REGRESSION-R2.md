# Regression R2 (branch qa-implementation)

Games: Bøjningsværkstedet, Glosekort, Dansk Mester, En/Et, Forbindeord. Real Edge, file://, 1366x768 / 390x844 / 360x640. Per-game detail, scripts and screenshots are in the scratchpad folder `impl\R2\{boej,glose,dm,enet,forb}\RESULT.md`. Work was split across five sub-testers, one per game; the coordinator ran smoke and validate.

## Per-game table

| Game | Loads / console | Core flow | Completion | Restart/menu | Explainer | Desktop | Mobile | Blocked storage | Smoke |
|---|---|---|---|---|---|---|---|---|---|
| Bøjningsværkstedet | PASS | PASS (modes 1-6) | PASS | PASS | PASS (5 tabs, Esc) | PASS | PASS | PASS (getter + methods) | PASS (full) |
| Glosekort | PASS | PASS (150 cards, filters, Gentag fejl) | PASS | PASS (menu link click UNCONFIRMED) | n/a | PASS | PASS (P3 below fold) | PASS (390 only) | only legacy artefact rows fail |
| Dansk Mester | PASS | PASS (all modes) | PASS | PASS | n/a | PASS (P2 N1) | PASS | PASS | only legacy artefact rows fail |
| En/Et | PASS | PASS (all modes) | PASS | PASS | PASS (3 tabs, Esc) | PASS | PASS (P3) | PASS | only legacy artefact rows fail |
| Forbindeord | PASS | PASS (+ mid-run resume) | PASS | PASS | PASS (2 tabs, Esc) | PASS | PASS | PASS | only legacy artefact rows fail |

Smoke: `smoke.mjs` for Bøjningsværkstedet is a full PASS. The four legacy games fail only the `#btn-play` and "console clean + still playable" rows (known artefact); all other rows PASS. `node shared/validate.js`: 0 errors, 0 warnings. En/Et menu sprites, light and dark, are crisp and unclipped on all three viewports. Keyboard-only rounds PASS in all games (Bøjningsværkstedet, Forbindeord and some others tested at selected viewports only).

## P0/P1 story re-test

| Story | Result | Evidence |
|---|---|---|
| US-002 Forbindeord distractors | PASS | 359 items x 50 draws via game's `distractors()`: 0 duplicates, answer always present, 0 synonym-group distractors. Native sign-off UNCONFIRMED. |
| US-010 Bøjning shuffle modes 5/6 | PASS | Over 260 presentations per mode no position above 55%; clicks and number keys hit the displayed option; 800 ms auto-advance intact. |
| US-015 Bøjning keys/notes/counts | PASS (behaviour) | Counts 1260/561/746/176/250/221 confirmed in the running game; "den mest typiske" accepted, "den mest typisk" rejected. Eight listed adjectives removed. Doubtful items remain for native review: rigtig, dødelig, tilfældig, selvstændig, almindelig, naturlig, personlig, hemmelig. |
| US-011 Glosekort | PASS | Danish confirm text fires; accept path resets; 56 px gap to reset button; cancel path UNCONFIRMED (earlier verdict only). |
| US-017 Glosekort | PASS (structure) | `mødtes` fixed; 8 note/example fields changed. Wording needs native sign-off. |
| US-012 En/Et weak clear | PASS | Legacy save keeps c/t; weak pool clears to 0, card disabled "Ingen fejl endnu"; storage key unchanged. |
| US-012 Forbindeord weak clear | PASS | Old save migrated; pool empties, weak button hides, toast "Ingen svage ord tilbage". |
| US-021 Dansk Mester | PASS (wording adapted) | "Mangler" note exact; QA-113 notes updated; glosses unique and distractor filter in place. Native sign-off UNCONFIRMED. |
| US-022 Forbindeord part | PASS | Key "oven i købet" (old save migrates); "ligesom hendes mor" and "ligesom sin far" correct. |
| US-024 En/Et | PARTIAL | Note now "(Både en øl og et øl bruges.)" but answering "et" for øl is still marked wrong; the accept-both or drop decision is not implemented. Needs owner/native decision. |
| US-036 timer pause | PASS | Speed timer holds at 60 for 4.5 to 5 s with the explainer open (mouse and keyboard); resumes after Esc without double tick. |

## New issues

No P0, no P1.

| # | Sev | Game | Issue / repro |
|---|---|---|---|
| N1 | P2 | Bøjningsværkstedet | Sticky SPIL button on the start screen covers lower mode buttons (mode 5 at 1366x768, mode 4 at 390x844, modes 2-6 at 360x640). Repro: fresh load at 1366x768, click centre of mode 5; the game starts in mode 1. Source: US-037 sticky style, `shared/themes/boejningsvaerkstedet.css:228`. Scrolling reveals the buttons. |
| N2 | P2 | Dansk Mester | Wrong-answer note sits below the fold with no auto-scroll at 1366x768 and 360x640 while auto-advance runs in about 1.5 s. Fits at 390x844. |
| N3 | P2 (existing, not regression) | Dansk Mester, En/Et | Praise text on correct and encouragement on wrong answers ("Godt klaret!", "Prøv igen!", "Øv!"), against the "no congratulatory/encouraging text" rule. En/Et identical at baseline `0550623`. |
| N4 | P2 (existing) | Glosekort | Keyboard users must Tab through 150 sidebar verb buttons before reaching the answer buttons. |
| N5 | P2 (existing) | En/Et | No ~800 ms auto-advance outside speed mode (identical at baseline). |
| P3s | P3 | various | Glosekort: answer buttons below the fold on phones; scoreboard updates only after a wrong-answer advance. Dansk Mester: focus resets after a keyboard answer; stale header XP on results. En/Et: NÆSTE below the fold at 360x640. Forbindeord: "ENERGI FULD" toast overlaps the HUD on results; HUD under the MENU bar after scroll on mobile; weak mode resets the normal run index; correct answers wait for NÆSTE (as at baseline). Bøjning: Esc does nothing on the results screen; "Rigtigt!" slip. |

UNCONFIRMED: native-speaker content sign-off (US-002, US-015, US-017, US-021, US-024); Glosekort cancel path and menu click; Glosekort blocked-storage at 1366/360; Bøjningsværkstedet persistence and keyboard round only at 1366; Forbindeord blocked-storage and keyboard at 1366 and 360 only.

`git status --short` at the end of the run showed ` M .claude/skills/agent-delegation/SKILL.md` and ` M stories/IMPLEMENTATION-PLAN.md` (edits by other workers, not R2) plus untracked `CLAUDE.md`. R2 created no stray files in the repo.
