// foernutid med 'er': nogle verber bruger er + tillaegsform (Toget er kommet), ikke har.
// Kun komme, gaa, blive (samme verber som i Magiske Verber: er kommet, er gaaet, er blevet).
// Total varighed: 3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms. Maal: 20-40 s.
// Alle former er sikre: kommet, gaaet, blevet. verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "foernutid-er",
  title: "er + tillægsform",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Toget", "{1}", "kommet", "til", "tiden"], slots: { 1: { answer: "er" } } },
    { type: "highlight", t: 1200, word: 2, color: "Y" },
    { type: "try", t: 2000, slot: 1, word: "har", ok: false },
    { type: "try", t: 2000, slot: 1, word: "er", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["er + tillægsform", "komme, gå, blive", "ikke: har kommet"] },
    { type: "cycle", t: 2800, sentence: { words: ["Børnene", "{1}", "gået", "i", "skole"], slots: { 1: { answer: "er" } } } },
    { type: "try", t: 1800, slot: 1, word: "er", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Vejret", "{1}", "blevet", "bedre"], slots: { 1: { answer: "er" } } } },
    { type: "try", t: 1800, slot: 1, word: "er", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Min", "mor", "{2}", "kommet", "på", "besøg"], slots: { 2: { answer: "er" } } } },
    { type: "try", t: 1800, slot: 2, word: "er", ok: true }
  ]
};
