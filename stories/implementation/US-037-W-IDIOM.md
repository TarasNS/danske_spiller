# US-037 (Idiomjæger slice) — W-IDIOM
## 1. Summary
Theme CSS only (`shared/themes/idiomjaeger.css`, appended block): confetti (`.sd-conf`) z-index lowered to 1 and `#app` raised to z-index 2, so confetti falls behind the results panel/text instead of over the numbers (no change to frozen `Sjovt.fx.celebrate`); `hyphens:auto` + `overflow-wrap` on headings, badge titles, menu buttons; result button rows wrap.
## 2. Status: IMPLEMENTED
## 3. Tests: 360x740 walk of 15 screens light/dark: scrollWidth 360, no console issues; results screenshot at 360 shows confetti only at the margins, behind the panel.
## 4. Manual: results screenshot viewed.
## 5. Files: `shared/themes/idiomjaeger.css` (end of file).
## 6. Risks: panel is opaque so confetti is visible mainly in side margins on narrow screens (by design of "behind the text").
## 7. Newly discovered: none.
## 9. Criteria (Idiomjæger-relevant)
| Criterion | Result |
|---|---|
| Confetti spawns behind the results text (z-index) or only from the trophy area. | PASS (z-index) |
| Listed headings break only at `&shy;` / fit via clamp() | Idiomjæger has no listed heading; hyphens:auto added as a safeguard |
| Dansk Mester, SPIL above fold (Bøjning/Pronomen), Glosekort filter | other owner |
