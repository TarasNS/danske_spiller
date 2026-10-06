# VERIFY4 US-049 - Konjunktioner (V4-D)

| Criterion | Result | Evidence |
|---|---|---|
| Key handler allows Enter while reviewing | PASS | 390px: 5 wrong answers -> game over (lives 0, 5 mistakes) -> click "Gennemgå fejl" -> Enter advanced through all 5 review items (inReview true each) -> "Gennemgang færdig" screen shown -> Enter restarts (lives 5, idx 0, both screens hidden). 0 console errors. |
| Rule wording V2, punctuation, "siden nytår" item | PASS (machine part) / NOT VERIFIED (native) | Rules og/men/eller/for/så now "hovedsætningsordstilling (V2)" (og: "verbet står på 2. plads"); commas removed before "end"+NP (3 items) and in "præcis ligesom da"; "siden vi fejrede nytår" makes "siden" a conjunction. Diff limited to these lines + the handler. US-022 content untouched (diff). |

UNCERTAIN (native): V2 wording for "for"/"så"; comma omission in "Maden smagte præcis ligesom da bedstemor lavede den"; "Jeg har ikke spist sukker, siden vi fejrede nytår."
Pre-existing, not in story: smoke "Hv-ord" legend contrast 4.44:1 (implementer recorded it too); Enter while focus is on "Gennemgå fejl" fires the keydown start() path first.
Verification: NOT VERIFIED (language items need native sign-off; keyboard criterion PASS)
