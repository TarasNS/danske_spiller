// Silent explainer: "til" = hen til et mål (retning/mål); "i" = hvor man er (sted).
// Hovedregel kun; faste udtryk (på arbejde, i byen ...) er ikke med. Saetninger efter dansk-praepositioner.html
// ("Jeg skal til lægen i morgen", "Hun gav gaven til sin mor", "Jeg cykler til arbejde" ...).
// Total duration: 2200+1800+1800+2000+1800+400+1800+2000+3600 + 2 x (2200+1800) ... se validator (maal 20-40 s).
window.EXPLAINER_SCENE = {
  id: "til",
  title: "til: hvorhen?",
  level: "A2",
  verify: false,
  steps: [
    // Part 1: sted (i) vs. retning (til)
    { type: "sentence", words: ["Jeg", "bor", "{2}", "København"], slots: { 2: { answer: "i" } }, t: 2200 },
    { type: "try", slot: 2, word: "til", ok: false, t: 1800 },
    { type: "try", slot: 2, word: "i", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Jeg", "skal", "{2}", "København", "i", "morgen"], slots: { 2: { answer: "til" } } }, t: 2400 },
    { type: "highlight", word: 1, color: "Y", t: 1200 },
    { type: "try", slot: 2, word: "i", ok: false, t: 1800 },
    { type: "pause", t: 400 },
    { type: "try", slot: 2, word: "til", ok: true, t: 1800 },
    { type: "arrow", from: 2, to: 3, label: "hen til", t: 1500 },
    { type: "rule", lines: ["til = hen til et mål", "i = hvor man er", "Jeg skal til lægen"], t: 3800 },

    // Part 2: more examples with til
    { type: "cycle", sentence: { words: ["Vi", "cykler", "{2}", "stationen"], slots: { 2: { answer: "til" } } }, t: 2200 },
    { type: "try", slot: 2, word: "til", ok: true, t: 1800 },
    { type: "cycle", sentence: { words: ["Hun", "gav", "gaven", "{3}", "sin", "mor"], slots: { 3: { answer: "til" } } }, t: 2200 },
    { type: "try", slot: 3, word: "til", ok: true, t: 1800 },
    { type: "pause", t: 400 },
    { type: "rule", lines: ["til = hen til et mål", "i = hvor man er"], t: 3000 }
  ]
};
