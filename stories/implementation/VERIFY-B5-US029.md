# VERIFY-B5-US029 - one TTS replay button across all games (verifier V5-A)

Working tree vs HEAD (0550623). Edge (msedge) via puppeteer-core, `file://`, spy on `speechSynthesis.speak` (page stub), no fake voice list. Scripts and screenshots: scratchpad `impl\v5a-tts\` (crawl.mjs = random-walk crawler per game and mode with per-control measurement; shots\*.png; smoke-*.txt). No repo file edited except this file; no stray files from my runs (`git status` shows only other workers' files).

## Per-game table

All controls found are `<button class="dc-tts-button ...">` (extra classes `--sm`, `speaker-front/back/sm`, `sentence-speaker` are leftovers/modifiers, no CSS of their own). Mask speaker icon present on every one (`::before` mask), `font-size:0`. Focus: `:focus-visible` true, outline 4px solid rgb(43,63,214), offset 3px on EVERY control (keyboard modality, screenshots viewed for several). Speak test: real click, one `speak`, `lang=da-DK`, text = the expected word/sentence. Sizes are offsetWidth x offsetHeight at 360x640.

| Game | Listen controls reached (screen/mode) | Label | Size | Focus ring | Speak test | Leftovers (grep) / css link |
|---|---|---|---|---|---|---|
| Adverbier | gap/question prompt (tts-row), wrong+correct feedback sentence | Lyt | 48x48 | PASS | PASS (1x da-DK; correct word/sentence) | none; css link after theme (l.362) OK |
| Magiske Verber | question prompt row (all 7 modes tried, only sentences modes show it) | Lyt | 48x48 | PASS | PASS | none (comment only); l.259 OK |
| Idiomjæger | learn/dictionary card title + example (sm), explanation (sm), question prompt, match items, memory card face (48), "Hvilket idiom", survival, blandet | Lyt | 48x48; sm visible 32x32, hit area 44x44 (::after inset -6px; elementFromPoint at +21px = button, +23px = not) | PASS | PASS (memory-card face click once got 0 calls while the control was in a flipping card, retested ok in M6) | none; only `.replace(/♪/g,'')` no-op in an aria-label sanitiser (l.1157); l.294 OK |
| Præpositioner | sentence in all modes (fill, mc, drag, error, fix, translate, confusable, blitz), feedback corrected sentence (sm) | Lyt til sætningen | 48x48; sm 32x32 (hit 44) | PASS | PASS | none; l.250 OK |
| Antonymer | prompt word (48 and sm), feedback pair A/B words + examples (sm), review items (sm) | Lyt | 48x48; sm 32x32 (hit 44) | PASS | PASS | none; l.296 OK |
| Bøjningsværkstedet | material, wrong-answer slip | Lyt | 48x48 | PASS | PASS | none; `../shared` l.360 OK |
| Glosekort | front (infinitive), back (example, only operable after flip; covered by front face before) | Lyt | 48x48 | PASS | PASS (back: 1x after flip) | none; script.js/style.css/theme clean; `../../shared` l.55 OK |
| Dansk Mester | prompt, feedback good/bad, flashcard front (absolute top/right), match left cells | Lyt | 48x48 (getBoundingClientRect transiently 34.4x47 mid 3D flip; offset size 48x48) | PASS | PASS | none; l.322 OK; theme still has position rules for `.dc-tts-button` (intended) |
| En/Et | word row, flash front/back, match tiles (both columns), feedback | Lyt | 48x48 | PASS | PASS | none; `speaker-sm` class passed but no CSS; theme `.dc-tts-button{margin:4px}` only |
| Forbindeord | sentence row speaker slot | Lyt til sætningen | 48x48 | PASS | PASS | none; l.197 OK |
| Konjunktioner | sentence | Lyt til sætningen | 48x48 | PASS | PASS | none; l.223 OK |
| Ordstillingsdetektiven | solution box after answer | Lyt til sætningen | 48x48 | PASS | PASS | none (`▸` as next/prompt marker, not TTS); l.277 OK |
| Pronomenmysteriet | target sentence, wrong slip | Lyt | 48x48 | PASS | PASS | none; l.114 OK |
| Tidsmaskinen | target sentence (also correct state), wrong slip | Lyt | 48x48 | PASS | PASS | none; zone marker now `■`; l.153 OK |
| pixel-animation.html | no TTS (no `speechSynthesis`/`DanskCore.tts`), 0 listen controls | - | - | - | NA correct | - |
| Portal `index.html` | no TTS, 0 controls | - | - | - | NA correct | - |

DOM scan of every crawled state for other controls with text/class/label ♪ ▶ 🔊 / speaker / "lyt|afspil": only hits were `▸` navigation text (Dansk Mester "Fortsæt ▸" x2, Ordstilling "Næste ▸"/"▸ UDSAGN n / N") and the empty `span.tts-row` wrapper in Adverbier. No ♪/▶/🔊 control acting as TTS.

## Per-criterion table (US-029, verbatim)

| Criterion | Result | Evidence |
|---|---|---|
| One shared speaker sprite rendered via `DanskCore.ui.ttsButton` / `.dc-tts-button` | PASS | `shared/tts-button.css` draws the 8x8 pixel speaker as CSS mask on `.dc-tts-button::before`; all controls above are `.dc-tts-button` with mask present; screenshots (Antonymer, Idiomjæger learn + play, Præpositioner, Tidsmaskinen, Dansk Mester, En/Et at 1366x768 and 360x640, light and dark) show the identical pixel speaker. Games with own `speakerBtn()` just set the class; call sites unchanged (count HEAD = now in every file). |
| ALL games use it; grep finds no ♪ or ▶ used for TTS | PASS | Grep of 14 games + scripts + themes + shared + explainer + portal + pixel-animation: no ♪ (only a no-op `.replace(/♪/g,'')`), no ▶ (only inside comments in `tts-button.css` and `modal.js`; explainer button is an SVG), no leftover `.speaker`/`::before` TTS rules (`grep dc-tts-button|\.speaker` in themes: only dansk-mester.css 209/216 positioning, en-og-et.css 108 margin). `▸` remains as next/continue arrow in Dansk Mester, Ordstilling (not TTS, not ▶; see issue 2). |
| aria-label "Lyt" (or "Lyt til sætningen") | PASS | Every control found: "Lyt" or "Lyt til sætningen". No-voice state appends text after "Lyt" (still starts with Lyt). |
| >=44x44 | PASS with caveat (owner decision) | 48x48 everywhere except the `--sm` inline variant in Antonymer, Idiomjæger, Præpositioner: visible 32x32, hit area 44x44 (verified by elementFromPoint at +-21px). Strict "visible 44" reading would fail those three (issue 1). |
| Visible focus ring | PASS | `:focus-visible` outline 4px solid blue, offset 3px on all controls; ring seen in screenshots (Antonymer, Idiomjæger sm, Dansk Mester, En/Et, Tidsmaskinen). |
| UI harness: no regressions in tap-target or focus checks | PASS for smoke as run, with caveat | `node tests/smoke.mjs` per game: Bøjningsværkstedet, Ordstilling (`.casebtn`), Pronomenmysteriet, Tidsmaskinen all PASS; the 9 legacy games only fail the known `#btn-play` x4 and "console clean + still playable" x3 rows; all console, h-scroll, contrast, tap-target (start screen), icon-labelled, focus-ring and localStorage rows PASS; portal additionally "TRYK START" contrast 1.62 on the preloader (not touched by B5). Smoke does not reach play screens of legacy games. Running the harness's `smallTapTargets` logic in play states (crawl) flags only the `--sm` TTS buttons (32x32: Antonymer, Idiomjæger, Præpositioner) and a transient 34.4 width on the Dansk Mester flashcard speaker during the 3D flip; no other control under 44 in any visited state. |
| `tests/tidsmaskinen.mjs:304` expects "Lyt" | PASS | Run: wrong slip rows PASS, buttons `["Lyt|🔊","|Videre"]`. |

