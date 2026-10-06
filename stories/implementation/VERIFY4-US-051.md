# VERIFY4-US-051 (verifier V4-E)

Method: `git diff 0550623 -- <4 files>`, node `vm` loads with a `window`/`console` shim (scratchpad `impl/V4-E`), `node shared/validate.js`, repo-wide grep, full read of all 99 Saetningsmaskinen items.

## Per-criterion table

| Criterion | Result | Evidence |
|---|---|---|
| `forberede` moves to the -te class | PASS | Removed from the -ede list, added to the -te list (verbs.js). Loaded: preterite `forberedte`, participle `forberedt`, imperative `forbered`, passive `forberedes`, id unchanged. |
| `gentage` becomes a manual strong entry (gentager, gentog, gentaget, gentag, har, gentages) | PASS | Manual row `['B2','gentage','gentager','gentog','gentaget','gentag','har','gentages']`, removed from the weak builder. Loaded entry matches exactly. Verb count 201, unchanged. |
| The `intet` note and the other pronoun and clause-pattern wording are fixed | PASS (Danish wording UNCERTAIN) | `intet`: "Intetkønsformen af ingen (intet hus); mere formelt end "ikke noget"." (as the story asks). reflexive -> refleksiv/refleksivt (dens/dets/deres). nogen/nogle softened ("typisk", positive use allowed). `hverken` kept, note says it is really a conjunction (story only says "listed as a pronoun"; keeping with a note is a defensible minimal fix, but deletion is open). "Presentationelt" -> "Præsentationelt" (clause-patterns.js:88). `mens-ikke` and `hvis-sandsynligvis`/`naar-ofte` untouched (story gave no concrete fix). Counts: pronouns 7/9/1/6/11, clauses 87, unchanged. |
| Saetningsmaskinen: clone generators removed | PASS | All 7 `Array(N).fill(null).map` generators and "Continue to reach N" comments gone (grep: no `variant` ids; only the guard comment mentions it). |
| ...real items authored to the `specs.md` counts | FAIL / BLOCKED | 1020 -> 99 items (40/10/10/10/10/9/10 vs targets 140/160/140/140/180/160/100). Needs new Danish content plus native review; implementer correctly marked BLOCKED. |
| ...the listed wrong keys and frames are fixed | PASS | `iq-hvorfor-ringer`: "Han ville vide, ___." key "hvorfor jeg ikke ringede" (correct). `rc-hvilket`: key "som", note explains. "hvornår toget toget" -> prompt "...___ toget går", key `hvornår` (distractor `hvornår toget` is a deliberate wrong). "Manden, ___ står der" (no doubled "der"). `iq-hvem-mødte`/`rc-som-mødte`: no doubled "jeg mødte". "hvor mange mennesker der" now required. "snør" -> "sner" (text and tiles; id `snør-når` kept for stability). "modalsverbet" -> "modalverbet". Wrong notes fixed (q-hvem-skriver "subjekt"). Mode 1 "som" items (no gap) -> "fordi"; `det-smiler` removed. `rc-hvis-navn` frame completed ("..., ringede."). |
| A placeholder/duplicate guard is added | PASS | Loaded in a node `vm` shim with `window`/`console`: no throw, 0 warnings on the real data. Injected a `-variant-` id and a duplicate item: guard warns on the variant id, the repeated id and the duplicate content, never throws. Guard uses only `window`/`console` and no DOM. |
| `node shared/validate.js` gives 0 errors | PASS | `TOTAL: 0 errors, 0 warnings`. |
| Native-speaker sign-off | NOT VERIFIED | Not obtainable here. |

## Scope assessment: removal of the generators

- The story text (Problem: "About 920 of 1,020 items are clones ... and a 'Continue to reach 140' comment remains"; Expected: "real Saetningsmaskinen items before `saetning-game-*` starts"; AC3: "the clone generators are removed, real items are authored to the specs.md counts") **explicitly authorises removing the generators**. Removal is in scope; the authoring half is not done and cannot be done by a non-native worker, so the story stays PARTIAL.
- It is recoverable: the original is `git show 0550623:saetningsmaskinen/data.js` (and any later commit before b860e8f).
- Nothing breaks at runtime: no page loads `saetningsmaskinen/data.js` (no index.html; only the file itself mentions it in a guard message, `tidsmaskinen/data.js:5` is a comment). No test, doc or game code references the removed generator ids or `variant` ids. No script or test counts 1020 items.
- **Stale documentation (read-only files, so not edited, noted for the owner):** `PROGRESS.md:53` ("1,020" items) and `:83` (`saetning-data` marked `completed`, "1,020 items across 7 modes"), `specs.md:172-187` and `improvement/specs.md:1503` (targets/total 1,020). They now overstate reality; `PROGRESS.md` should reopen `saetning-data` before `saetning-game-1/2` start (the story's own dependency note says the same). The `data.js` header and per-mode "Target (specs.md): N items, authoring pending" comments are honest about it.
- No shipped page loads verbs/pronouns/clause-patterns. Bøjningsværkstedet derives from `nouns.js`/`adjectives.js`, which this story did not touch (their diffs vs 0550623 are W-BOEJ's US-015/050 work).

## Content read (all 99 Saetningsmaskinen items) - UNCERTAIN / issues for native review

- `ofte-main` "du besøger ofte mig": an unstressed pronoun object normally precedes the adverb ("du besøger mig ofte"), so this accepted order is probably unnatural. The pre-existing item is not in the story. Worth a native look; the sub item `da du ofte besøger mig` is fine.
- `går-hvis` "Han går til skole" (idiom is "i skole"; implementer flagged but did not fix); `selvom-kender` (illogical concession); `åbnede-efter` ("efter at ... havde åbnet" expected); `chain-8` relative "som" referring to a clause (would be "hvilket"/odd); `chain-6` missing comma before "som hun selv havde lært"; `rc-hvis-hus` frame is a fragment (no main clause, and the context sentence is odd); `rc-hvad-sagde` note "Hvad ... for nomen" imprecise.
- English words left in Danish notes: "Presentational der" (`der-ligger-en-bog`, `der-dunker-noget`), "Existential der" (`der-synes-at-være`) while the story fixed "Presentationelt" in clause-patterns. Minor consistency gap.
- `der-dunker-noget` and `det-virker`: "Det dunker noget imod døren" could also be argued; one defensible answer is `der`, fine.
- "One defensible answer" test on the corrected items: `iq-hvorfor-ringer`, `rc-hvilket`, `iq-hvor-mange`, `iq-hvem-mødte`, `rc-som-mødte`, `rc-hvis-navn`, `iq-hvornår-går` pass. Mode 1 `ikke-main-*` tokens are already in the final order (no real task; the implementer noted this as a game-design question).
- verbs.js UNCONFIRMED items (`ride` aux `er`, "lignes", imperatives "hed"/"vid", `bestå` passive) left unchanged: acceptable, native review needed. `mens-ikke` left unchanged: native review.

## Regressions / scope creep

None found. The change is confined to the four files. CRLF kept. No stray files (`git status --short` shows only the pre-existing untracked `CLAUDE.md`).

Verification: NOT VERIFIED. The corrections to verbs.js/pronouns.js/clause-patterns.js and the Saetningsmaskinen frames/keys/guard are PASS and validate.js is 0 errors, and removal of the clone generators is authorised by the story text. But authoring real items to the specs.md counts (99 vs 1020) is BLOCKED/FAIL by design, native sign-off is outstanding, and several Danish items above are UNCERTAIN.
