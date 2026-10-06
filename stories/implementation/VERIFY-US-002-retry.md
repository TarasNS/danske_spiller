# VERIFY US-002 (retry) - Forbindeord distractors

Verifier: independent (scratchpad `impl/verify-b1c/`: `a.mjs` automated, `c.mjs`/`review.txt` hand review, `b.mjs`/`e.mjs`/`f.mjs`/`g.mjs`/`h.mjs` difficulty analysis, `drive.mjs`). Edge via puppeteer-core, file://. All checks use the real `allowedPool()`, `distractors()`, `synSet()`, `KIND_OK` from the page. Repo untouched (git status identical before/after smoke).

## 1. Automated (359 items x 300 draws = 107,700 draws)
- Not 4 options: 0. Duplicate options: 0. Answer missing: 0. Answer in own distractor list: 0.
- Distractor in answer's synonym group (both directions via `synSet`): 0.
- KIND_OK matrix asymmetries: 0.
- Pool sizes (allowed distractor words per item): min 3, median 10, max 41; items with pool < 6: 33 (the example/restatement/quantifier-adjacent small kinds, e.g. fx/eksempelvis/bl.a./endda 4-5, især/specielt 3, dvs./m.a.o. 5, ligesom 5-9).
- Only 20 distinct pools exist across 359 items (the pool depends on the answer's kind, not on the sentence).
- Console/page errors on load: 0.

## 2. Hand review (98 items; includes every example item of VERIFY-US-002.md; remainder = every 6th item from idx 4, plus the earlier verifier's "no valid / uncertain" lists)
Each item printed with representative distractors of every kind filled into the frame (and all words of a kind listed).
- Natural, defensible alternative offered (FAIL): 1 item. Item 172 "{} forslag er gode, så det er svært at vælge." (key begge). Via `ITEM_ADDKIND` it is offered adverbs from a pool of 37, including `tidligere`, `yderligere`, `senere`: "Tidligere forslag er gode, så det er svært at vælge" / "Yderligere forslag er gode ..." are natural Danish noun phrases. About 23 percent chance per draw that one of them appears. The implementer documented 172 as an open frame, but the ADDKIND decision introduced the natural distractors.
- UNCERTAIN (native needed): about 20 items.
  - 226 "{} sidste år blev festen aflyst i år." (key i modsætning til): `først`/`tidligere`/`senere` + "sidste år" form a grammatical fronted adverbial ("Først sidste år blev festen aflyst"), only the meaning with "i år" is odd.
  - 19 sampled items (81 in the whole game) where the blank is sentence/clause-initial before an inverted verb and `men` is in the pool, e.g. 51 "Jeg siger nej. {} har jeg ikke tid.", 316 "Det er skyet; {} regner det senere.": "Men har jeg ikke tid" reads as a question/conditional, I judge it wrong for a statement, a native should confirm. Same for `hvorimod`/`mens` after "og" is clearly wrong.
  - The V3 family (adverb in front of subject+verb without inversion, e.g. 118-130, 237-240) is treated as wrong by the implementer; spoken Danish tolerates some V3, so UNCERTAIN as stated by the implementer. Not independently resolvable.
- Clearly wrong (conjunction/quantifier/preposition in an adverbial slot, adverb or "det betyder"/"i modsætning til" in a conjunction slot, "og men", "idet" + inverted verb, etc.): the remaining ~77 of 98.
- The earlier verifier's 21 example items (93, 107, 114, 135, 156, 163, 170, 205, 212, 233, 240, 254, 268, 289, 296, 310, 317, 324, 331, 345, 352): none now offers a natural alternative. The reason is that none of them is offered an adverb any more.

## 3. Difficulty assessment (required finding)
Slot classes by word kind: adverbial (ADV + MOD), subordinating/coordinating conjunction (CAUSC, CONTRC, SAAC, COMPC, EXC, TCONJ), quantifier, preposition (PREP, CONTRPREP), restating (UCONJ, ATCL), fragment-introducer (EXADV).
- Pool word pairs analysed: 4,964 (every allowed distractor word x every item). Pairs where the distractor shares the answer's slot class: 0 (0.0 percent). Items with at least one same-slot distractor: 0 of 359. CONFIRMED: the implementer's statement that 359/359 items now offer only syntactically impossible distractors.
- Composition: 238 of 359 items (66 percent; 194 ADV + 44 MOD) have an adverbial answer; their only possible distractors are fordi/eftersom/idet, men/mens/hvorimod/selvom, i modsætning til, det betyder, sammenfattende kan man sige. The other 121 items (conjunction, quantifier, preposition, example, restatement answers) are offered adverbs/quantifiers/other kinds.
- Meaning-only wrong distractors: 0 of 4,964 (0 percent); syntax/word-order wrong: 100 percent (the 238 adverbial items also have an extra property: each of their 3 distractors is a function word, so the answer is the only adverb).
- Original behaviour (HEAD, same-category pool): 2,093 of 3,103 pool words (67 percent) shared the answer's coarse slot class, i.e. the learner had to know the meaning to choose, but the pool also contained synonyms (the original bug: 359/359 items could show a conflicting word per the implementer, 215 items explicit synonyms).
- Pedagogical consequence: the learner does NOT need to know the meaning of the target connector to answer correctly. Identifying the part of speech needed by the blank (adverb vs conjunction vs quantifier, plus "does a verb follow directly") is enough, and with only 20 distinct pools the learner can also learn which handful of function words are never answers for adverbial frames (fordi, men, mens, hvorimod, selvom, i modsætning til, det betyder, ...). The game no longer trains distinguishing derfor from desuden, kort sagt from til sidst, naturligvis from måske, etc.; this was the main learning purpose of the Forbindeord game and of the story's own implementation note ("cross-category distractors must fit the word-order slot too, or the distractor becomes trivially wrong"). Item 172 is the single case where this was partly reversed.
- Conclusion: the retry removes the unfairness (no valid synonym or natural alternative, apart from 172) by removing the difficulty. This is a product trade-off the owner must decide (see recommendation).

## 4. Diff scope and regression checks
- `git diff -- forbindenor/Forbindenor.html`: one hunk (@@ -704,15 +704,132 @@) adding the safety block (SYN_GROUPS, KIND_WORDS, KIND_PAIRS, WILDCARD, ITEM_EXCL, ITEM_ADDKIND, helpers) and replacing the body of `distractors()`. `LS_KEY` ('forbindenor_v1'), `perWord`/`perCat`, scoring, DATA rows, `records`, `cat`/`catEn` unchanged. byCat/allAnswers remain but are unused by `distractors`.
- Smoke (`smoke.mjs ../forbindenor/Forbindenor.html`): all content/a11y/layout/contrast/focus/localStorage-blocked checks PASS; the 4 `#btn-play` and 3 "console clean + still playable" checks FAIL = the known legacy artefact (no `#btn-play`). No files written into the repo by the smoke run.
- Drive (26 answers: 20 right, then wrong until energy ran out): every question had 4 unique options including the answer, end screen reached ("Energien er brugt op efter 26 sekvenser"), `forbindenor_v1` total 26 / correct 20, 0 console errors, 0 page errors, 0 failed requests.
- No regressions found.

## 5. Acceptance criteria
| Criterion | Result | Evidence |
|---|---|---|
| Distractors never a synonym or functional equivalent of the answer in that sentence | FAIL (one item) / otherwise PASS | 0 synonym-group conflicts in 107,700 draws; hand review of 98 items (all earlier examples) found no natural alternative except item 172 (tidligere/yderligere/senere forslag). About 20 UNCERTAIN items (men + inverted verb, 226, V3 policy) for a native. Passing is achieved by making all distractors cross-slot (option (a) without "matching syntax"). |
| Synonym-group table covering the listed clusters | PASS (table) / NOT VERIFIED (native sign-off) | `SYN_GROUPS` covers Eksempel, Holdning, Konsekvens, Forklaring, Tid, Opsummering and more |
| Multi-connector frames get an `accepted` list or are rewritten | PASS by exclusion, with exception 172 | No `accepted` lists. Because no same-slot word is ever offered, the learner cannot pick another valid connector, so excluding doubtful distractors is an honest equivalent for the distractor side. Item 172 stays an open frame and now even offers natural distractors. Key-side open frames (143-146, 172 "alle") stay unrewritten. |
| 359 x 50 draws find no distractor in the synonym group | PASS | 359 x 300 = 107,700 draws, 0 |
| 4 options, no duplicates, answer present | PASS | 107,700 draws + 26-answer drive |
| Keep `cat`, storage keys, scoring | PASS | one-hunk diff review, storage shape verified in drive |
| Zero console errors in play + end screen | PASS | drive |
| Native sign-off | NOT VERIFIED | outstanding for KIND_WORDS/KIND_PAIRS/WILDCARD/SYN_GROUPS/ITEM_EXCL/ITEM_ADDKIND |

## Verdict and recommendation
Findings: (1) item 172 offers natural distractors (`tidligere`, `yderligere`, `senere` as determiners) because of `ITEM_ADDKIND`; remove that entry (or exclude those three words for 172); alternatively reword 172 or add an `accepted` list (`alle`). (2) Everything else passes mechanically, and in the reviewed sample the remaining distractors read as clearly wrong or UNCERTAIN (native).
(3) The difficulty trade-off is real and the owner must decide: the game now tests part-of-speech/word-order rather than the meaning of connectors in 359/359 items (66 percent of items offer exactly one adverb among function words). Options: accept; show the translation before answering and re-allow same-class distractors; or write per-item `accepted` lists after native review and bring back same-category distractors. Native review of the UNCERTAIN groups above is needed in any case.

Verification: FAILED (criterion 1: item 172 offers natural-reading distractors; native sign-off NOT VERIFIED; the owner must decide the difficulty trade-off, which is a separate decision from the 172 fix)
