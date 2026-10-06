# QA Report 1: Danish Language and Pedagogy

**Project:** Sjovt Dansk (`danske_spiller`). **Date:** 2026-10-04. **Reviewer:** QA Agent 1, Danish language and pedagogy.
**Type:** Read-only. No production file was changed. Throwaway extraction and boot scripts were run from the session scratchpad (`scratchpad/qa-language/`) only.

> The reviewer is not a native speaker. Anything that depends on native judgement or on Retskrivningsordbogen (RO) double forms is marked **UNCONFIRMED**. A native-speaker pass is still needed before the Critical and Major content fixes are signed off.

---

## 1. Scope and method

- **Context read first:** `CLAUDE.md`, `specs.md`, `prd.md` (UI-language and feedback rules), and `.claude/skills/danish-grammar-qa/SKILL.md`. The skill's universal tests (one defensible answer, no accidental second error, accurate Danish note, natural Danish, complete accepted answers) and its per-game rules were applied.
- **Structural check:** `node shared/validate.js` reports 0 errors and 0 warnings for all 5 shared datasets. That check covers structure only, not meaning.
- **Datasets embedded in HTML:** extracted with read-only node scripts, then read item by item.
- **Generated data:** `boejningsvaerkstedet/data.js` builds its items at load time. It was booted in node with a fake `window` after loading `shared/data/*.js`, and every generated item was dumped and checked by rule.
- **Programmatic scans:**
  - duplicate and near-duplicate items
  - correct answer missing from options
  - a distractor equal to an accepted answer
  - suspect verb forms: wrong auxiliary, -ede on strong verbs, adverb placement
  - non-standard `-erene` plurals
  - placeholder strings: `Test sentence`, `opt1`, `opt2`, `TODO`, `placeholder`, `dummy`, `example`, `lorem`, `FIXME`
- **Parallel review:** the review was split across five reviewers working at the same time. Every Critical finding, and a sample of the Major findings, was then re-checked by hand against the source line quoted. Re-checked findings are marked ✔ in the Evidence field.

**Severity scale**

| Severity | Meaning |
|---|---|
| Critical | Seriously wrong teaching content: a marked-correct answer that is wrong, a systematically wrong rule, or a mode that cannot be used |
| Major | A repeated language issue, a wrong answer key, an ambiguous item (two correct answers), or a misleading explanation |
| Minor | Small wording, naturalness, or an RO variant |

## 2. Coverage

| Game / file | Reviewed | Items covered | Notes |
|---|---|---|---|
| Portal `index.html` | Fully | All text, 14 game cards | |
| `adverbs.html` | Fully | 10/10 entries, 7 modes, all UI | Dataset is a 10-item sample (LANG-017) |
| `magiske_verber.html` | Fully | 54 verbs, 78 templates, all generators and UI | |
| `idiomjaeger.html` | Fully | 171/171 idioms, all builders and UI | |
| `dansk-praepositioner.html` | Fully | 535/535 generated items, 40 translation pairs, all UI | |
| `danish-antonyms-game.html` (+ `danish_antonyms.csv`) | Fully | 336/336 pairs | The CSV is not loaded by the game. It matches the game except row 102 |
| `boejningsvaerkstedet/` (index + data.js, generated) | Fully, by rule, plus samples | M1 1300 (all, by script); M2 570 (all 38 combos plus sample); M3 746 (all note patterns plus about 40 items); M4 186/186; M5 250/250; M6 221/221 | |
| `danish_flashcards/.../index.html` + `script.js` | Fully | 150/150 cards, all UI | |
| `danske-phraser/dansk-mester.html` | Fully | 150/150 items | |
| `en og et/index.html` | Fully | 229 nouns, 36 sentences, 100 antonym and 100 synonym pairs, all UI | |
| `forbindenor/Forbindenor.html` | Fully | 359/359 items | |
| `konjunktioner/konjunktioner.html` | Fully | 300/300 items, 31 rules | |
| `ordstilling-detektiv/index.html` | Fully | 12 cases, 304 sentences, tips and stories | |
| `pronomenmysteriet/` (index + data.js) | Fully | 760/760 items; **all 760 are placeholders** | UI text reviewed |
| `tidsmaskinen/` (index + data.js) | Fully | 1260/1260 items across 9 modes | |
| `saetningsmaskinen/data.js` | Fully | 100 hand-written items plus 920 cloned items | **No `index.html` exists.** No page loads `SAETNINGS_DATA` and the portal does not link it. Content is inert |
| `pixel-animation.html` | Fully | 3 visible strings | |
| `shared/data/nouns.js` | Fully | 325/325 | |
| `shared/data/adjectives.js` | Fully | 220/220 | |
| `shared/data/verbs.js` | Fully | 201/201 | **No game uses `DANSK_VERBS`**, so its errors are latent |
| `shared/data/pronouns.js` | Fully | 34/34 | |
| `shared/data/clause-patterns.js` | Fully | 87/87 | |
| `shared/explainer/scenes/*.scene.js` | Fully | 18/18 scenes | |

**Coverage summary:** every in-scope game and file was reviewed. Large datasets were read in full, except Bøjningsværkstedet Modes 1–3. Those were checked exhaustively by rule script, with a manual sample on top.

---

## 3. Findings

Format for each finding: **Game/Page → Exact text → Problem → Suggested correct version → Severity → Evidence**.

### Pronomenmysteriet

**LANG-001: The whole dataset is placeholder test content**
- **Game/Page:** `pronomenmysteriet/data.js`, all 6 modes
- **Exact text:** `"sentence_da": "Test sentence 0."`, `"options": ["opt1","opt2"]`, `"correct": "opt1"`, `"note": "Test note."`
- **Problem:** all 760 items (120 / 120 / 180 / 100 / 140 / 100 per mode) are generated stubs. They contain no Danish and no pronoun choice, so the game cannot be used. The levels are also outside the spec: 380 items are tagged A1, while the spec says A2–B2.
- **Suggested correct version:** author real items to the `specs.md` / `improvement/specs.md` §5 rules. Mode 3 needs a uniquely defensible sin/hans context. Until then, hide the game from the portal.
- **Severity:** **Critical**
- **Evidence:** `pronomenmysteriet/data.js:8-13` through `:10785` ✔ (`grep -c "Test sentence"` = 760, equal to the 760 ids).

### Tidsmaskinen

**LANG-002: Generator places sentence adverbs after the participle**
- **Game/Page:** Tidsmaskinen, modes `pluperfect` (14 items) and `preterite_vs_perfect` (9 items)
- **Exact text:** "Jeg ___ allerede hjem" with key "var gået" gives "Jeg var gået allerede hjem". Other examples: "Han havde fået allerede visum", "Chefen havde aflyst allerede mødet", "Vi har haft allerede tre møder", "Holdet har vundet hidtil alle kampe".
- **Problem:** with a two-word answer (auxiliary + participle), the adverb (allerede / for længst / hidtil) ends up between the participle and the object. The completed "correct" sentence therefore has wrong word order. The generated ids show the template produced this (`jeg-var-gaaet-allerede-hjem…`).
- **Suggested correct version:** "Jeg var allerede gået hjem" / "Han havde allerede fået visum". Either blank both verb parts around the adverb, or use a one-word slot.
- **Severity:** **Critical** (systematic, about 8% of pluperfect)
- **Evidence:** `tidsmaskinen/data.js:6244-6248` ✔
  - pluperfect: 6248, 6340, 6363, 6386, 6432, 6455, 6478, 6524, 6547, 6570, 6616, 6639, 6709, 6732
  - perfect: 4248, 4455, 4502, 4548, 4571, 4594, 4617, 4686, 4756

