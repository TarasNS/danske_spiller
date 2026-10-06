// Gradbøjning med mere/mest: spændende og interessant bøjes ikke med -ere/-est.
// Former stemmer med shared/data/adjectives.js: mere/mest spændende, mere interessant, mest interessante (bestemt: den mest interessante film).
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "gradboejning-mere-mest",
  title: "mere og mest",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Filmen", "er", "{2}", "spændende", "end", "bogen"], slots: { 2: { answer: "mere" } } },
    { type: "highlight", t: 1200, word: 4, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "mest", ok: false },
    { type: "try", t: 2000, slot: 2, word: "mere", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["to ting: mere", "flere ting: mest", "ikke spændendere"] },
    { type: "cycle", t: 2800, sentence: { words: ["Bogen", "er", "{2}", "interessant", "end", "filmen"], slots: { 2: { answer: "mere" } } } },
    { type: "try", t: 1800, slot: 2, word: "mere", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Det", "er", "den", "{3}", "spændende", "bog"], slots: { 3: { answer: "mest" } } } },
    { type: "try", t: 1800, slot: 3, word: "mest", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Det", "er", "den", "{3}", "interessante", "film"], slots: { 3: { answer: "mest" } } } },
    { type: "try", t: 1800, slot: 3, word: "mest", ok: true }
  ]
};
