Verdict: PASS WITH ISSUES
Tested: task/pronomen-fix@aaabfadf3156d471923156836ee96601dd449eb1 (worktree .worktrees/pronomen-fix; rebased onto master incl. upstream PR #4; earlier runs: d06f50e, c9678ae)

| Check | Result | Evidence |
|---|---|---|
| Real data restored | PASS | 0 "Test sentence"; 760 items 120/120/180/100/140/100; ids unique; correct in options; each has one `___`; keys match MODES; levels A2/B1/B2 only |
| index.html unchanged vs master | PASS | git diff master -- pronomenmysteriet/index.html empty; only data.js (+ screenshots) changed. (Diff also shows agent-memory deletions: artefact of branch age, not a change on the branch.) |
| smoke.mjs (360/390/820/1440, dark, reduced-motion, LS blocked) | PASS | all checks PASS |
| Console/failed requests (full session, file://) | PASS | spec "console clean over full session" |
| All 6 modes: round, auto-advance 831-955 ms, round-end (3 weakest, Spil igen), SRS keys, no congratulation | PASS | spec; keys `pronomenmysteriet:<mode>:<real-id>`, e.g. rp-hun-har-glemt-sin-kuglepen |
| SRS survives reload; mode/level persist | PASS | boxes preserved (modes 1, 3) |
| Wrong feedback: answer + one REGEL note + replay + Videre; reflexive owner chain | PASS | 18 slips, 0 bad; viewed small-wrong-light.png |
| Layout all screens, tap >=44, dark+light x 4 viewports | PASS | spec 16/16 |
| Keyboard: Tab order, Enter on Spil, number keys, Escape, Videre via Enter | PASS | manual rerun: after wrong key, Videre focused, Enter -> 2/10; Space and Enter toggle level chip |
| Mute silent / unmuted audio | PASS | osc=0 / osc=4 |
| Missed items return next round | FAIL | spec "due items first" fails in modes 1 and 3, 3 of 3 runs (missedBack=false). Known todo (unseen counted as due) |
| Content audit (>=30/mode) | NOT VERIFIED | not run this pass; data identical to b9abb96 audited in reports/pronomen-data.md (PASS) |

Spec-harness failures that are not product bugs (3 runs: 61-62/65)
- "Space toggles a chip": spec asserts aria-pressed=='true' but chip B1 starts pressed so toggling gives false. Manual: Space toggles true->false, Enter false->true. Spec expectation wrong.
- "Videre is focused after wrong": FLAKY in spec (failed 1 of 3). When the random key-2 answer is correct, activeElement is body whose textContent contains "Videre", so the spec wrongly enters the wrong-answer branch. Manual wrong-answer test x2: Videre focused, Enter advances.

Bugs
- [PF-1] minor (existing todo): missed items not prioritised in next round (modes 1, 3 tested).
- [PF-2] minor (existing todo): owner-chain tags (Subjekt -> Ejer -> Ejet) each sit on their own line at 360 px; readable, no overflow.

Blockers: none. Majors: none.
Content flags: unchanged native-check list (22 rp-de-* deres items, 4 nogle-after-negation items, 3 verify:true sådan items, rp-i-dag-koerer-jens-paa-hendes-cykel).
Not covered: full re-audit of Danish content; TTS audio output; root card.
Lessons: 0 new (smoke-passes-on-placeholder-data confirmed useful)

## Re-test at aaabfad (rebased onto master with PR #4: FORKLARING explainer + DanskSpeech)
Verdict: PASS WITH ISSUES (unchanged). HEAD verified = aaabfadf3156d471923156836ee96601dd449eb1; diff vs master = pronomenmysteriet/data.js only.

| Check | Result | Evidence |
|---|---|---|
| 0 "Test sentence" in data.js | PASS | grep -c = 0 |
| 6 modes start rounds with real Danish sentences containing ___ | PASS | spec-dumped round items: 10/10 per mode, all with ___, e.g. "Ved du, hvorfor hun ikke ville tale med ___ efter mødet?" |
| tests/pronomenmysteriet.mjs from file:// | PASS WITH ISSUES | 61/65 in 2 runs. Fails: missed-items-next-round x2 (accepted todo PF-1); "Space toggles a chip" (spec bug, as before); "Videre is focused after wrong" failed in 1 of 2 runs (spec flake, activeElement=body when random answer was correct). Manual x2 at 360px: wrong key-2 answer -> Videre focused, Enter advances |
| FORKLARING explainer coexists | PASS | button .xpm-btn in .sd-bar, 44x44, aria-label "Se en forklaring"; click opens modal (ExplainerModal.isOpen true), 2 scenes chooser (min-mit / sin-hans) shown, no h-scroll, Escape closes; 0 console issues; viewed small-explainer-open.png |
| Speech/TTS with real sentences | PASS | stubbed da-DK voice: replay button speaks normalised text in all 6 modes (prompt + after answer), no errors. DanskSpeech.normalize over all 760 items (context, blank form, filled form): 0 throws, 0 empty/odd outputs |
| Console clean, 360px layout | PASS | spec console-clean + 16/16 layout cells; 360 play screen no overflow, 0 issues; viewed small-play-real-aaabfad.png |
| Content audit | NOT VERIFIED (accepted by PM) | data identical to b9abb96 |

New observation (not a defect of this branch): the blank is sent to TTS as "…" and the normaliser turns it into a comma, so the voice says e.g. "Jeg har et vindue, er åbent." (pause, no word). Acceptable cosmetic behaviour; for the PM to judge.
New bugs: none. Scratch file pm-items.json (written by the spec to cwd) moved out of the worktree to scratchpad.
Not covered: real audio output (voice stubbed); content re-audit.
Lessons: 0 new
