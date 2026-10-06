# Sjovt Dansk: Final QA Report (Coordinator)

**Date:** 2026-10-04
**Role:** QA Coordinator / Reviewer. Read-only: no production file was changed, and no fix or implementation was started.
**Inputs:** five worker reports in `qa/`:
- `language-review.md` (LANG)
- `gameplay-review.md` (GAME)
- `video-review.md` (VID)
- `ui-responsive-review.md` (UI)
- `visual-consistency-review.md` (VIS)

Worker evidence (scripts and screenshots) is in the session scratchpad `…\scratchpad\qa-{language,gameplay,video,ui,visual}\`. The coordinator's own scripts are in `…\scratchpad\qa-coordinator\` (`verify.mjs`, `tids_adv.cjs`).

**Severity used here:**

| Severity | Meaning |
|---|---|
| Critical | The game is unusable or can't be completed, it teaches seriously wrong content in a systemic way, or there is a major runtime failure |
| Major | An important function is wrong, a significant usability problem, a missing or wrong explanation, a repeated language issue or wrong answer key, or a strong cross-game inconsistency |
| Minor | Cosmetic, small wording, or polish |

**Rules applied:**
- Findings marked UNCONFIRMED are listed separately and are not counted as defects.
- Consolidated IDs are `QA-001…QA-128`. Unconfirmed items are `U-01…U-06`.

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| Games/pages discovered | **17**: the portal, 14 linked games, Sætningsmaskinen (data only) and `pixel-animation.html` (unlinked demo) |
| Tested | **16** |
| Not tested | **1**: Sætningsmaskinen. It has no `index.html` and can't be played. Its data was reviewed for language only |
| PASS | **0** |
| PASS WITH ISSUES | **12**: Portal, Magiske Verber, Idiomjæger, Præpositioner, Antonymer, Bøjningsværkstedet, Glosekort, Dansk Mester, En/Et, Konjunktioner, Ordstillingsdetektiven, pixel-animation |
| NOT READY | **4**: Pronomenmysteriet, Forbindeord, Tidsmaskinen, Adverbier |

**Findings after dedup and verification:**

| | Critical | Major | Minor | Unconfirmed (not counted) | Total counted |
|---|---|---|---|---|---|
| **Final (consolidated)** | **3** | **60** | **65** | 6 | **128** |
| Raw worker totals | 8 | 68 | 92 | 3 + 1 info | 172 raw IDs |

Raw totals by worker:

| Worker | Critical | Major | Minor | Other |
|---|---|---|---|---|
| LANG | 6 | 44 | 23 | — |
| GAME | 1 | 11 | 27 | 2 UNCONFIRMED |
| VID | 0 | 3 | 10 | 1 info |
| UI | 1 | 4 | 11 | 1 UNCONFIRMED |
| VIS | 0 | 6 | 21 | — |

**Headline results:**
1. **Pronomenmysteriet ships placeholder data** (QA-001, Critical, confirmed).
   - All 760 items read "Test sentence N." with the options `opt1`/`opt2`.
   - Modes 4 and 5 are empty.
   - Read-only git history shows that commit `2d606e5` overwrote the curated dataset from `b9abb96`. That earlier version is clean: 760 real items, A2–B2, with the mode keys the game expects.
   - The game is linked from the portal (`index.html:265`).
2. **Forbindeord marks correct answers wrong in a systemic way** (QA-002, Critical, confirmed). Distractors are drawn from the answer's own category, and those categories hold synonym clusters such as fx/eksempelvis/bl.a. and formentlig/formodentlig/sandsynligvis.
3. **Tidsmaskinen's generator puts the sentence adverb after the participle in the "correct" model sentence** (QA-003, Critical, confirmed). Example: "Jeg var gået allerede hjem". This affects 14 of the 100 pluperfect items and 9 or more preterite/perfect items.
4. **Three worker Criticals were downgraded to Major** after verification, because each affects a single item or a small share of items:
   - LANG-034: Adverbier "derfor" can't be answered.
   - LANG-037: Idiomjæger "gå op i en højere enhed" is explained with the opposite meaning.
   - LANG-041: Præpositioner "Find fejlen" presents about 20 correct sentences as errors.

   All three are real defects.
5. **Adverbier is broken in its core loop.** Problems:
   - The page is blank when storage is blocked.
   - The review flow is broken.
   - The question mode never changes.
   - The answer shows in the prompt.
   - There is no TTS.
   - The dataset is a 10-item sample.
6. **Systemic issues:**
   - 11 legacy games don't follow the PRD feedback contract: they show praise text, have no auto-advance and play no sound (QA-031).
   - Three games show English as the main learning medium (QA-032).
   - Unguarded `localStorage` crashes three games (QA-004).
   - About 40 Major language answer-key or explanation errors are spread across 13 games.

**Final verdict: NOT READY** (see §12).

---

## 2. Coverage Matrix

Each cell is PASS, ISSUE, NOT TESTED or N/A. ISSUE means at least one counted finding applies; IDs are in §3. Shared explainer findings (QA-038, QA-045, QA-053) apply to all 10 games that have an explainer.

| Game / Page | Language | Gameplay | Video | UI | Visual | Overall |
|---|---|---|---|---|---|---|
| Portal `index.html` | ISSUE | PASS (links, search, keyboard OK; theme not persisted QA-029) | N/A | PASS | ISSUE | PASS WITH ISSUES |
| Adverbier `adverbs.html` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | **NOT READY** |
| Magiske Verber `magiske_verber.html` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | PASS WITH ISSUES |
| Idiomjæger `idiomjaeger.html` | ISSUE | ISSUE | N/A (no explainer, vocabulary game) | ISSUE | ISSUE | PASS WITH ISSUES |
| Præpositioner `dansk-praepositioner.html` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | PASS WITH ISSUES |
| Antonymer `danish-antonyms-game.html` | ISSUE | ISSUE | N/A | ISSUE | ISSUE | PASS WITH ISSUES |
| Bøjningsværkstedet `boejningsvaerkstedet/` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | PASS WITH ISSUES |
| Glosekort `danish_flashcards/danish_flashcards_game/` | ISSUE | ISSUE | N/A | ISSUE | ISSUE | PASS WITH ISSUES |
| Dansk Mester `danske-phraser/dansk-mester.html` | ISSUE | ISSUE | N/A | ISSUE | ISSUE | PASS WITH ISSUES |
| En og et `en og et/` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | PASS WITH ISSUES |
| Forbindeord `forbindenor/Forbindenor.html` | ISSUE (Critical) | ISSUE | ISSUE | ISSUE | ISSUE | **NOT READY** |
| Konjunktioner `konjunktioner/konjunktioner.html` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | PASS WITH ISSUES |
| Ordstillingsdetektiven `ordstilling-detektiv/` | ISSUE | ISSUE | ISSUE | ISSUE | ISSUE | PASS WITH ISSUES |
| Pronomenmysteriet `pronomenmysteriet/` | ISSUE (Critical) | ISSUE (Critical) | ISSUE | ISSUE (Critical) | ISSUE | **NOT READY** |
| Tidsmaskinen `tidsmaskinen/` | ISSUE (Critical) | ISSUE (Minor only: QA-025) | ISSUE | ISSUE | ISSUE | **NOT READY** |
| Sætningsmaskinen `saetningsmaskinen/` | ISSUE (latent data only) | NOT TESTED (no page) | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| `pixel-animation.html` | ISSUE (English title) | PASS (demo works) + QA-030 | N/A | ISSUE | ISSUE | PASS WITH ISSUES |

**Coverage by dimension:**
- Every game was covered in every dimension that applies. The one exception is Sætningsmaskinen, whose page doesn't exist.
- No dimension was skipped.
- None of the workers covered real devices, iOS Safari, landscape, 200% zoom, screen readers or audible TTS (see U-05).

---

## 3. Game-by-Game Status

| Game | Status | Main issues | Readiness |
|---|---|---|---|
| Portal | PASS WITH ISSUES | Links to the broken Pronomenmysteriet (QA-001). Theme isn't persisted (QA-029). Text and level-label errors (QA-128). SEO panel radius and theme-button frame (QA-066) | Ready after minor fixes. Hide or fix the Pronomenmysteriet card first. `index.html` is frozen, so owner approval is needed |
| Adverbier | **NOT READY** | Blank page when storage is blocked (QA-004). Review broken (QA-005). No TTS (QA-006). Mode stuck (QA-007). Answer leak (QA-008). 10-item sample with conjunctions (QA-096). Unanswerable "derfor" (QA-097). Ambiguous items (QA-098). Wrong-answer feedback has no note (QA-099). Feedback contract (QA-031) | Needs a rebuild of gameplay and content |
| Magiske Verber | PASS WITH ISSUES | Wrong auxiliaries (QA-091). About 42+ tense items with two correct answers (QA-092). Praise text and no auto-advance (QA-031). Focus (QA-020). er-perfect missing from the explainer (QA-051) | Ready after Major content fixes |
| Idiomjæger | PASS WITH ISSUES | Modersmålstaleren crashes at A2/B1 (QA-009). Reversed idiom meaning (QA-100). Calque idiom (QA-101). Synonymous idioms offered as distractors (QA-102). English is the main medium (QA-032). Colour emoji (QA-059) | Ready after the crash and content fixes |
| Præpositioner | PASS WITH ISSUES | Forvekslingspar can't be answered with a level filter (QA-010). Feedback below the fold at 1366×768 (QA-037). Correct Danish shown as an error (QA-104). Valid distractors (QA-105). Unidiomatic keys (QA-106). Lynrunde freezes when storage is blocked (QA-004) | Ready after Major fixes |
| Antonymer | PASS WITH ISSUES | No mode starts when storage is blocked (QA-004). FORTSÆT below the fold on every answer (QA-035). Second antonym offered as wrong (QA-108). Example grammar errors (QA-109). Non-antonym pairs (QA-110) | Ready after Major fixes |
| Bøjningsværkstedet | PASS WITH ISSUES | Modes 5–6: the correct answer is always option 1 (QA-011). Nine Major content items (QA-080…088), including hans/hendes where *sin* is required. Missing explainers for modes 4 and 6 (QA-048). No reset (QA-025) | Ready after the shuffle fix and content fixes |
| Glosekort | PASS WITH ISSUES | "Start forfra" wipes progress without confirmation (QA-012). *mødes* → *mødt* (QA-094). Can get stuck after a filter change (QA-021). Filter hidden on mobile (QA-044) | Ready after Major fixes |
| Dansk Mester | PASS WITH ISSUES | "mangler = savner" (QA-112). "enig i, ikke med" (QA-113). Duplicate glosses (QA-114). 360 px overflow (QA-039). English "CORRECT/WRONG" (QA-033) | Ready after content fixes |
| En og et | PASS WITH ISSUES | Weak words never clear (QA-013). *øl* note (QA-126). Vector icons (QA-058). MENU bar inset (QA-042). Praise text (QA-031) | Ready after Major fixes |
| Forbindeord | **NOT READY** | Synonym distractors marked wrong (QA-002, Critical). *ovenikøbet* (QA-116). *sin* inside a subject (QA-117). Weak list never empties (QA-013) | Needs distractor logic redone and native sign-off |
| Konjunktioner | PASS WITH ISSUES | About 35 items with a second correct option (QA-119). "Det føles, at…" (QA-120). MENU bar inset (QA-042) | Ready after content fixes |
| Ordstillingsdetektiven | PASS WITH ISSUES | Puzzle and NEXT below the fold on every statement (QA-036). Tip says the verb goes "til sidst" (QA-122). Only one exact order accepted (QA-123). English Next/Finish (QA-033) | Ready after Major fixes |
| Pronomenmysteriet | **NOT READY** | All data is placeholder, and modes 4–5 are empty (QA-001). Missing explainers (QA-047). "Skal tjekkes" badge visible to learners (QA-054). SPIL below the fold (QA-041) | Restore the data from `b9abb96`; then it is close to ready |
| Tidsmaskinen | **NOT READY** | Adverb after participle in the model answers (QA-003, Critical). "stå op" missing "op" (QA-075). siden contexts (QA-076). Imperative note (QA-077). 6 of 9 modes have no explainer (QA-046) | Ready once QA-003 and the Major notes are fixed. Gameplay is solid |
| Sætningsmaskinen | NOT TESTED | No page exists. Data is about 90% cloned filler with wrong keys (QA-125, latent) | Not in scope for release. Fix the data before the page is built |
| pixel-animation | PASS WITH ISSUES | Orphan demo: no bar, no way back, not reskinned, English title (QA-030) | Remove it from the deploy set or reskin it |

---

## 4. Missing / Broken Explanatory Content

| ID | Game | Sev | Problem | Source |
|---|---|---|---|---|
| QA-046 | Tidsmaskinen | Major | 6 of 9 modes have no explainer: pluskvamperfektum, future, hvis, at+infinitiv, passive, imperative. The tabs aren't tied to the selected mode | VID-001 |
| QA-047 | Pronomenmysteriet | Major | 4 of 6 modes have no explainer: subject/object, den/det/de, nogen/nogle/noget, demonstratives | VID-002 |
| QA-048 | Bøjningsværkstedet | Major | No explainer for mode 4 (gradbøjning) or mode 6 (mængdeord) | VID-003 |
| QA-099 | Adverbier | Major | Wrong-answer feedback has no grammar note. It prints "Det rigtige svar er <word> – <English>" even for category or sentence answers | LANG-036, GAME-008 |
| QA-049 | Ordstillingsdetektiven | Minor | Existing scenes (`adverbier-placering`, `modalverber`, `foernutid-har`, `konjunktioner`) aren't wired, although cases 5, 7, 8 and 9–10 match them | VID-004 |
| QA-050 | Præpositioner | Minor | No scene for "til", although the title promises "i, på, til og af" | VID-005 |
| QA-051 | Magiske Verber | Minor | The perfect explainer leaves out the *er* auxiliary that the mode drills, so learners risk "har kommet" | VID-006 |
| QA-052 | Konjunktioner, Adverbier | Minor | Explainers teach word order, but the games test meaning | VID-007 |
| QA-054 | Pronomenmysteriet | Minor | The sin-hans scene shows the internal "Skal tjekkes" badge to learners and truncates the title on mobile. Native review is pending (see U-03) | VID-009 |
| QA-055 | All explainer games | Minor | A failed scene load fails silently (latent) | VID-012 |
| QA-057 | Explainer scenes | Minor | Wording: "Hvert ord: barn → børn"; run-on clauses without punctuation; "I går" only half highlighted | VID-014, LANG-068 |
| QA-018 | Antonymer | Minor | A wrong match in "Find par" shows no correct partner, note or TTS | GAME-016 |
| QA-023 | Dansk Mester | Minor | English→Danish items have no TTS. A wrong match shows no correct answer | GAME-027 |

**Misleading grammar notes** are listed in §5. They count as broken explanations too: QA-077, QA-084, QA-088, QA-112, QA-113, QA-122, QA-100.

**Not counted:**
- VID-010: explainers are silent by design (`SKILL.md`).
- No game has a dedicated "how to play" screen. `prd.md` doesn't require one.

---

## 5. Danish Language & Pedagogy Issues

**Native-speaker sign-off is required** before any content correction ships. The LANG reviewer is not a native speaker. `specs.md` and `prd.md` are owner-edited.

### Critical

| ID | Game | Problem | Evidence (verified) |
|---|---|---|---|
| QA-001 | Pronomenmysteriet | All 760 items are placeholders ("Test sentence N.", `opt1`/`opt2`, "Test note."). The mode keys `anaphoric_agreement`/`indefinite_pronouns` don't match the game's `den_det_de`/`nogen_nogle_noget`. Levels are A1/A2/B1 while the chips are A2–B2 | See Critical log C-1 |
| QA-002 | Forbindeord | Distractors come from the answer's own category, so synonyms are marked wrong | C-2 |
| QA-003 | Tidsmaskinen | Two-word answers put the sentence adverb after the participle ("Han havde fået allerede visum") | C-3 |

### Major (by game)

| ID | Game | Problem | Worker IDs |
|---|---|---|---|
| QA-075 | Tidsmaskinen | "I morges ___ jeg tidligt" (key "stod") is missing the particle *op* (data.js:559, :1205) | LANG-003 |
| QA-076 | Tidsmaskinen | Contexts break the game's own rule: "siden" + preterite, perfect + "for … siden" (data.js:6846, 6893, 6986, 7009, 20905) | LANG-004 |
| QA-077 | Tidsmaskinen | The imperative note calls vær/gør/bliv/sig/giv/kom/tag "uregelmæssige" (data.js:23104 + 11 items) | LANG-006 |
| QA-078 | Tidsmaskinen | "Vi ___ det for længst" with key "havde vidst": the distractor "vidste" is equally natural (data.js:6592) | LANG-008 |
| QA-080 | Bøjningsværkstedet M5 | hans/hendes cykel/taske/hund/bog where *sin* is required (data.js:409, 410, 419, 420). Verified | LANG-014 |
| QA-081 | Bøjningsværkstedet M6 | "Har du set ___ til Peter?" has key `nogen`; it should be `noget` (data.js:777). Verified | LANG-015 |
| QA-082 | Bøjningsværkstedet M4 | *rig* runs through the -ig builder and gives rigst/rigste (adjectives.js:247). Verified | LANG-016 |
| QA-083 | Bøjningsværkstedet M4 | Periphrastic definite superlative: "den mest typisk" is accepted, "den mest typiske" is rejected (39 items; data.js:244) | LANG-018 |
| QA-084 | Bøjningsværkstedet M4 | Note says "Glad gradbøjes uregelmæssigt" (also let, flot) | LANG-019 |
| QA-085 | Bøjningsværkstedet M4 | Comparison drilled on non-gradable -ig adjectives (umuligere, kongeligere, offentligere…). The exact list is partly UNCONFIRMED | LANG-020 |
| QA-086 | Bøjningsværkstedet M6 | Two correct answers: intet/ingen with identical plurals; begge/alle with no "two" cue; hverken/enten | LANG-022 |
| QA-087 | Bøjningsværkstedet M5 | About 25 definiteness items where the distractor is also natural ("Han ligger stadig i ___" sengen) | LANG-023 |
| QA-088 | Bøjningsværkstedet M1 | The generic note "føje en bestemt endelse til stammen" is false for about 67 nouns (doubling, schwa loss, museum) | LANG-024 |
| QA-091 | Magiske Verber | "Vi er [v] til Spanien flere gange" (should be *har*); "Filmen har [v] uden mig" (should be *er begyndt*) (magiske_verber.html:531, 558). Verified | LANG-029 |
| QA-092 | Magiske Verber | 14 past templates and 44 of 78 present templates have no time anchor, so the other tense is also correct. The explanation "Tidsudtrykket peger på fortiden" is false for these | LANG-030 |
| QA-094 | Glosekort | *mødes* has the participle "mødt"; it should be "mødtes" (script.js:101). Verified | LANG-032 |
| QA-096 | Adverbier | Ships a 10-item "Built-in sample". fordi/når/da/men are conjunctions. Levels are inflated. The header promises "~500 sentences" | LANG-017, GAME-006 |
| QA-097 | Adverbier | Ordklasse-jagten: `derfor` "Cause/Effect" has no button, so it can never be answered; alligevel is tagged Manner; stadig is tagged Frequency. *Downgraded from Critical* | LANG-034 |
| QA-098 | Adverbier | Gap-fill and listening items have several correct answers (fordi/da, når/da, stadig/endnu) | LANG-035 |
| QA-100 | Idiomjæger | "Gå op i en højere enhed" is glossed "fall apart". It means "merge into a harmonious whole" (idiomjaeger.html:531). *Downgraded from Critical*; single entry | LANG-037 |
| QA-101 | Idiomjæger | "Have rejst sig på den forkerte side" is a calque, and its example uses the ungrammatical "er … rejst mig" (:491) | LANG-038 |
| QA-102 | Idiomjæger | Duplicate or synonymous idioms (ramme/slå hovedet på sømmet…) can appear as the "wrong" option (pickers :594-603) | LANG-039 |
| QA-104 | Præpositioner | "Find fejlen" / "Ret sætningen" present correct Danish as the error: kaffe uden mælk, te med mælk, temperaturen er over frysepunktet (about 20 items; :404, 478, 484, 486, 494). *Downgraded from Critical* | LANG-041 |
| QA-105 | Præpositioner | The CONFUSE map offers valid prepositions as wrong (i/ved kantinen, på/i reolen…; about 24 templates) | LANG-042 |
| QA-106 | Præpositioner | "nå til toget"; "holder ved indkørslen"; conflicting til/fra templates; translation needs an exact match | LANG-043 |
| QA-108 | Antonymer | 66 headwords have several antonyms, so a valid one can be offered as wrong. Typed mode accepts only one. Duplicate pairs (:1101-1103, :1194) | LANG-045, GAME-015 |
| QA-109 | Antonymer | Example sentences with grammar errors ("Systemet er kompleks", "den hele kage"…) | LANG-046 |
| QA-110 | Antonymer | Non-antonym pairs (rød/blå…), non-words ("ulovende"), the false friend *sympatisk* | LANG-047 |
| QA-112 | Dansk Mester | "»Mangler« betyder »savner«" (dansk-mester.html:512). Verified | LANG-049 |
| QA-113 | Dansk Mester | "enig i, ikke med"; "begynde på, ikke med"; "Hyggelig i datid" | LANG-050 |
| QA-114 | Dansk Mester | Duplicate English glosses make multiple choice ambiguous (passe på / tage sig af…) | LANG-051 |
| QA-116 | Forbindeord | Answer is spelled "ovenikøbet" and is spoken that way; RO spells it *oven i købet* (:372-375). Verified | LANG-054 |
| QA-117 | Forbindeord, Konjunktioner | "ligesom sin mor gjorde": *sin* inside the subject of a subordinate clause (Forbindenor :453; konjunktioner :610) | LANG-055 |
| QA-119 | Konjunktioner | About 35 items where a "wrong" option is also correct | LANG-057 |
| QA-120 | Konjunktioner | "Det føles, at…" should be "Det føles, som om…" (:424) | LANG-058 |
| QA-122 | Ordstillingsdetektiven | Tips say the infinitive or participle stands "til sidst" (:566, 567, 601, 701, 734). Verified | LANG-060 |
| QA-123 | Ordstillingsdetektiven | Only one exact order is accepted (`built.join(" ")===cur.correct.join(" ")`, :1040/1052). Valid topicalised orders are rejected. Confirms GAME's UNCONFIRMED note | LANG-061, GAME-UNCONF-B |
| QA-126 | En/Et | `øl` note says "Bestemt form: ølen"; the data field says øllen (:579). Verified | LANG-069 |
| QA-032 | Idiomjæger, Adverbier, Glosekort | English carries the core learning content (meanings, explanations, gloss on the card front) against the PRD rule "English only to resolve semantic ambiguity" | LANG-072 |

### Minor (grouped)

| ID | Game | Summary | Worker IDs |
|---|---|---|---|
| QA-079 | Tidsmaskinen | Ungrammatical template distractors; gender/countability errors; calques; context mismatches | LANG-009, 010, 011, 012 |
| QA-089 | Bøjningsværkstedet + shared nouns/adjectives | Missing variants (dårligere); `verify:true` nouns served (frygt, sol; høne UNCONFIRMED); blå/grå note; implausible pairs; typo "æg →ægget" | LANG-021, 025, 026 |
| QA-090 | Shared data (latent: no game loads it) | verbs.js forberedede/gentagede (LANG-027, *downgraded from Major*, latent); verbs.js minor (LANG-028); pronouns.js `intet` note (LANG-065, *downgraded from Major*: `DANSK_PRONOUNS` is not loaded by any game, grep-verified); pronouns and clause-patterns wording (LANG-066) | LANG-027, 028, 065, 066 |
| QA-093 | Magiske Verber | "flytter sætningen til I GÅR"; "Til timen"; "Verbalarenaen"; "Nem" labelled A1 | LANG-031 |
| QA-095 | Glosekort | Wrong notes and examples: "prøve på bruges om tøj", "spørge efter = efterlyse", "Toget rejser", "ud af vinduet"… | LANG-033 |
| QA-103 | Idiomjæger | "ud af vinduet", "talte for døve øren", "lægge ordene i munden"… (several UNCONFIRMED) | LANG-040 |
| QA-107 | Præpositioner | Colloquial variants (UNCONFIRMED); "I tjeneste af"; "Indvendigt i"; "bolig-udtryk"; "for meget" isn't a preposition | LANG-044 |
| QA-111 | Antonymer | Unnatural examples; duplicate pairs; level inflation | LANG-048 |
| QA-115 | Dansk Mester | "dobbelt benægtelse"; Velbekomme usage; "tre småord"; af sted/afsted; levels | LANG-052 |
| QA-118 | Forbindeord | Note about inversion attached to "så" items with no inversion; category placement; "For det andet" without "for det første"; level clash | LANG-056 |
| QA-121 | Konjunktioner | "SVA" rule vs an inverted item; commas before *end*; "siden nytår" | LANG-059 |
| QA-124 | Ordstillingsdetektiven | "hele sætningen forreste plads"; "Næste uge"; "email" | LANG-062 |
| QA-125 | Sætningsmaskinen (latent, no page) | About 920 of 1,020 items are clones; wrong keys (hvorfor jeg ringede ikke; "En bog, hvilket…"). *Downgraded from Major*: not user-facing until a page exists. Becomes a blocker for `saetning-game-*` | LANG-063, 064 |
| QA-127 | En/Et | "en mælk / et sukker" taught; `and` note; wrong synonym pairs; stray spaces | LANG-070 |
| QA-128 | Portal | "online spil … dansk undervisning … A1–B2 niveau"; level labels don't match the games | LANG-071 |
| QA-074 | Docs | CLAUDE.md "lærer → lærerene" note is stale: the data now gives lærerne | LANG-013 (+ VIS-027) |

---

## 6. Gameplay Issues

| ID | Game | Sev | Problem | Worker IDs |
|---|---|---|---|---|
| QA-004 | Adverbier, Antonymer, Præpositioner | Major | Unguarded `localStorage`. Adverbier is blank (`loadProgress` :592, called at :1095). In Antonymer no mode starts (`save()` :853). Præpositioner's Lynrunde and Statistik freeze (:1236-1237, :1302, :1348). Verified at runtime | GAME-001, GAME-014, GAME-012 |
| QA-005 | Adverbier | Major | Review: the modal stays over the question; "Luk" empties `#game`; the end branch can't be reached (:1006-1011); correct answers don't count down | GAME-002 |
| QA-006 | Adverbier | Major | No TTS anywhere. "Lyt og vælg" shows the text for 3 s instead of playing audio (:905-911) | GAME-003, VIS-009 (part) |
| QA-007 | Adverbier | Major | Mode never rotates and the zone is ignored after question 1 (:1020). The boss round can't be reached (:927) | GAME-004 |
| QA-008 | Adverbier | Major | Bindeordsduellen leaves the answer word in the prompt (:875-885) | GAME-005, LANG-035 (part) |
| QA-009 | Idiomjæger | Major | Modersmålstaleren at level A2/B1 has an empty pool and throws "reading 'id'" (:1056, :825). Verified at runtime | GAME-009 |
| QA-010 | Præpositioner | Major | Forvekslingspar with a level filter falls back to all ITEMS, so 7–10 of 10 questions can't be answered (:711-719, :1161-1163). Verified in source | GAME-011 |
| QA-011 | Bøjningsværkstedet | Major | Modes 5 and 6 render options in data order. The correct answer is first in 250/250 and 221/221 items (index.html:1152-1159). Verified at runtime | GAME-019 |
| QA-012 | Glosekort | Major | "Start forfra" resets all progress with no confirmation (script.js:609-623). It sits 28 px below the answer buttons on mobile. Verified | GAME-023, UI-005 |
| QA-013 | En/Et, Forbindeord | Major | Weak words can never be cleared: weakness is based on lifetime correct < attempts (en og et :915-926, :1344-1347; Forbindenor :838-842). Verified in source | GAME-028, GAME-033 |
| QA-014 | Adverbier | Minor | Typing "r" in the CSV textarea opens the review modal (:1211) | GAME-007 |
| QA-015 | Adverbier | Minor | Ordstilling mode has no undo for a tapped tile | GAME-008 (part) |
| QA-016 | Idiomjæger | Minor | "Tak for kaffe!" isn't blanked: the regex fails on "!" (:1049) | GAME-010, LANG-040 (part) |
| QA-017 | Præpositioner | Minor | Lynrunde gives 15 XP per hit, not 10 (:1223) | GAME-013 |
| QA-018 | Antonymer | Minor | A wrong match in Find par only flashes, and the miss is recorded against the wrong pair (:1240) | GAME-016 |
| QA-019 | Antonymer, Bøjningsværkstedet, Dansk Mester | Minor | Pending timers aren't cancelled. A question is drawn into a hidden screen; Escape during auto-advance answers an invisible item and writes progress; Dansk Mester throws a console error on "‹ Afslut" (:952/:1020) | GAME-018, GAME-020, GAME-026 |
| QA-020 | Several | Minor | Focus is lost after an answer or screen change: Antonymer, Magiske Verber, Bøjningsværkstedet and Pronomenmysteriet summaries, Forbindeord, Ordstillingsdetektiven. Adverbier modals don't take focus | GAME-017, 021, 022, 034 (part), 036 (part), UI-015 |
| QA-021 | Glosekort | Minor | Stuck on an answered card after a filter change. List items are mouse-only `<li>` (script.js:478, :553) | GAME-024 |
| QA-022 | Glosekort | Minor | A double-click in review skips a card (:570) | GAME-025 |
| QA-023 | Dansk Mester | Minor | EN→DA items have no TTS. A wrong match shows no answer | GAME-027 (part) |
| QA-024 | En/Et | Minor | Number keys don't select options in the word-pair multiple-choice style | GAME-029 (part) |
| QA-025 | Bøjningsværkstedet, Pronomenmysteriet, Tidsmaskinen, En/Et, Forbindeord | Minor | No progress reset at all. The PRD requires a reset with confirmation | GAME-032, 029 (part), 034 (part) |
| QA-026 | Forbindeord | Minor | Reloading mid-run restarts at 1/359 | GAME-034 (part) |
| QA-027 | Konjunktioner | Minor | Enter doesn't work in review after game over (:980) | GAME-035 |
| QA-028 | Bøjningsværkstedet, Pronomenmysteriet | Minor | A missed item doesn't come back first, because unseen items outnumber it (Bøjningsværkstedet :595) | GAME-038 |
| QA-029 | Portal + all | Minor | Portal theme isn't persisted (:305-307). Theme, mute and explainer controls differ per game. Mute is present where sound effects exist (see resolution R-1) | GAME-030, VIS-011 (*downgraded*), UI-017 (resolved) |
| QA-030 | pixel-animation | Minor | Orphan demo: no bar, nothing focusable, not reskinned, English title | GAME-039, UI-016, VIS-026, LANG-072 (part) |

