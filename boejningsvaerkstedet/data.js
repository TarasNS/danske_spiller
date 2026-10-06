// boejningsvaerkstedet/data.js
// Bøjningsværkstedet dataset — window.BOEJNINGS_DATA
// Schema and mode targets: see prd.md § Phase 2 and improvement/specs.md § 4.
//
// Modes 1–3 are generated at load time from the canonical shared datasets
// (window.DANSK_NOUNS, window.DANSK_ADJECTIVES) so the item sets always track
// the canonical word lists — no manual re-sync needed when those files grow.
//
//   Mode 1 fire_former         ← DANSK_NOUNS × 4 paradigm cells
//   Mode 2 byg_navneordet      ← curated natural noun+adjective pairs × 3 phrase forms
//   Mode 3 adjektivvaerkstedet ← DANSK_ADJECTIVES × agreement contexts
//
// Modes 4–6 are not yet populated (see PROGRESS.md task boejning-data).
(function () {
  'use strict';

  var NOUNS = (typeof window !== 'undefined' && window.DANSK_NOUNS) || [];
  var ADJECTIVES = (typeof window !== 'undefined' && window.DANSK_ADJECTIVES) || [];

  var NOUN_BY_ID = {};
  NOUNS.forEach(function (n) { NOUN_BY_ID[n.id] = n; });
  var ADJ_BY_ID = {};
  ADJECTIVES.forEach(function (a) { ADJ_BY_ID[a.id] = a; });

  var LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];
  function maxLevel(a, b) {
    return LEVEL_ORDER.indexOf(a) >= LEVEL_ORDER.indexOf(b) ? a : b;
  }
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) { if (x && !seen[x]) { seen[x] = true; out.push(x); } });
    return out;
  }

  // Adjectives whose definite/plural form is a plural-only form (differs from
  // the definite singular, e.g. lille → små) or otherwise inflect irregularly
  // for agreement. Unsafe for mechanical phrase/agreement generation.
  var ADJ_EXCLUDE = { lille: 1, anden: 1, egen: 1, megen: 1, liden: 1, al: 1 };

  // =====================================================================
  //  Mode 1 — Fire former (noun paradigm, one cell per item)
  // =====================================================================
  var FORMS = [
    { key: 'indefinite_singular', slug: 'ubestemt-ental' },
    { key: 'definite_singular', slug: 'bestemt-ental' },
    { key: 'indefinite_plural', slug: 'ubestemt-flertal' },
    { key: 'definite_plural', slug: 'bestemt-flertal' }
  ];

  // Describe the actual change in form (QA-088): doubling, schwa loss, -um, -ere.
  // Falls back to a neutral "x -> y" note when no safe description applies.
  function definiteSingularNote(noun) {
    var b = noun.base, d = noun.definite_singular, last = b.charAt(b.length - 1);
    var arrow = ': ' + b + ' \→ ' + d + '.';
    if (d === b + 'en' || d === b + 'et' || (/e$/.test(b) && (d === b + 'n' || d === b + 't'))) {
      return 'Bestemt ental dannes ved at f\øje en bestemt endelse til stammen' + arrow;
    }
    if (d === b + last + 'en' || d === b + last + 'et') {
      return 'Konsonanten fordobles f\ør den bestemte endelse' + arrow;
    }
    if (/(el|en|er)$/.test(b) && d === b.slice(0, -2) + b.slice(-1) + 'en') {
      return 'Det svage e falder bort f\ør den bestemte endelse' + arrow;
    }
    if (/um$/.test(b) && d === b.slice(0, -2) + 'et') {
      return 'Endelsen -um erstattes af den bestemte endelse -et' + arrow;
    }
    return 'Bestemt ental af ' + b + arrow;
  }

  function definitePluralNote(noun) {
    var p = noun.indefinite_plural, d = noun.definite_plural, last = p.charAt(p.length - 1);
    var arrow = ': ' + p + ' \→ ' + d + '.';
    if (d === p + 'ne' || d === p + 'ene') {
      return 'Bestemt flertal dannes ved at f\øje -ne/-ene til ubestemt flertal' + arrow;
    }
    if (d === p + last + 'ene') {
      return 'Konsonanten fordobles f\ør -ene' + arrow;
    }
    if (/e$/.test(p) && d === p.slice(0, -1) + 'ne') {
      return 'Det sidste -e i ubestemt flertal falder bort f\ør -ne' + arrow;
    }
    return 'Bestemt flertal af ' + noun.base + arrow;
  }

  function fireFormerNote(noun, formKey) {
    switch (formKey) {
      case 'indefinite_singular':
        return capitalize(noun.base) + ' er et \'' + noun.gender + '\'-ord: ' + noun.indefinite_singular + '.';
      case 'definite_singular':
        return definiteSingularNote(noun);
      case 'indefinite_plural':
        return noun.note;
      case 'definite_plural':
        return definitePluralNote(noun);
      default:
        return noun.note;
    }
  }

  function buildFireFormer() {
    var items = [];
    NOUNS.forEach(function (noun) {
      if (noun.verify) { return; }          // US-050: skip forms not yet native-verified (QA-089, LANG-025)
      FORMS.forEach(function (form) {
        var answer = noun[form.key];
        if (!answer) { return; }
        items.push({
          id: noun.id + '-' + form.slug,
          noun_id: noun.id,
          level: noun.level,
          mode: 'fire_former',
          requested_form: form.key,
          accepted_answers: [answer],
          note: fireFormerNote(noun, form.key)
        });
      });
    });
    return items;
  }

  // =====================================================================
  //  Mode 3 — Adjektivværkstedet (adjective agreement, free-text)
  //  Schema: prd.md § 2.4 (adjective agreement item)
  // =====================================================================
  function buildAdjektiv() {
    var items = [];
    ADJECTIVES.forEach(function (a) {
      if (a.verify) { return; }            // skip forms not yet native-verified
      if (ADJ_EXCLUDE[a.id]) { return; }
      var common = a.common_form, neuter = a.neuter_form, ePlur = a.definite_plural_form;
      if (!common || !neuter || !ePlur) { return; }

      if (a.indeclinable) {
        // One representative item — indeclinable adjectives never change form.
        items.push({
          id: a.id + '-adj-intetkoen',
          level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
          gender: 'neuter', definiteness: 'indefinite', number: 'singular',
          accepted_answers: [neuter],
          note: capitalize(a.base) + ' er ubøjeligt og har samme form i alle køn, tal og bestemthed.'
        });
        return;
      }

      var neuterNote;
      if (neuter === common + 't') {
        neuterNote = 'Intetkøn (et-ord) ubestemt ental: tillægsordet får -t: ' + neuter + '.';
      } else if (neuter === common) {
        neuterNote = capitalize(a.base) + ' ændrer sig ikke i intetkøn ubestemt ental: ' + neuter + '.';
      } else {
        neuterNote = 'Intetkøn ubestemt ental af ' + a.base + ': ' + neuter + '.';
      }

      items.push({
        id: a.id + '-adj-faelleskoen',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: 'common', definiteness: 'indefinite', number: 'singular',
        accepted_answers: [common],
        note: 'Fælleskøn (en-ord) ubestemt ental: tillægsordet står i grundform: ' + common + '.'
      });
      items.push({
        id: a.id + '-adj-intetkoen',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: 'neuter', definiteness: 'indefinite', number: 'singular',
        accepted_answers: [neuter], note: neuterNote
      });
      items.push({
        id: a.id + '-adj-flertal',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: null, definiteness: 'indefinite', number: 'plural',
        accepted_answers: [ePlur],
        note: ePlur === common
          ? capitalize(a.base) + ' er uændret i flertal: ' + ePlur + '.'
          : 'I flertal ender tillægsordet på -e: ' + ePlur + '.'
      });
      items.push({
        id: a.id + '-adj-bestemt',
        level: a.level, mode: 'adjektivvaerkstedet', adjective_id: a.id,
        gender: 'common', definiteness: 'definite', number: 'singular',
        accepted_answers: [ePlur],
        note: ePlur === common
          ? capitalize(a.base) + ' er uændret i bestemt form: ' + ePlur + '.'
          : 'Bestemt form bruger også -e-formen: ' + ePlur + '.'
      });
    });
    return items;
  }

  // =====================================================================
  //  Mode 2 — Byg navneordet (noun-phrase construction, tap-to-place tiles)
  //  Schema: prd.md § 2.4 / § 4.6 (noun-phrase construction item)
  // =====================================================================
  // Curated natural pairings only (spec § 4.7: filter for semantic
  // naturalness). Universal size/age/quality adjectives combine naturally
  // with any concrete count noun; the two pools keep animate vs. object
  // combinations plausible.
  var PEOPLE = ['mand', 'kvinde', 'dreng', 'pige', 'ven', 'veninde', 'nabo', 'kat', 'hund', 'hest', 'fugl', 'gris', 'loeve', 'elefant', 'abe', 'bjoern', 'raev', 'ulv'];
  var PEOPLE_ADJ = ['stor', 'ung', 'god', 'smuk', 'sjov'];
  var OBJECTS = ['hus', 'bord', 'stol', 'seng', 'lampe', 'bil', 'tog', 'baad', 'skib', 'cykel', 'telefon', 'computer', 'bog', 'sko', 'by', 'park', 'kirke', 'butik', 'restaurant', 'skole'];
  var OBJECTS_ADJ = ['stor', 'ny', 'god', 'dyr', 'flot'];

  // Implausible noun+adjective pairs (QA-089 / LANG-026), left out of the generated set.
  var SKIP_PAIRS = { 'dyr-park': 1, 'god-kirke': 1, 'sjov-ulv': 1 };

  function phraseItems(nounId, adjId) {
    if (SKIP_PAIRS[adjId + '-' + nounId]) { return []; }
    var noun = NOUN_BY_ID[nounId], adj = ADJ_BY_ID[adjId];
    if (!noun || !adj || ADJ_EXCLUDE[adjId]) { return []; }
    var base = noun.base, defsg = noun.definite_singular,
        plur = noun.indefinite_plural, defpl = noun.definite_plural, gender = noun.gender;
    var common = adj.common_form, neuter = adj.neuter_form, ePlur = adj.definite_plural_form;
    if (!base || !defsg || !plur || !defpl || !common || !neuter || !ePlur) { return []; }
    if (gender !== 'en' && gender !== 'et') { return []; }

    var isNeuter = gender === 'et';
    var artIndef = gender;                       // en / et
    var artDef = isNeuter ? 'det' : 'den';
    var artOpp = isNeuter ? 'en' : 'et';         // wrong-gender distractor
    var adjIndef = isNeuter ? neuter : common;
    var adjForms = uniq([common, neuter, ePlur]);
    var lvl = maxLevel(noun.level, adj.level);
    var featGender = isNeuter ? 'neuter' : 'common';

    return [
      {
        id: adjId + '-' + nounId + '-ubestemt-ental',
        level: lvl, mode: 'byg_navneordet', noun_id: nounId, adjective_id: adjId,
        features: { number: 'singular', definiteness: 'indefinite', gender: featGender },
        pieces: uniq([artIndef, artOpp].concat(adjForms).concat([base, defsg])),
        accepted_orders: [[artIndef, adjIndef, base]],
        note: (isNeuter ? 'Intetkøn' : 'Fælleskøn') + ' ubestemt ental: ' +
          artIndef + ' + ' + (isNeuter ? 'intetkønsformen' : 'grundformen') + ' + navneord.'
      },
      {
        id: adjId + '-' + nounId + '-bestemt-ental',
        level: lvl, mode: 'byg_navneordet', noun_id: nounId, adjective_id: adjId,
        features: { number: 'singular', definiteness: 'definite', gender: featGender },
        pieces: uniq([artDef, artOpp].concat(adjForms).concat([base, defsg])),
        accepted_orders: [[artDef, ePlur, base]],
        note: 'Bestemt ental med tillægsord: foranstillet ' + artDef +
          ' + -e-form + grundform af navneordet (ikke ' + defsg + ').'
      },
      {
        id: adjId + '-' + nounId + '-bestemt-flertal',
        level: lvl, mode: 'byg_navneordet', noun_id: nounId, adjective_id: adjId,
        features: { number: 'plural', definiteness: 'definite', gender: featGender },
        pieces: uniq(['de', artDef].concat(adjForms).concat([plur, defpl])),
        accepted_orders: [['de', ePlur, plur]],
        note: 'Bestemt flertal med tillægsord: de + -e-form + ubestemt flertal (ikke ' + defpl + ').'
      }
    ];
  }

  function buildByg() {
    var items = [];
    PEOPLE.forEach(function (nid) {
      PEOPLE_ADJ.forEach(function (aid) { items = items.concat(phraseItems(nid, aid)); });
    });
    OBJECTS.forEach(function (nid) {
      OBJECTS_ADJ.forEach(function (aid) { items = items.concat(phraseItems(nid, aid)); });
    });
    return items;
  }

  // =====================================================================
  //  Mode 4 — Sammenligningspressen (comparison, three-slot free-text)
  //  Schema: prd.md § 2.4 (comparison item). Generated from adjectives.js so
  //  the set tracks the canonical adjective list. Skips indeclinable adjectives
  //  (no comparison) and verify:true forms (not yet native-verified).
  // =====================================================================
  // Adjectives that are not normally compared (absolute meaning). Excluded from
  // the comparison drill (QA-085). The list is partly unconfirmed: needs native review.
  var NON_GRADABLE = {
    mulig: 1, umulig: 1, offentlig: 1, kongelig: 1, faerdig: 1,
    gyldig: 1, ugyldig: 1, lovlig: 1, ulovlig: 1, forskellig: 1
  };

  function buildSammenligning() {
    var items = [];
    ADJECTIVES.forEach(function (a) {
      if (a.verify) { return; }
      if (a.indeclinable) { return; }
      if (NON_GRADABLE[a.id]) { return; }
      var grund = a.common_form, komp = a.comparative,
          sup = a.superlative_indefinite, supDef = a.superlative_definite;
      if (!grund || !komp || !sup) { return; }

      // irregular_comparison (not the neuter quirk flag `irregular`) drives the comparison type/note.
      var ctype = a.irregular_comparison ? 'irregular' : (a.periphrastic ? 'periphrastic' : 'regular');
      // Superlative: accept the bare form, the definite form, and the natural
      // "den/det + definite" phrasing. For periphrastic adjectives the definite
      // form is 'mest ' + definite/plural form (den mest typiske), so the
      // ungrammatical "den mest typisk" is not accepted.
      var supAns = uniq([sup, supDef, 'den ' + supDef, 'det ' + supDef]);
      var kompAns = [komp];
      // dårlig: dårligere / dårligst are standard alongside værre / værst (QA-089, LANG-021).
      if (a.id === 'daarlig') {
        kompAns = [komp, 'dårligere'];
        supAns = uniq(supAns.concat(['dårligst', 'dårligste', 'den dårligste', 'det dårligste']));
      }

      var note;
      if (a.irregular_comparison) {
        note = capitalize(a.base) + ' gradbøjes uregelmæssigt: ' + grund + ' → ' + komp + ' → ' + sup + '.';
      } else if (a.irregular && !a.periphrastic) {
        // Neuter quirk only (glad, flot, let): the comparison itself is regular.
        note = capitalize(a.base) + ' gradbøjes regelmæssigt: ' + komp + ' → ' + sup + '.';
      } else if (a.periphrastic) {
        note = capitalize(a.base) + ' gradbøjes med mere/mest: ' + komp + ' → ' + sup + '.';
      } else {
        // -ig/-lig adjectives take -ere/-st (rolig → roligere → roligst); others -ere/-est.
        note = capitalize(a.base) + ' gradbøjes med ' + (/est$/.test(sup) ? '-ere/-est' : '-ere/-st') + ': ' + komp + ' → ' + sup + '.';
      }

      items.push({
        id: a.id + '-sammenligning',
        level: maxLevel(a.level, 'A2'),
        mode: 'sammenligningspressen',
        adjective_id: a.id,
        comparison_type: ctype,
        slots: [
          { label: 'grundform', accepted_answers: [grund] },
          { label: 'komparativ', accepted_answers: kompAns },
          { label: 'superlativ', accepted_answers: supAns }
        ],
        note: note
      });
    });
    return items;
  }

  // =====================================================================
  //  Mode 5 — Bestemt eller ubestemt? (definiteness in context, MC)
  //  Schema: prd.md § 2.4 (contextual definiteness item). Hand-authored short
  //  contexts (2–3 sentences); each item has exactly one defensible answer.
  //  `pattern` groups items for SRS pattern keys.
  // =====================================================================
  var BESTEMT_UBESTEMT = [
    // --- first mention (ubestemt) ---
    { id:'b5-koebte-bog', level:'A2', pattern:'foerste-omtale', context:'Jeg købte ___ i går. Bogen var alt for dyr.', options:['en bog','bogen','den bog'], correct:'en bog', note:'Første gang noget nævnes, bruges ubestemt form: en bog.' },
    { id:'b5-saa-kat', level:'A1', pattern:'foerste-omtale', context:'Jeg så ___ i haven i morges. Katten jagede en fugl.', options:['en kat','katten'], correct:'en kat', note:'Ved første omtale bruges ubestemt form: en kat.' },
    { id:'b5-fik-brev', level:'A2', pattern:'foerste-omtale', context:'Hun fik ___ i dag. Brevet var fra banken.', options:['et brev','brevet'], correct:'et brev', note:'Første omtale af et nyt et-ord: et brev.' },
    { id:'b5-moedte-mand', level:'A2', pattern:'foerste-omtale', context:'Jeg mødte ___ på toget. Han var meget venlig.', options:['en mand','manden'], correct:'en mand', note:'En ny, ukendt person nævnes med ubestemt form: en mand.' },
    // --- subsequent mention (bestemt) ---
    { id:'b5-ny-laerer', level:'A2', pattern:'anden-omtale', context:'Vi har fået en ny lærer. ___ hedder Mette.', options:['Læreren','En lærer','Lærer'], correct:'Læreren', note:'Ved anden omtale er personen kendt: bestemt form læreren.' },
    { id:'b5-et-hus', level:'A2', pattern:'anden-omtale', context:'Han fortalte om et hus ved stranden. ___ var meget gammelt.', options:['Huset','Et hus','Hus'], correct:'Huset', note:'Anden omtale bruger bestemt form: huset.' },
    { id:'b5-en-hund', level:'A1', pattern:'anden-omtale', context:'Der kom en hund løbende. ___ var helt våd.', options:['Hunden','En hund'], correct:'Hunden', note:'Hunden er nu kendt fra første sætning: bestemt form.' },
    { id:'b5-en-cykel', level:'A2', pattern:'anden-omtale', context:'Jeg har købt en cykel. ___ er blå.', options:['Cyklen','En cykel'], correct:'Cyklen', note:'Anden omtale: bestemt form cyklen.' },
    { id:'b5-en-film', level:'A2', pattern:'anden-omtale', context:'Vi så en film i går. ___ var meget kedelig.', options:['Filmen','En film'], correct:'Filmen', note:'Filmen er kendt fra første sætning: bestemt form.' },
    // --- professions without article ---
    { id:'b5-bror-laege', level:'A2', pattern:'erhverv', context:'Min bror er ___.', options:['læge','en læge','lægen'], correct:'læge', note:'Erhverv efter er/blive står uden artikel: han er læge.' },
    { id:'b5-som-sygeplejerske', level:'A2', pattern:'erhverv', context:'Hun arbejder som ___ på et hospital.', options:['sygeplejerske','en sygeplejerske'], correct:'sygeplejerske', note:'Efter som står erhverv uden artikel.' },
    { id:'b5-blive-laerer', level:'A2', pattern:'erhverv', context:'Jeg vil gerne være ___, når jeg er færdig med at læse.', options:['lærer','en lærer'], correct:'lærer', note:'Erhverv efter være står uden artikel: være lærer.' },
    { id:'b5-far-tjener', level:'A2', pattern:'erhverv', context:'Hendes far er ___ på en restaurant i byen.', options:['tjener','en tjener','tjeneren'], correct:'tjener', note:'Erhverv uden nærmere beskrivelse står uden artikel: er tjener.' },
    // --- possessive: no definite suffix ---
    { id:'b5-min-taske', level:'A2', pattern:'ejestedord', context:'Jeg kan ikke finde ___. Har du set den?', options:['min taske','min tasken','tasken min'], correct:'min taske', note:'Ejestedord + navneord i grundform: min taske, ikke min tasken.' },
    { id:'b5-mine-noegler', level:'A2', pattern:'ejestedord', context:'Åh nej, jeg har glemt ___ derhjemme.', options:['mine nøgler','mine nøglerne'], correct:'mine nøgler', note:'Efter ejestedord bruges grundform uden bestemt endelse: mine nøgler.' },
    { id:'b5-hans-bil', level:'A2', pattern:'ejestedord', context:'Den røde bil der — det er ___.', options:['hans bil','hans bilen'], correct:'hans bil', note:'Ejestedord + navneord uden bestemt endelse: hans bil.' },
    { id:'b5-dit-hus', level:'A2', pattern:'ejestedord', context:'Er det store, gule hus ___?', options:['dit hus','dit huset'], correct:'dit hus', note:'Ejestedord styrer grundform: dit hus, ikke dit huset.' },
    // --- demonstratives ---
    { id:'b5-dette-hus', level:'B1', pattern:'paapegende', context:'Jeg vil helst have ___ her, ikke det derovre.', options:['dette hus','denne hus','det hus'], correct:'dette hus', note:'Dette bruges påpegende om et-ord: dette hus.' },
    { id:'b5-denne-bog', level:'B1', pattern:'paapegende', context:'Har du læst ___ her? Den er rigtig god.', options:['denne bog','dette bog','denne bogen'], correct:'denne bog', note:'Denne bruges påpegende om en-ord: denne bog.' },
    { id:'b5-disse-sko', level:'B1', pattern:'paapegende', context:'___ her er alt for små til mig.', options:['Disse sko','Denne sko','Disse skoene'], correct:'Disse sko', note:'Disse bruges påpegende om flertal: disse sko.' },
    { id:'b5-den-mand', level:'B1', pattern:'paapegende', context:'___ mand derovre har ventet længe.', options:['Den','Det','De'], correct:'Den', note:'Den bruges påpegende om et en-ord: den mand.' },
    // --- definite adjective construction (no double definiteness) ---
    { id:'b5-store-hus', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg kan rigtig godt lide ___ nede ved søen.', options:['det store hus','det store huset','store huset'], correct:'det store hus', note:'Med foranstillet tillægsord: det + -e-form + grundform: det store hus.' },
    { id:'b5-roede-bil', level:'B1', pattern:'foranstillet-tillaegsord', context:'Hvor er ___ parkeret henne?', options:['den røde bil','den røde bilen'], correct:'den røde bil', note:'Bestemt form med tillægsord: den røde bil, ikke bilen.' },
    { id:'b5-gamle-mand', level:'B1', pattern:'foranstillet-tillaegsord', context:'Kender du ___, der bor på hjørnet?', options:['den gamle mand','den gamle manden'], correct:'den gamle mand', note:'Foranstillet tillægsord giver grundform: den gamle mand.' },
    { id:'b5-nye-computer', level:'B1', pattern:'foranstillet-tillaegsord', context:'Må jeg lige låne ___?', options:['den nye computer','den nye computeren'], correct:'den nye computer', note:'Bestemt form med tillægsord: den nye computer.' },
    // --- generic plural ---
    { id:'b5-aebler-sunde', level:'A2', pattern:'generisk-flertal', context:'I almindelighed er ___ sunde og fulde af vitaminer.', options:['Æbler','Æblerne','Et æble'], correct:'Æbler', note:'Generelle udsagn om en hel gruppe bruger ubestemt flertal: æbler.' },
    { id:'b5-hunde-generic', level:'A2', pattern:'generisk-flertal', context:'Kan du lide ___ i almindelighed? Jeg elsker dem.', options:['hunde','hundene'], correct:'hunde', note:'Om hunde i almindelighed: ubestemt flertal hunde.' },
    { id:'b5-boern-leger', level:'A2', pattern:'generisk-flertal', context:'I almindelighed elsker ___ at lege udenfor.', options:['Børn','Børnene'], correct:'Børn', note:'Generelt om alle børn: ubestemt flertal børn.' },
    { id:'b5-blomster-dufter', level:'A2', pattern:'generisk-flertal', context:'I almindelighed dufter ___ dejligt om foråret.', options:['Blomster','Blomsterne'], correct:'Blomster', note:'Almen sandhed om blomster: ubestemt flertal blomster.' },
    // --- fixed expressions ---
    { id:'b5-i-skole', level:'A2', pattern:'fast-udtryk', context:'Mit barn går i ___ hver dag klokken otte.', options:['skole','skolen','en skole'], correct:'skole', note:'Fast udtryk: gå i skole — uden artikel.' },
    { id:'b5-i-seng', level:'A2', pattern:'fast-udtryk', context:'Jeg går altid i ___ klokken elleve.', options:['seng','sengen','en seng'], correct:'seng', note:'Fast udtryk: gå i seng — uden artikel.' },
    { id:'b5-paa-arbejde', level:'A2', pattern:'fast-udtryk', context:'Han tager på ___ klokken syv hver morgen.', options:['arbejde','arbejdet'], correct:'arbejde', note:'Fast udtryk: på arbejde — uden bestemt endelse.' },
    { id:'b5-spise-aftensmad', level:'A2', pattern:'fast-udtryk', context:'Vi spiser ___ klokken seks om aftenen.', options:['aftensmad','aftensmaden'], correct:'aftensmad', note:'Fast udtryk: spise aftensmad — uden artikel.' },
    { id:'b5-i-byen', level:'A2', pattern:'fast-udtryk', context:'Skal vi tage i ___ og handle på lørdag?', options:['byen','by','en by'], correct:'byen', note:'Fast udtryk: i byen — med bestemt form.' },
    // --- specific vs nonspecific reference ---
    { id:'b5-tolk-nonspecific', level:'B1', pattern:'specifik-reference', context:'Vi leder efter ___, der kan tale arabisk.', options:['en tolk','tolken'], correct:'en tolk', note:'Om en hvilken som helst (ikke-bestemt) person: ubestemt form en tolk.' },
    { id:'b5-manden-specific', level:'B1', pattern:'specifik-reference', context:'___, jeg talte med i går, ringer tilbage i morgen.', options:['Manden','En mand'], correct:'Manden', note:'En bestemt, kendt person: bestemt form manden.' },
    { id:'b5-loesning-nonspecific', level:'B1', pattern:'specifik-reference', context:'Vi har brug for ___ på det her problem.', options:['en løsning','løsningen'], correct:'en løsning', note:'En endnu ukendt løsning: ubestemt form en løsning.' },

    // --- first mention (ubestemt) — extended ---
    { id:'b5-fandt-noegle', level:'A2', pattern:'foerste-omtale', context:'Jeg fandt ___ på gaden. Nøglen lå ved en bænk.', options:['en nøgle','nøglen'], correct:'en nøgle', note:'Første omtale bruger ubestemt form: en nøgle.' },
    { id:'b5-koebte-lampe', level:'A2', pattern:'foerste-omtale', context:'Vi købte ___ til stuen. Lampen giver et dejligt lys.', options:['en lampe','lampen'], correct:'en lampe', note:'Første omtale af et nyt en-ord: en lampe.' },
    { id:'b5-laeste-avis', level:'A2', pattern:'foerste-omtale', context:'Han læste ___ i toget. Avisen var fra i går.', options:['en avis','avisen'], correct:'en avis', note:'Første omtale bruger ubestemt form: en avis.' },
    { id:'b5-fik-gave', level:'A1', pattern:'foerste-omtale', context:'Jeg fik ___ til min fødselsdag. Gaven var fra min mormor.', options:['en gave','gaven'], correct:'en gave', note:'Første omtale bruger ubestemt form: en gave.' },
    { id:'b5-bagte-kage', level:'A2', pattern:'foerste-omtale', context:'Hun bagte ___ til festen. Kagen smagte af citron.', options:['en kage','kagen'], correct:'en kage', note:'Første omtale bruger ubestemt form: en kage.' },
    { id:'b5-skrev-brev', level:'A2', pattern:'foerste-omtale', context:'Jeg skrev ___ til min ven. Brevet blev meget langt.', options:['et brev','brevet'], correct:'et brev', note:'Første omtale af et nyt et-ord: et brev.' },
    { id:'b5-tegnede-billede', level:'A2', pattern:'foerste-omtale', context:'Barnet tegnede ___ i skolen. Billedet hang på væggen.', options:['et billede','billedet'], correct:'et billede', note:'Første omtale af et nyt et-ord: et billede.' },
    { id:'b5-koebte-ur', level:'A2', pattern:'foerste-omtale', context:'Han købte ___ i byen. Uret var ret dyrt.', options:['et ur','uret'], correct:'et ur', note:'Første omtale af et nyt et-ord: et ur.' },
    { id:'b5-fandt-taske', level:'A2', pattern:'foerste-omtale', context:'Jeg fandt ___ under sædet. Tasken tilhørte en anden.', options:['en taske','tasken'], correct:'en taske', note:'Første omtale bruger ubestemt form: en taske.' },
    { id:'b5-modtog-pakke', level:'A2', pattern:'foerste-omtale', context:'Vi modtog ___ i morges. Pakken var tung.', options:['en pakke','pakken'], correct:'en pakke', note:'Første omtale bruger ubestemt form: en pakke.' },
    { id:'b5-hoerte-sang', level:'A2', pattern:'foerste-omtale', context:'Jeg hørte ___ i radioen. Sangen var på svensk.', options:['en sang','sangen'], correct:'en sang', note:'Første omtale bruger ubestemt form: en sang.' },
    { id:'b5-saa-fugl', level:'A1', pattern:'foerste-omtale', context:'Vi så ___ i træet. Fuglen var helt rød.', options:['en fugl','fuglen'], correct:'en fugl', note:'Første omtale bruger ubestemt form: en fugl.' },
    { id:'b5-koebte-jakke', level:'A2', pattern:'foerste-omtale', context:'Hun købte ___ til vinteren. Jakken var meget varm.', options:['en jakke','jakken'], correct:'en jakke', note:'Første omtale bruger ubestemt form: en jakke.' },
    { id:'b5-planlagde-tur', level:'A2', pattern:'foerste-omtale', context:'De planlagde ___ til Norge. Turen skulle vare en uge.', options:['en tur','turen'], correct:'en tur', note:'Første omtale bruger ubestemt form: en tur.' },
    { id:'b5-fik-ide', level:'A2', pattern:'foerste-omtale', context:'Jeg fik ___ til projektet. Idéen var faktisk god.', options:['en idé','idéen'], correct:'en idé', note:'Første omtale bruger ubestemt form: en idé.' },
    { id:'b5-byggede-hus', level:'A2', pattern:'foerste-omtale', context:'De byggede ___ ved skoven. Huset var af træ.', options:['et hus','huset'], correct:'et hus', note:'Første omtale af et nyt et-ord: et hus.' },
    { id:'b5-fandt-glas', level:'A2', pattern:'foerste-omtale', context:'Jeg fandt ___ i skabet. Glasset var revnet.', options:['et glas','glasset'], correct:'et glas', note:'Første omtale af et nyt et-ord: et glas.' },
    { id:'b5-koebte-spil', level:'A2', pattern:'foerste-omtale', context:'Vi købte ___ til børnene. Spillet var ret svært.', options:['et spil','spillet'], correct:'et spil', note:'Første omtale af et nyt et-ord: et spil.' },
    { id:'b5-bagte-broed', level:'A2', pattern:'foerste-omtale', context:'Han bagte ___ om morgenen. Brødet var stadig varmt.', options:['et brød','brødet'], correct:'et brød', note:'Første omtale af et nyt et-ord: et brød.' },
    { id:'b5-saa-dyr', level:'A2', pattern:'foerste-omtale', context:'Vi så ___ i skoven. Dyret løb hurtigt væk.', options:['et dyr','dyret'], correct:'et dyr', note:'Første omtale af et nyt et-ord: et dyr.' },
    { id:'b5-koebte-telefon', level:'A2', pattern:'foerste-omtale', context:'Jeg købte ___ i går. Telefonen var på tilbud.', options:['en telefon','telefonen'], correct:'en telefon', note:'Første omtale bruger ubestemt form: en telefon.' },
    { id:'b5-fik-besked', level:'A2', pattern:'foerste-omtale', context:'Hun fik ___ fra sin chef. Beskeden var vigtig.', options:['en besked','beskeden'], correct:'en besked', note:'Første omtale bruger ubestemt form: en besked.' },
    { id:'b5-fandt-fejl', level:'B1', pattern:'foerste-omtale', context:'Programmøren fandt ___ i koden. Fejlen var svær at rette.', options:['en fejl','fejlen'], correct:'en fejl', note:'Første omtale bruger ubestemt form: en fejl.' },
    { id:'b5-koebte-cykel', level:'A1', pattern:'foerste-omtale', context:'Han købte ___ til sin søn. Cyklen var blå.', options:['en cykel','cyklen'], correct:'en cykel', note:'Første omtale bruger ubestemt form: en cykel.' },
    { id:'b5-lejede-bil', level:'A2', pattern:'foerste-omtale', context:'Vi lejede ___ i lufthavnen. Bilen var helt ny.', options:['en bil','bilen'], correct:'en bil', note:'Første omtale bruger ubestemt form: en bil.' },

    // --- subsequent mention (bestemt) — extended ---
    { id:'b5-en-jakke2', level:'A2', pattern:'anden-omtale', context:'Jeg har fået en ny jakke. ___ er alt for stor.', options:['Jakken','En jakke','Jakke'], correct:'Jakken', note:'Anden omtale bruger bestemt form: jakken.' },
    { id:'b5-en-lampe2', level:'A2', pattern:'anden-omtale', context:'Vi har en lampe i stuen. ___ lyser ikke længere.', options:['Lampen','En lampe'], correct:'Lampen', note:'Anden omtale bruger bestemt form: lampen.' },
    { id:'b5-et-billede2', level:'A2', pattern:'anden-omtale', context:'Der hænger et billede i entréen. ___ er malet af min far.', options:['Billedet','Et billede'], correct:'Billedet', note:'Anden omtale bruger bestemt form: billedet.' },
    { id:'b5-en-avis2', level:'A2', pattern:'anden-omtale', context:'Der lå en avis på bordet. ___ var helt våd.', options:['Avisen','En avis'], correct:'Avisen', note:'Anden omtale bruger bestemt form: avisen.' },
    { id:'b5-et-brev2', level:'A2', pattern:'anden-omtale', context:'Jeg fik et brev i dag. ___ kom fra kommunen.', options:['Brevet','Et brev'], correct:'Brevet', note:'Anden omtale bruger bestemt form: brevet.' },
    { id:'b5-en-kat2', level:'A1', pattern:'anden-omtale', context:'Vi har en kat derhjemme. ___ sover hele dagen.', options:['Katten','En kat'], correct:'Katten', note:'Anden omtale bruger bestemt form: katten.' },
    { id:'b5-et-hus2', level:'A2', pattern:'anden-omtale', context:'De har købt et hus på landet. ___ er meget gammelt.', options:['Huset','Et hus'], correct:'Huset', note:'Anden omtale bruger bestemt form: huset.' },
    { id:'b5-en-kage2', level:'A2', pattern:'anden-omtale', context:'Hun lavede en kage i går. ___ var helt væk i dag.', options:['Kagen','En kage'], correct:'Kagen', note:'Anden omtale bruger bestemt form: kagen.' },
    { id:'b5-en-taske2', level:'A2', pattern:'anden-omtale', context:'Jeg har mistet en taske. ___ var sort med en lang rem.', options:['Tasken','En taske'], correct:'Tasken', note:'Anden omtale bruger bestemt form: tasken.' },
    { id:'b5-et-tog2', level:'A2', pattern:'anden-omtale', context:'Der kom et tog ind på perronen. ___ var allerede fyldt.', options:['Toget','Et tog'], correct:'Toget', note:'Anden omtale bruger bestemt form: toget.' },
    { id:'b5-en-hund2', level:'A1', pattern:'anden-omtale', context:'De har fået en hund. ___ hedder Fido.', options:['Hunden','En hund'], correct:'Hunden', note:'Anden omtale bruger bestemt form: hunden.' },
    { id:'b5-et-aeble2', level:'A1', pattern:'anden-omtale', context:'Jeg tog et æble fra kurven. ___ var lidt surt.', options:['Æblet','Et æble'], correct:'Æblet', note:'Anden omtale bruger bestemt form: æblet.' },
    { id:'b5-en-bil2', level:'A2', pattern:'anden-omtale', context:'Han har købt en bil. ___ kører på el.', options:['Bilen','En bil'], correct:'Bilen', note:'Anden omtale bruger bestemt form: bilen.' },
    { id:'b5-et-ur2', level:'A2', pattern:'anden-omtale', context:'Hun fik et ur i gave. ___ var af guld.', options:['Uret','Et ur'], correct:'Uret', note:'Anden omtale bruger bestemt form: uret.' },
    { id:'b5-en-blomst2', level:'A2', pattern:'anden-omtale', context:'Der stod en blomst i vinduet. ___ trængte til vand.', options:['Blomsten','En blomst'], correct:'Blomsten', note:'Anden omtale bruger bestemt form: blomsten.' },
    { id:'b5-et-glas2', level:'A2', pattern:'anden-omtale', context:'Der stod et glas på bordet. ___ var tomt.', options:['Glasset','Et glas'], correct:'Glasset', note:'Anden omtale bruger bestemt form: glasset.' },
    { id:'b5-en-pakke2', level:'A2', pattern:'anden-omtale', context:'Der kom en pakke med posten. ___ var til min nabo.', options:['Pakken','En pakke'], correct:'Pakken', note:'Anden omtale bruger bestemt form: pakken.' },
    { id:'b5-en-telefon2', level:'A2', pattern:'anden-omtale', context:'Jeg har købt en telefon. ___ virker rigtig godt.', options:['Telefonen','En telefon'], correct:'Telefonen', note:'Anden omtale bruger bestemt form: telefonen.' },
    { id:'b5-et-spil2', level:'A2', pattern:'anden-omtale', context:'Vi fik et spil af mormor. ___ var meget sjovt.', options:['Spillet','Et spil'], correct:'Spillet', note:'Anden omtale bruger bestemt form: spillet.' },
    { id:'b5-en-stol2', level:'A1', pattern:'anden-omtale', context:'Der står en stol i hjørnet. ___ er malet grøn.', options:['Stolen','En stol'], correct:'Stolen', note:'Anden omtale bruger bestemt form: stolen.' },
    { id:'b5-et-bord2', level:'A1', pattern:'anden-omtale', context:'Vi har et bord i køkkenet. ___ er lavet af eg.', options:['Bordet','Et bord'], correct:'Bordet', note:'Anden omtale bruger bestemt form: bordet.' },
    { id:'b5-en-sang2', level:'A2', pattern:'anden-omtale', context:'Hun sang en sang til festen. ___ var på engelsk.', options:['Sangen','En sang'], correct:'Sangen', note:'Anden omtale bruger bestemt form: sangen.' },
    { id:'b5-en-gave2', level:'A1', pattern:'anden-omtale', context:'Jeg har købt en gave til dig. ___ ligger under sengen.', options:['Gaven','En gave'], correct:'Gaven', note:'Anden omtale bruger bestemt form: gaven.' },
    { id:'b5-et-brev3', level:'A2', pattern:'anden-omtale', context:'Han skrev et brev til avisen. ___ blev aldrig trykt.', options:['Brevet','Et brev'], correct:'Brevet', note:'Anden omtale bruger bestemt form: brevet.' },
    { id:'b5-en-cykel2', level:'A1', pattern:'anden-omtale', context:'Jeg har en gammel cykel. ___ står i kælderen.', options:['Cyklen','En cykel'], correct:'Cyklen', note:'Anden omtale bruger bestemt form: cyklen.' },

    // --- professions without article — extended ---
    { id:'b5-mor-laerer2', level:'A2', pattern:'erhverv', context:'Min mor er ___ på en folkeskole.', options:['lærer','en lærer','læreren'], correct:'lærer', note:'Erhverv efter er står uden artikel: er lærer.' },
    { id:'b5-onkel-politibetjent', level:'A2', pattern:'erhverv', context:'Min onkel er ___ i København.', options:['politibetjent','en politibetjent'], correct:'politibetjent', note:'Erhverv efter er står uden artikel: er politibetjent.' },
    { id:'b5-hun-advokat', level:'A2', pattern:'erhverv', context:'Hun er ___ og arbejder meget.', options:['advokat','en advokat'], correct:'advokat', note:'Erhverv efter er står uden artikel: er advokat.' },
    { id:'b5-blive-laege', level:'A2', pattern:'erhverv', context:'Han vil gerne være ___, når han bliver stor.', options:['læge','en læge'], correct:'læge', note:'Erhverv efter være står uden artikel: være læge.' },
    { id:'b5-som-kok', level:'A2', pattern:'erhverv', context:'Hun arbejder som ___ på en restaurant.', options:['kok','en kok'], correct:'kok', note:'Efter som står erhverv uden artikel: som kok.' },
    { id:'b5-far-ingenioer', level:'A2', pattern:'erhverv', context:'Min far er ___ og bygger broer.', options:['ingeniør','en ingeniør'], correct:'ingeniør', note:'Erhverv efter er står uden artikel: er ingeniør.' },
    { id:'b5-nabo-toemrer', level:'A2', pattern:'erhverv', context:'Min nabo er ___ og bygger huse.', options:['tømrer','en tømrer'], correct:'tømrer', note:'Erhverv efter er står uden artikel: er tømrer.' },
    { id:'b5-hun-frisoer', level:'A2', pattern:'erhverv', context:'Hun er ___ og klipper hår.', options:['frisør','en frisør'], correct:'frisør', note:'Erhverv efter er står uden artikel: er frisør.' },
    { id:'b5-blive-pilot', level:'A2', pattern:'erhverv', context:'Han drømmer om at blive ___.', options:['pilot','en pilot'], correct:'pilot', note:'Erhverv efter blive står uden artikel: blive pilot.' },
    { id:'b5-som-tjener2', level:'A2', pattern:'erhverv', context:'Jeg arbejder som ___ om aftenen.', options:['tjener','en tjener'], correct:'tjener', note:'Efter som står erhverv uden artikel: som tjener.' },
    { id:'b5-mand-mekaniker', level:'A2', pattern:'erhverv', context:'Hendes mand er ___ og reparerer biler.', options:['mekaniker','en mekaniker'], correct:'mekaniker', note:'Erhverv efter er står uden artikel: er mekaniker.' },
    { id:'b5-soester-sygeplejerske', level:'A2', pattern:'erhverv', context:'Min søster er ___ på sygehuset.', options:['sygeplejerske','en sygeplejerske'], correct:'sygeplejerske', note:'Erhverv efter er står uden artikel: er sygeplejerske.' },
    { id:'b5-uddanne-journalist', level:'B1', pattern:'erhverv', context:'Hun uddanner sig til ___.', options:['journalist','en journalist'], correct:'journalist', note:'Efter uddanne sig til står erhverv uden artikel: til journalist.' },
    { id:'b5-far-landmand', level:'A2', pattern:'erhverv', context:'Min bedstefar var ___ hele sit liv.', options:['landmand','en landmand'], correct:'landmand', note:'Erhverv efter var står uden artikel: var landmand.' },
    { id:'b5-som-laerer3', level:'A2', pattern:'erhverv', context:'Han arbejder som ___ på et gymnasium.', options:['lærer','en lærer'], correct:'lærer', note:'Efter som står erhverv uden artikel: som lærer.' },
    { id:'b5-hun-arkitekt', level:'A2', pattern:'erhverv', context:'Hun er ___ og tegner huse.', options:['arkitekt','en arkitekt'], correct:'arkitekt', note:'Erhverv efter er står uden artikel: er arkitekt.' },
    { id:'b5-blive-soldat', level:'A2', pattern:'erhverv', context:'Han vil være ___ i forsvaret.', options:['soldat','en soldat'], correct:'soldat', note:'Erhverv efter være står uden artikel: være soldat.' },
    { id:'b5-mor-direktoer', level:'B1', pattern:'erhverv', context:'Min mor er ___ i et stort firma.', options:['direktør','en direktør'], correct:'direktør', note:'Erhverv efter er står uden artikel: er direktør.' },
    { id:'b5-nabo-elektriker', level:'A2', pattern:'erhverv', context:'Vores nabo er ___ og hjælper os med lyset.', options:['elektriker','en elektriker'], correct:'elektriker', note:'Erhverv efter er står uden artikel: er elektriker.' },
    { id:'b5-laese-til-laerer', level:'B1', pattern:'erhverv', context:'Jeg læser til ___ på seminariet.', options:['lærer','en lærer'], correct:'lærer', note:'Efter læse til står erhverv uden artikel: til lærer.' },

    // --- possessive: no definite suffix — extended ---
    { id:'b5-min-bil', level:'A2', pattern:'ejestedord', context:'Hvor har du parkeret ___?', options:['min bil','min bilen','mit bil'], correct:'min bil', note:'Ejestedord + navneord i grundform: min bil.' },
    { id:'b5-mit-hus', level:'A2', pattern:'ejestedord', context:'Velkommen til ___.', options:['mit hus','mit huset','min hus'], correct:'mit hus', note:'Et-ord med ejestedord i grundform: mit hus.' },
    { id:'b5-mine-boeger', level:'A2', pattern:'ejestedord', context:'Jeg har glemt ___ i skolen.', options:['mine bøger','mine bøgerne'], correct:'mine bøger', note:'Efter ejestedord bruges grundform i flertal: mine bøger.' },
    { id:'b5-din-jakke', level:'A2', pattern:'ejestedord', context:'Er det ___, der ligger på gulvet?', options:['din jakke','din jakken','dit jakke'], correct:'din jakke', note:'Ejestedord + navneord i grundform: din jakke.' },
    { id:'b5-dit-vaerelse', level:'A2', pattern:'ejestedord', context:'Du skal rydde op på ___.', options:['dit værelse','dit værelset','din værelse'], correct:'dit værelse', note:'Et-ord med ejestedord i grundform: dit værelse.' },
    { id:'b5-dine-sko', level:'A2', pattern:'ejestedord', context:'Har du set ___ nogen steder?', options:['dine sko','dine skoene'], correct:'dine sko', note:'Efter ejestedord bruges grundform i flertal: dine sko.' },
    { id:'b5-hans-cykel', level:'A2', pattern:'ejestedord', context:'Peter er ikke kommet endnu. Jeg så ___ ved stationen.', options:['hans cykel','hans cyklen'], correct:'hans cykel', note:'Ejestedord + navneord i grundform: hans cykel (ejeren er ikke sætningens grundled).' },
    { id:'b5-hendes-taske', level:'A2', pattern:'ejestedord', context:'Mette har tabt noget. Jeg fandt ___ i bussen.', options:['hendes taske','hendes tasken'], correct:'hendes taske', note:'Ejestedord + navneord i grundform: hendes taske (ejeren er ikke sætningens grundled).' },
    { id:'b5-vores-hus', level:'A2', pattern:'ejestedord', context:'Kom endelig forbi ___ i weekenden.', options:['vores hus','vores huset'], correct:'vores hus', note:'Ejestedord + navneord i grundform: vores hus.' },
    { id:'b5-deres-bil', level:'A2', pattern:'ejestedord', context:'Naboerne er på ferie, så jeg vasker ___ i dag.', options:['deres bil','deres bilen'], correct:'deres bil', note:'Ejestedord + navneord i grundform: deres bil (ejerne er ikke sætningens grundled).' },
    { id:'b5-min-telefon', level:'A2', pattern:'ejestedord', context:'Jeg kan ikke finde ___.', options:['min telefon','min telefonen','mit telefon'], correct:'min telefon', note:'Ejestedord + navneord i grundform: min telefon.' },
    { id:'b5-mit-ur', level:'A2', pattern:'ejestedord', context:'Jeg har tabt ___ på stranden.', options:['mit ur','mit uret','min ur'], correct:'mit ur', note:'Et-ord med ejestedord i grundform: mit ur.' },
    { id:'b5-mine-noegler2', level:'A2', pattern:'ejestedord', context:'Har nogen set ___?', options:['mine nøgler','mine nøglerne'], correct:'mine nøgler', note:'Efter ejestedord bruges grundform i flertal: mine nøgler.' },
    { id:'b5-din-computer', level:'A2', pattern:'ejestedord', context:'Må jeg låne ___ et øjeblik?', options:['din computer','din computeren','dit computer'], correct:'din computer', note:'Ejestedord + navneord i grundform: din computer.' },
    { id:'b5-dit-arbejde', level:'A2', pattern:'ejestedord', context:'Hvordan går det med ___?', options:['dit arbejde','dit arbejdet','din arbejde'], correct:'dit arbejde', note:'Et-ord med ejestedord i grundform: dit arbejde.' },
    { id:'b5-dine-briller', level:'A2', pattern:'ejestedord', context:'Du har vist glemt ___ igen.', options:['dine briller','dine brillerne'], correct:'dine briller', note:'Efter ejestedord bruges grundform i flertal: dine briller.' },
    { id:'b5-hans-hund', level:'A2', pattern:'ejestedord', context:'Peter går ofte tur i parken. Alle kender ___ godt.', options:['hans hund','hans hunden'], correct:'hans hund', note:'Ejestedord + navneord i grundform: hans hund (ejeren er ikke sætningens grundled).' },
    { id:'b5-hendes-bog', level:'A2', pattern:'ejestedord', context:'Mette er forfatter. Jeg har lige læst ___ om Island.', options:['hendes bog','hendes bogen'], correct:'hendes bog', note:'Ejestedord + navneord i grundform: hendes bog (ejeren er ikke sætningens grundled).' },
    { id:'b5-vores-lejlighed', level:'A2', pattern:'ejestedord', context:'Vi maler ___ i næste uge.', options:['vores lejlighed','vores lejligheden'], correct:'vores lejlighed', note:'Ejestedord + navneord i grundform: vores lejlighed.' },
    { id:'b5-deres-boern', level:'A2', pattern:'ejestedord', context:'Forældrene er på arbejde, så jeg henter ___ i børnehaven.', options:['deres børn','deres børnene'], correct:'deres børn', note:'Efter ejestedord bruges grundform i flertal: deres børn (ejerne er ikke sætningens grundled).' },
    { id:'b5-sin-jakke', level:'A2', pattern:'ejestedord', context:'Peter tog ___ på og gik.', options:['sin jakke','sin jakken','sit jakke'], correct:'sin jakke', note:'Ejestedord + navneord i grundform: sin jakke.' },
    { id:'b5-sit-arbejde', level:'A2', pattern:'ejestedord', context:'Hun elsker ___ meget højt.', options:['sit arbejde','sit arbejdet','sin arbejde'], correct:'sit arbejde', note:'Et-ord med ejestedord i grundform: sit arbejde.' },
    { id:'b5-sine-boeger', level:'A2', pattern:'ejestedord', context:'Han pakkede ___ ned i kassen.', options:['sine bøger','sine bøgerne'], correct:'sine bøger', note:'Efter ejestedord bruges grundform i flertal: sine bøger.' },
    { id:'b5-min-familie', level:'A2', pattern:'ejestedord', context:'Jeg savner ___ meget.', options:['min familie','min familien','mit familie'], correct:'min familie', note:'Ejestedord + navneord i grundform: min familie.' },
    { id:'b5-mit-koekken', level:'A2', pattern:'ejestedord', context:'Jeg er ved at male ___.', options:['mit køkken','mit køkkenet','min køkken'], correct:'mit køkken', note:'Et-ord med ejestedord i grundform: mit køkken.' },

    // --- demonstratives — extended ---
    { id:'b5-denne-avis', level:'A2', pattern:'paapegende', context:'Har du læst ___ her?', options:['denne avis','dette avis','denne avisen'], correct:'denne avis', note:'Denne bruges påpegende om en-ord: denne avis.' },
    { id:'b5-dette-brev', level:'A2', pattern:'paapegende', context:'Jeg forstår ikke ___ her.', options:['dette brev','denne brev','dette brevet'], correct:'dette brev', note:'Dette bruges påpegende om et-ord: dette brev.' },
    { id:'b5-disse-boeger', level:'A2', pattern:'paapegende', context:'___ her er mine favoritter.', options:['Disse bøger','Denne bøger','Disse bøgerne'], correct:'Disse bøger', note:'Disse bruges påpegende om flertal: disse bøger.' },
    { id:'b5-denne-bil', level:'A2', pattern:'paapegende', context:'Jeg kunne godt tænke mig ___ her.', options:['denne bil','dette bil','denne bilen'], correct:'denne bil', note:'Denne bruges påpegende om en-ord: denne bil.' },
    { id:'b5-dette-billede', level:'A2', pattern:'paapegende', context:'Kan du lide ___ her?', options:['dette billede','denne billede','dette billedet'], correct:'dette billede', note:'Dette bruges påpegende om et-ord: dette billede.' },
    { id:'b5-disse-blomster', level:'A2', pattern:'paapegende', context:'___ her dufter dejligt.', options:['Disse blomster','Denne blomster','Disse blomsterne'], correct:'Disse blomster', note:'Disse bruges påpegende om flertal: disse blomster.' },
    { id:'b5-denne-jakke', level:'A2', pattern:'paapegende', context:'Jeg tager ___ her på.', options:['denne jakke','dette jakke','denne jakken'], correct:'denne jakke', note:'Denne bruges påpegende om en-ord: denne jakke.' },
    { id:'b5-dette-vaerelse', level:'A2', pattern:'paapegende', context:'Vi sover i ___ her i nat.', options:['dette værelse','denne værelse','dette værelset'], correct:'dette værelse', note:'Dette bruges påpegende om et-ord: dette værelse.' },
    { id:'b5-disse-mennesker', level:'A2', pattern:'paapegende', context:'___ her har ventet længe.', options:['Disse mennesker','Denne mennesker'], correct:'Disse mennesker', note:'Disse bruges påpegende om flertal: disse mennesker.' },
    { id:'b5-denne-kage', level:'A2', pattern:'paapegende', context:'Vil du smage ___ her?', options:['denne kage','dette kage','denne kagen'], correct:'denne kage', note:'Denne bruges påpegende om en-ord: denne kage.' },
    { id:'b5-dette-problem', level:'B1', pattern:'paapegende', context:'Vi skal løse ___ her sammen.', options:['dette problem','denne problem','dette problemet'], correct:'dette problem', note:'Dette bruges påpegende om et-ord: dette problem.' },
    { id:'b5-disse-huse', level:'B1', pattern:'paapegende', context:'___ blev bygget i 1920.', options:['Disse huse','Dette huse','Disse husene'], correct:'Disse huse', note:'Disse bruges påpegende om flertal: disse huse.' },
    { id:'b5-den-bog-paap', level:'B1', pattern:'paapegende', context:'___ bog der er min favorit.', options:['Den','Det','De'], correct:'Den', note:'Den bruges påpegende om et en-ord: den bog.' },
    { id:'b5-det-hus-paap', level:'B1', pattern:'paapegende', context:'___ hus derovre er til salg.', options:['Det','Den','De'], correct:'Det', note:'Det bruges påpegende om et et-ord: det hus.' },
    { id:'b5-de-boern-paap', level:'B1', pattern:'paapegende', context:'___ børn leger altid udenfor.', options:['De','Den','Det'], correct:'De', note:'De bruges påpegende om flertal: de børn.' },
    { id:'b5-den-bil-paap', level:'B1', pattern:'paapegende', context:'Jeg vil gerne købe ___ bil derovre.', options:['den','det','de'], correct:'den', note:'Den bruges påpegende om et en-ord: den bil.' },
    { id:'b5-det-billede-paap', level:'B1', pattern:'paapegende', context:'Kan du se ___ billede på væggen?', options:['det','den','de'], correct:'det', note:'Det bruges påpegende om et et-ord: det billede.' },
    { id:'b5-de-sko-paap', level:'B1', pattern:'paapegende', context:'Jeg tager ___ sko på i dag.', options:['de','den','det'], correct:'de', note:'De bruges påpegende om flertal: de sko.' },
    { id:'b5-denne-uge', level:'A2', pattern:'paapegende', context:'Vi mødes ___.', options:['denne uge','dette uge','denne ugen'], correct:'denne uge', note:'Denne bruges påpegende om en-ord: denne uge.' },
    { id:'b5-dette-aar', level:'A2', pattern:'paapegende', context:'___ har været travlt.', options:['Dette år','Denne år','Dette året'], correct:'Dette år', note:'Dette bruges påpegende om et-ord: dette år.' },
    { id:'b5-denne-sang', level:'A2', pattern:'paapegende', context:'Jeg elsker ___ her.', options:['denne sang','dette sang','denne sangen'], correct:'denne sang', note:'Denne bruges påpegende om en-ord: denne sang.' },
    { id:'b5-dette-spil', level:'A2', pattern:'paapegende', context:'___ her er svært at vinde.', options:['Dette spil','Denne spil','Dette spillet'], correct:'Dette spil', note:'Dette bruges påpegende om et-ord: dette spil.' },

    // --- definite adjective construction — extended ---
    { id:'b5-store-bil', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg drømmer om ___ derovre.', options:['den store bil','den store bilen'], correct:'den store bil', note:'Med foranstillet tillægsord: den + -e-form + grundform: den store bil.' },
    { id:'b5-lille-hus', level:'B1', pattern:'foranstillet-tillaegsord', context:'De bor i ___ ved skoven.', options:['det lille hus','det lille huset'], correct:'det lille hus', note:'Med foranstillet tillægsord bruges grundform: det lille hus.' },
    { id:'b5-gamle-kirke', level:'B1', pattern:'foranstillet-tillaegsord', context:'Vi besøgte ___ i byen.', options:['den gamle kirke','den gamle kirken'], correct:'den gamle kirke', note:'Med foranstillet tillægsord bruges grundform: den gamle kirke.' },
    { id:'b5-nye-bog', level:'B1', pattern:'foranstillet-tillaegsord', context:'Har du læst ___?', options:['den nye bog','den nye bogen'], correct:'den nye bog', note:'Med foranstillet tillægsord bruges grundform: den nye bog.' },
    { id:'b5-hvide-hus', level:'B1', pattern:'foranstillet-tillaegsord', context:'Kan du se ___ for enden af vejen?', options:['det hvide hus','det hvide huset'], correct:'det hvide hus', note:'Med foranstillet tillægsord bruges grundform: det hvide hus.' },
    { id:'b5-smukke-have', level:'B1', pattern:'foranstillet-tillaegsord', context:'Vi sad i ___ hele eftermiddagen.', options:['den smukke have','den smukke haven'], correct:'den smukke have', note:'Med foranstillet tillægsord bruges grundform: den smukke have.' },
    { id:'b5-dyre-ur', level:'B1', pattern:'foranstillet-tillaegsord', context:'Han købte ___ alligevel.', options:['det dyre ur','det dyre uret'], correct:'det dyre ur', note:'Med foranstillet tillægsord bruges grundform: det dyre ur.' },
    { id:'b5-roede-sko', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg tager ___ på til festen.', options:['de røde sko','de røde skoene'], correct:'de røde sko', note:'Med foranstillet tillægsord bruges grundform i flertal: de røde sko.' },
    { id:'b5-gule-hus', level:'B1', pattern:'foranstillet-tillaegsord', context:'De har malet ___ om.', options:['det gule hus','det gule huset'], correct:'det gule hus', note:'Med foranstillet tillægsord bruges grundform: det gule hus.' },
    { id:'b5-lange-tur', level:'B1', pattern:'foranstillet-tillaegsord', context:'Vi tog på ___ i bjergene.', options:['den lange tur','den lange turen'], correct:'den lange tur', note:'Med foranstillet tillægsord bruges grundform: den lange tur.' },
    { id:'b5-store-boern', level:'B1', pattern:'foranstillet-tillaegsord', context:'___ hjælper med opvasken.', options:['De store børn','De store børnene'], correct:'De store børn', note:'Med foranstillet tillægsord bruges grundform i flertal: de store børn.' },
    { id:'b5-gamle-bil', level:'B1', pattern:'foranstillet-tillaegsord', context:'___ starter ikke i kulden.', options:['Den gamle bil','Den gamle bilen'], correct:'Den gamle bil', note:'Med foranstillet tillægsord bruges grundform: den gamle bil.' },
    { id:'b5-nye-computer2', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg elsker ___.', options:['den nye computer','den nye computeren'], correct:'den nye computer', note:'Med foranstillet tillægsord bruges grundform: den nye computer.' },
    { id:'b5-billige-jakke', level:'B1', pattern:'foranstillet-tillaegsord', context:'Hun købte ___ i stedet.', options:['den billige jakke','den billige jakken'], correct:'den billige jakke', note:'Med foranstillet tillægsord bruges grundform: den billige jakke.' },
    { id:'b5-store-glas', level:'B1', pattern:'foranstillet-tillaegsord', context:'Kan du række mig ___?', options:['det store glas','det store glasset'], correct:'det store glas', note:'Med foranstillet tillægsord bruges grundform: det store glas.' },
    { id:'b5-friske-broed', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg elsker duften af ___.', options:['det friske brød','det friske brødet'], correct:'det friske brød', note:'Med foranstillet tillægsord bruges grundform: det friske brød.' },
    { id:'b5-smaa-huse', level:'B1', pattern:'foranstillet-tillaegsord', context:'___ ved havnen er dyre.', options:['De små huse','De små husene'], correct:'De små huse', note:'Med foranstillet tillægsord bruges grundform i flertal: de små huse.' },
    { id:'b5-flotte-billede', level:'B1', pattern:'foranstillet-tillaegsord', context:'Alle beundrer ___.', options:['det flotte billede','det flotte billedet'], correct:'det flotte billede', note:'Med foranstillet tillægsord bruges grundform: det flotte billede.' },
    { id:'b5-varme-suppe', level:'B1', pattern:'foranstillet-tillaegsord', context:'Han spiste ___ hurtigt.', options:['den varme suppe','den varme suppen'], correct:'den varme suppe', note:'Med foranstillet tillægsord bruges grundform: den varme suppe.' },
    { id:'b5-lange-brev', level:'B1', pattern:'foranstillet-tillaegsord', context:'Jeg har endnu ikke læst ___.', options:['det lange brev','det lange brevet'], correct:'det lange brev', note:'Med foranstillet tillægsord bruges grundform: det lange brev.' },
    { id:'b5-unge-mand', level:'B1', pattern:'foranstillet-tillaegsord', context:'Kender du ___ derovre?', options:['den unge mand','den unge manden'], correct:'den unge mand', note:'Med foranstillet tillægsord bruges grundform: den unge mand.' },
    { id:'b5-dygtige-laege', level:'B1', pattern:'foranstillet-tillaegsord', context:'Vi stoler helt på ___.', options:['den dygtige læge','den dygtige lægen'], correct:'den dygtige læge', note:'Med foranstillet tillægsord bruges grundform: den dygtige læge.' },
    { id:'b5-blaa-bil', level:'B1', pattern:'foranstillet-tillaegsord', context:'___ tilhører min nabo.', options:['Den blå bil','Den blå bilen'], correct:'Den blå bil', note:'Med foranstillet tillægsord bruges grundform: den blå bil.' },
    { id:'b5-gamle-huse', level:'B1', pattern:'foranstillet-tillaegsord', context:'___ skal snart rives ned.', options:['De gamle huse','De gamle husene'], correct:'De gamle huse', note:'Med foranstillet tillægsord bruges grundform i flertal: de gamle huse.' },
    { id:'b5-store-hund', level:'B1', pattern:'foranstillet-tillaegsord', context:'___ gøede hele natten.', options:['Den store hund','Den store hunden'], correct:'Den store hund', note:'Med foranstillet tillægsord bruges grundform: den store hund.' },

    // --- generic plural — extended ---
    { id:'b5-katte-generic', level:'A2', pattern:'generisk-flertal', context:'I almindelighed kan ___ se i mørke.', options:['Katte','Kattene'], correct:'Katte', note:'Generelt om alle katte: ubestemt flertal katte.' },
    { id:'b5-boeger-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ dyre nu om dage.', options:['Bøger','Bøgerne'], correct:'Bøger', note:'Generelt om bøger: ubestemt flertal bøger.' },
    { id:'b5-biler-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt forurener ___ miljøet.', options:['Biler','Bilerne'], correct:'Biler', note:'Generelt om biler: ubestemt flertal biler.' },
    { id:'b5-elefanter-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ meget store dyr.', options:['Elefanter','Elefanterne'], correct:'Elefanter', note:'Generelt om elefanter: ubestemt flertal elefanter.' },
    { id:'b5-groensager-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ gode for helbredet.', options:['Grøntsager','Grøntsagerne'], correct:'Grøntsager', note:'Generelt om grøntsager: ubestemt flertal grøntsager.' },
    { id:'b5-appelsiner-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt indeholder ___ meget C-vitamin.', options:['Appelsiner','Appelsinerne'], correct:'Appelsiner', note:'Generelt om appelsiner: ubestemt flertal appelsiner.' },
    { id:'b5-heste-generic', level:'A2', pattern:'generisk-flertal', context:'I almindelighed kan ___ løbe meget hurtigt.', options:['Heste','Hestene'], correct:'Heste', note:'Generelt om heste: ubestemt flertal heste.' },
    { id:'b5-computere-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt bliver ___ hurtigere hvert år.', options:['Computere','Computerne'], correct:'Computere', note:'Generelt om computere: ubestemt flertal computere.' },
    { id:'b5-fugle-generic', level:'A2', pattern:'generisk-flertal', context:'I almindelighed flyver ___ sydpå om vinteren.', options:['Fugle','Fuglene'], correct:'Fugle', note:'Generelt om fugle: ubestemt flertal fugle.' },
    { id:'b5-laerere-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt arbejder ___ ofte om aftenen.', options:['Lærere','Lærerne'], correct:'Lærere', note:'Generelt om lærere: ubestemt flertal lærere.' },
    { id:'b5-turister-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt besøger ___ ofte Nyhavn.', options:['Turister','Turisterne'], correct:'Turister', note:'Generelt om turister: ubestemt flertal turister.' },
    { id:'b5-teenagere-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt sover ___ gerne længe.', options:['Teenagere','Teenagerne'], correct:'Teenagere', note:'Generelt om teenagere: ubestemt flertal teenagere.' },
    { id:'b5-fisk-generic', level:'A2', pattern:'generisk-flertal', context:'I almindelighed lever ___ i vand.', options:['Fisk','Fiskene'], correct:'Fisk', note:'Generelt om fisk: ubestemt flertal fisk.' },
    { id:'b5-traeer-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt giver ___ os ilt.', options:['Træer','Træerne'], correct:'Træer', note:'Generelt om træer: ubestemt flertal træer.' },
    { id:'b5-bier-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ vigtige for naturen.', options:['Bier','Bierne'], correct:'Bier', note:'Generelt om bier: ubestemt flertal bier.' },
    { id:'b5-cykler-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ billige at bruge.', options:['Cykler','Cyklerne'], correct:'Cykler', note:'Generelt om cykler: ubestemt flertal cykler.' },
    { id:'b5-huse-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ blevet meget dyre.', options:['Huse','Husene'], correct:'Huse', note:'Generelt om huse: ubestemt flertal huse.' },
    { id:'b5-aviser-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt mister ___ flere og flere læsere.', options:['Aviser','Aviserne'], correct:'Aviser', note:'Generelt om aviser: ubestemt flertal aviser.' },
    { id:'b5-loever-generic', level:'A2', pattern:'generisk-flertal', context:'I almindelighed jager ___ helst om natten.', options:['Løver','Løverne'], correct:'Løver', note:'Generelt om løver: ubestemt flertal løver.' },
    { id:'b5-telefoner-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ blevet en del af hverdagen.', options:['Telefoner','Telefonerne'], correct:'Telefoner', note:'Generelt om telefoner: ubestemt flertal telefoner.' },
    { id:'b5-bananer-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt er ___ gule, når de er modne.', options:['Bananer','Bananerne'], correct:'Bananer', note:'Generelt om bananer: ubestemt flertal bananer.' },
    { id:'b5-tog-generic', level:'A2', pattern:'generisk-flertal', context:'Generelt kører ___ på skinner.', options:['Tog','Togene'], correct:'Tog', note:'Generelt om tog: ubestemt flertal tog.' },

    // --- fixed expressions — extended ---
    { id:'b5-i-kirke', level:'A2', pattern:'fast-udtryk', context:'Vi går i ___ hver søndag.', options:['kirke','kirken','en kirke'], correct:'kirke', note:'Fast udtryk: gå i kirke — uden artikel.' },
    { id:'b5-paa-ferie', level:'A2', pattern:'fast-udtryk', context:'De tager på ___ til Spanien.', options:['ferie','ferien','en ferie'], correct:'ferie', note:'Fast udtryk: på ferie — uden artikel.' },
    { id:'b5-se-fjernsyn', level:'A2', pattern:'fast-udtryk', context:'Om aftenen ser vi ___.', options:['fjernsyn','fjernsynet'], correct:'fjernsyn', note:'Fast udtryk: se fjernsyn — uden artikel.' },
    { id:'b5-hoere-radio', level:'A2', pattern:'fast-udtryk', context:'Jeg hører ___ i bilen.', options:['radio','radioen'], correct:'radio', note:'Fast udtryk: høre radio — uden artikel.' },
    { id:'b5-koere-bil', level:'A2', pattern:'fast-udtryk', context:'Han lærer at køre ___.', options:['bil','bilen','en bil'], correct:'bil', note:'Fast udtryk: køre bil — uden artikel.' },
    { id:'b5-spille-fodbold', level:'A2', pattern:'fast-udtryk', context:'Drengene spiller ___ i parken.', options:['fodbold','fodbolden'], correct:'fodbold', note:'Fast udtryk: spille fodbold — uden artikel.' },
    { id:'b5-laese-avis', level:'A2', pattern:'fast-udtryk', context:'Hvad laver han? Han sidder og læser ___.', options:['avis','avisen'], correct:'avis', note:'Fast udtryk: læse avis — uden artikel.' },
    { id:'b5-gaa-i-bad', level:'A2', pattern:'fast-udtryk', context:'Jeg går i ___, når jeg vågner.', options:['bad','badet','et bad'], correct:'bad', note:'Fast udtryk: gå i bad — uden artikel.' },
    { id:'b5-tage-toget', level:'A2', pattern:'fast-udtryk', context:'Jeg tager ___ til arbejde hver dag.', options:['toget','et tog'], correct:'toget', note:'Fast udtryk om transport: tage toget — med bestemt form.' },
    { id:'b5-tage-bussen', level:'A2', pattern:'fast-udtryk', context:'Vi tager ___ ind til byen.', options:['bussen','en bus'], correct:'bussen', note:'Fast udtryk om transport: tage bussen — med bestemt form.' },
    { id:'b5-til-middag', level:'A2', pattern:'fast-udtryk', context:'Må jeg invitere dig til ___ i aften?', options:['middag','middagen'], correct:'middag', note:'Fast udtryk: til middag — uden artikel.' },
    { id:'b5-spille-klaver', level:'A2', pattern:'fast-udtryk', context:'Hun spiller ___ meget smukt.', options:['klaver','klaveret'], correct:'klaver', note:'Fast udtryk: spille klaver — uden artikel.' },
    { id:'b5-i-faengsel', level:'B1', pattern:'fast-udtryk', context:'Han sad i ___ i tre år.', options:['fængsel','fængslet'], correct:'fængsel', note:'Fast udtryk: i fængsel — uden artikel.' },
    { id:'b5-paa-hospitalet', level:'A2', pattern:'fast-udtryk', context:'Hun ligger på ___ efter ulykken.', options:['hospitalet','et hospital'], correct:'hospitalet', note:'Fast udtryk: på hospitalet — med bestemt form.' },
    { id:'b5-til-frokost', level:'A2', pattern:'fast-udtryk', context:'Vi mødes til ___ klokken tolv.', options:['frokost','frokosten'], correct:'frokost', note:'Fast udtryk: til frokost — uden artikel.' },
    { id:'b5-holde-ferie', level:'A2', pattern:'fast-udtryk', context:'Vi holder ___ i juli.', options:['ferie','ferien'], correct:'ferie', note:'Fast udtryk: holde ferie — uden artikel.' },
    { id:'b5-starte-i-skole', level:'A2', pattern:'fast-udtryk', context:'Mit barnebarn er seks år og skal snart begynde i ___.', options:['skole','skolen'], correct:'skole', note:'Fast udtryk: begynde i skole — uden artikel.' },
    { id:'b5-paa-universitetet', level:'B1', pattern:'fast-udtryk', context:'Hun læser på ___.', options:['universitetet','et universitet'], correct:'universitetet', note:'Fast udtryk: læse på universitetet — med bestemt form.' },
    { id:'b5-til-tiden', level:'B1', pattern:'fast-udtryk', context:'Toget kom til ___ i dag.', options:['tiden','tid'], correct:'tiden', note:'Fast udtryk: til tiden — med bestemt form.' },
    { id:'b5-ligge-i-seng', level:'A2', pattern:'fast-udtryk', context:'Det er sent. Nu skal børnene i ___.', options:['seng','sengen'], correct:'seng', note:'Fast udtryk: i seng — uden artikel.' },
    { id:'b5-spise-morgenmad', level:'A2', pattern:'fast-udtryk', context:'Jeg spiser ___ klokken syv.', options:['morgenmad','morgenmaden'], correct:'morgenmad', note:'Fast udtryk: spise morgenmad — uden artikel.' },
    { id:'b5-drikke-kaffe', level:'A2', pattern:'fast-udtryk', context:'Vi drikker ___ efter frokost.', options:['kaffe','kaffen'], correct:'kaffe', note:'Fast udtryk: drikke kaffe — uden artikel.' },
    { id:'b5-komme-paa-arbejde', level:'A2', pattern:'fast-udtryk', context:'Hun kommer på ___ klokken otte.', options:['arbejde','arbejdet'], correct:'arbejde', note:'Fast udtryk: på arbejde — uden bestemt endelse.' },
    { id:'b5-tage-cyklen', level:'A2', pattern:'fast-udtryk', context:'Jeg tager ___ til stationen.', options:['cyklen','en cykel'], correct:'cyklen', note:'Fast udtryk om transport: tage cyklen — med bestemt form.' },
    { id:'b5-gaa-i-biografen', level:'A2', pattern:'fast-udtryk', context:'Skal vi gå i ___ i aften?', options:['biografen','en biograf'], correct:'biografen', note:'Fast udtryk: gå i biografen — med bestemt form.' },

    // --- specific vs nonspecific reference — extended ---
    { id:'b5-soeger-sekretaer', level:'B1', pattern:'specifik-reference', context:'Firmaet søger ___, der taler tysk.', options:['en sekretær','sekretæren'], correct:'en sekretær', note:'Om en hvilken som helst (ikke-bestemt) person: ubestemt form en sekretær.' },
    { id:'b5-brug-hammer', level:'B1', pattern:'specifik-reference', context:'Har du ___, jeg kan låne?', options:['en hammer','hammeren'], correct:'en hammer', note:'Om en hvilken som helst (ikke-bestemt) ting: ubestemt form en hammer.' },
    { id:'b5-manden-butik', level:'B1', pattern:'specifik-reference', context:'Jeg talte med ham ved kassen i går. ___ i butikken var meget hjælpsom.', options:['Manden','En mand'], correct:'Manden', note:'En bestemt, identificeret person: bestemt form manden.' },
    { id:'b5-leder-laege', level:'B1', pattern:'specifik-reference', context:'Vi leder efter ___, der kan tale spansk.', options:['en læge','lægen'], correct:'en læge', note:'Om en hvilken som helst (ikke-bestemt) person: ubestemt form en læge.' },
    { id:'b5-bogen-laante', level:'B1', pattern:'specifik-reference', context:'___, jeg lånte på biblioteket, var spændende.', options:['Bogen','En bog'], correct:'Bogen', note:'En bestemt, identificeret ting: bestemt form bogen.' },
    { id:'b5-har-du-pen', level:'B1', pattern:'specifik-reference', context:'Har du ___, jeg må låne?', options:['en pen','pennen'], correct:'en pen', note:'Om en hvilken som helst (ikke-bestemt) ting: ubestemt form en pen.' },
    { id:'b5-kvinden-moede', level:'B1', pattern:'specifik-reference', context:'___, jeg mødte til festen, ringede i dag.', options:['Kvinden','En kvinde'], correct:'Kvinden', note:'En bestemt, identificeret person: bestemt form kvinden.' },
    { id:'b5-behov-plan', level:'B1', pattern:'specifik-reference', context:'Vi har brug for ___ for fremtiden.', options:['en plan','planen'], correct:'en plan', note:'En endnu ukendt plan: ubestemt form en plan.' },
    { id:'b5-filmen-igaar', level:'B1', pattern:'specifik-reference', context:'___, vi så i går, vandt en pris.', options:['Filmen','En film'], correct:'Filmen', note:'En bestemt, identificeret ting: bestemt form filmen.' },
    { id:'b5-ansaette-tolk', level:'B1', pattern:'specifik-reference', context:'De vil ansætte ___, der kan arbejde om natten.', options:['en tolk','tolken'], correct:'en tolk', note:'Om en hvilken som helst (ikke-bestemt) person: ubestemt form en tolk.' },
    { id:'b5-huset-koebte', level:'B1', pattern:'specifik-reference', context:'___, de købte sidste år, er steget i værdi.', options:['Huset','Et hus'], correct:'Huset', note:'En bestemt, identificeret ting: bestemt form huset.' },
    { id:'b5-mangler-skruetraekker', level:'B1', pattern:'specifik-reference', context:'Jeg mangler ___ til det her.', options:['en skruetrækker','skruetrækkeren'], correct:'en skruetrækker', note:'Om en hvilken som helst (ikke-bestemt) ting: ubestemt form en skruetrækker.' },
    { id:'b5-laereren-igaar', level:'B1', pattern:'specifik-reference', context:'___, der underviste os i går, var vikar.', options:['Læreren','En lærer'], correct:'Læreren', note:'En bestemt, identificeret person: bestemt form læreren.' },
    { id:'b5-koebe-gave2', level:'B1', pattern:'specifik-reference', context:'Jeg skal købe ___ til min mor.', options:['en gave','gaven'], correct:'en gave', note:'En endnu ukendt ting: ubestemt form en gave.' },
    { id:'b5-bilen-parkeret', level:'B1', pattern:'specifik-reference', context:'___, der holder foran huset, er min.', options:['Bilen','En bil'], correct:'Bilen', note:'En bestemt, identificeret ting: bestemt form bilen.' },
    { id:'b5-finde-lejlighed', level:'B1', pattern:'specifik-reference', context:'De prøver at finde ___ i centrum.', options:['en lejlighed','lejligheden'], correct:'en lejlighed', note:'En endnu ukendt bolig: ubestemt form en lejlighed.' },
    { id:'b5-brevet-modtog', level:'B1', pattern:'specifik-reference', context:'___, jeg modtog i morges, var vigtigt.', options:['Brevet','Et brev'], correct:'Brevet', note:'En bestemt, identificeret ting: bestemt form brevet.' },
    { id:'b5-soeger-medarbejder', level:'B1', pattern:'specifik-reference', context:'Vi søger ___ med erfaring.', options:['en medarbejder','medarbejderen'], correct:'en medarbejder', note:'Om en hvilken som helst (ikke-bestemt) person: ubestemt form en medarbejder.' },
    { id:'b5-restauranten-spiste', level:'B1', pattern:'specifik-reference', context:'___, vi spiste på, var ret dyr.', options:['Restauranten','En restaurant'], correct:'Restauranten', note:'En bestemt, identificeret ting: bestemt form restauranten.' },
    { id:'b5-har-cykel-laane', level:'B1', pattern:'specifik-reference', context:'Har du ___, jeg kan låne til i morgen?', options:['en cykel','cyklen'], correct:'en cykel', note:'Om en hvilken som helst (ikke-bestemt) ting: ubestemt form en cykel.' },
    { id:'b5-hotellet-boede', level:'B1', pattern:'specifik-reference', context:'___, vi boede på, lå ved stranden.', options:['Hotellet','Et hotel'], correct:'Hotellet', note:'En bestemt, identificeret ting: bestemt form hotellet.' },
    { id:'b5-brug-ordbog', level:'B1', pattern:'specifik-reference', context:'Jeg får brug for ___ til eksamen.', options:['en ordbog','ordbogen'], correct:'en ordbog', note:'Om en hvilken som helst (ikke-bestemt) ting: ubestemt form en ordbog.' },
    { id:'b5-manden-talte', level:'B1', pattern:'specifik-reference', context:'___, jeg talte med tidligere, kommer nu.', options:['Manden','En mand'], correct:'Manden', note:'En bestemt, identificeret person: bestemt form manden.' },
    { id:'b5-koebe-computer2', level:'B1', pattern:'specifik-reference', context:'Han vil købe ___ til sit studie.', options:['en computer','computeren'], correct:'en computer', note:'En endnu ukendt ting: ubestemt form en computer.' }
  ];

  // =====================================================================
  //  Mode 6 — Mængdeværkstedet (quantifiers & countability, MC)
  //  Schema: prd.md § 2.4 (quantifier item). Hand-authored; `pattern` groups
  //  items for SRS pattern keys. Countable vs. uncountable is the core split.
  // =====================================================================
  var MAENGDE = [
    // --- mange / meget ---
    { id:'b6-mange-mennesker', level:'A1', pattern:'mange-meget', context:'Der er ___ mennesker i parken i dag.', options:['mange','meget','lidt'], correct:'mange', note:'Mange bruges om tælleligt flertal: mange mennesker.' },
    { id:'b6-meget-arbejde', level:'A1', pattern:'mange-meget', context:'Han har ___ arbejde for tiden.', options:['meget','mange','få'], correct:'meget', note:'Meget bruges om utælleligt: meget arbejde.' },
    { id:'b6-meget-tid', level:'A1', pattern:'mange-meget', context:'Jeg har ikke ___ tid i dag.', options:['meget','mange'], correct:'meget', note:'Tid er utælleligt: meget tid.' },
    { id:'b6-mange-boeger', level:'A1', pattern:'mange-meget', context:'Hun har læst ___ bøger i år.', options:['mange','meget'], correct:'mange', note:'Bøger er tælleligt: mange bøger.' },
    { id:'b6-mange-penge', level:'A2', pattern:'mange-meget', context:'Hvor ___ penge har du med?', options:['mange','meget'], correct:'mange', note:'Penge er flertal og tælles: mange penge.' },
    // --- få / lidt ---
    { id:'b6-faa-gaester', level:'A2', pattern:'faa-lidt', context:'Der kom kun ___ gæster til festen.', options:['få','lidt','meget'], correct:'få', note:'Få bruges om tælleligt: få gæster.' },
    { id:'b6-lidt-maelk', level:'A2', pattern:'faa-lidt', context:'Vi har kun ___ mælk tilbage.', options:['lidt','få'], correct:'lidt', note:'Mælk er utælleligt: lidt mælk.' },
    { id:'b6-faa-ord', level:'A2', pattern:'faa-lidt', context:'Han sagde kun ___ ord til mødet.', options:['få','lidt'], correct:'få', note:'Ord er tælleligt: få ord.' },
    { id:'b6-lidt-sukker', level:'A2', pattern:'faa-lidt', context:'Kom ___ sukker i kaffen, tak.', options:['lidt','få'], correct:'lidt', note:'Sukker er utælleligt: lidt sukker.' },
    { id:'b6-faa-fejl', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ fejl i opgaven.', options:['få','lidt'], correct:'få', note:'Fejl er tælleligt: få fejl.' },
    // --- flere / mere ---
    { id:'b6-mere-kaffe', level:'A2', pattern:'flere-mere', context:'Kan jeg få ___ kaffe, tak?', options:['mere','flere'], correct:'mere', note:'Mere bruges om utælleligt: mere kaffe.' },
    { id:'b6-flere-stole', level:'A2', pattern:'flere-mere', context:'Vi skal bruge ___ stole til gæsterne.', options:['flere','mere'], correct:'flere', note:'Flere bruges om tælleligt: flere stole.' },
    { id:'b6-mere-vand', level:'A2', pattern:'flere-mere', context:'Planten har brug for ___ vand.', options:['mere','flere'], correct:'mere', note:'Vand er utælleligt: mere vand.' },
    // --- færre / mindre ---
    { id:'b6-faerre-studerende', level:'B1', pattern:'faerre-mindre', context:'I år er der ___ studerende end sidste år.', options:['færre','mindre'], correct:'færre', note:'Færre bruges om tælleligt: færre studerende.' },
    { id:'b6-mindre-kaffe', level:'B1', pattern:'faerre-mindre', context:'Jeg prøver at drikke ___ kaffe end før.', options:['mindre','færre'], correct:'mindre', note:'Kaffe er utælleligt: mindre kaffe.' },
    { id:'b6-faerre-biler', level:'B1', pattern:'faerre-mindre', context:'Der er ___ biler på vejen om søndagen.', options:['færre','mindre'], correct:'færre', note:'Biler er tælleligt: færre biler.' },
    // --- al / alt / alle ---
    { id:'b6-alle-boern', level:'A2', pattern:'al-alt-alle', context:'___ børnene legede ude i haven.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle børn.' },
    { id:'b6-al-mad', level:'A2', pattern:'al-alt-alle', context:'Han spiste ___ maden op med det samme.', options:['al','alle','alt'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al maden.' },
    { id:'b6-alt-i-orden', level:'A2', pattern:'al-alt-alle', context:'Er ___ i orden med dig?', options:['alt','al','alle'], correct:'alt', note:'Alt står alene om noget abstrakt/utælleligt: er alt i orden?' },
    { id:'b6-alt-vand', level:'A2', pattern:'al-alt-alle', context:'___ vandet løb ud på gulvet.', options:['Alt','Al','Alle'], correct:'Alt', note:'Alt bruges om utælleligt intetkøn: alt vandet.' },
    // --- hver / hvert ---
    { id:'b6-hver-dag', level:'A1', pattern:'hver-hvert', context:'___ dag går jeg en lang tur.', options:['Hver','Hvert'], correct:'Hver', note:'Hver bruges om en-ord: hver dag.' },
    { id:'b6-hvert-barn', level:'A2', pattern:'hver-hvert', context:'___ barn fik en ballon med hjem.', options:['Hvert','Hver'], correct:'Hvert', note:'Hvert bruges om et-ord: hvert barn.' },
    { id:'b6-hver-uge', level:'A2', pattern:'hver-hvert', context:'Vi mødes ___ uge til træning.', options:['hver','hvert'], correct:'hver', note:'Uge er en-ord: hver uge.' },
    { id:'b6-hvert-aar', level:'A2', pattern:'hver-hvert', context:'De rejser til Norge ___ år.', options:['hvert','hver'], correct:'hvert', note:'År er et-ord: hvert år.' },
    // --- begge ---
    { id:'b6-begge-foraeldre', level:'A2', pattern:'begge', context:'___ mine forældre arbejder som lærere.', options:['Begge','Hver','Al'], correct:'Begge', note:'Begge bruges om præcis to: begge mine forældre.' },
    { id:'b6-begge-haender', level:'A2', pattern:'begge', context:'Hun holdt fast om koppen med ___ hænder.', options:['begge','hver','alle'], correct:'begge', note:'Begge bruges om et par (to): begge hænder.' },
    // --- ingen / intet ---
    { id:'b6-ingen-maelk', level:'A2', pattern:'ingen-intet', context:'Der er ___ mælk tilbage i køleskabet.', options:['ingen','intet'], correct:'ingen', note:'Ingen bruges om fælleskøn og flertal: ingen mælk.' },
    { id:'b6-intet-problem', level:'B1', pattern:'ingen-intet', context:'Han har ___ problem med at vente.', options:['intet','ingen'], correct:'intet', note:'Intet bruges om et-ord: intet problem.' },
    { id:'b6-ingen-kom', level:'A2', pattern:'ingen-intet', context:'___ kom til mødet i morges.', options:['Ingen','Intet'], correct:'Ingen', note:'Ingen bruges om personer: ingen kom.' },
    { id:'b6-intet-svar', level:'B1', pattern:'ingen-intet', context:'Der var ___ vindue i rummet.', options:['intet','ingen'], correct:'intet', note:'Vindue er et-ord: intet vindue.' },
    // --- nogen / nogle / noget ---
    { id:'b6-nogen-hjemme', level:'A2', pattern:'nogen-nogle-noget', context:'Er der ___ hjemme?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges i spørgsmål om en enkelt person: er der nogen?' },
    { id:'b6-nogle-aebler', level:'A2', pattern:'nogen-nogle-noget', context:'Jeg har købt ___ æbler til madpakken.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et ubestemt tælleligt flertal: nogle æbler.' },
    { id:'b6-noget-kaffe', level:'A2', pattern:'nogen-nogle-noget', context:'Vil du have ___ kaffe?', options:['noget','nogen','nogle'], correct:'noget', note:'Noget bruges om utælleligt: noget kaffe.' },
    { id:'b6-nogle-venner', level:'A2', pattern:'nogen-nogle-noget', context:'Jeg mødtes med ___ venner i weekenden.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle venner.' },
    { id:'b6-noget-vand', level:'A2', pattern:'nogen-nogle-noget', context:'Der er ___ vand på gulvet i badeværelset.', options:['noget','nogle','nogen'], correct:'noget', note:'Vand er utælleligt: noget vand.' },
    // --- mange / meget (extra) ---
    { id:'b6-meget-sne', level:'A2', pattern:'mange-meget', context:'Der faldt ___ sne i weekenden.', options:['meget','mange'], correct:'meget', note:'Sne er utælleligt: meget sne.' },
    { id:'b6-mange-timer', level:'A2', pattern:'mange-meget', context:'Han bruger ___ timer på lektier.', options:['mange','meget'], correct:'mange', note:'Timer er tælleligt flertal: mange timer.' },
    { id:'b6-meget-salt', level:'A2', pattern:'mange-meget', context:'Der er ___ salt i suppen.', options:['meget','mange'], correct:'meget', note:'Salt er utælleligt: meget salt.' },
    { id:'b6-mange-elever', level:'A2', pattern:'mange-meget', context:'Der går ___ elever på skolen.', options:['mange','meget'], correct:'mange', note:'Elever er tælleligt flertal: mange elever.' },
    { id:'b6-meget-regn', level:'A2', pattern:'mange-meget', context:'Vi fik ___ regn i sommer.', options:['meget','mange'], correct:'meget', note:'Regn er utælleligt: meget regn.' },
    { id:'b6-mange-spoergsmaal', level:'A2', pattern:'mange-meget', context:'Eleverne stillede ___ spørgsmål.', options:['mange','meget'], correct:'mange', note:'Spørgsmål er tælleligt flertal: mange spørgsmål.' },
    { id:'b6-meget-hjaelp', level:'A2', pattern:'mange-meget', context:'Hun har brug for ___ hjælp med lektierne.', options:['meget','mange'], correct:'meget', note:'Hjælp er utælleligt: meget hjælp.' },
    { id:'b6-mange-lande', level:'B1', pattern:'mange-meget', context:'Hun har besøgt ___ lande.', options:['mange','meget'], correct:'mange', note:'Lande er tælleligt flertal: mange lande.' },
    { id:'b6-meget-mad', level:'A1', pattern:'mange-meget', context:'Der er ___ mad tilbage fra festen.', options:['meget','mange'], correct:'meget', note:'Mad er utælleligt: meget mad.' },
    { id:'b6-mange-ideer', level:'B1', pattern:'mange-meget', context:'Vi fik ___ gode idéer på mødet.', options:['mange','meget'], correct:'mange', note:'Idéer er tælleligt flertal: mange idéer.' },
    { id:'b6-meget-musik', level:'A2', pattern:'mange-meget', context:'Han hører ___ musik om aftenen.', options:['meget','mange'], correct:'meget', note:'Musik er utælleligt: meget musik.' },
    { id:'b6-mange-huse', level:'A2', pattern:'mange-meget', context:'Der bliver bygget ___ nye huse i byen.', options:['mange','meget'], correct:'mange', note:'Huse er tælleligt flertal: mange huse.' },
    { id:'b6-meget-kaerlighed', level:'B1', pattern:'mange-meget', context:'Der er ___ kærlighed i den familie.', options:['meget','mange'], correct:'meget', note:'Kærlighed er utælleligt: meget kærlighed.' },
    { id:'b6-mange-dage', level:'A2', pattern:'mange-meget', context:'Der er gået ___ dage, siden vi sås.', options:['mange','meget'], correct:'mange', note:'Dage er tælleligt flertal: mange dage.' },
    { id:'b6-meget-sukker', level:'A1', pattern:'mange-meget', context:'Der er ___ sukker i sodavand.', options:['meget','mange'], correct:'meget', note:'Sukker er utælleligt: meget sukker.' },
    { id:'b6-mange-planter', level:'A2', pattern:'mange-meget', context:'Hun har ___ planter i vindueskarmen.', options:['mange','meget'], correct:'mange', note:'Planter er tælleligt flertal: mange planter.' },
    { id:'b6-meget-erfaring', level:'B1', pattern:'mange-meget', context:'Han har ___ erfaring med børn.', options:['meget','mange'], correct:'meget', note:'Erfaring er utælleligt: meget erfaring.' },
    { id:'b6-mange-katte', level:'A2', pattern:'mange-meget', context:'Der bor ___ katte i den gade.', options:['mange','meget'], correct:'mange', note:'Katte er tælleligt flertal: mange katte.' },
    { id:'b6-meget-plads', level:'A2', pattern:'mange-meget', context:'Der er ___ plads i den nye lejlighed.', options:['meget','mange'], correct:'meget', note:'Plads er utælleligt: meget plads.' },
    { id:'b6-mange-fejl', level:'A2', pattern:'mange-meget', context:'Der var ___ fejl i teksten.', options:['mange','meget'], correct:'mange', note:'Fejl er tælleligt flertal: mange fejl.' },
    { id:'b6-meget-vin', level:'B1', pattern:'mange-meget', context:'Der blev drukket ___ vin til festen.', options:['meget','mange'], correct:'meget', note:'Vin er utælleligt her: meget vin.' },
    { id:'b6-mange-turister', level:'B1', pattern:'mange-meget', context:'Der kommer ___ turister om sommeren.', options:['mange','meget'], correct:'mange', note:'Turister er tælleligt flertal: mange turister.' },
    { id:'b6-meget-benzin', level:'B1', pattern:'mange-meget', context:'Bilen bruger ___ benzin.', options:['meget','mange'], correct:'meget', note:'Benzin er utælleligt: meget benzin.' },
    // --- få / lidt (extra) ---
    { id:'b6-lidt-vand', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ vand tilbage i flasken.', options:['lidt','få'], correct:'lidt', note:'Vand er utælleligt: lidt vand.' },
    { id:'b6-faa-venner', level:'A2', pattern:'faa-lidt', context:'Han har kun ___ venner.', options:['få','lidt'], correct:'få', note:'Venner er tælleligt: få venner.' },
    { id:'b6-lidt-tid', level:'A2', pattern:'faa-lidt', context:'Jeg har kun ___ tid i dag.', options:['lidt','få'], correct:'lidt', note:'Tid er utælleligt: lidt tid.' },
    { id:'b6-faa-boeger', level:'A2', pattern:'faa-lidt', context:'Der stod kun ___ bøger på hylden.', options:['få','lidt'], correct:'få', note:'Bøger er tælleligt: få bøger.' },
    { id:'b6-lidt-kaffe', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ kaffe tilbage.', options:['lidt','få'], correct:'lidt', note:'Kaffe er utælleligt: lidt kaffe.' },
    { id:'b6-faa-biler', level:'A2', pattern:'faa-lidt', context:'Der holdt kun ___ biler på pladsen.', options:['få','lidt'], correct:'få', note:'Biler er tælleligt: få biler.' },
    { id:'b6-lidt-broed', level:'A2', pattern:'faa-lidt', context:'Vi har kun ___ brød tilbage.', options:['lidt','få'], correct:'lidt', note:'Brød er utælleligt her: lidt brød.' },
    { id:'b6-faa-elever', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ elever i klassen i dag.', options:['få','lidt'], correct:'få', note:'Elever er tælleligt: få elever.' },
    { id:'b6-lidt-salt', level:'A2', pattern:'faa-lidt', context:'Kom kun ___ salt i.', options:['lidt','få'], correct:'lidt', note:'Salt er utælleligt: lidt salt.' },
    { id:'b6-faa-timer', level:'A2', pattern:'faa-lidt', context:'Vi har kun ___ timer tilbage.', options:['få','lidt'], correct:'få', note:'Timer er tælleligt: få timer.' },
    { id:'b6-lidt-snee', level:'A2', pattern:'faa-lidt', context:'Der faldt kun ___ sne i nat.', options:['lidt','få'], correct:'lidt', note:'Sne er utælleligt: lidt sne.' },
    { id:'b6-faa-penge', level:'A2', pattern:'faa-lidt', context:'Jeg har kun ___ penge med.', options:['få','lidt'], correct:'få', note:'Penge er flertal og tælles: få penge.' },
    { id:'b6-lidt-mad', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ mad i køleskabet.', options:['lidt','få'], correct:'lidt', note:'Mad er utælleligt: lidt mad.' },
    { id:'b6-faa-dage', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ dage til ferien.', options:['få','lidt'], correct:'få', note:'Dage er tælleligt: få dage.' },
    { id:'b6-lidt-te', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ te tilbage i kanden.', options:['lidt','få'], correct:'lidt', note:'Te er utælleligt: lidt te.' },
    { id:'b6-faa-spoergsmaal', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ spørgsmål til sidst.', options:['få','lidt'], correct:'få', note:'Spørgsmål er tælleligt: få spørgsmål.' },
    { id:'b6-lidt-plads', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ plads i skabet.', options:['lidt','få'], correct:'lidt', note:'Plads er utælleligt: lidt plads.' },
    { id:'b6-faa-huse', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ huse til salg lige nu.', options:['få','lidt'], correct:'få', note:'Huse er tælleligt: få huse.' },
    { id:'b6-lidt-regn', level:'A2', pattern:'faa-lidt', context:'Der kom kun ___ regn i dag.', options:['lidt','få'], correct:'lidt', note:'Regn er utælleligt: lidt regn.' },
    { id:'b6-faa-stole', level:'A2', pattern:'faa-lidt', context:'Der er kun ___ stole tilbage.', options:['få','lidt'], correct:'få', note:'Stole er tælleligt: få stole.' },
    { id:'b6-lidt-hjaelp', level:'A2', pattern:'faa-lidt', context:'Jeg fik kun ___ hjælp.', options:['lidt','få'], correct:'lidt', note:'Hjælp er utælleligt: lidt hjælp.' },
    { id:'b6-faa-aebler', level:'A2', pattern:'faa-lidt', context:'Der var kun ___ æbler tilbage på træet.', options:['få','lidt'], correct:'få', note:'Æbler er tælleligt: få æbler.' },
    // --- flere / mere (extra) ---
    { id:'b6-flere-boeger', level:'A2', pattern:'flere-mere', context:'Jeg vil gerne læse ___ bøger til sommer.', options:['flere','mere'], correct:'flere', note:'Bøger er tælleligt: flere bøger.' },
    { id:'b6-mere-tid', level:'A2', pattern:'flere-mere', context:'Vi har brug for ___ tid til opgaven.', options:['mere','flere'], correct:'mere', note:'Tid er utælleligt: mere tid.' },
    { id:'b6-flere-venner', level:'A2', pattern:'flere-mere', context:'Hun har fået ___ venner efter flytningen.', options:['flere','mere'], correct:'flere', note:'Venner er tælleligt: flere venner.' },
    { id:'b6-mere-mad', level:'A2', pattern:'flere-mere', context:'Er der ___ mad tilbage?', options:['mere','flere'], correct:'mere', note:'Mad er utælleligt: mere mad.' },
    { id:'b6-flere-timer', level:'B1', pattern:'flere-mere', context:'Han vil gerne arbejde ___ timer.', options:['flere','mere'], correct:'flere', note:'Timer er tælleligt: flere timer.' },
    { id:'b6-mere-sukker', level:'A2', pattern:'flere-mere', context:'Kagen skal have ___ sukker.', options:['mere','flere'], correct:'mere', note:'Sukker er utælleligt: mere sukker.' },
    { id:'b6-flere-elever', level:'B1', pattern:'flere-mere', context:'Skolen har fået ___ elever i år.', options:['flere','mere'], correct:'flere', note:'Elever er tælleligt: flere elever.' },
    { id:'b6-mere-maelk', level:'A2', pattern:'flere-mere', context:'Vi skal købe ___ mælk.', options:['mere','flere'], correct:'mere', note:'Mælk er utælleligt: mere mælk.' },
    { id:'b6-flere-detaljer', level:'B1', pattern:'flere-mere', context:'Kan du give mig ___ detaljer?', options:['flere','mere'], correct:'flere', note:'Detaljer er tælleligt: flere detaljer.' },
    { id:'b6-mere-salt', level:'A2', pattern:'flere-mere', context:'Suppen mangler ___ salt.', options:['mere','flere'], correct:'mere', note:'Salt er utælleligt: mere salt.' },
    { id:'b6-flere-biler', level:'B1', pattern:'flere-mere', context:'Der kommer ___ biler på vejene hvert år.', options:['flere','mere'], correct:'flere', note:'Biler er tælleligt: flere biler.' },
    { id:'b6-mere-plads', level:'A2', pattern:'flere-mere', context:'Vi har brug for ___ plads.', options:['mere','flere'], correct:'mere', note:'Plads er utælleligt: mere plads.' },
    { id:'b6-flere-spoergsmaal', level:'B1', pattern:'flere-mere', context:'Har I ___ spørgsmål?', options:['flere','mere'], correct:'flere', note:'Spørgsmål er tælleligt: flere spørgsmål.' },
    { id:'b6-mere-information', level:'B1', pattern:'flere-mere', context:'Jeg har brug for ___ information om kurset.', options:['mere','flere'], correct:'mere', note:'Information er utælleligt: mere information.' },
    { id:'b6-flere-dage', level:'A2', pattern:'flere-mere', context:'Kan vi blive ___ dage?', options:['flere','mere'], correct:'flere', note:'Dage er tælleligt: flere dage.' },
    { id:'b6-mere-te', level:'A2', pattern:'flere-mere', context:'Vil du have ___ te?', options:['mere','flere'], correct:'mere', note:'Te er utælleligt: mere te.' },
    { id:'b6-flere-huse', level:'B1', pattern:'flere-mere', context:'Der skal bygges ___ huse.', options:['flere','mere'], correct:'flere', note:'Huse er tælleligt: flere huse.' },
    { id:'b6-mere-sne', level:'A2', pattern:'flere-mere', context:'Der kommer ___ sne i morgen.', options:['mere','flere'], correct:'mere', note:'Sne er utælleligt: mere sne.' },
    { id:'b6-flere-lande', level:'B1', pattern:'flere-mere', context:'Hun vil gerne besøge ___ lande.', options:['flere','mere'], correct:'flere', note:'Lande er tælleligt: flere lande.' },
    // --- færre / mindre (extra) ---
    { id:'b6-mindre-sukker', level:'B1', pattern:'faerre-mindre', context:'Prøv at spise ___ sukker.', options:['mindre','færre'], correct:'mindre', note:'Sukker er utælleligt: mindre sukker.' },
    { id:'b6-faerre-fejl', level:'B1', pattern:'faerre-mindre', context:'Jeg laver ___ fejl nu end før.', options:['færre','mindre'], correct:'færre', note:'Fejl er tælleligt: færre fejl.' },
    { id:'b6-mindre-salt', level:'B1', pattern:'faerre-mindre', context:'Læger anbefaler ___ salt i maden.', options:['mindre','færre'], correct:'mindre', note:'Salt er utælleligt: mindre salt.' },
    { id:'b6-faerre-elever', level:'B1', pattern:'faerre-mindre', context:'Der er ___ elever i klassen i år.', options:['færre','mindre'], correct:'færre', note:'Elever er tælleligt: færre elever.' },
    { id:'b6-mindre-tid', level:'B1', pattern:'faerre-mindre', context:'Jeg har ___ tid nu end tidligere.', options:['mindre','færre'], correct:'mindre', note:'Tid er utælleligt: mindre tid.' },
    { id:'b6-faerre-timer', level:'B1', pattern:'faerre-mindre', context:'Han arbejder ___ timer om ugen nu.', options:['færre','mindre'], correct:'færre', note:'Timer er tælleligt: færre timer.' },
    { id:'b6-mindre-mad', level:'B1', pattern:'faerre-mindre', context:'Vi smider ___ mad ud end før.', options:['mindre','færre'], correct:'mindre', note:'Mad er utælleligt: mindre mad.' },
    { id:'b6-faerre-turister', level:'B1', pattern:'faerre-mindre', context:'Der kom ___ turister i år.', options:['færre','mindre'], correct:'færre', note:'Turister er tælleligt: færre turister.' },
    { id:'b6-mindre-koed', level:'B1', pattern:'faerre-mindre', context:'Han spiser ___ kød end før.', options:['mindre','færre'], correct:'mindre', note:'Kød er utælleligt: mindre kød.' },
    { id:'b6-faerre-boeger', level:'B1', pattern:'faerre-mindre', context:'Folk læser ___ bøger i dag.', options:['færre','mindre'], correct:'færre', note:'Bøger er tælleligt: færre bøger.' },
    { id:'b6-mindre-benzin', level:'B1', pattern:'faerre-mindre', context:'Nye biler bruger ___ benzin.', options:['mindre','færre'], correct:'mindre', note:'Benzin er utælleligt: mindre benzin.' },
    { id:'b6-faerre-penge', level:'B1', pattern:'faerre-mindre', context:'Vi har ___ penge til rådighed i år.', options:['færre','mindre'], correct:'færre', note:'Penge er flertal og tælles: færre penge.' },
    { id:'b6-mindre-regn', level:'B1', pattern:'faerre-mindre', context:'Der faldt ___ regn end normalt.', options:['mindre','færre'], correct:'mindre', note:'Regn er utælleligt: mindre regn.' },
    { id:'b6-faerre-ulykker', level:'B1', pattern:'faerre-mindre', context:'Der sker ___ ulykker på den nye vej.', options:['færre','mindre'], correct:'færre', note:'Ulykker er tælleligt: færre ulykker.' },
    { id:'b6-mindre-plads', level:'B1', pattern:'faerre-mindre', context:'Den nye lejlighed har ___ plads.', options:['mindre','færre'], correct:'mindre', note:'Plads er utælleligt: mindre plads.' },
    { id:'b6-faerre-gaester', level:'B1', pattern:'faerre-mindre', context:'Der kom ___ gæster end forventet.', options:['færre','mindre'], correct:'færre', note:'Gæster er tælleligt: færre gæster.' },
    { id:'b6-mindre-stress', level:'B1', pattern:'faerre-mindre', context:'Hun har ___ stress i det nye job.', options:['mindre','færre'], correct:'mindre', note:'Stress er utælleligt: mindre stress.' },
    // --- al / alt / alle (extra) ---
    { id:'b6-alle-gaester', level:'A2', pattern:'al-alt-alle', context:'___ gæsterne var kommet til tiden.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle gæster.' },
    { id:'b6-al-tiden', level:'A2', pattern:'al-alt-alle', context:'Han brugte ___ tiden på at læse.', options:['al','alt','alle'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al tiden.' },
    { id:'b6-alt-melet', level:'A2', pattern:'al-alt-alle', context:'___ melet blev brugt til brødet.', options:['Alt','Al','Alle'], correct:'Alt', note:'Alt bruges om utælleligt intetkøn: alt melet.' },
    { id:'b6-alle-elever', level:'A2', pattern:'al-alt-alle', context:'___ eleverne bestod prøven.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle elever.' },
    { id:'b6-al-kaffen', level:'A2', pattern:'al-alt-alle', context:'Hun drak ___ kaffen selv.', options:['al','alt','alle'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al kaffen.' },
    { id:'b6-alt-arbejdet', level:'A2', pattern:'al-alt-alle', context:'Han lavede ___ arbejdet selv.', options:['alt','al','alle'], correct:'alt', note:'Alt bruges om utælleligt intetkøn: alt arbejdet.' },
    { id:'b6-alle-boeger', level:'A2', pattern:'al-alt-alle', context:'___ bøgerne stod på hylden.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle bøger.' },
    { id:'b6-al-maelken', level:'A2', pattern:'al-alt-alle', context:'Katten drak ___ mælken.', options:['al','alt','alle'], correct:'al', note:'Al bruges om utælleligt fælleskøn: al mælken.' },
    { id:'b6-alt-broedet', level:'A2', pattern:'al-alt-alle', context:'Vi spiste ___ brødet.', options:['alt','al','alle'], correct:'alt', note:'Alt bruges om utælleligt intetkøn: alt brødet.' },
    { id:'b6-alle-biler', level:'B1', pattern:'al-alt-alle', context:'___ bilerne var parkeret udenfor.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle biler.' },
    { id:'b6-alt-sukkeret', level:'A2', pattern:'al-alt-alle', context:'Han brugte ___ sukkeret.', options:['alt','al','alle'], correct:'alt', note:'Sukker er intetkøn og utælleligt: alt sukkeret.' },
    { id:'b6-al-vinen', level:'B1', pattern:'al-alt-alle', context:'Gæsterne drak ___ vinen.', options:['al','alt','alle'], correct:'al', note:'Vin er fælleskøn og utælleligt: al vinen.' },
    { id:'b6-alt-saltet', level:'A2', pattern:'al-alt-alle', context:'Hun kom ___ saltet i gryden.', options:['alt','al','alle'], correct:'alt', note:'Salt er intetkøn og utælleligt: alt saltet.' },
    { id:'b6-alle-venner', level:'A2', pattern:'al-alt-alle', context:'___ mine venner kom til festen.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle mine venner.' },
    { id:'b6-al-energien', level:'B1', pattern:'al-alt-alle', context:'Han brugte ___ sin energi på projektet.', options:['al','alt','alle'], correct:'al', note:'Energi er fælleskøn og utælleligt: al sin energi.' },
    { id:'b6-alt-koedet', level:'B1', pattern:'al-alt-alle', context:'Hunden spiste ___ kødet.', options:['alt','al','alle'], correct:'alt', note:'Kød er intetkøn og utælleligt: alt kødet.' },
    { id:'b6-alle-huse', level:'B1', pattern:'al-alt-alle', context:'___ husene i gaden er gamle.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle huse.' },
    { id:'b6-al-pladsen', level:'B1', pattern:'al-alt-alle', context:'Møblerne tog ___ pladsen op.', options:['al','alt','alle'], correct:'al', note:'Plads er fælleskøn og utælleligt: al pladsen.' },
    { id:'b6-alt-godt', level:'A2', pattern:'al-alt-alle', context:'Bare rolig, ___ er godt.', options:['alt','al','alle'], correct:'alt', note:'Alt står alene om noget abstrakt: alt er godt.' },
    { id:'b6-alle-laerere', level:'A2', pattern:'al-alt-alle', context:'___ lærerne var til møde.', options:['Alle','Al','Alt'], correct:'Alle', note:'Alle bruges om tælleligt flertal: alle lærere.' },
    { id:'b6-al-musikken', level:'B1', pattern:'al-alt-alle', context:'___ musikken kom fra én højttaler.', options:['Al','Alt','Alle'], correct:'Al', note:'Musik er fælleskøn og utælleligt: al musikken.' },
    { id:'b6-alt-vaek', level:'B1', pattern:'al-alt-alle', context:'Da vi kom hjem, var ___ væk.', options:['alt','al','alle'], correct:'alt', note:'Alt står alene om en samlet mængde: alt var væk.' },
    // --- hver / hvert (extra) ---
    { id:'b6-hver-morgen', level:'A2', pattern:'hver-hvert', context:'Hun løber en tur ___ morgen.', options:['hver','hvert'], correct:'hver', note:'Morgen er en-ord: hver morgen.' },
    { id:'b6-hvert-vaerelse', level:'A2', pattern:'hver-hvert', context:'___ værelse har sit eget bad.', options:['Hvert','Hver'], correct:'Hvert', note:'Værelse er et-ord: hvert værelse.' },
    { id:'b6-hver-gang', level:'A2', pattern:'hver-hvert', context:'___ gang jeg ser filmen, græder jeg.', options:['Hver','Hvert'], correct:'Hver', note:'Gang er en-ord: hver gang.' },
    { id:'b6-hvert-hus', level:'A2', pattern:'hver-hvert', context:'___ hus i gaden har en have.', options:['Hvert','Hver'], correct:'Hvert', note:'Hus er et-ord: hvert hus.' },
    { id:'b6-hver-time', level:'A2', pattern:'hver-hvert', context:'Vi holder pause ___ time.', options:['hver','hvert'], correct:'hver', note:'Time er en-ord: hver time.' },
    { id:'b6-hvert-land', level:'A2', pattern:'hver-hvert', context:'___ land har sit eget flag.', options:['Hvert','Hver'], correct:'Hvert', note:'Land er et-ord: hvert land.' },
    { id:'b6-hver-maaned', level:'A2', pattern:'hver-hvert', context:'Jeg betaler husleje ___ måned.', options:['hver','hvert'], correct:'hver', note:'Måned er en-ord: hver måned.' },
    { id:'b6-hvert-brev', level:'A2', pattern:'hver-hvert', context:'___ brev blev læst højt.', options:['Hvert','Hver'], correct:'Hvert', note:'Brev er et-ord: hvert brev.' },
    { id:'b6-hver-elev', level:'A2', pattern:'hver-hvert', context:'___ elev fik en bog.', options:['Hver','Hvert'], correct:'Hver', note:'Elev er en-ord: hver elev.' },
    { id:'b6-hvert-spoergsmaal', level:'B1', pattern:'hver-hvert', context:'___ spørgsmål gav ét point.', options:['Hvert','Hver'], correct:'Hvert', note:'Spørgsmål er et-ord: hvert spørgsmål.' },
    { id:'b6-hver-gaest', level:'A2', pattern:'hver-hvert', context:'___ gæst fik et glas vin.', options:['Hver','Hvert'], correct:'Hver', note:'Gæst er en-ord: hver gæst.' },
    { id:'b6-hvert-bord', level:'A2', pattern:'hver-hvert', context:'Der stod blomster på ___ bord.', options:['hvert','hver'], correct:'hvert', note:'Bord er et-ord: hvert bord.' },
    { id:'b6-hver-aften', level:'A2', pattern:'hver-hvert', context:'Vi ser nyhederne ___ aften.', options:['hver','hvert'], correct:'hver', note:'Aften er en-ord: hver aften.' },
    { id:'b6-hvert-aeg', level:'A2', pattern:'hver-hvert', context:'___ æg blev kogt i ti minutter.', options:['Hvert','Hver'], correct:'Hvert', note:'Æg er et-ord: hvert æg.' },
    { id:'b6-hver-sommer', level:'A2', pattern:'hver-hvert', context:'De tager til Italien ___ sommer.', options:['hver','hvert'], correct:'hver', note:'Sommer er en-ord: hver sommer.' },
    { id:'b6-hvert-medlem', level:'B1', pattern:'hver-hvert', context:'___ medlem betaler kontingent.', options:['Hvert','Hver'], correct:'Hvert', note:'Medlem er et-ord: hvert medlem.' },
    { id:'b6-hver-bil', level:'B1', pattern:'hver-hvert', context:'___ bil skal synes hvert år.', options:['Hver','Hvert'], correct:'Hver', note:'Bil er en-ord: hver bil.' },
    { id:'b6-hvert-punkt', level:'B1', pattern:'hver-hvert', context:'___ punkt på listen er vigtigt.', options:['Hvert','Hver'], correct:'Hvert', note:'Punkt er et-ord: hvert punkt.' },
    { id:'b6-hver-kvinde', level:'B1', pattern:'hver-hvert', context:'___ kvinde i rummet nikkede.', options:['Hver','Hvert'], correct:'Hver', note:'Kvinde er en-ord: hver kvinde.' },
    { id:'b6-hvert-svar', level:'B1', pattern:'hver-hvert', context:'___ svar tæller.', options:['Hvert','Hver'], correct:'Hvert', note:'Svar er et-ord: hvert svar.' },
    // --- begge (extra) ---
    { id:'b6-begge-boern', level:'A2', pattern:'begge', context:'Vi har to børn. ___ børn går i skole.', options:['Begge','Hver','Alle'], correct:'Begge', note:'Begge bruges om præcis to: begge børn.' },
    { id:'b6-begge-biler', level:'A2', pattern:'begge', context:'Vi har to biler. ___ biler er røde.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Begge bruges om præcis to: begge biler.' },
    { id:'b6-begge-oejne', level:'A2', pattern:'begge', context:'Han lukkede ___ øjne.', options:['begge','alle','hver'], correct:'begge', note:'Man har to øjne, så begge bruges: begge øjne.' },
    { id:'b6-begge-lande', level:'B1', pattern:'begge', context:'Der var to lande ved bordet. ___ lande underskrev aftalen.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Begge bruges om præcis to: begge lande.' },
    { id:'b6-begge-broedre', level:'A2', pattern:'begge', context:'Jeg har to brødre. ___ mine brødre bor i Aarhus.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Begge bruges om præcis to: begge mine brødre.' },
    { id:'b6-begge-foedder', level:'A2', pattern:'begge', context:'Hun stod på ___ fødder.', options:['begge','alle','hver'], correct:'begge', note:'Man har to fødder, så begge bruges: begge fødder.' },
    { id:'b6-begge-muligheder', level:'B1', pattern:'begge', context:'Der var to muligheder. Vi overvejede ___ muligheder.', options:['begge','alle','hver'], correct:'begge', note:'Der var to muligheder: begge muligheder.' },
    { id:'b6-begge-boeger', level:'A2', pattern:'begge', context:'Jeg har lånt to bøger. Jeg har læst ___ bøger.', options:['begge','alle','hver'], correct:'begge', note:'Der er tale om to bøger: begge bøger.' },
    { id:'b6-begge-veje', level:'B1', pattern:'begge', context:'Der er to veje til byen. Man kan køre ___ veje.', options:['begge','alle','hver'], correct:'begge', note:'Der er to veje: begge veje.' },
    { id:'b6-begge-piger', level:'A2', pattern:'begge', context:'Der var to piger i finalen. ___ piger vandt en medalje.', options:['Begge','Alle','Hver'], correct:'Begge', note:'Der er tale om to piger: begge piger.' },
    { id:'b6-begge-svar', level:'B1', pattern:'begge', context:'Der er to svar i opgaven. ___ svar er rigtige.', options:['Begge','Alle','Hvert'], correct:'Begge', note:'Der er to svar: begge svar.' },
    { id:'b6-begge-sider', level:'B1', pattern:'begge', context:'Skriv på ___ sider af papiret.', options:['begge','alle','hver'], correct:'begge', note:'Papiret har to sider: begge sider.' },
    // --- ingen / intet (extra) ---
    { id:'b6-ingen-tid', level:'A2', pattern:'ingen-intet', context:'Jeg har ___ tid i dag.', options:['ingen','intet'], correct:'ingen', note:'Tid er fælleskøn: ingen tid.' },
    { id:'b6-intet-hus', level:'B1', pattern:'ingen-intet', context:'Der var ___ hus at se i miles omkreds.', options:['intet','ingen'], correct:'intet', note:'Hus er et-ord: intet hus.' },
    { id:'b6-ingen-penge', level:'A2', pattern:'ingen-intet', context:'Han har ___ penge tilbage.', options:['ingen','intet'], correct:'ingen', note:'Penge er flertal: ingen penge.' },
    { id:'b6-intet-brev', level:'B1', pattern:'ingen-intet', context:'Der lå ___ brev i postkassen.', options:['intet','ingen'], correct:'intet', note:'Brev er et-ord: intet brev.' },
    { id:'b6-ingen-kaffe', level:'A2', pattern:'ingen-intet', context:'Der er ___ kaffe tilbage.', options:['ingen','intet'], correct:'ingen', note:'Kaffe er fælleskøn: ingen kaffe.' },
    { id:'b6-intet-ord', level:'B1', pattern:'ingen-intet', context:'Der lå ___ æble tilbage i kurven.', options:['intet','ingen'], correct:'intet', note:'Æble er et-ord: intet æble.' },
    { id:'b6-ingen-biler', level:'A2', pattern:'ingen-intet', context:'Der holdt ___ biler på vejen.', options:['ingen','intet'], correct:'ingen', note:'Biler er flertal: ingen biler.' },
    { id:'b6-intet-haab', level:'B1', pattern:'ingen-intet', context:'Der var ___ håb tilbage.', options:['intet','ingen'], correct:'intet', note:'Håb er et-ord: intet håb.' },
    { id:'b6-ingen-gaester', level:'A2', pattern:'ingen-intet', context:'Der kom ___ gæster til festen.', options:['ingen','intet'], correct:'ingen', note:'Gæster er flertal: ingen gæster.' },
    { id:'b6-intet-valg', level:'B1', pattern:'ingen-intet', context:'Der var ___ værelse ledigt på hotellet.', options:['intet','ingen'], correct:'intet', note:'Værelse er et-ord: intet værelse.' },
    { id:'b6-ingen-hjaelp', level:'A2', pattern:'ingen-intet', context:'Han fik ___ hjælp fra naboerne.', options:['ingen','intet'], correct:'ingen', note:'Hjælp er fælleskøn: ingen hjælp.' },
    { id:'b6-intet-barn', level:'B1', pattern:'ingen-intet', context:'Der var ___ barn på legepladsen.', options:['intet','ingen'], correct:'intet', note:'Barn er et-ord: intet barn.' },
    { id:'b6-ingen-plads', level:'A2', pattern:'ingen-intet', context:'Der er ___ plads i bilen.', options:['ingen','intet'], correct:'ingen', note:'Plads er fælleskøn: ingen plads.' },
    { id:'b6-intet-lys', level:'B1', pattern:'ingen-intet', context:'Der hang ___ billede på væggen.', options:['intet','ingen'], correct:'intet', note:'Billede er et-ord: intet billede.' },
    { id:'b6-ingen-venner', level:'A2', pattern:'ingen-intet', context:'Han havde ___ venner på den nye skole.', options:['ingen','intet'], correct:'ingen', note:'Venner er flertal: ingen venner.' },
    { id:'b6-intet-arbejde', level:'B1', pattern:'ingen-intet', context:'Der var ___ arbejde at få.', options:['intet','ingen'], correct:'intet', note:'Arbejde er et-ord: intet arbejde.' },
    { id:'b6-ingen-forskel', level:'B1', pattern:'ingen-intet', context:'Det gør ___ forskel.', options:['ingen','intet'], correct:'ingen', note:'Forskel er fælleskøn: ingen forskel.' },
    { id:'b6-intet-navn', level:'B1', pattern:'ingen-intet', context:'Der stod ___ navn på døren.', options:['intet','ingen'], correct:'intet', note:'Navn er et-ord: intet navn.' },
    { id:'b6-ingen-svarede', level:'A2', pattern:'ingen-intet', context:'Jeg ringede, men ___ svarede.', options:['ingen','intet'], correct:'ingen', note:'Ingen bruges om personer: ingen svarede.' },
    { id:'b6-intet-tegn', level:'B1', pattern:'ingen-intet', context:'Han har ___ talent.', options:['intet','ingen'], correct:'intet', note:'Talent er et-ord: intet talent.' },
    // --- nogen / nogle / noget (extra) ---
    { id:'b6-noget-mad', level:'A2', pattern:'nogen-nogle-noget', context:'Vil du have ___ mad?', options:['noget','nogle','nogen'], correct:'noget', note:'Mad er utælleligt: noget mad.' },
    { id:'b6-nogle-boeger', level:'A2', pattern:'nogen-nogle-noget', context:'Han købte ___ bøger i går.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle bøger.' },
    { id:'b6-nogen-spurgt', level:'A2', pattern:'nogen-nogle-noget', context:'Har ___ spurgt efter mig?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges i spørgsmål om en person: har nogen spurgt?' },
    { id:'b6-noget-te', level:'A2', pattern:'nogen-nogle-noget', context:'Skal jeg lave ___ te?', options:['noget','nogle','nogen'], correct:'noget', note:'Te er utælleligt: noget te.' },
    { id:'b6-nogle-elever', level:'A2', pattern:'nogen-nogle-noget', context:'___ elever var syge i dag.', options:['Nogle','Nogen','Noget'], correct:'Nogle', note:'Nogle bruges om et tælleligt flertal: nogle elever.' },
    { id:'b6-nogen-peter', level:'A2', pattern:'nogen-nogle-noget', context:'Har du set ___ til Peter?', options:['nogen','nogle','noget'], correct:'noget', note:'Fast udtryk: se noget til nogen.' },
    { id:'b6-noget-sukker', level:'A2', pattern:'nogen-nogle-noget', context:'Kom ___ sukker i, tak.', options:['noget','nogle','nogen'], correct:'noget', note:'Sukker er utælleligt: noget sukker.' },
    { id:'b6-nogle-dage', level:'A2', pattern:'nogen-nogle-noget', context:'Vi bliver ___ dage i Berlin.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle dage.' },
    { id:'b6-nogen-ringet', level:'A2', pattern:'nogen-nogle-noget', context:'Har der været ___ og ringet?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges i spørgsmål om en person: været nogen.' },
    { id:'b6-noget-broed', level:'A2', pattern:'nogen-nogle-noget', context:'Er der ___ brød tilbage?', options:['noget','nogle','nogen'], correct:'noget', note:'Brød er utælleligt her: noget brød.' },
    { id:'b6-nogle-blomster', level:'A2', pattern:'nogen-nogle-noget', context:'Hun plukkede ___ blomster.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle blomster.' },
    { id:'b6-noget-arbejde', level:'B1', pattern:'nogen-nogle-noget', context:'Har du ___ arbejde til mig?', options:['noget','nogle','nogen'], correct:'noget', note:'Arbejde er utælleligt: noget arbejde.' },
    { id:'b6-nogle-timer', level:'A2', pattern:'nogen-nogle-noget', context:'Vi ventede ___ timer.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle timer.' },
    { id:'b6-nogen-hjaelpe', level:'A2', pattern:'nogen-nogle-noget', context:'Er der ___, der kan hjælpe?', options:['nogen','nogle','noget'], correct:'nogen', note:'Nogen bruges om en ubestemt person: nogen der kan hjælpe.' },
    { id:'b6-noget-salt', level:'A2', pattern:'nogen-nogle-noget', context:'Mangler der ___ salt?', options:['noget','nogle','nogen'], correct:'noget', note:'Salt er utælleligt: noget salt.' },
    { id:'b6-nogle-huse', level:'B1', pattern:'nogen-nogle-noget', context:'___ huse i gaden er til salg.', options:['Nogle','Nogen','Noget'], correct:'Nogle', note:'Nogle bruges om et tælleligt flertal: nogle huse.' },
    { id:'b6-nogen-penge', level:'A2', pattern:'nogen-nogle-noget', context:'Har du ___ penge på dig?', options:['nogen','nogle','noget'], correct:'nogen', note:'I spørgsmål bruges nogen om penge: har du nogen penge?' },
    { id:'b6-noget-maelk', level:'A2', pattern:'nogen-nogle-noget', context:'Der er vist ___ mælk i køleskabet.', options:['noget','nogle','nogen'], correct:'noget', note:'Mælk er utælleligt: noget mælk.' },
    { id:'b6-nogle-spoergsmaal', level:'B1', pattern:'nogen-nogle-noget', context:'Jeg har ___ spørgsmål.', options:['nogle','nogen','noget'], correct:'nogle', note:'Nogle bruges om et tælleligt flertal: nogle spørgsmål.' },
    { id:'b6-noget-galt', level:'B1', pattern:'nogen-nogle-noget', context:'Er der ___ galt?', options:['noget','nogen','nogle'], correct:'noget', note:'Noget bruges om noget abstrakt/utælleligt: noget galt.' },
    { id:'b6-nogle-lande', level:'B1', pattern:'nogen-nogle-noget', context:'___ lande har ikke underskrevet.', options:['Nogle','Nogen','Noget'], correct:'Nogle', note:'Nogle bruges om et tælleligt flertal: nogle lande.' },
    // --- hverken ... eller ---
    { id:'b6-hverken-kaffe-te', level:'A2', pattern:'hverken', context:'Jeg tåler ikke koffein. Jeg drikker ___ kaffe eller te.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken bruges sammen med eller ved negation: hverken kaffe eller te.' },
    { id:'b6-hverken-han-hun', level:'B1', pattern:'hverken', context:'Ingen af dem dukkede op. ___ han eller hun kom til mødet.', options:['Hverken','Enten','Både'], correct:'Hverken', note:'Hverken ... eller udtrykker negation af begge: hverken han eller hun.' },
    { id:'b6-hverken-tid-lyst', level:'B1', pattern:'hverken', context:'Jeg har ___ tid eller lyst.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken tid eller lyst.' },
    { id:'b6-hverken-penge-tid', level:'B1', pattern:'hverken', context:'Vi har ___ penge eller tid.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken penge eller tid.' },
    { id:'b6-hverken-set-hoert', level:'B1', pattern:'hverken', context:'Jeg har ___ set eller hørt fra ham.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken set eller hørt.' },
    { id:'b6-hverken-stor-lille', level:'B1', pattern:'hverken', context:'Huset er ___ stort eller lille.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken stort eller lille.' },
    { id:'b6-hverken-mor-far', level:'B1', pattern:'hverken', context:'Ingen af mine forældre kender til det. ___ min mor eller far ved det.', options:['Hverken','Enten','Både'], correct:'Hverken', note:'Hverken ... eller: hverken mor eller far.' },
    { id:'b6-hverken-regn-sne', level:'B1', pattern:'hverken', context:'Det var tørt hele ugen. Der faldt ___ regn eller sne.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken regn eller sne.' },
    { id:'b6-hverken-ja-nej', level:'B1', pattern:'hverken', context:'Han sagde ___ ja eller nej.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken ja eller nej.' },
    { id:'b6-hverken-laese-skrive', level:'B1', pattern:'hverken', context:'Barnet kan ___ læse eller skrive endnu.', options:['hverken','enten','både'], correct:'hverken', note:'Hverken ... eller: hverken læse eller skrive.' }
  ];

  window.BOEJNINGS_DATA = {
    fire_former: buildFireFormer(),
    byg_navneordet: buildByg(),
    adjektivvaerkstedet: buildAdjektiv(),
    sammenligningspressen: buildSammenligning(),
    bestemt_ubestemt: BESTEMT_UBESTEMT,
    maengdevaerkstedet: MAENGDE
  };
})();
