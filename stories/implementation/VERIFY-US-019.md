# VERIFY-US-019 - Præpositioner answer validity (verifier V-PREP)

File: `dansk-praepositioner.html` (working tree vs HEAD 0550623). I am not a native speaker: I failed only what is clearly wrong; doubtful items are in the UNCERTAIN list. Scripts: scratchpad `impl/v-prep/d19.cjs` (evaluates the real `gen()` data block of HEAD and current in node; modes counts/diffitems/grp/distr/wl) and treg.cjs (browser).

## Method
1. `diffitems`: item-by-item diff HEAD vs current (535 -> 534 items; every changed, new and removed sentence reviewed).
2. `grp`: printed the full "wrong" sentence ("Find fejlen"/"Ret sætningen") for all 492 items usable in those modes and read every one.
3. `distr`/`wl`: enumerated every possible distractor of every item (explicit `wrong`, CONFUSE minus `not`, AND the random padding from all 15 prepositions) and tested against a whitelist of valid sentences built from the story text (the templates named in QA-104/105/106; all 17 story-listed HEAD lines 342, 356, 350, 492, 464, 532, 510, 572, 428, 358, 490, 568, 498, 468, 528, 578, 506 map to templates that now carry `not`). The story text contains no literal 23-sentence list; I used its template list. The implementer's own 23-sentence whitelist was not available to me.
4. Browser: translation alternatives, all pair groups started, review mode with old-shape entries, reload persistence, blocked localStorage.

## Criteria
| Criterion | Result | Evidence |
|---|---|---|
| QA-104: each listed template gets an `err` that is ungrammatical in every fill (e.g. "kaffe *af* mælk"), or the template is excluded from mistake/correct modes (`noErr:true`). | PASS (native sign-off pending) | kaffe med -> err "af" ("Jeg drikker kaffe af mælk/en kollega/sukker/fløde"); te uden -> "af"; Temperaturen er under -> "af" ("Temperaturen er af frysepunktet/nul grader/gennemsnittet/det normale"); "Hun rejste uden ..." and "Mødet sluttede uden ..." are `noErr:true` (err null, excluded by `hasSafeErr`; none appears in my `grp` list of 492 error sentences). HEAD produced the valid "Temperaturen er over frysepunktet", "kaffe uden mælk", "te med mælk" as the "wrong" sentence; current produces none of them (whitelist wrong-sentence hits: HEAD 40, current 0). The 6 affected templates also lost their `pair` tag (both options valid). |
| QA-105: per-template distractor exclusions (or `wrong` lists) remove valid alternatives for all listed templates. `CONFUSE` entries no longer contain the key itself. | PASS for the listed templates; residual holes outside the list (see UNCERTAIN 2-6) | CONFUSE af/fra/uden self entries removed (l.314-320; no key contains itself). `not` lists on all story-listed templates. Whitelist test over ALL possible distractors including padding: current 0 fixed-distractor hits and 0 padding hits (HEAD 111 fixed-distractor hits). `distractorsFor` excludes `not` also from padding (l.754). |
| QA-106: "Vi skal lige nå toget" (a different mode or remove the preposition slot); "holder i indkørslen"; one key per "Brevet er …" frame; translation accepts an array of answers. | PASS (with notes) | "Vi skal lige nå til flyet/toget/bussen/mødet/færgen" removed; replaced by "Vi skal lige nå frem til stationen/hotellet/havnen/lufthavnen" (key til, err "i" gives "nå frem i stationen", ungrammatical). This is a third option (rewrite that keeps the slot), not literally one of the two the story names, but removes the defect. "Bilen holder ved indkørslen" removed; new item "Bilen holder i indkørslen" (answer i, noErr, wrong til/for/med; see UNCERTAIN 2). "Brevet er {a}" frames replaced by "Brevet er adresseret til ..." (til) and "Vi har fået et brev fra ..." (fra): one key per frame. TRANS 5th element = array of alternatives; browser: accepts "Vi var hos min farmor", "...bedstemor", "...mormor", "Tak for din hjælp", "tak for hjælpen!", "Jeg bliver færdig om en time", "Jeg er færdig om en time"; rejects "nope". |
| A script over all ITEMS: in mistake mode no wrong sentence equals a whitelisted valid sentence, and no option equals the answer. | PASS | Mine: 0 wrong-sentence hits, 0 option==answer (`distractorsFor` filters `x!==prep` for `wrong`, CONFUSE and padding). Pair mode options are exactly [p.a,p.b] and the answer is always one of them (see VERIFY-US-009). |
| Native-speaker sign-off on the new `err`/distractor choices. | NOT VERIFIED | Needs a native speaker. |

