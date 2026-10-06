# B5-icon-map: US-038 documentation step (W-ICONS)

Status: IMPLEMENTED (documentation only). The sprite changes themselves are NOT done; they are the blueprint for the game workers. Redrawn 32px generic sprites remain BLOCKED (frozen `shared/sjovt.js`, owner approval).

## Summary
- New `docs/redesign/icon-map.md`: sprite inventory (23 sprites, grid size, family, what each actually depicts), current usage table for every mode menu and header, one-sprite-per-role map, rules (identity = portal card sprite; `molle` streak only, `hjerte` lives only, `pokal` results/level/badges only, `flag` Danish only, `polle` brand only; `snegl`/`cykel`/`hat` retired from rows), per-game application table with file:line, and a BLOCKED list.
- Map keeps every En/Et choice (decision #8). Only deviation: generic "flip cards" = `kort`, with En/Et's `terning` Vendekort winning inside En/Et.
- Only Antonymer, Præpositioner, Magiske Verber, Idiomjæger, Dansk Mester and En/Et have sprite mode rows. The template games (Tidsmaskinen, Bøjningsværkstedet, Pronomenmysteriet, Glosekort, Forbindeord, Konjunktioner, Ordstillingsdetektiven, Adverbier) have text-only modes and only identity sprites.
- Identity fixes confirmed with lines: Tidsmaskinen `:158,:165` ur -> tidsstjerne; Bøjningsværkstedet `:366` molle (duplicate title, keep `:373` tandhjul); Dansk Mester `:757` flag -> snak.

## Tests / verification
- Edge via puppeteer-core: rendered all 23 sprites with real `sjovt.css`/`sjovt.js` in light and dark and looked at both images (`scratchpad\impl\w-icons\sheet-light.png`, `sheet-dark.png`). Found `cykel` and `hat` outlines near invisible in dark mode.
- 1366x768 screenshots of 7 pages (`m-anton`, `m-praep`, `m-magiske`, `m-idiom`, `m-mester`, `m-tids`, `m-boejn`); looked at the first four to confirm mixed density and duplicated header sprite in the first card.
- Greps of `data-sd-sprite` / `spriteSVG` / `MODE_SPR` / `GAME_SPR` for the usage table. No game, theme or frozen file touched; no tests apply (docs only).

## Files
- Added: `docs/redesign/icon-map.md`, `stories/implementation/B5-icon-map.md`.
- Scratchpad only: `impl/w-icons/*`.

## Remaining BLOCKED
- 32px shaded stats/results icon, difficulty icon, real stopwatch (speed), and redraw of the flat generic set (owner approval, frozen `sjovt.js`).
- Portal `index.html:216` (`hat`).

## Risks / notes
- Several roles are least-bad picks (drag `tandhjul`, difficulty stars, speed `tryllestav`, error-hunt `pin`); the owner should confirm them before game workers apply the table.
- Reusing portal identity sprites as role sprites (`kiste`, `lup`, `tidsstjerne`, `ur`) is unavoidable with 14 shaded sprites.
- Not edited by design: `docs/redesign/AGENT-BRIEF.md` should reference the map (suggested follow-up, US-053).
