// Gradbøjning: to ting -> komparativ (-ere), flere ting -> superlativ (-est). stor/større/størst, rig/rigere/rigest.
// Former stemmer med shared/data/adjectives.js: stor-større-størst, rig-rigere-rigest (ikke verify).
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "gradboejning",
  title: "stor, større, størst",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Huset", "er", "{2}", "end", "bilen"], slots: { 2: { answer: "større" } } },
    { type: "highlight", t: 1200, word: 3, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "størst", ok: false },
    { type: "try", t: 2000, slot: 2, word: "større", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["stor → større → størst", "to ting: -ere", "flere ting: -est"] },
    { type: "cycle", t: 2800, sentence: { words: ["Han", "er", "{2}", "end", "hende"], slots: { 2: { answer: "rigere" } } } },
    { type: "try", t: 1800, slot: 2, word: "rigere", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "er", "{2}", "i", "klassen"], slots: { 2: { answer: "størst" } } } },
    { type: "try", t: 1800, slot: 2, word: "størst", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Han", "er", "{2}", "i", "verden"], slots: { 2: { answer: "rigest" } } } },
    { type: "try", t: 1800, slot: 2, word: "rigest", ok: true }
  ]
};
