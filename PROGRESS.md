# Build Progress — danske_spiller

**Rules:** Pick ONE `status: todo` task. Read `prd.md` (platform rules) + `specs.md` (per-game spec) before touching any file. Commit after every meaningful checkpoint. Update this file as your final commit. Never edit `specs.md` or `prd.md`. Full rules: `.claude/prompts/build-increment.md`.

**Precedence:** `prd.md` > `specs.md` > this file. Conflict → move task to Blocked, stop.

---

## Key Constraints (apply to every task)

- Vanilla HTML/CSS/JS only — no frameworks, no build step, no fetch/XHR/CDN
- Must work via `file://` — zero console errors on open
- All CSS/JS inline unless from `/shared/`
- Stable item IDs always (never array indices as progress keys)
- Interface in Danish; English only to resolve semantic ambiguity
- Every Danish prompt → TTS replay button via `DanskCore.tts`
- Start screen: title + one Spil button + compact mode/level controls only
- Correct: animation + sound + auto-advance ~800 ms (no congratulatory text)
- Wrong: correct answer + one grammar note + TTS replay (no encouragement)
- 360 px min width, 44×44 px touch targets, full keyboard nav, dark mode, reduced motion, sound mute

## Shared Library Summary (`shared/dansk-core.js` → `window.DanskCore`)

| Module | Key methods |
|---|---|
| `tts` | `speak(text)`, `replay()`, `isAvailable()` — silent fallback, Danish voice |
| `store` | `get/set/remove(key)`, `namespace(prefix)` — swallows QuotaExceededError |
| `srs` | `load/record/isDue/nextItems/pattern` — Leitner 5-box; key: `<game>:<mode>:<id>` |
| `diff` | `normalize(str)`, `check(answer, accepted[])`, `tokenDiff(a,b)` |
| `level` | `filter(items, levels)`, `LEVELS: ['A1','A2','B1','B2','C1']` |
| `ui` | `darkMode`, `motion`, `sound.sequence(steps)`, `ttsButton()`, `focusTrap()`, `announce()` |
| `quiz` | `mc`, `freeText`, `tiles`, `summary` renderers |

Sound `sequence(steps)`: `[{ type, frequency, duration, gain, delay? }]` — init AudioContext on first user interaction only; do not play when `document.hidden`.

## Shared Data Files

| File | Export | Target |
|---|---|---|
| `shared/data/nouns.js` | `DANSK_NOUNS` | 300 nouns; schema: id, level, gender, 4 forms, plural_pattern, note |
| `shared/data/adjectives.js` | `DANSK_ADJECTIVES` | 220 adj; schema: id, level, common/neuter/def-pl forms, comparative, superlative, periphrastic flag |
| `shared/data/verbs.js` | `DANSK_VERBS` | 200 verbs; schema: id, level, infinitive, present, preterite, perfect_auxiliary, participle, imperative |
| `shared/data/pronouns.js` | `DANSK_PRONOUNS` | personal, possessive, reflexive_possessive, demonstrative, indefinite |
| `shared/data/clause-patterns.js` | `DANSK_CLAUSES` | ~80 transformation templates |
| `shared/validate.js` | — | Checks: unique IDs, allowed levels, required fields, correct in options, no dupes after normalize |

## Game Quick Reference

| Game | Folder | Levels | Modes | Item target | Theme palette |
|---|---|---|---|---|---|
| Bøjningsværkstedet | `boejningsvaerkstedet/` | A1–B2 | 6 | ~2,050 | Parchment #E8DDC4, Brass #B88A44, Wood #7A5134 |
| Pronomenmysteriet | `pronomenmysteriet/` | A2–B2 | 6 | 760 | Navy #17233F, Gold #D2A94F, Paper #F0E7D2 |
| Sætningsmaskinen | `saetningsmaskinen/` | A2–C1 | 7 | 1,020 target (current: 99) | Cream #F2E7CC, Coral #D96D5F, Blue #4E82A6 |
| Tidsmaskinen | `tidsmaskinen/` | A2–C1 | 9 + Timed | 1,260 | Deep blue #17263B, Amber #B67A3D, Cyan #3C93A8 |
| Skrivekontrollen | `skrivekontrollen/` | B1–C1 | 7 | 1,190 | Paper #E8E0C8, Ink #23231F, Proof red #A13D3D |

