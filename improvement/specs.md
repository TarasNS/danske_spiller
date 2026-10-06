# Danish Grammar Games — Missing Games Build Specification

**Purpose:** Complete the major gaps in the existing Danish grammar-game collection without rebuilding domains already covered.
**Primary goal:** Grammar production and grammatical decision-making from A1 through C1.
**New games: 5**

1. Bøjningsværkstedet
2. Pronomenmysteriet
3. Sætningsmaskinen
4. Tidsmaskinen
5. Skrivekontrollen

---

## 1. Existing Games Excluded From This Specification

The following domains already have games and must not be rebuilt as standalone products:

| Existing game | Covered domain | Exclusion rule |
|---|---|---|
| Danske Antonymer | Antonyms and vocabulary | Do not create another antonym or synonym game |
| Verb-glosekort | Verb conjugation | Repair data rather than replacing the game |
| Magiske Verber | Verb conjugation | New verb content must focus on usage, not conjugation |
| Præpositions-Mester | Prepositions | Do not build another preposition game |
| Dansk Mester | Everyday phrases | Do not create another phrase-recognition game |
| En/Et-træner | Noun gender | New noun games may use gender but must teach broader inflection |
| Konjunktion Crush | Conjunctions | Do not create another conjunction cloze game |
| Forbindeord — Gitterprotokol | Connectors | Do not create another connector game |
| Ordstillingsdetektiven | Basic word order and V2 | New syntax content must go beyond ordinary V2 |
| Idiomjægeren | Idioms | Do not create another idiom game |
| Adverbs game | Adverbs | Do not create another general adverb game |

### Important overlap boundaries

The five new games may reuse grammatical knowledge that appears incidentally in existing games, but they must not reproduce the same core interaction.

Examples:

- **Tidsmaskinen** may use verb forms, but must test tense choice in context rather than conjugation.
- **Sætningsmaskinen** may use word tiles, but must focus on subordinate clauses, questions, relative clauses and transformations rather than basic V2.
- **Bøjningsværkstedet** may use noun gender, but must focus on full noun phrases, plurals, definiteness and adjective agreement rather than choosing only en or et.
- **Skrivekontrollen** may contain connectors, but must test punctuation, clause boundaries and text correction rather than connector selection.

---

## 2. Global Product Requirements

These requirements apply to every new game.

### 2.1 Technical structure

Each game must be able to run independently.

Recommended structure:

```text
/<game-id>/
  index.html
  data.js
```

A game may remain a single `index.html` file when the dataset is small enough. Large datasets should use a local `data.js` loaded through a normal script tag.

Example:

```html
<script src="../shared/dansk-core.js"></script>
<script src="./data.js"></script>
```

Requirements:

- No frameworks.
- No build step.
- No runtime `fetch()`.
- No XHR.
- No CDN dependencies.
- No analytics.
- No cookies.
- Must work through `file://`.
- CSS and JavaScript should be inline unless shared code already exists.
- All progress must use stable item IDs.
- Array indices must never be used as permanent progress keys.
- Every game must open with zero console errors.

### 2.2 Shared library

All new games should use the shared library rather than reimplementing common functions.

Expected shared features:

```text
DanskCore.tts
DanskCore.store
DanskCore.srs
DanskCore.diff
DanskCore.level
DanskCore.ui
DanskCore.quiz
```

Minimum shared responsibilities:

- Danish text-to-speech
- Danish voice discovery
- localStorage error handling
- namespaced progress storage
- Leitner or equivalent SRS
- dark-mode persistence
- home navigation
- sound enable/disable
- reduced-motion detection
- answer normalization
- token-level text comparison
- level filtering
- reusable multiple-choice handling
- reusable free-text grading

### 2.3 Language rules

- Interface text must be Danish.
- English may appear only when it resolves semantic ambiguity.
- Do not show Danish and English versions of the same instruction.
- Every Danish prompt must have a replay button.
- Replay buttons must use `DanskCore.tts`.
- All text must use contemporary natural Danish.
- Avoid literal translations from English.
- Do not include doubtful forms as authoritative answers.
- Mark uncertain dataset records with `"verify": true`.
- Every item ID must be unique and stable.

### 2.4 Start screen

The start screen must contain only:

1. Game title and visual theme
2. One large Spil button
3. Compact mode and level controls

The Spil button resumes the learner's last selected mode and level.

Do not include:

- Long instructions
- Progress dashboards
- Feature descriptions
- Tutorial slides
- Paragraphs explaining the grammar

The first question acts as the tutorial.

A single first-round hint is permitted:

- Danish
- Maximum eight words
- Hidden permanently after the first correct answer

### 2.5 Standard round loop

```text
Prompt
→ answer
→ immediate feedback
→ next item
```

Correct answer:

- No congratulatory sentence
- Positive animation
- Short sound
- Automatic advance after approximately 700–900 ms

Wrong answer:

- Show the correct answer
- Show exactly one grammar note
- Show replay control
- Pause until the learner continues

The grammar note must:

- Be in Danish
- Be one line where possible
- State the relevant rule
- Avoid motivational text
- Avoid jokes
- Avoid repeating the correct answer unnecessarily

### 2.6 Answer interactions

An answer must require no more than two interactions.

Valid examples:

- Tap an option
- Tap two tiles
- Type and press Enter
- Tap a word and tap a destination slot

Invalid examples:

- Select answer, press confirm, close explanation, press next
- Drag several items and then submit the entire page
- Open a separate rule panel before answering

### 2.7 Free-text grading

Free-text answers must never rely on a single exact string when multiple forms are valid.

Every free-text item must use one or more of:

- `accept`
- `accepted_answers`
- `accepted_orders`
- normalized comparison
- `DanskCore.diff`
- punctuation-insensitive comparison
- optional-word handling

Normalization should support:

- case-insensitive matching
- optional final punctuation
- normalized whitespace
- typographic and straight apostrophes
- accepted spelling variants where appropriate

Do not automatically normalize away grammatical differences that the item is testing.

Example:

```js
{
  id: "perfektum-boet-tre-aar",
  accepted_answers: [
    "Jeg har boet i Danmark i tre år.",
    "Jeg har boet i Danmark i 3 år."
  ]
}
```

### 2.8 Timed modes

Any timed mode must also have an untimed Træning setting.

Rules:

- Træning is the default for new players.
- Time pressure must not be introduced before the learner has completed several correct items.
- The timer must be visible but visually secondary.
- Time expiration counts as an unanswered item, not a grammatical error.
- Timed results must not alter SRS more harshly than an ordinary wrong answer.

### 2.9 End-of-round screen

The round-end screen must contain:

- Score
- Accuracy
- Up to three weakest grammar items
- One primary Spil igen button
- Optional Gentag fejl chip when errors are available

Do not include:

- Large statistics dashboards
- Multiple competing primary buttons
- Long performance commentary
- Empty review modes

### 2.10 Accessibility

All games must support:

- 360 px viewport width
- No horizontal overflow
- Touch targets of at least 44 × 44 px
- Keyboard operation
- Number keys for options
- Enter to submit
- Escape to close nonessential overlays
- Visible focus states
- ARIA labels on icon buttons
- Reduced-motion preference
- Muted mode
- Dark mode
- Sufficient contrast
- Instructions that do not rely only on colour

### 2.11 Sound architecture

All sound should be generated locally through WebAudio where practical. Do not require downloaded sound files for essential feedback.

Every game should define a small sound palette:

```text
correct
wrong
select
move
round-complete
special-event
```

Sound rules:

- Correct sound: 80–250 ms
- Wrong sound: low-volume and nonpunitive
- Selection sound: optional and subtle
- Round-complete sound: maximum 1.5 seconds
- Avoid continuous background music
- Avoid loud impact sounds
- Avoid realistic alarm sounds
- Avoid speech layered over TTS
- Respect the global sound toggle
- Do not play sounds when the tab is hidden

Recommended WebAudio gain targets:

```text
selection:      0.025–0.05
correct:        0.05–0.09
wrong:          0.035–0.06
round complete: 0.06–0.10
```

### 2.12 Standard data fields

Every item must contain:

```js
{
  id: "stable-kebab-id",
  level: "A1",
  note: "Kort grammatisk regel."
}
```

Optional global fields:

