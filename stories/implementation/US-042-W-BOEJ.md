# US-042 (W-BOEJ slice) - Just-missed items first

## 1. Implementation summary
`buildRound` in `boejningsvaerkstedet/index.html` was replaced with a Tidsmaskinen-style queue using the existing SRS state (keys `item.id`, unchanged): (1) items missed last (SRS box 1, newest `lastSeen` first), (2) seen items that are due, (3) unseen items, (4) not-yet-due items (soonest `dueAt` first), cut to 10. The round is not shuffled afterwards, so missed items really come first. The old logic (`DC.srs.nextItems` over a shuffled pool, where unseen counted as due) is gone.

Status: IMPLEMENTED

## 3. Tests run
Scripted Mode 5 round (`t4.mjs`): seeded SRS with 3 box-1 items (lastSeen newest: b5-en-hund, b5-en-cykel, b5-saa-kat), one seen+due item, 4 not-due items. Presented order: b5-en-hund, b5-en-cykel, b5-saa-kat, b5-moedte-mand, then an unseen item PASS. SRS keys unchanged (still `srs:boejningsvaerkstedet`, per-`item.id`). Smoke PASS.

## 5. Files changed
`boejningsvaerkstedet/index.html` `buildRound` (~592-612).

## 6. Remaining risks
Box-1 items accumulate over time (every item whose last answer was wrong); the newest ten fill the round, so older misses wait. This matches Tidsmaskinen.

## 7. Newly discovered issues
None.

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| Queue order: missed in the last round, then due, then unseen. | PASS for Bøjningsværkstedet |
| `tests/pronomenmysteriet.mjs` resurfacing checks pass. | other owner |
| SRS keys are unchanged. | PASS |