Not counted: Ordstillingsdetektiven `G.lives` can go below 0 only when a script clicks a hidden button. The UI agent filed it as a test artefact. A cheap clamp is noted under US-023.

---

## 7. Desktop UI Issues

| ID | Game | Sev | Problem | Worker IDs |
|---|---|---|---|---|
| QA-037 | Præpositioner | Major | At 1366×768 the `#fb` verdict, correct answer and TIP render under NÆSTE, completely off-screen. Verified at runtime: fb top 773 vs innerHeight 768, scrollY 0. Minor at m390/m430 | UI-004 |
| QA-035 | Antonymer | Major (desktop and mobile) | "Fortsæt →" is below the fold after every answer. There is no auto-advance, scroll or focus. Verified at runtime: nextBtn top 1200 vs 768 | UI-002 |
| QA-036 | Ordstillingsdetektiven | Major (desktop and mobile) | Case story pushes the tiles and UNDERSØG below the fold on every statement; NEXT is below the fold after checking (:326-336) | UI-003 |
| QA-038 | 10 explainer games | Minor | At 1366×768 the explainer controls are hidden below an internally scrolling panel (`modal.css:15, :31`) | UI-006 |
| QA-041 | Bøjningsværkstedet, Pronomenmysteriet | Minor | SPIL is below the fold on the start screen (desktop and mobile) | UI-009 |

