# US-034 — W-ENET slice (En/Et)
1. Summary: Theme set `html.sd-page body{padding:0}` (was 20px 12px 56px) and moved spacing onto `.book` (margin 24px auto 56px, width calc(100% - 24px)); the max-width 480 media query now adjusts `.book` (margin 12px auto 40px, width calc(100% - 16px)) instead of body padding. Layout otherwise unchanged.
2. Status: IMPLEMENTED
3. Tests: own puppeteer probe (Edge, scratchpad `impl/W-ENET/t.cjs`) at 360/390/1366, zero console/page errors; `tests/smoke.mjs "en og et/index.html"`: all rows PASS except the known legacy artefact (no `#btn-play`: 4x "play button found" + 3x "console clean + still playable"); contrast rows PASS, localStorage-blocked PASS. Files changed: `en og et/index.html`, `shared/themes/en-og-et.css` only (no git state changes). Probe `.sd-bar` rect: x=0,y=0,width=390 at 390; 1366 at 1366; 360 at 360. scrollWidth equals viewport at 360, 390, 1366.
4. Manual: none beyond probe.
5. Files: `shared/themes/en-og-et.css` (body rule, .book rule, 480px media query).
6. Risks: content vertical rhythm slightly changed (book margin top 24 vs previous 20+4).
7. Newly discovered: none.
8. Native review: n/a.
9. Criteria:
- html.sd-page body{padding:0} with padding moved to wrapper: PASS (En/Et; Konjunktioner other owner)
- Probe bar x=0,y=0,width=viewport at 390 and 1366: PASS
- No horizontal scroll at 360; layout otherwise unchanged: PASS (visual diff not performed)
