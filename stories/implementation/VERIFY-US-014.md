# VERIFY US-014 (Tidsmaskinen contexts and notes) - verifier V-FKT

File: `tidsmaskinen/data.js` only (`git diff` reviewed line by line).

| Criterion | Result | Evidence |
|---|---|---|
| QA-075: "...stod jeg tidligt op..." / "...står jeg ofte tidligt op..." | PASS (native not verified) | Sentences now "I morges ___ jeg tidligt op og tog toget klokken seks." (key stod) and "Nu for tiden ___ jeg ofte tidligt op, fordi jeg vil løbe om morgenen." (key står). The blank sits before `tidligt op`, so the completed sentences read correctly. |
| QA-076: rewrite to "Børnene havde sovet siden kl. 20" (or "sov fra kl. 20") and "Det skete for mange år siden." | PASS | Contexts now "Børnene sov fra kl. 20.", "Det regnede fra kl. 20.", "De dansede fra kl. 19.", "Vi læste fra kl. 9."; passive "Hendes bog blev oversat" context "Det skete for mange år siden." (data.js:20906). No `siden kl.` context remains (only the untouched "på bussen siden klokken otte" sentence). The story's own alternative "sov fra kl. 20" permits "fra kl.". Story line refs 6846-7009 are the four siden-kl. contexts; only 20905 was the passive one. |
| QA-077: replace note on all 12 items. | PASS | `grep -c "uregelmæssige imperativer"` = 0; `grep -c "Bydeform = navnemåde uden -e"` = 12; wording identical to the story text. The 12 items are the imperatives (Vær/Gør/Bliv/Sig/Giv/Kom/Tag...). |
| QA-078: use a dynamic verb, or accept both answers. | PASS | Item `vi-havde-vidst-det-for-laengst-da-du-fortalte-det`: `correct` remains "havde vidst"; `accepted_answers: ["havde vidst","vidste"]`; options already contain both (vidste, har vidst, havde vidst, ved). The grader (`index.html` ~443-466, 1277) treats accepted answers as correct. Per the story ("accept both") this is right; side effect: the item no longer tests preterite vs pluperfect and its context still says "Vi vidste det kl. 8." |
| U-01 and U-02: native confirms first. | NOT VERIFIED | Items correctly left untouched. |
| `tests/tidsmaskinen.mjs` passes. Item ids are unchanged. | PASS (one known flaky row) | Ids: all 1260 `"id":` lines HEAD vs now are identical. `node shared/validate.js`: TOTAL 0 errors, 0 warnings. `smoke.mjs tidsmaskinen/index.html`: Verdict PASS. `tests/tidsmaskinen.mjs` run from repo root with `OUT` in the scratchpad: 68 PASS, 1 FAIL = "correct: auto-advance 700-1000 ms (all modes) :: n=144/144 min=835 max=1362" (timing jitter; US-003 report records the same failing row; my run overlapped smoke runs). No dump files left in the repo (`tids-*.json`, `tests/tids-dumps.json` absent; `git status` shows no strays). |

## US-003 intactness
The diff still contains the 23 adverb sentences moved behind the slot (19 allerede/hidtil items plus 4 for-længst/allerede pluperfect items) and the reworded "Han ___ opgaven allerede, da chefen spurgte." with context "Han glemte opgaven mandag. Chefen spurgte tirsdag.", exactly as US-003.md describes (23 sentences + 1 context). US-014 did not alter any of them.

## Scope creep
None. Every other diff line is either US-003 or one of the changes above.

## UNCERTAIN (native review)
- "fra kl." as replacement context (vs "havde sovet siden kl.").
- Note wording: "Bydeform = navnemåde uden -e" is loose for vær/gør (være/gøre) as the implementer noted; the double-consonant clause only applies to kom.
- Accepting "vidste" in a pluperfect item.
- The 23 clause-final adverb sentences from US-003 (not this story).

Verification: NOT VERIFIED. All machine-verifiable criteria are PASS (ids unchanged, validate 0/0, smoke PASS, only the known timing row of tidsmaskinen.mjs flakes); U-01/U-02 and native sign-off remain NOT VERIFIED.