## 8. Mobile UI Issues

Overall, every measured state passes:
- no horizontal scroll (except QA-039)
- all tap targets are at least 44×44
- focus rings are visible
- reduced motion is respected

| ID | Game | Sev | Problem | Worker IDs |
|---|---|---|---|---|
| QA-035 / QA-036 | Antonymer, Ordstillingsdetektiven | Major | See §7. Worst on mobile (FORTSÆT at y=1168 of 844) | UI-002, UI-003 |
| QA-039 | Dansk Mester | Minor | At 360 px "INTERVALREPETITION" overflows by 1 px (h-scroll; `themes/dansk-mester.css:137`). Badge labels overflow their tiles | UI-007, VIS-024 |
| QA-040 | Præpositioner, Ordstillingsdetektiven, Antonymer, Magiske Verber | Minor | Headings break mid-word with no hyphen ("PRÆPOSITIONSME\|STER") | UI-008 |
| QA-043 | Idiomjæger, Antonymer, Pronomenmysteriet, Tidsmaskinen | Minor | Confetti covers the results text | UI-012 |
| QA-044 | Glosekort | Minor | Level filter and verb list are stacked below the card on mobile | UI-013 |
| QA-045 | 10 explainer games | Minor | At ≤420 px the FORKLARING label is hidden, leaving a bare ▶ that reads as "play" (`modal.css:11`) | UI-014, VID-011 |
| QA-056 | Explainer | Minor | The rule card sits off-centre on the monitor screen (2 px right margin) | VID-013 |

