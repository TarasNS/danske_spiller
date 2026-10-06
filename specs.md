# Game Specs — danske_spiller

One entry per game. Unattended build runs treat this as authoritative for
what a game is and what it must contain. `prd.md` constrains HOW to build
it. `PROGRESS.md` controls WHICH task to run next.

**Never edit during a build run.** Only the repo owner edits this file.
Tasks in PROGRESS.md must not contradict their entry here; if they do,
move the task to "Blocked" and stop.

---

## Existing Games (complete — do not rebuild)

### dansk-antonymer
- **File:** `danish-antonyms-game.html`
- **Status:** Complete
- **Domain:** Antonyms and vocabulary (B1–B2)
- **Exclusion:** Do not create another antonym or synonym game.

### verb-glosekort
- **File:** `danish_flashcards/danish_flashcards_game/index.html`
- **Status:** Complete
- **Domain:** Verb flashcard trainer — conjugation drill (A2–B1)
- **Exclusion:** New verb content must focus on usage, not conjugation. Repair data rather than replacing the game.

### magiske-verber
- **File:** `magiske_verber.html`
- **Status:** Complete
- **Domain:** Verb conjugation across tenses (A2–B1)
- **Exclusion:** Do not replace; new verb games must focus on usage decisions.

### praepositioner
- **File:** `dansk-praepositioner.html`
- **Status:** Complete
- **Domain:** Danish prepositions i, på, til, af (A2–B1)
- **Exclusion:** Do not build another preposition game.

### dansk-mester
- **File:** `danske-phraser/dansk-mester.html`
- **Status:** Complete
- **Domain:** Everyday phrases and greetings (A1–A2)
- **Exclusion:** Do not create another phrase-recognition game.

### en-et-traener
- **File:** `en og et/index.html`
- **Status:** Complete
- **Domain:** Noun gender — en vs. et (A1–A2)
- **Exclusion:** New noun games may use gender but must teach broader inflection, not gender choice alone.

### konjunktionsknus
- **File:** `konjunktioner/konjunktioner.html`
- **Status:** Complete
- **Domain:** Conjunctions cloze (B1)
- **Exclusion:** Do not create another conjunction cloze game.

### forbindenor
- **File:** `forbindenor/Forbindenor.html`
- **Status:** Complete
- **Domain:** Connector words — grid puzzle (B1)
- **Exclusion:** Do not create another connector game.

### ordstillingsdetektiven
- **File:** `ordstilling-detektiv/index.html`
- **Status:** Complete
- **Domain:** Basic word order and V2 rule (B1–B2)
- **Exclusion:** New syntax content must go beyond ordinary V2.

### idiomjaegeren
- **File:** `idiomjaeger.html`
- **Status:** Complete
- **Domain:** Danish idioms (B2)
- **Exclusion:** Do not create another idiom game.

### adverbs
- **File:** `adverbs.html`
- **Status:** Complete
- **Domain:** General adverb usage and meaning (A2–B1)
- **Exclusion:** Do not create another general adverb game.

---

## Shared Foundation (Phase 1 — prerequisite for all new games)

### shared-danscore
- **Files:** `shared/dansk-core.js`
- **Status:** Planned
- **What it is:** Single shared library imported by all five new games. Exposes `window.DanskCore`.
- **Modules:** `tts` (Danish speech synthesis with silent fallback), `store` (localStorage with error handling), `srs` (Leitner 5-box + pattern keys), `diff` (answer normalization + token diff), `level` (CEFR filtering), `ui` (darkMode, motion, sound engine, ttsButton, focusTrap, announce), `quiz` (mc, freeText, tiles, summary renderers)
- **SRS key format:** `<game-id>:<mode>:<item-id>` and `pattern:<game-id>:<type>:<value>`
- **Sound:** WebAudio sequence player; AudioContext initialized on first user interaction only; respects mute toggle and `document.hidden`
- **Full API spec:** See `prd.md` § Phase 1

### shared-data-nouns
- **File:** `shared/data/nouns.js` → `window.DANSK_NOUNS`
- **Status:** Planned
- **Target:** 300 nouns (A1–B2); at least 40 high-frequency irregular/unpredictable
- **Schema:** `{ id, level, base, gender, indefinite_singular, definite_singular, indefinite_plural, definite_plural, plural_pattern, note, example, tags, verify }`
- **Plural patterns allowed:** `er | e | zero | umlaut-er | irregular | foreign`

