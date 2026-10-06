// Konjunktioner efter BETYDNING: og = lægger til, men = modsætning, fordi = årsag, så = følge.
// Saetninger er fra konjunktioner/konjunktioner.html (hovedsaetnings-og/men/saa og bisaetnings-fordi).
// Total varighed: se validatoren (maal 20-40 s).
window.EXPLAINER_SCENE = {
  id: "konjunktioner-betydning",
  title: "og, men, fordi, så",
  level: "A2",
  verify: false,
  steps: [
    { type: "sentence", words: ["Mor laver kaffe,", "{1}", "far smører brød"], slots: { 1: { answer: "og" } }, t: 2400 },
    { type: "try", slot: 1, word: "men", ok: false, t: 1800 },
    { type: "try", slot: 1, word: "og", ok: true, t: 1800 },
    { type: "rule", lines: ["og = lægger til", "men = modsætning"], t: 3200 },
    { type: "cycle", sentence: { words: ["Hun er ung,", "{1}", "hun er meget erfaren"], slots: { 1: { answer: "men" } } }, t: 2400 },
    { type: "try", slot: 1, word: "men", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Bussen var forsinket,", "{1}", "jeg kom for sent"], slots: { 1: { answer: "så" } } }, t: 2400 },
    { type: "try", slot: 1, word: "fordi", ok: false, t: 1800 },
    { type: "try", slot: 1, word: "så", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Jeg går tidligt i seng,", "{1}", "jeg er meget træt"], slots: { 1: { answer: "fordi" } } }, t: 2400 },
    { type: "try", slot: 1, word: "men", ok: false, t: 1800 },
    { type: "try", slot: 1, word: "fordi", ok: true, t: 1800 },
    { type: "pause", t: 400 },
    { type: "rule", lines: ["fordi = årsag", "så = følge", "men = modsætning"], t: 3500 }
  ]
};