**LANG-003: "stå op" is missing "op" in the marked-correct sentence**
- **Exact text:** "I morges ___ jeg tidligt og tog toget…" (key "stod") and "Nu for tiden ___ jeg ofte tidligt…" (key "står")
- **Problem:** "stod jeg tidligt" means "stood early". The particle "op" is missing.
- **Suggested correct version:** "I morges stod jeg tidligt op…" / "…står jeg ofte tidligt op…"
- **Severity:** Major
- **Evidence:** `tidsmaskinen/data.js:559`, `:1205` ✔

**LANG-004: Contexts break the game's own siden / for … siden rules**
- **Exact text:**
  - "Børnene sov siden kl. 20.", "Det regnede siden kl. 20.", "De dansede siden kl. 19.", "Vi læste siden kl. 9." (pluperfect contexts)
  - "Det er sket for mange år siden." (passive)
- **Problem:** "siden" + simple past contradicts the preterite_vs_perfect note, which says siden takes perfect. Perfect tense + "for … siden" is also non-standard.
- **Suggested correct version:**
  - "Børnene havde sovet siden kl. 20" (or "sov fra kl. 20")
  - "Det skete for mange år siden."
- **Severity:** Major
- **Evidence:** `tidsmaskinen/data.js:6846, 6893, 6986, 7009, 20905`

**LANG-005: Hearsay skal/skulle has two correct answers and a misleading note**
- **Exact text:** "Han ___ være født i Norge, ifølge avisen." (key "skulle"); "Hun ___ angiveligt have set et spøgelse i huset." The note says "Skulle kan referere til noget, man har hørt om fortiden".
- **Problem:** "skal være født" / "skal angiveligt have set" are standard hearsay forms. The note implies that a past event requires "skulle".
- **Suggested correct version:** add a past-report frame ("sagde man dengang"), as the existing "sagde man" item does. Reword the note: "skal/skulle + infinitiv = noget man har hørt; skulle når udsagnet blev fremsat i fortiden."
- **Severity:** Major (UNCONFIRMED for nuance)
- **Evidence:** `tidsmaskinen/data.js:13528, 13566`; note at 13539/13558/13577

**LANG-006: The imperative note calls regular imperatives "uregelmæssige"**
- **Exact text:** "Nogle ofte brugte verber har uregelmæssige imperativer: vær, gør, bliv, sig, giv, kom, tag."
- **Problem:** all of these are formed regularly (infinitive minus -e; *kom* only simplifies the double consonant). The note teaches a false rule on 12 items.
- **Suggested correct version:** "Bydeform = navnemåde uden -e; dobbeltkonsonant forenkles (komme → kom)."
- **Severity:** Major
- **Evidence:** `tidsmaskinen/data.js:23104` ✔, 23230, 23248, plus 9 more items with the same note

**LANG-007: "kommer til at" for visible imminence carries English "going to" over into Danish**
- **Exact text:** "Pas på! Barnet kommer til at falde", "Se på himlen! Det kommer til at regne". The note says "Kommer til at bruges, når der er tegn på, at noget snart vil ske."
- **Problem:** a native speaker would say "er ved at falde" or "Det begynder snart at regne". The note maps the English "going to" category onto Danish, which the skill rules forbid.
- **Suggested correct version:** reword the note, or replace the items with "er ved at" / present tense.
- **Severity:** Major (UNCONFIRMED)
- **Evidence:** `tidsmaskinen/data.js:9577, 9586, 9646, 9656, 9744, 9820, 9888`

**LANG-008: Ambiguous key with stative "vide"**
- **Exact text:** "Vi ___ det for længst, da du fortalte det." (key "havde vidst")
- **Problem:** "Det vidste vi for længst" (the distractor) is at least as natural.
- **Suggested correct version:** replace with a dynamic verb, or accept both.
- **Severity:** Major
- **Evidence:** `tidsmaskinen/data.js:6592-6593`

**LANG-009: Ungrammatical distractors from a fixed auxiliary template (about 17 items)**
- **Exact text:** "har/havde flyttet", "har vokset", "forberedede", "ville have forsvundet", "er boet", "er cyklet", "er regnet", "blev fået", "er fået"
- **Problem:** these are wrong on purpose, but they show learners forms that do not exist. "forberedede" also appears in verbs.js (LANG-027).
- **Suggested correct version:** draw distractors from real alternative constructions (for example the other tense), not from invented forms.
- **Severity:** Minor
- **Evidence:** `tidsmaskinen/data.js:3106, 3425, 5555, 9095, 9291, 6156, 7152, 7322, 15026, 15470, 15209, 15390, 22163-4, 22950-1`

**LANG-010: Gender and countability errors in contexts**
- **Exact text:** "Hun fik en 12-tal"; "en billetsalg"; "Alle bagagerne"
- **Suggested correct version:** "et 12-tal"; "et billetsalg"; "Al bagagen"
- **Severity:** Minor
- **Evidence:** `tidsmaskinen/data.js:12216, 20383, 21086`

**LANG-011: Calques and unnatural phrasing**
- **Exact text:**
  - "til Island indtil nu"
  - "Vi har aldrig haft en kat indtil nu" (×10)
  - "Jeg spørger, om du nogensinde ___ sushi" (×7)
  - "missede"
  - "Lad være nu med at skrige"
  - "Vi har haft hele ugen travlt"
  - "Den gang"
  - "Julen 2022 var vi"
  - "I sommeren fandt hun"
- **Suggested correct version:**
  - "på Island"
  - "endnu aldrig…"
  - a direct question
  - "gik glip af / nåede ikke"
  - "Lad nu være med…"
  - "travlt hele ugen"
  - "Dengang"
  - "I julen 2022"
  - "Om sommeren / I sommer"
- **Severity:** Minor
- **Evidence:** `tidsmaskinen/data.js:3787, 3810, 12451, 12545, 24372, 4920, 1342, 3377, 7078`

**LANG-012: Context and sentence disagree; minor note issues; near-duplicates**
- **Exact text and problems:**
  - Context: "he rang once at 10". Sentence: "to/tre gange".
  - "Vi har kendt…" in the context vs "De…" in the sentence.
  - "Din læge har sat det på." on an auction item.
  - Note "Skal ikke udtrykker et forbud" (the standard prohibition is "må ikke").
  - Six planned-future items appear in both present_vs_preterite and future.
- **Severity:** Minor
- **Evidence:** `tidsmaskinen/data.js:6477, 6823, 5849, 1873, 8984, 9001, 9180, 1616/8549`

### Bøjningsværkstedet and shared nouns/adjectives

**LANG-013: Known `lærer` → `lærerene` issue is already fixed (CLAUDE.md is out of date)**
- **Exact text:** `noun('A1','lærer','en','lærere',…)`. The builder special-cases -er agent nouns and returns **lærerne**.
- **Problem:** no generated form ends in `-erene`. The "Known data issue" note in CLAUDE.md is stale.
- **Suggested correct version:** remove the note from CLAUDE.md (documentation only).
- **Severity:** Minor (documentation only)
- **Evidence:** `shared/data/nouns.js:25`, `:258` ✔

**LANG-014: Mode 5 models hans/hendes where the reflexive `sin` is required**
- **Exact text:**
  - "Han har efterladt ___ ved stationen." → `hans cykel`
  - "Hun glemte ___ i bussen." → `hendes taske`
  - "Han går tur med ___ hver morgen." → `hans hund`
  - "Hun har udgivet ___ i år." → `hendes bog`
