# VERIFY4 US-050 - Tidsmaskinen slice (verifier V4-F)

Method: loaded `data.js` from b9242ca and HEAD in node and compared per item (scratchpad `impl/V4-F/cmp.js`, `chk.js`). Result: 1260 ids identical in identical order, no mode changes, **38 items changed** (all 38 read by hand; the brief's "at least 40" cannot be met because only 38 items differ). 0 structural errors across all 1260 items (correct in options, no duplicate options, correct in accepted_answers, no distractor equal to an accepted answer). `node shared/validate.js`: 0 errors, 0 warnings. smoke PASS. Because only data.js changed since b9242ca, US-003's 23 adverb sentences and US-014's changes are byte-identical to the b9242ca state (none of the 38 changed items is an adverb-placement edit); the three passive items ("Der bliver spist ikke...", "...betalt kun...", "...serveret kun...") are not in the diff = unchanged.

| Criterion / named change | Result | Evidence |
|---|---|---|
| "et 12-tal" | PASS | hun-maa-vaere-meget-dygtig, context "Hun fik et 12-tal på eksamen." |
| "et billetsalg" | PASS | alle-billetterne-var-solgt..., context "Du fortæller om et billetsalg." |
| "Al bagagen" | PASS | "Al bagagen ___ af sikkerhedsvagterne." options unchanged and still fit, correct "bliver kontrolleret" |
| "indtil nu" removed from the 10 "aldrig ... indtil nu" sentences | PASS (caveat) | 10 sentences changed (Island, bil, ski, mennesker, ferie, USA, koncert, kat, tolk, fly); no sentence contains "indtil nu" any more; the context still does. Island item now "Jeg ___ på Island." (also fixes "til Island"). Caveat: the time cue lives only in the context line now, so distractors such as "ejede aldrig", "stod aldrig", "så aldrig", "var aldrig" are more defensible on their own (UNCERTAIN). |
| "Vi ___ travlt hele ugen" | PASS | |
| "Dengang" | PASS | |
| "I julen 2022" | PASS | |
| "I sommer" | PASS | context "...I sommer fandt hun en ny." |
| "gik glip af festen" | PASS | |
| "Lad" blank with adjusted options/correct | PASS | "___ nu være med at skrige!", options Ladet/Lader/Lade/Lad, correct and accepted "Lad". Only "Lad" is the imperative; reads "Lad nu være med at skrige!". |
| ringede contexts "to gange/tre gange" | PASS | "...ringede to gange mellem kl. 10 og 10.30..." / "...tre gange mellem kl. 10 og 10.30..." match the sentences. Vi/De context also fixed ("Du fortæller om to gamle venner."). |
| auction context | PASS | "Datoen er fastsat." (was "Din læge har sat det på."); supports "finder". |
| reworded "Skal ikke" notes (3 items) | PASS | "Skal ikke udtrykker en pligt til at lade være; et egentligt forbud udtrykkes oftest med "må ikke"." (wording UNCERTAIN) |
| invented distractors replaced | PARTLY | "er boet/er cyklet/er regnet" -> "ville bo/cykle/regne"; "forberedede" -> "forberedte"; "blev fået/er fået" -> "fik/har fået"; "har flyttet/havde flyttet" -> "er flyttet/var flyttet" (7 items). "har vokset"/"havde vokset" left (implementer flagged for native review). |
| For every changed item exactly one defensible answer | **FAIL** | New distractors "ville cykle" and "ville bo" (søster item) are natural grammatical answers, see below. |
| ids unchanged, correct among options, accepted_answers consistent | PASS | 1260 ids identical; chk.js 0 problems. |
| Six duplicates across modes | NOT APPLIED | Left by the implementer (ids/counts). Listed in the story; no data change. |
| UNCONFIRMED sub-items change only after native confirmation | PASS | none changed |

## Defects introduced by the new distractors
- `hvis-alle-cyklede-mere-ville-der-vaere-faerre-biler-i`: "Hvis alle **ville cykle** mere, ville der være færre biler i byen." is idiomatic Danish (volitional hvis-clause). A learner choosing it is marked wrong. FAIL.
- `hvis-min-soester-boede-taettere-paa-ville-vi-ses-oftere`: "Hvis min søster **ville bo** tættere på, ville vi ses oftere." equally natural. FAIL.
- `hvis-jeg-boede-ved-havet...` ("ville bo") and `hvis-det-regnede-i-dag...` ("ville regne"): grammatical but odd in meaning; weaker. UNCERTAIN.
Suggested fix (not applied, read-only): use clearly wrong forms such as "boet", "skal bo", "bode" for these slots.

## UNCERTAIN list (native review)
- "er flyttet" with "for to år siden" / "for et halvt år siden" (hun-flyttede-til-koebenhavn-for-to-aar-siden, for-et-halvt-aar-siden-flyttede-de-til-koebenhavn): colloquially heard. "I 2005 er de flyttet" is clearly wrong. "Han ___ til Norge, uanset hvad vi siger" with "er flyttet" (han-vil-flytte-til-norge...): grammatical, only context "har besluttet det selv" excludes it.
- "forberedte" for "Hun fortalte, at hun allerede ___ alt til festen": preterite for pluperfect in reported speech is common in speech.
- Ten "aldrig" items: without the cue in the sentence, "ejede/stod/så/sad aldrig" rest on the context line.
- New contexts "Datoen er fastsat.", "Du fortæller om to gamle venner."; "Lad nu være med at skrige" word order; "I sommer" vs "Om sommeren"; the new "Skal ikke" note wording.
- Not fixed, outside the diff: "har vokset"/"havde vokset", "misser jeg bussen/misser du toget", the three ungrammatical passive items, six duplicates, the "nogensinde" frame.

## Test question: "timed expiry: no SRS write" - flaky or caused by data/US-030?
Verdict: **flaky test, not caused by the data or the reset change.**
- Assertion (tests/tidsmaskinen.mjs:529): SRS before == after AND `!srsAfter.items[key]` for the first item of the timed round. The test earlier plays a 10-item round (1 wrong -> box 1) plus one more answer in the same localStorage; `buildRound` (index.html:862-875) puts boxed (just-missed) items plus unseen items into a shuffled 10, so the first item shown is sometimes one already in SRS. Then `key present=true` fails the second conjunct although nothing was written at expiry (before == after still holds).
- Measured: I ran `--only=unlock,timed` six times on a copy of the current files and six times on a copy of the b9242ca baseline (old data, no NULSTIL button), with a note logging whether the first item was already in `srsBefore`. Current: 6/6 PASS (first-item-seen=false each). Baseline b9242ca: 5 PASS and **1 FAIL (run 1: first-item-seen=true, key present=true)**. The full run on the repo: 152/153, this row PASS. So the failure reproduces on pre-change code and correlates exactly with the first item being a previously seen one. The test clears localStorage first and never presses NULSTIL, so the reset cannot interfere.
- Suggested test fix: compare `srsBefore.items[key]` to `srsAfter.items[key]` instead of asserting absence.
- The other failing row in my full run ("auto-advance 700-1000 ms", max 1591) coincided with my parallel verification browsers; re-run alone (`--only=rounds`): 46/46 PASS (min 833, max 1059).
- Dump files: `OUT` redirected to the scratchpad; no `tids-*.json` / `tests/tids-dumps.json` left in the repo.

Verification: FAILED - two changed conditional items (ville cykle, ville bo/søster) now have a natural second answer among the distractors; the duplicates item is not applied; several other new distractors are UNCERTAIN for native review.