## Other checks asked for
- Pair-group sizes: HEAD i|på 47, i|til 34, af|fra 37, hos|i 28, med|uden 37, om|på 21 -> current 44/34/37/28/21/16. All six groups started in the browser (2 options, sentence shown) and play; 1080 pair questions in the US-009 run had no problem. Smallest per-level pools: med|uden A1 5, om|på A2 16 (level fallback covers empty levels).
- `reviewQ` shape: `addReview` stores `{text,a,ex,theme,err,wrong,not}`, i.e. only `wrong` and `not` added (null by default). Note: `err` is `null` for `noErr` items (before: always a string); nothing reads `err` in review mode. Old-shape entries (no wrong/not) saved in localStorage survive reload and render/answer correctly in "Gentag fejl", 0 errors. Storage keys `praep_mester_v1`, `praep_speed_best` unchanged; item identity = sentence text.
- Keys: `a` of every retained item unchanged (diffitems shows no `a` change). Removed items (Brevet er til/fra x10, Bilen holder ved indkørslen, nå til x5) can remain in old reviewQ; they render from their stored text.
- Regression: 0 console errors across modes, US-004 try/catch guards intact (l.680-687, 1288-1289, 1355, 1401), blocked-localStorage run OK, smoke only legacy-artefact rows fail.

## UNCERTAIN (for native review)
Implementer's list (US-019.md section 8: all new `err` choices, the `noErr` templates and splits, every `not` list, the new sentences, the translation alternatives) plus mine:
1. "Huset ligger til stranden/søen/skoven/havet/vejen/kysten" (new err "til"): ungrammatical to my reading, but "ligge til" exists in other senses.
2. "Bilen holder i indkørslen": explicit distractors include **for**; "Bilen holder for indkørslen" (blocks the driveway) looks VALID Danish. "til indkørslen" doubtful. Also "ved indkørslen" was valid at HEAD; a learner typing "ved" in Udfyld is now marked wrong.
3. "Temperaturen er under frysepunktet/nul grader": fixed distractors are `i` and `ved` (plus random padding such as `på`). "Temperaturen er ved frysepunktet/ved nul grader" and "på frysepunktet" look valid. `not` lists only "over".
4. "Hun sidder ved vinduet/..." (`not` = i, på) and "Han står og venter ved ...": the padded distractor can still be `under` or `over` ("Hun sidder under vinduet" is valid).
5. "Katten ligger under bordet/...": `not` = i, ved, but padding (2 of 11 candidates) can offer **på** ("Katten ligger på bordet" is valid).
6. "Huset ligger ved skoven/havet/...": fixed distractor `i` ("Huset ligger i skoven" is valid).
7. "Vi har fået et brev fra X" with distractor `til` ("et brev til banken" odd but grammatical).
8. "Jeg er færdig om en time" etc.: `på` is excluded, but padding can offer `efter` ("færdig efter en time").
9. Padding in general: 69 templates need padded distractors (`distr`, PAD>0). Any template whose `not` list is shorter than its set of valid prepositions can still show a valid option. The implementer states this risk; confirmed.

## "Newly discovered" templates with valid alternatives (pre-existing, NOT failed)
Confirmed pre-existing by `diffitems` (err/pair unchanged vs HEAD, at most `not` added):
- Implementer's list: "Han gik ud uden jakke/..." err `med`; "Vi klarer os ikke uden hjælp/..." err `med`; "Vi mødes ved indgangen" err `i`; "Jeg tager med bussen" in pair mode (med|uden).
- Found additionally by me: "Han kom efter frokost/..." err `til` ("Han kom til frokost" is valid Danish; `til` is also a fixed distractor); "Bilen holder ved fortovet/kantstenen/porten" err `på` ("holder på fortovet" valid); "Vi bor lige ved havnen/..." err `på` ("bor lige på torvet" valid); "Jeg cykler til arbejde/..." err `på` ("cykler på arbejde" valid and common); "Børnene går i skole/biografen/byen/teatret" err `på` ("går på byen", "på teatret" valid); "Jeg arbejder på ... en café/biblioteket" err `i` (valid); hos|i group: "Jeg arbejder hos Netto" vs "i Netto", "Det kan du købe hos bageren" vs "i bageren", "Hun bor hos sin tante" err `med` (all valid); "Det skete under ferien/middagen" err `over` ("over ferien/middagen" valid); "Hun længes efter ..." err `til` ("længes til sommeren" is valid colloquially); "Jeg kan slet ikke leve uden kaffe" err `med`; "Lampen hænger over bordet" err `under` (grammatical, semantic only).
These are the same defect class as QA-104 but outside the story's list; recommend a follow-up story (US-044 area).

## Scope creep
- `try/catch` additions around speed-best/stats/reset belong to US-004 (Batch 1), not US-019; `data-sd-motion` check and `revealFeedback` belong to US-013. `hasSafeErr` replaces the inline lambda (needed for `noErr`). Item splitting (reolen/hylden/sengen, toget/sofaen, indkørslen) reorders ITEMS; justified by QA-105/106. No unrelated refactoring, formatting or content changes found beyond the data in the diff.

## Verdict
No criterion FAILS: every listed template is fixed, and the story-derived whitelist yields 0 hits in wrong sentences, fixed distractors and padding. The native-speaker criterion is NOT VERIFIED, and UNCERTAIN items 2-6 are probable remaining valid-distractor holes just outside the story's explicit list.

Verification: NOT VERIFIED (native-speaker sign-off outstanding; all machine-checkable criteria PASS; residual valid-alternative risks listed above)
