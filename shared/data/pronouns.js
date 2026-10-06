// shared/data/pronouns.js
// Canonical Danish pronoun paradigms. Exports window.DANSK_PRONOUNS.
// Schema (see prd.md § 1.6):
// window.DANSK_PRONOUNS = { personal, possessive, reflexive_possessive, demonstrative, indefinite }
//   personal:  { subject, object, level }
//   possessive / reflexive_possessive / demonstrative:
//              { id, forms: { en, et, pl }, owner|type, level, note, verify }
//   indefinite: { id, note, level, verify }
(function () {
  'use strict';

  // Mode 1 coverage (pronomenmysteriet § 5.4): jeg/mig, du/dig, han/ham,
  // hun/hende, vi/os, I/jer, de/dem.
  var personal = [
    { subject: 'jeg', object: 'mig', level: 'A1' },
    { subject: 'du', object: 'dig', level: 'A1' },
    { subject: 'han', object: 'ham', level: 'A1' },
    { subject: 'hun', object: 'hende', level: 'A1' },
    { subject: 'vi', object: 'os', level: 'A1' },
    { subject: 'I', object: 'jer', level: 'A1' },
    { subject: 'de', object: 'dem', level: 'A1' }
  ];

  // Mode 2 coverage minus the reflexive "sin" (kept separate below), plus
  // the non-reflexive third-person forms needed to contrast with "sin" in
  // Mode 3 (Sin eller hans?).
  var possessive = [
    { id: 'min', forms: { en: 'min', et: 'mit', pl: 'mine' }, owner: '1sg', level: 'A1', note: 'Possessivet bøjes efter det ejede ord, ikke efter ejeren.', verify: false },
    { id: 'din', forms: { en: 'din', et: 'dit', pl: 'dine' }, owner: '2sg', level: 'A1', note: 'Possessivet bøjes efter det ejede ord, ikke efter ejeren.', verify: false },
    { id: 'hans', forms: { en: 'hans', et: 'hans', pl: 'hans' }, owner: '3sg_m_non_reflexive', level: 'A2', note: 'Hans er ubøjeligt og bruges kun når ejeren IKKE er sætningens subjekt.', verify: false },
    { id: 'hendes', forms: { en: 'hendes', et: 'hendes', pl: 'hendes' }, owner: '3sg_f_non_reflexive', level: 'A2', note: 'Hendes er ubøjeligt og bruges kun når ejeren IKKE er sætningens subjekt.', verify: false },
    { id: 'dens', forms: { en: 'dens', et: 'dens', pl: 'dens' }, owner: '3sg_en_non_reflexive', level: 'B1', note: 'Dens bruges om en en-tings ikke-refleksive ejerskab.', verify: false },
    { id: 'dets', forms: { en: 'dets', et: 'dets', pl: 'dets' }, owner: '3sg_et_non_reflexive', level: 'B1', note: 'Dets bruges om en et-tings ikke-refleksive ejerskab.', verify: false },
    { id: 'vores', forms: { en: 'vores', et: 'vores', pl: 'vores' }, owner: '1pl', level: 'A1', note: 'Vores er ubøjeligt.', verify: false },
    { id: 'jeres', forms: { en: 'jeres', et: 'jeres', pl: 'jeres' }, owner: '2pl', level: 'A2', note: 'Jeres er ubøjeligt.', verify: false },
    { id: 'deres', forms: { en: 'deres', et: 'deres', pl: 'deres' }, owner: '3pl_non_reflexive', level: 'A2', note: 'Deres er ubøjeligt og bruges både refleksivt og ikke-refleksivt for flertalsejere, da dansk mangler et separat flertals-refleksiv.', verify: false }
  ];

  // Mode 2 + Mode 3 coverage: the reflexive possessive agrees with the
  // possessed noun and refers back to the clause's own subject (singular
  // subject only — Danish has no distinct plural reflexive possessive).
  var reflexivePossessive = [
    { id: 'sin', forms: { en: 'sin', et: 'sit', pl: 'sine' }, owner: 'reflexive_3sg', level: 'A2', note: 'Sin/sit/sine henviser tilbage til et 3. person ental-subjekt og bøjes efter det ejede ord.', verify: false }
  ];

  // Mode 4 (den/det/de as anaphoric reference) + Mode 6 (Demonstrativsporet)
  // coverage: denne/dette/disse, den/det/de, sådan/sådant/sådanne, samme,
  // selv, egen/eget/egne.
  var demonstrative = [
    { id: 'den-det-de', forms: { en: 'den', et: 'det', pl: 'de' }, type: 'anaphoric_demonstrative', level: 'A1', note: 'Den/det stemmer overens med køn på det ord, der henvises til; de bruges om flertal.', verify: false },
    { id: 'denne', forms: { en: 'denne', et: 'dette', pl: 'disse' }, type: 'proximal_demonstrative', level: 'A2', note: 'Denne/dette/disse peger på noget nært eller lige nævnt og bøjes efter det efterfølgende navneords køn og tal.', verify: false },
    { id: 'saadan', forms: { en: 'sådan', et: 'sådant', pl: 'sådanne' }, type: 'qualitative_demonstrative', level: 'B1', note: 'Sådan/sådant/sådanne beskriver en bestemt slags eller kvalitet.', verify: false },
    { id: 'samme', forms: { en: 'samme', et: 'samme', pl: 'samme' }, type: 'identity_demonstrative', level: 'B1', note: 'Samme er ubøjeligt på tværs af køn og tal.', verify: false },
    { id: 'selv', forms: { en: 'selv', et: 'selv', pl: 'selv' }, type: 'emphatic_demonstrative', level: 'B1', note: 'Selv (efterstillet) understreger identitet: hende selv, huset selv.', verify: false },
    { id: 'egen', forms: { en: 'egen', et: 'eget', pl: 'egne' }, type: 'possessive_emphatic', level: 'B1', note: 'Egen/eget/egne følger efter et possessiv og understreger eneejerskab: sit eget værelse.', verify: false }
  ];

  // Mode 5 coverage (pronomenmysteriet § 5.4): nogen, nogle, noget, ingen,
  // intet, man, en, alle, begge, hver, hverken.
  var indefinite = [
    { id: 'nogen', note: 'Bruges typisk i spørgsmål og negation om tællelige ting (ental/flertal), men kan også stå i positive udsagn.', level: 'A2', verify: false },
    { id: 'nogle', note: 'Bruges typisk om ubestemt flertal i positive udsagn.', level: 'A2', verify: false },
    { id: 'noget', note: 'Bruges om utælleligt ental, både positivt og i spørgsmål/negation.', level: 'A2', verify: false },
    { id: 'ingen', note: 'Negerer tælleligt ental og flertal: ingen bøger, ingen penge.', level: 'A2', verify: false },
    { id: 'intet', note: 'Intetkønsformen af ingen (intet hus); mere formelt end "ikke noget".', level: 'B1', verify: false },
    { id: 'man', note: 'Generisk subjektspronomen svarende til "one"/"you" i generelle udsagn.', level: 'A2', verify: false },
    { id: 'en-pron', note: 'Objektsform/alternativ til "man" i mere uformel stil: det gør en glad.', level: 'B1', verify: true },
    { id: 'alle', note: 'Refererer til hele en tællelig gruppe, altid flertal.', level: 'A2', verify: false },
    { id: 'begge', note: 'Refererer specifikt til to, ikke flere.', level: 'B1', verify: false },
    { id: 'hver', note: 'Distributivt: refererer til hvert enkelt medlem af en gruppe, ental.', level: 'A2', verify: false },
    { id: 'hverken', note: 'Egentlig en konjunktion (ikke et pronomen): bruges i par med "eller" til at negere begge muligheder: hverken kaffe eller te.', level: 'B1', verify: false }
  ];

  window.DANSK_PRONOUNS = {
    personal: personal,
    possessive: possessive,
    reflexive_possessive: reflexivePossessive,
    demonstrative: demonstrative,
    indefinite: indefinite
  };
})();
