// Adverbier efter BETYDNING: stadig = det varer ved, derfor = følge, alligevel = på trods af.
// Saetninger er fra adverbs.html (alligevel, stadig, derfor). Total varighed: se validatoren (maal 20-40 s).
window.EXPLAINER_SCENE = {
  id: "adverbier-betydning",
  title: "hvad de betyder",
  level: "B1",
  verify: false,
  steps: [
    { type: "sentence", words: ["Jeg kom for sent,", "men", "jeg nåede", "{3}", "mødet"], slots: { 3: { answer: "alligevel" } }, t: 2600 },
    { type: "highlight", word: 1, color: "Y", t: 1200 },
    { type: "try", slot: 3, word: "derfor", ok: false, t: 1800 },
    { type: "try", slot: 3, word: "alligevel", ok: true, t: 1800 },
    { type: "rule", lines: ["alligevel = på trods", "af det, der er sagt"], t: 3500 },
    { type: "cycle", sentence: { words: ["Hun", "arbejder", "{2}", "på", "projektet"], slots: { 2: { answer: "stadig" } } }, t: 2400 },
    { type: "try", slot: 2, word: "stadig", ok: true, t: 1800 },
    { type: "rule", lines: ["stadig = det varer ved"], t: 2800 },
    { type: "cycle", sentence: { words: ["Det regnede,", "{1}", "blev", "vi", "inde"], slots: { 1: { answer: "derfor" } } }, t: 2400 },
    { type: "try", slot: 1, word: "derfor", ok: true, t: 1800 },
    { type: "pause", t: 400 },
    { type: "rule", lines: ["stadig = varer ved", "derfor = en følge", "alligevel = på trods"], t: 3500 }
  ]
};
