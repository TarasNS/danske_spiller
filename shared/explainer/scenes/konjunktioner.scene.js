// Konjunktioner: hovedsaetningskonjunktioner (og, men, eller, for) -> subjekt-verbum-ikke;
// bisaetningskonjunktioner (fordi, selvom, hvis, at) -> subjekt-ikke-verbum.
// Total duration: part 1 8.2 s + part 2 11.7 s (to 19.9) + selvom example 3.5 s (to 23.4) + 0.5 pause + final rule 3.2 = ~27.1 s.
// Tiles are lowercase on purpose (the player cannot re-capitalise a moved tile).
// "Jeg er glad," / "Han er glad," are single tiles (capital + comma; they never move) = the first clause.
window.EXPLAINER_SCENE = {
  id: "konjunktioner",
  title: "men eller fordi?",
  level: "B1",
  verify: false,
  steps: [
    // Part 1: hovedsaetningskonjunktion (men) -> verbum, derefter ikke
    { type: "sentence", words: ["Jeg er glad,", "men", "jeg", "arbejder", "ikke"], t: 2000 },
    { type: "highlight", word: 1, color: "Y", t: 1200 },
    { type: "highlight", words: [2, 3, 4], color: "G", t: 1500 },
    { type: "rule", lines: ["og / men / eller / for:", "subjekt – verbum – ikke", "men jeg arbejder ikke"], t: 3500 },

    // Part 2: bisaetningskonjunktion (fordi) -> ikke foer verbum
    { type: "cycle", sentence: { words: ["Jeg er glad,", "fordi", "jeg", "arbejder", "ikke"] }, t: 2000 },
    { type: "highlight", word: 1, color: "Y", t: 1200 },
    { type: "highlight", word: 4, color: "R", t: 1800 },   // wrong spot (no arrow: its label overlaps the wrapped row at 360px)
    { type: "move", word: 4, to: 3, t: 1800 },
    { type: "highlight", words: [2, 3, 4], color: "G", t: 1500 },
    { type: "rule", lines: ["fordi / selvom / hvis:", "subjekt – ikke – verbum", "fordi jeg ikke arbejder"], t: 3500 },

    // Part 3: one more subordinate example, then the contrast
    { type: "cycle", sentence: { words: ["Han er glad,", "selvom", "han", "ikke", "arbejder"] }, t: 2000 },
    { type: "highlight", words: [2, 3, 4], color: "G", t: 1500 },
    { type: "pause", t: 500 },
    { type: "rule", lines: ["men: verbum + ikke", "fordi: ikke + verbum"], t: 3200 }
  ]
};
