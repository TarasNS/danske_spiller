# D-DOCS-saetning (decision #9, W-DOCS)

Status: IMPLEMENTED (documentation only, no code changes, CRLF preserved)

## Per-mode counts (saetningsmaskinen/data.js loaded in node vm)
adverb_placement 40, main_to_subordinate 10, direct_question 10, indirect_question 10, relative_clause 10, der_or_det 9, clause_chain 10 = 99. Targets 140/160/140/140/180/160/100 = 1,020.

## Changes
- PROGRESS.md: Game Quick Reference row (line 53): "1,020" -> "1,020 target (current: 99)". Task `saetning-data` (about lines 80-88): status completed -> todo, title marked target/current 99, notes explain reopening (US-051, clone generators removed, per-mode counts, ~920 items need new Danish content + native review); old completed date/commit kept as previous_*. `saetning-game-1` and `saetning-game-2`: added `blocked_by: saetning-data` and a BLOCKED note.
- specs.md (line 180, "Modes (7)"): added note that per-mode counts are targets (unchanged) and current data.js holds 99 (40/10/10/10/10/9/10). No other line touched.
- improvement/specs.md (section 6.7 table, ~1494-1503): added "Current" column with per-mode counts; Total row "1,020 (target, unchanged)" / "99". No other line touched.
- `verify-saetning` task: no such task exists in PROGRESS.md (only saetning-game-1/2 depend on data), so nothing to change.

## Verification
`git diff --stat`: PROGRESS.md 15 lines, improvement/specs.md 20, specs.md 2; only the intended lines.

## Further stale mentions (not edited, other files)
- SCRATCHPAD.md:17 ("saetning-data is already completed (1,020 items)"), :151 (log "1,020 items", historical, append-only log).
- prd.md: per-mode counts (e.g. "Mode 2 ... (160 items)" line 870, Mode 7 100 items line 939) are targets; no stale claim of completion found. Frozen.
- game-ideas.md, improvements.md, docs/**: no stale count mentions.
- saetningsmaskinen/data.js header comments already corrected by US-051.