**Import pattern for every game:**
```html
<script src="../shared/dansk-core.js"></script>
<script src="../shared/data/nouns.js"></script>  <!-- only if needed -->
<script src="./data.js"></script>
```

**SRS key format:** `<game-id>:<mode>:<item-id>` · pattern key: `pattern:<game-id>:<type>:<value>`

**Round-end screen must include:** score, accuracy, ≤3 weakest items, Spil igen button, optional Gentag fejl chip, optional cross-game recommendation chip (one only).

**Data validation before every data commit:** unique IDs, levels in A1/A2/B1/B2/C1, non-empty accepted_answers, correct answer present in options.

---

## Next Up

- id: pronomen-data
  spec: pronomenmysteriet
  status: completed
  title: "Pronomenmysteriet — data.js: 760 curated items (Mode 3 items manually QA'd: no two plausible answers)"
  notes: "Completed with commit 2d606e5: 760 items across 6 modes. Subject/object (120), possessive agreement (120), reflexive possessive (180), anaphoric agreement (100), indefinite pronouns (140), demonstrative (100). All items validated: unique IDs, valid levels, required fields present."

- id: saetning-data
  spec: saetningsmaskinen
  status: todo
  title: "Sætningsmaskinen — data.js: 1,020 items across 7 modes (target; current 99 hand-written items)"
  notes: "REOPENED (decision #9, QA story US-051, see stories/implementation/US-051.md). The earlier 'completed' (commit 1293499, 1,020 items) was wrong: ~920 of those items were clone-generator filler (Array(N).fill(null).map(...)) and were removed. Real current count in saetningsmaskinen/data.js = 99 items: adverb_placement 40, main_to_subordinate 10, direct_question 10, indirect_question 10, relative_clause 10, der_or_det 9, clause_chain 10 (target 140/160/140/140/180/160/100). Authoring the ~920 missing items requires new Danish content plus native-speaker review. Not done until data reaches the intended size."
  previous_completed_date: 2026-10-03
  previous_completed_commit: 1293499

- id: saetning-game-1
  spec: saetningsmaskinen
  status: todo
  blocked_by: saetning-data
  title: "Sætningsmaskinen — index.html: block tile theme, Modes 1–4 (ikke-flytt, main→sub, spørgsmål, indirekte)"
  notes: "BLOCKED until saetning-data reaches the intended size (currently 99 of 1,020 items; see saetning-data)."

- id: saetning-game-2
  spec: saetningsmaskinen
  status: todo
  blocked_by: saetning-data
  title: "Sætningsmaskinen — Modes 5–7: relativværksted, der/det, sætningskæde + SRS + register in index.html"
  notes: "BLOCKED until saetning-data reaches the intended size (currently 99 of 1,020 items; see saetning-data)."

- id: tids-data-polish
  spec: tidsmaskinen
  type: data
  status: todo
  priority: P2
  title: "Tidsmaskinen data polish: fix 12 answer-leaking contexts (e.g. han-har-ikke-drukket-noget-endnu-i-dag, de-har-kendt-hinanden-siden-de-var-boern, the eight '...-da-...' pluperfect duration items #88-97); stale context in auktionen-finder-sted-den-3-marts; weak distractor 'kommer til at spise' in jeg-vil-spise-mere-sundt-fra-i-dag; add 'vil jeg ...' handling for open-condition main clauses"
  acceptance: "tester re-read PASS"

- id: tids-native-review
  spec: tidsmaskinen
  type: data
  status: todo
  priority: P2
  title: "Tidsmaskinen native-speaker review of 124 verify:true items incl. 11 hvornår-* items, bekymr-dig-ikke, epistemic må, forberedede distractor"

- id: seo-tidsmaskinen
  type: chore
  status: todo
  priority: P2
  title: "seo agent: finalise head copy, JSON-LD and sitemap entry for tidsmaskinen/index.html"
  acceptance: "head copy + JSON-LD present; sitemap.xml lists the page"

