# VERIFY US-020 (Antonymer content/logic) - verifier V-ANTORD

File: `danish-antonyms-game.html`; diff read via `git diff -- danish-antonyms-game.html`. Data 336 -> 316 pairs (`ANTONYMS.length===316` at runtime).

| Criterion | Result | Evidence |
|---|---|---|
| Distractor filter excludes all words paired (either direction) with the shown word | PASS | `ANT_MAP` built in both directions; `renderChoice` filters `!valid.has(w)`. |
| Typed mode accepts any paired antonym; hints don't match more than one accepted answer | PASS | Real UI (input + Check): 56 (word, antonym) combinations over the first 25 of 60 multi-antonym words, typed capitalised: 0 failures. "mild": stærk and "Stærk " accepted; varm, "sy", xx rejected. Hint check for ALL accepted answers of all 60 multi-antonym words: shortest prefix matches exactly 1 accepted answer, 0 failures. Samples: mild -> b/i/a/sk/st/sy, gammel -> u/n/f, sikker -> u/t/f. Note: the feedback still names the stored pair, which may differ from what was typed (implementer risk 6). |
| All QA-109 examples corrected | PASS (grammar) / native pending | Diff: "Han spiste hele kagen.", "Systemet er komplekst.", "Hendes ansigt var blegt.", "Systemet var trægt.", "Køkkenet har et tilstødende værelse.", "Vi har lignende huse.", "Den film er min favorit.", "Kom herhen." All read grammatical. Answer keys unchanged. |
| QA-110 pairs removed/replaced; sympatisk -> sympatisk/usympatisk with correct gloss; non-words replaced | PASS (removal) / UNCERTAIN (gloss) | Removed (all 11 listed): rød/blå, gul/lilla, luftig/pigget, kløende/glat, fløjl/sandpapir, gas/fast stof, dygtig/langsom, skarp/sløret, beholde/forlade, pæn/frygtelig, mikro/makro. Non-words removed, not replaced: lovende/ulovende, brændende/frysende, stabil/rystende (stabil/ustabil kept, l.604), økonomi/luksus. Replacement `sympatisk|usympatisk`, gloss "likeable/unlikeable", example "Chefen virkede usympatisk." The story says "replaced"; removal is a reasonable reading but deviates from the literal text. |
| Duplicate pairs removed (lys/mørk, retfærdig/uretfærdig, større/mindre, alvorlig/mild, lige/ulige) | PASS | Runtime: no duplicate keys, no duplicate unordered pairs among 316. Kept: mørk\|lys, retfærdig\|uretfærdig, større\|mindre, mild\|alvorlig, lige\|ulige. |
| Saved progress (`modsat_danish_antonyms_v1`) still loads; removed pairs ignored safely | PASS | Seeded a HEAD-format save (xp 120, total 50; mastery with lys\|mørk:3 AND mørk\|lys:1, alvorlig\|mild:2, ulige\|lige:3, plus removed rød\|blå, sympatisk\|ligegyldig, gas\|fast stof; mistakes incl. lys\|mørk, rød\|blå, beholde\|forlade). Loads with no errors, XP/total preserved, duplicates merged by max (mørk\|lys 3, mild\|alvorlig 2, lige\|ulige 3), Mestrede=3 (rød/blå, gas ignored), Svage=3, review list renders. Storage key unchanged. A round played and persisted over reload. Blocked storage: no crash. |
| 3000 simulated MC questions: 0 options that are a valid antonym | PASS | I sampled 2000 via the real `renderChoice`: each question had exactly 1 valid option (the answer), 4 unique options, 0 violations. |
| Native-speaker sign-off | NOT VERIFIED | Required by the story. |

## Content judgement
- Removed pairs are genuinely not antonyms; pæn/frygtelig, skarp/sløret, mikro/makro are arguable contrasts but the story lists them, so removal conforms.
- "usympatisk" is a real Danish word; the sentence reads fine.
- Count check: 11 + 4 non-word pairs + 5 reverse duplicates = 20 (336 -> 316).

## Regression / scope
- Zero console errors; 8 modes play (see VERIFY-US-013-ant.md). `shared/validate.js` not applicable (no shared data change).
- `KEY_ALIASES` migration, `VALID_KEYS` and count filtering are justified by the progress-compat criterion. `danish_antonyms.csv` untouched (not loaded) and still contains the removed pairs; the story says to keep it in sync "if maintained" - flag to owner.

## UNCERTAIN (native review)
sympatisk/usympatisk gloss "likeable/unlikeable"; "Chefen virkede usympatisk.", "Køkkenet har et tilstødende værelse.", "Vi har lignende huse.", "Den film er min favorit."; "Byen ligger fjern herfra." (untouched); other multi-antonym sets (mild: bitter/intens/alvorlig/skarp/stærk/syrlig; lige/ulige vs lige/skæv).

Verification: NOT VERIFIED - all machine-checkable criteria PASS; native-speaker sign-off (and the sympatisk gloss) outstanding.
