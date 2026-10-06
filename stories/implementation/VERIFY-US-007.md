# VERIFY US-007 - Adverbier dataset, categories, notes (verifier V-ADV)

Method: puppeteer-core/Edge; all 10 entries x 7 modes x 60 randomised builds enumerated (full option sets in scratchpad `impl/v-adv/out2.txt`, lines "ENUM"), real-click answer of every entry in every mode, wrong-answer feedback dump.

| Criterion | Result | Evidence |
|---|---|---|
| The dataset is replaced or extended with real adverb items. Size and levels follow `specs.md` ... Conjunctions moved or removed. Levels re-assessed. | NOT VERIFIED | Still 10 entries (owner decision on size). Levels re-assessed (men/ud/inde A1, most A2, alligevel B1; plausible). Conjunctions kept in the Bindeord zone with conjunction categories (allowed by the criterion). |
| Every entry's category maps to an existing button. `derfor` valid; `stadig` Time; `alligevel` sentence-adverb or excluded. | PASS | Buttons: Tid, Sted, Måde, Hyppighed, Årsag og følge, Sætningsadverbium + 3 conjunction types. derfor -> "Årsag og følge"; stadig = Time; alligevel = Sentence. 10 entries in Ordklasse-jagten: correct button always present; real click gives "Rigtigt!"; unanswerable = 0. Unknown CSV category falls back to Udfyld hullet (lines 820-821). |
| A script asserts that every entry's category resolves to a button. | PASS (not shipped) | Not in the repo; my script asserts the same. The story names no location. |
| Gap-fill and listening items have one defensible answer. | NOT VERIFIED | Technical exclusion works (fordi/da, når/da, stadig/endnu/alligevel never co-occur as options; listening distractors never occur in the sentence). Defensible alternatives still occur as options (native judgement): "når" (gap and duel) can offer "fordi" ("Fordi jeg er træt, drikker jeg kaffe"); "da" can offer "fordi"; "fordi" can offer "men" ("Jeg blev hjemme, men jeg var syg"); "stadig" and "alligevel" gap can offer "derfor"; "derfor" gap can offer "alligevel"/"da". Exclusion is one-directional. |
| Wrong-answer feedback shows the correct answer in the form asked plus one Danish grammar note per entry; English only as hint. | PASS | Ordklasse-jagten: "Det rigtige svar er Årsag og følge"; Find betydningen: English meaning (US-027 pending); Translate/Ordstilling: sentence; gap/duel/listening: word. Then Danish sentence + replay, one Danish note (all 10 present), small "Engelsk hjælp" line. |
| The CSV import schema (documented in the import modal) is updated if a `note` column is added. Old CSVs still import. | PASS | Modal text (line 385) lists the optional `note` column; `parseCSV` unchanged; entries without note get a generic Danish `fallbackNote`. Verified by code reading, no real CSV paste run. |
| Native-speaker sign-off on the new items and notes. | NOT VERIFIED | Needs a native speaker. |

Måde / Frekvens zones
- At HEAD, Måde held exactly 1 entry (alligevel) and Frekvens 1 entry (stadig): already near-unusable (one word repeated, and the zone was dropped after the first question anyway).
- Now both hold 0 entries; clicking shows "Der er endnu ingen ord i dette emne. Vælg et andet emne." (no crash, 0 errors). Zone counts: Tid 2, Sted 2, Måde 0, Frekvens 0, Bindeord 4, Sætningsbygning 10.
- Zone picker: the buttons are always shown; at low level they read "LÅST" (unlock is index-based: Måde at level 2, Frekvens at level 3). Nothing signals that a zone is empty, so a learner who reaches level 2/3 unlocks an empty zone. Judgement: minor learner-facing regression (1 word -> 0 words with an explanatory message), a direct result of the correct retagging. The real fix is more data (owner decision).

Danish content (not a native speaker): all 10 notes read as grammatical Danish, and the når/da and derfor word-order notes look correct. UNCERTAIN for native review: (1) all 10 `note` texts; (2) labels "Sætningsadverbium", "Årsag og følge"; (3) whether alligevel belongs in the category game; (4) levels and `alt` sets; (5) the defensible-alternative options above; (6) CSV fallback notes.

Regressions: none beyond the empty Måde/Frekvens zones. Scope creep: none (the `alt` field, fallback notes and label strings serve the criteria). Keys/storage unchanged; orphaned old `categoryStats` keys "Manner"/"Frequency" can still surface in "Svageste emne".

Verification: NOT VERIFIED - dataset size (owner decision), single-defensible-answer judgement (remaining alternatives such as fordi for når/da, men for fordi, derfor for stadig/alligevel) and native-speaker sign-off cannot be confirmed here; no criterion FAILED.
