// pluskvamperfektum: havde + participium om noget, der var sket foer et andet tidspunkt i fortiden (Butikken havde lukket, da vi kom).
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra Tidsmaskinen (pluperfect). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "pluskvamperfektum",
  title: "pluskvamperfektum",
  level: "B1",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Butikken", "{1}", "allerede,", "da", "vi", "kom"], slots: { 1: { answer: "havde lukket" } } },
    { type: "highlight", t: 1200, words: [3, 4, 5], color: "Y" },
    { type: "try", t: 2000, slot: 1, word: "har lukket", ok: false },
    { type: "try", t: 2000, slot: 1, word: "havde lukket", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["havde + participium", "først sket → havde", "før en anden datid"] },
    { type: "cycle", t: 2800, sentence: { words: ["Chefen", "{1}", "mødet", "allerede,", "da", "vi", "kom"], slots: { 1: { answer: "havde aflyst" } } } },
    { type: "try", t: 1800, slot: 1, word: "havde aflyst", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Jeg", "{1}", "allerede,", "da", "du", "ringede"], slots: { 1: { answer: "havde handlet" } } } },
    { type: "try", t: 1800, slot: 1, word: "havde handlet", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Filmen", "{1}", "allerede,", "da", "vi", "kom", "ud"], slots: { 1: { answer: "havde sluttet" } } } },
    { type: "try", t: 1800, slot: 1, word: "havde sluttet", ok: true }
  ]
};