---

## 9. Pixel-Art / Icon Consistency Issues

| ID | Game | Sev | Problem | Worker IDs |
|---|---|---|---|---|
| QA-058 | En/Et | Major | 8 mode icons and the emblems are pre-reskin vector line art: rounded `rx` rects, a 2px gold stroke, and Cinzel `<text>` that falls back to serif (`en og et/index.html:304-346, 366-374`). Verified in source: 6 `rx=` and 12 Cinzel references. The smoke run also flagged 1.09 dark contrast on these mode glyphs (not counted separately) | VIS-001 |
| QA-059 | Idiomjæger, Dansk Mester | Major | Colour OS emoji used as icons. Idiomjæger: badges 🥇🗺🧭…, 🔥, 🪙, 💪 💰 🔁, 🏆, and 🇩🇰 renders as "DK" (`idiomjaeger.html:666-676, 688, 854, 868-875`). Dansk Mester: 🔥 stats, 🎓 | VIS-002, VIS-003 |
| QA-060 | Shared sprites | Minor (*downgraded from Major*) | 16px flat and 32px shaded sprites are mixed at 4px vs 2px pixel density (`sjovt.js:27-126` vs `:128-601`, `:619`). Cosmetic: no usability impact | VIS-004 |
| QA-061 | Several | Minor | Generic sprites (hat, molle, snegl, pokal, flag) carry different meanings per game | VIS-005 |
| QA-062 | Tidsmaskinen, Bøjningsværkstedet, Dansk Mester | Minor | Identity sprite doesn't match the portal card: Tidsmaskinen `ur` (Adverbier's icon) vs `tidsstjerne`; Bøjningsværkstedet header `molle` vs `tandhjul` with a duplicated title; Dansk Mester header `flag` vs card `snak` | VIS-006, VIS-021, VIS matrix |
| QA-063 | Shared chrome | Minor | ← ▶ ▼ ⟵ ⟶ fall back to system fonts (the SD Mono unicode-range lacks them; `sjovt.css:16-27`) | VIS-008 |
| QA-064 | Explainer | Minor | Modal uses literal portal colours and a navy dark palette, 3px frames, ease timing, mixed case. Monitor art pixels are about 13–15 CSS px | VIS-012, VIS-014 |
| QA-066 | Portal | Minor | SEO panel has a 12px radius (`index.html:221`). Theme button has no visible frame (`:67-68`) | VIS-015, VIS-016 |
| QA-073 | Idiomjæger | Minor | Inline 48px TTS buttons inside running text break the line rhythm (:857) | VIS-025 |

## 10. Cross-Game Consistency Issues