- **Problem:** the subject owns the noun, so standard Danish requires *sin*. The item tests "no definite suffix after a possessive", but the completed model sentence teaches wrong reflexive usage. That is the core point of Pronomenmysteriet's sin/hans mode.
- **Suggested correct version:** use `sin cykel` / `sin taske` / `sin hund` / `sin bog` (distractor `sin cyklen`, etc.), or rewrite with a non-subject owner, as `b5-hans-bil` does.
- **Severity:** Major
- **Evidence:** `boejningsvaerkstedet/data.js:409, 410, 419, 420` ✔

**LANG-015: Mode 6 wrong key: "set nogen til"**
- **Exact text:** "Har du set ___ til Peter?" (key `nogen`; note "set nogen til")
- **Problem:** the fixed expression is *se noget til nogen*.
- **Suggested correct version:** key `noget`; note "Fast udtryk: se noget til nogen."
- **Severity:** Major
- **Evidence:** `boejningsvaerkstedet/data.js:777` ✔

**LANG-016: Wrong superlative for `rig`**
- **Exact text:** adjectives.js puts `rig` through the -ig builder, so the superlative becomes `rigst` / `rigste`.
- **Problem:** *rig* is a one-syllable adjective, not an -ig suffix word. The correct forms are rigere / rigest / rigeste. The Mode 4 item `rig-sammenligning` has a wrong key.
- **Suggested correct version:** move `rig` to the regular word list.
- **Severity:** Major
- **Evidence:** `shared/data/adjectives.js:247` ✔, consumed at `boejningsvaerkstedet/data.js:232-268`

**LANG-018: Mode 4 superlative slot for periphrastic adjectives accepts ungrammatical forms**
- **Exact text:** `supAns = uniq([sup, supDef, 'den ' + supDef, 'det ' + supDef])`, with `superlative_definite: 'mest ' + base`
- **Problem:** in this free-text slot, "den mest typisk" and "den mest interessant" are accepted, while the correct "den mest typiske" is rejected. 39 items are affected. The bare "mest typisk" is still accepted.
- **Suggested correct version:** set the definite superlative to `'mest ' + definite_plural_form`, keeping blå/grå unchanged.
- **Severity:** Major
- **Evidence:** `boejningsvaerkstedet/data.js:244` ✔; `shared/data/adjectives.js:105, 132` ✔

**LANG-019: Mode 4 note calls regular comparison irregular**
- **Exact text:** "Glad gradbøjes uregelmæssigt: glad → gladere → gladest." The same note appears for `let` and `flot`.
- **Problem:** the `irregular` flag was set because the neuter form doesn't take -t, and that flag also drives the comparison note.
- **Suggested correct version:** "Glad gradbøjes regelmæssigt: gladere → gladest." Keep the neuter quirk in a separate field.
- **Severity:** Major (misleading explanation)
- **Evidence:** `shared/data/adjectives.js:163, 168, 169`; `boejningsvaerkstedet/data.js:241, 247`

**LANG-020: Mode 4 drills comparison on non-gradable adjectives (about 13 items)**
- **Exact text:** `muligere/muligst`, `umuligere`, `offentligere`, `kongeligere`, `færdigere`, `gyldigere`, `lovligere`, `forskelligere`
- **Problem:** the spec says to use mere/mest "only where natural". Every -ig adjective gets a comparison item.
- **Suggested correct version:** add a non-gradable filter.
- **Severity:** Major (partly UNCONFIRMED)
- **Evidence:** `shared/data/adjectives.js:237-257` → `boejningsvaerkstedet/data.js:232`

**LANG-021: Mode 4 rejects standard variants**
- **Exact text:** `dårlig` is keyed only as værre/værst.
- **Problem:** dårligere / dårligst is standard too and is rejected. `interessantere` and `blåere` are also missing (UNCONFIRMED).
- **Suggested correct version:** add the variants to `accepted_answers`.
- **Severity:** Minor
- **Evidence:** `shared/data/adjectives.js:150`

**LANG-022: Mode 6 items with two correct answers**
- **Exact text and problems:**
  - `intet` + a noun whose singular and plural are identical: "Vi fik ___ svar", "Hun sagde ___ ord", "Der var ___ lys i huset", "Der var ___ tegn på liv". `ingen` is also grammatical, and "ingen tegn på liv" is the common phrase.
  - `begge` with no "two" in the context: "___ børn går i skole", "Vi overvejede ___ muligheder". `alle` is equally correct (8 items).
  - `hverken` items where `enten` also fits: "Jeg drikker ___ kaffe eller te" (4 items).
- **Suggested correct version:** use nouns with a distinct plural; add "to" to the context; give `hverken` a negative cue.
- **Severity:** Major
- **Evidence:** `boejningsvaerkstedet/data.js:601, 756, 760, 764, 770; 738, 739, 741, 744-748; 794, 795, 800, 801`

**LANG-023: Mode 5 definiteness items where the distractor is also natural (about 25 items)**
- **Exact text:**
  - Generic plurals with no generic cue: "___ elsker at lege udenfor." (`Børnene` fits)
  - "Han ligger stadig i ___." (`sengen` is very natural)
  - "Hun læser ___ hver morgen." (`avisen`)
  - "Kommer du til ___ i aften?" (`middagen`)
  - "___ i butikken var meget hjælpsom." (`En mand`)
- **Suggested correct version:** add generic cues such as "nu om dage" or "generelt", or switch to items where only one form is defensible.
- **Severity:** Major
- **Evidence:** `boejningsvaerkstedet/data.js:311-314, 481-502, 524, 511, 515, 534, 521`

**LANG-024: Mode 1 generic notes are wrong for about 67 nouns**
- **Exact text:** "føje en bestemt endelse til stammen" / "føje -ne/-ene til ubestemt flertal"
- **Problem:** the note is false for consonant doubling (kat → katten, tal → tallene), schwa loss (cykel → cyklen), museum → museet, lærere → lærerne, and gæs → gæssene.
- **Suggested correct version:** derive the note from the actual change in form, or use `noun.note`.
- **Severity:** Major (misleading explanation)
- **Evidence:** `boejningsvaerkstedet/data.js:57-64`

**LANG-025: Unverified nouns are served in Mode 1; two are doubtful**
- **Exact text:**
  - `noun('B2','frygt','en','frygte',…)` gives frygte / frygtene
  - `noun('A1','sol','en','sole',…)`
  - `noun('A2','høne','en','høner',…)`
- **Problem:**
  - The 10 `verify: true` nouns are not filtered out, so 40 items test unverified forms.
  - Of those 10: menneske, tallerken, køkken, morgen, eksamen, café, idé and app are correct.
  - frygt has no normal plural, and sol plural is rare.
  - `høne`: the usual plural is *høns / hønsene*. `høner` exists but is uncommon. UNCONFIRMED: check RO/DDO.
  - adjectives.js has 7 further `verify: true` entries.
- **Suggested correct version:** filter out `verify: true` items, or drop frygt and sol from Mode 1. Make `høne` a manual entry after an RO check.
- **Severity:** Minor (`høne` UNCONFIRMED)
- **Evidence:** `shared/data/nouns.js:155, 188, 214, 233, 262, 276, 287, 292, 297` ✔; `boejningsvaerkstedet/data.js:72-86`

**LANG-026: Bøjningsværkstedet minor wording and plausibility issues**
- **Exact text and fixes:**
  - blå/grå notes say "I flertal ender tillægsordet på -e: blå." This contradicts itself; say "blå er ubøjeligt".
  - -ig notes show "roligere → roligst" under the label "-ere/-est" (about 84 items).
  - Implausible adjective–noun pairs: `en dyr park`, `en god kirke`, `en sjov ulv`.
  - "Tak for ___ hjælp." with key `meget` should be "Tak for hjælpen".
  - Notes that are never displayed: `lille` "flertal/bestemt form er … små" (definite singular is *den lille*); `spændende` "et førnutids tillægsform" (should be *nutids*).
  - `nouns.js:77` has a typo: "æg →ægget".
  - `b6-faa-penge` / `b6-faerre-penge`: "lidt / mindre penge" is common, and the note "Penge … tælles" is misleading (UNCONFIRMED).
