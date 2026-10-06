# VERIFY4 US-048 - Forbindeord (V4-D)

| Criterion | Result | Evidence |
|---|---|---|
| Reload mid-run resumes at same item with same lives and score | PASS (single reload) / FAIL (second reload) | Unanswered item at 4/359: reload -> 4/359, same score/lives/options. Answered item (3 items played): reload 1 restores answered state (marks, Næste), same score/lives, not re-scored. **Reload 2 on the same answered item: item comes back UNANSWERED with all options enabled** (score/lives unchanged, but the item can be answered again): re-answering a wrong item took lives 5->4 and `forbindenor_v1` total 1->2. Cause: `render()` calls `saveRun(opts,null)` before `showAnswered()`, overwriting the stored `pick` with null (Forbindenor.html render ~line 912). |
| Corrupt run key -> fresh run | PASS | `{bad`, wrong sig, `null`, `[]` -> 1/359 each. |
| Weak mode not saved | PASS | run key unchanged while answering in weak mode. |
| Run key cleared at end of run / reset | PASS | after game over run key null; reset removes it. |
| Listed notes and categories corrected | PASS (machine part) | so-note on 3 no-inversion items replaced (note text "»Så« angiver her følgen ... uden omvendt ordstilling."); items 314-316 now contain "for det første" (idx 55-57 pools contain no defensible distractor); "omsider" x4 moved Holdning -> Tid. |
| Levels aligned with Konjunktioner (owner decides) | NOT VERIFIED | left unchanged (eftersom C1 vs B2); both/begge/alle placement left to native/owner. |
| US-002 distractor block unchanged except one clause | PASS | `git diff b9242ca HEAD` shows a single changed line in allowedPool: added `|| c.ans===dk("omsider")`. 359 items x 300 draws (107,700): 4 unique options, answer present, 0 synonym distractors, min pool 3, omsider never a distractor; per-item allowed pools identical to b9242ca (0 diffs). |

UNCERTAIN (native): new sentences 55-57 ("Jeg blev hjemme. For det første var jeg syg, og for det andet havde jeg ingen energi." etc.), new så-note wording.
Regressions: the double-reload re-scoring defect above (new in Batch 4).
Verification: FAILED (second reload on an answered item loses the answered state and allows re-scoring; level alignment NOT VERIFIED).