| ID | Games | Sev | Problem | Worker IDs |
|---|---|---|---|---|
| QA-031 | 11 legacy games | Major | PRD feedback contract not met: correct answers show praise text ("Godt klaret!", "Storartet!", "✓ RIGTIGT!", "Stort fund! 🪙 +10") and need a manual Næste. Wrong answers show encouragement ("Prøv igen!", "✗ PRØV IGEN!" seen in Præpositioner at runtime, "Du klarer den næste!"). There are no sound effects (see R-1). Advance timing ranges from 750 to 2,000 ms. Bøjningsværkstedet shows "Rigtigt!" | GAME-031 (*raised from Minor*), VIS-010, LANG-073, GAME-008 (part), UI-002 (part) |
| QA-034 | All 14 games | Major | TTS button has four visual languages: ♪ in 6 games, ▶ in 6, a pixel speaker in Antonymer, none in Adverbier. ▶ also means "explainer" and "current card". Accessible names vary, including English "Pronounce" | VIS-009 |
| QA-033 | Dansk Mester, Ordstillingsdetektiven, Præpositioner, Antonymer, Glosekort, Forbindeord | Minor | English UI strings: "✓ CORRECT / ✗ WRONG" (`themes/dansk-mester.css:181-182`), "Next ▸ / Finish ▸" (`ordstilling-detektiv/index.html:1086`), "Multiple choice" (`dansk-praepositioner.html:946`), "Check" and aria "Pronounce" (antonyms :1189, :918; flashcards `script.js:264`), "Continue ▸" (`dansk-mester.html:1131`), "+1 ENERGY" and English category labels (`Forbindenor.html:760, 636-641`) | UI-011, LANG-033/044/048/052/056/061 (parts), GAME-027/034/036 (parts), VIS-009 (part) |
| QA-025 | 5 games | Minor | Progress reset missing (see §6) | GAME-032 et al. |
| QA-020 | 6+ games | Minor | Focus management (see §6) | several |
| QA-042 | Konjunktioner, En/Et | Minor | `← MENU` bar inset by body padding (konjunktioner.html:71 / `themes/konjunktioner.css:155`; `en og et/index.html:75` / `themes/en-og-et.css:204`). Verified in source | UI-010, VIS-007 |
| QA-065 | Several | Minor | Back/exit control: 4 glyphs (← ⟵ ‹ ✕), 7 wordings | VIS-013 |
| QA-067 | Several | Minor | 5 different results-screen patterns; replay labels differ | VIS-017 |
| QA-068 | Several | Minor | Gap placeholder differs (`_____`, `?`, `·`) | VIS-018 |
| QA-069 | Ordstillingsdetektiven, Konjunktioner | Minor | ok/bad colours reused for levels and categories | VIS-019 |
| QA-070 | Magiske Verber, Præpositioner, Dansk Mester, Glosekort | Minor | Light surfaces kept in dark mode while other games go dark | VIS-020 |
| QA-071 | Shared | Minor | Grid background stops short; bar is 56px but `--sd-bar-h` is 48px | VIS-022 |
| QA-072 | Idiomjæger, Præpositioner, Konjunktioner, Dansk Mester | Minor | Native `<select>` keeps the OS chevron | VIS-023 |
| QA-053 | En/Et (runtime), Præpositioner, Magiske Verber, Tidsmaskinen (code) | Minor | Countdown timers keep running while the explainer is open | VID-008 |
| QA-074 | Docs | Minor | `docs/redesign/AGENT-BRIEF.md`, `TEST-REPORT.md` and the `modal.css` fallbacks name Pixelify Sans, which isn't shipped. CLAUDE.md has a stale note | VIS-027, LANG-013 |

**Resolution R-1 (UI-017 vs VIS-010):**
- `AudioContext` and sound effects exist only in `shared/dansk-core.js` (`ui.sound`, oscillator at :565). Only Bøjningsværkstedet, Pronomenmysteriet and Tidsmaskinen use them, and all three have a visible LYD mute.
- The Antonymer "Lyd og udtale" switch (`setSound`) only gates TTS (`speak()` :899-900).
- The other 11 games emit no sound effects (grep: 0 `AudioContext`/`new Audio(`).
- **Conclusion:** UI-017's "no mute in 10 games" is **rejected as a standalone defect**. There is nothing to mute apart from user-triggered TTS. The real gap is that those 11 games play **no correct-answer sound** as the PRD requires, which is folded into QA-031. Control placement is folded into QA-029.
- Residual: U-06, whether any legacy game auto-plays TTS without a user gesture.

---

## 11. Prioritized Fix Queue

Order follows the brief: broken gameplay, then incorrect educational content, missing or broken explanations, mobile/UI failures, cross-game inconsistencies, visual inconsistencies, and minor polish. Within each band, Critical comes before Major. Story mapping is in `stories/QA-USER-STORIES.md`.

| # | Game/Page | Category | Severity | Problem | Evidence | Required fix | Story |
|---|---|---|---|---|---|---|---|
| 1 | Pronomenmysteriet | Broken gameplay / content | Critical | Placeholder data; modes 4–5 empty | `data.js` 760× "Test sentence"; `git show 2d606e5`; C-1 | Restore `data.js` from `b9abb96`; add a placeholder/mode-key guard to the tests | US-001 |
| 2 | Adverbier, Antonymer, Præpositioner | Broken gameplay | Major | Unguarded `localStorage` crashes or blanks | runtime `SecurityError`; adverbs :592, antonyms :853, præp :1236/:1302/:1348 | try/catch storage helpers | US-004 |
| 3 | Adverbier | Broken gameplay | Major | Review flow, mode rotation, answer leak | GAME-002/004/005 | Repair the loop | US-005 |
| 4 | Adverbier | Broken gameplay | Major | No TTS | 0 `speechSynthesis` | Add DanskCore TTS | US-006 |
| 5 | Idiomjæger | Broken gameplay | Major | Modersmålstaleren crash at A2/B1 | runtime "reading 'id'" | Empty-pool fallback | US-008 |
| 6 | Præpositioner | Broken gameplay | Major | Forvekslingspar can't be answered with a level filter | :711-719 | Fall back to the pair pool | US-009 |
| 7 | Bøjningsværkstedet | Broken gameplay | Major | Correct answer always option 1 in M5/M6 | 250/250, 221/221 | Shuffle the options | US-010 |
| 8 | Glosekort | Broken gameplay | Major | Restart wipes progress with no confirm | script.js:609-623 | confirm() and spacing | US-011 |
| 9 | En/Et, Forbindeord | Broken gameplay | Major | Weak lists never clear | en og et :915-926 | Streak or last-result rule | US-012 |
| 10 | Forbindeord | Incorrect content | Critical | Synonym distractors marked wrong | :707-716; C-2 | Cross-category or synonym-excluded distractors | US-002 |
| 11 | Tidsmaskinen | Incorrect content | Critical | Adverb after participle in model answers | data.js lines listed; C-3 | Rewrite about 23 items | US-003 |
| 12 | Bøjningsværkstedet + shared adj/nouns | Incorrect content | Major | 9 content defects (sin, noget, rig, superlatives, notes, ambiguity) | QA-080…088 | Data and builder corrections | US-015 |
| 13 | Præpositioner | Incorrect content | Major | Correct Danish shown as an error; valid distractors; unidiomatic keys | QA-104…106 | Fix `err`, the CONFUSE map and keys | US-019 |
| 14 | Tidsmaskinen | Incorrect content | Major | stå op, siden, imperative note, vide | QA-075…078 | Data and notes | US-014 |
| 15 | Adverbier | Incorrect content | Major | 10-item sample, wrong categories, ambiguous items | QA-096…098 | Author a dataset; fix keys | US-007 |
| 16 | Forbindeord, Konjunktioner | Incorrect content | Major | ovenikøbet, sin in subject, about 35 Konjunktioner ambiguities, "Det føles, at" | QA-116/117/119/120 | Data fixes | US-022 |
| 17 | Antonymer | Incorrect content | Major | Multiple antonyms, example grammar, non-antonyms | QA-108…110 | Data and distractor exclusion | US-020 |
| 18 | Magiske Verber | Incorrect content | Major | Auxiliaries; tense ambiguity | QA-091/092 | Templates and time anchors | US-016 |
| 19 | Idiomjæger | Incorrect content | Major | Reversed idiom; calque; synonym distractors | QA-100…102 | Data and picker exclusion | US-018 |
| 20 | Dansk Mester | Incorrect content | Major | mangler/savner, enig i, glosses | QA-112…114 | Notes and glosses | US-021 |
| 21 | Ordstillingsdetektiven | Incorrect content | Major | "til sidst" tip; exact order only | QA-122/123 | Tips; alternative orders or instruction | US-023 |
| 22 | Glosekort | Incorrect content | Major | mødes → mødt | script.js:101 | mødtes (+ notes) | US-017 |
| 23 | En/Et | Incorrect content | Major | øl note | :579 | øllen | US-024 |
| 24 | Idiomjæger, Adverbier, Glosekort | Incorrect content (PRD) | Major | English is the main medium | LANG-072 | Danish-first meanings | US-027 |
| 25 | Adverbier | Missing explanation | Major | Wrong-answer feedback has no grammar note | :998 | Note per entry | US-007 |
| 26 | Tidsmaskinen, Pronomenmysteriet, Bøjningsværkstedet (+ Ordstillingsdetektiven wiring) | Missing explanation | Major | Modes without explainers | `data-explainer` attrs (runtime) | New scenes and wiring | US-025 |
| 27 | Antonymer, Ordstillingsdetektiven, Præpositioner | Mobile/desktop UI | Major | Feedback or Next out of view | UI-002/003/004 runtime | scrollIntoView/focus/reorder | US-013 |
| 28 | 11 legacy games | Cross-game | Major | Feedback contract | QA-031 | Shared helper, rolled out per game | US-026 |
| 29 | All games | Cross-game | Major | TTS button visual language | VIS-009 | One shared button | US-029 |
| 30 | 5 games | Cross-game | Minor | Reset missing | GAME-032 | Nulstil + confirm | US-030 |
| 31 | 6+ games | Cross-game | Minor | Focus management | QA-020 | Focus after render | US-031 |
| 32 | 6 games | Cross-game | Minor | English UI strings | QA-033 | Danish strings | US-028 |
| 33 | Konjunktioner, En/Et | Cross-game | Minor | MENU bar inset | QA-042 | Theme padding | US-034 |
| 34 | Explainer games | Cross-game/explainer | Minor | Explainer content gaps, badge, wording | QA-050…052, 054, 057 | Scenes and review | US-035 |
| 35 | En/Et | Visual | Major | Vector icons | VIS-001 | 32px sprites | US-032 |
| 36 | Idiomjæger, Dansk Mester | Visual | Major | Emoji icons | VIS-002/003 | Sprites | US-033 |
| 37 | Shared, several | Visual | Minor | Sprite density and semantics, identity sprites | QA-060…062 | Icon polish | US-038 |
| 38 | Shared, several | Visual | Minor | Chrome and components (glyph fonts, back controls, results, gap, colours, dark surfaces, grid, selects, inline TTS, portal panel/button) | QA-063, 065…073 | Component polish | US-039 |
| 39 | Explainer | Minor polish | Minor | Desktop fit, mobile label, timers, silent failure, rule card, tokens | QA-038, 045, 053, 055, 056, 064 | Modal polish | US-036 |
| 40 | Several | Minor polish | Minor | Layout polish (overflow, hyphenation, SPIL fold, confetti, filter) | QA-039…041, 043, 044 | CSS/layout | US-037 |
| 41 | Per game | Minor polish | Minor | Remaining gameplay and language Minors | QA-014…019, 021…024, 026…030, 079, 089, 090, 093, 095, 103, 107, 111, 115, 118, 121, 124, 125, 127, 128, 074 | Per-game polish | US-040…US-053 |