- **Severity:** Minor
- **Evidence:** `boejningsvaerkstedet/data.js:141, 148, 252, 162-165, 615, 644, 687`; `shared/data/adjectives.js:152, 184`; `shared/data/nouns.js:77`

### shared/data/verbs.js (latent: no game reads `DANSK_VERBS`)

**LANG-027: Weak-verb builder produces wrong forms for "forberede" and "gentage"**
- **Exact text:** `['B1','forberede','gøre klar',true]` gives forberedede / forberedet; `['B2','gentage',…]` gives gentagede.
- **Problem:** the correct forms are forberedte / forberedt and gentog / gentaget. The generated notes repeat the wrong forms.
- **Suggested correct version:** move forberede to the -te class; make gentage a manual strong-verb entry (`gentager, gentog, gentaget, gentag, har, gentages`).
- **Severity:** Major (wrong reference data; no game exposes it yet)
- **Evidence:** `shared/data/verbs.js:246, 266` ✔

**LANG-028: verbs.js minor issues**
- **Exact text and problems:**
  - `ride` with aux `er`: "har redet" is the normal form.
  - Passive "lignes" is unnatural.
  - Imperatives "hed" / "vid" are only theoretical.
  - `bestå` passive is null, although "bestås" is natural.
- **Severity:** Minor (UNCONFIRMED)
- **Evidence:** `shared/data/verbs.js:160, 224, 105, 123, 142`

### Magiske Verber

**LANG-029: Wrong auxiliary in two perfect templates**
- **Exact text:** "Vi er [v] til Spanien flere gange i år." (rejse, aux `er`); "Filmen har [v] uden mig." (begynde, aux `har`)
- **Problem:** repeated travel takes *har* ("Vi har rejst … flere gange"). Intransitive *begynde* is normally "er begyndt". The generated instructions ("Hvilken form står efter 'har'?") and the explanation repeat the error.
- **Suggested correct version:** "Vi har rejst til Spanien flere gange i år." / "Filmen er begyndt uden mig."
- **Severity:** Major
- **Evidence:** `magiske_verber.html:531, 558` ✔; V table `:415, :427` ✔

**LANG-030: Tense items are ambiguous: present and past are both correct**
- **Exact text:**
  - 14 past templates open with a non-temporal adverbial, e.g. "Til festen [v] gæsterne…", "På mødet [v] lederen…".
  - 44 of 78 present templates have no time anchor, e.g. "Jeg [v] en mail til min chef.", "Han [v] sin gamle cykel.".
- **Problem:** the other tense is in the option pool and is grammatical. About 42 past-tense questions are affected, and roughly 40–50% of the anchor-less present-tense questions. The explanation "Tidsudtrykket peger på fortiden" is false for these items.
- **Suggested correct version:** add explicit time markers ("Til festen i lørdags…", "hver dag", "nu"), or exclude the other-tense form from the distractors.
- **Severity:** Major
- **Evidence:** `magiske_verber.html:459, 468, 471, 476, 477, 479, 489, 509, 511, 521, 529, 537, 547, 550` (past); `:449-578` (present templates); `:585` (buildOptions); `:621` (explanation)

**LANG-031: Magiske Verber minor issues**
- **Exact text and problems:**
  - Instruction "flytter sætningen til I GÅR", while the templates use "I morges", "Sidste år", etc. Use "til fortiden".
  - "Til timen" → "I timen"; "Til foredraget" → "Under foredraget".
  - "Verbalarenaen" ("verbal" means oral) → "Verbumarenaen".
  - "kort tillægsform" is not a standard term (UNCONFIRMED).
  - "Nem" is labelled A1 on an A2–B1 page.
- **Severity:** Minor
- **Evidence:** `magiske_verber.html:638, 521, 550, 725, 661, 737`

### Verb flashcards (danish_flashcards)

**LANG-032: Wrong participle for "mødes"**
- **Exact text:** `infinitive:'mødes', … pastParticiple:'mødt'`
- **Problem:** the perfect of the reciprocal verb is "har mødtes". "mødt" is the participle of *møde*.
- **Suggested correct version:** `'mødtes'`
- **Severity:** Major
- **Evidence:** `danish_flashcards/danish_flashcards_game/script.js:101` ✔

**LANG-033: Flashcard notes and examples with wrong or unnatural Danish**
- **Exact text and fixes:**
  - "»prøve på« bruges om tøj": wrong. *prøve på (at)* means "try to"; for clothes it is "prøve en jakke (på)".
  - "»spørge efter« betyder at efterlyse": should be "at bede om / spørge om".
  - "Han opgiver aldrig så let." → "Han giver aldrig så let op."
  - "Toget rejser klokken 8" → "Toget kører / afgår".
  - "Det røg ud af vinduet" → "ud ad vinduet".
  - "vride sig = skrue sig" → "sno sig".
  - "måtte" gloss "to must" → "may / must".
  - `aria-label "Pronounce"` → "Udtal".
  - "Skoene slider hurtigt på asfalten" (UNCONFIRMED).
  - "Slippe af sted med" (UNCONFIRMED).
- **Severity:** Minor (the "prøve på" note is borderline Major because the explanation is misleading)
- **Evidence:** `script.js:142, 148, 76, 16, 92, 49, 68, 264, 46, 37`

### Adverbs (adverbs.html)

**LANG-017: The dataset is a 10-item built-in sample, and 4 of its entries are conjunctions**
- **Exact text:** the comment says "Built-in sample data. Replace or augment this by importing CSV." The header promises "~500 sentences".
- **Problem:**
  - Only 10 entries ship with the game.
  - fordi, når, da and men are conjunctions, not adverbs.
  - Levels are inflated: men / ud / fordi are tagged B1; inde / derfor are tagged B2.
- **Suggested correct version:** author a real adverb dataset; move the conjunctions out; re-level.
- **Severity:** Major
- **Evidence:** `adverbs.html:9-11, 422-514`

**LANG-034: "Ordklasse-jagten" answer keys are wrong or impossible**
- **Exact text:** `derfor` with `category:"Adverb - Cause/Effect"` (no button exists for it); `alligevel` tagged "Manner"; `stadig` tagged "Frequency".
- **Problem:** the derfor question can never be answered correctly. *alligevel* is a concessive sentence adverb, not a manner adverb. *stadig* expresses time or continuation, not frequency.
- **Suggested correct version:** add an "Årsag/følge" category or retag derfor; stadig → Tid; give alligevel a sentence-adverb category or remove it from this mode.
- **Severity:** **Critical** (an unanswerable item in a 10-item pool)
- **Evidence:** `adverbs.html:456, 429, 438, 832-866`

**LANG-035: Adverbs gap-fill and listening items with several correct answers; connector mode shows the answer**
- **Exact text:**
  - "Jeg blev hjemme, ___ jeg var syg." (fordi and da both fit)
  - "___ jeg er træt, drikker jeg kaffe." (når and da)
  - "Hun arbejder ___ på projektet." (stadig and endnu)
  - Bindeordsduellen splits the sentence at the comma and leaves the answer word inside the prompt.
- **Severity:** Major
- **Evidence:** `adverbs.html:761-780, 905-925, 873-903`