```js
{
  register: "neutral",
  tags: [],
  verify: false,
  source_note: "",
  accepted_answers: []
}
```

Allowed levels:

```text
A1
A2
B1
B2
C1
```

---

## 3. Shared Grammar Data

Several games require the same nouns, adjectives, pronouns and verbs. Shared forms must come from canonical data rather than copied datasets.

Recommended structure:

```text
/shared/data/
  nouns.js
  adjectives.js
  verbs.js
  pronouns.js
  clause-patterns.js
```

### 3.1 Shared noun schema

```js
{
  id: "bog",
  level: "A1",
  base: "bog",
  gender: "en",
  indefinite_singular: "en bog",
  definite_singular: "bogen",
  indefinite_plural: "bøger",
  definite_plural: "bøgerne",
  plural_pattern: "umlaut-er",
  note: "Bog skifter vokal i flertal: bog → bøger.",
  example: "Bøgerne ligger på bordet."
}
```

### 3.2 Shared adjective schema

```js
{
  id: "stor",
  level: "A1",
  base: "stor",
  common_form: "stor",
  neuter_form: "stort",
  definite_plural_form: "store",
  comparative: "større",
  superlative_indefinite: "størst",
  superlative_definite: "største",
  irregular: true,
  note: "Stor bøjes uregelmæssigt: større, størst."
}
```

### 3.3 Shared verb schema

Verb records may be reused for prompts but must not duplicate the existing conjugation game's teaching role.

```js
{
  id: "bo",
  level: "A1",
  infinitive: "bo",
  present: "bor",
  preterite: "boede",
  perfect_auxiliary: "har",
  participle: "boet",
  imperative: "bo",
  passive_s: null,
  note: "Bo danner perfektum med har: har boet."
}
```

### 3.4 Cross-game consistency rule

A form must not be independently defined in multiple game datasets.

For example:

- *bøgerne* must come from the shared noun record.
- *større* must come from the shared adjective record.
- *har boet* must use the shared verb record.
- Pronoun labels must use one shared naming convention.

Any exception must include a documented reason.

---

## 4. Game One — Bøjningsværkstedet 🛠️

**Game ID:** `boejningsvaerkstedet`
**Folder:** `/boejningsvaerkstedet/`
**Levels:** A1–B2
**Primary domain:** Noun inflection, adjective agreement, articles, definiteness and quantifiers
**Primary skill:** Constructing complete noun phrases
**Priority:** Tier 1 — build first

### 4.1 Scope boundary

This game must not duplicate En/Et-træner.

En/Et-træner asks:

```text
en eller et?
```

Bøjningsværkstedet asks:

```text
How does the entire noun phrase change?
```

Examples:

```text
en stor bil
den store bil
to store biler
de store biler
```

The learner must coordinate:

- Gender
- Number
- Definiteness
- Article
- Noun ending
- Adjective ending

### 4.2 Visual design

**Inspiration:** Potion Craft with a mechanical bookbinding workshop

The visual language combines:

- A wooden craftsman's workbench
- Brass letterpress tools
- Paper labels
- Ink rollers
- Sliding trays
- Small glass jars containing endings
- A central phrase-building press

The interface should feel tactile but calm.

Recommended palette:

```text
Parchment:       #E8DDC4
Dark parchment:  #2B2925
Wood:            #7A5134
Brass:           #B88A44
Ink:             #282622
Correct green:   #50744B
Wrong red:       #8C413A
Adjective amber: #C58A37
Noun blue:       #49758A
Article violet:  #735C83
```

Do not copy artwork, logos or identifiable interface assets from Potion Craft. Use the inspiration only for:

- Material feeling
- Layout hierarchy
- Crafting metaphor
- Muted colour palette
- Physical assembly animations

### 4.3 Main visual mechanic

A noun phrase is assembled on a three- or four-slot workbench.

Example:

```text
[ artikel ] [ adjektiv ] [ substantiv ]
```

Prompt:

```text
bestemt ental · et-ord
```

Available pieces:

```text
det
stor
store
stort
hus
huset
```

Correct construction:

```text
det store hus
```

Once complete, the phrase enters the press and appears as a finished printed label. Wrong pieces return to the tray. The item note appears as a narrow proofing slip.

### 4.4 Modes

#### Mode 1 — Fire former

Teach the noun paradigm:

|  | Ental | Flertal |
|---|---|---|
| **Ubestemt** | hus | huse |
| **Bestemt** | huset | husene |

Mechanics:

- One noun appears.
- One cell is highlighted.
- Learner types or selects the required form.
- Advanced rounds ask learners to complete all four cells.

Coverage:

- regular `-er`
- regular `-e`
- zero plural
- vowel change
- irregular plural
- words ending in unstressed `-e`
- foreign plural patterns where common

Recommended dataset:

- 300 nouns
- At least 40 high-frequency irregular or unpredictable nouns

#### Mode 2 — Byg navneordet

Construct complete noun phrases.

Examples:

```text
en gammel stol
et gammelt bord
gamle stole
den gamle stol
de gamle stole
```

Mechanics:

- Phrase properties appear as compact symbols.
- Learner places article, adjective and noun into slots.
- Maximum two taps when using prebuilt phrase chunks.
- Free-text mode may be unlocked later.

Recommended dataset:

- 500 generated phrase combinations
- Generated only from verified noun and adjective records

#### Mode 3 — Adjektivværkstedet

Focus on adjective agreement:

- common gender: `-Ø`
- neuter: `-t`
- plural: `-e`
- definite: `-e`
- participial adjectives
- adjectives already ending in `-t`
- adjectives with consonant changes
- indeclinable adjectives
- `lille/små`
- `anden/andet/andre`

Examples:

```text
en hurtig bus
et hurtigt tog
hurtige tog
det hurtige tog
```

#### Mode 4 — Sammenligningspressen

Comparative and superlative:

```text
stor → større → størst
god → bedre → bedst
interessant → mere interessant → mest interessant
```

Coverage:

- `-ere/-est`
- spelling changes
- irregular forms
- periphrastic comparison with `mere/mest`
- definite superlative: `den største`
- predicative superlative: `huset er størst`

#### Mode 5 — Bestemt eller ubestemt?

Teach article and definiteness choice in context.

Examples:

```text
Jeg købte en bog.
Bogen var dyr.
```

```text
Hun er læge.
Hun talte med lægen.
```

Coverage:

- first versus subsequent mention
- specific versus nonspecific reference
- professions without article
- possessive phrases without definite suffix
- demonstratives
- definite adjective construction
- generic plural
- common fixed expressions

This mode must use short contexts rather than isolated phrases.

#### Mode 6 — Mængdeværkstedet

Teach quantifiers and countability:

- mange/meget
- få/lidt
- færre/mindre
- flere/mere
- al/alt/alle
- hver/hvert
- begge
- ingen/intet
- nogen/nogle/noget

Examples:

```text
mange bøger
meget arbejde
få mennesker
lidt tid
```

This mode overlaps conceptually with pronouns but belongs here when the quantifier modifies a noun.

### 4.5 Sound recommendations

Sound identity: wood, paper, brass and glass.

**Select** — A short wooden tick: 90 ms, frequency around 500 Hz, fast decay, very low gain.

**Correct** — A three-part crafting sound:

1. Soft mechanical click
2. Brief paper slide
3. High glass or brass ping

WebAudio alternative:

```text
220 Hz → 330 Hz → 494 Hz
Total duration: 220 ms
```

**Wrong** — A soft press misalignment: low wooden knock, no buzzer, 120–180 ms, pitch around 140 Hz.

**Completed phrase** — A letterpress thump followed by a light page flutter.

**Round complete** — A restrained workshop sequence: three mechanical clicks, one warm chord, maximum 1.2 seconds. No continuous workshop ambience.

### 4.6 Data schemas

Noun-form item:

```js
{
  id: "bog-bestemt-flertal",
  level: "A1",
  noun_id: "bog",
  requested_form: "definite_plural",
  accepted_answers: ["bøgerne"],
  note: "Bog får vokalskifte og -er i flertal."
}
```

Noun-phrase construction item:

