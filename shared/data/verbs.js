// shared/data/verbs.js
// Canonical Danish verb dataset. Exports window.DANSK_VERBS.
// Schema (see prd.md § 1.5):
// { id, level, infinitive, present, preterite, perfect_auxiliary,
//   participle, imperative, passive_s, note, verify }
//
// Strategy (mirrors nouns.js / adjectives.js): mechanical builders for the
// three fully-regular weak conjugation classes, plus an explicit MANUAL array
// for the closed set of strong/irregular verbs and modal verbs. Strong verbs
// use vowel gradation and modals have an irregular present with no -r ending
// and no imperative, so neither can be produced by a builder.
(function () {
  'use strict';

  function slug(base) {
    return base
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .replace(/ø/g, 'oe')
      .replace(/å/g, 'aa')
      .replace(/é/g, 'e')
      .replace(/[^a-z0-9]+/g, '-');
  }

  function verbObj(level, inf, pres, pret, aux, part, imp, passiveS, note, verify) {
    return {
      id: slug(inf),
      level: level,
      infinitive: inf,
      present: pres,
      preterite: pret,
      perfect_auxiliary: aux,
      participle: part,
      imperative: imp === undefined ? null : imp,
      passive_s: passiveS === undefined ? null : passiveS,
      note: note,
      verify: !!verify
    };
  }

  // Weak class 1 (-ede/-et), infinitive ends in unstressed -e.
  // Stem = infinitive minus final -e; the double consonant of stems such as
  // spille/snakke is retained before -ede (spillede), which is correct.
  function weak1e(level, inf, gloss, transitive, aux, verify) {
    var stem = inf.replace(/e$/, '');
    var pret = stem + 'ede';
    var part = stem + 'et';
    aux = aux || 'har';
    // Imperative: a doubled consonant is written single when word-final
    // (snakke -> snak, lukke -> luk, kysse -> kys, passe -> pas).
    var imp = stem.replace(/([b-df-hj-np-tv-z])\1$/, '$1');
    return verbObj(level, inf, inf + 'r', pret, aux, part, imp,
      transitive ? inf + 's' : null,
      inf + ' (' + gloss + ') bøjes svagt med -ede/-et: ' + pret + ', ' + aux + ' ' + part + '.',
      verify);
  }

  // Weak class 2 (-te/-t), infinitive ends in a single consonant + -e.
  // Only fed single-consonant stems so that stem+te never doubles wrongly.
  function weak2e(level, inf, gloss, transitive, aux, verify) {
    var stem = inf.replace(/e$/, '');
    var pret = stem + 'te';
    var part = stem + 't';
    aux = aux || 'har';
    return verbObj(level, inf, inf + 'r', pret, aux, part, stem,
      transitive ? inf + 's' : null,
      inf + ' (' + gloss + ') bøjes svagt med -te/-t: ' + pret + ', ' + aux + ' ' + part + '.',
      verify);
  }

  // Weak class 1, vowel-final infinitive (bo, tro, nå). Imperative = infinitive.
  function weak1v(level, inf, gloss, transitive, aux, verify) {
    var pret = inf + 'ede';
    var part = inf + 'et';
    aux = aux || 'har';
    return verbObj(level, inf, inf + 'r', pret, aux, part, inf,
      transitive ? inf + 's' : null,
      inf + ' (' + gloss + ') bøjes svagt: ' + pret + ', ' + aux + ' ' + part + '.',
      verify);
  }

  // Strong / irregular verbs and modals, all forms explicit.
  // row: [level, infinitive, present, preterite, participle, imperative, aux?, passive_s?]
  function strong(row) {
    var level = row[0], inf = row[1], pres = row[2], pret = row[3], part = row[4];
    var imp = row[5] === undefined ? null : row[5];
    var aux = row[6] || 'har';
    var pass = row[7] === undefined ? null : row[7];
    return verbObj(level, inf, pres, pret, aux, part, imp, pass,
      inf + ' er et uregelmæssigt verbum: ' + pres + ', ' + pret + ', ' + aux + ' ' + part + '.',
      false);
  }

  var MANUAL = [
    // Core high-frequency strong / irregular verbs
    ['A1', 'være', 'er', 'var', 'været', 'vær', 'har', null],
    ['A1', 'have', 'har', 'havde', 'haft', 'hav', 'har', null],
    ['A1', 'blive', 'bliver', 'blev', 'blevet', 'bliv', 'er', null],
    ['A1', 'gøre', 'gør', 'gjorde', 'gjort', 'gør', 'har', 'gøres'],
    ['A1', 'gå', 'går', 'gik', 'gået', 'gå', 'er', null],
    ['A2', 'stå', 'står', 'stod', 'stået', 'stå', 'har', null],
    ['A1', 'få', 'får', 'fik', 'fået', 'få', 'har', 'fås'],
    ['A1', 'se', 'ser', 'så', 'set', 'se', 'har', 'ses'],
    ['A1', 'sige', 'siger', 'sagde', 'sagt', 'sig', 'har', 'siges'],
    ['A1', 'vide', 'ved', 'vidste', 'vidst', 'vid', 'har', 'vides'],
    ['A2', 'ligge', 'ligger', 'lå', 'ligget', 'lig', 'har', null],
    ['A2', 'sidde', 'sidder', 'sad', 'siddet', 'sid', 'har', null],
    ['A1', 'tage', 'tager', 'tog', 'taget', 'tag', 'har', 'tages'],
    ['A1', 'finde', 'finder', 'fandt', 'fundet', 'find', 'har', 'findes'],
    ['A1', 'komme', 'kommer', 'kom', 'kommet', 'kom', 'er', null],
    ['A1', 'give', 'giver', 'gav', 'givet', 'giv', 'har', 'gives'],
    ['A1', 'drikke', 'drikker', 'drak', 'drukket', 'drik', 'har', 'drikkes'],
    ['A2', 'synge', 'synger', 'sang', 'sunget', 'syng', 'har', 'synges'],
    ['A2', 'springe', 'springer', 'sprang', 'sprunget', 'spring', 'er', null],
    ['B1', 'binde', 'binder', 'bandt', 'bundet', 'bind', 'har', 'bindes'],
    ['A1', 'skrive', 'skriver', 'skrev', 'skrevet', 'skriv', 'har', 'skrives'],
    ['B1', 'bide', 'bider', 'bed', 'bidt', 'bid', 'har', 'bides'],
    ['B1', 'gribe', 'griber', 'greb', 'grebet', 'grib', 'har', 'gribes'],
    ['A1', 'hjælpe', 'hjælper', 'hjalp', 'hjulpet', 'hjælp', 'har', 'hjælpes'],
    ['A2', 'løbe', 'løber', 'løb', 'løbet', 'løb', 'er', null],
    ['A1', 'holde', 'holder', 'holdt', 'holdt', 'hold', 'har', 'holdes'],
    ['A2', 'falde', 'falder', 'faldt', 'faldet', 'fald', 'er', null],
    ['A1', 'hedde', 'hedder', 'hed', 'heddet', 'hed', 'har', null],
    ['A1', 'lægge', 'lægger', 'lagde', 'lagt', 'læg', 'har', 'lægges'],
    ['A1', 'sætte', 'sætter', 'satte', 'sat', 'sæt', 'har', 'sættes'],
    ['A2', 'vælge', 'vælger', 'valgte', 'valgt', 'vælg', 'har', 'vælges'],
    ['A2', 'sælge', 'sælger', 'solgte', 'solgt', 'sælg', 'har', 'sælges'],
    ['A2', 'følge', 'følger', 'fulgte', 'fulgt', 'følg', 'har', 'følges'],
    ['A2', 'fortælle', 'fortæller', 'fortalte', 'fortalt', 'fortæl', 'har', 'fortælles'],
    ['A2', 'tælle', 'tæller', 'talte', 'talt', 'tæl', 'har', 'tælles'],
    ['A2', 'spørge', 'spørger', 'spurgte', 'spurgt', 'spørg', 'har', 'spørges'],
    ['B2', 'gælde', 'gælder', 'gjaldt', 'gældt', 'gæld', 'har', null],
    ['A2', 'bære', 'bærer', 'bar', 'båret', 'bær', 'har', 'bæres'],
    ['A2', 'skære', 'skærer', 'skar', 'skåret', 'skær', 'har', 'skæres'],
    ['B1', 'stjæle', 'stjæler', 'stjal', 'stjålet', 'stjæl', 'har', 'stjæles'],
    ['B1', 'række', 'rækker', 'rakte', 'rakt', 'ræk', 'har', 'rækkes'],
    ['B1', 'strække', 'strækker', 'strakte', 'strakt', 'stræk', 'har', 'strækkes'],
    ['A2', 'bede', 'beder', 'bad', 'bedt', 'bed', 'har', 'bedes'],
    ['A2', 'lade', 'lader', 'lod', 'ladet', 'lad', 'har', 'lades'],
    ['A2', 'slå', 'slår', 'slog', 'slået', 'slå', 'har', 'slås'],
    ['A2', 'forstå', 'forstår', 'forstod', 'forstået', 'forstå', 'har', 'forstås'],
    ['B1', 'bestå', 'består', 'bestod', 'bestået', 'bestå', 'har', null],
    ['A2', 'sove', 'sover', 'sov', 'sovet', 'sov', 'har', null],
    ['A2', 'dø', 'dør', 'døde', 'død', 'dø', 'er', null],
    ['A2', 'vinde', 'vinder', 'vandt', 'vundet', 'vind', 'har', 'vindes'],
    ['B1', 'forsvinde', 'forsvinder', 'forsvandt', 'forsvundet', 'forsvind', 'er', null],
    ['B1', 'flyve', 'flyver', 'fløj', 'fløjet', 'flyv', 'er', null],
    ['B1', 'nyde', 'nyder', 'nød', 'nydt', 'nyd', 'har', 'nydes'],
    ['B1', 'bryde', 'bryder', 'brød', 'brudt', 'bryd', 'har', 'brydes'],
    ['B1', 'skyde', 'skyder', 'skød', 'skudt', 'skyd', 'har', 'skydes'],
    ['B1', 'lyde', 'lyder', 'lød', 'lydt', 'lyd', 'har', null],
    ['B1', 'tilbyde', 'tilbyder', 'tilbød', 'tilbudt', 'tilbyd', 'har', 'tilbydes'],
    ['B1', 'fryse', 'fryser', 'frøs', 'frosset', 'frys', 'har', 'fryses'],
    ['B1', 'slippe', 'slipper', 'slap', 'sluppet', 'slip', 'har', 'slippes'],
    ['A2', 'trække', 'trækker', 'trak', 'trukket', 'træk', 'har', 'trækkes'],
    ['B1', 'stikke', 'stikker', 'stak', 'stukket', 'stik', 'har', 'stikkes'],
    ['B1', 'forlade', 'forlader', 'forlod', 'forladt', 'forlad', 'har', 'forlades'],
    ['A2', 'græde', 'græder', 'græd', 'grædt', 'græd', 'har', null],
    ['B1', 'lyve', 'lyver', 'løj', 'løjet', 'lyv', 'har', null],
    ['B1', 'ride', 'rider', 'red', 'redet', 'rid', 'er', null],
    ['B1', 'bringe', 'bringer', 'bragte', 'bragt', 'bring', 'har', 'bringes'],
    ['B2', 'gentage', 'gentager', 'gentog', 'gentaget', 'gentag', 'har', 'gentages'],
    ['A2', 'ske', 'sker', 'skete', 'sket', null, 'er', null],
    // Modal verbs: irregular present (no -r), no imperative
    ['A1', 'kunne', 'kan', 'kunne', 'kunnet', null, 'har', null],
    ['A1', 'ville', 'vil', 'ville', 'villet', null, 'har', null],
    ['A1', 'skulle', 'skal', 'skulle', 'skullet', null, 'har', null],
    ['A1', 'måtte', 'må', 'måtte', 'måttet', null, 'har', null],
    ['A2', 'burde', 'bør', 'burde', 'burdet', null, 'har', null],
    ['B1', 'turde', 'tør', 'turde', 'turdet', null, 'har', null],
    ['B1', 'gide', 'gider', 'gad', 'gidet', null, 'har', null]
  ].map(strong);

  // Weak class 1 (-ede/-et), -e infinitives.
  // row: [level, infinitive, gloss, transitive]
  var WEAK1E = [
    ['A1', 'lave', 'lave, fremstille', true],
    ['A1', 'arbejde', 'udføre arbejde', false],
    ['A1', 'vente', 'blive et sted til noget sker', false],
    ['A1', 'hente', 'gå og få noget', true],
    ['A1', 'ønske', 'gerne ville have', true],
    ['A1', 'huske', 'kunne genkalde sig', true],
    ['A1', 'kigge', 'se på noget', false],
    ['A1', 'snakke', 'tale uformelt', false],
    ['A1', 'spille', 'spille spil eller musik', true],
    ['A1', 'elske', 'holde meget af', true],
    ['A2', 'hade', 'ikke kunne lide', true],
    ['A1', 'vaske', 'gøre rent med vand', true],
    ['A1', 'koste', 'have en pris', false],
    ['A1', 'danse', 'bevæge sig til musik', false],
    ['A2', 'lytte', 'høre efter', false],
    ['A1', 'åbne', 'gøre åben', true],
    ['A1', 'lukke', 'gøre lukket', true],
    ['A1', 'ringe', 'ringe eller telefonere', false],
    ['A2', 'hoppe', 'springe op', false],
    ['A1', 'svare', 'give svar', false],
    ['A1', 'starte', 'begynde', false],
    ['A2', 'slutte', 'afslutte', false],
    ['A2', 'handle', 'gøre eller købe ind', false],
    ['B1', 'fungere', 'virke', false],
    ['A2', 'studere', 'læse på universitet', false],
    ['B1', 'diskutere', 'tale om et emne', true],
    ['B1', 'reservere', 'bestille på forhånd', true],
    ['B1', 'reparere', 'sætte i stand', true],
    ['B1', 'fotografere', 'tage billeder', true],
    ['B1', 'interessere', 'vække interesse', true],
    ['B1', 'bevæge', 'flytte eller røre', true],
    ['A2', 'ændre', 'gøre anderledes', true],
    ['B1', 'vandre', 'gå en lang tur', false],
    ['A1', 'cykle', 'køre på cykel', false],
    ['A1', 'regne', 'falde som regn', false],
    ['A2', 'tegne', 'lave en tegning', true],
    ['B1', 'danne', 'skabe eller udgøre', true],
    ['A2', 'samle', 'lægge sammen', true],
    ['A1', 'smile', 'trække på smilebåndet', false],
    ['A2', 'hvile', 'slappe af', false],
    ['A2', 'male', 'male med maling', true],
    ['A2', 'pakke', 'lægge i pakke', true],
    ['A2', 'klare', 'greje eller magte', true],
    ['A1', 'passe', 'passe eller tage sig af', false],
    ['A2', 'vinke', 'vinke med hånden', false],
    ['B1', 'ryste', 'bevæge frem og tilbage', true],
    ['A2', 'fejre', 'holde fest for', true],
    ['A2', 'ordne', 'sætte i orden', true],
    ['A2', 'ligne', 'se ud som', true],
    ['A2', 'bade', 'gå i bad eller vand', false],
    ['A2', 'rette', 'gøre korrekt', true],
    ['A2', 'pege', 'vise med fingeren', false],
    ['A2', 'nikke', 'bøje hovedet', false],
    ['A2', 'kramme', 'give et knus', true],
    ['A2', 'kysse', 'give et kys', true],
    ['A1', 'bygge', 'opføre', true],
    ['A1', 'lege', 'lege som børn', false],
    ['A1', 'prøve', 'forsøge', true],
    ['A1', 'leve', 'være i live', false],
    ['A2', 'stoppe', 'holde op', true],
    ['A2', 'kaste', 'smide', true],
    ['A2', 'flytte', 'skifte sted', false],
    ['A2', 'skifte', 'udskifte', true],
    ['A2', 'lande', 'komme ned på jorden', false],
    ['B1', 'opdage', 'finde ud af', true],
    ['B1', 'blande', 'røre sammen', true],
    ['B1', 'undre', 'forbavse', false],
    ['B1', 'hviske', 'tale meget lavt', false],
    ['B1', 'rulle', 'trille rundt', true],
    ['B1', 'træne', 'øve sig', false],
    ['B1', 'organisere', 'arrangere', true],
    ['B1', 'arrangere', 'ordne på forhånd', true],
    ['B1', 'informere', 'give oplysninger', true],
    ['B1', 'kontrollere', 'tjekke', true],
    ['B1', 'producere', 'fremstille', true],
    ['B1', 'importere', 'føre ind i landet', true],
    ['B1', 'eksportere', 'føre ud af landet', true],
    ['B1', 'investere', 'sætte penge i', true],
    ['B1', 'fokusere', 'rette opmærksomhed', false],
    ['B1', 'analysere', 'undersøge grundigt', true],
    ['B1', 'kritisere', 'påpege fejl', true],
    ['B1', 'definere', 'fastlægge betydning', true],
    ['B1', 'ignorere', 'overse med vilje', true],
    ['B1', 'respektere', 'have respekt for', true],
    ['B1', 'acceptere', 'gå med til', true],
    ['B1', 'eksistere', 'være til', false],
    ['B1', 'præsentere', 'fremvise', true],
    ['B1', 'notere', 'skrive ned', true],
    ['B1', 'vurdere', 'bedømme', true],
    ['A2', 'grine', 'le', false]
  ];

  // Weak class 2 (-te/-t), single-consonant + -e infinitives.
  var WEAK2E = [
    ['A1', 'tale', 'sige noget med ord', false],
    ['A1', 'købe', 'anskaffe mod betaling', true],
    ['A1', 'bruge', 'anvende', true],
    ['A1', 'læse', 'læse tekst', true],
    ['A1', 'spise', 'indtage mad', true],
    ['A1', 'rejse', 'tage på rejse', false],
    ['A1', 'møde', 'træffe nogen', true],
    ['A1', 'høre', 'opfatte lyd', true],
    ['A1', 'lære', 'tilegne sig viden', true],
    ['A1', 'køre', 'føre et køretøj', false],
    ['A1', 'betale', 'give penge for', true],
    ['A2', 'fylde', 'gøre fuld', true],
    ['A2', 'føle', 'mærke eller sanse', true],
    ['A2', 'råbe', 'tale meget højt', false],
    ['B1', 'søge', 'lede efter', true],
    ['A2', 'besøge', 'aflægge besøg', true],
    ['A1', 'kende', 'have kendskab til', true],
    ['A1', 'sende', 'få bragt afsted', true],
    ['A2', 'vende', 'dreje om', true],
    ['A1', 'tænke', 'have tanker', false],
    ['A2', 'mene', 'have en holdning', false],
    ['A1', 'vise', 'gøre synlig', true],
    ['A2', 'kalde', 'give et navn', true],
    ['B1', 'tjene', 'få i løn', true],
    ['B1', 'undervise', 'give undervisning', true],
    ['B1', 'undersøge', 'granske nærmere', true],
    ['A2', 'koge', 'varme i vand', true],
    ['A2', 'dele', 'give en del til andre', true],
    ['A2', 'føre', 'lede eller styre', true],
    ['B1', 'nævne', 'omtale kort', true],
    ['B1', 'forberede', 'gøre klar', true]
  ];

  // Weak class 1, vowel-final infinitives.
  var WEAK1V = [
    ['A1', 'bo', 'have bopæl', false],
    ['A1', 'tro', 'antage for sandt', false],
    ['A2', 'nå', 'komme frem i tide', true],
    ['B1', 'ro', 'ro en båd', false],
    ['B1', 'sy', 'sy med nål og tråd', true]
  ];

  var built = []
    .concat(MANUAL)
    .concat(WEAK1E.map(function (r) { return weak1e(r[0], r[1], r[2], r[3]); }))
    .concat(WEAK2E.map(function (r) { return weak2e(r[0], r[1], r[2], r[3]); }))
    .concat(WEAK1V.map(function (r) { return weak1v(r[0], r[1], r[2], r[3]); }));

  window.DANSK_VERBS = built;
})();
