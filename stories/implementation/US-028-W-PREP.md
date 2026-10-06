# US-028 — W-PREP slice (dansk-praepositioner.html)

1. Summary: the mode header string `"🎯 Multiple choice"` is now `"🎯 Flervalg"` (dansk-praepositioner.html ~line 995). It is the only English UI string in this file; the grep for `CORRECT|WRONG|Continue|Next ▸|Finish ▸|Multiple choice|"Check"|Pronounce|ENERGY` returns 0 hits there.
2. Status: IMPLEMENTED
3. Tests: own puppeteer script (Edge), 360 px: opened Flervalg, badge text = "Flervalg", 0 page/console errors. smoke.mjs: see US-037-W-PREP.md.
4. Manual: badge read from the DOM.
5. Files: dansk-praepositioner.html (~line 995).
6. Risks: none.
7. Newly discovered: none.
8. Native review: none.
9. Criteria:
- Every string listed is replaced: PASS for this file's slice (other games: other owner)
- Grep returns 0 user-visible hits: PASS for dansk-praepositioner.html; other files other owner
- Accessible names are Danish: PASS for this file (no English aria-labels found); other games other owner