---

## 12. Final Verdict

**NOT READY**

**Why:**
1. **A linked game teaches nothing.** Pronomenmysteriet serves "Test sentence N." / `opt1` / `opt2` in all 6 modes, and modes 4–5 are empty (QA-001, Critical, confirmed at runtime and in git history).
2. **Systemically wrong answer keys in a linked game.** In Forbindeord, a synonym of the correct connector is regularly offered and marked wrong (QA-002, Critical).
3. **Ungrammatical model answers generated in Tidsmaskinen** (QA-003, Critical).
4. **Adverbier's core loop is broken:** blank page when storage is blocked, broken review, mode stuck, answer leak, no TTS, a 10-item sample dataset.
5. **About 40 Major language defects** across 13 games, plus 11 games that don't follow the PRD feedback contract.

**What is solid:**
- All 16 pages load over `file://` with zero console errors.
- Portal links and the MENU round trip work.
- No horizontal scroll, except 1 px in Dansk Mester at 360 px.
- All tap targets are at least 44 px, focus rings are visible, and reduced motion and dark mode work.
- The explainer modal works in all 10 games.
- The pixel skin is applied everywhere except the En/Et icons and pixel-animation.
- Tidsmaskinen's gameplay is close to reference quality.

The fix for blocker 1 is low-effort: restore the file from `b9abb96`. Blockers 2–3 and the Major content items need native-speaker sign-off.

**Exit criteria for a re-run:**
- US-001 to US-003 are done.
- US-004 to US-013 are done.
- The Major content stories are signed off by a native speaker.
- Then re-run `tests/smoke.mjs` on all games, plus `tests/pronomenmysteriet.mjs`, `tests/tidsmaskinen.mjs` and `node shared/validate.js`.

---

## Appendix A: Critical Verification Log

| # | Worker IDs | Verdict | Coordinator evidence |
|---|---|---|---|
| C-1 | LANG-001, GAME-037, UI-001 (+ VIS §6) | **CONFIRMED, Critical** → QA-001 | See below |
| C-2 | LANG-053 (+ GAME UNCONFIRMED note) | **CONFIRMED, Critical** → QA-002 | See below |
| C-3 | LANG-002 | **CONFIRMED, Critical** → QA-003 (scope refined) | See below |
| C-4 | LANG-041 | **CONFIRMED, DOWNGRADED to Major** → QA-104 | See below |
| C-5 | LANG-037 | **CONFIRMED, DOWNGRADED to Major** → QA-100 | See below |
| C-6 | LANG-034 | **CONFIRMED, DOWNGRADED to Major** → QA-097 | See below |

**C-1 (Pronomenmysteriet placeholder data):**
- `grep -c "Test sentence" pronomenmysteriet/data.js` returns **760**.
- Runtime (`verify.mjs`): every one of the 6 data keys holds only "Test sentence 0." with `["opt1","opt2"]`.
- Data keys are `anaphoric_agreement` and `indefinite_pronouns`, while the game expects `den_det_de` and `nogen_nogle_noget` (`index.html:165-166`).
- Levels are A1 ×380, A2 ×127, B1 ×253.
- `git log -- pronomenmysteriet/data.js` gives 0d6abf3 → 855e0d7 → b9abb96 → **2d606e5**. 2d606e5 (Oct 2, 23:05) has the message "Commit includes placeholders that will be replaced with real curated content" (+10794/−784). It is an ancestor of HEAD, and the working copy equals HEAD.
- `git show b9abb96:pronomenmysteriet/data.js` has 0 placeholders, 760 ids, the keys the game expects, and levels A2 304 / B1 288 / B2 168.
- The portal links the game (`index.html:265`).

**C-2 (Forbindeord distractors):**
- `distractors(rec)` takes `byCat[rec.cat]` minus the answer (`Forbindenor.html:707-716`).
- The category inventory (grep) shows synonym clusters inside a single category:
  - Eksempel: fx / eksempelvis / bl.a. / som
  - Holdning: formentlig / formodentlig / sandsynligvis / muligvis / måske; naturligvis / selvfølgelig; desværre / uheldigvis
  - Konsekvens: derfor / af den grund / følgelig / dermed
  - Forklaring: fordi / da / eftersom / idet
  - Tid: bagefter / derefter / dernæst / derpå
- Concrete case: "Hun smilede, {} hun var glad." has key *fordi*. The pool {da, eftersom, idet, for, nemlig, pga.} contains valid *da* and *eftersom*.
- With 3 of about 6–12 same-category words drawn, a valid synonym appears in a large share of questions. This is the game's only mode.

**C-3 (Tidsmaskinen adverb placement):**
- `tids_adv.cjs` scanned all 1,260 items for `___ <adverb>` with a two-word key.
- Object-following cases confirmed, e.g. "Han havde fået allerede visum", "Chefen havde aflyst allerede mødet", "Vi har haft allerede tre møder", "Holdet har vundet hidtil alle kampe".
- `data.js:6244-6248` (`jeg-var-gaaet-allerede-hjem…`, key "var gået") gives "Jeg var gået allerede hjem".
- The worker's 14 pluperfect items (of 100, so 14% of the mode) plus 9 preterite/perfect items stand.
- Clause-final cases ("Bordet er dækket allerede, så…", 14 in passive) are acceptable spoken Danish and are **not** counted.
- Kept Critical because the marked-correct model answer itself is ungrammatical, it is produced systematically by one template, and it hits a material share of one mode.

**C-4 (Præpositioner "Find fejlen"):**
- `gen("Jeg drikker kaffe {a} {x}.","med",[…mælk,sukker,fløde…],…,{err:"uden"})` (:404-405) and `gen("Temperaturen er {a} {x}.","under",…,{err:"over"})` (:494-495).
- "Find fejlen" (:1016) and "Ret sætningen" (:1069-1070) build the "wrong" sentence by swapping in `err`, then show "Fejlen: uden → med".
- So "Jeg drikker kaffe uden sukker" and "Temperaturen er over nul grader" are taught as errors. This is real.
- Scope is about 20 generated items out of the roughly 535-item pool, which is about 4% of questions in 2 of 10 modes. It is the same defect class as LANG-042 (Major: valid alternative marked wrong).
- Downgraded to **Major** under "wrong answer key / repeated language issue". It stays first in the Præpositioner story.

**C-5 (Idiomjæger "gå op i en højere enhed"):**
- `idiomjaeger.html:531`: `m:"To dissolve into nothing / fall apart"`, `x:"For plans or things to come to nothing."`, example "Hele planen gik op i en højere enhed."
- The meaning is reversed. The idiom means "come together into a harmonious whole".
- It is a single entry out of 171 and doesn't make any mode unusable, so it is downgraded to **Major** (a wrong answer key). It is a one-line data fix.

**C-6 (Adverbier "derfor"):**
- The `derfor` entry has `category:"Adverb - Cause/Effect"` (:456).
- `renderCategoryQuestion` (:829-866) maps categories by regex to Time/Place/Manner/Frequency/Coordinating/Subordinating/Correlative. "Cause/Effect" maps to `""`, so every button is wrong.
- This is reachable only when the session's random mode is Ordklasse-jagten (1 in 7, `:669-677`); the mode then sticks (GAME-004).
- Real but limited to one entry, so downgraded to **Major**. The game's NOT READY status rests on QA-004…008 and QA-096.

## Appendix B: Major Sample Verification Log

25 Majors were checked by the coordinator, spanning all 5 areas.