**LANG-036: Wrong-answer feedback is misleading and has no grammar note**
- **Exact text:** "Det rigtige svar er <word> – <English meaning>". This is printed even when the answer was a category or a whole sentence.
- **Problem:** the PRD requires the correct answer plus one Danish grammar note.
- **Severity:** Major
- **Evidence:** `adverbs.html:998`

### Idiomjægeren

**LANG-037: "Gå op i en højere enhed" is explained with the opposite meaning**
- **Exact text:** `m:"To dissolve into nothing / fall apart"`, `x:"For plans or things to come to nothing."`, example "Hele planen gik op i en højere enhed." / "The whole plan just fell apart."
- **Problem:** the idiom means "to merge into a harmonious whole" (positive). It has been confused with *gå op i røg*. The answer marked correct is wrong in every mode.
- **Suggested correct version:** m: "To come together perfectly / form a harmonious whole". Example: "Musikken og billederne gik op i en højere enhed."
- **Severity:** **Critical**
- **Evidence:** `idiomjaeger.html:531` ✔

**LANG-038: "Have rejst sig på den forkerte side" is a calque with an ungrammatical example**
- **Exact text:** "Undskyld, jeg er vist rejst mig på den forkerte side i dag."
- **Problem:**
  - This is not an established Danish idiom; it comes from English "get up on the wrong side of the bed". The Danish idiom, *stå op med det forkerte ben først*, is already in the data at :351.
  - Reflexive *rejse sig* takes *har*, so "er … rejst mig" is wrong.
- **Suggested correct version:** delete the entry. If it stays, the example needs "har vist rejst mig".
- **Severity:** Major
- **Evidence:** `idiomjaeger.html:491` ✔

**LANG-039: Duplicate or synonymous idioms can be offered as "wrong" options**
- **Exact text:**
  - "Ramme hovedet på sømmet" (:408) and "Slå hovedet på sømmet" (:508) have identical meanings.
  - "Det er ingen sag" (:350) / "Det er ikke nogen sag" (:492).
  - Near-synonym groups: gå i vasken / gå i fisk; tale lige ud af posen / sige rent ud / tage bladet fra munden; ramme plet / være lige i skabet; and others.
- **Problem:** the distractor pickers exclude only identical strings and prefer the same category. Two correct options can therefore appear.
- **Suggested correct version:** merge the duplicates; add synonym-group exclusion to the pickers.
- **Severity:** Major
- **Evidence:** `idiomjaeger.html:594-603` (pickers); data lines as listed

**LANG-040: Idiom wording errors**
- **Exact text and fixes:**
  - "Smide penge ud af vinduet" → "ud ad vinduet"
  - "Mine advarsler talte for døve øren" (calque) → "Jeg talte for døve øren"
  - "Lægge ordene i munden på nogen" → "lægge nogen ord i munden"
  - "Have en finger på pulsen" → "have fingeren på pulsen"
  - "Til mødet følte jeg mig…" → "På mødet…"
  - "Native-niveau" → "Modersmålsniveau"
  - UNCONFIRMED: "Stå last og brast" (standard is "dele last og brast"), "Gå under radaren" ("flyve under radaren"), "Have noget i ærmet", "Få sig en gang på frakken"
  - "Fuldfør udtrykket": for "Tak for kaffe!" the trailing "!" defeats the blanking regex, so the answer is shown.
- **Severity:** Minor
- **Evidence:** `idiomjaeger.html:450, 460, 459, 526, 380, 609/868/928, 524, 473, 530, 504, 1049`

### Dansk Præpositioner

**LANG-041: "Find fejlen" / "Ret sætningen" present correct Danish as the error**
- **Exact text:**
  - `gen("Temperaturen er {a} {x}.","under",["frysepunktet","nul grader",…])` with err "over"
  - "Jeg drikker kaffe med mælk" with err "uden"
  - "Jeg drikker te uden mælk" with err "med"
  - "Hun rejste uden sin mand"
  - "Mødet sluttede uden en konklusion"
- **Problem:** the "error" sentences ("Temperaturen er over frysepunktet", "kaffe uden mælk", "te med mælk") are fully correct Danish. The learner is told that correct Danish is wrong.
- **Suggested correct version:** choose an `err` preposition that is genuinely ungrammatical in each frame (e.g. "Temperaturen er *på* frysepunktet" is not right either; "kaffe *af* mælk" is clearly wrong).
- **Severity:** **Critical**
- **Evidence:** `dansk-praepositioner.html:494, 404, 478, 484, 486` ✔

**LANG-042: Valid prepositions offered as "wrong" distractors (CONFUSE map)**
- **Exact text and the valid alternative offered as wrong:**
  - "Vi mødes i kantinen" vs **ved**
  - "Bogen ligger på reolen" vs **i**
  - "Han sidder stadig i toget / sofaen" vs **på**
  - "Det skete under ferien" vs **i**
  - "Vi spiser efter mødet" vs **under**
  - "Hun sidder ved vinduet" vs **i**
  - "Vi gik over pladsen" vs **på**
  - "Mødet varede over en time" vs **under**
  - "Jeg er færdig om en time" vs **på**
  - About 15 more templates
- **Severity:** Major
- **Evidence:** `dansk-praepositioner.html:342, 356, 350, 492, 464, 532, 510, 572, 428, 358, 490, 568, 498, 468, 528, 578, 506`

**LANG-043: Unidiomatic answer keys and conflicting templates**
- **Exact text:**
  - "Vi skal lige nå til flyet / toget / bussen / færgen" (key "til"); "nå" takes a direct object.
  - "Bilen holder ved indkørslen" (the natural form is "i indkørslen").
  - "Brevet er {a} …" is keyed "til" at :376 and "fra" at :456, so each item rejects the other valid answer.
  - Translation mode needs an exact string match, so "farmor / bedstemor" are rejected.
- **Suggested correct version:** "Vi skal lige nå toget"; "holder i indkørslen"; one key per template; accept a list of translations.
- **Severity:** Major
- **Evidence:** `dansk-praepositioner.html:542` ✔, `536, 376, 456, 1133, 616`

**LANG-044: Prepositions minor issues**
- **Exact text and problems:**
  - "cykler på arbejde", "arbejder i Netto", "en tid til lægen" are colloquial variants that get marked wrong (UNCONFIRMED).
  - "I tjeneste af nogen" → "i nogens tjeneste".
  - "Indvendigt i lukkede rum" → "Inde i lukkede rum".
  - "bolig-udtryk" → "boligudtryk".
  - "Du arbejder for meget" is presented as a preposition item, but "for" is a degree adverb here.
  - "Læg pengene på bankbogen" is dated.
  - Badge "Multiple choice" → "Flervalg".
- **Severity:** Minor
- **Evidence:** `dansk-praepositioner.html:378, 440, 446, 617, 343, 365, 391, 584, 946`

### Antonymer (danish-antonyms-game.html)

**LANG-045: A second valid antonym can appear as a "wrong" option**
- **Exact text:** distractors = `ANTONYMS.flatMap(p=>[p.wordA,p.wordB]).filter(w=>w!==answer && w!==shown)`
- **Problem:** 66 headwords have several antonyms in the data. Examples:
  - gammel: ung, ny, frisk
  - mild: bitter, intens, alvorlig, skarp, stærk, syrlig
  - sikker: usikker, tvivlsom, farlig
  - klar: mat, skyet, vag, uforberedt

  So "gammel" → "ung" can offer "ny" as wrong. The typed-mode hint "begynder med »s«" for mild fits stærk, skarp and syrlig.
- **Suggested correct version:** exclude every word paired with the shown word.
- **Severity:** Major
- **Evidence:** `danish-antonyms-game.html:1103` ✔

