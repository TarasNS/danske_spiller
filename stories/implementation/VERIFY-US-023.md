# VERIFY US-023 (Ordstillingsdetektiven tips / alternatives) - verifier V-ANTORD

File: `ordstilling-detektiv/index.html` (diff via `git diff`). Test script `ord4.cjs` in the scratchpad drives the real tiles and UNDERSØG button.

| Criterion | Result | Evidence |
|---|---|---|
| All listed tips say: "Infinitiven/tillægsformen står efter grundleddet (og evt. ikke); objekt og andre led følger efter." | PASS (wording) / native pending | No "til sidst"/"sidst" claim remains anywhere in the file (grep). Case 7 tip: "...Infinitiven står efter grundleddet (og evt. ikke); objekt og andre led følger efter: Jeg · kan · tale dansk, Han · kan · ikke · komme." Case 7 story: "...sætte modalverbet på anden plads og hovedverbet i infinitiv efter grundleddet". Case 8: "Førnutid = har (på anden plads) + tillægsformen. Tillægsformen står efter grundleddet (og evt. ikke/aldrig); objekt og andre led følger efter: Jeg · har · købt · en bil, Jeg · har · ikke · set …". Case 11: "...Lad modalverbet eller hjælpeverbet stå på anden plads; infinitiven/tillægsformen står efter grundleddet (og evt. ikke), og objekt og andre led følger efter." Case 12: "...hjælpeverbet står på anden plads; infinitiven/tillægsformen står efter grundleddet (og evt. ikke), og objekt og andre led følger efter; adverbier står før det infinitte verbum." All are correct statements of Danish word order. Wording adapted per case rather than verbatim; judged faithful. |
| Items support alternatives and the check accepts any (or instruction states exact sentence) | PASS | Field named `alt`. Check is case-insensitive over canonical plus each alt (string or array). Real UI: all 8 alts accepted (Kaffe drikker jeg / En bog læser han / Mælk køber jeg / Bedstemor besøger vi / Te drikker vi / Vinduet åbner jeg / Døren lukker han / Musik elsker jeg), verdict "✓ Sagens logik holder!". Canonical order of all 8 still accepted. Wrong orders rejected (e.g. "drikker Jeg kaffe", "læser Han en", the second permutation tried for each of 8 items, reversed 4-token order). An item without `alt` ("Vi spiller fodbold") rejects the reversed order. All alts are permutations of their canonical tokens (0 bad). Solution panel (#sol) shows the matched order ("Kaffe drikker jeg" for the alt answer; canonical for canonical or wrong answers); the TTS button speaks the same text. |
| `alt` flows through weak and final modes | PASS | Weak queue had alt on 8 of 25 items; alt accepted in weak mode, panel shows "Kaffe drikker jeg", weak counter 3 -> 2 as before. Final queue (100 items) contained 10 alt items; alt accepted ("Musik elsker jeg"). No errors. |
| Case 6 questions end with "?" | PASS | `CASES[5]`: 26 sentences, all end "?"; no other case does; "Hvor bor du?" built from tiles is accepted. "?" is attached to the last tile (tokens split on space), which hints the final word (implementer risk). English prompts untouched. |
| `G.lives` clamped to at least 0 before `String.repeat` | PASS | `G.lives=-2` -> "♡♡♡" with no exception; 5 -> "♥♥♥"; 0 -> "♡♡♡". |
| Weak-mode / rank storage unchanged | PASS | Key `dwod_progress_v1`, same shape, weak keyed by case number; weak decrement works as before. |
| Native-speaker sign-off on tip wording and any alternatives | NOT VERIFIED | Required by the story. |

## Regression / scope
Zero console errors; smoke only shows the known legacy failures. Only 8 alts added (case 1); other topicalisable items still accept one order and the instruction text is unchanged (implementer noted). Case-insensitive compare means "Jeg"/"jeg" capitalisation is not tested (accepted trade-off). Diff scope: tips/story, alts, "?", lives clamp, check/solution; the file also carries US-013 changes.

## UNCERTAIN (native review)
The 8 alt sentences (marked topicalisations; grammatical to me, but "Mælk køber jeg", "Te drikker vi", "Døren lukker han", "Musik elsker jeg" are contrastive/less neutral); new tip wording in cases 7, 8, 11, 12; case 7 story line; "(og evt. ikke/aldrig)"; case 11 keeps "øvrige verber" ordering chain.
Out of scope but noticed: case 2/3 items with fronted adverbials would also logically accept subject-first orders (implementer flagged).

Verification: NOT VERIFIED - all machine-checkable criteria PASS; native-speaker sign-off on tip wording and alternatives outstanding.
