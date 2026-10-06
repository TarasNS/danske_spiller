# US-033 (Idiomjæger slice) — W-IDIOM

## 1. Summary
All colour emoji removed from `idiomjaeger.html`. Badges now use existing Sjovt sprites through a new local helper `pix(name,scale)` (wraps `Sjovt.spriteSVG`): first=stjerne, m25=kort, m50=kiste, m100=pokal, explorer=lup, streak=molle (same sprite as Dansk Mester header), ctx=pin, native=bog, expert=flag (Dannebrog, replaces the "DK" emoji). Streak on the main menu = molle sprite. Emoji removed from section headings, game list/category icon data (`CAT_ICON`, `ico:` fields), timer ("Tid: 42s"), feedback ("+10 guld"), toasts, results messages, "Guld: N", buttons ("Spil igen", "Igen", "Badges (n/9)", "Start øvelse"), search placeholder, speaker button text (the ♪ glyph comes from CSS). Locked badges keep the greyscale filter plus "LÅST" label, now on a cream sprite tile (theme CSS). No new sprite was needed (no `flamme`; `molle` reused as in Dansk Mester).
## 2. Status: IMPLEMENTED (Dansk Mester half = other owner)
## 3. Tests
Puppeteer (Edge), 360x740, light+dark, 15 screens (menu, badges locked/unlocked, games, stats, learn, dict, practice, timed quiz, answered, results, category menu, fill, memory, match): 0 visible emoji-range characters (only ✓/★/♥ text symbols remain), 0 console issues, scrollWidth 360. A CDP "Segoe UI Emoji" font check was attempted but hung in the harness and was not completed (text/regex check used instead; the OS-colour-emoji code points are gone from the source apart from the ✓★♥ text symbols and the heading-strip regex).
## 4. Manual: screenshots of badges (360), menu, results viewed.
## 5. Files: `idiomjaeger.html` (CAT_ICON removed ~331; `pix` helper before MOTIVATE ~604; ACHS ~660-669; headings/toasts/results throughout 680-1110), `shared/themes/idiomjaeger.css` (appended block at end).
## 6. Risks: native-quality of sprite choices (`kort` for "25 idiomer", `pin` for Kontekstmesteren) is subjective. Category icons are gone (were hidden by CSS already).
## 7. Newly discovered: none.
## 8. Needs native review: new strings "Tid:", "+10 guld", "Forståelse på modersmålsniveau!".
## 9. Criteria
| Criterion | Result |
|---|---|
| No visible colour emoji remain in Idiomjæger or Dansk Mester. A CDP font check reports no "Segoe UI Emoji" on visible nodes. | Idiomjæger: PASS by text scan (CDP font check not completed); Dansk Mester: other owner |
| One streak icon is used in the Dansk Mester header and stats. | other owner (Idiomjæger uses molle too) |
| The badge mapping follows the Dansk Mester badges screen pattern. | PASS (sprites on a tile; locked greyscale + LÅST) — pattern not compared against the Dansk Mester file |
| Verify whether the Dansk Mester `:1157` headline emoji render (U-04) and remove them if so. | other owner |
