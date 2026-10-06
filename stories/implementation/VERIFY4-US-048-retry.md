# VERIFY4 US-048 Forbindeord retry (verifier V4-R)

Own script `impl/V4-R/forb.cjs` (Edge headless, file://, real `page.reload()`, clicks via the DOM; 40 checks, 0 failures).

| Criterion | Result | Evidence |
|---|---|---|
| Wrong answer then reload x4: same marked option, lives/score/streak unchanged, stored answer total unchanged | PASS | Wrong answer: lives 5, total 1, option "idet" marked wrong, "derudover" correct. After each of 4 reloads the full snapshot (options order, wrong/correct marks, disabled, Næste shown, i, score, streak, lives, run `pick`, `forbindenor_v1` total/correct) is identical. |
| Correct answer x4 reloads | PASS | Item answered correctly (score 110, streak 1, total 2); 4 reloads identical. |
| Næste then reload: fresh item | PASS | i=1, unanswered, `pick:null`, same shuffled options after reload, lives unchanged. |
| Answer, reload, Næste, answer, reload | PASS | Each step identical after reload; wrong answer then 2 reloads: lives 4, total 4 constant. |
| Reload at position 1, a middle and a late item | PASS | Fresh and answered states checked at i=0, 150, 300 (answered then 2 reloads: identical; score 28980/58980 carried). |
| Weak mode: enter, answer, reload; normal run not corrupted | PASS | Run key string byte-identical before and after answering in weak mode; after reload the page is back on the normal run at the same item (i=301), same wrong mark, lives, score; second reload and "enter weak mode, reload" unchanged. |
| Corrupt `forbindenor_run_v1` -> fresh run | PASS | `{bad`, `null`, `[]`, `{"v":1}`, wrong sig, and a tampered `pick`: all give i=0, score 0, lives 6, unanswered. |
| Game over clears the run key; reset clears keys | PASS | After 6 wrong answers the end panel shows and the run key is null; reload gives a fresh run. Reset (confirm accepted): `forbindenor_v1` removed, run restarted (i=0, pick null). |
| Blocked storage no crash | PASS | localStorage getter throwing: game loads, an item is answered and Næste works, 0 errors. |
| US-002 distractor draw check | PASS | 359 records x 300 draws = 107,700 draws: always 4 unique options with the answer present (0 bad). |
| US-002 block diff vs b9242ca is just the single `omsider` clause | PASS | `git diff b9242ca` in `allowedPool`: only line 871 changed (`|| c.ans===dk("omsider")`). |
| Smoke | PASS (legacy aside) | only "#btn-play found" and "console clean + still playable" rows fail (legacy artefact). 0 console errors in my run. |
| `git diff HEAD` limited to that one line | PASS | `forbindenor/Forbindenor.html`: 1 insertion, 1 deletion (`saveRun(opts,(resume && !state.weakMode)?resume.pick:null)`). |

Observation (pre-existing, outside the retry): leaving weak mode keeps `state.i` of the weak list, so the normal run resumes at that index afterwards; unchanged by this retry and the saved run key is never touched while in weak mode.
Regressions: none. Scope creep: none. UNCERTAIN: none.

Verification: VERIFIED
