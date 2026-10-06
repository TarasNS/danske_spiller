# VERIFY4 US-045 - Antonymer (verifier V4-B)

Files: `danish-antonyms-game.html`. Script `impl/V4-B/ant.cjs`, baseline `b9242ca` copy for comparison.

| Criterion | Result | Evidence |
|---|---|---|
| Find par shows the correct partner and a TTS replay after a miss | PASS | After tapping left "beundring" then right "asymmetrisk": `#feedbackArea` shows "IKKE HELT - beundring ⇄ foragt - admiration ⇄ contempt - Følelser - Svær", both example sentences, the note "»beundring« betyder admiration. Det modsatte er »foragt« (contempt).", 4 speaker buttons, and `speak()` is called for the pair. Fortsæt stays hidden (inline mode), and feedback clears when the next left word is tapped. Baseline: red flash only, no feedback, 0 speaker buttons. |
| ...and attributes the miss to the tapped word's pair | PASS (interpretation) | Baseline recorded the miss against the wrongly tapped partner's pair (`identisk|forskellig`). Current records the prompted left word's pair (`beundring|foragt`, `mild|alvorlig`, `massiv|lille`) and `session.asked` +1. The story text "the tapped word's pair" is ambiguous in a two-tap game; the prompted (first-tapped) word is the sensible reading, since the learner is being asked about that word. The wrongly tapped right-hand word's own pair is not penalised. |
| Listed examples are rewritten | PASS (grammatical); native sign-off NOT VERIFIED | "Vi bor nær skolen."; "Hun var modvillig og ville helst ikke hjælpe."; "Hun svarede prompte på mailen."; "Den accelererende bil overhalede os." / "Den decelererende bil nærmede sig lyskrydset.". All read as grammatical and plausible. "Det er lys dag." was left (a real expression). |
| Item levels re-tagged or the page label adjusted | PASS | Page label B1-B2 -> B1-C1 in meta description, og:description, intro text and JSON-LD `educationalLevel` (grep finds no remaining "B1-B2"). Items keep Easy/Medium/Hard tags (no per-item CEFR tag exists). |

Regressions: none. 0 console errors on the full drive, blocked-storage drive clean.
Scope creep: none.
UNCERTAIN (for native review): all five rewritten examples (especially "svarede prompte" as an adverb and the accelererende/decelererende sentences); "Byen er fjern herfra." (from US-020) still dubious; whether proksimal/distal and silke/sækkelærred belong; the B1-C1 label; sympatisk/usympatisk (US-020).

Verification: NOT VERIFIED (functional criteria PASS; rewritten Danish examples need native sign-off)
