# US-037 - W-DM slice (Dansk Mester)

1. Summary: mode names got soft hyphens (`Interval&shy;repetition`, `Tids&shy;udfordring`, `Blandet re&shy;petition`). CSS: `.mode{min-width:0}`; `.mode .mname` and `.ach .aname` get `max-width:100%; overflow-wrap:anywhere; hyphens:auto` and clamp() font sizes.
2. Status: IMPLEMENTED
3. Tests: at 360x740 (modes, badges, stats screens) documentElement scrollWidth 360 == clientWidth 360, and no .mode/.ach/.mname/.aname element with scrollWidth > clientWidth; also OK at 1440. Smoke as in US-028-W-DM (known `#btn-play` artefact).
4. Manual: DOM check that mode names contain soft hyphens. No screenshot review done.
5. Files: shared/themes/dansk-mester.css (~136-138, ~273-274); danske-phraser/dansk-mester.html (~865-875 mode names).
6. Risks: visual look not reviewed by eye; the QA survey scripts were not re-run.
7. Newly discovered: none.
8. Native review: soft-hyphen split points (interval-repetition, tids-udfordring) are standard but unsigned.
9. Criteria:
- At 360x740 Dansk Mester scrollWidth === clientWidth; mode and badge labels fit - PASS
- Other bullets (other games' headings, SPIL, confetti, Glosekort) - other owner
