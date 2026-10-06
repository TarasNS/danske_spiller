// nogen, nogle eller noget: nogen + en-ord, noget + et-ord (efter ikke), nogle + flertal i positiv sætning.
// Sætninger er hentet fra spillets egne data: Jeg har ikke nogen bil/cykel; Vi har ikke noget hus i Norge; Han har nogle børn.
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "nogen-nogle-noget",
  title: "nogen, nogle, noget",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "har", "ikke", "{3}", "bil"], slots: { 3: { answer: "nogen" } } },
    { type: "highlight", t: 1200, word: 4, color: "Y" },
    { type: "try", t: 2000, slot: 3, word: "noget", ok: false },
    { type: "try", t: 2000, slot: 3, word: "nogen", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["ikke + en-ord: nogen", "ikke + et-ord: noget", "positivt flertal: nogle"] },
    { type: "cycle", t: 2800, sentence: { words: ["Vi", "har", "ikke", "{3}", "hus", "i", "Norge"], slots: { 3: { answer: "noget" } } } },
    { type: "try", t: 1800, slot: 3, word: "noget", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Han", "har", "{2}", "børn"], slots: { 2: { answer: "nogle" } } } },
    { type: "try", t: 1800, slot: 2, word: "nogle", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "ikke", "{3}", "cykel"], slots: { 3: { answer: "nogen" } } } },
    { type: "try", t: 1800, slot: 3, word: "nogen", ok: true }
  ]
};
