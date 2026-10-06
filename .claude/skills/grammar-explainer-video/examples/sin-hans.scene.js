// sin eller hans: sin/sit/sine = ejeren er saetningens eget subjekt; hans/hendes = en anden person.
// Kun entydige par uden gab (begge laesninger ville ellers vaere mulige): Peter ser sin bror / Peter ser hans bror.
// Total varighed: 28,2 s (sum af t: 2400+2200+1500+500 + 2400+1200+2200+500 + 5000 + 2400+2000 + 2400+2000 + 1500 = 28200 ms). Maal: 20-40 s.
window.EXPLAINER_SCENE = {
  id: "sin-hans",
  title: "sin eller hans",
  level: "B1",
  verify: false,
  steps: [
    { type: "sentence", t: 2400, words: ["Peter", "ser", "sin", "bror"] },
    { type: "highlight", t: 2200, words: [0, 2], color: "G" },
    { type: "highlight", t: 1500, word: 3, color: "Y" },
    { type: "pause", t: 500 },
    { type: "cycle", t: 2400, sentence: { words: ["Peter", "ser", "hans", "bror"] } },
    { type: "highlight", t: 1200, word: 0, color: "Y" },
    { type: "highlight", t: 2200, word: 2, color: "R" },
    { type: "pause", t: 500 },
    { type: "rule", t: 5000, lines: ["sin = subjektets eget", "hans, hendes = andre", "sit (et), sine (flere)"] },
    { type: "cycle", t: 2400, sentence: { words: ["Anna", "vasker", "sin", "bil"] } },
    { type: "highlight", t: 2000, words: [0, 2], color: "G" },
    { type: "cycle", t: 2400, sentence: { words: ["Anna", "vasker", "hendes", "bil"] } },
    { type: "highlight", t: 2000, word: 2, color: "R" },
    { type: "pause", t: 1500 }
  ]
};
