# VERIFY US-013 (Ordstillingsdetektiven slice) - verifier V-ANTORD

Files: `ordstilling-detektiv/index.html`, `shared/themes/ordstilling.css`. Scripts: scratchpad `impl/V-ANTORD/ord1.cjs ord2.cjs ord3.cjs` (real tile / UNDERSØG / NÆSTE clicks, Edge). Rects are top-bottom vs innerHeight; the fixed `.sd-bar` MENU bar is 56px tall.

| Criterion | Result | Evidence |
|---|---|---|
| From the 2nd statement on, tiles and UNDERSØG visible without scrolling at 1366x768 and 390x844 | PASS | d1366 stmts 2-8: tiles 340-396, UNDERSØG 416-468 (vh 768). m390 stmts 2-8: tiles 162-375, UNDERSØG 238-447 (vh 844). Story `<details>` closed from stmt 2, `keepAnswerInView()` scrolls. HEAD repro: tiles 807 / 998, UNDERSØG 883 / 1074, never visible. |
| After checking, Next is in view and focused | PASS | d1366 NÆSTE 624-710, m390 619-835, m360 543-628; `document.activeElement.id==="nextBtn"` after every check (correct and wrong), 4-8 statements per viewport. HEAD: Next 1090-1616, no focus. |
| Geometry at d1366, m390, m360: feedback and Next inside innerHeight (or auto scroll) | PASS | As above plus m360x640: NÆSTE 543-628, verdict 108-251, tiles/UNDERSØG in view from stmt 2. 0 console errors at all viewports. |
| With reduced motion, scrolling is instant | PASS (code) | All scrolls use `behavior:"auto"`; no smooth scrolling anywhere. |

## Judgement items
1. **Statement 1 is NOT fixed.** The story is open on stmt 1: tiles top 855 (d1366), 1046 (m390), 1048 (m360); UNDERSØG 931 / 1190 / 1200 - below the fold at all three viewports, and 48 px worse than HEAD at d1366 (HEAD 807) because of the added `<summary>` row. The acceptance text only requires "from the 2nd statement on", so the criterion is met, but the Problem text ("each of the 12 statements") is unresolved for the first statement of every case, the one where the layout is least familiar. At 390 even the English prompt is at 884 (off-screen). Owner should decide whether statement 1 should also start collapsed or auto-scroll.
2. **Collapsing the story from stmt 2:** acceptable. It is re-openable ("Sagens baggrund") and reopens on statement 1 of the next case; the story is flavour text and the grammar tip still shows after checking. Mild cost: case context disappears after one statement.
3. **New defect at 360x640:** the English line to translate and the answer slot are scrolled ABOVE the viewport on statements 2-12 (English line top -310 to -188 on every statement, ord3). `keepAnswerInView()` only scrolls when UNDERSØG is off-screen; after the preceding NÆSTE scroll the check button is on-screen but the prompt is not, so the learner sees tiles but not what to translate until scrolling up. At 390x844 it was intermittent (one run: prompt top -1/-12, i.e. under the MENU bar, statements 5 and 7; another run clean). At 1366 fine. This does not break a written criterion but undermines the purpose of the story on small phones.

## Regression
- Zero console/page errors; smoke: all PASS except the known legacy `#btn-play` rows and "console clean + still playable" rows; "localStorage blocked: no crash" PASS.
- Progress key `dwod_progress_v1` and shape (`solved`, `best`, `weak`, `finalBest`) unchanged.
- Weak and final modes use the new `<details>` (open on 1st statement) without error.
- Next label is still English ("Next ▸" / "Finish ▸"): pre-existing, US-028.

## Scope
Limited to: `<details class="storybox">` in three headers, `loadQuestion` tail, `keepAnswerInView`, `showExplain` focus/scroll, 4 CSS rules (+ `.storybox` in `shared/themes/ordstilling.css`). The file diff also holds US-023 changes. No debug code.

Verification: VERIFIED (criteria as written PASS). Caveats: statement 1 still below the fold at every viewport; English prompt hidden above the viewport at 360x640.
