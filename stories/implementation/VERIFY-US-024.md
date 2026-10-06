# VERIFY US-024 — En/Et: correct the "øl" note (verifier V-GEM)

Diff vs HEAD: only line 579: note `"Det hedder »en øl«. Bestemt form: ølen."` -> `"Bestemt form: øllen. (Både en øl og et øl bruges.)"`. Data `a:"en"`, `d:"øllen"` unchanged. `answerArticle` scores `sel === current.a`, so choosing "et" for øl is marked wrong.

| Criterion | Result | Evidence |
|---|---|---|
| The note is corrected (story text: "Bestemt form: øllen. (Både en øl og et øl bruges.)") | PASS | Exact string; definite form now agrees with data (`øllen`). |
| A native speaker decides whether to accept both en/et for øl or to drop the item; that decision is implemented. | NOT VERIFIED | No decision made or implemented. |

Judgement on the note/scoring mismatch: the story's Expected behavior says "Either accept both genders or replace the item", so the note change alone does not finish it. As shipped, a learner who answers "et" for øl is told "Det rigtige svar: en øl" next to a note saying both are used: internally contradictory. The implementer disclosed this and left the decision to native review; I treat it as an open item, not a pass. The note's Danish ("Både en øl og et øl bruges") is UNCERTAIN for native review (story-prescribed).

Scope: one line. Regressions: none (console clean during UI rounds).

Verification: NOT VERIFIED — the accept-both / replace-item decision (and native confirmation of "et øl") is outstanding.