**LANG-046: Grammar errors in example sentences**
- **Exact text and fixes:**
  - "Han spiste den hele kage." → "Han spiste hele kagen."
  - "Systemet er kompleks." → "komplekst"
  - "Hendes ansigt var bleg." → "blegt"
  - "Systemet var træg." → "trægt"
  - "Værelset er tilstødende køkkenet." → "Værelset støder op til køkkenet."
  - "Husene er lignende." → "Husene ligner hinanden."
  - "Det er min favorit film." → "favoritfilm / yndlingsfilm"
  - "Kom her hen." → "Kom herhen."
- **Severity:** Major (repeated errors, especially missing neuter -t agreement)
- **Evidence:** `danish-antonyms-game.html:658` ✔, `549` ✔, `696, 723, 565, 637, 570, 530`

**LANG-047: Non-antonym pairs, non-words and a false friend**
- **Exact text and problems:**
  - Non-antonyms: rød/blå, gul/lilla (tagged Easy), luftig/pigget, kløende/glat, fløjl/sandpapir, gas/fast stof, dygtig/langsom, skarp/sløret (its example "Kniven er skarp" pairs with *sløv*), beholde/forlade, pæn/frygtelig, mikro/makro.
  - Non-words: "ulovende" (use "lidet lovende"); "frysende (koldt)" (use "iskoldt"); "Stigen var rystende" (use "vaklende"); "rejser på økonomi" (use "på økonomiklasse").
  - False friend: "sympatisk" is glossed "sympathetic", with antonym "ligegyldig". In Danish *sympatisk* means likeable, so the antonym is *usympatisk*.
- **Severity:** Major
- **Evidence:** `danish-antonyms-game.html:477, 478, 553, 711, 751, 756, 604, 627, 655, 512, 725, 672` ✔, `483, 614, 586, 687` ✔

**LANG-048: Antonyms minor issues**
- **Exact text and problems:**
  - Unnatural examples: "Skolen ligger nær.", "Det er lys dag", "modvillig til at hjælpe", "Bilen er accelererende", "et prompte svar".
  - Duplicate pairs: lys/mørk, retfærdig/uretfærdig, større/mindre, alvorlig/mild, lige/ulige.
  - Level: the page says B1–B2, but many items are C1 or technical (proksimal/distal, sækkelærred).
  - English UI: button "Check" → "Tjek"; `aria-label "Pronounce"` → "Udtal".
- **Severity:** Minor
- **Evidence:** `danish-antonyms-game.html:507, 484, 579, 759, 724, 479/620, 515/546, 537/594, 632/660, 737/738, 631, 752, 1189, 918`

### Dansk Mester (danske-phraser)

**LANG-049: "Mangler" is explained as "savner"**
- **Exact text:** "»Mangler« betyder »savner« – der er kun ét trin tilbage."
- **Problem:** *mangle* means "lack / be missing"; *savne* means "miss".
- **Suggested correct version:** "»Mangler« betyder her, at der stadig er noget tilbage."
- **Severity:** Major
- **Evidence:** `danske-phraser/dansk-mester.html:512` ✔

**LANG-050: Misleading rules: "enig i, ikke med" and "begynde på, ikke med"**
- **Exact text:** "Bruges, når man er enig i en holdning eller et udsagn – husk »i«, ikke »med«." Also "begynde på … husk »på«, ikke »med«", and "Det var hyggeligt" explained as "»Hyggelig« i datid".
- **Problem:**
  - *enig med* + person is correct, and the prepositions game itself teaches "enig med dig".
  - *begynde med* is also correct.
  - Adjectives have no tense: this is *var* + neuter -t.
- **Suggested correct version:** "enig i en sag, enig med en person"; "begynde på (en opgave) / begynde med (at …)"; "var + intetkøn -t".
- **Severity:** Major
- **Evidence:** `dansk-mester.html:386` ✔, `387, 422, 363, 484`; cf. `dansk-praepositioner.html:546`

**LANG-051: Duplicate English glosses make multiple-choice ambiguous**
- **Exact text:**
  - passe på / tage sig af are both "take care of"
  - kigge på "look at" / se på "look at / watch"
  - "I think so" / "I think so too"
- **Severity:** Major
- **Evidence:** `dansk-mester.html:388-389, 945`

**LANG-052: Dansk Mester minor issues**
- **Exact text and problems:**
  - "dobbelt benægtelse" → "underdrivelse"
  - "Velbekomme" is the reply to "tak for mad", not something said before the meal
  - "tre småord" (finde is a verb)
  - "af sted"/"afsted" used inconsistently (both RO)
  - Level: the page says A1–A2, but 53 of 150 items are B1 or higher
  - "Continue ▸" → "Fortsæt ▸"
- **Severity:** Minor
- **Evidence:** `dansk-mester.html:464, 489, 398, 346, 1131`

### Forbindeord (forbindenor)

**LANG-053: Distractors come from the answer's own category, so synonyms are marked wrong**
- **Exact text:** `const pool=(byCat[rec.cat]||[]).filter(w=>w!==rec.ans);`
- **Problem:** "Vi så filmen, og {} gik vi en tur." (key bagefter) can offer derefter, dernæst or så as wrong. "Vejen var glat, {} kørte vi langsomt." (key derfor) can offer af den grund or følgelig. The same happens with fordi/da/eftersom/idet, desværre/uheldigvis, dvs./altså, and other groups. This affects most of the 359 items.
- **Suggested correct version:** draw distractors from other categories, or keep per-item synonym exclusions plus accepted alternatives.
- **Severity:** **Critical** (systemic)
- **Evidence:** `forbindenor/Forbindenor.html:707-716` ✔; examples at `:262, :408, :381-384, :570-577, :477-484`

**LANG-054: Answer spelled "ovenikøbet"**
- **Exact text:** answer `ovenikoebet`, which displays and is read aloud as "ovenikøbet"
- **Problem:** RO spells it *oven i købet*, as the item's own note does.
- **Suggested correct version:** "oven i købet"
- **Severity:** Major (shown and spoken on the answer button)
- **Evidence:** `forbindenor/Forbindenor.html:372-375` ✔

**LANG-055: Reflexive `sin` used inside the subject of a subordinate clause**
- **Exact text:** "Hun maler smukt, ligesom sin mor gjorde." (Forbindenor); "Hun danser smukt, ___ sin mor gjorde." (Konjunktioner)
- **Problem:** *sin* cannot be part of the subject of its own clause.
- **Suggested correct version:** "ligesom hendes mor gjorde"
- **Severity:** Major
- **Evidence:** `forbindenor/Forbindenor.html:453` ✔; `konjunktioner/konjunktioner.html:610` ✔. UNCONFIRMED: `konj :601`, `forb :456`

**LANG-056: Forbindeord minor issues**
- **Exact text and problems:**
  - "+1 ENERGY" → "+1 ENERGI"
  - English category labels shown beside the Danish ones (check against the PRD)
  - Note "Står ordet først… verbet før grundleddet" attached to "så" items that have no inversion
  - Category placement: både/begge/alle under "Sammenligning"; omsider under "Holdning"
  - "For det andet" appears without "for det første"
  - Levels clash with Konjunktioner (eftersom is C1 here and B2 there)
- **Severity:** Minor
- **Evidence:** `forbindenor/Forbindenor.html:760, 636-641, 405-407, 430-448, 602, 314, 316`

### Konjunktion Crush (konjunktioner)

**LANG-057: About 35 items where a "wrong" option is also correct**
- **Exact text:**
  - "Jeg ved ikke, ___ min nye lærer er." (hvor also fits)
  - "Vi diskuterede, ___ vi skulle holde ferie." (hvordan)
  - "Telefonen ringede, ___ jeg var ude i haven." (da)
  - "Da vi gik, slukkede vi…" (da offered against før/inden)
  - "Vi tager på stranden, ___ solen skinner." (når)
  - "Jeg drikker te, ___ jeg fryser." (hvis)
  - eftersom items offer fordi / da as wrong, although the game's own rule says da can mean "because"