| Worker ID → QA | Method | Result |
|---|---|---|
| GAME-001 → QA-004 | Runtime, localStorage getter throws | `SecurityError: blocked` pageerror. 0 zone buttons and 75 chars of body text, vs 6 zones and 278 chars in the control run. **Confirmed** |
| GAME-014 → QA-004 | Runtime | `launchMode('mc')` throws SecurityError, stack launchMode:1377 → startSession:1041 → touchDailyStreak:963 → save:853. **Confirmed** |
| GAME-012 → QA-004 | Source | :1236-1237, :1302, :1348 have direct storage access. Accepted (worker runtime screenshot) |
| GAME-009 → QA-009 | Runtime | `PLAY_LVL='A2'; launchGame('native')` gives "Cannot read properties of undefined (reading 'id')". The 'all' control has no error. **Confirmed** |
| GAME-011 → QA-010 | Source | `randItem`: the level pool, then the filter, then `if(pool.length===0) pool = ITEMS` (unfiltered). `nextPair` fixes the options to the pair. **Confirmed** |
| GAME-019 → QA-011 | Runtime | `bestemt_ubestemt` 250/250 and `maengdevaerkstedet` 221/221 have the correct answer at index 0. The render loop has no shuffle. **Confirmed** |
| GAME-023 / UI-005 → QA-012 | Source | `script.js:609-623` resets and saves with no confirm. **Confirmed** |
| GAME-028 → QA-013 | Source | `weakPool()` uses `rec.c<rec.t` on lifetime counters. **Confirmed** |
| UI-004 → QA-037 | Runtime 1366×768 | `#fb` top 773 / bottom 896 vs innerHeight 768, scrollY 0. Text: "✗ PRØV IGEN! Rigtigt svar: over TIP…". **Confirmed** (also evidence for QA-031) |
| UI-002 → QA-035 | Runtime 1366×768 | `#nextBtn` top 1200 vs 768. No focus moved. **Confirmed** |
| VID-001/002/003 → QA-046/047/048 | Runtime | `data-explainer`: tids = 4 scenes; pronomen = min-mit, sin-hans; bøjning = navneord-former, tillaegsord-form. **Confirmed** |
| VIS-001 → QA-058 | Source | `en og et/index.html` has 6 `rx="` and 12 "Cinzel". **Confirmed** |
| VIS-002 → QA-059 | Source | `idiomjaeger.html:666-668` badge `ico:'🥇'/'🗺️'/'🧭'`. **Confirmed** (render per worker screenshot) |
| UI-010 / VIS-007 → QA-042 | Source | Body padding at konj :71 / en og et :75, and the theme overrides keep the padding. **Confirmed** |
| UI-017 vs VIS-010 | Source | See R-1. UI-017 **rejected** as a standalone defect |
| LANG-014 → QA-080 | Source | data.js:409-410 `hans cykel` / `hendes taske`. **Confirmed** |
| LANG-015 → QA-081 | Source | data.js:777 `correct:'nogen'`. **Confirmed** |
| LANG-016 → QA-082 | Source | adjectives.js:247 `['A2','rig']` in the -ig list. **Confirmed** |
| LANG-029 → QA-091 | Source | magiske_verber.html:531 `pf:'Vi er [v] …'`, :558 `pf:'Filmen har [v] …'`. **Confirmed** |
| LANG-032 → QA-094 | Source | script.js:101 `pastParticiple: 'mødt'`. **Confirmed** |
| LANG-049 → QA-112 | Source | dansk-mester.html:512. **Confirmed** |
| LANG-054 → QA-116 | Source | Forbindenor.html:372-375: key `ovenikoebet` while the note says »Oven i købet«. **Confirmed** |
| LANG-060 → QA-122 | Source | ordstilling-detektiv/index.html:567 "hovedverbet står til sidst". **Confirmed** |
| LANG-069 → QA-126 | Source | en og et/index.html:579. **Confirmed** |
| LANG-065 → QA-090 | Source + grep | Text confirmed, but no game loads `DANSK_PRONOUNS`. **Downgraded to Minor (latent)** |

**Accepted on worker evidence, not re-run by the coordinator:**
- GAME-002 to GAME-005
- UI-003
- VIS-009
- LANG-003…LANG-058 apart from those listed above

The workers state these were reproduced twice or checked against source (marked ✔ in the LANG report).

## Appendix C: Severity Changes

| Worker ID | From | To | Reason |
|---|---|---|---|
| LANG-041 | Critical | Major | About 4% of questions in 2 modes; same class as LANG-042 |
| LANG-037 | Critical | Major | Single entry; one-line fix |
| LANG-034 | Critical | Major | Single entry, reachable in 1 of 7 sessions |
| LANG-027, LANG-063, LANG-064, LANG-065 | Major | Minor | Latent: no shipped page loads the data |
| VIS-004 | Major | Minor | Cosmetic density mismatch; no UX impact |
| VIS-011 | Major | Minor | Theme follows the OS in every game; mute exists where sound exists |
| GAME-031 | Minor | Major (QA-031) | PRD hard requirement across 11 games; merged with VIS-010 (Major) |
| GAME-012, GAME-033, VIS-003 | Minor | merged into Major groups (QA-004, QA-013, QA-059) | Same root cause as a Major |
| LANG-005, LANG-007, LANG-067 | Major | UNCONFIRMED (U-01…U-03) | The workers themselves flagged them UNCONFIRMED |
| UI-017 | Minor UNCONFIRMED | Rejected as standalone; folded into QA-029/QA-031 | R-1 |
| GAME UNCONFIRMED ×2 | UNCONFIRMED | Confirmed (QA-002, QA-123) | Verified in code (C-2; LANG-061 code) |

## Appendix D: Unconfirmed — needs verification (not counted)

| ID | Item | Source | How to confirm |
|---|---|---|---|
| U-01 | Tidsmaskinen hearsay "skal/skulle være født": two correct answers and a misleading note (data.js:13528, 13566) | LANG-005 | Native speaker |
| U-02 | Tidsmaskinen "kommer til at" for visible imminence (data.js:9577…9888) | LANG-007 | Native speaker |
| U-03 | Explainer `sin-hans` shows grammatical "Peter ser hans bror" in "wrong" red | LANG-067 (related to QA-054) | Check the scene styling and intent; native review of the scene (`verify:true`) |
| U-04 | Dansk Mester auto-advance timing; whether the result headline emoji (`dansk-mester.html:1157`) and Præpositioner `MODES[].e` emoji (:827-836) render | VIS-010, VIS §3 | Drive to those screens |
| U-05 | Audible TTS quality and voice choice on real devices; iOS Safari, landscape, 200% zoom, screen readers | All workers | Manual device pass |
| U-06 | Whether any legacy game auto-plays TTS without a user gesture (which would then need a mute) | UI-017 residual | Spy on `speechSynthesis.speak` during normal play |

UNCONFIRMED sub-points inside confirmed findings also need native sign-off before they are changed:
- høne plural (LANG-025)
- verbs.js ride/lignes/hed/vid (LANG-028)
- "Stå last og brast", "Gå under radaren" (LANG-040)
- colloquial preposition variants (LANG-044)
- "Skoene slider…", "Slippe af sted med" (LANG-033)
- interessantere/blåere (LANG-021)
- "penge … tælles" (LANG-026)
- "kort tillægsform" (LANG-031)
- "et øl" (LANG-069)
- konj :601 / forb :456 (LANG-055)
- the full non-gradable list (LANG-020)

## Appendix E: Dedup Map

### Consolidated → worker IDs

