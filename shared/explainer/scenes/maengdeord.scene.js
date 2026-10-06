// Mængdeord: mange/få foran ting, der kan tælles (flertal); meget/lidt foran ting, der ikke kan tælles.
// Sætninger er hentet fra spillets egne data (Mængdeværkstedet): mange mennesker, meget tid, få venner, lidt mælk.
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "maengdeord",
  title: "mange eller meget",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Der", "er", "{2}", "mennesker", "i", "parken"], slots: { 2: { answer: "mange" } } },
    { type: "highlight", t: 1200, word: 3, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "meget", ok: false },
    { type: "try", t: 2000, slot: 2, word: "mange", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["mange, få → kan tælles", "meget, lidt → tælles ikke", "mange bøger, meget tid"] },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "ikke", "{3}", "tid"], slots: { 3: { answer: "meget" } } } },
    { type: "try", t: 1800, slot: 3, word: "meget", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Han", "har", "kun", "{3}", "venner"], slots: { 3: { answer: "få" } } } },
    { type: "try", t: 1800, slot: 3, word: "få", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Vi", "har", "kun", "{3}", "mælk"], slots: { 3: { answer: "lidt" } } } },
    { type: "try", t: 1800, slot: 3, word: "lidt", ok: true }
  ]
};
