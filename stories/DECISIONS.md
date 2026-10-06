# Owner decisions (recorded during the implementation run)

| # | Topic | Story | Decision | Date |
|---|---|---|---|---|
| 1 | Forbindeord distractors are now syntactically impossible for the slot | US-002 | Accept as is. Revisit only if a native speaker wants harder options. | 2026-10-04 |
| 2 | Konjunktioner QA-120: "Det føles, som om…" cannot be a blank on key `at` | US-022 | Keep "Jeg føler, at sommeren aldrig kommer i år." (tests `at`). | 2026-10-04 |
| 3 | Adverbier dataset is 10 entries; Måde and Frekvens zones empty | US-007 | Hide empty zones (or mark as coming soon) and correct the misleading ~500 header comment; word list stays at 10 until a native speaker can help expand it. | 2026-10-04 |
| 4 | Ordstillingsdetektiven first statement: tiles below the fold | US-013 | Collapse the case story on the 1st statement too, with a clear "read the case" toggle. | 2026-10-04 |
| 5 | Lynrunde XP | US-044 | Confirmed: 10 XP per hit (same as other modes); speed score still +10 per hit. | 2026-10-04 |
| 6 | Adverbier dialogs use a local focus trap (shared `DanskCore.ui.focusTrap` counts a hidden textarea) | US-031 | Accept the local trap; shared helper bug stays recorded as a follow-up. | 2026-10-04 |
| 7 | En/Et word øl: note says en and et øl are both used but the game scores only en | US-024 | Accept both en and et as correct for øl and keep the note. | 2026-10-04 |
| 8 | En/Et mode icons do not always match their mode | US-032 | Re-pick the closest-fitting sprites from the existing shared library (no frozen file edits). | 2026-10-04 |
| 9 | Stale Sætningsmaskinen docs (1,020 vs 99 items) | US-051 | Update PROGRESS.md AND both specs files (`specs.md`, `improvement/specs.md`) to match the 99-item reality: the user explicitly approved editing the specs files for this change only. | 2026-10-04 |
| 10 | Tidsmaskinen: "six planned-future duplicates across modes" (list in `stories/implementation/D-TIDS-duplicates.md`) | US-050 | Keep all six duplicate pairs: no change (no learner-visible harm, no progress lost, no test changes). | 2026-10-04 |
| 11 | New Danish UI strings from round 2 ("Næste", "Lyt til ordet", "Lyt til sætningen", "Lyt til hele sætningen", "Fortsæt →") | US-056, US-057 | Approved by the owner's review ("Good"). | 2026-10-05 |
| 12 | Dansk Mester timed mode (Tidsudfordring) still advances 1.5 s after a wrong answer or timeout (countdown is per question and already stopped) | US-057 | Leave as is: timed mode stays a fast drill; no wait-for-Fortsæt, no mistakes list. | 2026-10-05 |
| 13 | Tidsmaskinen spec-test row "correct: auto-advance 700-1000 ms" is flaky (can exceed 1000 ms) | tests | Accepted as is (OK). | 2026-10-05 |
| 14 | Native-speaker review of all changed Danish content (rounds 1-2, incl. the 18 `verify:true` explainer scenes and sin-hans/U-03) | all content stories | Owner: the reviewer accepted everything, no corrections. Native-review criteria count as signed off; scenes set to `verify:false`. Data entries flagged `verify:true` in `shared/data/*` (nouns/adjectives) were not part of this review and keep their flag. | 2026-10-05 |
| 15 | Where the shared answer-feedback helper lives | US-026 | `DanskCore.quiz.feedback(...)` in `shared/dansk-core.js` (not frozen); it calls the existing `Sjovt.fx.correct`, so no edits to frozen `shared/sjovt.*`. | 2026-10-05 |
| 16 | Scope of the PRD feedback contract | US-026 | Full contract (no praise/encouragement, correct sound, ~800 ms auto-advance on correct; wrong = answer + one note + TTS + one focused "Næste") in all 12 games, including games `specs.md` marks Complete: this is the owner sign-off for those games. | 2026-10-05 |
| 17 | Mute control for games that start emitting sound | US-026, US-040 | Per-game LYD toggle wired to `dc:sound-enabled` until US-040 provides the shared control. | 2026-10-05 |
| 18 | Speed/timed modes (Magiske Verber Hurtigduel 750 ms, Dansk Mester Tidsudfordring 1.5 s, Lynrunde, …) | US-026 | Keep their own pacing; praise text is still removed; each exception documented in the story report. Consistent with #12. | 2026-10-05 |
| 19 | Idiomjæger language | US-027 | Danish first: author Danish meanings/explanations (`m_da`, `x_da`) and Danish Kontekstmesteren prompts for all 171 idioms, shown by default; English kept behind a "Vis engelsk" hint. | 2026-10-05 |
| 20 | Adverbier "Find betydningen" | US-027 | Danish meaning options; English only as a hint (replaces "Engelsk: …" feedback). | 2026-10-05 |
| 21 | Glosekort English gloss | US-027 | Hidden on the card front by default; "Vis engelsk" toggle, remembered per learner. | 2026-10-05 |
| 22 | Who authors the new Danish | US-027 | Agents draft, entries flagged `verify:true`; owner's native reviewer signs off before publishing (same process as #14). | 2026-10-05 |
| 23 | Frozen files for theme/sound controls | US-040 | Approved: edit `index.html` (portal) and `shared/sjovt.js` (shared bar) for US-040 only. | 2026-10-05 |
| 24 | Theme behaviour | US-040 | Follow the OS by default; a manual choice is saved in localStorage `sd:theme` (try/catch), applied on every page before first paint. | 2026-10-05 |
| 25 | What mute silences | US-040 | Sound effects only (`dc:sound-enabled`); user-triggered TTS ("Lyt") always plays. Antonymer's TTS-gating sound setting goes away. | 2026-10-05 |
| 26 | Per-game theme/sound toggles | US-040 | Remove them once the bar has the controls (Adverbier, Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen, Antonymer, and any US-026 LYD toggles). | 2026-10-05 |
| 27 | `pixel-animation.html` | US-052 | Move out of the published root to `docs/redesign/pixel-animation.html` as a design reference; no reskin. | 2026-10-05 |
| 28 | Design brief | US-053 | Approved: rewrite the font/colour/button rules in `docs/redesign/AGENT-BRIEF.md` to match the shipped system (SD Mono / JetBrains Mono, per-game `--game` colours); other reskin rules unchanged. | 2026-10-05 |
| 29 | Design test report | US-053 | Edit `docs/redesign/TEST-REPORT.md` line 10 in place (no dated note). | 2026-10-05 |
| 30 | CLAUDE.md | US-053 | Remove the stale `lærerene` note and commit CLAUDE.md to the repo. | 2026-10-05 |
| 31 | Explainer font fallback | US-053 | Remove the "Pixelify Sans" fallbacks from `shared/explainer/modal.css`; re-test the explainer. | 2026-10-05 |
| 32 | Frozen `shared/sjovt.js` for the generic sprites | US-038 | Approved for US-038 only: redraw the 9 generic 16 px sprites as shaded 32 px sprites matching the 32 px family (so no row mixes densities). | 2026-10-05 |
| 33 | Approximate icons | US-038 | Add ~3-4 new 32 px sprites (e.g. speed, mixed/random, stats) so each sprite has one meaning; replace the best-fit `tryllestav`/`terning`/`ur` uses; update the icon map. | 2026-10-05 |
| 34 | Art review | US-038 | Designer + tester agents judge the art; owner sees the result in the PR (no separate approval gate). | 2026-10-05 |
| 35 | Frozen files for shared chrome | US-039 | Approved for US-039 only: `shared/sjovt.css`, `shared/sjovt.js`, `index.html` (bar arrow, portal radius 0 + framed theme button, grid to the bottom, `--sd-bar-h` = rendered bar height, remaining dark surfaces). | 2026-10-05 |
| 36 | Arrow glyphs (← ▶ ▼ ⟵ ⟶) | US-039 | Replace with pixel-art sprites matching the icon family (no system-font fallback). | 2026-10-05 |
| 37 | Results screens | US-039 | Shared styles only: results classes in `sjovt.css`; each game keeps its own results markup/flow. No shared JS results component (so no `DanskCore.ui.results`). | 2026-10-05 |
| 38 | Frozen `index.html` for portal wording | US-050 | Approved for US-050 portal slice only: "onlinespil", "danskundervisning", "A1–B2-niveau", og:description "verber". | 2026-10-05 |
| 39 | Portal card levels | US-050 | Show the full item range: Konjunktion Crush A1–B2, Ordstillingsdetektiven A1–B2, Forbindeord A1–C1. | 2026-10-05 |
| 40 | Native review of the portal wording | US-050 | Not needed: QA-proposed spelling/compound fixes ship as is. | 2026-10-05 |
