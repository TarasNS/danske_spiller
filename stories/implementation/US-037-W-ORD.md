# US-037 (Ordstilling slice) - W-ORD
Status: IMPLEMENTED
Summary: masthead h1 "Ordstillingsdetektiven" now "Ordstillings&shy;detektiven" (the .tag line already had it); theme already has overflow-wrap:anywhere + hyphens:auto + clamp() for h1/h2, so no CSS change. Case-card tiles below the fold left as recorded owner decision.
Tests: smoke start screen "no h-scroll" PASS on tablet/desktop/other viewports; headless Chromium did not render mid-word break check visually (NOT VERIFIED at 360x740 by screenshot).
Files: ordstilling-detektiv/index.html l.291.
Criteria: "Listed headings break only at &shy; points or fit via clamp()" - Ordstilling heading PASS by construction, visual NOT VERIFIED; other criteria: other owner.