```js
{
  id: "det-store-hus",
  level: "A1",
  noun_id: "hus",
  adjective_id: "stor",
  features: {
    number: "singular",
    definiteness: "definite",
    gender: "neuter"
  },
  pieces: ["det", "stor", "store", "stort", "hus", "huset"],
  accepted_orders: [
    ["det", "store", "hus"]
  ],
  note: "Efter det får adjektivet -e."
}
```

Contextual definiteness item:

```js
{
  id: "foerste-anden-omtale-bog",
  level: "A2",
  context: "Jeg købte ___ i går. Bogen var dyr.",
  options: ["en bog", "bogen", "den bog"],
  correct: "en bog",
  note: "Første omtale bruger normalt ubestemt form."
}
```

### 4.7 Dataset targets

| Dataset | Target |
|---|---|
| Canonical nouns | 300 |
| Canonical adjectives | 220 |
| Full noun-form prompts | 900 generated |
| Phrase constructions | 500 |
| Comparative items | 180 |
| Definiteness contexts | 250 |
| Quantifier items | 220 |

Generated combinations must be filtered for semantic naturalness. Do not generate phrases such as grammatically valid but implausible adjective–noun combinations unless they are intentionally humorous and clearly natural.

### 4.8 QA rules

- Verify every irregular plural manually.
- Verify noun gender against at least two reliable references.
- Prevent double definiteness such as `den store bilen`.
- Prevent possessive plus definite suffix errors such as `min bilen`.
- Test adjective forms ending in `-sk`, `-t`, `-d`, doubled consonants and vowels.
- Check whether comparison with `mere/mest` is natural.
- Avoid claiming that all adjectives follow one productive pattern.
- Notes must describe the item's actual pattern.
- Do not teach lexical plural patterns as absolute rules.

### 4.9 Definition of done

- All six modes playable
- 300 verified nouns
- 220 verified adjectives
- No contradictions with En/Et-træner
- Full keyboard operation
- Free-text accept lists
- Correct form survives reload through SRS
- 360 px layout verified
- Dark mode verified
- Reduced motion verified
- Every Danish phrase has TTS
- No console errors through `file://`

---

## 5. Game Two — Pronomenmysteriet 🕵️

**Game ID:** `pronomenmysteriet`
**Folder:** `/pronomenmysteriet/`
**Levels:** A2–B2
**Primary domain:** Personal, possessive, reflexive, demonstrative and indefinite pronouns
**Primary skill:** Tracking reference and ownership in context
**Priority:** Tier 1

### 5.1 Scope boundary

This game teaches grammatical reference.

It must not become:

- A vocabulary-matching game
- A translation game
- A list of isolated pronoun tables
- A general reading-comprehension game

Every difficult pronoun item must include enough context to make the intended answer uniquely defensible.

### 5.2 Visual design

**Inspiration:** Ace Attorney investigation and courtroom scenes

Visual language:

- Navy courtroom panels
- Cream evidence cards
- Gold dividers
- Character nameplates
- Case files
- Red contradiction marks
- Gavel and evidence-folder animations

Recommended palette:

```text
Navy:          #17233F
Deep navy:     #0D1426
Gold:          #D2A94F
Paper:         #F0E7D2
Ink:           #22242B
Evidence blue: #3F6C94
Correct green: #3C7B61
Wrong red:     #A73D43
```

Do not use copied characters, logos, dialogue boxes or assets. The game should evoke courtroom reasoning without becoming theatrical after every answer.

### 5.3 Main visual mechanic

Each item is a miniature case.

The learner sees:

- Two or three characters
- A short context
- One target sentence
- Pronoun evidence cards

Example:

```text
Peter og Martin er på café.
Peter ringer til sin kone.
```

Question:

```text
Hvis konen er Peters, hvilket ord passer?
```

Options:

```text
sin
hans
deres
```

Correct answers close the case file with a small green seal. Wrong answers reveal one evidence line explaining the reference.

### 5.4 Modes

#### Mode 1 — Subjekt eller objekt

Coverage:

- jeg/mig
- du/dig
- han/ham
- hun/hende
- vi/os
- I/jer
- de/dem

Examples:

```text
Hun hjælper ham.
Han hjælper hende.
```

Include coordinated phrases:

```text
Mette og jeg kommer.
Han talte med Mette og mig.
```

Do not teach artificial prescriptive rules that conflict with normal contemporary usage without a register note.

#### Mode 2 — Min, mit eller mine

Possessive agreement:

- min/mit/mine
- din/dit/dine
- sin/sit/sine
- vores
- jeres
- deres

The possessive agrees with the possessed noun, not the owner.

Example:

```text
Sara har fundet sit pas.
```

The note must focus on `pas`, not Sara.

#### Mode 3 — Sin eller hans?

Reflexive possessives:

```text
Peter vasker sin bil.
Peter vasker hans bil.
```

The context must identify whether the object belongs to the subject or another person.

English gloss may be used only where Danish context cannot disambiguate efficiently. Preferred solution: provide a visual ownership diagram or prior sentence in Danish.

#### Mode 4 — Den, det eller de?

Anaphoric agreement:

```text
Bilen? Den er ny.
Huset? Det er gammelt.
Bøgerne? De ligger der.
```

Coverage:

- grammatical gender
- singular/plural
- reference to clauses or situations with `det`
- reference to people with personal pronouns
- avoiding overuse of `den` for people

#### Mode 5 — Nogen, nogle eller noget?

Coverage:

- nogen
- nogle
- noget
- ingen
- intet
- man
- en
- alle
- begge
- hver
- hverken

Context must determine:

- countable versus uncountable
- singular versus plural
- interrogative or negative polarity
- unspecified quantity
- formal versus conversational use where relevant

#### Mode 6 — Demonstrativsporet

Coverage:

- denne/dette/disse
- den/det/de
- sådan/sådant/sådanne
- samme
- selv
- egen/eget/egne

Examples:

```text
denne bog
dette problem
disse regler
mit eget værelse
```

### 5.5 Sound recommendations

Sound identity: case files, desk taps and restrained courtroom cues.

**Select** — A short paper-card placement sound.

**Correct** — A gavel tap combined with a high two-note resolution.

Recommended sequence:

```text
180 Hz impact
440 Hz → 660 Hz confirmation
Total: 250 ms
```

The gavel must sound restrained, not explosive.

**Wrong** — A soft pencil strike-through: short noise burst, downward pitch movement, maximum 180 ms.

**Evidence reveal** — A paper slide or folder opening sound.

**Special event** — A dramatic objection-style impact may appear only:

- On boss items
- At most once per round
- When the learner catches an intentionally incorrect pronoun

Do not play a dramatic voice sample.

**Round complete** — Three gavel taps with a quiet final chord.

### 5.6 Data schema

```js
{
  id: "peter-sin-kone-own",
  level: "A2",
  mode: "reflexive_possessive",
  context_da: [
    "Peter er gift med Anna.",
    "Han taler om sin kone."
  ],
  sentence_da: "Peter taler om ___ kone.",
  options: ["sin", "hans", "deres"],
  correct: "sin",
  reference: {
    subject: "Peter",
    owner: "Peter",
    possessed: "kone"
  },
  gloss_en: "Peter talks about his own wife.",
  note: "Sin viser tilbage til sætningens subjekt."
}
```

### 5.7 Dataset targets

| Mode | Target |
|---|---|
| Subject/object | 120 |
| Possessive agreement | 120 |
| Reflexive possessives | 180 |
| den/det/de | 100 |
| nogen/nogle/noget | 140 |
| Demonstratives and related forms | 100 |
| **Total curated items** | **760** |

Items may share contexts, but target sentences must not be duplicated.

### 5.8 Critical QA rules

**Reflexive possessive QA** — Every `sin/hans/hendes/deres` item must be independently checked for:

- Clear grammatical subject
- Clear owner
- Clear possessed object
- No unintended second interpretation
- Gloss matching exactly one answer
- Natural Danish context

An item is invalid when two options remain plausible under the supplied context.

**Personal pronoun QA** — Check coordinated constructions carefully:

```text
Mette og jeg
Mette og mig
```

Do not reduce all choices to a simplistic "remove the other person" trick without context.

**Indefinite pronoun QA** — Do not claim absolute rules for `nogen/nogle` without accounting for:

- questions
- negation
- hypothetical meaning
- plural quantity
- regional or register variation

