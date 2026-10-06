// Inversion efter bindeadverbier (derfor, alligevel): verbum foer subjekt. Taught by Forbindenor ("kommer verbet foer grundleddet").
// Total duration: part 1 11.6 s + derfor example 5.3 s (to 16.9) + alligevel example 5.3 s (to 22.2) + 0.5 pause + final rule 3.5 = ~26.2 s.
// Tiles are lowercase on purpose (the player cannot re-capitalise a moved tile). Clause one is a single tile.
window.EXPLAINER_SCENE = {
  id: "inversion-derfor",
  title: "derfor: verbum først",
  level: "B2",
  verify: false,
  steps: [
    // Part 1: wrong order (subjekt foer verbum) is marked, then the verb moves before the subject
    { type: "sentence", words: ["Han var syg,", "derfor", "han", "blev", "hjemme"], t: 2000 },
    { type: "highlight", word: 1, color: "Y", t: 1200 },
    { type: "highlight", words: [2, 3], color: "R", t: 1600 },   // wrong: subjekt foer verbum (no arrow: label overlaps wrapped row at 360px)
    { type: "move", word: 3, to: 2, t: 1800 },
    { type: "highlight", words: [2, 3], color: "G", t: 1500 },
    { type: "rule", lines: ["derfor / alligevel:", "verbum – subjekt", "derfor blev han hjemme"], t: 3500 },

    // Part 2: second derfor example
    { type: "cycle", sentence: { words: ["Hun var dygtig,", "derfor", "hun", "fik", "jobbet"] }, t: 2000 },
    { type: "move", word: 3, to: 2, t: 1800 },
    { type: "highlight", words: [2, 3], color: "G", t: 1500 },

    // Part 3: alligevel
    { type: "cycle", sentence: { words: ["Han var træt,", "alligevel", "han", "læste"] }, t: 2000 },
    { type: "move", word: 3, to: 2, t: 1800 },
    { type: "highlight", words: [2, 3], color: "G", t: 1500 },
    { type: "pause", t: 500 },
    { type: "rule", lines: ["derfor blev han", "men han blev"], t: 3500 }
  ]
};
