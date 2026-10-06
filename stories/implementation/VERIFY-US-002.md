# VERIFY US-002 - Forbindeord distractors

Verifier: independent (scratchpad `impl/verify-b1/`: `f1.mjs`, `f2.mjs`, `items.json`; Edge, file://). Used the real `distractors()` from the page, 359 items x 300 draws, then my own checks and hand reading.

## Automated results (all 359 items, 300 draws each = 107,700 draws)
- 4 options always (3 distractors + answer), no duplicates, answer always present, answer never in its own distractor list: 0 violations. Smallest distractor pool is 4 (conjunction-type items such as fordi/da/eftersom/idet).
- Synonym check with my own broader cluster table (Eksempel; all Holdning words incl. heldigvis/forhåbentlig; Konsekvens; Forklaring incl. for/nemlig/pga.; Tid/sekvens incl. først/før/så/senere; Opsummering; til sidst/endelig/omsider; Modsætning incl. mens/hvorimod/men/derimod/dog/alligevel/selvom; Uddybning; Tilføjelse; især/specielt; for det første/først og fremmest; både/begge/alle): 0 conflicts. The story examples are fixed (fordi never gets da/eftersom/idet; bagefter never gets derefter/dernæst/derpå).
- Diff: only `distractors()` plus a new helper block (+81/-7). `LS_KEY`, `perWord`/`perCat`, scoring, DATA rows, `records` unchanged.
- Drive: fresh storage, 26 answers (20 right, then wrong until energy ran out), options valid on every question, end screen reached ("Energien er brugt op efter 26 sekvenser"), `forbindenor_v1` shape unchanged (total 26, correct 20), 0 console errors / page errors / failed requests.

## Hand review (51 items: every 7th item from idx 2, one or two drawn option sets each)
Key fact: the English translation (`#tr`) sits inside `.reveal`, which is `display:none` until the learner answers (computed style "none" before answering). The learner judges only the Danish sentence, so a distractor that gives a natural Danish sentence is a defensible answer.

Judged as best I can (not a native speaker):
- No valid alternative among offered options: about 18 of 51 (e.g. 9, 30, 37, 65, 100, 142, 177, 184, 191, 219, 261, 275, 282). Several are safe only because the frame has no verb inversion or needs a preposition, which makes adverb distractors wrong by syntax alone.
- Likely valid alternative among the options (natural Danish, only meaning differs): about 21 of 51. Examples (frame, key, offered distractor):
  - 93 "Planen er dyr, og {} er den urealistisk." key ydermere; derfor, desværre
  - 107 "Han løste opgaven, og {} hjalp han de andre." key tilmed; derefter, derpå
  - 114 "Hun kom for sent og var {} uforberedt." key ovenikøbet; derfor, følgelig, måske
  - 135 "Hun kom ikke; hun var {} blevet syg." key nemlig; naturligvis, sandsynligvis
  - 156 "Han forberedte sig, og {} klarede han prøven." key således; desuden, samtidig
  - 163 "Han løj for os, og {} stoler vi ikke på ham." key af den grund; endvidere, samtidig
  - 170 "Hun er {} klog og venlig." key både; formentlig
  - 205 "{} vil jeg gerne rejse, på den anden side er det dyrt." key på den ene side; selvfølgelig
  - 212 "Ferien var dyr; {} var den uforglemmelig." key på den anden side; muligvis, derudover
  - 233 "Opgaven var svær; {} blev den løst." key ikke desto mindre; senere, desuden
  - 240 "{} hun var træt, blev hun ved." key selvom; da
  - 254 "Vi kan mødes en hverdag, {} på onsdag." key fx; formentlig, sandsynligvis
  - 268 "Vejret er ustabilt, {} om efteråret." key især; sandsynligvis, måske
  - 289 "Prøven så svær ud, men den var {} nem." key faktisk; formentlig
  - 296 "Han kom {} for sent igen." key naturligvis; ovenikøbet
  - 310 "{} må jeg melde afbud i aften." key desværre; følgelig, ovenikøbet
  - 317 "{} har du ret i det." key måske; på den anden side, ikke desto mindre, ligeledes
  - 324 "Hun er {} hjemme nu." key formodentlig; heller ikke
  - 331 "Det bliver {} en god høst i år." key sandsynligvis; til gengæld, dermed, derfor
  - 345 "{} bør vi vælge den billigste løsning." key kort sagt; heldigvis, sandsynligvis, på den anden side
  - 352 "{} skal det nævnes, at alle bidrog." key afslutningsvis; måske, naturligvis
- UNCERTAIN (grammatical, sense doubtful or context dependent; needs a native): about 12 of 51 (idx 2, 16, 23, 44, 51, 58, 72, 79, 86, 121, 128, 247).

Root cause: `CAT_OVERLAP` is asymmetric and coarse (Tid does not exclude Holdning; Tilføjelse does not exclude Konsekvens or Tid; Konsekvens does not exclude Tilføjelse; Forklaring and Eksempel do not exclude Holdning), and Holdning words (måske, sandsynligvis, naturligvis, heldigvis...) fit almost any adverbial slot. Slot class is only conj/adv; it does not model verb inversion vs no inversion vs midfield. Exposure proxy: for 268 of 359 items the pool contains Holdning words, and a 3-draw has about 55% chance of showing at least one (exposure measure, not a count of valid answers).

Difficulty risk (not a failure): distractors from other slot classes are often wrong by syntax alone (frames without inversion such as "{} hun var glad"; prepositional "{} tågen"; correlative "dels ... dels"; quantifiers både/begge/alle/hverken/ingen af dem get adverb distractors). Conjunction items have only 4-6 candidates (men/selvom/ligesom/hvorimod...), so they are easy and, being same-class, some are semantically possible (121 men, 128 men, 240 da).

## Acceptance criteria
| Criterion | Result | Evidence |
|---|---|---|
| Distractors never a synonym or functional equivalent of the answer in that sentence | FAIL | No synonyms (0 in 107,700 draws, own table). But about 21 of 51 hand-checked items can offer a distractor giving a natural sentence while the translation is hidden until answering, e.g. "Planen er dyr, og derfor er den urealistisk"; "Han løste opgaven, og derefter hjalp han de andre"; "Hun er formentlig klog og venlig". The story's expected behavior "exactly one defensible answer" is not met. |
| Synonym-group table exists covering the listed clusters | PASS (table) / NOT VERIFIED (native sign-off) | `SYN_GROUPS` covers all listed clusters; sign-off outstanding |
| Frames allowing several connectors get an `accepted` list or are rewritten | FAIL | No accepted list, no rewrites; the exclusion approach does not cover cross-category connectors (derfor/desuden/derefter/Holdning adverbs) that fit the frame |
| Scripted 359 x 50 draws find no distractor in the answer's synonym group | PASS | Ran 359 x 300 on the real `distractors()`: 0 violations (implementer table and my broader table) |
| 4 options, no duplicates, answer always present | PASS | 107,700 draws + live play |
| Keep `cat` field, storage keys, scoring | PASS | diff review; `forbindenor_v1` shape unchanged |
| Zero console errors in play + end screen | PASS | 26-answer drive |

## Recommendation (for the implementer; not done by me)
Make `CAT_OVERLAP` symmetric and add cross-exclusions between Holdning, Tilføjelse, Konsekvens and Tid, or restrict distractors per frame (inversion/midfield/initial), or add per-item `accepted` lists; alternatively show the English translation before answering (owner design decision). Native review needed for every UNCERTAIN item.

Verification: FAILED (criteria 1 and 3 fail; native sign-off NOT VERIFIED)
