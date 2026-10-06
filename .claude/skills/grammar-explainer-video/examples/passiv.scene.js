// passiv: s-passiv i faste regler og procedurer uden bestemt person (Maden serveres, ikke: maden serverer).
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra Tidsmaskinen (passive, s-passiv). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "passiv",
  title: "passiv: -s",
  level: "B1",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Maden", "{1}", "kun", "mellem", "11", "og", "13"], slots: { 1: { answer: "serveres" } } },
    { type: "highlight", t: 1200, word: 0, color: "Y" },
    { type: "try", t: 2000, slot: 1, word: "serverer", ok: false },
    { type: "try", t: 2000, slot: 1, word: "serveres", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["passiv: verbum + -s", "maden serveres", "ikke: maden serverer"] },
    { type: "cycle", t: 2800, sentence: { words: ["Lektierne", "{1}", "hver", "mandag"], slots: { 1: { answer: "afleveres" } } } },
    { type: "try", t: 1800, slot: 1, word: "afleveres", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Maskinerne", "{1}", "hver", "morgen"], slots: { 1: { answer: "kontrolleres" } } } },
    { type: "try", t: 1800, slot: 1, word: "kontrolleres", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Fødselsdagen", "{1}", "altid", "med", "kage"], slots: { 1: { answer: "fejres" } } } },
    { type: "try", t: 1800, slot: 1, word: "fejres", ok: true }
  ]
};
