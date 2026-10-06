# B5b-IDIOM - Idiomjæger (W-IDIOM)

Status: IMPLEMENTED

## 1. Summary
- Linked `shared/tts-button.css` and `shared/sd-extras.css` (root-level paths) after the theme CSS.
- US-029: `speakerBtn()` now renders `<button class="dc-tts-button">` (aria-label "Lyt"; `speak()`/`_spkMap` behaviour unchanged). Explanations (`.explain` x2), dictionary/learn idiom cards (title + example) use `dc-tts-button--sm`; question prompts, memory cards and match items use the normal 48px button. Deleted the game's inline `.speaker` CSS and the theme's `.speaker` + `::before "♪"` rules and the `.mem-card .speaker.small` rule.
- US-038: main menu sprites now per map: learn `kort`, practice `terning`, Spil `tandhjul`, Svage `lup`, Statistik `pokal` (kept), Idiom-ordbog `kiste` (all 32px, one density). `ACHS.ico` now only `stjerne` (first, m25, m50, explorer) / `pokal` (m100, streak, ctx, native, expert). `molle` only remains as the streak chip. Header `kiste` already matched.
- US-039: blanks (`_____` in Udfyld hullet and Fuldfør udtrykket) -> `.sd-gap` via new `gapHTML()`; level badges `lvl-badge` get `sd-badge sd-badge--panel` (theme override added so they are neutral panel colour in light/dark); all 4 `<select>` get `sd-select` (theme select rule split so the shared background/colour/padding/chevron apply and work in dark); back control "⟵ Jagtmenu" -> "← TILBAGE".

## 2. Status: IMPLEMENTED

## 3. Tests (scratchpad `impl/b5b-idiom/`, Edge)
- 1366x768 and 360x640 (also 390x844 earlier), light + dark: zero console/page errors; no h-scroll.
- TTS: question prompt button 48x48, sm in explanations/cards 32x32 (44px hit area via `::after`), match items 48x48; all aria-label "Lyt"; click -> exactly one `speechSynthesis.speak` with `da-DK` (spied); focus ring visible (screenshot).
- Gap present in both fill games (`.q-prompt .sd-gap` true); renders as dashed "?" box; selects with pixel chevron in dark.
- Short round (3 and 10 questions) played, feedback screens checked, memory and match screens viewed.
- `node tests/smoke.mjs ../idiomjaeger.html`: only the known legacy rows fail (`#btn-play` x4, "console clean + still playable" x3); all console/h-scroll/focus/contrast/blocked-storage rows PASS.
- `grep ♪|▶` in the two owned files: only a harmless `.replace(/♪/g,'')` in an aria-label sanitiser (line ~1157, now a no-op); no TTS glyph.
- `git status`: tree has many other workers' changes; my files are `idiomjaeger.html`, `shared/themes/idiomjaeger.css`, this report.

## 5. Files changed
- `idiomjaeger.html`: link tags (~l.289-291), `speakerBtn` (~635), `lvlBadge`/`gapHTML` (~600-601), ACHS (~664-672), menu sprites (~681-686), selects, topbar back label, sm calls at idiom cards/explanations, fill gaps (~1040-1043); inline `.speaker` CSS removed.
- `shared/themes/idiomjaeger.css`: speaker rules removed, select/input rule split, `.lvl-badge` neutral rule added.

## 6. Remaining risks
- sm button frame (2px) lightly touches the neighbouring line on narrow wraps (360px, example sentence after highlighted quote); readable, no overlap of text glyphs seen.
- Inside memory cards the 48px button (was 44px) leaves the card slightly tighter; viewed at 360 px, fine.
- The BEFORE screenshots were not retained as separate files; before state taken from code diff only.

## 7. Newly discovered
- Fixed 3-line top "T" title in quiz screens (title text shows as "T" at 360 px, from the `title:'t'` I passed in my own test harness; not a game issue).
- The "Badge låst op" toast overlaps the first answers briefly (pre-existing).

## 8. Needs native review
None (no Danish content changed; only "← TILBAGE" as the brief specified).

## 9. Criteria tables
US-029 (TTS): ≥44x44 PASS (48; sm via hit area 44, visual 32 - NOT VERIFIED against strict "visible 44" reading); aria-label "Lyt" PASS; one shared look PASS; ♪/▶ removed PASS; TTS behaviour unchanged PASS; tts-button.css linked after theme PASS.
US-038 (icons): menu rows per map PASS; achievements stjerne/pokal only PASS; one density per row PASS; molle streak-only PASS; header kiste PASS.
US-039: (a) gap PASS; (b) badges PASS; (c) selects PASS; (d) dark-surface outliers NA (not in this game); (e) Idiom inline TTS sm PASS; (f) back wording PASS.

## Fix round (W-IDIOM, Batch 5 verifier finding: Statistik `pokal` density)

Change: `idiomjaeger.html` line 685 Statistik card `pokal` `data-scale` 4 -> 2 (sprite unchanged). `shared/themes/idiomjaeger.css` line 101: menu sprite tiles now `inline-flex` centred with `min-width/min-height: 64px`, so the smaller flat pokal sits in a 64px tile equal to the 32px shaded siblings (keeps title baselines aligned across the row; in dark the cream tile is the same size as the siblings').

Rendered pixel size (svg width / viewBox width), measured in Edge:
| Context | Before | After |
|---|---|---|
| Menu: kort, terning, tandhjul, lup, kiste (32px shaded, scale 4) | 2px | 2px (unchanged) |
| Menu: Statistik pokal (11px flat) | 4px (44px wide) | 2px (22x24 svg, centred in 64px tile) |
| Achievements: stjerne (9px) and pokal (11px), scale 3 | 3px / 3px | unchanged; both flat, no shaded siblings in that context, so no half-scale applied |
| Hero pokal/stjerne (scale 8) and topbar stjerne (scale 2), mem-card back | flat alone or with flat siblings; unchanged | unchanged |
All integer scales, crisp (no clipping).

Verification: screenshots menu + badges, light and dark, 1366x768 and 360x640 viewed: row balanced, pokal tile aligned with siblings, readable in dark (cream tile), badges unchanged. No h-scroll, 0 console errors in all 4 combos. Smoke: all console/h-scroll/focus/labels rows PASS; only the legacy `#btn-play` rows (and the dependent dark "still playable" row) fail as the known artefact. Earlier work (TTS buttons, `.sd-gap`, `.sd-badge--panel`, `.sd-select`) untouched.

Remaining note: the pokal is visually small (22px) next to 64px siblings, which is the documented interim until a 32px trophy sprite exists (icon-map BLOCKED art task).

Status: IMPLEMENTED