- **Suggested correct version:** replace the distractors with options that are clearly wrong in each frame.
- **Severity:** Major
- **Evidence:** `konjunktioner/konjunktioner.html:631, 637, 638, 643, 647, 650, 652, 672, 676, 681, 682, 683, 451, 452, 496, 504, 506, 509-511, 526, 531, 535, 540, 618, 488, 449`

**LANG-058: Unidiomatic sentence: "Det føles, at…"**
- **Exact text:** "Det føles, at sommeren aldrig kommer i år."
- **Suggested correct version:** "Det føles, som om sommeren aldrig kommer i år."
- **Severity:** Major (it is the marked-correct model)
- **Evidence:** `konjunktioner/konjunktioner.html:424`

**LANG-059: Konjunktioner minor issues**
- **Exact text and problems:**
  - Rule "Ordstilling efter: SVA" for og/men/eller/så, but item :359 "…og bagefter så vi en film" is inverted. Say "hovedsætningsordstilling (V2)".
  - Commas before *end* + noun phrase ("højere, end sin storebror", "end at flyve").
  - "smagte præcis, ligesom da…" has the comma in the wrong place.
  - "siden nytår" is a preposition, but it is presented as a conjunction.
- **Severity:** Minor
- **Evidence:** `konjunktioner/konjunktioner.html:318-322, 359, 601, 603, 606, 607, 614, 557`

### Ordstillingsdetektiven

**LANG-060: Grammar tips say the infinitive or participle goes "til sidst" (last)**
- **Exact text:** "…modalverbet på anden plads, og hovedverbet står til sidst i infinitiv: Jeg · kan · tale dansk"
- **Problem:** Danish is not verb-final. The tip's own example has an object after the infinitive.
- **Suggested correct version:** "Infinitiven/tillægsformen står efter grundleddet (og evt. ikke); objekt og andre led følger efter."
- **Severity:** Major
- **Evidence:** `ordstilling-detektiv/index.html:567` ✔, `566, 601, 701, 734`

**LANG-061: Only one exact order is accepted, and navigation is in English**
- **Exact text:** `built.join(" ")===cur.correct.join(" ")`; buttons "Finish ▸" / "Next ▸"
- **Problem:**
  - Valid topicalised orders ("Kaffe drikker jeg") are rejected, while the English prompt suggests a free translation.
  - The English buttons appear on every item.
  - The case 6 questions have no "?".
- **Suggested correct version:** state "byg præcis denne sætning", or accept alternative orders. Rename the buttons "Afslut ▸" / "Næste ▸".
- **Severity:** Major
- **Evidence:** `ordstilling-detektiv/index.html:1040, 1086` ✔

**LANG-062: Ordstillingsdetektiven minor wording**
- **Exact text and fixes:**
  - "udfylder hele sætningen forreste plads" → "hele bisætningen"
  - "Næste uge starter jeg" → "I næste uge"
  - "email" → "e-mail"
- **Severity:** Minor
- **Evidence:** `ordstilling-detektiv/index.html:668, 425, 379, 619`

### Sætningsmaskinen (data only; no index.html, content is inert)

**LANG-063: About 90% of the data is cloned filler; the dev comments are still in place**
- **Exact text:** `Array(N).fill(null).map(...)` clones, e.g. "han kommer ikke i dag" ×100 and "___ regner." ×150; comment "// Continue to reach 140"
- **Problem:** 920 of about 1,020 items are copies of one sentence each. The header claims "~1,020 items". Also confirmed: **there is no `saetningsmaskinen/index.html`**, nothing loads the data, and the portal does not link the game.
- **Suggested correct version:** author real items before building the page.
- **Severity:** Major (Critical once a page uses this data)
- **Evidence:** `saetningsmaskinen/data.js:2, 63, 70-71, 100-101, 127-128, 152-153, 177-178, 202-203, 227-228`

**LANG-064: Hand-written items with wrong keys or broken frames**
- **Exact text and problems:**
  - `iq-hvorfor-ringer`: "Han ville vide, ___ jeg ringede ikke." This teaches *ikke* after the verb in a subordinate clause. It should be "hvorfor jeg ikke ringede".
  - `rc-hvilket`: "En bog, hvilket jeg læste, var interessant." *hvilket* cannot refer back to a noun. Use "som".
  - Frames repeat words when the answer is filled in: "hvornår toget toget går", "Manden, der der står".
  - "hvor mange mennesker kommer" needs "der".
  - "Det snør" / "snér" → "sner".
  - "___ smiler fra hende." is not Danish.
  - Mode 1 "som hun altid drikker kaffe": *som* has no gap to fill.
  - Wrong notes: "Hvem som objekt" (it is the subject), "Selvom-sætning uden inversion".
  - Spelling: "modalsverbet" → "modalverbet".
- **Severity:** Major (latent)
- **Evidence:** `saetningsmaskinen/data.js:147` ✔, `171` ✔, `146, 148, 168, 150, 94, 196, 200, 22, 26, 38, 126, 221, 56, 59-62`

### Shared pronouns / clause patterns / explainer scenes

**LANG-065: pronouns.js explains "intet" wrongly**
- **Exact text:** `id:'intet', note:'Negerer utælleligt ental og er mere formelt end "ikke noget".'`
- **Problem:** *intet* is the neuter (et-word) form of *ingen* ("intet hus"), not a marker of uncountable nouns.
- **Suggested correct version:** "Intetkønsformen af ingen (intet hus); mere formelt end ikke noget."
- **Severity:** Major
- **Evidence:** `shared/data/pronouns.js:65` ✔

**LANG-066: pronouns.js and clause-patterns.js minor issues**
- **Exact text and problems:**
  - "reflexive/ikke-reflexive" → "refleksiv".
  - nogen/nogle notes are stated too absolutely.
  - *hverken* is listed as a pronoun, but it is a conjunction.
  - clause-patterns: "Vi bestiller takeaway, mens hun ikke laver aftensmad i aften" (*mens* does not fit).
  - "Presentationelt" → "Præsentationelt".
- **Severity:** Minor
- **Evidence:** `shared/data/pronouns.js:32, 33, 36, 61-62, 71`; `shared/data/clause-patterns.js:30, 88, 25, 27`

**LANG-067: Explainer scene sin-hans colours grammatical sentences red**
- **Exact text:** "Peter ser hans bror" / "Anna vasker hendes bil", shown in red
- **Problem:** in the other scenes red means "wrong". These sentences are grammatical: the brother or car belongs to someone else. The scene is flagged `verify:true`.
- **Suggested correct version:** use a neutral colour and add a gloss ("= en andens bror").
- **Severity:** Major (UNCONFIRMED intent)
- **Evidence:** `shared/explainer/scenes/sin-hans.scene.js` (red styling on the hans/hendes lines)

**LANG-068: Explainer scenes minor issues**
- **Exact text and fixes:**
  - flertal: "Hvert ord: barn → børn" → "Nogle ord: barn → børn"
  - inversion-derfor: "han var syg derfor…" joins two main clauses with no punctuation. Use "Han var syg. Derfor…"
- **Note:** the other 15 scenes teach correct rules in correct Danish.
- **Severity:** Minor
- **Evidence:** `shared/explainer/scenes/flertal.scene.js`, `inversion-derfor.scene.js`

### En/Et-træner

