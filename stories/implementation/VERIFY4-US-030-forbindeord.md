# VERIFY4 US-030 - Forbindeord slice (V4-D)

| Criterion | Result | Evidence |
|---|---|---|
| Visible reset, >=44x44, keyboard-operable | PASS | `#resetBtn` "Nulstil fremskridt", real button, 193x48 px. |
| Danish confirm; Cancel changes nothing | PASS | Dialog text "Vil du nulstille al fremskridt i Forbindeord? ..." shown; after Cancel counter/score/lives and keys unchanged, focus returns to button. |
| Accept clears only that game's namespace | PASS | Seeded `other_game_key` and `srs:x`: both kept; `forbindenor_v1` and `forbindenor_run_v1` removed (run key is then re-created by the fresh render, i.e. a new run at 1/359, score 0, lives 6). |
| Works when storage blocked | PASS | localStorage getter throwing: load, answer, reset click: 0 page errors. |

UNCERTAIN (native): dialog wording.
Regressions: none. Scope creep: none.
Verification: VERIFIED
