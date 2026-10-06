// imperativ: bydeform = navnemaade uden -e (lukke -> luk, spise -> spis).
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra Tidsmaskinen (imperative). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "imperativ",
  title: "bydeform",
  level: "A1",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["{0}", "døren,", "tak"], slots: { 0: { answer: "Luk" } } },
    { type: "highlight", t: 1200, words: [1, 2], color: "Y" },
    { type: "try", t: 2000, slot: 0, word: "Lukker", ok: false },
    { type: "try", t: 2000, slot: 0, word: "Luk", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["bydeform: uden -e", "lukke → luk", "spise → spis"] },
    { type: "cycle", t: 2800, sentence: { words: ["{0}", "side", "23"], slots: { 0: { answer: "Læs" } } } },
    { type: "try", t: 1800, slot: 0, word: "Læs", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["{0}", "din", "mad"], slots: { 0: { answer: "Spis" } } } },
    { type: "try", t: 1800, slot: 0, word: "Spis", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["{0}", "til", "højre", "ved", "lyset"], slots: { 0: { answer: "Drej" } } } },
    { type: "try", t: 1800, slot: 0, word: "Drej", ok: true }
  ]
};