**LANG-069: `øl` note gives the wrong definite form**
- **Exact text:** `{w:"øl",a:"en",d:"øllen",…,note:"Det hedder »en øl«. Bestemt form: ølen."}`
- **Problem:** "ølen" is wrong; the data field correctly says *øllen*. *Et øl* is also valid, so the en/et question is ambiguous (UNCONFIRMED: RO lists both).
- **Suggested correct version:** "Bestemt form: øllen. (Både en øl og et øl bruges.)"
- **Severity:** Major
- **Evidence:** `en og et/index.html:579` ✔

**LANG-070: En/Et-træner minor issues**
- **Exact text and problems:**
  - Notes teach "en mælk", "et sukker", "et salt" as forms to learn. The genders are right, but these indefinite forms are not normally used. Teach mælken / sukkeret / saltet.
  - The `and` note contradicts itself.
  - "Jeg læser ___ om dagen" is glossed "during the day".
  - A stray space before punctuation in the revealed sentences ("låne ___ ?").
  - Wrong synonym pairs: kedelig/træls, sjældent/fåtalligt, penge/mønt, vej/gade.
  - English translations shown in feedback.
- **Note:** the genders of all 229 nouns are correct.
- **Severity:** Minor
- **Evidence:** `en og et/index.html:581-584, 493, 843, 833, 839, 845, 859, 777, 802, 819, 820, 1141, 1207`

### Portal and cross-cutting

**LANG-071: Portal text errors and level labels that don't match the games**
- **Exact text:**
  - "gratis online spil … dansk undervisning … A1–B2 niveau"
  - og:description uses "verbum"
  - Konjunktion Crush is labelled "B1", but its items are A1–B2
  - Ordstillingsdetektiven is labelled "B1–B2", but the game says A1 → B2
  - Forbindeord is labelled "B1", but its items are A1–C1
- **Suggested correct version:** "onlinespil", "danskundervisning", "A1–B2-niveau", "verber". Align the labels with the actual item levels.
- **Severity:** Minor
- **Evidence:** `index.html:222` plus the game cards

**LANG-072: English carries core learning content where the PRD requires Danish UI**
- **Exact text:**
  - Idiomjæger: every meaning option, explanation and Kontekstmesteren prompt is English ("Situation: To stay calm…").
  - Adverbs: "Find betydningen" options are English; feedback says "Engelsk: …".
  - Flashcards: the English gloss is always on the front.
  - `pixel-animation.html` title "Pixel Animation".
- **Problem:** the PRD says "Interface text in Danish; English only to resolve semantic ambiguity". These games use English as the main medium for the answer.
- **Suggested correct version:** Danish meanings and explanations, with English as an optional hint.
- **Severity:** Major (product requirement; affects 3 games)
- **Evidence:**
  - `idiomjaeger.html:801-804, 857, 1046, 1049`, data `:343-536`
  - `adverbs.html:744-797, 998`
  - `danish_flashcards/danish_flashcards_game/script.js:403, 414`
  - `pixel-animation.html:6`

**LANG-073: Congratulatory or encouraging feedback text (against the PRD feedback rule)**
- **Exact text:**
  - Magiske Verber: `OK_MSGS = ['Godt klaret!','Flot arbejde!','Du bliver bedre!']` and "Prøv igen!", which is also misleading because no retry is possible.
  - En/Et: `praise=["Storartet!","Pragtfuldt!",…]` and "Du klarer den næste!"
  - Bøjningsværkstedet: "Rigtigt!"
  - Prepositions, antonyms and Dansk Mester show similar praise.
- **Problem:** this is not a language error, but it breaks the PRD rule: correct answer = animation + sound only; wrong answer = no encouragement.
- **Severity:** Minor (for the language report; the UX/PRD reviewer may rate it higher)
- **Evidence:** `magiske_verber.html:933-934` ✔; `en og et/index.html:1001-1002` ✔; `boejningsvaerkstedet/index.html:1224` ✔

**Placeholder sweep result:**
- User-facing placeholder or test content exists only in `pronomenmysteriet/data.js` (LANG-001), the adverbs 10-item sample (LANG-017) and the Sætningsmaskinen clones (LANG-063).
- The other `placeholder` hits are input placeholders or code comments: `magiske_verber.html:442`, `danish-antonyms-game.html:446` ("PASTE YOUR 500 ANTONYM PAIRS HERE"), and a stray citation artifact in an `adverbs.html:27` comment.
- No `TODO`, `dummy` or `lorem` strings are visible to users.

---

## 4. Summary

### By game

| Game | Critical | Major | Minor | Headline |
|---|---|---|---|---|
| Pronomenmysteriet | 1 | 0 | 0 | All 760 items are "Test sentence / opt1" |
| Tidsmaskinen | 1 | 6 | 4 | Adverb-after-participle generator bug (23 items); otherwise low error rate |
| Bøjningsværkstedet + nouns/adjectives | 0 | 9 | 4 | hans/hendes instead of sin; wrong keys (nogen/noget, rig); ambiguous Modes 5/6; misleading Mode 1 and Mode 4 notes |
| verbs.js (latent) | 0 | 1 | 1 | forberedede / gentagede |
| Magiske Verber | 0 | 2 | 1 | Wrong auxiliaries; many tense items with two correct answers |
| Verb flashcards | 0 | 1 | 1 | mødes → mødt |
| Adverbs | 1 | 3 | 0 | 10-item sample; unanswerable category item |
| Idiomjægeren | 1 | 2 | 1 | "gå op i en højere enhed" explained backwards |
| Præpositioner | 1 | 2 | 1 | Correct Danish presented as the error |
| Antonymer | 0 | 3 | 1 | Second antonym offered as wrong; grammar errors in examples |
| Dansk Mester | 0 | 3 | 1 | mangler = savner; "enig i, ikke med" |
| Forbindeord | 1 | 2 | 1 | Synonym distractors (systemic) |
| Konjunktion Crush | 0 | 2 | 1 | About 35 items with a second correct option |
| Ordstillingsdetektiven | 0 | 2 | 1 | "verb last" tip; English nav buttons |
| Sætningsmaskinen (data only, no page) | 0 | 2 | 0 | Cloned filler; wrong keys (latent) |
| Shared pronouns / clauses / explainers | 0 | 2 | 2 | intet note; sin-hans scene colouring |
| En/Et-træner | 0 | 1 | 1 | øl → ølen |
| Portal, pixel-animation, cross-cutting | 0 | 1 | 2 | English core content (3 games); praise text; portal compounds and labels |

**LANG-055** (sin in a subordinate clause subject) covers both Forbindeord and Konjunktioner. It is counted once, under Forbindeord.

### Counts by severity (73 findings)

| Severity | Count | IDs |
|---|---|---|
| Critical | 6 | LANG-001, 002, 034, 037, 041, 053 |
| Major | 44 | |
| Minor | 23 | |

### Top priorities

1. **LANG-001:** Pronomenmysteriet has no real content. Hide it or author the items.
2. **LANG-053 and LANG-041:** systemic "correct answer marked wrong" in Forbindeord (same-category distractors) and Præpositioner ("Find fejlen" errors that are valid Danish).
3. **LANG-002:** Tidsmaskinen adverb-placement generator bug (23 items).
4. **LANG-037:** Idiomjæger teaches the opposite meaning of "gå op i en højere enhed".
5. **LANG-014 and LANG-055:** reflexive-possessive errors (hans/hendes for sin; sin inside a subject) taught in three non-pronoun games. They contradict Pronomenmysteriet's core rule.

**Not covered:** none. Every in-scope file was reviewed. `saetningsmaskinen/` has no `index.html`, so only its data was reviewed. A native-speaker pass is still needed for the items marked UNCONFIRMED.
