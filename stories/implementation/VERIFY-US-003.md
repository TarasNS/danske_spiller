# VERIFY US-003 - Tidsmaskinen adverb placement

Verifier: independent (B1b). Repo untouched except this file. Scripts: `scratchpad/impl/verify-b1b/scan3.cjs`, `drive-tids.cjs`. `tests/tidsmaskinen.mjs` was run with `OUT` set to the scratchpad; no files were written into the repo (`git status` clean apart from the other workers' files).

## Diff integrity (own evidence)
`git diff --numstat HEAD -- tidsmaskinen/data.js` = 24 added / 24 removed. Structural diff of `TIDS_DATA` (HEAD vs current, every field of every item in all 9 modes): exactly 23 items changed. Changed fields are only `sentence` (22 items) or `context` + `sentence` (1 item, `han-havde-glemt-allerede-at-ringe-da-chefen-spurgte`). Zero changes to id, options, correct, accepted_answers, note, level or timeline fields; same modes and lengths. 14 pluperfect + 9 preterite_vs_perfect = the listed set. No other item was altered.

## Scan of ALL items (own scan, before vs after)
Heuristic over every non-conditional item: (1) slot with a 2+ word key directly followed by a sentence adverb (allerede, aldrig, altid, ofte, også, stadig, endnu, snart, hidtil, for længst, nu, kun, igen, netop, ikke, ...); (2) filled sentence with participle + adverb + more words.
- Before: all 23 target items hit pattern (2). After: 0 of the 23 hit either pattern; no other item was newly affected.
- Residual hits after the change are, by manual reading, (a) clause-final `participle + allerede/endnu/nu,` (grammatical; out of scope, the story says native review), (b) fine uses of the adverb in the subordinate or pre-verbal slot, and (c) pre-existing problems in OTHER modes (out of US-003 scope, identical in HEAD, so not regressions):
  - passive mode: "Maden bliver serveret kun mellem klokken 11 og 13." ; "Der bliver betalt kun med kort her." ; "Der bliver spist ikke i klassen." (ungrammatical: ikke/kun belong before the participle); "Fødselsdagen bliver fejret altid med kage og flag." (stilted/wrong: "bliver altid fejret"). Worth a separate story.

## The 23 new sentences (answer filled in)
Ungrammatical (FAIL): none. All 23 are grammatical. The neutral Danish position is `aux + allerede + participle`; clause-final allerede/hidtil/for længst is acceptable, mainly colloquial. Rating:
- Natural: "Holdet har vundet alle kampe hidtil." ; "Børnene var gået i seng for længst, da vi kom hjem." ; "Hun havde solgt huset for længst, ..." ; "Jeg var gået hjem allerede, da du kom." ; "Han havde fået visum allerede, ..." ; "Hun havde betalt regningen allerede, ..." ; "Jeg havde læst bogen allerede, ..." ; "Hun havde fundet nøglen allerede, ..." ; "Jeg havde spist frokost allerede, ..." ; "Hun havde skrevet rapporten allerede, ..." ; "Jeg havde sendt svaret allerede, ..." ; "Chefen havde aflyst mødet allerede, ..." ; "Jeg har lavet maden allerede, ..." ; "Vi har ordnet alt allerede, ..." ; "Jeg har spist morgenmad allerede."
- Grammatical but stilted (risk, native review): "Jeg havde handlet i supermarkedet allerede, da du ringede." ; "Min mor havde ringet to gange allerede, ..." ; "Hun har ringet tre gange i dag allerede, ..." ; "Vi har haft tre møder i denne uge allerede." ; "Jeg har drukket tre kopper kaffe i dag allerede." ; "Vi har været to gange i Spanien i år allerede." ; "Der har været mange problemer i denne uge allerede." (allerede after a long adverbial chain reads heavy; "allerede" before the participle would be preferred).
- Reworded: "Han havde glemt opgaven allerede, da chefen spurgte." with context "Han glemte opgaven mandag. Chefen spurgte tirsdag." Grammatical and natural; the content changed from "at ringe" to "opgaven" and the context was edited consistently.
Design note: the story's literal "Expected behavior" is "Jeg var allerede gået hjem" (aux + adverb + participle). The implementer used the story's other allowed route (move the adverb so one slot reads correctly). That meets the criterion text but teaches clause-final placement rather than the preferred pre-participle placement; the owner/native should accept or ask for a two-blank/frame redesign.

## Tests
- `node shared/validate.js`: TOTAL 0 errors, 0 warnings.
- `tests/smoke.mjs ../tidsmaskinen/index.html`: Verdict PASS.
- Own drive (Edge, file://): 12 rounds (6 pluperfect + 6 preterite_vs_perfect, all unlocked levels), 120 answers: 80 correct (accepted, `chosen-correct`, no slip, auto-advance) and 40 wrong (rejected, slip with the correct answer, the Danish note and Videre). 12 pluperfect build-the-sentence steps: correct tile order accepted, wrong order rejected. Every round reached the summary. 0 console/page errors. Only 8 of the 23 changed items were drawn by chance; the other 15 are covered by the data diff and the shared rendering code, not by a live render.
- `node tests/tidsmaskinen.mjs` (own run, OUT redirected): 152/153. The only failure is `correct: auto-advance 700-1000 ms (all modes) :: n=144/144 min=813 max=1314` (same as the implementer's run). It is a timing assertion in headless Edge, independent of the data.

## Acceptance criteria
| Criterion | Result | Evidence |
|---|---|---|
| Every listed item rewritten, no aux+participle+adverb+object | PASS | 23/23 changed, scan 0 residual |
| Ids stable | PASS | 0 id changes; only sentence/context differ |
| Scan finds no `<aux> <participle> (allerede/for længst/hidtil/endnu) <object>` | PASS | own scan before/after |
| Clause-final cases reviewed by native | NOT VERIFIED | native |
| `tests/tidsmaskinen.mjs` passes | FAIL (timing flake only) | 152/153; one timing check (max 1314 ms), reproduced in two runs; not data related |
| Native sign-off | NOT VERIFIED | native |

## Regressions
None found. validate and smoke clean; 0 console errors; the only spec failure is the timing assertion (also present for implementer; I did not run it on HEAD data, but it measures auto-advance timing across all modes, not content). Out-of-scope passive-mode word-order issues listed above are pre-existing.

## Verdict
Verification: NOT VERIFIED. Content and data criteria are PASS (23/23 fixed, nothing else altered, grammatical, validate/smoke/live drive clean). The strict "tests/tidsmaskinen.mjs passes" criterion is not met because of one reproducible timing assertion unrelated to this change; if the owner accepts that flaky check, this story is VERIFIED pending native sign-off. 7 sentences are flagged as stilted for native review.
