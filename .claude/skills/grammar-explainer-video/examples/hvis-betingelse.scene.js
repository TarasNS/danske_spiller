// hvis-betingelse: aaben betingelse (noget, der kan ske) -> nutid i hvis-saetningen (Hvis jeg faar tid, ringer jeg), ikke ville + verbum.
// Total varighed: 27,8 s (3000+1200+2000+2000+600+5200 + 3x(2800+1800) = 27800 ms). Maal: 20-40 s.
// Saetninger er hentet fra Tidsmaskinen (conditional, aabne betingelser). verify:false er ok.
window.EXPLAINER_SCENE = {
  id: "hvis-betingelse",
  title: "hvis + nutid",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", t: 3000, words: ["Hvis", "jeg", "{2}", "tid,", "ringer", "jeg"], slots: { 2: { answer: "får" } } },
    { type: "highlight", t: 1200, word: 0, color: "Y" },
    { type: "try", t: 2000, slot: 2, word: "ville få", ok: false },
    { type: "try", t: 2000, slot: 2, word: "får", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5200, lines: ["hvis + nutid", "hvis jeg får tid,", "ringer jeg"] },
    { type: "cycle", t: 2800, sentence: { words: ["Hvis", "hun", "{2}", "i", "aften,", "spiser", "vi", "sammen"], slots: { 2: { answer: "kommer" } } } },
    { type: "try", t: 1800, slot: 2, word: "kommer", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hvis", "bussen", "ikke", "{3}", "tager", "vi", "en", "taxa"], slots: { 3: { answer: "kommer," } } } },
    { type: "try", t: 1800, slot: 3, word: "kommer,", ok: true },
    { type: "cycle", t: 2800, sentence: { words: ["Hvis", "det", "{2}", "i", "morgen,", "bliver", "vi", "hjemme"], slots: { 2: { answer: "regner" } } } },
    { type: "try", t: 1800, slot: 2, word: "regner", ok: true }
  ]
};
