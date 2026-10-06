# VERIFY US-012 (En/Et slice, W-ENET) — verifier V-GEM

Method: seeded a HEAD-format save (no `ws`; 16 words with `perItem["enet:<w>"]={t:16,c:15}`) into `en_et_traener_v1`, then played REAL "Svage ord" rounds through the UI (click #weakCard, #btnEn/#btnEt with the correct article, #next), on HEAD (scratchpad copy) and on the working copy. Script: `impl/V-GEM/enet.mjs`.

HEAD baseline (reproduced): 3 consecutive perfect 15/15 rounds each end with "Ryddet: 0 / 15"; weak pool stays 16.

Working copy:
| Step | Result |
|---|---|
| Old save loads | 16 weak words, "16 ord at gentræne", no errors |
| Round 1, 15/15 correct | "Ryddet: 0 / 15"; pool still 16; every played word `ws=1` |
| Round 2, 15/15 correct | "Ryddet: 14 / 15"; pool 2 (the words still at ws=1) |
| Round 3 (2 words) | "Ryddet: 2 / 2"; pool 0; weak card disabled |
| Alt run: round 1 perfect, round 2 with one deliberate miss on `barn` | `ws.barn` 1 -> 0, barn back in pool (pool 3); "Ryddet: 13 / 15" |
| Reload | `ws` and pool persist; `perItem` t/c untouched (`enet:hund` still `{t:16,c:15}`) |
| Console | zero errors/warnings |

| Criterion | Result | Evidence |
|---|---|---|
| The weakness rule uses a recent streak or the last result, not lifetime c<t. | PASS | `weakPool()` excludes words with `P.ws[w] >= 2` (consecutive correct; reset to 0 on a miss). |
| En/Et: a perfect Svage ord round clears the words answered correctly N times, and "Ryddet" reflects that. | PASS with caveat | With the suggested N=2 a word clears after 2 consecutive correct answers, so the FIRST perfect 15/15 round still ends "Ryddet: 0 / 15" (the very symptom quoted in the story's Problem); it clears on the second perfect round (14/15, then 2/2). This matches the criterion literally ("answered correctly N times") and the implementer disclosed it, but a learner sees "0 / 15" after round 1 with no hint a second pass is needed. Owner may prefer N=1 / last-result-correct (the story's alternative) or a UI hint. |
| Existing saved data migrates: add a streak field defaulting to 0, without wiping c/t. | PASS | Old save loads; `ws` created lazily; c/t unchanged. |

Wording nit: when the pool is empty the card says "Ingen fejl endnu – bliv ved med at øve!", which was written for "never missed" and is now also what a user sees after clearing words. Not a criterion.

Smoke: `node tests/smoke.mjs "en og et/index.html"` (default selector): FAIL rows = 4x "#btn-play found", dark/light/reduced-motion "console clean + still playable" (legacy artefact, no #btn-play) and "dark: text contrast >=4.5" (1.09 on "?", "-en", "-er", "___"). The same smoke run on a scratchpad copy of `git show HEAD:'en og et/index.html'` (shared/ copied alongside) gives IDENTICAL FAIL rows including the identical dark-contrast row, so the contrast failure is pre-existing. With the right play selector (`'[data-mode="enet"]'`) the working copy gets Verdict PASS.

Scope: limited to weak helpers, `recordAnswer` 3rd arg, `register` call, `finishRound` cleared count (+ the øl note, see US-024). Regressions: none. Forbindeord slice not in my scope.

Verification: VERIFIED (En/Et slice; all three En/Et criteria PASS; the "0 / 15 after the first perfect round" caveat is a UX observation for the owner).
