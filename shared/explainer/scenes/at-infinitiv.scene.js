// at-infinitiv: efter proeve, haabe, begynde, glemme (ikke modalverber) staar "at" + verbum (Jeg proever at laere dansk).
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra Tidsmaskinen (infinitive). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "at-infinitiv",
  title: "at + verbum",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Jeg", "prøver", "{2}", "lære", "dansk"], slots: { 2: { answer: "at" } } },
    { type: "highlight", t: 1200, words: [1, 3], color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "for", ok: false },
    { type: "try", t: 2000, slot: 2, word: "at", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["prøve, håbe, begynde", "+ at + verbum", "kan/skal/vil: uden at"] },
    { type: "cycle", t: 2800, sentence: { words: ["Hun", "håber", "{2}", "få", "jobbet"], slots: { 2: { answer: "at" } } } },
    { type: "try", t: 1800, slot: 2, word: "at", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Det", "begynder", "{2}", "regne"], slots: { 2: { answer: "at" } } } },
    { type: "try", t: 1800, slot: 2, word: "at", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Han", "glemte", "{2}", "ringe"], slots: { 2: { answer: "at" } } } },
    { type: "try", t: 1800, slot: 2, word: "at", ok: true }
  ]
};
