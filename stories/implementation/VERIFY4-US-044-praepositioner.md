# VERIFY4 US-044 - Præpositioner (verifier V4-B)

Files: `dansk-praepositioner.html`. Baseline `b9242ca` copy driven with the same script.

| Criterion | Result | Evidence |
|---|---|---|
| The XP rule is decided by the owner and implemented consistently | NOT VERIFIED | Implemented: Lynrunde hit +10 XP (`record()` only; the extra `prog.xp+=5` removed). Measured one hit: current `prog.xp` +10, baseline +15. Speed "Point" stays +10 per hit and `record()` still gives +10 correct and +2 wrong in every mode, so Lynrunde now matches the other modes. The story names 10 XP per hit as the default, so the implementation fits the story text; the owner decision is still outstanding. |
| Listed wording fixed: "I tjeneste af nogen" -> "I nogens tjeneste" | PASS | TRANS note now "I nogens tjeneste tager 'for'." |
| "Indvendigt i lukkede rum" -> "Inde i..." | PASS | Note now "Inde i lukkede rum bruger man 'i': ..." (live data). |
| "bolig-udtryk" -> "boligudtryk" | PASS | "Særlige boligudtryk tager 'på'...". |
| "Du arbejder for meget" and "Læg pengene på bankbogen" | NOT VERIFIED | Left unchanged by the implementer pending native review (the story lists them without a rule). |
| UNCONFIRMED variants change only after native confirmation | PASS | Not touched ("cykler på arbejde", "arbejder i Netto", "en tid til lægen"). |

Regressions: none. 0 console errors across all 8 playable modes (Pairs mode and the US-019 pair filter start fine), blocked-storage run clean, smoke complete (only legacy artefact rows fail). The existing `revealFeedback` calls are intact. Scope creep: none.
UNCERTAIN (native review): the three new wordings ("I nogens tjeneste", "Inde i lukkede rum", "boligudtryk" read as correct Danish to me); the "for meget" degree-word note; "bankbogen".

Verification: NOT VERIFIED (XP rule needs owner confirmation; two QA-107 items left for native review)
