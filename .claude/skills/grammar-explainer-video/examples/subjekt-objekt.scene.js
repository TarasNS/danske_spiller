// Subjekt eller objekt: han/ham, hun/hende, jeg/mig, vi/os, de/dem (Pronomenmysteriet, tilstanden subject_object).
// Sætninger er hentet fra spillets egne data: Hun hjælper ham med lektierne; Kan du se mig derovre; I morgen kommer han til middag; Hunden følger os overalt.
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "subjekt-objekt",
  title: "han eller ham",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Hun", "hjælper", "{2}", "med", "lektierne"], slots: { 2: { answer: "ham" } } },
    { type: "highlight", t: 1200, word: 1, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "han", ok: false },
    { type: "try", t: 2000, slot: 2, word: "ham", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["subjekt: han, hun, jeg", "objekt: ham, hende, mig", "vi → os, de → dem"] },
    { type: "cycle", t: 2800, sentence: { words: ["Kan", "du", "se", "{3}", "derovre"], slots: { 3: { answer: "mig" } } } },
    { type: "try", t: 1800, slot: 3, word: "mig", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["I", "morgen", "kommer", "{3}", "til", "middag"], slots: { 3: { answer: "han" } } } },
    { type: "try", t: 1800, slot: 3, word: "han", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hunden", "følger", "{2}", "overalt"], slots: { 2: { answer: "os" } } } },
    { type: "try", t: 1800, slot: 2, word: "os", ok: true }
  ]
};
