# VERIFY-US-008 - Idiomjaeger: Modersmaalstaleren at A2/B1 (verifier V-IDMV)

Verified file: `idiomjaeger.html` (working tree vs `git show HEAD:idiomjaeger.html`). Scripts in scratchpad `impl/V-IDMV/idiom.js`, `idiom2.js`, `idiom3.js` (Edge headless, `file://`).

## Reproduction at HEAD
- HEAD copy, `PLAY_LVL='A2'`, open the Spil menu and real-click "Modersmaalstaleren": pageerror `Cannot read properties of undefined (reading 'id')`, screen stays on the game list, no toast. Same at B1. Reproduced.
- Same click on the current file: no pageerror, toast "Modersmålstaleren er kun for B2–C1 – spiller med alle B2–C1-idiomer.", the round (10 questions) starts.

## Criteria
| Criterion | Result | Evidence |
|---|---|---|
| With `PLAY_LVL` set to A2 and to B1, launching Modersmålstaleren causes no pageerror. | PASS | Real click and `launchGame('native')` at A2 and B1: 0 pageerrors, round played through to "Runde slut" (10 steps). HEAD: throws at both levels. |
| The behaviour is one of the two options above (fallback to all B2/C1 with notice, or disabled card). The same guard applies to any other mode whose pool can be empty. | PASS | Fallback with Danish notice (`case'native'`, idiomjaeger.html ~1061). Other modes: with a level pool that is empty (`PLAY_LVL='A1'`, which has no idioms), all 11 other launchers (idiomHunter, meaningHunter, exampleDetective, fillMissing, complete, memory, match, timed, survival, context, mixed) plus Øve-tilstand return to the menu with the Danish toast "Ingen idiomer matcher dit valg. Vælg et andet niveau." and no pageerror. `startMemory`/`startMatch` fall back to all idioms with "For få idiomer på niveauet – spiller med alle niveauer." when the pool is <6/<5. (Category picker pools come from `DATA` per category; never empty.) |
| `startQuiz`/`nextQuestion` defend against an empty pool generally (return to the menu with a message). | PASS | Guards at `startQuiz` and `nextQuestion` (also clears the timer); `startText` guards after `canUse`. Exercised via A1 run above. |
| Behaviour at "Alle niveauer" is unchanged. | PASS | `PLAY_LVL='all'`: all 13 game ids + practice + stats + weak + learn/dict/achievements, 0 errors, no fallback toast; B2 and C1 likewise 0 errors. Diff shows no change to the `all` path. |

## Full matrix (current file)
Levels A2, B1, B2, C1, all x game ids idiomHunter, meaningHunter, exampleDetective, fillMissing, complete, memory, match, category (via picker), timed, survival, context, native, mixed (all 13 game ids; the brief said 12 plus category = 13 in `GAMES`) + `startPractice` + `startWeak` + `renderStats` + learn/dict/ach: **0 pageerrors / 0 console errors in all 5 levels** (current). Quiz rounds, text-input rounds, memory and match played to the end screen. Timed mode stopped after 5 questions (60 s timer not waited out). HEAD baseline for comparison: only `native` at A2/B1 throws (swallowed by my try/catch in the script; real-click run above shows it as a pageerror).
Persistence across reload: totalAns 10 -> 10 after reload. localStorage blocked (getter throws): arena/stats run, 0 errors.

## Diff review
Changes in this story's scope: `emptyPool()`, guards in `startQuiz`/`nextQuestion`/`startText`/`startMemory`/`startMatch`, `case'native'`. No unrelated formatting. (The remaining diff hunks belong to US-018, see VERIFY-US-018.)

## Regressions / scope creep
None found. Cosmetic (implementer already noted): shared toast element lasts 2.2 s only, so the native notice disappears quickly.

## UNCERTAIN content (native review)
- "Modersmålstaleren er kun for B2–C1 – spiller med alle B2–C1-idiomer." - grammatical to my reading, a bit terse/telegraphic.
- "Ingen idiomer matcher dit valg. Vælg et andet niveau." and "For få idiomer på niveauet – spiller med alle niveauer." - look fine.
- The notices are shown as a toast only (not persistent); a player at A2 may not read it in 2.2 s.

Native sign-off was not an acceptance criterion of this story.

Verification: VERIFIED
All four criteria PASS with machine checks; reproduction of the original defect at HEAD confirmed. Danish notice wording is listed UNCERTAIN only.