- id: tids-ux-polish
  spec: tidsmaskinen
  type: code
  status: todo
  priority: P2
  title: "Tidsmaskinen UX polish: red ✗ on correct answer in blank on wrong/timeout; first-option focus scrolls timeline under sticky bar at 360 px; distinguish mode 6 blanks; caption font size >= comfortable; swap duplicate 'ur' sprite (shared with Adverbier card)"
  acceptance: "tester re-run PASS"

- id: tids-caption-review
  spec: tidsmaskinen
  type: data
  status: todo
  priority: P2
  title: "Tidsmaskinen native review of the note-to-zone caption table and the 124 verify:true items"

- id: skrive-data
  spec: skrivekontrollen
  status: todo
  title: "Skrivekontrollen — data.js: 1,190 items (Mode 1: exactly ONE error per sentence, no accidental second)"

- id: skrive-game-1
  spec: skrivekontrollen
  status: todo
  title: "Skrivekontrollen — index.html: paper/typewriter theme, comma convention toggle (localStorage), Modes 1–4"

- id: skrive-game-2
  spec: skrivekontrollen
  status: todo
  title: "Skrivekontrollen — Modes 5–7: reference, edit text, register + SRS + register in index.html"

- id: qa-pass
  spec: prd.md § Overall Definition of Done
  status: todo
  title: "QA pass — all 5 games: 360 px, dark mode, keyboard nav, zero console errors via file://"

# Gap-closing tasks (from grammar coverage review 2026-10-02; plan: .claude/plans/build-me-an-implementation-foamy-lobster.md)
# Build order for the 4 specced games: pronomen → tids → saetning → skrive. Reconcile boejning-data first: counts now fire_former 1300, byg 570, adj 746, sammenligning 186, bestemt_ubestemt 250, maengde 221 — verify against prd § 2.4 targets and close.


- id: adj-agreement-gaps
  spec: boejningsvaerkstedet (4.4 Modes 2-3)
  type: data
  status: todo
  priority: P2
  title: "Bøjningsværkstedet — add definite-neuter, definite-plural and predicative-vs-attributive adjective items; raise neuter share of Mode 2 (20 of 570)"
  acceptance: "Mode 3 covers all 6 agreement cells; Mode 2 neuter >= 30%; generated from window.DANSK_ADJECTIVES; validate.js clean"

- id: en-et-gender-rules
  spec: en og et
  type: code
  status: todo
  priority: P2
  title: "En/Et-træner — add suffix/category rule hints (-ing/-hed/-else = en; -um/-ment = et) and a rules mode"
  acceptance: "rule shown after wrong answer where a rule exists; new mode reachable from start screen; no console errors; 360 px ok"

- id: ordstilling-subclause
  spec: ordstilling-detektiv
  type: data
  status: todo
  priority: P2
  title: "Ordstillingsdetektiven — add case 13: ikke/adverb placement in subordinate clauses and indirect questions"
  acceptance: ">= 20 new tile sentences (at, som, fordi, om, hvor); one defensible order each; grammarTip explains SAV; no regression in cases 1-12"

- id: srs-prioritise-missed
  type: bug
  status: todo
  priority: P2
  title: "buildRound treats unseen items as due so just-missed items are not prioritised (seen in Pronomenmysteriet; check boejningsvaerkstedet for the same logic and fix both or the shared DanskCore.srs.nextItems usage)"
  acceptance: "after a round with 3 misses, those 3 appear in the next round (or earliest due), tested in 2 modes"

- id: pronomen-gloss-spoiler
  type: code
  status: todo
  priority: P2
  title: "Pronomenmysteriet: English gloss shown before answering gives away reflexive answers; show it only after answering (or behind a toggle); owner-chain arrows wrap at 360 px"
  acceptance: "gloss hidden until answered; chain does not wrap awkwardly at 360 px; smoke passes"

- id: pronomen-native-review
  type: data
  status: todo
  priority: P2
  title: "Native-speaker review of Pronomenmysteriet content: 22 rp-de-* deres items, nogle after negation (4), 'Jeg kender ikke ___ i byen', 'tilfælles' spelling, odd notes ('spørger nogen', 'i ukendt betydning'), 3 verify:true sådan items"
  acceptance: "native speaker confirms or corrects each listed item; data.js updated; validate.js passes"

