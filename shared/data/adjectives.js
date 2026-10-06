// shared/data/adjectives.js
// Canonical Danish adjective dataset. Exports window.DANSK_ADJECTIVES.
// Schema (see prd.md § 1.4):
// { id, level, base, common_form, neuter_form, definite_plural_form,
//   comparative, superlative_indefinite, superlative_definite,
//   periphrastic, irregular, irregular_comparison, indeclinable, note, verify }
//   irregular = neuter/agreement quirk (e.g. glad -> glad, not *gladt);
//   irregular_comparison = true only for genuinely irregular comparison (god -> bedre).
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

  // -ig / -lig / -tidlig etc: regular schwa-suffix class.
  // Neuter +t, definite/plural +e, comparative +ere, but the
  // superlative drops the linking vowel: -st / -ste (not -est / -este).
  // No consonant doubling occurs in this class (farlig -> farlige, not farlligge).
  function adjIg(level, base, verify) {
    var neuter = base + 't';
    var plural = base + 'e';
    return {
      id: slug(base),
      level: level,
      base: base,
      common_form: base,
      neuter_form: neuter,
      definite_plural_form: plural,
      comparative: base + 'ere',
      superlative_indefinite: base + 'st',
      superlative_definite: base + 'ste',
      periphrastic: false,
      irregular: false,
      indeclinable: false,
      note: base + ' bøjes regelmæssigt efter -ig/-lig-mønsteret: ' + neuter + ', ' + plural + ', ' + base + 'ere, ' + base + 'st.',
      verify: !!verify
    };
  }

  // Regular monosyllabic/other adjectives with no doubling and no schwa
  // ending: neuter +t, definite/plural +e, comparative +ere,
  // superlative +est / +este (full vowel retained, unlike the -ig class).
  function adjReg(level, base, gloss, verify) {
    var neuter = base + 't';
    var plural = base + 'e';
    return {
      id: slug(base),
      level: level,
      base: base,
      common_form: base,
      neuter_form: neuter,
      definite_plural_form: plural,
      comparative: base + 'ere',
      superlative_indefinite: base + 'est',
      superlative_definite: base + 'este',
      periphrastic: false,
      irregular: false,
      indeclinable: false,
      note: base + ' (' + gloss + ') bøjes regelmæssigt: ' + neuter + ', ' + plural + ', ' + base + 'ere, ' + base + 'est.',
      verify: !!verify
    };
  }

  // -som class: doubles the m before vowel-initial suffixes (-e, -ere)
  // but not before -t or -st (morsom -> morsomt, morsomme, morsommere, morsomst).
  function adjSom(level, base, gloss, verify) {
    var doubled = base + 'm';
    return {
      id: slug(base),
      level: level,
      base: base,
      common_form: base,
      neuter_form: base + 't',
      definite_plural_form: doubled + 'e',
      comparative: doubled + 'ere',
      superlative_indefinite: base + 'st',
      superlative_definite: base + 'ste',
      periphrastic: false,
      irregular: false,
      indeclinable: false,
      note: base + ' (' + gloss + ') fordobler m foran endelser med vokal: ' + doubled + 'e, ' + doubled + 'ere, men ikke foran -t/-st: ' + base + 't, ' + base + 'st.',
      verify: !!verify
    };
  }

  // -en class with schwa elision before plural/definite -ne (sulten -> sultne),
  // like the noun pattern søster -> søstre. Comparison is periphrastic in
  // standard usage (mere sulten / mest sulten).
  function adjEn(level, base, gloss, verify) {
    var stem = base.slice(0, -2);
    return {
      id: slug(base),
      level: level,
      base: base,
      common_form: base,
      neuter_form: base + 't',
      definite_plural_form: stem + 'ne',
      comparative: 'mere ' + base,
      superlative_indefinite: 'mest ' + base,
      superlative_definite: 'mest ' + stem + 'ne',
      periphrastic: true,
      irregular: false,
      indeclinable: false,
      note: base + ' (' + gloss + ') mister e foran -ne i bestemt/flertal: ' + stem + 'ne. Gradbøjning sker med mere/mest.',
      verify: !!verify
    };
  }

  // Periphrastic classes (mere/mest instead of -ere/-est): -isk adjectives,
  // participle-derived -et adjectives, and -løs compounds. neuterSame=true
  // means the neuter form is identical to the common form (no extra -t).
  // etClass=true means base is a past-participle adjective ending in -et,
  // whose plural/definite form is -ede, not a literal base+'e'
  // (forkølet -> forkølede, not forkølete).
  function adjPeriphrastic(level, base, gloss, neuterSame, verify, etClass) {
    var neuter = neuterSame ? base : base + 't';
    var plural = etClass ? base.slice(0, -1) + 'de' : base + 'e';
    return {
      id: slug(base),
      level: level,
      base: base,
      common_form: base,
      neuter_form: neuter,
      definite_plural_form: plural,
      comparative: 'mere ' + base,
      superlative_indefinite: 'mest ' + base,
      superlative_definite: 'mest ' + plural,
      periphrastic: true,
      irregular: false,
      indeclinable: false,
      note: etClass
        ? base + ' (' + gloss + ') er et førnutids tillægsord på -et; bestemt/flertal er -ede: ' + plural + '. Gradbøjes med mere/mest.'
        : base + ' (' + gloss + ') gradbøjes med mere/mest, ikke med endelser.',
      verify: !!verify
    };
  }

  // Fully explicit entries: irregular comparison, indeclinable/loan words,
  // colour adjectives ending in a vowel, and monosyllables with consonant
  // doubling or an unchanged neuter form that the builders above cannot
  // derive safely.
  var MANUAL = [
    // Irregular comparison
    { id: 'god', level: 'A1', base: 'god', common_form: 'god', neuter_form: 'godt', definite_plural_form: 'gode', comparative: 'bedre', superlative_indefinite: 'bedst', superlative_definite: 'bedste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'God bøjes uregelmæssigt: god → bedre → bedst.', verify: false },
    { id: 'daarlig', level: 'A1', base: 'dårlig', common_form: 'dårlig', neuter_form: 'dårligt', definite_plural_form: 'dårlige', comparative: 'værre', superlative_indefinite: 'værst', superlative_definite: 'værste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Dårlig bøjes uregelmæssigt i gradbøjning: dårlig → værre → værst.', verify: false },
    { id: 'gammel', level: 'A1', base: 'gammel', common_form: 'gammel', neuter_form: 'gammelt', definite_plural_form: 'gamle', comparative: 'ældre', superlative_indefinite: 'ældst', superlative_definite: 'ældste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Gammel mister e i bestemt/flertal (gamle) og gradbøjes uregelmæssigt: ældre, ældst.', verify: false },
    { id: 'lille', level: 'A1', base: 'lille', common_form: 'lille', neuter_form: 'lille', definite_plural_form: 'små', comparative: 'mindre', superlative_indefinite: 'mindst', superlative_definite: 'mindste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Lille bruges i ubestemt ental (en/et lille) og bestemt ental (den/det lille); flertal er det helt andet ord små.', verify: false },
    { id: 'mange', level: 'A1', base: 'mange', common_form: 'mange', neuter_form: 'mange', definite_plural_form: 'mange', comparative: 'flere', superlative_indefinite: 'flest', superlative_definite: 'fleste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: true, note: 'Mange bruges kun om flertal af tællelige navneord og bøjes ikke i køn.', verify: true },
    { id: 'faa', level: 'A1', base: 'få', common_form: 'få', neuter_form: 'få', definite_plural_form: 'få', comparative: 'færre', superlative_indefinite: 'færrest', superlative_definite: 'færreste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: true, note: 'Få bruges kun om flertal af tællelige navneord og bøjes ikke i køn.', verify: true },
    { id: 'stor', level: 'A1', base: 'stor', common_form: 'stor', neuter_form: 'stort', definite_plural_form: 'store', comparative: 'større', superlative_indefinite: 'størst', superlative_definite: 'største', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Stor bøjes uregelmæssigt: stor → større → størst.', verify: false },
    { id: 'ung', level: 'A1', base: 'ung', common_form: 'ung', neuter_form: 'ungt', definite_plural_form: 'unge', comparative: 'yngre', superlative_indefinite: 'yngst', superlative_definite: 'yngste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Ung gradbøjes uregelmæssigt: ung → yngre → yngst.', verify: false },
    { id: 'lang', level: 'A1', base: 'lang', common_form: 'lang', neuter_form: 'langt', definite_plural_form: 'lange', comparative: 'længere', superlative_indefinite: 'længst', superlative_definite: 'længste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Lang gradbøjes uregelmæssigt med vokalskifte: lang → længere → længst.', verify: false },
    { id: 'naer', level: 'B1', base: 'nær', common_form: 'nær', neuter_form: 'nært', definite_plural_form: 'nære', comparative: 'nærmere', superlative_indefinite: 'nærmest', superlative_definite: 'nærmeste', periphrastic: false, irregular: true, irregular_comparison: true, indeclinable: false, note: 'Nær gradbøjes uregelmæssigt med stammeudvidelse: nær → nærmere → nærmest.', verify: false },

    // Monosyllables with consonant doubling or an unchanged neuter form
    { id: 'smuk', level: 'A1', base: 'smuk', common_form: 'smuk', neuter_form: 'smukt', definite_plural_form: 'smukke', comparative: 'smukkere', superlative_indefinite: 'smukkest', superlative_definite: 'smukkeste', periphrastic: false, irregular: false, indeclinable: false, note: 'Smuk fordobler k foran endelser med vokal: smukke, smukkere, smukkest.', verify: false },
    { id: 'tyk', level: 'A1', base: 'tyk', common_form: 'tyk', neuter_form: 'tykt', definite_plural_form: 'tykke', comparative: 'tykkere', superlative_indefinite: 'tykkest', superlative_definite: 'tykkeste', periphrastic: false, irregular: false, indeclinable: false, note: 'Tyk fordobler k foran endelser med vokal: tykke, tykkere, tykkest.', verify: false },
    { id: 'flot', level: 'A2', base: 'flot', common_form: 'flot', neuter_form: 'flot', definite_plural_form: 'flotte', comparative: 'flottere', superlative_indefinite: 'flottest', superlative_definite: 'flotteste', periphrastic: false, irregular: true, indeclinable: false, note: 'Flot ender allerede på t, så intetkønsformen er uændret; t fordobles i flotte, flottere, flottest.', verify: false },
    { id: 'toer', level: 'A2', base: 'tør', common_form: 'tør', neuter_form: 'tørt', definite_plural_form: 'tørre', comparative: 'tørrere', superlative_indefinite: 'tørrest', superlative_definite: 'tørreste', periphrastic: false, irregular: false, indeclinable: false, note: 'Tør fordobler r foran endelser med vokal: tørre, tørrere, tørrest.', verify: false },
    { id: 'groen', level: 'A1', base: 'grøn', common_form: 'grøn', neuter_form: 'grønt', definite_plural_form: 'grønne', comparative: 'grønnere', superlative_indefinite: 'grønnest', superlative_definite: 'grønneste', periphrastic: false, irregular: false, indeclinable: false, note: 'Grøn fordobler n foran endelser med vokal: grønne, grønnere, grønnest.', verify: false },
    { id: 'nem', level: 'A1', base: 'nem', common_form: 'nem', neuter_form: 'nemt', definite_plural_form: 'nemme', comparative: 'nemmere', superlative_indefinite: 'nemmest', superlative_definite: 'nemmeste', periphrastic: false, irregular: false, indeclinable: false, note: 'Nem fordobler m foran endelser med vokal: nemme, nemmere, nemmest.', verify: false },
    { id: 'traet', level: 'A1', base: 'træt', common_form: 'træt', neuter_form: 'træt', definite_plural_form: 'trætte', comparative: 'mere træt', superlative_indefinite: 'mest træt', superlative_definite: 'mest trætte', periphrastic: true, irregular: false, indeclinable: false, note: 'Træt ender allerede på t, så intetkønsformen er uændret (trætte i bestemt/flertal); gradbøjning sker i moderne sprogbrug oftest med mere/mest.', verify: true },
    { id: 'glad', level: 'A1', base: 'glad', common_form: 'glad', neuter_form: 'glad', definite_plural_form: 'glade', comparative: 'gladere', superlative_indefinite: 'gladest', superlative_definite: 'gladeste', periphrastic: false, irregular: true, indeclinable: false, note: 'Glad får ikke -t i intetkøn (undtagelse): et glad barn, ikke *gladt.', verify: false },
    { id: 'let', level: 'A1', base: 'let', common_form: 'let', neuter_form: 'let', definite_plural_form: 'lette', comparative: 'lettere', superlative_indefinite: 'lettest', superlative_definite: 'letteste', periphrastic: false, irregular: true, indeclinable: false, note: 'Let ender allerede på t, så intetkønsformen er uændret; t fordobles i lette, lettere, lettest.', verify: false },
    { id: 'smal', level: 'A2', base: 'smal', common_form: 'smal', neuter_form: 'smalt', definite_plural_form: 'smalle', comparative: 'smallere', superlative_indefinite: 'smallest', superlative_definite: 'smalleste', periphrastic: false, irregular: false, indeclinable: false, note: 'Smal fordobler l foran endelser med vokal: smalle, smallere, smallest.', verify: true },
    { id: 'kort', level: 'A1', base: 'kort', common_form: 'kort', neuter_form: 'kort', definite_plural_form: 'korte', comparative: 'kortere', superlative_indefinite: 'kortest', superlative_definite: 'korteste', periphrastic: false, irregular: false, indeclinable: false, note: 'Kort ender allerede på t, så intetkønsformen er uændret: kort, korte, kortere, kortest.', verify: false },
    { id: 'sort', level: 'A1', base: 'sort', common_form: 'sort', neuter_form: 'sort', definite_plural_form: 'sorte', comparative: 'sortere', superlative_indefinite: 'sortest', superlative_definite: 'sorteste', periphrastic: false, irregular: false, indeclinable: false, note: 'Sort ender allerede på t, så intetkønsformen er uændret: sort, sorte, sortere, sortest.', verify: false },

    // Vowel-final colours and loanwords (indeclinable or partly indeclinable)
    { id: 'blaa', level: 'A1', base: 'blå', common_form: 'blå', neuter_form: 'blåt', definite_plural_form: 'blå', comparative: 'mere blå', superlative_indefinite: 'mest blå', superlative_definite: 'mest blå', periphrastic: true, irregular: false, indeclinable: false, note: 'Blå får -t i intetkøn (blåt) men er uændret i bestemt/flertal (blå); gradbøjning sker med mere/mest.', verify: false },
    { id: 'graa', level: 'A2', base: 'grå', common_form: 'grå', neuter_form: 'gråt', definite_plural_form: 'grå', comparative: 'mere grå', superlative_indefinite: 'mest grå', superlative_definite: 'mest grå', periphrastic: true, irregular: false, indeclinable: false, note: 'Grå får -t i intetkøn (gråt) men er uændret i bestemt/flertal (grå); gradbøjning sker med mere/mest.', verify: false },
    { id: 'lilla', level: 'B1', base: 'lilla', common_form: 'lilla', neuter_form: 'lilla', definite_plural_form: 'lilla', comparative: 'mere lilla', superlative_indefinite: 'mest lilla', superlative_definite: 'mest lilla', periphrastic: true, irregular: false, indeclinable: true, note: 'Lilla er ubøjeligt: samme form i alle køn og tal.', verify: false },
    { id: 'orange', level: 'B1', base: 'orange', common_form: 'orange', neuter_form: 'orange', definite_plural_form: 'orange', comparative: 'mere orange', superlative_indefinite: 'mest orange', superlative_definite: 'mest orange', periphrastic: true, irregular: false, indeclinable: true, note: 'Orange er ubøjeligt: samme form i alle køn og tal.', verify: false },
    { id: 'beige', level: 'B1', base: 'beige', common_form: 'beige', neuter_form: 'beige', definite_plural_form: 'beige', comparative: 'mere beige', superlative_indefinite: 'mest beige', superlative_definite: 'mest beige', periphrastic: true, irregular: false, indeclinable: true, note: 'Beige er ubøjeligt: samme form i alle køn og tal.', verify: false },
    { id: 'moderne', level: 'B1', base: 'moderne', common_form: 'moderne', neuter_form: 'moderne', definite_plural_form: 'moderne', comparative: 'mere moderne', superlative_indefinite: 'mest moderne', superlative_definite: 'mest moderne', periphrastic: true, irregular: false, indeclinable: true, note: 'Moderne ender på ubetonet -e og er ubøjeligt i alle køn og tal.', verify: false },
    { id: 'oede', level: 'B1', base: 'øde', common_form: 'øde', neuter_form: 'øde', definite_plural_form: 'øde', comparative: 'mere øde', superlative_indefinite: 'mest øde', superlative_definite: 'mest øde', periphrastic: true, irregular: false, indeclinable: true, note: 'Øde er ubøjeligt: samme form i alle køn og tal.', verify: true },
    { id: 'gammeldags', level: 'B1', base: 'gammeldags', common_form: 'gammeldags', neuter_form: 'gammeldags', definite_plural_form: 'gammeldags', comparative: 'mere gammeldags', superlative_indefinite: 'mest gammeldags', superlative_definite: 'mest gammeldags', periphrastic: true, irregular: false, indeclinable: true, note: 'Gammeldags er ubøjeligt: samme form i alle køn og tal.', verify: false },
    { id: 'stakkels', level: 'B1', base: 'stakkels', common_form: 'stakkels', neuter_form: 'stakkels', definite_plural_form: 'stakkels', comparative: 'mere stakkels', superlative_indefinite: 'mest stakkels', superlative_definite: 'mest stakkels', periphrastic: true, irregular: false, indeclinable: true, note: 'Stakkels er ubøjeligt og bruges kun foranstillet: den stakkels mand.', verify: true },
    { id: 'spaendende', level: 'A2', base: 'spændende', common_form: 'spændende', neuter_form: 'spændende', definite_plural_form: 'spændende', comparative: 'mere spændende', superlative_indefinite: 'mest spændende', superlative_definite: 'mest spændende', periphrastic: true, irregular: false, indeclinable: true, note: 'Spændende er en nutids tillægsform (participium) og er ubøjeligt i alle køn og tal.', verify: false },
    { id: 'interessant', level: 'A2', base: 'interessant', common_form: 'interessant', neuter_form: 'interessant', definite_plural_form: 'interessante', comparative: 'mere interessant', superlative_indefinite: 'mest interessant', superlative_definite: 'mest interessante', periphrastic: true, irregular: false, indeclinable: false, note: 'Interessant er uændret i intetkøn men får -e i bestemt/flertal (interessante); gradbøjning sker med mere/mest.', verify: false },
    { id: 'stille', level: 'B1', base: 'stille', common_form: 'stille', neuter_form: 'stille', definite_plural_form: 'stille', comparative: 'mere stille', superlative_indefinite: 'mest stille', superlative_definite: 'mest stille', periphrastic: true, irregular: false, indeclinable: true, note: 'Stille ender på ubetonet -e og er ubøjeligt; gradbøjning sker med mere/mest.', verify: true }
  ];

  // -en class: schwa elision before -ne
  var EN_WORDS = [
    ['A1', 'sulten', 'sulten, uden mad'],
    ['A2', 'vågen', 'ikke sovende'],
    ['A1', 'åben', 'ikke lukket'],
    ['A2', 'doven', 'uden lyst til at arbejde'],
    ['B1', 'nøgen', 'uden tøj']
  ].map(function (row) { return adjEn(row[0], row[1], row[2], true); });

  // -som class: m-doubling
  var SOM_WORDS = [
    ['A2', 'ensom', 'alene, uden selskab'],
    ['A2', 'morsom', 'sjov'],
    ['A2', 'langsom', 'ikke hurtig'],
    ['B1', 'arbejdsom', 'flittig'],
    ['B1', 'virksom', 'effektiv, virkende'],
    ['B1', 'voldsom', 'meget kraftig'],
    ['B1', 'opmærksom', 'som lægger mærke til noget'],
    ['B2', 'betænksom', 'hensynsfuld, omtænksom'],
    ['B2', 'sparsom', 'som der kun er lidt af']
  ].map(function (row) { return adjSom(row[0], row[1], row[2], row[1] === 'virksom'); });

  // -isk class: periphrastic, neuter unchanged
  var ISK_WORDS = [
    ['B2', 'typisk'], ['B2', 'praktisk'], ['B2', 'økonomisk'], ['B2', 'fysisk'],
    ['B2', 'psykisk'], ['B1', 'fantastisk'], ['B2', 'realistisk'], ['B2', 'elektronisk'],
    ['B2', 'automatisk'], ['B2', 'teknisk'], ['B2', 'kritisk'], ['B2', 'logisk'],
    ['B2', 'dramatisk'], ['B2', 'historisk'], ['B2', 'klassisk'], ['B2', 'politisk'],
    ['B2', 'akademisk'], ['B2', 'systematisk'], ['B1', 'magisk'], ['B2', 'tragisk'],
    ['B2', 'komisk'], ['B2', 'demokratisk']
  ].map(function (row) { return adjPeriphrastic(row[0], row[1], row[1].replace(/isk$/, '') + '-adjektiv', true, false); });

  // -et class (participle-derived): periphrastic, neuter unchanged
  var ET_WORDS = [
    ['A2', 'forkølet'], ['B1', 'stresset'], ['A2', 'skuffet'], ['B1', 'begejstret'],
    ['A2', 'interesseret'], ['B1', 'forelsket'], ['B1', 'bekymret'], ['B1', 'chokeret'],
    ['B1', 'overrasket'], ['B1', 'imponeret'], ['B1', 'irriteret'], ['B1', 'forvirret'],
    ['B2', 'koncentreret'], ['B2', 'isoleret'], ['B2', 'kompliceret'], ['B1', 'motiveret']
  ].map(function (row) { return adjPeriphrastic(row[0], row[1], 'tilstand', true, false, true); });

  // -løs class: periphrastic, neuter takes +t
  var LOES_WORDS = [
    ['B1', 'arbejdsløs'], ['B1', 'meningsløs'], ['B1', 'hjælpeløs'], ['B1', 'håbløs'],
    ['B1', 'ansvarsløs'], ['B2', 'formålsløs'], ['B2', 'sanseløs'],
    ['B1', 'trådløs'], ['B2', 'smagløs']
  ].map(function (row) { return adjPeriphrastic(row[0], row[1], 'uden noget', false, true); });

  // -ig / -lig regular class
  var IG_WORDS = [
    ['A2', 'rolig'], ['A1', 'hurtig'], ['A2', 'farlig'], ['A2', 'vigtig'],
    ['A2', 'lykkelig'], ['A2', 'nysgerrig'], ['A2', 'forsigtig'], ['A2', 'almindelig'],
    ['A2', 'forskellig'], ['A2', 'mulig'], ['A2', 'umulig'], ['A2', 'nødvendig'],
    ['A1', 'venlig'], ['B1', 'uvenlig'], ['A2', 'tydelig'], ['B1', 'utydelig'],
    ['A2', 'naturlig'], ['B1', 'unaturlig'], ['A2', 'personlig'], ['B1', 'upersonlig'],
    ['A2', 'offentlig'], ['A2', 'hemmelig'], ['B1', 'selvstændig'], ['B1', 'afhængig'],
    ['B1', 'uafhængig'], ['A2', 'rigtig'], ['A2', 'færdig'], ['A2', 'tålmodig'],
    ['B1', 'utålmodig'], ['A2', 'modig'], ['A1', 'billig'], ['A2', 'giftig'],
    ['A2', 'kedelig'], ['B1', 'sørgelig'], ['A2', 'uheldig'], ['A1', 'heldig'],
    ['A2', 'ærlig'], ['B1', 'uærlig'], ['A1', 'fattig'],
    ['A2', 'tilfældig'], ['B1', 'skyldig'], ['B1', 'uskyldig'], ['B1', 'blodig'],
    ['B1', 'gyldig'], ['B1', 'ugyldig'], ['B1', 'lovlig'], ['B1', 'ulovlig'],
    ['B2', 'dødelig'], ['B1', 'folkelig'], ['A2', 'kærlig'], ['B1', 'kongelig'],
    ['B1', 'rummelig'], ['A2', 'hyggelig'], ['B1', 'pinlig'], ['B1', 'retfærdig'],
    ['B1', 'uretfærdig'], ['A2', 'tidlig'], ['B1', 'nyttig'], ['B1', 'unyttig'],
    ['B1', 'skadelig'], ['A2', 'flittig'], ['B1', 'fornuftig'], ['B1', 'villig'],
    ['B1', 'rigelig'], ['B1', 'ivrig'], ['B1', 'grundig'], ['B1', 'hyppig'],
    ['A2', 'dygtig'], ['A2', 'kraftig'], ['A2', 'ordentlig'], ['B1', 'saftig'],
    ['B1', 'luftig']
  ].map(function (row) { return adjIg(row[0], row[1], false); });

  // Regular monosyllabic / vowel-final adjectives (no doubling, -est superlative)
  var REG_WORDS = [
    ['A1', 'pæn', 'køn, tiltalende', false], ['A1', 'ren', 'ikke beskidt', false],
    ['A1', 'fin', 'af god kvalitet', false], ['A1', 'sød', 'som smager sødt, eller sympatisk', false],
    ['A1', 'lav', 'ikke høj', false], ['A1', 'høj', 'modsat af lav', false],
    ['A2', 'sur', 'sur smag, eller i dårligt humør', false], ['A1', 'gul', 'farven gul', true],
    ['A1', 'rød', 'farven rød', true], ['A1', 'hvid', 'farven hvid', true],
    ['A2', 'brun', 'farven brun', true], ['A1', 'varm', 'høj temperatur', false],
    ['A1', 'kold', 'lav temperatur', false], ['A1', 'bred', 'modsat af smal', false],
    ['A1', 'svag', 'modsat af stærk', false], ['A1', 'tung', 'modsat af let', false],
    ['A1', 'stærk', 'kraftig', false], ['A2', 'blød', 'modsat af hård', false],
    ['A2', 'hård', 'modsat af blød', false], ['A2', 'sund', 'ved godt helbred', false],
    ['A2', 'syg', 'ved dårligt helbred', false], ['A2', 'klog', 'intelligent', false],
    ['A1', 'sjov', 'morsom', false], ['A1', 'ny', 'modsat af gammel', false],
    ['B1', 'fri', 'ikke bundet eller optaget', true], ['A1', 'dyr', 'modsat af billig', false],
    ['A2', 'svær', 'ikke nem', false], ['A2', 'tynd', 'modsat af tyk', false],
    ['A2', 'flad', 'uden højdeforskel', false], ['A2', 'rund', 'formet som en cirkel eller kugle', false],
    ['B1', 'spids', 'som slutter i en spids', true], ['A2', 'skarp', 'som kan skære godt, eller tydelig', false],
    ['A2', 'blank', 'skinnende', false], ['A2', 'mørk', 'modsat af lys', false],
    ['A2', 'lys', 'modsat af mørk', false], ['A2', 'sen', 'modsat af tidlig', false],
    ['A1', 'klar', 'tydelig, gennemsigtig', false], ['B1', 'fjern', 'langt væk', false],
    ['B1', 'stejl', 'med stor hældning', false], ['A2', 'vild', 'ikke tam, uden kontrol', false],
    ['A2', 'mild', 'ikke streng eller kraftig', false], ['B1', 'stiv', 'ikke bøjelig', false],
    ['A2', 'våd', 'dækket af væske', false], ['A2', 'rar', 'venlig og behagelig', false],
    ['A2', 'dyb', 'som når langt ned', false], ['A2', 'fed', 'med meget fedt, eller sej', false],
    ['A2', 'flink', 'venlig og hjælpsom', false], ['A2', 'frisk', 'ny og sund, ikke gammel', false],
    ['A2', 'rask', 'ved godt helbred igen', false], ['B1', 'vred', 'meget sur, gal', false],
    ['B1', 'tavs', 'som ikke siger noget', false], ['B1', 'barsk', 'hård og ubarmhjertig', false],
    ['A2', 'rig', 'med mange penge', false]
  ].map(function (row) { return adjReg(row[0], row[1], row[2], row[3]); });

  window.DANSK_ADJECTIVES = MANUAL.concat(EN_WORDS, SOM_WORDS, ISK_WORDS, ET_WORDS, LOES_WORDS, IG_WORDS, REG_WORDS);
})();