Scope checks: `git diff HEAD -- shared/dansk-core.js` is a single hunk (ttsButton: optional 3rd arg label, default "Lyt", `title`, no-voice label), as claimed. ▶ reserved for the explainer: explainer button is an inline pixel SVG (no U+25B6 text); Glosekort current-card marker is a CSS 8x8 square, En/Et Find par selection `●`, Tidsmaskinen zone marker `■`. Console: zero console/page errors in all crawls (about 240 runs of 60-150 steps; the few protocol timeouts were my own parallel load, not page errors). Unrelated test failures seen: `tests/tidsmaskinen.mjs` "correct: auto-advance 700-1000 ms" (817-1310 ms, load from my parallel runs, not TTS) and `tests/pronomenmysteriet.mjs` "Space toggles a chip" (not TTS; its final file write failed because I passed OUT as a directory, my fault).

## Issues

1. Minor (owner decision): `--sm` listen button is visible 32x32 with a 44x44 invisible hit area (Antonymer feedback/prompt/review, Idiomjæger cards/explanations, Præpositioner corrected sentence). Hit area is real, but a visible-size reading of the story and the harness' `getBoundingClientRect` tap-target check flag it; HEAD's `.speaker.sm` was 44px. Idiomjæger report also notes this as NOT VERIFIED.
2. Minor/Info: `▸` is still used as next/continue arrow in Dansk Mester (`dansk-mester.html:1142,1194` "Fortsæt ▸") and Ordstilling (`:324,337,987,988,1117,1119`). Not TTS and not ▶, but `B5b-DM.md` claims "Fortsæt ▸" was changed to "Fortsæt →" - the working tree still has ▸ (report inaccurate, or reverted by another worker).
3. Info (cosmetic): Idiomjæger `--sm` button frame touches or overlaps the adjacent text line when the example wraps at 360px. Tidsmaskinen dark mode: dark-panel speaker button sits on the hard-coded cream `.target` card (same icon, different tint than other games).
4. Info: `ttsButton` still injects a hidden `<span aria-hidden>🔊</span>` (hidden by `tts-button.css`); every game links the CSS, so nothing shows, but `textContent` contains 🔊 and a page without the CSS would show it.
5. Info: Glosekort back-face speaker exists in the DOM and is covered by the front face until the card is flipped (pre-existing 3D flip structure; click while unflipped hits the front face, not verified whether it is tab-focusable).
6. Info: transient `spk []` readings (Adverbier feedback, Idiomjæger memory face during flip, Pronomenmysteriet/Tidsmaskinen "press" frame) were re-checked or are replaced elements mid-animation; the same controls speak correctly in stable states. No behavioural change versus HEAD found.

Not covered: native audio quality and real Danish voices (U-05), Android; Konjunktioner, Forbindeord, Ordstilling, Magiske Verber, Bøjningsværkstedet, Pronomenmysteriet, Glosekort and Adverbier were measured and click-tested but their screenshots were not individually eyeballed (identical shared CSS; 6 other games were).

Verification: NOT VERIFIED - all machine-checkable criteria pass (shared `.dc-tts-button` everywhere, no ♪/▶ TTS glyphs, labels "Lyt"/"Lyt til sætningen", focus ring, one da-DK speak per click, smoke no regressions), but the ">=44x44" criterion depends on an owner decision for the 32px visible / 44px hit-area `--sm` variant (issue 1).
