# VERIFY4 US-047 En/Et
| Criterion | Result | Evidence |
|---|---|---|
| Number keys work in the word-pair multiple-choice style | PASS | opposites and synonyms Quiz: keys 1-4 each locked all 4 options and scored; 5/9 harmless; style reset to null by startMode so no stale-option clicks |
| Listed notes, glosses, pairs corrected; stray spaces removed | PASS (content not native-verified) | diff read: mælk/sukker/salt/vand notes give definite form + "oftest uden artikel"; and note fixed; "every day" gloss; 4 stray spaces removed; pairs kedelig/uinteressant, sjælden/usædvanlig, penge/midler, sti/stig |

Regressions: none. øl note untouched (US-024), ws streak logic untouched (US-012), explainer listeners untouched (not in diff). Pair games keep no per-pair progress keys (only word keys in ws), so replaced pairs orphan nothing. No new duplicates among 100 pairs (pre-existing "slutte" x2).

UNCERTAIN (native): "oftest bare »mælk« eller »noget mælk«" phrasing; sjælden/usædvanlig as synonyms; penge/midler; sti/stig (near-identical, weak); other loose pairs the implementer listed remain.

Verification: NOT VERIFIED (language needs native sign-off; mechanics PASS)