- id: seo-pronomen
  type: chore
  status: todo
  priority: P2
  title: "seo agent: finalise head copy, JSON-LD and sitemap.xml entry for pronomenmysteriet/index.html"
  acceptance: "head copy + JSON-LD present; sitemap.xml lists the page"

- id: verbs-aux-har-er
  type: data
  status: todo
  priority: P2
  title: "verbs.js perfect_auxiliary has a single value; gå/løbe/falde/flyve/springe/ride… take 'har' in activity senses (har gået i skole, har løbet en tur). Needs a schema decision (optional second auxiliary value) before change"
  acceptance: "decision recorded in specs/prd by the user, then data + consumers updated; tidsmaskinen/data.js already uses literals"

---

## Blocked

---

## Completed
- tids-game-1 / Tidsmaskinen shell + modes 1–5 + Med tid / 2026-10-03 / b15b125
  notes: "zones/captions conservative: lit only when the item note states the meaning, else neutral 'Konstruktion: <svar>'; SEO head + sitemap entry + native caption review still to do"
- tids-game-2 / Tidsmaskinen modes 6–9 + timeline theme / 2026-10-03 / b15b125
  notes: "zones/captions conservative: lit only when the item note states the meaning, else neutral 'Konstruktion: <svar>'; SEO head + sitemap entry + native caption review still to do"
- tids-data / Tidsmaskinen data.js, 1,260 items / 2026-10-03 / 59a37c1
  notes: "124 verify:true items need native review; 114 accepted_answers are outside options by design (game must not render them as options); future/modal items use literal auxiliaries"
- fix-verbs-imperative / verbs.js doubled-consonant imperatives (snak, spil, luk…) / 2026-10-03 / 2937b84
- pronomen-game / Pronomenmysteriet game, 6 modes + courtroom theme / 2026-10-03 / 08cf0da
  notes: "PASS WITH ISSUES accepted by PM; SEO head copy + sitemap entry still to do (seo agent)"
- pronomen-data / Pronomenmysteriet data.js, 760 items / 2026-10-02 / a5eceb1
  notes: "native-speaker review still open: 22 rp-de-* deres items, 4 nogle-after-negation items, borrowed-bike item, 3 verify:true sådan items."
- fix-noun-laerer / nouns.js lærer/computer/printer definite plural fix / 2026-10-02 / c4e1167
- boejning-data / Bøjningsværkstedet data.js: 6 modes, 3,273 items / 2026-09-24 / 252f0c3
  notes: "All 6 modes fully populated and validated (zero errors/warnings). Mode counts all at/above targets: fire_former 1,300/900, byg_navneordet 570/500, adjektivvaerkstedet 746/400, sammenligningspressen 186/180, bestemt_ubestemt 250/250, maengdevaerkstedet 221/220. Modes 1-4 auto-generate from shared DANSK_NOUNS/DANSK_ADJECTIVES at load time. Modes 5-6 hand-authored contextual items. Game shell + all renderers already implemented and tested."
- shared-data-adj-verbs / Shared data — adjectives.js (220) + verbs.js (200) / 2026-09-24 / b2c7dc7
  notes: "Fully done. verbs.js = 201 verbs (commit 17a49fd). adjectives.js now = 220 (commit b2c7dc7): added 37 via the existing mechanical builders — 12 -ig/-lig (flittig, fornuftig, villig, rigelig, ivrig, grundig, hyppig, dygtig, kraftig, ordentlig, saftig, luftig), 16 regular monosyllabic -est class via adjReg (klar, fjern, stejl, vild, mild, stiv, våd, rar, dyb, fed, flink, frisk, rask, vred, tavs, barsk — all chosen so no consonant-doubling is needed, since adjReg does not double), 3 -som m-doubling (opmærksom, betænksom, sparsom), 4 -isk periphrastic (magisk, tragisk, komisk, demokratisk), 2 -løs periphrastic-with-neuter-t (trådløs, smagløs). node shared/validate.js = 0 errors / 0 warnings across all datasets; strict re-check (all 10 adjective schema fields required, dedupeField base) = 0 errors / 0 warnings, 220 items, unique ids+bases, all flags boolean, levels A1 45 / A2 72 / B1 74 / B2 29, 28 verify:true (carried over, native-speaker confirmation of rare comparatives). Downstream boejning-data Mode 2/3/4 can now read the full 220-adjective set at load time."