| QA | Sev | Worker IDs |
|---|---|---|
| QA-001 | Critical | LANG-001, GAME-037, UI-001, VIS §6 note |
| QA-002 | Critical | LANG-053, GAME UNCONFIRMED (Forbindeord synonyms) |
| QA-003 | Critical | LANG-002 |
| QA-004 | Major | GAME-001, GAME-014, GAME-012 |
| QA-005 | Major | GAME-002 |
| QA-006 | Major | GAME-003, VIS-009 (adverbs part), VIS §6 note |
| QA-007 | Major | GAME-004 |
| QA-008 | Major | GAME-005, LANG-035 (Bindeordsduellen part) |
| QA-009 | Major | GAME-009 |
| QA-010 | Major | GAME-011 |
| QA-011 | Major | GAME-019 |
| QA-012 | Major | GAME-023, UI-005 |
| QA-013 | Major | GAME-028, GAME-033 |
| QA-014 | Minor | GAME-007 |
| QA-015 | Minor | GAME-008 (undo part) |
| QA-016 | Minor | GAME-010, LANG-040 (Tak for kaffe part) |
| QA-017 | Minor | GAME-013 |
| QA-018 | Minor | GAME-016 |
| QA-019 | Minor | GAME-018, GAME-020, GAME-026 |
| QA-020 | Minor | GAME-017, GAME-021, GAME-022, GAME-034 (focus), GAME-036 (focus), UI-015 |
| QA-021 | Minor | GAME-024 |
| QA-022 | Minor | GAME-025 |
| QA-023 | Minor | GAME-027 (TTS/match part) |
| QA-024 | Minor | GAME-029 (number keys) |
| QA-025 | Minor | GAME-032, GAME-029 (reset), GAME-034 (reset) |
| QA-026 | Minor | GAME-034 (reload part) |
| QA-027 | Minor | GAME-035 |
| QA-028 | Minor | GAME-038 |
| QA-029 | Minor | GAME-030, VIS-011, UI-017 (resolved) |
| QA-030 | Minor | GAME-039, UI-016, VIS-026, LANG-072 (pixel title) |
| QA-031 | Major | GAME-031, VIS-010, LANG-073, GAME-008 (timing), UI-002 (auto-advance part), UI-017 (no-SFX part) |
| QA-032 | Major | LANG-072 |
| QA-033 | Minor | UI-011, LANG-033 (aria), LANG-044 (badge), LANG-048 (Check/aria), LANG-052 (Continue), LANG-056 (ENERGY/labels), LANG-061 (nav), GAME-027 (Continue), GAME-034 (ENERGY), GAME-036 (nav), VIS-009 (aria names), VIS §6 note |
| QA-034 | Major | VIS-009 |
| QA-035 | Major | UI-002 |
| QA-036 | Major | UI-003 |
| QA-037 | Major | UI-004 |
| QA-038 | Minor | UI-006 |
| QA-039 | Minor | UI-007, VIS-024 |
| QA-040 | Minor | UI-008 |
| QA-041 | Minor | UI-009 |
| QA-042 | Minor | UI-010, VIS-007 |
| QA-043 | Minor | UI-012 |
| QA-044 | Minor | UI-013 |
| QA-045 | Minor | UI-014, VID-011 |
| QA-046 | Major | VID-001 |
| QA-047 | Major | VID-002 |
| QA-048 | Major | VID-003 |
| QA-049 | Minor | VID-004 |
| QA-050 | Minor | VID-005 |
| QA-051 | Minor | VID-006 |
| QA-052 | Minor | VID-007 |
| QA-053 | Minor | VID-008 |
| QA-054 | Minor | VID-009 (U-03 linked) |
| QA-055 | Minor | VID-012 |
| QA-056 | Minor | VID-013 |
| QA-057 | Minor | VID-014, LANG-068 |
| QA-058 | Major | VIS-001 |
| QA-059 | Major | VIS-002, VIS-003 |
| QA-060 | Minor | VIS-004 |
| QA-061 | Minor | VIS-005 |
| QA-062 | Minor | VIS-006, VIS-021, VIS matrix (Dansk Mester flag/snak) |
| QA-063 | Minor | VIS-008 |
| QA-064 | Minor | VIS-012, VIS-014 |
| QA-065 | Minor | VIS-013 |
| QA-066 | Minor | VIS-015, VIS-016 |
| QA-067 | Minor | VIS-017 |
| QA-068 | Minor | VIS-018 |
| QA-069 | Minor | VIS-019 |
| QA-070 | Minor | VIS-020 (+ smoke dark-contrast note) |
| QA-071 | Minor | VIS-022 |
| QA-072 | Minor | VIS-023 |
| QA-073 | Minor | VIS-025 |
| QA-074 | Minor | VIS-027, LANG-013 |
| QA-075…078 | Major | LANG-003, LANG-004, LANG-006, LANG-008 |
| QA-079 | Minor | LANG-009, 010, 011, 012 |
| QA-080…088 | Major | LANG-014, 015, 016, 018, 019, 020, 022, 023, 024 |
| QA-089 | Minor | LANG-021, 025, 026 |
| QA-090 | Minor | LANG-027, 028, 065, 066 |
| QA-091, QA-092 | Major | LANG-029, LANG-030 |
| QA-093 | Minor | LANG-031 |
| QA-094 | Major | LANG-032 |
| QA-095 | Minor | LANG-033 |
| QA-096 | Major | LANG-017, GAME-006 |
| QA-097 | Major | LANG-034 |
| QA-098 | Major | LANG-035 (rest) |
| QA-099 | Major | LANG-036, GAME-008 (no-note part) |
| QA-100…102 | Major | LANG-037, 038, 039 |
| QA-103 | Minor | LANG-040 |
| QA-104…106 | Major | LANG-041, 042, 043 |
| QA-107 | Minor | LANG-044 |
| QA-108 | Major | LANG-045, GAME-015 |
| QA-109, QA-110 | Major | LANG-046, LANG-047 |
| QA-111 | Minor | LANG-048 |
| QA-112…114 | Major | LANG-049, 050, 051 |
| QA-115 | Minor | LANG-052 |
| QA-116, QA-117 | Major | LANG-054, LANG-055 |
| QA-118 | Minor | LANG-056 |
| QA-119, QA-120 | Major | LANG-057, LANG-058 |
| QA-121 | Minor | LANG-059 |
| QA-122 | Major | LANG-060 |
| QA-123 | Major | LANG-061 (order part), GAME UNCONFIRMED (Ordstillingsdetektiven order) |
| QA-124 | Minor | LANG-062 |
| QA-125 | Minor | LANG-063, LANG-064 |
| QA-126 | Major | LANG-069 |
| QA-127 | Minor | LANG-070 |
| QA-128 | Minor | LANG-071 |
| U-01…U-03 | Unconfirmed | LANG-005, LANG-007, LANG-067 |
| — (info, not counted) | — | VID-010 (explainers silent by design) |

### Reverse index (every worker ID → QA)

- **LANG:**

  | Worker ID | QA |
  |---|---|
  | 001 | 001 |
  | 002 | 003 |
  | 003 | 075 |
  | 004 | 076 |
  | 005 | U-01 |
  | 006 | 077 |
  | 007 | U-02 |
  | 008 | 078 |
  | 009–012 | 079 |
  | 013 | 074 |
  | 014 | 080 |
  | 015 | 081 |
  | 016 | 082 |
  | 017 | 096 |
  | 018 | 083 |
  | 019 | 084 |
  | 020 | 085 |
  | 021 | 089 |
  | 022 | 086 |
  | 023 | 087 |
  | 024 | 088 |
  | 025–026 | 089 |
  | 027–028 | 090 |
  | 029 | 091 |
  | 030 | 092 |
  | 031 | 093 |
  | 032 | 094 |
  | 033 | 095 / 033 |
  | 034 | 097 |
  | 035 | 098 / 008 |
  | 036 | 099 |
  | 037 | 100 |
  | 038 | 101 |
  | 039 | 102 |
  | 040 | 103 / 016 |
  | 041 | 104 |
  | 042 | 105 |
  | 043 | 106 |
  | 044 | 107 / 033 |
  | 045 | 108 |
  | 046 | 109 |
  | 047 | 110 |
  | 048 | 111 / 033 |
  | 049 | 112 |
  | 050 | 113 |
  | 051 | 114 |
  | 052 | 115 / 033 |
  | 053 | 002 |
  | 054 | 116 |
  | 055 | 117 |
  | 056 | 118 / 033 |
  | 057 | 119 |
  | 058 | 120 |
  | 059 | 121 |
  | 060 | 122 |
  | 061 | 123 / 033 |
  | 062 | 124 |
  | 063–064 | 125 |
  | 065–066 | 090 |
  | 067 | U-03 |
  | 068 | 057 |
  | 069 | 126 |
  | 070 | 127 |
  | 071 | 128 |
  | 072 | 032 / 030 |
  | 073 | 031 |

- **GAME:**

  | Worker ID | QA |
  |---|---|
  | 001 | 004 |
  | 002 | 005 |
  | 003 | 006 |
  | 004 | 007 |
  | 005 | 008 |
  | 006 | 096 |
  | 007 | 014 |
  | 008 | 015 / 031 / 099 |
  | 009 | 009 |
  | 010 | 016 |
  | 011 | 010 |
  | 012 | 004 |
  | 013 | 017 |
  | 014 | 004 |
  | 015 | 108 |
  | 016 | 018 |
  | 017 | 020 |
  | 018 | 019 |
  | 019 | 011 |
  | 020 | 019 |
  | 021 | 020 |
  | 022 | 020 |
  | 023 | 012 |
  | 024 | 021 |
  | 025 | 022 |
  | 026 | 019 |
  | 027 | 023 / 033 |
  | 028 | 013 |
  | 029 | 024 / 025 |
  | 030 | 029 |
  | 031 | 031 |
  | 032 | 025 |
  | 033 | 013 |
  | 034 | 026 / 025 / 020 / 033 |
  | 035 | 027 |
  | 036 | 033 / 020 |
  | 037 | 001 |
  | 038 | 028 |
  | 039 | 030 |
  | UNCONF-Forbindeord | 002 |
  | UNCONF-Ordstilling | 123 |

- **VID:**

  | Worker ID | QA |
  |---|---|
  | 001 | 046 |
  | 002 | 047 |
  | 003 | 048 |
  | 004 | 049 |
  | 005 | 050 |
  | 006 | 051 |
  | 007 | 052 |
  | 008 | 053 |
  | 009 | 054 |
  | 010 | info, not counted |
  | 011 | 045 |
  | 012 | 055 |
  | 013 | 056 |
  | 014 | 057 |

- **UI:**

  | Worker ID | QA |
  |---|---|
  | 001 | 001 |
  | 002 | 035 / 031 |
  | 003 | 036 |
  | 004 | 037 |
  | 005 | 012 |
  | 006 | 038 |
  | 007 | 039 |
  | 008 | 040 |
  | 009 | 041 |
  | 010 | 042 |
  | 011 | 033 |
  | 012 | 043 |
  | 013 | 044 |
  | 014 | 045 |
  | 015 | 020 |
  | 016 | 030 |
  | 017 | rejected; folded into 029/031 |
  | Ordstillingsdetektiven lives artefact | not counted (note in US-023) |

- **VIS:**

  | Worker ID | QA |
  |---|---|
  | 001 | 058 |
  | 002 | 059 |
  | 003 | 059 |
  | 004 | 060 |
  | 005 | 061 |
  | 006 | 062 |
  | 007 | 042 |
  | 008 | 063 |
  | 009 | 034 / 006 / 033 |
  | 010 | 031 |
  | 011 | 029 |
  | 012 | 064 |
  | 013 | 065 |
  | 014 | 064 |
  | 015 | 066 |
  | 016 | 066 |
  | 017 | 067 |
  | 018 | 068 |
  | 019 | 069 |
  | 020 | 070 |
  | 021 | 062 |
  | 022 | 071 |
  | 023 | 072 |
  | 024 | 039 |
  | 025 | 073 |
  | 026 | 030 |
  | 027 | 074 |
  | §6 notes | 001 / 033 / 006 |

**Note on the VIS report:** its matrix and section text use slightly different numbers for some items. The matrix "VIS-022" (duplicate title) is §5 VIS-021, and the matrix "VIS-025" (Dansk Mester overflow) is §5 VIS-024. This map follows the §5 numbering.
