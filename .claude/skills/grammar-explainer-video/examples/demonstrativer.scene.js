// denne, dette eller disse: påpegende ord efter en-ord, et-ord og flertal.
// Sætninger efter spillets mønster (demonstrative): denne bil/kage, dette hus, disse sko.
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "demonstrativer",
  title: "denne, dette, disse",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Hvad", "koster", "{2}", "bil"], slots: { 2: { answer: "denne" } } },
    { type: "highlight", t: 1200, word: 3, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "dette", ok: false },
    { type: "try", t: 2000, slot: 2, word: "denne", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["en bil → denne bil", "et hus → dette hus", "flertal → disse sko"] },
    { type: "cycle", t: 2800, sentence: { words: ["Hvad", "koster", "{2}", "hus"], slots: { 2: { answer: "dette" } } } },
    { type: "try", t: 1800, slot: 2, word: "dette", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hvad", "koster", "{2}", "sko"], slots: { 2: { answer: "disse" } } } },
    { type: "try", t: 1800, slot: 2, word: "disse", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hvad", "koster", "{2}", "kage"], slots: { 2: { answer: "denne" } } } },
    { type: "try", t: 1800, slot: 2, word: "denne", ok: true }
  ]
};