### 5.9 Definition of done

- Six complete modes
- At least 700 curated items
- Every difficult item includes sufficient context
- No ambiguous reflexive-possessive items
- TTS on all Danish context and target sentences
- Keyboard options
- Stable SRS item keys
- Dark mode
- Reduced motion
- 360 px support
- Zero console errors through `file://`

---

## 6. Game Three — Sætningsmaskinen ⚙️

**Game ID:** `saetningsmaskinen`
**Folder:** `/saetningsmaskinen/`
**Levels:** A2–C1
**Primary domain:** Clause structure beyond basic V2
**Primary skill:** Building and transforming complete Danish clauses
**Priority:** Tier 1

### 6.1 Scope boundary

Ordstillingsdetektiven already covers basic word order and V2. Sætningsmaskinen must not repeat large sets of:

```text
I går købte jeg en bog.
```

unless the sentence is the starting point for a more advanced transformation.

The game focuses on:

- main versus subordinate clauses
- placement of sentence adverbs
- questions
- indirect questions
- relative clauses
- `der/det`
- clause transformation
- embedded clause chains

### 6.2 Visual design

**Inspiration:** Baba Is You

Visual language:

- Words as physical blocks
- Rounded outlines
- Flat pastel rooms
- Clearly marked clause zones
- Slots between words
- Small wobble on selectable tiles
- Snap and bounce feedback
- Minimal decoration

Recommended palette:

```text
Background cream:  #F2E7CC
Main clause coral: #D96D5F
Subordinate blue:  #4E82A6
Relative green:    #5F8B68
Question violet:   #75639B
Neutral tile:      #F8F2E4
Tile ink:          #25262B
Wrong red:         #B54A47
```

Dark mode:

- Charcoal background
- Desaturated tile colours
- Cream text
- No neon glow

Do not copy levels, sprites, fonts or game assets.

### 6.3 Main visual mechanic

Every sentence is represented as word blocks.

Example main clause:

```text
Han | kommer | ikke | i dag
```

Transformation target:

```text
Jeg tror, at ...
```

The learner moves blocks into the subordinate-clause machine:

```text
Jeg | tror | at | han | ikke | kommer | i dag
```

Correct placement locks blocks together. Incorrect placement makes the moved block bounce back and displays the rule note.

### 6.4 Modes

#### Mode 1 — Ikke-flytteren

Teach placement of sentence adverbs.

Core contrast:

```text
Han kommer ikke.
Jeg ved, at han ikke kommer.
```

Include:

- ikke
- altid
- aldrig
- ofte
- måske
- sandsynligvis
- heldigvis
- desværre
- allerede

The existing adverb game covers adverb meaning and sentence use. This mode tests clause-position rules only.

#### Mode 2 — Hovedsætning til ledsætning

Transform a complete main clause into a subordinate clause.

Example:

```text
Hun arbejder ikke i dag.
```

Target frame:

```text
Jeg ved, at ...
```

Answer:

```text
Jeg ved, at hun ikke arbejder i dag.
```

Coverage: `at`, `fordi`, `selvom`, `hvis`, `når`, `da`, `mens`, `før`, `efter at`.

The conjunction itself is supplied. The learner is tested on clause structure rather than connector vocabulary.

#### Mode 3 — Byg spørgsmålet

Coverage:

- yes/no questions
- hv-questions
- questions with prepositions
- subject questions
- object questions

Examples:

```text
Bor du her?
Hvor bor du?
Hvem bor her?
Hvem taler du med?
```

Use constrained tile banks with one or more accepted orders. Do not use unrestricted free text when several unrelated questions would be valid.

#### Mode 4 — Indirekte spørgsmål

Coverage:

```text
Jeg ved ikke, hvor han bor.
Kan du fortælle mig, hvornår toget går?
Jeg ved ikke, hvem der kommer.
```

Special focus:

- no question inversion inside indirect questions
- `om` for yes/no content
- `hv- + der` in subject questions
- punctuation

#### Mode 5 — Relativværkstedet

Coverage: `som`, `der`, `hvor`, `hvis`, `hvilket`, `hvad`.

Examples:

```text
Manden, der står der, er min lærer.
Bogen, som jeg læser, er lang.
Byen, hvor hun bor, ligger mod nord.
En person, hvis navn jeg har glemt.
```

Teach omission where natural:

```text
Bogen, jeg læser, er lang.
```

Accepted answers must include valid omission variants where the relative pronoun is optional.

#### Mode 6 — Der eller det?

Coverage:

```text
Det regner.
Der står en bil udenfor.
Det er svært at lære dansk.
Der er mange mennesker her.
```

Distinguish:

- weather and impersonal `det`
- extraposition with `det`
- existential `der`
- locative `der`
- presentational constructions
- `der` as relative subject

Do not present `der` and `det` as simple translations of "there" and "it".

#### Mode 7 — Sætningskæden

Advanced B2–C1 mode. Learners build sentences containing multiple clause types:

```text
Jeg tror, at den bog, som hun anbefalede, ikke længere kan købes.
```

Mechanics:

- Clause chunks rather than individual words
- Maximum five movable chunks
- Colour-coded clause boundaries
- Optional punctuation slots

This mode should prioritise readability and avoid long drag operations.

### 6.5 Sound recommendations

Sound identity: tactile blocks, magnets and mechanical locks.

**Select** — Soft tile click: 60–90 ms, frequency around 420 Hz.

**Move** — A short sliding noise generated from filtered white noise.

**Correct placement** — A magnetic snap: low click at 180 Hz, high click at 520 Hz, total 130 ms.

**Wrong placement** — Elastic bounce: descending sine wave, approximately 240 Hz to 150 Hz, 160 ms, low volume.

**Completed sentence** — A sequence of block locks from left to right. Maximum duration: 400 ms.

**Round complete** — A short machine-start chord followed by one clean bell. No motor loop or continuous mechanical ambience.

### 6.6 Data schemas

Adverb-placement item:

```js
{
  id: "ikke-ledsaetning-kommer",
  level: "A2",
  mode: "adverb_placement",
  clause_type: "subordinate",
  tokens: ["at", "han", "kommer", "ikke", "i dag"],
  movable_token: "ikke",
  accepted_orders: [
    ["at", "han", "ikke", "kommer", "i dag"]
  ],
  note: "I ledsætninger står ikke før det finitte verbum."
}
```

Transformation item:

```js
{
  id: "arbejder-ikke-fordi",
  level: "B1",
  mode: "main_to_subordinate",
  source: "Han arbejder ikke i dag.",
  frame: "Jeg ved, at ...",
  tiles: ["han", "arbejder", "ikke", "i dag"],
  accepted_orders: [
    ["han", "ikke", "arbejder", "i dag"]
  ],
  full_answer: "Jeg ved, at han ikke arbejder i dag.",
  note: "I at-ledsætningen står ikke før arbejder."
}
```

Indirect-question item:

```js
{
  id: "hvem-der-kommer",
  level: "B1",
  mode: "indirect_question",
  prompt: "Jeg ved ikke, ___ kommer.",
  tiles: ["hvem", "der", "hvem der", "kommer"],
  accepted_answers: ["hvem der"],
  note: "Som subjekt følges hvem normalt af der."
}
```

Relative-clause item:

```js
{
  id: "bogen-som-jeg-laeser",
  level: "B1",
  mode: "relative_clause",
  context: "Bogen er lang. Jeg læser bogen.",
  target_frame: "Bogen, ___, er lang.",
  accepted_answers: [
    "som jeg læser",
    "jeg læser"
  ],
  note: "Objektet som kan udelades i relativsætningen."
}
```

### 6.7 Dataset targets

| Mode | Target | Current (data.js, after US-051) |
|---|---|---|
| Adverb placement | 140 | 40 |
| Main-to-subordinate transformations | 160 | 10 |
| Direct questions | 140 | 10 |
| Indirect questions | 140 | 10 |
| Relative clauses | 180 | 10 |
| der/det | 160 | 9 |
| Complex clause chains | 100 | 10 |
| **Total** | **1,020** (target, unchanged) | **99** |

Some items may be generated from templates, but every generated sentence must be checked for naturalness.

### 6.8 QA rules

