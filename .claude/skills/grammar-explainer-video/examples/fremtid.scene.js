// fremtid: en plan i fremtiden -> skal + verbum (Jeg skal rejse paa fredag), ikke datid.
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra Tidsmaskinen (future; accepterede svar skal rejse / skal starte / skal gaa / skal afgaa). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "fremtid",
  title: "fremtid: skal",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "{1}", "på", "fredag"], slots: { 1: { answer: "skal rejse" } } },
    { type: "highlight", t: 1200, words: [2, 3], color: "Y" },
    { type: "try", t: 2000, slot: 1, word: "rejste", ok: false },
    { type: "try", t: 2000, slot: 1, word: "skal rejse", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["plan: skal + verbum", "jeg skal rejse", "ikke datid: rejste"] },
    { type: "cycle", t: 2800, sentence: { words: ["Mødet", "{1}", "på", "tirsdag"], slots: { 1: { answer: "skal starte" } } } },
    { type: "try", t: 1800, slot: 1, word: "skal starte", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "{1}", "til", "tandlæge", "i", "morgen"], slots: { 1: { answer: "skal gå" } } } },
    { type: "try", t: 1800, slot: 1, word: "skal gå", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Toget", "{1}", "klokken", "otte", "i", "morgen"], slots: { 1: { answer: "skal afgå" } } } },
    { type: "try", t: 1800, slot: 1, word: "skal afgå", ok: true }
  ]
};
