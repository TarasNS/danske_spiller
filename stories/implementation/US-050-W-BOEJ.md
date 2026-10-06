# US-050 (W-BOEJ slice) - Language polish, Bøjningsværkstedet and shared nouns/adjectives (QA-089)

## 1. Implementation summary
Applied only clear corrections; item IDs of everything that remains are unchanged. The US-015 changes are intact.
- LANG-021: Mode 4 `dårlig` now also accepts komparativ `dårligere` and superlativ `dårligst/dårligste/den dårligste/det dårligste` (værre/værst still the shown key).
- LANG-025: `verify:true` nouns are no longer served in Mode 1 (menneske, tallerken, koekken, sol, morgen, eksamen, cafe, app, ide, frygt): 40 items removed.
- LANG-026: blå/grå Mode 3 notes: "Blå er uændret i flertal: blå." / "...i bestemt form: blå." instead of the self-contradicting "-e" wording; -ig adjectives in Mode 4 now say "-ere/-st" (roligere -> roligst) instead of "-ere/-est"; Mode 6 "Tak for ___ hjælp" item (`b6-meget-hjaelp`) now "Hun har brug for ___ hjælp med lektierne." (key meget); the three implausible Mode 2 pairs en dyr park, en god kirke, en sjov ulv are skipped (9 items removed); `spændende` note "førnutids" -> "nutids tillægsform"; `lille` note now says den/det lille and flertal små (undisplayed notes); `nouns.js` `æg →ægget` -> `æg → ægget`.
- `b5-deres-bil` / `b5-deres-boern` (reflexive sin/sine) is not in US-050's list: recorded, not changed.

Status: IMPLEMENTED (content needs native sign-off)

## 3. Tests run
- `node shared/validate.js`: TOTAL 0 errors, 0 warnings.
- Item counts before -> after (dump of ids): fire_former 1300 -> 1260 (-40, verify nouns), byg_navneordet 570 -> 561 (-9: sjov-ulv, dyr-park, god-kirke x3 forms each), adjektivvaerkstedet 746 -> 746, sammenligningspressen 176 -> 176, bestemt_ubestemt 250 -> 250, maengdevaerkstedet 221 -> 221; no ids added.
- vm check: `daarlig-sammenligning` slots accept the new variants; `rolig-sammenligning` note "-ere/-st"; blaa notes as above; no `frygt/sol/menneske` ids in Mode 1.
- Smoke PASS (28/28).

## 5. Files changed
`boejningsvaerkstedet/data.js` (Mode 1 filter ~104; Mode 3 notes ~174-186; SKIP_PAIRS ~201-205; Mode 4 variants/note ~290-310; `b6-meget-hjaelp` ~678); `shared/data/nouns.js` (`aeg` note); `shared/data/adjectives.js` (`lille`, `spaendende` notes).

## 6. Remaining risks
Filtering all 10 `verify:true` nouns also drops 7 forms the QA review rated correct (menneske, tallerken, køkken, morgen, eksamen, café, idé, app); a native speaker can clear the flags to bring them back. Existing SRS entries for removed ids are simply never selected.

## 7. Newly discovered issues
- `høne` is not `verify:true` but QA marks `høner` (vs høns) UNCONFIRMED; still served.
- `b5-deres-bil` and `b5-deres-boern` reflexive issue (see above).

## 8. Needs native review (left unchanged)
- `høne` plural (høner / høns); `interessantere`, `blåere` variants (UNCONFIRMED in LANG-021).
- `b6-faa-penge`, `b6-faerre-penge` ("lidt/mindre penge", note "Penge ... tælles") UNCONFIRMED.
- The three removed Mode 2 pairs (judged implausible by QA only) and the new `b6-meget-hjaelp` sentence.
- 7 further `verify:true` adjectives are unchanged (already skipped by the generators).

## 9. Acceptance criteria
| Criterion | Result |
|---|---|
| Each listed correction is applied, per game, in separate PRs. | PASS for the Bøjningsværkstedet list above, except penge (UNCONFIRMED) and deres (not listed) |
| UNCONFIRMED sub-items change only after native confirmation. | PASS (none changed) |
| The Idiomjæger completion regex allows trailing punctuation. | other owner |
| Bøjningsværkstedet filters out `verify:true` nouns from Mode 1, or a native speaker resolves them. | PASS |
| Portal text and level labels are corrected. | other owner (frozen file, owner approval) |
| `node shared/validate.js` gives 0 errors; smoke per game. | PASS (validate 0/0; Bøjningsværkstedet smoke PASS) |
