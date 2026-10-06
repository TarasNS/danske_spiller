# US-033 - W-DM slice (Dansk Mester)

1. Summary: the streak icon is now the existing `molle` sprite (same as the header) on the stats page ("Bedste serie") and the result screen ("Dage i træk"), via a `STREAK_ICO` constant. No new sprite needed (`flamme` not used; `molle` satisfies "one streak icon"). Removed the remaining colour emoji from visible text: result headlines (U-04 confirmed: h2 is outside the existing polish() strip list so they rendered), match-complete text, toasts, unlock banner, timeout text, note prefix, CEFR label, flashcard grade buttons, "Hurtig øvelse" title. Leading emoji on .h1/.btn/.cname were already stripped at runtime by the existing polish() hook.
2. Status: IMPLEMENTED (CDP "Segoe UI Emoji" font check not run; replaced by a DOM text scan, see below)
3. Tests: DOM scan for Extended_Pictographic over home/path/modes/stats/badges/flash/finish screens at 360 px: only the hidden speaker "🔊" (CSS font-size 0, shown as ♪) and the plain "↔" symbol in the match instruction. Zero console errors. Smoke as in US-028-W-DM (known `#btn-play` artefact).
4. Manual: stats/result DOM shows the molle svg for the streak.
5. Files: danske-phraser/dansk-mester.html (STREAK_ICO ~534; toasts ~672/836; label ~850; timeout ~988; note ~1017; match text ~1106; headline ~1157; streak ~1169 and ~1227; unlock ~1171; flash buttons ~1037-1038; section title ~813).
6. Risks: speaker button text node still "🔊" in DOM (visually hidden, pre-existing).
7. Newly discovered: none.
8. Native review: none.
9. Criteria:
- No visible colour emoji remain in Idiomjæger or Dansk Mester; CDP font check - NOT VERIFIED (DOM scan PASS for Dansk Mester; CDP not run; Idiomjæger other owner)
- One streak icon is used in the Dansk Mester header and stats - PASS
- The badge mapping follows the Dansk Mester badges screen pattern - PASS (already sprites)
- Verify whether the Dansk Mester headline emoji render (U-04) and remove them if so - PASS (they rendered; removed)