### shared-data-adjectives
- **File:** `shared/data/adjectives.js` → `window.DANSK_ADJECTIVES`
- **Status:** Planned
- **Target:** 220 adjectives (A1–B2); include irregular, indeclinable, and periphrastic
- **Schema:** `{ id, level, base, common_form, neuter_form, definite_plural_form, comparative, superlative_indefinite, superlative_definite, periphrastic, irregular, indeclinable, note, verify }`

### shared-data-verbs
- **File:** `shared/data/verbs.js` → `window.DANSK_VERBS`
- **Status:** Planned
- **Target:** 200 verbs (A1–B2); all high-frequency
- **Schema:** `{ id, level, infinitive, present, preterite, perfect_auxiliary, participle, imperative, passive_s, note, verify }`

### shared-data-pronouns
- **File:** `shared/data/pronouns.js` → `window.DANSK_PRONOUNS`
- **Status:** Planned
- **Content:** personal, possessive, reflexive_possessive, demonstrative, indefinite paradigms

### shared-data-clauses
- **File:** `shared/data/clause-patterns.js` → `window.DANSK_CLAUSES`
- **Status:** Planned
- **Target:** ~80 transformation templates; used by Sætningsmaskinen and Tidsmaskinen

### shared-validate
- **File:** `shared/validate.js`
- **Status:** Planned
- **What it does:** Checks unique IDs, allowed levels, required fields, non-empty accepted_answers, correct answer in options, no duplicate items after normalization

---

## New Games (Phases 2–6)

### boejningsvaerkstedet
- **Folder:** `boejningsvaerkstedet/`
- **Files:** `index.html`, `data.js`
- **Game ID:** `boejningsvaerkstedet`
- **Status:** Planned
- **Levels:** A1–B2
- **Domain:** Full noun phrase — plural forms, definiteness, adjective agreement, comparison, quantifiers
- **Scope boundary:** En/Et-træner asks "en eller et?" — this game asks "how does the entire noun phrase change?" Do not duplicate gender-only drills.
- **Modes (6):**
  1. Fire former — four noun forms (900 items from 300 nouns)
  2. Byg navneordet — tap-to-place noun phrase assembly (500 items)
  3. Adjektivværkstedet — adjective agreement (400 items)
  4. Sammenligningspressen — comparative/superlative (180 items)
  5. Bestemt eller ubestemt? — definiteness in context (250 items)
  6. Mængdeværkstedet — quantifiers (220 items)
- **Visual theme:** Parchment/brass bookbinding workshop (Potion Craft material feeling; do not copy artwork)
- **Palette:** Parchment #E8DDC4, Wood #7A5134, Brass #B88A44, Correct #50744B, Wrong #8C413A
- **Interaction:** Tap-to-place tiles; free-text for Fire former (normalized via DanskCore.diff)
- **Full spec:** `improvement/specs.md` § 4

### pronomenmysteriet
- **Folder:** `pronomenmysteriet/`
- **Files:** `index.html`, `data.js`
- **Game ID:** `pronomenmysteriet`
- **Status:** Planned
- **Levels:** A2–B2
- **Domain:** Personal, possessive, reflexive, demonstrative and indefinite pronouns
- **Scope boundary:** Tests grammatical reference, not vocabulary. Every difficult item must provide enough context to make the intended answer uniquely defensible.
- **Modes (6):**
  1. Subjekt eller objekt — jeg/mig etc. (120 items)
  2. Min, mit eller mine — possessive agreement (120 items)
  3. Sin eller hans? — reflexive vs. non-reflexive possessive (180 items)
  4. Den, det eller de? — anaphoric agreement (100 items)
  5. Nogen, nogle eller noget? — indefinite pronouns (140 items)
  6. Demonstrativsporet — denne/dette/disse + related (100 items)
- **QA gate:** Mode 3 items are invalid if two answers remain plausible from the given context.
- **Visual theme:** Navy courtroom/case files (Ace Attorney feel; do not copy characters or assets)
- **Palette:** Navy #17233F, Gold #D2A94F, Paper #F0E7D2, Correct #3C7B61, Wrong #A73D43
- **Full spec:** `improvement/specs.md` § 5