- Do not teach basic V2 as the main target.
- Distinguish finite and nonfinite verbs correctly.
- Verify subordinate-clause adverb positions.
- Accept optional relative-pronoun omission only where grammatical.
- Do not accept omission when the relative word is the subject.
- Ensure indirect questions do not retain direct-question inversion.
- Verify commas according to the configured comma convention.
- Keep sentence length appropriate to level.
- Avoid ambiguous `der/det` contexts.
- Every transformation must preserve meaning unless meaning change is the explicit task.

### 6.9 Definition of done

- Seven modes
- At least 900 verified items
- No ordinary V2 duplication
- Tile interaction works with touch and keyboard
- Accepted-order arrays cover valid alternatives
- TTS for source and target sentences
- 360 px support
- Dark mode
- Reduced motion
- Stable SRS
- Zero console errors through `file://`

---

## 7. Game Four — Tidsmaskinen ⏳

**Game ID:** `tidsmaskinen`
**Folder:** `/tidsmaskinen/`
**Levels:** A2–C1
**Primary domain:** Tense, aspect, modality, infinitive patterns, conditionals, imperatives and passive choice
**Primary skill:** Selecting grammatical constructions from context
**Priority:** Tier 1

### 7.1 Scope boundary

The current verb games already teach conjugation. Tidsmaskinen must not ask large numbers of isolated questions such as:

```text
Hvad er datid af spise?
```

Instead, it must ask:

```text
Which tense or construction expresses this situation?
```

Example:

```text
Jeg ___ i Danmark i tre år, og jeg bor her stadig.
```

Correct:

```text
har boet
```

The learner must understand the timeline.

### 7.2 Visual design

**Inspiration:** Chrono Trigger time gates with a clean timeline interface

Visual language:

- Horizontal timeline
- Past, present and future zones
- Small event cards
- Circular time gates
- Pixel-inspired but readable interface
- Calm deep-blue background
- Gold timeline markers
- Different colours for completed and ongoing actions

Recommended palette:

```text
Deep blue:      #17263B
Night blue:     #0D1725
Past amber:     #B67A3D
Present cyan:   #3C93A8
Future violet:  #7263A8
Ongoing green:  #4D8A68
Completed gold: #D2AA52
Wrong red:      #A74849
Text cream:     #EEE6D2
```

No copied characters, sprites, maps, gates or fonts. The style should communicate temporal movement, not nostalgia for its own sake.

### 7.3 Main visual mechanic

Each prompt displays a timeline.

Example:

```text
2023 ───────── NOW
      started     still true
```

Sentence:

```text
Jeg ___ i Aarhus siden 2023.
```

Options:

```text
bor
boede
har boet
havde boet
```

The correct answer activates the timeline segment that matches the meaning. Wrong answers show the correct timeline and one rule note.

### 7.4 Modes

#### Mode 1 — Nutid eller datid?

Coverage:

- current situations
- past completed situations
- habitual actions
- narrative sequences
- historical present where explicitly introduced
- present tense with scheduled future meaning

Items must contain time expressions or context.

#### Mode 2 — Datid eller perfektum?

Core contrast:

```text
Jeg boede i Odense fra 2019 til 2021.
Jeg har boet i Odense i tre år.
```

Coverage:

- completed past periods
- current relevance
- life experience
- unfinished time periods
- `siden`
- `i`
- `for ... siden`
- already/yet constructions
- recent events

Avoid presenting perfect versus preterite as a direct copy of English usage.

#### Mode 3 — Før fortiden

Pluskvamperfektum:

```text
Da vi kom, var filmen begyndt.
```

Mechanics:

- Arrange two past events on the timeline.
- Select which event receives pluskvamperfektum.
- Later rounds require constructing the full sentence.

#### Mode 4 — Fremtidsværkstedet

Coverage:

- present tense
- `skal`
- `vil`
- `kommer til at`
- intention
- arrangement
- prediction
- obligation
- willingness

Examples:

```text
Jeg rejser på fredag.
Jeg skal arbejde i morgen.
Det kommer til at regne.
Jeg vil gerne hjælpe.
```

The game must teach meaning differences rather than labelling all forms simply "future tense".

#### Mode 5 — Modalcentralen

Coverage: kan, kunne, må, måtte, skal, skulle, vil, ville, bør, burde.

Meaning categories:

- ability
- permission
- possibility
- obligation
- advice
- intention
- reported expectation
- politeness
- hypothetical meaning

Context is mandatory.

#### Mode 6 — Hvis-portalen

Conditionals:

```text
Hvis det regner, bliver vi hjemme.
Hvis jeg havde tid, ville jeg hjælpe.
Hvis hun havde ringet, var jeg kommet.
```

Coverage:

- real/open conditions
- hypothetical present
- counterfactual past
- polite hypothetical forms
- tense consistency

Higher-level items may accept more than one natural construction when meanings are equivalent.

#### Mode 7 — At eller ikke at?

Infinitive constructions:

- modal + infinitive without `at`
- `at` after lexical verbs
- `for at`
- `ved at`
- `til at`
- perception verbs
- causative `få`
- `lade`

Examples:

```text
Jeg kan svømme.
Jeg prøver at lære dansk.
Hun gik tidligt for at nå toget.
Man lærer ved at øve sig.
```

#### Mode 8 — Aktiv eller passiv?

Coverage:

- active voice
- `-s` passive
- `blive` passive
- `være` + participle as state
- impersonal passive
- `der` + passive where natural
- register and aspect differences

Examples:

```text
Døren åbnes kl. 8.
Døren bliver åbnet af vagten.
Døren er åbnet.
Der tales dansk her.
```

Do not state that `-s` passive and `blive` passive are always interchangeable.

#### Mode 9 — Kommandoværkstedet

Imperatives:

- regular imperative forms
- irregular high-frequency imperatives
- negative instructions
- polite command alternatives
- instructions with particles
- `lad være med at`

Examples:

```text
Kom her.
Tag jakken på.
Husk at ringe.
Lad være med at åbne døren.
```

This is a compact mode and should not become a separate game.

### 7.5 Sound recommendations

Sound identity: clocks, phase shifts and restrained synth tones.

**Select** — A very short clock-hand tick.

**Correct** — A phase-lock sound: low sine at 220 Hz, rising overtone to 440 Hz, soft bell at 660 Hz, 250 ms total.

**Wrong** — A muted clock reversal: descending tick pair, no alarm, 150 ms total.

**Timeline movement** — Subtle filtered sweep when an event card moves across time.

**Time gate** — Used only when changing modes or completing a boss round: soft stereo shimmer, 500–700 ms, disabled under reduced motion or sound-off.

**Round complete** — A four-note ascending arpeggio with a final clock tick.

No ticking loop during normal play. Continuous ticking creates unnecessary pressure.

### 7.6 Data schemas

Tense-choice item:

```js
{
  id: "har-boet-siden-2023",
  level: "B1",
  mode: "preterite_vs_perfect",
  context: "Hun flyttede til Aarhus i 2023 og bor der stadig.",
  sentence: "Hun ___ i Aarhus siden 2023.",
  options: ["boede", "har boet", "havde boet", "bor"],
  correct: "har boet",
  timeline: {
    start: "2023",
    end: "now",
    ongoing: true
  },
  note: "Perfektum forbinder begyndelsen med nutiden."
}
```

Future-choice item:

```js
{
  id: "toget-afgaar-i-morgen",
  level: "A2",
  mode: "future",
  context: "Afgangen står allerede i køreplanen.",
  sentence: "Toget ___ klokken otte i morgen.",
  accepted_answers: ["afgår"],
  distractors: ["vil afgå", "kommer til at afgå", "afgik"],
  note: "Planlagte fremtidige begivenheder kan stå i nutid."
}
```

Passive-choice item:

```js
{
  id: "doeren-aabnes-klokken-otte",
  level: "B2",
  mode: "passive",
  context: "Skiltet beskriver den faste procedure.",
  sentence: "Døren ___ klokken otte.",
  options: ["åbner", "åbnes", "bliver åbnet", "er åbnet"],
  correct: "åbnes",
  accepted_answers: ["åbnes"],
  note: "S-passiv passer til faste regler og procedurer."
}
```

Conditional item:

