# VERIFY4 US-028 - Præpositioner slice (verifier V4-B)

Files: `dansk-praepositioner.html`. Baseline `b9242ca`.

| Criterion | Result | Evidence |
|---|---|---|
| Every string listed is replaced ("🎯 Multiple choice" -> Flervalg) | PASS | Live DOM after `startMode('mc')`: `.badge` text "Flervalg" (baseline: "Multiple choice"). Diff: `exShell("🎯 Flervalg", ...)` only. The `noEmoji()` helper strips the 🎯 from the visible badge (the emoji label is not part of this story). |
| Grep across game files returns 0 user-visible hits | PASS | Grep of the page and its theme CSS: only a code comment ("SENTENCE CORRECTION") matches `CORRECT`; no UI string. |
| Accessible names are Danish | PASS | The only aria-label is "Udtal sætningen". Smoke "icon buttons labelled" PASS. |

Regressions: none. Smoke ran to completion in the background (all rows PASS except the legacy `#btn-play` / "still playable" artefact rows). Blocked-storage run of Lynrunde and Forvekslingspar: 0 console errors. All 8 playable modes started and answered in a scripted drive with 0 console errors.
Scope creep: none.
UNCERTAIN: none.

Verification: VERIFIED
