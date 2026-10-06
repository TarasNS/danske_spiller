# VERIFY US-017 — Glosekort: mødes participle and notes/examples (verifier V-GEM)

Method: extracted the `verbs` array from HEAD and the working copy and diffed field by field (`impl/V-GEM/order.cjs`); loaded a seeded old save at index 96 (mødes) and read the card.

| Criterion | Result | Evidence |
|---|---|---|
| `mødes` has `pastParticiple:'mødtes'`. | PASS | Card shows "TILLÆGSFORM: mødtes"; field diff confirms. |
| Each listed note and example is corrected as specified. UNCONFIRMED items change only after native confirmation. | PASS (structure) / wording NOT VERIFIED natively | Exactly 8 field changes vs HEAD (rejse.note, vride.note, måtte.translation, opgive.example, ryge.note, mødes.pastParticiple, prøve.note, spørge.note), matching the story list. The two UNCONFIRMED items ("Skoene slider", "Slippe af sted med") untouched. |
| aria-label "Pronounce" handled in US-028 (not here). | PASS | Untouched. |
| Smoke passes; cards render. | PASS | `smoke.mjs ... '#right-btn'` Verdict PASS; seeded card rendered; zero console errors. |

Progress safety: array length 150 and infinitive order identical to HEAD (`order same true`). Old save (3 correct, 2 wrong, index 96) loads intact: "Kort 97 af 150", Rigtige 3 / Forkerte 2, persists after reload. `saveProgress` stores statuses/indices only.

UNCERTAIN list (native review; none failed by me):
1. rejse note: "fx »Hun rejser i morgen tidlig«. Om tog siger man »køre« eller »afgå«." Plausible, terse.
2. opgive example "Han giver aldrig så let op." Story-prescribed; the example no longer contains the infinitive form.
3. ryge note "Det røg ud ad vinduet" (story-prescribed "ad"); the sentence as an example of "forsvinde" is itself slightly odd.
4. vride note: "vride sig betyder at sno sig, fx af smerte eller for at slippe fri".
5. måtte gloss 'may / must' (story-prescribed).
6. prøve note: "om tøj siger man »prøve en jakke« eller »prøve noget på«".
7. spørge note: "»spørge efter« bruges, når man beder om at få eller tale med nogen eller noget, fx »spørge efter chefen«" (clumsy wording, content plausible).

Scope: only the listed `verbs` fields. Regressions: none.

Verification: NOT VERIFIED — structural/data criteria PASS, but the story depends on native-speaker sign-off for the implementer's own rewritten notes (list above).