```js
{
  id: "havde-tid-ville-hjaelpe",
  level: "B2",
  mode: "conditional",
  context: "Jeg har ikke tid nu.",
  sentence: "Hvis jeg ___ tid, ___ jeg hjælpe.",
  slots: [
    { accepted_answers: ["havde"] },
    { accepted_answers: ["ville"] }
  ],
  note: "Hypotetiske nutidssituationer bruger datid og ville."
}
```

### 7.7 Dataset targets

| Mode | Target |
|---|---|
| Present versus preterite | 120 |
| Preterite versus perfect | 180 |
| Plusquamperfect | 100 |
| Future constructions | 140 |
| Modal verbs | 180 |
| Conditionals | 140 |
| Infinitive patterns | 140 |
| Passive constructions | 180 |
| Imperatives | 80 |
| **Total** | **1,260** |

### 7.8 QA rules

- Never test tense without sufficient temporal context.
- Do not map Danish tense use mechanically to English tense use.
- Distinguish ongoing state from completed period.
- Check all `siden`, `i` and `for ... siden` items.
- Verify modal meaning from the complete situation.
- Accept equivalent future constructions only when meaning and register remain appropriate.
- Distinguish passive event from resulting state.
- Check whether an `-s` passive sounds natural with the selected verb.
- Verify imperative forms manually.
- Keep conditionals semantically coherent.
- Do not teach one rigid "first/second/third conditional" system as if Danish followed an English textbook model exactly.

### 7.9 Definition of done

- Nine modes
- At least 1,100 verified contextual items
- No isolated conjugation-drill mode
- Timeline visuals work on mobile
- TTS for contexts and sentences
- Multiple accepted answers where required
- 360 px support
- Dark mode
- Reduced motion
- Træning mode
- Stable SRS
- Zero console errors through `file://`

---

## 8. Game Five — Skrivekontrollen ✍️

**Game ID:** `skrivekontrollen`
**Folder:** `/skrivekontrollen/`
**Levels:** B1–C1
**Primary domain:** Written grammar, punctuation, sentence boundaries and grammatical editing
**Primary skill:** Finding and correcting grammar problems in connected writing
**Priority:** Tier 2

### 8.1 Scope boundary

Skrivekontrollen is not:

- A spelling-only game
- A proofreading tool for arbitrary user documents
- A connector cloze game
- A vocabulary quiz
- A free-form essay evaluator
- A replacement for formal language instruction

The game uses carefully controlled sentences and short texts with known correction targets.

### 8.2 Visual design

**Inspiration:** Return of the Obra Dinn combined with a traditional proofreader's desk

Visual language:

- High-contrast monochrome documents
- Red proofreader marks
- Typewritten text
- Margin notes
- Document folders
- Magnifying glass cursor
- Sentence evidence panel
- Page-turn transitions

Recommended palette:

```text
Paper:          #E8E0C8
Ink:            #23231F
Dark paper:     #24251F
Dark ink:       #EAE3CF
Proof red:      #A13D3D
Correct green:  #47745A
Margin blue:    #4F7183
Highlight gold: #B69245
```

The interface may use a limited one-bit or dithered texture, but body text must remain easy to read. Do not imitate the original game's exact rendering, typography or interface composition.

### 8.3 Main visual mechanic

The learner receives a short document with one or more marked grammar issues.

Example:

```text
Jeg tror han kommer ikke i dag fordi han er syg.
```

The learner corrects:

- missing clause comma
- subordinate-clause word order
- second missing clause comma

Corrected:

```text
Jeg tror, at han ikke kommer i dag, fordi han er syg.
```

For early levels, the learner chooses between correction cards. For later levels, the learner edits only the highlighted span.

### 8.4 Modes

#### Mode 1 — Find fejlen

One sentence contains exactly one grammatical error.

Possible targets:

- agreement
- pronoun
- article
- tense
- clause word order
- infinitive marker
- passive form
- quantifier
- punctuation

Mechanics:

- Tap the incorrect span.
- Choose or type the correction.
- Maximum two interactions.

#### Mode 2 — Kommakontrollen

Coverage:

- clause boundaries
- subordinate clauses
- relative clauses
- parenthetical elements
- lists
- direct speech
- introductory expressions where required

The game must support a clear comma configuration.

Recommended options:

```text
Startkomma
Intet startkomma
```

The selected system must be remembered. The game must never mark both valid comma systems as wrong when the user's chosen setting permits them.

#### Mode 3 — Sætningsgrænser

Coverage:

- run-on sentences
- comma splices
- fragments
- missing finite verbs
- accidental sentence splitting
- overlong clause chains
- coordination versus subordination

Example:

```text
Jeg kom for sent, bussen var forsinket.
```

Possible correction:

```text
Jeg kom for sent, fordi bussen var forsinket.
```

Other valid corrections may exist. Use constrained correction options unless every acceptable answer can be listed.

#### Mode 4 — Hold tiden

Tense consistency across a short text.

Example:

```text
I går går jeg til stationen og tog toget.
```

The learner identifies and corrects the inconsistent form. This mode reinforces Tidsmaskinen but shifts the target from one situation to connected writing.

#### Mode 5 — Henvisningskontrollen

Reference consistency across sentences:

- pronouns
- repeated nouns
- `den/det/de`
- `sin/hans/hendes`
- demonstratives
- unclear antecedents

Example:

```text
Maria talte med Sofie, da hun kom hjem.
```

Some items should ask the learner to identify ambiguity rather than pretending one pronoun has a uniquely correct interpretation.

#### Mode 6 — Redigér teksten

Short paragraphs containing two or three controlled problems.

Text length:

| Level | Length |
|---|---|
| B1 | 35–60 words |
| B2 | 60–100 words |
| C1 | 90–150 words |

Contexts:

- email to a school
- message to a landlord
- workplace update
- complaint
- application paragraph
- municipal communication
- short opinion paragraph
- event description

Do not reproduce official exam content.

#### Mode 7 — Registereftersyn

Grammar and formality choices:

- spoken fragments
- overly informal ellipsis
- `du/De`
- contractions or chat-style writing
- formal noun phrases
- polite modal constructions
- consistent address forms

This is a grammar-and-register mode, not a general style grader.

### 8.5 Sound recommendations

Sound identity: pencil, paper, typewriter and proof stamps.

**Select** — Short pencil tap.

**Correct** — A clean proof stamp with a quiet upward click.

WebAudio sequence:

```text
160 Hz impact
480 Hz confirmation
620 Hz light finish
Total: 230 ms
```

**Wrong** — A soft pencil erase or dry brush sound. Avoid harsh typewriter bells.

**Text correction** — One typewriter key sound per completed correction, not per typed character.

**Page complete** — Paper turn followed by one restrained bell.

**Round complete** — Three typewriter keys forming a rhythm, then a proof stamp. No continuous office ambience.

### 8.6 Data schemas

Single-error sentence:

```js
{
  id: "ledsaetning-ikke-kommer",
  level: "B1",
  mode: "find_error",
  original: "Jeg tror, at han kommer ikke i dag.",
  error_spans: [
    {
      start_token: 4,
      end_token: 5,
      original: "kommer ikke",
      accepted_replacements: ["ikke kommer"]
    }
  ],
  corrected: "Jeg tror, at han ikke kommer i dag.",
  note: "I ledsætninger står ikke før det finitte verbum."
}
```

Comma item:

```js
{
  id: "komma-at-ledsaetning-01",
  level: "B1",
  mode: "comma",
  text_without_commas: "Jeg tror at hun kommer i morgen",
  accepted: {
    start_comma: [
      "Jeg tror, at hun kommer i morgen."
    ],
    no_start_comma: [
      "Jeg tror at hun kommer i morgen."
    ]
  },
  note: "Kommaet følger den valgte kommapraksis."
}
```

Short editing text:

```js
{
  id: "mail-til-udlejer-b2-01",
  level: "B2",
  mode: "edit_text",
  context: "Mail til en udlejer",
  original: "Jeg skriver fordi radiatoren virker ikke. Jeg har ringet i går men ingen svare.",
  issues: [
    {
      type: "word_order",
      target: "radiatoren virker ikke",
      accepted_replacements: ["radiatoren ikke virker"]
    },
    {
      type: "tense",
      target: "har ringet i går",
      accepted_replacements: ["ringede i går"]
    },
    {
      type: "agreement",
      target: "ingen svare",
      accepted_replacements: ["ingen svarer", "ingen svarede"]
    }
  ],
  note: "Ret ordstilling, tid og verbalform i sammenhæng."
}
```

