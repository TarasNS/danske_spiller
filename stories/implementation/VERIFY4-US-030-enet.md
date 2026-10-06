# VERIFY4 US-030 En/Et slice
Scripts: scratchpad impl/V4-C (enet.cjs etc., Edge, file://).
| Criterion | Result | Evidence |
|---|---|---|
| Each game has a visible reset, at least 44x44, keyboard-operable | PASS | #resetBtn in menu, 204.8x44 px; focus + Enter triggers it |
| Danish confirm() appears; Cancel changes nothing | PASS | dialog "Nulstil al fremgang i denne øvelse? Det kan ikke fortrydes."; after dismiss en_et_traener_v1 still present |
| Accept clears only that game's namespace | PASS | after accept keys = [other_key]; en_et_traener_v1 null, unrelated key kept |
| Works when storage is blocked (no crash) | PASS | localStorage getter throwing: click reset + play, 0 page errors |

Scope: reset only in menu (not in-round), acceptable. Confirm wording UNCERTAIN (native).
Regression: 0 console errors at 360/390/1366 light/dark; smoke fails only the legacy rows.

Verification: VERIFIED
