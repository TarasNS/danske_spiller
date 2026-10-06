Verdict: FAIL
Tested: master@f0afa8af87e5dcde8764d83ce96b763c47e9b112 (main checkout, clean)

| Check | Result | Evidence |
|---|---|---|
| data.js contains real content | FAIL | 760/760 items are placeholders: sentence "Test sentence N.", options ["opt1","opt2"], note "Test note.", context_da []. 0 items with `___`. |
| Counts vs spec 5.7 | PASS (count only) | 120/120/180/100/140/100 = 760, ids unique |
| Mode keys match game | FAIL | data keys `anaphoric_agreement`, `indefinite_pronouns`; index.html expects `den_det_de`, `nogen_nogle_noget` (lines 163-164). Modes 4 and 5 have 0 items: tests/pronomenmysteriet.mjs "den_det_de: round starts with 10 items" FAIL |
| Levels | FAIL | placeholder levels A1/A2/B1 (A1 = 50%); game filters A2/B1/B2. 50% of items unreachable, B2 empty |
| Spec fields (reference, gloss_en) | FAIL | `reference` only in reflexive mode (and placeholder); no `gloss_en` anywhere; 2 options, spec examples use 3 (sin/hans/deres) |
| Smoke matrix (3 viewports + 360, dark, reduced-motion, LS blocked) | PASS | smoke.mjs 28/28, but runs on the placeholder content so says nothing about real layout |
| Round flow, auto-advance, SRS keys, reload | PASS | spec: advance 822-943 ms; keys `pronomenmysteriet:<mode>:<id>`; boxes survive reload; modes 1-3 only |
| SRS: missed items return next round | FAIL | spec "due items first on new round" FAIL in modes 1 and 3 (missedBack=false). Matches known todo (buildRound treats unseen as due); not caused by placeholders |
| Keyboard | PASS | `1` selects, feedback appears, Enter advances, Escape returns to menu (scratchpad kb.mjs) |
| Layout 360 / 390 / 820 / 1440 | PASS | no h-scroll, tap targets >=44 px (smoke); screenshot small-play.png viewed |
| Dark mode contrast | PASS | smoke dark/light >=4.5 |
| Content audit (>=30 per mode) | NOT VERIFIED | nothing to audit; placeholders |

Root cause
- Commit 2d606e5 ("create data.js ... Commit includes placeholders that will be replaced") landed after b9abb96 and overwrote the real 760-item dataset (231,704 bytes, 0 placeholders, keys den_det_de/nogen_nogle_noget, levels A2-B2, all QA'd per reports/pronomen-data.md). Master data.js = 225,704 bytes placeholder.
- b9abb96 is an ancestor of master, so the real file is recoverable: `git show b9abb96:pronomenmysteriet/data.js`.
- `.worktrees/pronomen-fix` has an uncommitted data.js with 0 placeholders (784 insertions/10,794 deletions), apparently the restore. NOT tested by me (brief said master).

Bugs
- [PM-1] blocker . Open Pronomenmysteriet, press Spil in any mode. Expected real Danish items with `___` gaps and 3-way choices; actual "Test sentence 13." with "opt1/opt2", feedback "Rigtigt svar: opt1 / Test note." . data.js:8 onward.
- [PM-2] blocker . Choose mode 4 or 5 and press Spil. Expected a 10-item round; actual no round starts (0 items) because data keys differ from MODES keys. data.js keys vs index.html:163-164.
- [PM-3] major . A1 items filtered out by LEVELS=['A2','B1','B2']; half the pool is unreachable; spec range is A2-B2. Solved by restoring real data.
- [PM-4] minor (pre-existing, todo exists) . Missed items not prioritised in next round (pronomen-srs todo).
- [PM-5] minor (pre-existing todo pronomen-gloss-spoiler): English gloss shown before answering in real data; not re-verified here.

"SAGSMAPPE" is not a mode: it is the tab label of the theme (SAG n . MODENAME header); no separate mode behaviour is specified. Spec 5.3: each item is a mini case; correct answers close the case with a green seal, wrong answers reveal one evidence line.

Content flags: none auditable on master. Pending native check list from pronomen-data.md (22 rp-de-* deres items, 4 nogle-after-negation, 3 verify:true sådan items) applies once real data is back.

Not covered: pronomen-fix worktree, real-data layout (long Danish words, owner-chain wrapping at 360), TTS, muted mode, root card, free-text (game is multiple choice).
Lessons: 1 new
