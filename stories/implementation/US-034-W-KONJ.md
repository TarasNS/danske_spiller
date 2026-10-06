# US-034 (Konjunktioner slice) - W-KONJ
Status: IMPLEMENTED (En/Et slice: other owner)
Summary: `html.sd-page body{padding:0}`; the former body padding moved to `.wrap` (width min(628px,100%) so content stays 600px). 480px media query now sets `.wrap{padding:14px 8px 32px}` instead of body.
Files: shared/themes/konjunktioner.css (l.26-30, ~155).
Tests: puppeteer probe (Edge): .sd-bar x=0,y=0,width=viewport at 360/390/1366; scrollWidth==viewport at 360 (no h-scroll); no console errors.
Risks: .wrap is now 28px wider outer box with padding (content width unchanged).
Criteria: body padding 0 + padding on wrapper - PASS (Konjunktioner); probe 390/1366 - PASS; no h-scroll at 360, layout otherwise unchanged - PASS (not visually diffed). En/Et parts: other owner.
