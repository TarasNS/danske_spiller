// nutid og datid: tidsord afgoer verbets form (i dag + nutid, i gaar + datid).
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Alle former er sikre: spiser/spiste, laeser/laeste, drikker/drak. verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "tider-nutid-datid",
  title: "nutid og datid",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["I", "går", "{2}", "jeg", "pizza"], slots: { 2: { answer: "spiste" } } },
    { type: "highlight", t: 1200, words: [0, 1], color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "spiser", ok: false },
    { type: "try", t: 2000, slot: 2, word: "spiste", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["i går → datid", "i dag → nutid", "spiser → spiste"] },
    { type: "cycle", t: 2800, sentence: { words: ["I", "dag", "{2}", "jeg", "pizza"], slots: { 2: { answer: "spiser" } } } },
    { type: "try", t: 1800, slot: 2, word: "spiser", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["I", "går", "{2}", "hun", "en", "bog"], slots: { 2: { answer: "læste" } } } },
    { type: "try", t: 1800, slot: 2, word: "læste", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["I", "morges", "{2}", "vi", "kaffe"], slots: { 2: { answer: "drak" } } } },
    { type: "try", t: 1800, slot: 2, word: "drak", ok: true }
  ]
};