### saetningsmaskinen
- **Folder:** `saetningsmaskinen/`
- **Files:** `index.html`, `data.js`
- **Game ID:** `saetningsmaskinen`
- **Status:** Planned
- **Levels:** A2–C1
- **Domain:** Clause structure beyond basic V2 — adverb placement, transformations, questions, indirect questions, relative clauses, der/det, complex chains
- **Scope boundary:** Ordstillingsdetektiven covers basic V2; do not reproduce large sets of ordinary V2 items.
- **Modes (7):** (item counts below are the *targets*, unchanged; *current* `data.js` holds 99 items after the US-051 removal of clone generators: 40/10/10/10/10/9/10 per mode)
  1. Ikke-flytteren — adverb placement in main vs. subordinate clause (140 items)
  2. Hovedsætning til ledsætning — main→subordinate transformation (160 items)
  3. Byg spørgsmålet — direct questions (140 items)
  4. Indirekte spørgsmål — indirect questions (140 items)
  5. Relativværkstedet — relative clauses with optional-omission handling (180 items)
  6. Der eller det? — existential/impersonal distinction (160 items)
  7. Sætningskæden — complex clause chains B2–C1 (100 items)
- **Visual theme:** Baba Is You word blocks (do not copy levels or sprites)
- **Palette:** Background #F2E7CC, Main clause coral #D96D5F, Subordinate blue #4E82A6, Relative green #5F8B68
- **Interaction:** Tap-to-select tile + tap-to-place; tiles wobble ≤2 px
- **Full spec:** `improvement/specs.md` § 6

### tidsmaskinen
- **Folder:** `tidsmaskinen/`
- **Files:** `index.html`, `data.js`
- **Game ID:** `tidsmaskinen`
- **Status:** Planned
- **Levels:** A2–C1
- **Domain:** Tense and construction choice in context — not conjugation drills
- **Scope boundary:** Existing verb games teach conjugation; this game asks "which construction fits this situation?" Every item must have temporal context.
- **Modes (9):**
  1. Nutid eller datid? (120 items)
  2. Datid eller perfektum? (180 items)
  3. Før fortiden — pluskvamperfektum (100 items)
  4. Fremtidsværkstedet (140 items)
  5. Modalcentralen (180 items)
  6. Hvis-portalen — conditionals (140 items)
  7. At eller ikke at? — infinitive patterns (140 items)
  8. Aktiv eller passiv? (180 items)
  9. Kommandoværkstedet — imperatives (80 items)
- **Extra:** Træning mode (default) + Timed mode for all modes; no continuous ticking
- **Visual theme:** Horizontal timeline with time gates (Chrono Trigger feel; no copied assets)
- **Palette:** Deep blue #17263B, Past amber #B67A3D, Present cyan #3C93A8, Future violet #7263A8
- **Full spec:** `improvement/specs.md` § 7

### skrivekontrollen
- **Folder:** `skrivekontrollen/`
- **Files:** `index.html`, `data.js`
- **Game ID:** `skrivekontrollen`
- **Status:** Planned
- **Levels:** B1–C1
- **Domain:** Written grammar — finding and correcting errors in controlled texts
- **Scope boundary:** Not a free-form essay evaluator; uses controlled sentences with exactly documented errors.
- **Modes (7):**
  1. Find fejlen — one sentence, one error, tap-to-correct (300 items)
  2. Kommakontrollen — comma placement, supports two conventions (250 items)
  3. Sætningsgrænser — run-ons, splices, fragments (160 items)
  4. Hold tiden — tense consistency in short texts (120 items)
  5. Henvisningskontrollen — reference consistency (140 items)
  6. Redigér teksten — short paragraphs with 2–3 controlled errors (100 items)
  7. Registereftersyn — grammar and formality (120 items)
- **Special requirement:** Comma convention setting (Startkomma / Intet startkomma) stored in localStorage; both conventions tested; never mark both as wrong simultaneously.
- **QA rule:** Every Mode 1 sentence must have exactly one documented target error with no accidental second error.
- **Visual theme:** Typewritten proofreader's desk (Obra Dinn aesthetic; no copied assets)
- **Palette:** Paper #E8E0C8, Ink #23231F, Proof red #A13D3D, Correct green #47745A
- **Full spec:** `improvement/specs.md` § 8
