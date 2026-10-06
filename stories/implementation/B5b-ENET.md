# B5b-ENET (W-ENET): En/Et adoption of shared pieces

Status: IMPLEMENTED

## Summary
- `en og et/index.html`: linked `../shared/tts-button.css` and `../shared/sd-extras.css` after the theme; `speakerBtn()` now creates `.dc-tts-button` with aria-label/title "Lyt" and no ♪ (speak() and click behaviour unchanged, `stopPropagation` kept so flash cards still flip only on card click); deleted the local `.speaker` CSS; sentence gap `<span class="gap">_____</span>` became `<span class="sd-gap" role="img" aria-label="mellemrum"></span>`; back button text "← TILBAGE".
- `shared/themes/en-og-et.css`: removed `.word .gap` and the three `.speaker` rules, added `.dc-tts-button { margin: 4px }` (spacing only); the Find-par selected-tile marker `▶` replaced by `●`.
- Kept intact: øl `a2`/`d2`, US-012/024/030/032/034/047, explainer listener, storage keys.

## Tests
- Scratchpad `impl/b5b-enet/` (t.cjs, t2.cjs; Edge): at 1366x768 light, 390x844 dark, 360x640 light: zero console/page errors, no h-scroll, sentence mode shows `.sd-gap` rendering "?" (screenshot viewed, dashed underline, readable in dark), TTS button 48x48, aria-label "Lyt", exactly one `speechSynthesis.speak` with `da-DK` per click, focus ring visible (viewed), no ♪/▶ in body text, back button "← TILBAGE".
- `node tests/smoke.mjs "../en og et/index.html"`: contrast rows PASS (dark and light, the 1.09 row did not appear); only the known legacy failures remain (4x `#btn-play` not found, 3x "console clean + still playable").
- Not separately run: blocked-storage round (no storage code touched; smoke's blocked-storage row did not report a failure beyond the legacy rows), BEFORE screenshots (not produced).

## Files changed
`en og et/index.html` (head links ~L180-187 removal of .speaker CSS, links near L277, back button, `speakerBtn`, sentence gap line); `shared/themes/en-og-et.css` (~L107-110, match-tile marker L~170).

## Risks / notes
- Flash-card and match-tile speakers get the full 48px button (previously 30-44px); layout checked only at the sizes above in enet/sentence modes, not flash/match.
- The unused class `speaker-sm` is still passed in three call sites (no CSS, harmless).
- Gap stays "?" after answering (as before the filled text was not shown; unchanged logic).

## Newly discovered
None.

## US-029 (TTS)
| Item | Result |
|---|---|
| Listen controls use `.dc-tts-button`, label "Lyt", >=44x44 | PASS (enet-mode checked; flash/match same function) |
| Theme old glyph rules removed, no ♪/▶ for TTS | PASS (`grep` clean in both files) |
| Link after theme; behaviour unchanged (one speak, da-DK) | PASS |
| ▶ other markers replaced | PASS (Find par marker now ●) |

## US-038 (icons)
| Item | Result |
|---|---|
| Sprites match icon map (map keeps En/Et choices, all 32px) | PASS (verified against B5-icon-map.md line 7 and the D-ENET table; no change needed) |

## US-039 (per-game)
| Item | Result |
|---|---|
| (a) gaps to `.sd-gap` | PASS |
| (b) level badges `.sd-badge--panel` | NA (CEFR items are filter buttons `.cefr-btn`, not badges) |
| (c) selects | NA (none in game) |
| (d) dark-surface outliers | NA (En/Et not listed) |
| (e) Idiomjæger inline TTS | NA |
| (f) back wording "← TILBAGE" | PASS |
| Dark contrast 1.09 row | PASS this run (not reproduced; `.sd-gap` replaced "_____" blank) |