### 8.7 Dataset targets

| Dataset | Target |
|---|---|
| Single-error sentences | 300 |
| Comma items | 250 |
| Sentence-boundary items | 160 |
| Tense-consistency items | 120 |
| Reference-consistency items | 140 |
| Short editing texts | 100 |
| Register items | 120 |
| **Total** | **1,190** |

### 8.8 QA rules

- Every sentence must have a documented target error.
- Do not include accidental second errors.
- List all reasonable accepted corrections.
- Prefer constrained editing when many rewrites are possible.
- Do not mark stylistic preferences as grammatical errors.
- Distinguish ambiguity from ungrammaticality.
- Support the learner's selected comma convention consistently.
- Verify punctuation with contemporary Danish guidance.
- Do not penalise optional final punctuation in short-answer fields.
- Keep formal-writing examples natural rather than bureaucratically exaggerated.
- Do not use leaked or copied exam prompts.
- C1 items may include nuance, but notes must remain clear.

### 8.9 Definition of done

- Seven modes
- At least 1,000 verified items
- Both comma configurations tested
- No sentence contains unintended errors
- Corrections support accepted alternatives
- Text editing works without horizontal scrolling
- Full keyboard support
- 360 px layout
- Dark mode
- Reduced motion
- TTS for Danish examples where useful
- Stable SRS
- Zero console errors through `file://`

---

## 9. Cross-Game Curriculum

The games should form a progressive grammar path rather than five isolated products.

### 9.1 Recommended order

**A1–A2**

1. Bøjningsværkstedet — noun forms, adjective agreement, articles
2. Pronomenmysteriet — subject/object, possessives
3. Tidsmaskinen — present and preterite, basic modal verbs, imperatives

**B1**

1. Bøjningsværkstedet — definiteness, comparison, quantifiers
2. Pronomenmysteriet — reflexive possession, indefinite pronouns
3. Sætningsmaskinen — subordinate clauses, questions, `der/det`
4. Tidsmaskinen — perfect versus preterite, future constructions, infinitive patterns
5. Skrivekontrollen — single-error editing, clause commas

**B2**

1. Sætningsmaskinen — indirect questions, relative clauses, clause chains
2. Tidsmaskinen — conditionals, passive distinction, modal nuance
3. Skrivekontrollen — connected-text editing, reference consistency, register

**C1**

1. Sætningsmaskinen — embedded clause chains, complex relative constructions
2. Tidsmaskinen — nuanced modality, passive register, counterfactual constructions
3. Skrivekontrollen — complex punctuation, ambiguity, formal grammatical editing

### 9.2 Cross-game links

When the learner repeatedly misses an item, the end-of-round screen may show one related game chip.

Examples:

```text
Problemer med sin/sit/sine?
→ Pronomenmysteriet
```

```text
Problemer med ikke i ledsætninger?
→ Sætningsmaskinen
```

Only show one recommendation. Do not interrupt the active round.

---

## 10. Shared SRS Requirements

Every game must record performance by stable item or grammar-pattern key.

Recommended key structure:

```text
<game-id>:<mode>:<item-id>
```

Examples:

```text
boejningsvaerkstedet:noun-form:bog-bestemt-flertal
pronomenmysteriet:reflexive:peter-sin-kone-own
saetningsmaskinen:indirect-question:hvem-der-kommer
tidsmaskinen:perfect:har-boet-siden-2023
skrivekontrollen:word-order:ledsaetning-ikke-kommer
```

For generated items, also record a pattern key:

```text
pattern:noun:definite-plural:umlaut-er
pattern:clause:subordinate:ikke-before-finite
pattern:tense:perfect:ongoing-since
```

This allows the review system to identify a grammar weakness even when the exact sentence changes.

### 10.1 Review behaviour

- Correct answer advances the SRS box.
- Wrong answer returns the pattern to an earlier box.
- A hint-assisted answer should count as partially correct or remain in the current box.
- Timed expiration should not receive a stronger penalty than a normal miss.
- Repeated identical items should be avoided within one round.
- Review should mix exact missed items with new items using the same grammatical pattern.

---

## 11. Shared Feedback Rules

### 11.1 Correct feedback

Correct answers receive: animation, sound, automatic advance.

No text such as:

```text
Godt gået!
Fantastisk!
Korrekt!
Du er dygtig!
```

### 11.2 Wrong feedback

Wrong feedback contains:

1. Correct answer
2. One grammar note
3. TTS replay when relevant

Example:

```text
det store hus

Efter det får adjektivet -e.
```

Do not add:

- encouragement
- multiple rule paragraphs
- unrelated examples
- score commentary
- jokes

### 11.3 Note quality

Good note:

```text
I ledsætninger står ikke før det finitte verbum.
```

Weak note:

```text
Husk reglen om ordstilling.
```

Bad note:

```text
Det var desværre forkert, men du er tæt på!
```

---

## 12. Sound Design Matrix

| Game | Selection | Correct | Wrong | Special event | Round complete |
|---|---|---|---|---|---|
| Bøjningsværkstedet | Wooden tick | Press click + brass ping | Misaligned wooden knock | Finished phrase enters press | Mechanical clicks + warm chord |
| Pronomenmysteriet | Evidence card placement | Gavel tap + two-note resolution | Pencil strike-through | Limited contradiction impact | Three gavel taps |
| Sætningsmaskinen | Tile click | Magnetic snap | Elastic bounce | Clause machine locks | Machine chord + bell |
| Tidsmaskinen | Clock-hand tick | Phase-lock arpeggio | Clock reversal | Time-gate shimmer | Four-note rise + tick |
| Skrivekontrollen | Pencil tap | Proof stamp | Soft eraser | Page correction complete | Typewriter rhythm + stamp |

### 12.1 Sound implementation recommendations

Use oscillator and noise nodes:

```js
const ctx = new AudioContext();
const osc = ctx.createOscillator();
const gain = ctx.createGain();
```

Each game should expose sound functions through a small configuration object rather than duplicating audio-engine code.

Example:

```js
const SOUND_THEME = {
  correct() {
    DanskCore.ui.sound.sequence([
      { type: "sine", frequency: 220, duration: 0.08, gain: 0.05 },
      { type: "sine", frequency: 330, duration: 0.08, gain: 0.06 },
      { type: "triangle", frequency: 494, duration: 0.12, gain: 0.05 }
    ]);
  }
};
```

Do not initialise AudioContext until the first user interaction.

---

## 13. Animation Recommendations

### 13.1 General timing

```text
Tap response:        under 100 ms
Correct animation:   250–600 ms
Wrong bounce:        150–300 ms
Auto-advance delay:  approximately 800 ms
Round transition:    under 1,200 ms
```

### 13.2 Reduced motion

Under `prefers-reduced-motion: reduce`:

- Remove screen shake.
- Remove parallax.
- Replace sliding with opacity changes.
- Replace bouncing with colour and outline changes.
- Keep functional state transitions.
- Keep sound independently configurable.

### 13.3 Game-specific motion

**Bøjningsværkstedet**

- Phrase pieces slide a short distance into press slots.
- Correct phrase receives one compact press motion.
- No large conveyor animation.

**Pronomenmysteriet**

- Evidence card moves into the case file.
- Contradiction burst appears only for special rounds.
- Dialogue text should appear immediately after the first case.

**Sætningsmaskinen**

- Tiles wobble no more than two pixels.
- Correct tiles snap into place.
- Wrong tiles return directly to origin.

**Tidsmaskinen**

- Event markers slide along a timeline.
- Background remains static.
- Never shake the sentence text.

**Skrivekontrollen**

- Red proof mark draws in 150–250 ms.
- Corrected text crossfades.
- Avoid simulated typing for full paragraphs.

---

## 14. Dataset Production Process

### 14.1 Production stages

Every dataset must pass:

1. Structural validation
2. Duplicate detection
3. Danish-language review
4. Grammar review
5. Ambiguity review
6. Level review
7. Interface rendering test
8. TTS test
9. Accepted-answer test
10. Final random sample review

