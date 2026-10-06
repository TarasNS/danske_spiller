// den, det eller de: pronomenet retter sig efter det navneord, det henviser til (en-ord, et-ord, flertal).
// Sætninger efter spillets mønster (den_det_de): hund/den, hus/det, søstre/de, kage/den.
// Total varighed: 27,6 s (3000+1200+2000+2000+600+5000 + 3x(2800+1800)). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "den-det-de",
  title: "den, det eller de",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "har", "en", "hund", "og", "{5}", "hedder", "Bo"], slots: { 5: { answer: "den" } } },
    { type: "highlight", t: 1200, word: 3, color: "Y" },
    { type: "try", t: 2000, slot: 5, word: "det", ok: false },
    { type: "try", t: 2000, slot: 5, word: "den", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5000, lines: ["en-ord → den", "et-ord → det", "flertal → de"] },
    { type: "cycle", t: 2800, sentence: { words: ["Vi", "har", "et", "hus", "og", "{5}", "er", "stort"], slots: { 5: { answer: "det" } } } },
    { type: "try", t: 1800, slot: 5, word: "det", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "to", "søstre", "og", "{5}", "bor", "i", "Sverige"], slots: { 5: { answer: "de" } } } },
    { type: "try", t: 1800, slot: 5, word: "de", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "har", "en", "kage", "og", "{5}", "smager", "godt"], slots: { 5: { answer: "den" } } } },
    { type: "try", t: 1800, slot: 5, word: "den", ok: true }
  ]
};