- shared-data-nouns / Shared data — nouns.js (300 nouns, all schema fields) / 2026-09-23 / 7318872
  notes: "Completed: shared/data/nouns.js now exports 325 nouns via window.DANSK_NOUNS (target was 300). This run added 137 (103 builder-safe REGULAR + 34 explicit MANUAL). MANUAL entries cover the forms the noun() builder cannot derive: consonant-doubling (metal→metallet, kop→koppen, klub→klubben, medlem→medlemmet, billet, fabrik, knap, tablet, rabat, skat, ret, forskel, sæk, kok), schwa-elision -el/-er stems (gaffel→gaflen, muskel→musklen, seddel→sedlen, skulder→skuldre, regel→reglen), agent -er nouns whose plural is -e but definite plural drops the extra e (tjener→tjenere→tjenerne, kunstner, musiker, skuespiller, forfatter, politiker, forsker — NOTE the builder would wrongly produce e.g. 'tjenerene'; the pre-existing REGULAR entry 'lærer' at ~line 216 has this latent bug producing 'lærerene' and should be corrected to MANUAL 'lærerne' in a future data-repair pass), irregular (landmand→landmænd, løn→lønninger), foreign (museum→museet→museer), and zero-plural-with-doubling (myg→myggen, lam→lammet, spil→spillet). Validation via shared/validate.js (DanskValidate.validateDataset with all noun schema fields required) = 0 errors / 0 warnings; unique ids, 0 duplicate bases, all genders en/et, all plural_pattern values in the allowed set, all indefinite_singular consistent with gender+base, 72 irregular-ish forms (>40 min), 10 flagged verify:true (café/idé/eksamen/morgen/køkken/sol/frygt/app/menneske carried over + tallerken new). Levels: A1 135, A2 120, B1 65, B2 5. Downstream: boejningsvaerkstedet/data.js Mode 1 (fire_former) reads DANSK_NOUNS at load time so its item count auto-scales from 752 toward the 900 target with no regeneration needed."
- boejning-modes-4-6 / Bøjningsværkstedet — Modes 4–6 + round-end + register in index.html / 2026-09-22 / 1e61f14
  notes: "The three renderers (RENDERERS.sammenligningspressen three-slot press, RENDERERS.bestemt_ubestemt and RENDERERS.maengdevaerkstedet via the shared makeMcRenderer for context+MC), the round-end summary (score, accuracy, ≤3 weak items, Spil igen, Gentag fejl, cross-game chip), and the root /index.html GAMES registration (entry present at index.html:385-393, recommended:true) were ALL already committed in prior runs but the task stayed todo. This run VERIFIED and FIXED rather than rewrote. BUG FOUND + FIXED (commit 1e61f14): Mode 5 (bestemt_ubestemt) and Mode 6 (maengdevaerkstedet) items follow prd.md § 2.4 contextual/quantifier schemas which carry NO `mode` field (unlike fire_former/adjektiv/byg/sammenligning whose prd schemas include mode). renderItem routed via RENDERERS[item.mode] and weakLabel branched on item.mode, so those two modes fell through to the _fallback empty-state and never rendered — mode buttons enabled (pool>0 via buildStartControls) but Spil showed the 'kommer snart' empty state. Both now use `item.mode || state.mode` (a round is always single-mode, so state.mode is the correct discriminator). Modes 1-4 unaffected (their items set mode === state.mode). VERIFICATION (headless DOM shim tmp_boot_boejning.js, extended with an Element.contains method the real browser provides): boots 0 console errors; sammenligningspressen renders 3 slot-inputs; bestemt_ubestemt + maengdevaerkstedet each render 2 options + a context blank and process a keyboard answer; a full MC round runs to the summary screen — 0 console errors throughout. shared/validate.js (DanskValidate.validateDataset) = 0 errors / 0 warnings for all three arrays (sammenligningspressen 151, bestemt_ubestemt 37, maengdevaerkstedet 35); correct-in-options violations = 0; 0 duplicate ids across all six modes. NOTE for boejning-data (still in-progress): Mode 4/5/6 item COUNTS are under the prd § 2.4 targets (151/180, 37/250, 35/220) — growing those datasets belongs to boejning-data, not here; the renderers scale automatically as data.js grows (arrays read at load). No renderer change needed for larger datasets."
