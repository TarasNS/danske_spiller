# Independent verifier brief (applies to every verifier)

Project: "Sjovt Dansk", `C:\Users\TarasTsarenko\Downloads\Dansk\danske_spiller`, branch `qa-implementation`. Vanilla HTML/CSS/JS over `file://`. Read `CLAUDE.md` first.

You are an **independent verifier**: you did not implement these stories and you must not trust the implementer's claims. Implementer reports are `stories/implementation/US-XXX.md`; read them for what was claimed, then check yourself.

## Hard rules
- **READ-ONLY on the repo** except for creating your verdict files `stories/implementation/VERIFY-US-XXX.md` (one per story). Never fix anything, never edit production files, never commit/stash/branch/checkout, no `npm install`.
- Your own scripts and screenshots go only in the scratchpad: `C:\Users\TARAST~1\AppData\Local\Temp\claude\C--Users-TarasTsarenko-Downloads-Dansk\f9b073f4-9948-4e1b-9d44-1a692e6f9961\scratchpad\impl\<your-verifier-name>\`.
- Browser: `CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"`; `puppeteer-core` at `tests/node_modules` (require by absolute path; see `tests/lib/` helpers). Games over `file:///` URLs; wait ~3 s after load (the sjovt preloader overlay blocks clicks briefly).
- Existing tests (`tests/smoke.mjs`, `tests/tidsmaskinen.mjs`, `tests/pronomenmysteriet.mjs`) may write dump files into the repo; redirect output to the scratchpad if supported, otherwise delete anything they create and say so. Before finishing run `git status --short` and make sure no stray files were left by you.
- Compare against the original with `git show HEAD:<path>` (HEAD = baseline `0550623`) and `git diff -- <path>`.
- Other workers may still be editing OTHER files (e.g. Bøjningsværkstedet, nouns/adjectives data). Ignore changes outside your stories' files.

## What to do per story
1. Read the story in `stories/QA-USER-STORIES.md` (acceptance criteria are authoritative) and the implementer report.
2. Reproduce the ORIGINAL failure on the HEAD version (where it is a runtime defect), then check the fix on the current version with your own scripted and hand-driven checks (real clicks/keys, multiple viewports where the story is layout related: 1366x768, 390x844, 360x640).
3. Diff review: the change must be limited to what the story needs (no unrelated refactoring, formatting changes, content changes, debug code, new files). Flag scope creep precisely; judge whether it's justified by the story text.
4. Regression check on the same game: it loads with zero console errors, a normal round can be played and finished, progress persists across reload, localStorage-blocked run does not crash (Batch 1's US-004 guards must still be intact where applicable), keyboard operation still works.
5. For Danish content changes: you're not a native speaker. Read every changed sentence/note; FAIL only what is clearly ungrammatical/wrong or contradicts the story; list doubtful items as UNCERTAIN (for native review). Check the answer key still matches the sentence, options contain exactly one defensible answer where applicable, ids/keys/storage unchanged.
6. Known legacy artefact: for legacy root-level games `smoke.mjs` rows "play button #btn-play found" and "console clean + still playable" always fail (no `#btn-play`). Judge the other rows.

## Verdict file format (`VERIFY-US-XXX.md`)
- Per-criterion table: criterion (verbatim) | PASS / FAIL / NOT VERIFIED | your evidence (command output, measurements, file:line).
- Regressions found, scope creep found, UNCERTAIN content list.
- Last line exactly: `Verification: VERIFIED` (only if every criterion that can be machine/human verified here is PASS; criteria needing native-speaker sign-off or owner approval stay NOT VERIFIED and are listed) or `Verification: NOT VERIFIED` (criteria unverifiable) or `Verification: FAILED` (at least one criterion FAIL), followed by the reasons.
Return a short summary at the end (per story: verdict, key findings).
