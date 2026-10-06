// Flertal: oftest -er eller -e, nogle ord aendrer sig (bil -> biler, hus -> huse, barn -> boern).
// Ikke en fast regel: reglen siger "ofte". Total varighed: se validatoren (maal 20-40 s).
// Alle navneord er sikre og findes i shared/data/nouns.js: bil/biler, hus/huse, barn/børn, dreng/drenge.
window.EXPLAINER_SCENE = {
  id: "flertal",
  title: "flertal",
  level: "A1",
  verify: false,
  steps: [
    { type: "sentence", t: 2800, words: ["Jeg", "ser", "to", "{3}"], slots: { 3: { answer: "biler" } } },
    { type: "highlight", t: 1200, word: 2, color: "Y" },
    { type: "try", t: 1800, slot: 3, word: "bil", ok: false },
    { type: "try", t: 1800, slot: 3, word: "biler", ok: true },
    { type: "pause", t: 600 },
    { type: "rule", t: 5400, lines: ["Ofte -er: bil → biler", "Ofte -e: hus → huse", "Nogle ord: barn → børn"] },
    { type: "cycle", t: 2600, sentence: { words: ["Jeg", "ser", "to", "{3}"], slots: { 3: { answer: "huse" } } } },
    { type: "try", t: 1800, slot: 3, word: "huse", ok: true },
    { type: "cycle", t: 2600, sentence: { words: ["Jeg", "ser", "to", "{3}"], slots: { 3: { answer: "drenge" } } } },
    { type: "try", t: 1800, slot: 3, word: "drenge", ok: true },
    { type: "cycle", t: 2600, sentence: { words: ["Jeg", "ser", "to", "{3}"], slots: { 3: { answer: "børn" } } } },
    { type: "try", t: 1800, slot: 3, word: "børn", ok: true }
  ]
};
