# VERIFY US-022 (Forbindeord + Konjunktioner) - verifier V-FKT

Files: `forbindenor/Forbindenor.html`, `konjunktioner/konjunktioner.html`. Scripts in scratchpad `impl/V-FKT` (`forb.cjs`, `konj.cjs`). I am not a native speaker; Danish judgements are marked.

| Criterion | Result | Evidence |
|---|---|---|
| QA-116: the answer displays and is spoken as "oven i købet". Keep the internal id stable if progress depends on it. | PASS | Rendered sentence "Han tabte spillet, og _____ grinede han ad det."; option text `oven i købet`; filled blank `oven i købet`. `speechSynthesis.speak` spy (click on `.speaker`): "Han tabte spillet, og oven i købet grinede han ad det." Old key migrated: seeded `perWord["ovenikøbet"]={t:3,c:2}` gives an `"oven i købet"` record with counts carried over, and the old key is gone from the saved JSON. The key necessarily changed (it is the display text); migration keeps progress. 4 DATA rows and the SYN_GROUPS entry updated. |
| QA-117: "ligesom hendes mor gjorde" in both games. The UNCONFIRMED lines are reviewed. | PASS | Forb :453 "Hun maler smukt, {} hendes mor gjorde."; Konj :610 "Hun danser smukt, ___ hendes mor gjorde." (confirmed in loaded QUESTIONS). Kept `sin`: forb "Han synger smukt, ligesom sin far" (elliptical, sin = Han: correct), konj "Han er højere, ___ sin storebror" (sin = Han: correct), konj "Han synger godt, ___ hans far altid har gjort" (the clause has its own subject `far`, so `hans` = Han is correct and `sin` would be wrong). The keeps follow the reflexive rule. Native confirmation still advisable. |
| QA-119: each listed item's distractors are replaced with options that are clearly wrong in the frame. | NOT VERIFIED (native needed; one doubtful item) | Every listed line (449, 451, 452, 488, 496, 504, 506, 509-511, 526, 531, 535, 540, 618, 631, 637, 638, 643, 647, 650, 652, 672, 676, 681-683) is changed in the diff. New sets are mostly at/om/der/hvis/hvem/hvad/hvornår/hvorfor/hvordan, which I judge ungrammatical in their frames; previously valid options (da, når, fordi, hvis, hvor, hvordan) are gone from the Hv-word and eftersom/mens/før/inden/idet items. No answer equals a distractor; all 300 items have 4 unique options. Doubtful: 488 still offers `da` (see UNCERTAIN). The 5 extra changes (455, 457, 524, 527, 537) read fine. |
| QA-120: "Det føles, som om…". | FAIL (as worded) | The criterion requires the sentence to read "Det føles, som om…". Current line 424: `["at","Jeg føler, ___ sommeren aldrig kommer i år.",["om","som","da"]]`. The implementer's reason (a blank on `at` cannot teach "som om") is sound and "Jeg føler, at sommeren aldrig kommer i år." is correct Danish, but it is not the requested wording. Needs owner/native acceptance or a redesigned item. |
| Native-speaker sign-off. | NOT VERIFIED | Not available. |

## Other checks
- Forbindeord: all 359 items played correctly, zero console errors; localStorage-blocked run OK; 107,700-draw check passes (see VERIFY-US-012-forb).
- Konjunktioner: 300 QUESTIONS, all with 4 unique options and none equal to the answer; played 120 correct answers, then wrong answers until Game Over ("Sukkermester!"), then the review round to the review-done screen: zero console errors/warnings.
- Konjunktioner contrast 4.44 on `span "Hv-ord"`: pre-existing. It is the inline-styled start-screen span (line 280, gradient `#19c3b2`-`#52d869`), untouched by the diff; `shared/themes/konjunktioner.css` has no modifications. Smoke reports it in dark and light. Not caused by this story.
- smoke rows: only the known legacy `#btn-play` / "still playable" rows fail on both games (plus the pre-existing Hv-ord contrast on Konjunktioner).

## Scope creep
Only the 5 extra distractor fixes (455, 457, 524, 527, 537), same defect class as QA-119, not on the story's list; the migration code in `loadProgress` is justified by QA-116 ("keep progress"). Nothing else.

## UNCERTAIN (for native review)
- Konj :488 "Jeg drikker te, ___ jeg fryser." (answer når): `da` is still offered; "Jeg drikker te, da jeg fryser" reads as a grammatical causal sentence, so `når` may not be the only defensible answer. `da` also remains in other når/mens/inden items outside the list (e.g. "Du kan lave kaffe, ___ jeg dækker bord").
- Konj eftersom item "___ ingen meldte sig, måtte jeg selv gøre det." still offers `når` ("Når ingen meldte sig, måtte jeg selv..." reads as a valid habitual past) plus `så`/`som`; not on the story's list.
- Fronted `at`/`om` distractors in "___ det allerede er sent, går vi i seng nu" and "___ butikkerne er lukkede, handler vi i morgen": I judge them wrong but they are borderline.
- The new at/om/der/hvem/hvad pattern is easy to spot, so these items are close to trivially wrong; the temporal conjunction items (mens/før/inden/idet) no longer offer each other as distractors.
- "hvis" as distractor in "Jeg ved ikke, ___ min nye lærer er" could be read as "whose" (the item offers hvornår/at/hvis).
- Keeping `sin`/`hans` in the three UNCONFIRMED lines (analysis above says correct).

Verification: FAILED. QA-120 fails as worded (sentence is "Jeg føler, at…", not "Det føles, som om…"); QA-119 and native sign-off are NOT VERIFIED (doubtful items above). QA-116 and QA-117 pass.