### 14.2 Structural validation

Validate:

- unique IDs
- allowed levels
- mandatory notes
- valid answer fields
- nonempty prompts
- no missing shared-data references
- valid accepted-answer arrays
- no duplicate options
- correct answer included in options
- no unsupported mode names

### 14.3 Duplicate detection

Detect duplicates after normalization:

- lowercase
- punctuation removed
- whitespace normalized
- repeated context ignored where appropriate

Flag:

- identical sentences with different IDs
- identical answer sets
- near-identical contexts
- mirrored pronoun items that do not add a new contrast

### 14.4 Level validation

**A1** — short concrete sentences, one grammatical decision, common vocabulary, maximum approximately 10 words per target sentence.

**A2** — simple context, one or two clauses, familiar daily situations.

**B1** — subordinate clauses, tense contrasts, contextual pronouns, moderate sentence length.

**B2** — multiple grammatical cues, register and aspect distinctions, relative clauses, hypothetical language.

**C1** — complex clause relationships, nuanced modality, text-level correction, ambiguity and stylistic grammar distinctions.

A C1 label must reflect grammatical complexity, not rare vocabulary alone.

---

## 15. Test Requirements

### 15.1 Automated tests

Each game should include or support tests for:

- dataset loading
- unique IDs
- valid answer inclusion
- accepted-answer normalization
- SRS write and read
- level filtering
- empty pools
- exhausted pools
- reset confirmation
- sound-off state
- dark-mode persistence
- keyboard selection
- Enter submission
- TTS failure fallback

### 15.2 Manual viewport tests

Test at:

```text
360 × 640
390 × 844
768 × 1024
1366 × 768
```

Check:

- no horizontal overflow
- no clipped option text
- keyboard does not cover active input
- modal overlays fit
- long Danish words wrap safely
- tiles remain readable
- TTS button remains accessible

### 15.3 File protocol tests

Open each game directly:

```text
file:///.../<game-id>/index.html
```

Confirm:

- scripts load
- local data loads
- no CORS dependency
- no runtime request
- progress writes where available
- graceful fallback where storage is blocked

---

## 16. Registration

Add each game to the shared game registry.

```js
window.GAMES = [
  {
    id: "boejningsvaerkstedet",
    title: "Bøjningsværkstedet",
    emoji: "🛠️",
    path: "./boejningsvaerkstedet/",
    category: "grammatik",
    skills: ["substantiver", "adjektiver", "bestemthed", "kvantorer"],
    levels: ["A1", "A2", "B1", "B2"],
    status: "planned"
  },
  {
    id: "pronomenmysteriet",
    title: "Pronomenmysteriet",
    emoji: "🕵️",
    path: "./pronomenmysteriet/",
    category: "grammatik",
    skills: ["pronominer", "sin-sit-sine", "henvisning"],
    levels: ["A2", "B1", "B2"],
    status: "planned"
  },
  {
    id: "saetningsmaskinen",
    title: "Sætningsmaskinen",
    emoji: "⚙️",
    path: "./saetningsmaskinen/",
    category: "grammatik",
    skills: ["ledsaetninger", "spoergsmaal", "relativsaetninger", "der-det"],
    levels: ["A2", "B1", "B2", "C1"],
    status: "planned"
  },
  {
    id: "tidsmaskinen",
    title: "Tidsmaskinen",
    emoji: "⏳",
    path: "./tidsmaskinen/",
    category: "grammatik",
    skills: ["tempus", "modalverber", "passiv", "betingelser"],
    levels: ["A2", "B1", "B2", "C1"],
    status: "planned"
  },
  {
    id: "skrivekontrollen",
    title: "Skrivekontrollen",
    emoji: "✍️",
    path: "./skrivekontrollen/",
    category: "skriftlig-grammatik",
    skills: ["komma", "redigering", "saetningsgraenser", "henvisning"],
    levels: ["B1", "B2", "C1"],
    status: "planned"
  }
];
```

---

## 17. Build Order

**Phase 1 — Shared foundations**

1. Validate or complete `DanskCore`.
2. Add reusable tile-construction engine.
3. Add reusable accepted-answer engine.
4. Add pattern-level SRS keys.
5. Create canonical noun, adjective and verb datasets.
6. Add sound-theme configuration support.

**Phase 2 — Core morphology: Bøjningsværkstedet first.**

- Covers the largest A1–A2 grammar gap.
- Creates canonical noun and adjective data.
- Shared phrase data supports later games.
- Provides reusable tile and free-text mechanics.

**Phase 3 — Reference grammar: Pronomenmysteriet.**

- Large gap in the current inventory.
- Requires careful curated contexts.
- Creates reusable pronoun and reference datasets.

**Phase 4 — Clause grammar: Sætningsmaskinen.**

- Extends rather than replaces Ordstillingsdetektiven.
- Covers subordinate-clause word order.
- Provides question and relative-clause construction.
- Creates a reusable clause-transformation engine.

**Phase 5 — Verb usage: Tidsmaskinen.**

- Uses existing verified verb forms.
- Adds usage distinctions not covered by conjugation games.
- Requires strong contextual datasets.
- Can reuse clause patterns from Sætningsmaskinen.

**Phase 6 — Written integration: Skrivekontrollen last.**

- Integrates grammar from every previous game.
- Depends on stable correction and accepted-answer logic.
- Benefits from verified examples produced for the other games.

---

## 18. Final Coverage After Completion

| Grammar domain | Existing game | New coverage |
|---|---|---|
| Noun gender | En/Et-træner | Used as a feature in Bøjningsværkstedet |
| Noun plural | Missing | Bøjningsværkstedet |
| Definiteness | Missing | Bøjningsværkstedet |
| Adjective agreement | Missing | Bøjningsværkstedet |
| Comparison | Partially missing | Bøjningsværkstedet |
| Quantifiers | Missing | Bøjningsværkstedet |
| Verb conjugation | Verb-glosekort, Magiske Verber | No duplicate |
| Tense usage | Missing | Tidsmaskinen |
| Modal meaning | Missing | Tidsmaskinen |
| Infinitive constructions | Missing | Tidsmaskinen |
| Conditionals | Missing | Tidsmaskinen |
| Imperatives | Missing | Tidsmaskinen |
| Passive contrast | Missing | Tidsmaskinen |
| Prepositions | Præpositions-Mester | No duplicate |
| Conjunctions | Konjunktion Crush | No duplicate |
| Connectors | Gitterprotokol | No duplicate |
| Basic V2 | Ordstillingsdetektiven | No duplicate |
| Subordinate-clause order | Incomplete | Sætningsmaskinen |
| Questions | Missing | Sætningsmaskinen |
| Indirect questions | Missing | Sætningsmaskinen |
| Relative clauses | Missing | Sætningsmaskinen |
| der/det | Missing | Sætningsmaskinen |
| Personal pronouns | Missing | Pronomenmysteriet |
| Possessive pronouns | Missing | Pronomenmysteriet |
| Reflexive possessives | Missing | Pronomenmysteriet |
| Indefinite pronouns | Missing | Pronomenmysteriet |
| Adverbs | In-flight game | No duplicate |
| Written comma grammar | Missing | Skrivekontrollen |
| Sentence boundaries | Missing | Skrivekontrollen |
| Text-level correction | Missing | Skrivekontrollen |
| Reference consistency | Missing | Skrivekontrollen |
| Formal grammatical register | Missing | Skrivekontrollen |

---

## 19. Overall Definition of Done

The missing-games project is complete when:

- All five games are registered.
- All five work through `file://`.
- No game duplicates an existing game's primary mechanic and domain.
- All games support 360 px mobile layouts.
- All games support keyboard operation.
- All games support dark mode.
- All games support reduced motion.
- All games support sound mute.
- All Danish prompts have TTS where useful.
- Every wrong answer displays one actionable grammar note.
- Every free-text answer supports valid alternatives.
- All datasets use stable IDs.
- All datasets pass duplicate and ambiguity checks.
- Shared forms are canonical.
- Progress survives reload.
- Reset requires confirmation.
- Empty review states are handled.
- Timed modes include Træning.
- No game loads external runtime resources.
- No game produces console errors.
- Grammar data has completed a dedicated Danish QA review.