- shared-core-1 / DanskCore module 1 — store, tts, srs, diff (shared/dansk-core.js) / 2026-07-15 / 5534b28
- shared-core-2 / DanskCore module 2 — level, ui, quiz (append to shared/dansk-core.js) / 2026-07-15 / e5fe18c
- shared-data-pronouns-clauses / Shared data — pronouns.js + clause-patterns.js (87 items) + validate.js / 2026-07-16 / 9c4afe0
- boejning-modes-1-3 / Bøjningsværkstedet — Modes 1–3: Fire former, Byg navneordet, Adjektivværkstedet / 2026-09-21 / 605b801
  notes: "All three renderers were implemented in commit 605b801 (mislabelled 'Auto-build: uncommitted leftovers') but PROGRESS.md was never updated, so the task stayed marked todo. This run VERIFIED the work rather than re-writing it: (1) shared/validate.js (via the committed harness) passes 0 errors / 0 warnings for fire_former (752), byg_navneordet (570) and adjektivvaerkstedet (606); Mode 2 order/piece integrity check = 0 problems. (2) Booted the index.html inline game script in a minimal Node DOM shim with TTS/AudioContext/matchMedia all absent — game boots with ZERO console errors; each of the three modes renders an item and processes an answer: Mode 1 free-text wrong answer shows the proofing slip with 'Rigtigt svar' + note; Mode 3 same; Mode 2 tap-to-place fills 3 slots and check() produces done-correct/done-wrong feedback. RENDERERS.fire_former, RENDERERS.byg_navneordet, RENDERERS.adjektivvaerkstedet all present and wired via the RENDERERS registry; mode buttons auto-enable because DATA[key] arrays are non-empty. Also removed stray tmp_gen_test.js accidentally committed in 605b801. NOTE: Mode 1/3 item COUNTS will grow automatically toward the 900/400 targets as shared-data-nouns (188/300) and shared-data-adjectives (183/220) are completed — no renderer change needed. Root /index.html GAMES registration is intentionally NOT done here (belongs to boejning-modes-4-6, per boejning-shell notes)."
- boejning-shell / Bøjningsværkstedet — index.html: parchment/brass theme, start screen, routing, SRS / 2026-09-06 / 21286c2
  notes: "Full shell built and verified via a Node DOM shim (boots with zero runtime errors, TTS/sound safely guarded when unavailable). Delivers: parchment/brass theme with CSS custom properties + [data-theme=dark] dark mode + prefers-reduced-motion handling; start screen (title + one Spil button + compact 6-mode selector + A1-B2 level chips, persisted to localStorage via DanskCore.store namespace 'boejningsvaerkstedet'); round engine that draws up to 10 items preferring SRS-due (DanskCore.srs.nextItems) padded with shuffled pool; SRS records item results AND pattern keys in the prd format 'pattern:boejningsvaerkstedet:noun:<form-slug>:<plural_pattern>'; round-end summary (score, accuracy, <=3 weak items, Spil igen, Gentag fejl, one cross-game chip -> En/Et-traener when noun-form accuracy <70%); SOUND_THEME per prd 2.5. Mode 1 (Fire former) is FULLY IMPLEMENTED as the working slice: 2x2 Ubestemt/Bestemt x Ental/Flertal grid with one highlighted target cell, free-text entry normalized via DanskCore.diff.check, proofing-slip feedback (correct auto-advances ~800ms; wrong shows correct answer + note + TTS replay + Videre). Modes 2-6 route to a graceful empty-state placeholder because DATA[mode] arrays are still empty (see boejning-data task). NEXT (boejning-modes-1-3): the RENDERERS registry in index.html is the extension point — add RENDERERS.byg_navneordet (tap-to-place tiles, reuse DanskCore.quiz.tiles) and RENDERERS.adjektivvaerkstedet; these need boejning-data Modes 2-3 populated first. Mode buttons auto-enable once their DATA[key] array is non-empty (poolFor check in buildStartControls), so no shell change is needed to surface them — only add the renderer + the data. Root /index.html GAMES registration is intentionally NOT done here (belongs to boejning-modes-4-6 task)."
