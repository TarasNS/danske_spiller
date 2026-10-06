// shared/data/nouns.js
// Canonical Danish noun dataset. Exports window.DANSK_NOUNS.
// Schema (see prd.md § 1.3):
// { id, level, base, gender, indefinite_singular, definite_singular,
//   indefinite_plural, definite_plural, plural_pattern, note, example, tags, verify }
// plural_pattern in: er | e | zero | umlaut-er | irregular | foreign
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

  // Builder for nouns whose definite forms follow the regular mechanical
  // rules cleanly (no consonant-doubling or vowel-elision surprises).
  function noun(level, base, gender, indefinitePlural, pattern, note, example, tags, verify) {
    var isEn = gender === 'en';
    var defSingular = /e$/.test(base) ? base + (isEn ? 'n' : 't') : base + (isEn ? 'en' : 'et');
    var defPlural = /er$/.test(base) && indefinitePlural === base + 'e' ? base + 'ne' : (/(e|er)$/.test(indefinitePlural) ? indefinitePlural + 'ne' : indefinitePlural + 'ene'); // -er agent nouns: lærer → lærere → lærerne (not -erene)
    return {
      id: slug(base),
      level: level,
      base: base,
      gender: gender,
      indefinite_singular: (isEn ? 'en ' : 'et ') + base,
      definite_singular: defSingular,
      indefinite_plural: indefinitePlural,
      definite_plural: defPlural,
      plural_pattern: pattern,
      note: note,
      example: example,
      tags: tags || [],
      verify: !!verify
    };
  }

  // Fully explicit entries for nouns with irregular stems, umlaut plurals,
  // zero plurals, or consonant doubling that the mechanical builder above
  // cannot derive safely.
  var MANUAL = [
    { id: 'mand', level: 'A1', base: 'mand', gender: 'en', indefinite_singular: 'en mand', definite_singular: 'manden', indefinite_plural: 'mænd', definite_plural: 'mændene', plural_pattern: 'irregular', note: 'Mand har uregelmæssigt flertal med vokalskifte: mand → mænd.', example: 'Mændene arbejder i haven.', tags: ['family'], verify: false },
    { id: 'barn', level: 'A1', base: 'barn', gender: 'et', indefinite_singular: 'et barn', definite_singular: 'barnet', indefinite_plural: 'børn', definite_plural: 'børnene', plural_pattern: 'irregular', note: 'Barn danner flertal med vokalskifte: barn → børn, ikke *barner.', example: 'Børnene leger i parken.', tags: ['family'], verify: false },
    { id: 'bror', level: 'A1', base: 'bror', gender: 'en', indefinite_singular: 'en bror', definite_singular: 'broren', indefinite_plural: 'brødre', definite_plural: 'brødrene', plural_pattern: 'irregular', note: 'Bror har uregelmæssigt flertal: bror → brødre.', example: 'Mine brødre bor i København.', tags: ['family'], verify: false },
    { id: 'mor', level: 'A1', base: 'mor', gender: 'en', indefinite_singular: 'en mor', definite_singular: 'moren', indefinite_plural: 'mødre', definite_plural: 'mødrene', plural_pattern: 'irregular', note: 'Mor har uregelmæssigt flertal: mor → mødre.', example: 'Mødrene henter børnene fra skole.', tags: ['family'], verify: false },
    { id: 'far', level: 'A1', base: 'far', gender: 'en', indefinite_singular: 'en far', definite_singular: 'faren', indefinite_plural: 'fædre', definite_plural: 'fædrene', plural_pattern: 'irregular', note: 'Far har uregelmæssigt flertal: far → fædre.', example: 'Fædrene mødtes til forældremøde.', tags: ['family'], verify: false },
    { id: 'soester', level: 'A1', base: 'søster', gender: 'en', indefinite_singular: 'en søster', definite_singular: 'søsteren', indefinite_plural: 'søstre', definite_plural: 'søstrene', plural_pattern: 'irregular', note: 'Søster mister sit sidste e i flertal: søster → søstre.', example: 'Søstrene ligner hinanden meget.', tags: ['family'], verify: false },
    { id: 'datter', level: 'A1', base: 'datter', gender: 'en', indefinite_singular: 'en datter', definite_singular: 'datteren', indefinite_plural: 'døtre', definite_plural: 'døtrene', plural_pattern: 'irregular', note: 'Datter har uregelmæssigt flertal med vokalskifte: datter → døtre.', example: 'Døtrene hjælper deres mor.', tags: ['family'], verify: false },
    { id: 'soen', level: 'A1', base: 'søn', gender: 'en', indefinite_singular: 'en søn', definite_singular: 'sønnen', indefinite_plural: 'sønner', definite_plural: 'sønnerne', plural_pattern: 'er', note: 'Søn fordobler konsonanten foran endelsen: søn → sønnen, sønner.', example: 'Sønnerne spiller fodbold sammen.', tags: ['family'], verify: false },
    { id: 'ven', level: 'A1', base: 'ven', gender: 'en', indefinite_singular: 'en ven', definite_singular: 'vennen', indefinite_plural: 'venner', definite_plural: 'vennerne', plural_pattern: 'er', note: 'Ven fordobler konsonanten foran endelsen: ven → vennen, venner.', example: 'Vennerne mødes hver fredag.', tags: ['family'], verify: false },
    { id: 'fod', level: 'A1', base: 'fod', gender: 'en', indefinite_singular: 'en fod', definite_singular: 'foden', indefinite_plural: 'fødder', definite_plural: 'fødderne', plural_pattern: 'umlaut-er', note: 'Fod danner flertal med vokalskifte og -er: fod → fødder.', example: 'Fødderne er kolde om vinteren.', tags: ['body'], verify: false },
    { id: 'haand', level: 'A1', base: 'hånd', gender: 'en', indefinite_singular: 'en hånd', definite_singular: 'hånden', indefinite_plural: 'hænder', definite_plural: 'hænderne', plural_pattern: 'umlaut-er', note: 'Hånd danner flertal med vokalskifte og -er: hånd → hænder.', example: 'Hænderne var beskidte efter arbejdet.', tags: ['body'], verify: false },
    { id: 'tand', level: 'A1', base: 'tand', gender: 'en', indefinite_singular: 'en tand', definite_singular: 'tanden', indefinite_plural: 'tænder', definite_plural: 'tænderne', plural_pattern: 'umlaut-er', note: 'Tand danner flertal med vokalskifte og -er: tand → tænder.', example: 'Tænderne skal børstes to gange om dagen.', tags: ['body'], verify: false },
    { id: 'oeje', level: 'A1', base: 'øje', gender: 'et', indefinite_singular: 'et øje', definite_singular: 'øjet', indefinite_plural: 'øjne', definite_plural: 'øjnene', plural_pattern: 'irregular', note: 'Øje har uregelmæssigt flertal: øje → øjne, ikke *øjer.', example: 'Øjnene lukkede sig af træthed.', tags: ['body'], verify: false },
    { id: 'oere', level: 'A1', base: 'øre', gender: 'et', indefinite_singular: 'et øre', definite_singular: 'øret', indefinite_plural: 'ører', definite_plural: 'ørerne', plural_pattern: 'er', note: 'Øre (kropsdel) får -er i flertal: øre → ører.', example: 'Ørerne blev røde af kulden.', tags: ['body'], verify: false },
    { id: 'bog', level: 'A1', base: 'bog', gender: 'en', indefinite_singular: 'en bog', definite_singular: 'bogen', indefinite_plural: 'bøger', definite_plural: 'bøgerne', plural_pattern: 'umlaut-er', note: 'Bog danner flertal med vokalskifte og -er: bog → bøger.', example: 'Bøgerne står på hylden.', tags: ['objects'], verify: false },
    { id: 'nat', level: 'A1', base: 'nat', gender: 'en', indefinite_singular: 'en nat', definite_singular: 'natten', indefinite_plural: 'nætter', definite_plural: 'nætterne', plural_pattern: 'umlaut-er', note: 'Nat fordobler konsonanten og skifter vokal: nat → natten, nætter.', example: 'Nætterne bliver længere om vinteren.', tags: ['time'], verify: false },
    { id: 'gaas', level: 'A2', base: 'gås', gender: 'en', indefinite_singular: 'en gås', definite_singular: 'gåsen', indefinite_plural: 'gæs', definite_plural: 'gæssene', plural_pattern: 'irregular', note: 'Gås danner flertal ved rent vokalskifte og fordobler s i bestemt flertal: gås → gæs → gæssene.', example: 'Gæssene fløj mod syd.', tags: ['animals'], verify: false },
    { id: 'and', level: 'A2', base: 'and', gender: 'en', indefinite_singular: 'en and', definite_singular: 'anden', indefinite_plural: 'ænder', definite_plural: 'ænderne', plural_pattern: 'umlaut-er', note: 'And danner flertal med vokalskifte og -er: and → ænder.', example: 'Ænderne svømmer i søen.', tags: ['animals'], verify: false },
    { id: 'ko', level: 'A1', base: 'ko', gender: 'en', indefinite_singular: 'en ko', definite_singular: 'koen', indefinite_plural: 'køer', definite_plural: 'køerne', plural_pattern: 'umlaut-er', note: 'Ko danner flertal med vokalskifte og -er: ko → køer.', example: 'Køerne græsser på marken.', tags: ['animals'], verify: false },
    { id: 'mus', level: 'A1', base: 'mus', gender: 'en', indefinite_singular: 'en mus', definite_singular: 'musen', indefinite_plural: 'mus', definite_plural: 'musene', plural_pattern: 'zero', note: 'Mus har samme form i ubestemt ental og flertal: en mus, mus.', example: 'Musene løb hen over gulvet.', tags: ['animals'], verify: false },
    { id: 'finger', level: 'A1', base: 'finger', gender: 'en', indefinite_singular: 'en finger', definite_singular: 'fingeren', indefinite_plural: 'fingre', definite_plural: 'fingrene', plural_pattern: 'irregular', note: 'Finger mister sit e foran flertalsendelsen: finger → fingre.', example: 'Fingrene var stive af kulde.', tags: ['body'], verify: false },
    { id: 'trae', level: 'A1', base: 'træ', gender: 'et', indefinite_singular: 'et træ', definite_singular: 'træet', indefinite_plural: 'træer', definite_plural: 'træerne', plural_pattern: 'irregular', note: 'Træ får -er i flertal selvom ordet ender på vokal: træ → træer.', example: 'Træerne mister blade om efteråret.', tags: ['nature'], verify: false },
    { id: 'sko', level: 'A1', base: 'sko', gender: 'en', indefinite_singular: 'en sko', definite_singular: 'skoen', indefinite_plural: 'sko', definite_plural: 'skoene', plural_pattern: 'zero', note: 'Sko har samme form i ubestemt ental og flertal: en sko, sko.', example: 'Skoene stod ved døren.', tags: ['clothing'], verify: false },
    { id: 'tal', level: 'A1', base: 'tal', gender: 'et', indefinite_singular: 'et tal', definite_singular: 'tallet', indefinite_plural: 'tal', definite_plural: 'tallene', plural_pattern: 'zero', note: 'Tal fordobler konsonanten i bestemt form: tal → tallet, tallene.', example: 'Tallene stod skrevet på tavlen.', tags: ['abstract'], verify: false },
    { id: 'aar', level: 'A1', base: 'år', gender: 'et', indefinite_singular: 'et år', definite_singular: 'året', indefinite_plural: 'år', definite_plural: 'årene', plural_pattern: 'zero', note: 'År har samme form i ubestemt ental og flertal: et år, år.', example: 'Årene går hurtigt.', tags: ['time'], verify: false },
    { id: 'ord', level: 'A1', base: 'ord', gender: 'et', indefinite_singular: 'et ord', definite_singular: 'ordet', indefinite_plural: 'ord', definite_plural: 'ordene', plural_pattern: 'zero', note: 'Ord har samme form i ubestemt ental og flertal: et ord, ord.', example: 'Ordene stod tydeligt i bogen.', tags: ['abstract'], verify: false },
    { id: 'dyr', level: 'A1', base: 'dyr', gender: 'et', indefinite_singular: 'et dyr', definite_singular: 'dyret', indefinite_plural: 'dyr', definite_plural: 'dyrene', plural_pattern: 'zero', note: 'Dyr har samme form i ubestemt ental og flertal: et dyr, dyr.', example: 'Dyrene sover om vinteren.', tags: ['animals'], verify: false },
    { id: 'knae', level: 'A1', base: 'knæ', gender: 'et', indefinite_singular: 'et knæ', definite_singular: 'knæet', indefinite_plural: 'knæ', definite_plural: 'knæene', plural_pattern: 'zero', note: 'Knæ har samme form i ental og flertal: et knæ, knæ.', example: 'Knæene gjorde ondt efter løbeturen.', tags: ['body'], verify: false },
    { id: 'hjul', level: 'A2', base: 'hjul', gender: 'et', indefinite_singular: 'et hjul', definite_singular: 'hjulet', indefinite_plural: 'hjul', definite_plural: 'hjulene', plural_pattern: 'zero', note: 'Hjul har samme form i ental og flertal: et hjul, hjul.', example: 'Hjulene drejede hurtigt rundt.', tags: ['transport'], verify: false },
    { id: 'glas', level: 'A1', base: 'glas', gender: 'et', indefinite_singular: 'et glas', definite_singular: 'glasset', indefinite_plural: 'glas', definite_plural: 'glassene', plural_pattern: 'zero', note: 'Glas fordobler konsonanten i bestemt form: glas → glasset, glassene.', example: 'Glassene stod på bordet.', tags: ['objects'], verify: false },
    { id: 'aeg', level: 'A1', base: 'æg', gender: 'et', indefinite_singular: 'et æg', definite_singular: 'ægget', indefinite_plural: 'æg', definite_plural: 'æggene', plural_pattern: 'zero', note: 'Æg fordobler konsonanten i bestemt form: æg → ægget, æggene.', example: 'Æggene lå i kurven.', tags: ['food'], verify: false },
    { id: 'taa', level: 'A2', base: 'tå', gender: 'en', indefinite_singular: 'en tå', definite_singular: 'tåen', indefinite_plural: 'tæer', definite_plural: 'tæerne', plural_pattern: 'umlaut-er', note: 'Tå danner flertal med vokalskifte og -er: tå → tæer.', example: 'Tæerne var kolde i sandalerne.', tags: ['body'], verify: false },
    { id: 'laar', level: 'B1', base: 'lår', gender: 'et', indefinite_singular: 'et lår', definite_singular: 'låret', indefinite_plural: 'lår', definite_plural: 'lårene', plural_pattern: 'zero', note: 'Lår har samme form i ubestemt ental og flertal: et lår, lår.', example: 'Lårene var trætte efter cykelturen.', tags: ['body'], verify: false },
    { id: 'menneske', level: 'A1', base: 'menneske', gender: 'et', indefinite_singular: 'et menneske', definite_singular: 'mennesket', indefinite_plural: 'mennesker', definite_plural: 'menneskene', plural_pattern: 'irregular', note: 'Menneske får -er i flertal, men bestemt flertal udelader r: mennesker → menneskene.', example: 'Menneskene stod i kø foran butikken.', tags: ['people'], verify: true },
    { id: 'kartoffel', level: 'A1', base: 'kartoffel', gender: 'en', indefinite_singular: 'en kartoffel', definite_singular: 'kartoflen', indefinite_plural: 'kartofler', definite_plural: 'kartoflerne', plural_pattern: 'irregular', note: 'Kartoffel mister sit e foran flertalsendelsen: kartoffel → kartofler.', example: 'Kartoflerne kogte i tyve minutter.', tags: ['food'], verify: false },
    { id: 'gulerod', level: 'A2', base: 'gulerod', gender: 'en', indefinite_singular: 'en gulerod', definite_singular: 'guleroden', indefinite_plural: 'gulerødder', definite_plural: 'gulerødderne', plural_pattern: 'umlaut-er', note: 'Gulerod danner flertal ligesom rod, med vokalskifte og -er: gulerod → gulerødder.', example: 'Gulerødderne lå i køleskabet.', tags: ['food'], verify: false },
    { id: 'foraelder', level: 'A2', base: 'forælder', gender: 'en', indefinite_singular: 'en forælder', definite_singular: 'forælderen', indefinite_plural: 'forældre', definite_plural: 'forældrene', plural_pattern: 'irregular', note: 'Forælder har uregelmæssigt flertal: forælder → forældre.', example: 'Forældrene kom til skolefesten.', tags: ['family'], verify: false },
    { id: 'onkel', level: 'A2', base: 'onkel', gender: 'en', indefinite_singular: 'en onkel', definite_singular: 'onklen', indefinite_plural: 'onkler', definite_plural: 'onklerne', plural_pattern: 'irregular', note: 'Onkel mister sit e foran flertalsendelsen: onkel → onkler.', example: 'Onklerne besøgte os i sommerferien.', tags: ['family'], verify: false },
    { id: 'rod', level: 'B1', base: 'rod', gender: 'en', indefinite_singular: 'en rod', definite_singular: 'roden', indefinite_plural: 'rødder', definite_plural: 'rødderne', plural_pattern: 'umlaut-er', note: 'Rod danner flertal med vokalskifte og -er: rod → rødder.', example: 'Rødderne bredte sig under jorden.', tags: ['nature'], verify: false },
    { id: 'cykel', level: 'A1', base: 'cykel', gender: 'en', indefinite_singular: 'en cykel', definite_singular: 'cyklen', indefinite_plural: 'cykler', definite_plural: 'cyklerne', plural_pattern: 'irregular', note: 'Cykel mister sit e foran flertalsendelsen: cykel → cykler.', example: 'Cyklerne stod parkeret udenfor.', tags: ['transport'], verify: false },
    { id: 'hotel', level: 'A1', base: 'hotel', gender: 'et', indefinite_singular: 'et hotel', definite_singular: 'hotellet', indefinite_plural: 'hoteller', definite_plural: 'hotellerne', plural_pattern: 'er', note: 'Hotel fordobler konsonanten foran endelsen: hotel → hotellet, hoteller.', example: 'Hotellerne i byen var fyldt op.', tags: ['town'], verify: false },
    { id: 'kat', level: 'A1', base: 'kat', gender: 'en', indefinite_singular: 'en kat', definite_singular: 'katten', indefinite_plural: 'katte', definite_plural: 'kattene', plural_pattern: 'e', note: 'Kat fordobler konsonanten foran endelsen: kat → katten, katte.', example: 'Kattene sov i solen.', tags: ['animals'], verify: false },
    { id: 'hat', level: 'A2', base: 'hat', gender: 'en', indefinite_singular: 'en hat', definite_singular: 'hatten', indefinite_plural: 'hatte', definite_plural: 'hattene', plural_pattern: 'e', note: 'Hat fordobler konsonanten foran endelsen: hat → hatten, hatte.', example: 'Hattene hang på knagerækken.', tags: ['clothing'], verify: false },
    { id: 'sok', level: 'A2', base: 'sok', gender: 'en', indefinite_singular: 'en sok', definite_singular: 'sokken', indefinite_plural: 'sokker', definite_plural: 'sokkerne', plural_pattern: 'er', note: 'Sok fordobler konsonanten foran endelsen: sok → sokken, sokker.', example: 'Sokkerne lå sammen i skuffen.', tags: ['clothing'], verify: false },
    { id: 'ryg', level: 'A1', base: 'ryg', gender: 'en', indefinite_singular: 'en ryg', definite_singular: 'ryggen', indefinite_plural: 'rygge', definite_plural: 'ryggene', plural_pattern: 'e', note: 'Ryg fordobler konsonanten foran endelsen: ryg → ryggen, rygge.', example: 'Ryggene på stolene var af træ.', tags: ['body'], verify: false },
    { id: 'bus', level: 'A1', base: 'bus', gender: 'en', indefinite_singular: 'en bus', definite_singular: 'bussen', indefinite_plural: 'busser', definite_plural: 'busserne', plural_pattern: 'er', note: 'Bus fordobler konsonanten foran endelsen: bus → bussen, busser.', example: 'Busserne kørte hvert tiende minut.', tags: ['transport'], verify: false },
    { id: 'droem', level: 'A2', base: 'drøm', gender: 'en', indefinite_singular: 'en drøm', definite_singular: 'drømmen', indefinite_plural: 'drømme', definite_plural: 'drømmene', plural_pattern: 'e', note: 'Drøm fordobler konsonanten foran endelsen: drøm → drømmen, drømme.', example: 'Drømmene forsvandt, da hun vågnede.', tags: ['abstract'], verify: false },
    { id: 'minut', level: 'A1', base: 'minut', gender: 'et', indefinite_singular: 'et minut', definite_singular: 'minuttet', indefinite_plural: 'minutter', definite_plural: 'minutterne', plural_pattern: 'er', note: 'Minut fordobler konsonanten foran endelsen: minut → minuttet, minutter.', example: 'Minutterne føltes som timer.', tags: ['time'], verify: false },
    { id: 'butik', level: 'A1', base: 'butik', gender: 'en', indefinite_singular: 'en butik', definite_singular: 'butikken', indefinite_plural: 'butikker', definite_plural: 'butikkerne', plural_pattern: 'er', note: 'Butik fordobler konsonanten foran endelsen: butik → butikken, butikker.', example: 'Butikkerne åbner klokken ti.', tags: ['town'], verify: false },
    { id: 'robot', level: 'B1', base: 'robot', gender: 'en', indefinite_singular: 'en robot', definite_singular: 'robotten', indefinite_plural: 'robotter', definite_plural: 'robotterne', plural_pattern: 'er', note: 'Robot fordobler konsonanten foran endelsen: robot → robotten, robotter.', example: 'Robotterne arbejdede på fabrikken.', tags: ['technology'], verify: false },
    { id: 'edderkop', level: 'B1', base: 'edderkop', gender: 'en', indefinite_singular: 'en edderkop', definite_singular: 'edderkoppen', indefinite_plural: 'edderkopper', definite_plural: 'edderkopperne', plural_pattern: 'er', note: 'Edderkop fordobler konsonanten foran endelsen: edderkop → edderkoppen, edderkopper.', example: 'Edderkopperne spandt net i vinduet.', tags: ['animals'], verify: false },

    // --- Professions & agent nouns (plural -e, definite plural without extra e) ---
    { id: 'kok', level: 'B1', base: 'kok', gender: 'en', indefinite_singular: 'en kok', definite_singular: 'kokken', indefinite_plural: 'kokke', definite_plural: 'kokkene', plural_pattern: 'e', note: 'Kok fordobler konsonanten foran endelsen: kok → kokken, kokke.', example: 'Kokkene tilberedte maden i køkkenet.', tags: ['work'], verify: false },
    { id: 'tjener', level: 'B1', base: 'tjener', gender: 'en', indefinite_singular: 'en tjener', definite_singular: 'tjeneren', indefinite_plural: 'tjenere', definite_plural: 'tjenerne', plural_pattern: 'e', note: 'Tjener får -e i flertal, men bestemt flertal er tjenerne: tjener → tjenere → tjenerne.', example: 'Tjenerne serverede maden hurtigt.', tags: ['work'], verify: false },
    { id: 'kunstner', level: 'B1', base: 'kunstner', gender: 'en', indefinite_singular: 'en kunstner', definite_singular: 'kunstneren', indefinite_plural: 'kunstnere', definite_plural: 'kunstnerne', plural_pattern: 'e', note: 'Kunstner får -e i flertal og bestemt flertal kunstnerne: kunstner → kunstnere → kunstnerne.', example: 'Kunstnerne udstillede deres værker.', tags: ['work'], verify: false },
    { id: 'musiker', level: 'B1', base: 'musiker', gender: 'en', indefinite_singular: 'en musiker', definite_singular: 'musikeren', indefinite_plural: 'musikere', definite_plural: 'musikerne', plural_pattern: 'e', note: 'Musiker får -e i flertal: musiker → musikere → musikerne.', example: 'Musikerne stemte deres instrumenter.', tags: ['work'], verify: false },
    { id: 'skuespiller', level: 'B1', base: 'skuespiller', gender: 'en', indefinite_singular: 'en skuespiller', definite_singular: 'skuespilleren', indefinite_plural: 'skuespillere', definite_plural: 'skuespillerne', plural_pattern: 'e', note: 'Skuespiller får -e i flertal: skuespiller → skuespillere → skuespillerne.', example: 'Skuespillerne øvede replikkerne.', tags: ['work'], verify: false },
    { id: 'forfatter', level: 'B1', base: 'forfatter', gender: 'en', indefinite_singular: 'en forfatter', definite_singular: 'forfatteren', indefinite_plural: 'forfattere', definite_plural: 'forfatterne', plural_pattern: 'e', note: 'Forfatter får -e i flertal, og bestemt flertal er forfatterne: forfatter → forfattere → forfatterne.', example: 'Forfatterne signerede deres bøger.', tags: ['work'], verify: false },
    { id: 'politiker', level: 'B1', base: 'politiker', gender: 'en', indefinite_singular: 'en politiker', definite_singular: 'politikeren', indefinite_plural: 'politikere', definite_plural: 'politikerne', plural_pattern: 'e', note: 'Politiker får -e i flertal: politiker → politikere → politikerne.', example: 'Politikerne diskuterede det nye forslag.', tags: ['work'], verify: false },
    { id: 'forsker', level: 'B1', base: 'forsker', gender: 'en', indefinite_singular: 'en forsker', definite_singular: 'forskeren', indefinite_plural: 'forskere', definite_plural: 'forskerne', plural_pattern: 'e', note: 'Forsker får -e i flertal: forsker → forskere → forskerne.', example: 'Forskerne offentliggjorde deres resultater.', tags: ['work'], verify: false },
    { id: 'landmand', level: 'A2', base: 'landmand', gender: 'en', indefinite_singular: 'en landmand', definite_singular: 'landmanden', indefinite_plural: 'landmænd', definite_plural: 'landmændene', plural_pattern: 'irregular', note: 'Landmand har uregelmæssigt flertal som mand: landmand → landmænd.', example: 'Landmændene høstede kornet i august.', tags: ['work'], verify: false },

    // --- Consonant doubling before the ending ---
    { id: 'metal', level: 'B1', base: 'metal', gender: 'et', indefinite_singular: 'et metal', definite_singular: 'metallet', indefinite_plural: 'metaller', definite_plural: 'metallerne', plural_pattern: 'er', note: 'Metal fordobler konsonanten foran endelsen: metal → metallet, metaller.', example: 'Metallerne blev smeltet om.', tags: ['material'], verify: false },
    { id: 'stof', level: 'B1', base: 'stof', gender: 'et', indefinite_singular: 'et stof', definite_singular: 'stoffet', indefinite_plural: 'stoffer', definite_plural: 'stofferne', plural_pattern: 'er', note: 'Stof fordobler konsonanten foran endelsen: stof → stoffet, stoffer.', example: 'Stofferne blev vævet på fabrikken.', tags: ['material'], verify: false },
    { id: 'kop', level: 'A1', base: 'kop', gender: 'en', indefinite_singular: 'en kop', definite_singular: 'koppen', indefinite_plural: 'kopper', definite_plural: 'kopperne', plural_pattern: 'er', note: 'Kop fordobler konsonanten foran endelsen: kop → koppen, kopper.', example: 'Kopperne stod på hylden.', tags: ['objects'], verify: false },
    { id: 'saek', level: 'A2', base: 'sæk', gender: 'en', indefinite_singular: 'en sæk', definite_singular: 'sækken', indefinite_plural: 'sække', definite_plural: 'sækkene', plural_pattern: 'e', note: 'Sæk fordobler konsonanten foran endelsen: sæk → sækken, sække.', example: 'Sækkene var fyldt med kartofler.', tags: ['objects'], verify: false },
    { id: 'klub', level: 'A2', base: 'klub', gender: 'en', indefinite_singular: 'en klub', definite_singular: 'klubben', indefinite_plural: 'klubber', definite_plural: 'klubberne', plural_pattern: 'er', note: 'Klub fordobler konsonanten foran endelsen: klub → klubben, klubber.', example: 'Klubberne mødtes til turnering.', tags: ['leisure'], verify: false },
    { id: 'medlem', level: 'B1', base: 'medlem', gender: 'et', indefinite_singular: 'et medlem', definite_singular: 'medlemmet', indefinite_plural: 'medlemmer', definite_plural: 'medlemmerne', plural_pattern: 'er', note: 'Medlem fordobler konsonanten foran endelsen: medlem → medlemmet, medlemmer.', example: 'Medlemmerne stemte om forslaget.', tags: ['society'], verify: false },
    { id: 'billet', level: 'A2', base: 'billet', gender: 'en', indefinite_singular: 'en billet', definite_singular: 'billetten', indefinite_plural: 'billetter', definite_plural: 'billetterne', plural_pattern: 'er', note: 'Billet fordobler konsonanten foran endelsen: billet → billetten, billetter.', example: 'Billetterne var udsolgt på få minutter.', tags: ['leisure'], verify: false },
    { id: 'fabrik', level: 'A2', base: 'fabrik', gender: 'en', indefinite_singular: 'en fabrik', definite_singular: 'fabrikken', indefinite_plural: 'fabrikker', definite_plural: 'fabrikkerne', plural_pattern: 'er', note: 'Fabrik fordobler konsonanten foran endelsen: fabrik → fabrikken, fabrikker.', example: 'Fabrikkerne lå uden for byen.', tags: ['town'], verify: false },
    { id: 'knap', level: 'A2', base: 'knap', gender: 'en', indefinite_singular: 'en knap', definite_singular: 'knappen', indefinite_plural: 'knapper', definite_plural: 'knapperne', plural_pattern: 'er', note: 'Knap fordobler konsonanten foran endelsen: knap → knappen, knapper.', example: 'Knapperne på skjorten manglede.', tags: ['objects'], verify: false },
    { id: 'tablet', level: 'A2', base: 'tablet', gender: 'en', indefinite_singular: 'en tablet', definite_singular: 'tabletten', indefinite_plural: 'tabletter', definite_plural: 'tabletterne', plural_pattern: 'er', note: 'Tablet fordobler konsonanten foran endelsen: tablet → tabletten, tabletter.', example: 'Tabletterne blev opladet om natten.', tags: ['technology'], verify: false },
    { id: 'rabat', level: 'B1', base: 'rabat', gender: 'en', indefinite_singular: 'en rabat', definite_singular: 'rabatten', indefinite_plural: 'rabatter', definite_plural: 'rabatterne', plural_pattern: 'er', note: 'Rabat fordobler konsonanten foran endelsen: rabat → rabatten, rabatter.', example: 'Rabatterne gjaldt kun i weekenden.', tags: ['money'], verify: false },
    { id: 'skat', level: 'B1', base: 'skat', gender: 'en', indefinite_singular: 'en skat', definite_singular: 'skatten', indefinite_plural: 'skatter', definite_plural: 'skatterne', plural_pattern: 'er', note: 'Skat fordobler konsonanten foran endelsen: skat → skatten, skatter.', example: 'Skatterne blev opkrævet hvert år.', tags: ['money'], verify: false },
    { id: 'ret', level: 'A2', base: 'ret', gender: 'en', indefinite_singular: 'en ret', definite_singular: 'retten', indefinite_plural: 'retter', definite_plural: 'retterne', plural_pattern: 'er', note: 'Ret (mad) fordobler konsonanten foran endelsen: ret → retten, retter.', example: 'Retterne blev serveret én ad gangen.', tags: ['food'], verify: false },
    { id: 'forskel', level: 'B1', base: 'forskel', gender: 'en', indefinite_singular: 'en forskel', definite_singular: 'forskellen', indefinite_plural: 'forskelle', definite_plural: 'forskellene', plural_pattern: 'e', note: 'Forskel fordobler konsonanten foran endelsen: forskel → forskellen, forskelle.', example: 'Forskellene mellem sprogene var små.', tags: ['abstract'], verify: false },

    // --- Schwa elision in -el/-er stems ---
    { id: 'gaffel', level: 'A2', base: 'gaffel', gender: 'en', indefinite_singular: 'en gaffel', definite_singular: 'gaflen', indefinite_plural: 'gafler', definite_plural: 'gaflerne', plural_pattern: 'irregular', note: 'Gaffel mister sit e foran endelsen: gaffel → gaflen, gafler.', example: 'Gaflerne lå til venstre for tallerkenen.', tags: ['objects'], verify: false },
    { id: 'muskel', level: 'B1', base: 'muskel', gender: 'en', indefinite_singular: 'en muskel', definite_singular: 'musklen', indefinite_plural: 'muskler', definite_plural: 'musklerne', plural_pattern: 'irregular', note: 'Muskel mister sit e foran flertalsendelsen: muskel → musklen, muskler.', example: 'Musklerne var ømme efter træningen.', tags: ['body'], verify: false },
    { id: 'seddel', level: 'A2', base: 'seddel', gender: 'en', indefinite_singular: 'en seddel', definite_singular: 'sedlen', indefinite_plural: 'sedler', definite_plural: 'sedlerne', plural_pattern: 'irregular', note: 'Seddel mister sit e foran endelsen: seddel → sedlen, sedler.', example: 'Sedlerne lå i tegnebogen.', tags: ['money'], verify: false },
    { id: 'skulder', level: 'A2', base: 'skulder', gender: 'en', indefinite_singular: 'en skulder', definite_singular: 'skulderen', indefinite_plural: 'skuldre', definite_plural: 'skuldrene', plural_pattern: 'irregular', note: 'Skulder mister sit e i flertal: skulder → skuldre.', example: 'Skuldrene var spændte efter en lang dag.', tags: ['body'], verify: false },
    { id: 'regel', level: 'B1', base: 'regel', gender: 'en', indefinite_singular: 'en regel', definite_singular: 'reglen', indefinite_plural: 'regler', definite_plural: 'reglerne', plural_pattern: 'irregular', note: 'Regel mister sit e foran endelsen: regel → reglen, regler.', example: 'Reglerne blev forklaret grundigt.', tags: ['abstract'], verify: false },
    { id: 'tallerken', level: 'A2', base: 'tallerken', gender: 'en', indefinite_singular: 'en tallerken', definite_singular: 'tallerkenen', indefinite_plural: 'tallerkener', definite_plural: 'tallerkenerne', plural_pattern: 'er', note: 'Tallerken får -er i flertal: tallerken → tallerkenen, tallerkener.', example: 'Tallerkenerne blev stablet i skabet.', tags: ['objects'], verify: true },

    // --- Irregular / foreign / zero-plural with doubling ---
    { id: 'loen', level: 'B1', base: 'løn', gender: 'en', indefinite_singular: 'en løn', definite_singular: 'lønnen', indefinite_plural: 'lønninger', definite_plural: 'lønningerne', plural_pattern: 'irregular', note: 'Løn har uregelmæssigt flertal: løn → lønnen, lønninger.', example: 'Lønningerne blev udbetalt sidst på måneden.', tags: ['money'], verify: false },
    { id: 'museum', level: 'A2', base: 'museum', gender: 'et', indefinite_singular: 'et museum', definite_singular: 'museet', indefinite_plural: 'museer', definite_plural: 'museerne', plural_pattern: 'foreign', note: 'Museum er et fremmedord: endelsen -um falder bort i bestemt form og flertal: museum → museet, museer.', example: 'Museerne havde gratis adgang om søndagen.', tags: ['town'], verify: false },
    { id: 'myg', level: 'B1', base: 'myg', gender: 'en', indefinite_singular: 'en myg', definite_singular: 'myggen', indefinite_plural: 'myg', definite_plural: 'myggene', plural_pattern: 'zero', note: 'Myg fordobler konsonanten i bestemt form og har samme form i flertal: myg → myggen, myg.', example: 'Myggene summede i sommernatten.', tags: ['animals'], verify: false },
    { id: 'lam', level: 'B1', base: 'lam', gender: 'et', indefinite_singular: 'et lam', definite_singular: 'lammet', indefinite_plural: 'lam', definite_plural: 'lammene', plural_pattern: 'zero', note: 'Lam fordobler konsonanten i bestemt form og har nulflertal: lam → lammet, lam.', example: 'Lammene sprang rundt på marken.', tags: ['animals'], verify: false },
    { id: 'spil', level: 'A1', base: 'spil', gender: 'et', indefinite_singular: 'et spil', definite_singular: 'spillet', indefinite_plural: 'spil', definite_plural: 'spillene', plural_pattern: 'zero', note: 'Spil fordobler konsonanten i bestemt form og har nulflertal: spil → spillet, spil.', example: 'Spillene lå samlet i skabet.', tags: ['leisure'], verify: false }
  ];

  var REGULAR = [
    // Home & furniture
    noun('A1', 'hus', 'et', 'huse', 'e', 'Hus får -e i flertal: hus → huse.', 'Husene lå tæt på stranden.', ['home']),
    noun('A1', 'bord', 'et', 'borde', 'e', 'Bord får -e i flertal: bord → borde.', 'Bordene blev dækket til festen.', ['home']),
    noun('A1', 'stol', 'en', 'stole', 'e', 'Stol får -e i flertal: stol → stole.', 'Stolene stod omkring bordet.', ['home']),
    noun('A1', 'seng', 'en', 'senge', 'e', 'Seng får -e i flertal: seng → senge.', 'Sengene blev redt om morgenen.', ['home']),
    noun('A1', 'dør', 'en', 'døre', 'e', 'Dør får -e i flertal: dør → døre.', 'Dørene blev låst om aftenen.', ['home']),
    noun('A1', 'vindue', 'et', 'vinduer', 'er', 'Vindue får -er i flertal: vindue → vinduer.', 'Vinduerne blev pudset i weekenden.', ['home']),
    noun('A1', 'lampe', 'en', 'lamper', 'er', 'Lampe får -r i flertal, da ordet ender på -e: lampe → lamper.', 'Lamperne blev tændt, da det blev mørkt.', ['home']),
    noun('A1', 'gulv', 'et', 'gulve', 'e', 'Gulv får -e i flertal: gulv → gulve.', 'Gulvene blev vasket hver uge.', ['home']),
    noun('A2', 'loft', 'et', 'lofter', 'er', 'Loft får -er i flertal: loft → lofter.', 'Lofterne var høje i den gamle bygning.', ['home']),
    noun('A1', 'tag', 'et', 'tage', 'e', 'Tag får -e i flertal: tag → tage.', 'Tagene var dækket af sne.', ['home']),
    noun('A1', 'skab', 'et', 'skabe', 'e', 'Skab får -e i flertal: skab → skabe.', 'Skabene stod langs væggen.', ['home']),
    noun('A1', 'køkken', 'et', 'køkkener', 'er', 'Køkken får -er i flertal: køkken → køkkener.', 'Køkkenerne blev renoveret sidste år.', ['home'], true),
    noun('A2', 'badeværelse', 'et', 'badeværelser', 'er', 'Badeværelse får -r i flertal, da ordet ender på -e: badeværelse → badeværelser.', 'Badeværelserne blev malet hvide.', ['home']),
    noun('A2', 'soveværelse', 'et', 'soveværelser', 'er', 'Soveværelse får -r i flertal, da ordet ender på -e: soveværelse → soveværelser.', 'Soveværelserne lå på første sal.', ['home']),
    noun('A1', 'have', 'en', 'haver', 'er', 'Have får -r i flertal, da ordet ender på -e: have → haver.', 'Haverne blomstrede om foråret.', ['home']),
    noun('B1', 'altan', 'en', 'altaner', 'er', 'Altan får -er i flertal: altan → altaner.', 'Altanerne vendte ud mod gaden.', ['home']),
    noun('A1', 'nøgle', 'en', 'nøgler', 'er', 'Nøgle får -r i flertal, da ordet ender på -e: nøgle → nøgler.', 'Nøglerne lå i skålen ved døren.', ['home']),
    noun('A2', 'spejl', 'et', 'spejle', 'e', 'Spejl får -e i flertal: spejl → spejle.', 'Spejlene hang på hver sin væg.', ['home']),
    noun('A2', 'tæppe', 'et', 'tæpper', 'er', 'Tæppe får -r i flertal, da ordet ender på -e: tæppe → tæpper.', 'Tæpperne dækkede det kolde gulv.', ['home']),
    noun('B1', 'reol', 'en', 'reoler', 'er', 'Reol får -er i flertal: reol → reoler.', 'Reolerne var fyldt med bøger.', ['home']),
    noun('A1', 'sofa', 'en', 'sofaer', 'er', 'Sofa får -er i flertal: sofa → sofaer.', 'Sofaerne stod i den store stue.', ['home']),

    // Family & people
    noun('A1', 'kvinde', 'en', 'kvinder', 'er', 'Kvinde får -r i flertal, da ordet ender på -e: kvinde → kvinder.', 'Kvinderne mødtes til kaffe.', ['family']),
    noun('A1', 'dreng', 'en', 'drenge', 'e', 'Dreng følger -e-mønsteret i flertal: dreng → drenge.', 'Drengene spillede fodbold i gården.', ['family']),
    noun('A1', 'pige', 'en', 'piger', 'er', 'Pige får kun -r i flertal, da ordet ender på -e: pige → piger.', 'Pigerne tegnede billeder i timen.', ['family']),
    noun('A2', 'veninde', 'en', 'veninder', 'er', 'Veninde får -r i flertal, da ordet ender på -e: veninde → veninder.', 'Veninderne rejste sammen til Italien.', ['family']),
    noun('A2', 'nabo', 'en', 'naboer', 'er', 'Nabo får -er i flertal: nabo → naboer.', 'Naboerne hilste venligt på hinanden.', ['family']),
    noun('A2', 'tante', 'en', 'tanter', 'er', 'Tante får -r i flertal, da ordet ender på -e: tante → tanter.', 'Tanterne kom på besøg til jul.', ['family']),
    noun('B1', 'nevø', 'en', 'nevøer', 'er', 'Nevø får -er i flertal: nevø → nevøer.', 'Nevøerne legede i haven hele eftermiddagen.', ['family']),
    noun('B1', 'niece', 'en', 'niecer', 'er', 'Niece får -r i flertal, da ordet ender på -e: niece → niecer.', 'Niecerne fik nye cykler i fødselsdagsgave.', ['family']),
    noun('A2', 'chef', 'en', 'chefer', 'er', 'Chef får -er i flertal: chef → chefer.', 'Cheferne holdt møde om morgenen.', ['work']),
    noun('B1', 'kollega', 'en', 'kolleger', 'er', 'Kollega får -er i flertal: kollega → kolleger.', 'Kollegerne spiste frokost sammen.', ['work']),

    // Body
    noun('A1', 'arm', 'en', 'arme', 'e', 'Arm følger -e-mønsteret i flertal: arm → arme.', 'Armene var trætte efter svømning.', ['body']),
    noun('A1', 'mave', 'en', 'maver', 'er', 'Mave får -r i flertal, da ordet ender på -e: mave → maver.', 'Maverne rumlede af sult.', ['body']),
    noun('A1', 'mund', 'en', 'munde', 'e', 'Mund følger -e-mønsteret i flertal: mund → munde.', 'Mundene grinede højt af vittigheden.', ['body']),
    noun('A1', 'næse', 'en', 'næser', 'er', 'Næse får -r i flertal, da ordet ender på -e: næse → næser.', 'Næserne var røde af kulden.', ['body']),
    noun('A1', 'hals', 'en', 'halse', 'e', 'Hals følger -e-mønsteret i flertal: hals → halse.', 'Halsene var stive efter turen.', ['body']),
    noun('A1', 'ben', 'et', 'ben', 'zero', 'Ben har samme form i ubestemt ental og flertal: et ben, ben.', 'Benene var trætte efter løbeturen.', ['body']),
    noun('A1', 'hoved', 'et', 'hoveder', 'er', 'Hoved får -er i flertal: hoved → hoveder.', 'Hovederne nikkede samstemmende.', ['body']),

    // Nature & weather
    noun('A1', 'sol', 'en', 'sole', 'e', 'Sol bruges næsten altid i ental, men følger -e-mønsteret i flertal: sol → sole.', 'Solene i fortællingen symboliserede håb.', ['nature'], true),
    noun('A1', 'måne', 'en', 'måner', 'er', 'Måne får -r i flertal, da ordet ender på -e: måne → måner.', 'Månerne omkring planeten blev talt af astronomerne.', ['nature']),
    noun('A1', 'sky', 'en', 'skyer', 'er', 'Sky får -er i flertal: sky → skyer.', 'Skyerne trak sig sammen før uvejret.', ['nature']),
    noun('A2', 'stjerne', 'en', 'stjerner', 'er', 'Stjerne får -r i flertal, da ordet ender på -e: stjerne → stjerner.', 'Stjernerne lyste klart på nattehimlen.', ['nature']),
    noun('A2', 'storm', 'en', 'storme', 'e', 'Storm følger -e-mønsteret i flertal: storm → storme.', 'Stormene ramte kysten hver vinter.', ['nature']),
    noun('B1', 'regnbue', 'en', 'regnbuer', 'er', 'Regnbue får -r i flertal, da ordet ender på -e: regnbue → regnbuer.', 'Regnbuerne dukkede op efter regnvejret.', ['nature']),
    noun('A1', 'skov', 'en', 'skove', 'e', 'Skov følger -e-mønsteret i flertal: skov → skove.', 'Skovene var fyldt med svampe om efteråret.', ['nature']),
    noun('A2', 'mark', 'en', 'marker', 'er', 'Mark får -er i flertal: mark → marker.', 'Markerne var dækket af korn.', ['nature']),
    noun('A1', 'bjerg', 'et', 'bjerge', 'e', 'Bjerg følger -e-mønsteret i flertal: bjerg → bjerge.', 'Bjergene var dækket af sne hele året.', ['nature']),
    noun('A2', 'dal', 'en', 'dale', 'e', 'Dal følger -e-mønsteret i flertal: dal → dale.', 'Dalene lå grønne mellem bjergene.', ['nature']),
    noun('A2', 'flod', 'en', 'floder', 'er', 'Flod får -er i flertal: flod → floder.', 'Floderne løb ud i havet.', ['nature']),
    noun('A1', 'sø', 'en', 'søer', 'er', 'Sø får -er i flertal: sø → søer.', 'Søerne frøs til om vinteren.', ['nature']),
    noun('A1', 'hav', 'et', 'have', 'e', 'Hav følger -e-mønsteret i flertal: hav → have.', 'Havene dækker det meste af jorden.', ['nature']),
    noun('A1', 'sten', 'en', 'sten', 'zero', 'Sten har samme form i ubestemt ental og flertal: en sten, sten.', 'Stenene lå spredt langs stien.', ['nature']),
    noun('A1', 'blomst', 'en', 'blomster', 'er', 'Blomst får -er i flertal: blomst → blomster.', 'Blomsterne blomstrede tidligt i år.', ['nature']),
    noun('A2', 'blad', 'et', 'blade', 'e', 'Blad følger -e-mønsteret i flertal: blad → blade.', 'Bladene faldt af træerne om efteråret.', ['nature']),
    noun('A2', 'gren', 'en', 'grene', 'e', 'Gren følger -e-mønsteret i flertal: gren → grene.', 'Grenene knækkede under sneens vægt.', ['nature']),

    // Time
    noun('A1', 'dag', 'en', 'dage', 'e', 'Dag følger -e-mønsteret i flertal: dag → dage.', 'Dagene blev længere om foråret.', ['time']),
    noun('A1', 'uge', 'en', 'uger', 'er', 'Uge får -r i flertal, da ordet ender på -e: uge → uger.', 'Ugerne gik hurtigt i sommerferien.', ['time']),
    noun('A1', 'måned', 'en', 'måneder', 'er', 'Måned får -er i flertal: måned → måneder.', 'Månederne føltes lange under eksamen.', ['time']),
    noun('A1', 'time', 'en', 'timer', 'er', 'Time får -r i flertal, da ordet ender på -e: time → timer.', 'Timerne på skemaet var lange om fredagen.', ['time']),
    noun('A2', 'sekund', 'et', 'sekunder', 'er', 'Sekund får -er i flertal: sekund → sekunder.', 'Sekunderne tikkede langsomt af sted.', ['time']),
    noun('A2', 'weekend', 'en', 'weekender', 'er', 'Weekend får -er i flertal: weekend → weekender.', 'Weekenderne brugte de på at rejse.', ['time']),
    noun('A2', 'ferie', 'en', 'ferier', 'er', 'Ferie får -r i flertal, da ordet ender på -e: ferie → ferier.', 'Ferierne blev planlagt et år i forvejen.', ['time']),
    noun('A1', 'morgen', 'en', 'morgener', 'er', 'Morgen får -er i flertal: morgen → morgener.', 'Morgenerne var kolde i november.', ['time'], true),
    noun('A1', 'aften', 'en', 'aftener', 'er', 'Aften får -er i flertal: aften → aftener.', 'Aftenerne blev brugt på at læse højt.', ['time']),

    // Clothing
    noun('A1', 'trøje', 'en', 'trøjer', 'er', 'Trøje får -r i flertal, da ordet ender på -e: trøje → trøjer.', 'Trøjerne hang på tørresnoren.', ['clothing']),
    noun('A1', 'skjorte', 'en', 'skjorter', 'er', 'Skjorte får -r i flertal, da ordet ender på -e: skjorte → skjorter.', 'Skjorterne var strøget og hængt op.', ['clothing']),
    noun('A1', 'kjole', 'en', 'kjoler', 'er', 'Kjole får -r i flertal, da ordet ender på -e: kjole → kjoler.', 'Kjolerne hang pænt i skabet.', ['clothing']),
    noun('A1', 'jakke', 'en', 'jakker', 'er', 'Jakke får -r i flertal, da ordet ender på -e: jakke → jakker.', 'Jakkerne var våde efter regnvejret.', ['clothing']),
    noun('A2', 'handske', 'en', 'handsker', 'er', 'Handske får -r i flertal, da ordet ender på -e: handske → handsker.', 'Handskerne lå i lommen på frakken.', ['clothing']),
    noun('A2', 'hue', 'en', 'huer', 'er', 'Hue får -r i flertal, da ordet ender på -e: hue → huer.', 'Huerne beskyttede mod kulden.', ['clothing']),
    noun('B1', 'tørklæde', 'et', 'tørklæder', 'er', 'Tørklæde får -r i flertal, da ordet ender på -e: tørklæde → tørklæder.', 'Tørklæderne var strikket i uld.', ['clothing']),
    noun('A2', 'frakke', 'en', 'frakker', 'er', 'Frakke får -r i flertal, da ordet ender på -e: frakke → frakker.', 'Frakkerne hang ved døren.', ['clothing']),
    noun('A2', 'bælte', 'et', 'bælter', 'er', 'Bælte får -r i flertal, da ordet ender på -e: bælte → bælter.', 'Bælterne lå i den øverste skuffe.', ['clothing']),

    // Animals
    noun('A1', 'hund', 'en', 'hunde', 'e', 'Hund følger -e-mønsteret i flertal: hund → hunde.', 'Hundene løb glade rundt i haven.', ['animals']),
    noun('A1', 'fugl', 'en', 'fugle', 'e', 'Fugl følger -e-mønsteret i flertal: fugl → fugle.', 'Fuglene sang tidligt om morgenen.', ['animals']),
    noun('A1', 'hest', 'en', 'heste', 'e', 'Hest følger -e-mønsteret i flertal: hest → heste.', 'Hestene græssede på marken.', ['animals']),
    noun('A1', 'gris', 'en', 'grise', 'e', 'Gris følger -e-mønsteret i flertal: gris → grise.', 'Grisene rodede i mudderet.', ['animals']),
    noun('A2', 'høne', 'en', 'høner', 'er', 'Høne får -r i flertal, da ordet ender på -e: høne → høner.', 'Hønerne lagde æg hver morgen.', ['animals']),
    noun('A2', 'hane', 'en', 'haner', 'er', 'Hane får -r i flertal, da ordet ender på -e: hane → haner.', 'Hanerne galede ved solopgang.', ['animals']),
    noun('A2', 'bi', 'en', 'bier', 'er', 'Bi får -er i flertal: bi → bier.', 'Bierne fløj fra blomst til blomst.', ['animals']),
    noun('A2', 'flue', 'en', 'fluer', 'er', 'Flue får -r i flertal, da ordet ender på -e: flue → fluer.', 'Fluerne summede omkring frugten.', ['animals']),
    noun('B1', 'slange', 'en', 'slanger', 'er', 'Slange får -r i flertal, da ordet ender på -e: slange → slanger.', 'Slangerne gemte sig under stenene.', ['animals']),
    noun('A2', 'frø', 'en', 'frøer', 'er', 'Frø får -er i flertal: frø → frøer.', 'Frøerne kvækkede ved søen om natten.', ['animals']),
    noun('A2', 'ræv', 'en', 'ræve', 'e', 'Ræv følger -e-mønsteret i flertal: ræv → ræve.', 'Rævene jagede om natten.', ['animals']),
    noun('B1', 'ulv', 'en', 'ulve', 'e', 'Ulv følger -e-mønsteret i flertal: ulv → ulve.', 'Ulvene hylede i skoven.', ['animals']),
    noun('A2', 'bjørn', 'en', 'bjørne', 'e', 'Bjørn følger -e-mønsteret i flertal: bjørn → bjørne.', 'Bjørnene sov hele vinteren.', ['animals']),
    noun('A2', 'løve', 'en', 'løver', 'er', 'Løve får -r i flertal, da ordet ender på -e: løve → løver.', 'Løverne hvilede sig i skyggen.', ['animals']),
    noun('A2', 'elefant', 'en', 'elefanter', 'er', 'Elefant får -er i flertal: elefant → elefanter.', 'Elefanterne badede i floden.', ['animals']),
    noun('A2', 'abe', 'en', 'aber', 'er', 'Abe får -r i flertal, da ordet ender på -e: abe → aber.', 'Aberne klatrede rundt i træerne.', ['animals']),

    // Transport
    noun('A1', 'bil', 'en', 'biler', 'er', 'Bil får -er i flertal: bil → biler.', 'Bilerne holdt i kø ved lyskrydset.', ['transport']),
    noun('A1', 'tog', 'et', 'tog', 'zero', 'Tog har samme form i ubestemt ental og flertal: et tog, tog.', 'Togene kørte forsinket på grund af sne.', ['transport']),
    noun('A1', 'fly', 'et', 'fly', 'zero', 'Fly har samme form i ubestemt ental og flertal: et fly, fly.', 'Flyene lettede fra samme bane.', ['transport']),
    noun('A1', 'båd', 'en', 'både', 'e', 'Båd følger -e-mønsteret i flertal: båd → både.', 'Bådene lå fortøjet i havnen.', ['transport']),
    noun('A2', 'skib', 'et', 'skibe', 'e', 'Skib følger -e-mønsteret i flertal: skib → skibe.', 'Skibene sejlede ud tidligt om morgenen.', ['transport']),
    noun('A2', 'lufthavn', 'en', 'lufthavne', 'e', 'Lufthavn følger -e-mønsteret i flertal: lufthavn → lufthavne.', 'Lufthavnene var overfyldte i sommerferien.', ['transport']),
    noun('A2', 'station', 'en', 'stationer', 'er', 'Station får -er i flertal: station → stationer.', 'Stationerne blev renoveret sidste år.', ['transport']),
    noun('B1', 'vogn', 'en', 'vogne', 'e', 'Vogn følger -e-mønsteret i flertal: vogn → vogne.', 'Vognene stod klar på perronen.', ['transport']),

    // Work & school
    noun('A1', 'skole', 'en', 'skoler', 'er', 'Skole får -r i flertal, da ordet ender på -e: skole → skoler.', 'Skolerne lukkede tidligt fredag.', ['school']),
    noun('A1', 'lærer', 'en', 'lærere', 'e', 'Lærer får -e i flertal: lærer → lærere.', 'Lærerne holdt møde efter skoletid.', ['school']),
    noun('A1', 'elev', 'en', 'elever', 'er', 'Elev får -er i flertal: elev → elever.', 'Eleverne afleverede deres opgaver.', ['school']),
    noun('A1', 'klasse', 'en', 'klasser', 'er', 'Klasse får -r i flertal, da ordet ender på -e: klasse → klasser.', 'Klasserne var på tur til museet.', ['school']),
    noun('A2', 'lektie', 'en', 'lektier', 'er', 'Lektie får -r i flertal, da ordet ender på -e: lektie → lektier.', 'Lektierne skulle afleveres om mandagen.', ['school']),
    noun('B1', 'eksamen', 'en', 'eksamener', 'er', 'Eksamen får -er i flertal: eksamen → eksamener.', 'Eksamenerne lå tæt i juni.', ['school'], true),
    noun('A2', 'opgave', 'en', 'opgaver', 'er', 'Opgave får -r i flertal, da ordet ender på -e: opgave → opgaver.', 'Opgaverne var svære i denne uge.', ['school']),
    noun('B1', 'skema', 'et', 'skemaer', 'er', 'Skema får -er i flertal: skema → skemaer.', 'Skemaerne blev ændret i sidste øjeblik.', ['school']),
    noun('B2', 'uddannelse', 'en', 'uddannelser', 'er', 'Uddannelse får -r i flertal, da ordet ender på -e: uddannelse → uddannelser.', 'Uddannelserne varer typisk tre år.', ['school']),
    noun('B1', 'universitet', 'et', 'universiteter', 'er', 'Universitet får -er i flertal: universitet → universiteter.', 'Universiteterne samarbejder om forskningen.', ['school']),
    noun('A2', 'kontor', 'et', 'kontorer', 'er', 'Kontor får -er i flertal: kontor → kontorer.', 'Kontorerne lå på tredje sal.', ['work']),

    // Town & society
    noun('A1', 'by', 'en', 'byer', 'er', 'By får -er i flertal: by → byer.', 'Byerne langs kysten var meget besøgte.', ['town']),
    noun('A1', 'gade', 'en', 'gader', 'er', 'Gade får -r i flertal, da ordet ender på -e: gade → gader.', 'Gaderne var fyldte af mennesker.', ['town']),
    noun('A1', 'vej', 'en', 'veje', 'e', 'Vej følger -e-mønsteret i flertal: vej → veje.', 'Vejene var glatte af is.', ['town']),
    noun('A1', 'park', 'en', 'parker', 'er', 'Park får -er i flertal: park → parker.', 'Parkerne var fyldt med mennesker i solskin.', ['town']),
    noun('A2', 'marked', 'et', 'markeder', 'er', 'Marked får -er i flertal: marked → markeder.', 'Markederne solgte friske grøntsager.', ['town']),
    noun('A1', 'restaurant', 'en', 'restauranter', 'er', 'Restaurant får -er i flertal: restaurant → restauranter.', 'Restauranterne var booket op i weekenden.', ['town']),
    noun('A1', 'café', 'en', 'caféer', 'er', 'Café får -er i flertal, og accenten falder ofte bort: café → caféer.', 'Caféerne åbnede tidligt om morgenen.', ['town'], true),
    noun('A2', 'kirke', 'en', 'kirker', 'er', 'Kirke får -r i flertal, da ordet ender på -e: kirke → kirker.', 'Kirkerne ringede med klokkerne.', ['town']),
    noun('A2', 'bibliotek', 'et', 'biblioteker', 'er', 'Bibliotek får -er i flertal: bibliotek → biblioteker.', 'Bibliotekerne havde forlænget åbningstid.', ['town']),
    noun('A2', 'plads', 'en', 'pladser', 'er', 'Plads får -er i flertal: plads → pladser.', 'Pladserne i byen blev pyntet til jul.', ['town']),
    noun('B1', 'torv', 'et', 'torve', 'e', 'Torv følger -e-mønsteret i flertal: torv → torve.', 'Torvene summede af liv om lørdagen.', ['town']),

    // Technology
    noun('A1', 'telefon', 'en', 'telefoner', 'er', 'Telefon får -er i flertal: telefon → telefoner.', 'Telefonerne ringede samtidig.', ['technology']),
    noun('A1', 'computer', 'en', 'computere', 'e', 'Computer får -e i flertal: computer → computere.', 'Computerne blev opdateret om natten.', ['technology']),
    noun('A2', 'skærm', 'en', 'skærme', 'e', 'Skærm følger -e-mønsteret i flertal: skærm → skærme.', 'Skærmene viste den samme fejlmeddelelse.', ['technology']),
    noun('B1', 'tastatur', 'et', 'tastaturer', 'er', 'Tastatur får -er i flertal: tastatur → tastaturer.', 'Tastaturerne var støvede efter mange års brug.', ['technology']),
    noun('A2', 'app', 'en', 'apps', 'foreign', 'App får -s i flertal ligesom i engelsk: app → apps.', 'Appsene fyldte for meget på telefonen.', ['technology'], true),
    noun('A2', 'kamera', 'et', 'kameraer', 'er', 'Kamera får -er i flertal: kamera → kameraer.', 'Kameraerne filmede hele koncerten.', ['technology']),
    noun('B1', 'printer', 'en', 'printere', 'e', 'Printer får -e i flertal: printer → printere.', 'Printerne var løbet tør for papir.', ['technology']),

    // Abstract & emotions
    noun('B1', 'idé', 'en', 'ideer', 'er', 'Idé får -er i flertal, og accenten udelades ofte: idé → ideer.', 'Ideerne blev skrevet ned på tavlen.', ['abstract'], true),
    noun('B1', 'tanke', 'en', 'tanker', 'er', 'Tanke får -r i flertal, da ordet ender på -e: tanke → tanker.', 'Tankerne kredsede om det samme emne.', ['abstract']),
    noun('B1', 'følelse', 'en', 'følelser', 'er', 'Følelse får -r i flertal, da ordet ender på -e: følelse → følelser.', 'Følelserne var svære at sætte ord på.', ['abstract']),
    noun('A2', 'glæde', 'en', 'glæder', 'er', 'Glæde får -r i flertal, da ordet ender på -e: glæde → glæder.', 'Glæderne ved sommeren var mange.', ['abstract']),
    noun('B2', 'sorg', 'en', 'sorger', 'er', 'Sorg får -er i flertal: sorg → sorger.', 'Sorgerne fyldte meget det år.', ['abstract']),
    noun('B2', 'frygt', 'en', 'frygte', 'e', 'Frygt bruges næsten altid i ental, men følger -e-mønsteret i flertal: frygt → frygte.', 'Frygtene viste sig at være ubegrundede.', ['abstract'], true),
    noun('B1', 'håb', 'et', 'håb', 'zero', 'Håb har samme form i ubestemt ental og flertal: et håb, håb.', 'Håbene om fred levede videre.', ['abstract']),
    noun('A2', 'plan', 'en', 'planer', 'er', 'Plan får -er i flertal: plan → planer.', 'Planerne blev ændret i sidste øjeblik.', ['abstract']),
    noun('B2', 'mulighed', 'en', 'muligheder', 'er', 'Mulighed får -er i flertal: mulighed → muligheder.', 'Mulighederne var mange for de studerende.', ['abstract']),
    noun('A2', 'problem', 'et', 'problemer', 'er', 'Problem får -er i flertal: problem → problemer.', 'Problemerne blev løst hurtigt.', ['abstract']),
    noun('B1', 'grund', 'en', 'grunde', 'e', 'Grund følger -e-mønsteret i flertal: grund → grunde.', 'Grundene til beslutningen var flere.', ['abstract']),

    // Professions & roles
    noun('A1', 'læge', 'en', 'læger', 'er', 'Læge får -r i flertal, da ordet ender på -e: læge → læger.', 'Lægerne tog imod patienterne.', ['work']),
    noun('A2', 'sygeplejerske', 'en', 'sygeplejersker', 'er', 'Sygeplejerske får -r i flertal, da ordet ender på -e: sygeplejerske → sygeplejersker.', 'Sygeplejerskerne arbejdede på nattevagt.', ['work']),
    noun('B1', 'ingeniør', 'en', 'ingeniører', 'er', 'Ingeniør får -er i flertal: ingeniør → ingeniører.', 'Ingeniørerne tegnede den nye bro.', ['work']),
    noun('B1', 'advokat', 'en', 'advokater', 'er', 'Advokat får -er i flertal: advokat → advokater.', 'Advokaterne mødtes i retten.', ['work']),
    noun('B1', 'journalist', 'en', 'journalister', 'er', 'Journalist får -er i flertal: journalist → journalister.', 'Journalisterne stillede mange spørgsmål.', ['work']),
    noun('B1', 'politibetjent', 'en', 'politibetjente', 'e', 'Politibetjent følger -e-mønsteret i flertal: politibetjent → politibetjente.', 'Politibetjentene regulerede trafikken.', ['work']),
    noun('B1', 'direktør', 'en', 'direktører', 'er', 'Direktør får -er i flertal: direktør → direktører.', 'Direktørerne holdt et langt møde.', ['work']),

    // Kitchen & objects
    noun('A1', 'kniv', 'en', 'knive', 'e', 'Kniv følger -e-mønsteret i flertal: kniv → knive.', 'Knivene blev slebet skarpe.', ['objects']),
    noun('A1', 'ske', 'en', 'skeer', 'er', 'Ske får -er i flertal: ske → skeer.', 'Skeerne lå i skuffen.', ['objects']),
    noun('A2', 'kande', 'en', 'kander', 'er', 'Kande får -r i flertal, da ordet ender på -e: kande → kander.', 'Kanderne var fyldt med saft.', ['objects']),
    noun('A2', 'gryde', 'en', 'gryder', 'er', 'Gryde får -r i flertal, da ordet ender på -e: gryde → gryder.', 'Gryderne kogte på komfuret.', ['objects']),
    noun('A2', 'pande', 'en', 'pander', 'er', 'Pande får -r i flertal, da ordet ender på -e: pande → pander.', 'Panderne hang over komfuret.', ['objects']),
    noun('A2', 'fad', 'et', 'fade', 'e', 'Fad følger -e-mønsteret i flertal: fad → fade.', 'Fadene blev båret ind til bordet.', ['objects']),
    noun('A2', 'krus', 'et', 'krus', 'zero', 'Krus har samme form i ubestemt ental og flertal: et krus, krus.', 'Krusene stod på hylden.', ['objects']),
    noun('A1', 'flaske', 'en', 'flasker', 'er', 'Flaske får -r i flertal, da ordet ender på -e: flaske → flasker.', 'Flaskerne blev sorteret til genbrug.', ['objects']),

    // Containers
    noun('A1', 'kasse', 'en', 'kasser', 'er', 'Kasse får -r i flertal, da ordet ender på -e: kasse → kasser.', 'Kasserne blev stablet i garagen.', ['objects']),
    noun('A2', 'æske', 'en', 'æsker', 'er', 'Æske får -r i flertal, da ordet ender på -e: æske → æsker.', 'Æskerne var fyldt med chokolade.', ['objects']),
    noun('A1', 'pose', 'en', 'poser', 'er', 'Pose får -r i flertal, da ordet ender på -e: pose → poser.', 'Poserne blev fyldt med varer.', ['objects']),
    noun('A1', 'taske', 'en', 'tasker', 'er', 'Taske får -r i flertal, da ordet ender på -e: taske → tasker.', 'Taskerne stod klar ved døren.', ['objects']),
    noun('A2', 'kuffert', 'en', 'kufferter', 'er', 'Kuffert får -er i flertal: kuffert → kufferter.', 'Kufferterne blev pakket dagen før.', ['objects']),
    noun('A2', 'kurv', 'en', 'kurve', 'e', 'Kurv følger -e-mønsteret i flertal: kurv → kurve.', 'Kurvene var fulde af æbler.', ['objects']),
    noun('A2', 'spand', 'en', 'spande', 'e', 'Spand følger -e-mønsteret i flertal: spand → spande.', 'Spandene stod fyldt med vand.', ['objects']),

    // Body
    noun('A2', 'hjerte', 'et', 'hjerter', 'er', 'Hjerte får -r i flertal, da ordet ender på -e: hjerte → hjerter.', 'Hjerterne bankede hurtigt af spænding.', ['body']),
    noun('B1', 'lunge', 'en', 'lunger', 'er', 'Lunge får -r i flertal, da ordet ender på -e: lunge → lunger.', 'Lungerne fyldtes med frisk luft.', ['body']),
    noun('B1', 'knogle', 'en', 'knogler', 'er', 'Knogle får -r i flertal, da ordet ender på -e: knogle → knogler.', 'Knoglerne var stærke og sunde.', ['body']),
    noun('A2', 'læbe', 'en', 'læber', 'er', 'Læbe får -r i flertal, da ordet ender på -e: læbe → læber.', 'Læberne var tørre af kulden.', ['body']),
    noun('A2', 'kind', 'en', 'kinder', 'er', 'Kind får -er i flertal: kind → kinder.', 'Kinderne blev røde af forlegenhed.', ['body']),
    noun('A1', 'hår', 'et', 'hår', 'zero', 'Hår har samme form i ubestemt ental og flertal: et hår, hår.', 'Hårene lå på badeværelsesgulvet.', ['body']),
    noun('A2', 'hud', 'en', 'huder', 'er', 'Hud får -er i flertal: hud → huder.', 'Huderne blev garvet til læder.', ['body']),

    // Nature & weather
    noun('A2', 'vind', 'en', 'vinde', 'e', 'Vind følger -e-mønsteret i flertal: vind → vinde.', 'Vindene kom fra vest.', ['nature']),
    noun('A2', 'lyn', 'et', 'lyn', 'zero', 'Lyn har samme form i ubestemt ental og flertal: et lyn, lyn.', 'Lynene oplyste hele himlen.', ['nature']),

    // Money & economy
    noun('A1', 'krone', 'en', 'kroner', 'er', 'Krone får -r i flertal, da ordet ender på -e: krone → kroner.', 'Kronerne lå i sparegrisen.', ['money']),
    noun('A2', 'regning', 'en', 'regninger', 'er', 'Regning får -er i flertal: regning → regninger.', 'Regningerne skulle betales inden månedens udgang.', ['money']),
    noun('B1', 'kvittering', 'en', 'kvitteringer', 'er', 'Kvittering får -er i flertal: kvittering → kvitteringer.', 'Kvitteringerne lå i posen.', ['money']),
    noun('A1', 'pris', 'en', 'priser', 'er', 'Pris får -er i flertal: pris → priser.', 'Priserne steg hen over året.', ['money']),

    // Town & society
    noun('A1', 'bank', 'en', 'banker', 'er', 'Bank får -er i flertal: bank → banker.', 'Bankerne lukkede klokken fire.', ['town']),
    noun('A2', 'apotek', 'et', 'apoteker', 'er', 'Apotek får -er i flertal: apotek → apoteker.', 'Apotekerne havde åbent i weekenden.', ['town']),
    noun('A2', 'sygehus', 'et', 'sygehuse', 'e', 'Sygehus følger -e-mønsteret i flertal: sygehus → sygehuse.', 'Sygehusene fik nyt udstyr.', ['town']),
    noun('B1', 'rådhus', 'et', 'rådhuse', 'e', 'Rådhus følger -e-mønsteret i flertal: rådhus → rådhuse.', 'Rådhusene lå centralt i byerne.', ['town']),
    noun('A1', 'bro', 'en', 'broer', 'er', 'Bro får -er i flertal: bro → broer.', 'Broerne forbandt de to øer.', ['town']),
    noun('A2', 'havn', 'en', 'havne', 'e', 'Havn følger -e-mønsteret i flertal: havn → havne.', 'Havnene var fulde af både.', ['town']),
    noun('A2', 'hospital', 'et', 'hospitaler', 'er', 'Hospital får -er i flertal: hospital → hospitaler.', 'Hospitalerne manglede senge.', ['town']),
    noun('A2', 'kiosk', 'en', 'kiosker', 'er', 'Kiosk får -er i flertal: kiosk → kiosker.', 'Kioskerne solgte aviser og slik.', ['town']),
    noun('A2', 'supermarked', 'et', 'supermarkeder', 'er', 'Supermarked får -er i flertal: supermarked → supermarkeder.', 'Supermarkederne havde tilbud om fredagen.', ['town']),

    // Food & drink
    noun('A1', 'brød', 'et', 'brød', 'zero', 'Brød har samme form i ubestemt ental og flertal: et brød, brød.', 'Brødene blev bagt tidligt om morgenen.', ['food']),
    noun('A1', 'ost', 'en', 'oste', 'e', 'Ost følger -e-mønsteret i flertal: ost → oste.', 'Ostene lå på et fad.', ['food']),
    noun('A1', 'pølse', 'en', 'pølser', 'er', 'Pølse får -r i flertal, da ordet ender på -e: pølse → pølser.', 'Pølserne blev grillet på pladen.', ['food']),
    noun('A1', 'kage', 'en', 'kager', 'er', 'Kage får -r i flertal, da ordet ender på -e: kage → kager.', 'Kagerne blev serveret til kaffen.', ['food']),
    noun('A2', 'suppe', 'en', 'supper', 'er', 'Suppe får -r i flertal, da ordet ender på -e: suppe → supper.', 'Supperne blev serveret varme.', ['food']),
    noun('A1', 'frugt', 'en', 'frugter', 'er', 'Frugt får -er i flertal: frugt → frugter.', 'Frugterne lå i skålen.', ['food']),
    noun('A2', 'grøntsag', 'en', 'grøntsager', 'er', 'Grøntsag får -er i flertal: grøntsag → grøntsager.', 'Grøntsagerne blev dampet let.', ['food']),
    noun('A1', 'fisk', 'en', 'fisk', 'zero', 'Fisk har samme form i ubestemt ental og flertal: en fisk, fisk.', 'Fiskene svømmede i akvariet.', ['food']),
    noun('A2', 'vin', 'en', 'vine', 'e', 'Vin følger -e-mønsteret i flertal: vin → vine.', 'Vinene blev smagt til middagen.', ['food']),
    noun('A1', 'appelsin', 'en', 'appelsiner', 'er', 'Appelsin får -er i flertal: appelsin → appelsiner.', 'Appelsinerne var søde og saftige.', ['food']),
    noun('A1', 'banan', 'en', 'bananer', 'er', 'Banan får -er i flertal: banan → bananer.', 'Bananerne blev gule i vindueskarmen.', ['food']),
    noun('A1', 'tomat', 'en', 'tomater', 'er', 'Tomat får -er i flertal: tomat → tomater.', 'Tomaterne modnede i drivhuset.', ['food']),
    noun('A2', 'løg', 'et', 'løg', 'zero', 'Løg har samme form i ubestemt ental og flertal: et løg, løg.', 'Løgene blev hakket fint.', ['food']),
    noun('A2', 'salat', 'en', 'salater', 'er', 'Salat får -er i flertal: salat → salater.', 'Salaterne blev anrettet på fade.', ['food']),

    // Sports & leisure
    noun('A1', 'bold', 'en', 'bolde', 'e', 'Bold følger -e-mønsteret i flertal: bold → bolde.', 'Boldene lå spredt på banen.', ['leisure']),
    noun('A2', 'mål', 'et', 'mål', 'zero', 'Mål har samme form i ubestemt ental og flertal: et mål, mål.', 'Målene blev scoret i anden halvleg.', ['leisure']),
    noun('A1', 'kamp', 'en', 'kampe', 'e', 'Kamp følger -e-mønsteret i flertal: kamp → kampe.', 'Kampene blev spillet om søndagen.', ['leisure']),
    noun('A2', 'hold', 'et', 'hold', 'zero', 'Hold har samme form i ubestemt ental og flertal: et hold, hold.', 'Holdene mødtes i finalen.', ['leisure']),
    noun('A2', 'bane', 'en', 'baner', 'er', 'Bane får -r i flertal, da ordet ender på -e: bane → baner.', 'Banerne blev kridtet op før kampen.', ['leisure']),
    noun('A2', 'leg', 'en', 'lege', 'e', 'Leg følger -e-mønsteret i flertal: leg → lege.', 'Legene i skolegården var vilde.', ['leisure']),
    noun('A1', 'gave', 'en', 'gaver', 'er', 'Gave får -r i flertal, da ordet ender på -e: gave → gaver.', 'Gaverne lå under juletræet.', ['leisure']),
    noun('A1', 'fest', 'en', 'fester', 'er', 'Fest får -er i flertal: fest → fester.', 'Festerne varede til langt ud på natten.', ['leisure']),
    noun('A1', 'film', 'en', 'film', 'zero', 'Film har samme form i ubestemt ental og flertal: en film, film.', 'Filmene blev vist på festivalen.', ['leisure']),
    noun('A1', 'sang', 'en', 'sange', 'e', 'Sang følger -e-mønsteret i flertal: sang → sange.', 'Sangene blev sunget i kor.', ['leisure']),
    noun('A1', 'billede', 'et', 'billeder', 'er', 'Billede får -r i flertal, da ordet ender på -e: billede → billeder.', 'Billederne hang på væggen.', ['leisure']),

    // Abstract & society
    noun('B2', 'rettighed', 'en', 'rettigheder', 'er', 'Rettighed får -er i flertal: rettighed → rettigheder.', 'Rettighederne er beskyttet af loven.', ['abstract']),
    noun('B1', 'lov', 'en', 'love', 'e', 'Lov følger -e-mønsteret i flertal: lov → love.', 'Lovene blev vedtaget i Folketinget.', ['abstract']),
    noun('A2', 'fejl', 'en', 'fejl', 'zero', 'Fejl har samme form i ubestemt ental og flertal: en fejl, fejl.', 'Fejlene blev rettet inden aflevering.', ['abstract']),
    noun('A1', 'svar', 'et', 'svar', 'zero', 'Svar har samme form i ubestemt ental og flertal: et svar, svar.', 'Svarene stod bag i bogen.', ['abstract']),
    noun('A1', 'spørgsmål', 'et', 'spørgsmål', 'zero', 'Spørgsmål har samme form i ubestemt ental og flertal: et spørgsmål, spørgsmål.', 'Spørgsmålene var svære at besvare.', ['abstract']),
    noun('A1', 'historie', 'en', 'historier', 'er', 'Historie får -r i flertal, da ordet ender på -e: historie → historier.', 'Historierne blev fortalt igen og igen.', ['abstract']),
    noun('A2', 'sætning', 'en', 'sætninger', 'er', 'Sætning får -er i flertal: sætning → sætninger.', 'Sætningerne blev rettet af læreren.', ['abstract']),
    noun('A1', 'sprog', 'et', 'sprog', 'zero', 'Sprog har samme form i ubestemt ental og flertal: et sprog, sprog.', 'Sprogene i Europa er mange.', ['abstract']),
    noun('A1', 'navn', 'et', 'navne', 'e', 'Navn følger -e-mønsteret i flertal: navn → navne.', 'Navnene blev råbt op ét for ét.', ['abstract']),
    noun('A2', 'liv', 'et', 'liv', 'zero', 'Liv har samme form i ubestemt ental og flertal: et liv, liv.', 'Livene blev reddet af redningsmandskabet.', ['abstract']),
    noun('B1', 'sandhed', 'en', 'sandheder', 'er', 'Sandhed får -er i flertal: sandhed → sandheder.', 'Sandhederne kom langsomt frem.', ['abstract']),
    noun('B1', 'løgn', 'en', 'løgne', 'e', 'Løgn følger -e-mønsteret i flertal: løgn → løgne.', 'Løgnene blev hurtigt afsløret.', ['abstract']),
    noun('A2', 'mening', 'en', 'meninger', 'er', 'Mening får -er i flertal: mening → meninger.', 'Meningerne var delte i gruppen.', ['abstract']),
    noun('B1', 'beslutning', 'en', 'beslutninger', 'er', 'Beslutning får -er i flertal: beslutning → beslutninger.', 'Beslutningerne blev truffet i fællesskab.', ['abstract']),
    noun('B1', 'oplevelse', 'en', 'oplevelser', 'er', 'Oplevelse får -r i flertal, da ordet ender på -e: oplevelse → oplevelser.', 'Oplevelserne fra rejsen sad længe i dem.', ['abstract']),
    noun('B1', 'forhold', 'et', 'forhold', 'zero', 'Forhold har samme form i ubestemt ental og flertal: et forhold, forhold.', 'Forholdene på arbejdspladsen blev bedre.', ['abstract']),
    noun('B1', 'samfund', 'et', 'samfund', 'zero', 'Samfund har samme form i ubestemt ental og flertal: et samfund, samfund.', 'Samfundene udviklede sig hver for sig.', ['abstract']),
    noun('A2', 'krig', 'en', 'krige', 'e', 'Krig følger -e-mønsteret i flertal: krig → krige.', 'Krigene prægede hele århundredet.', ['abstract']),

    // Animals
    noun('B1', 'orm', 'en', 'orme', 'e', 'Orm følger -e-mønsteret i flertal: orm → orme.', 'Ormene gravede sig ned i jorden.', ['animals']),
    noun('A2', 'får', 'et', 'får', 'zero', 'Får har samme form i ubestemt ental og flertal: et får, får.', 'Fårene græssede på engen.', ['animals']),
    noun('A2', 'kanin', 'en', 'kaniner', 'er', 'Kanin får -er i flertal: kanin → kaniner.', 'Kaninerne hoppede rundt i buret.', ['animals']),
    noun('A2', 'måge', 'en', 'måger', 'er', 'Måge får -r i flertal, da ordet ender på -e: måge → måger.', 'Mågerne kredsede over havnen.', ['animals']),
    noun('B1', 'ørn', 'en', 'ørne', 'e', 'Ørn følger -e-mønsteret i flertal: ørn → ørne.', 'Ørnene svævede højt over bjergene.', ['animals']),
    noun('A2', 'sommerfugl', 'en', 'sommerfugle', 'e', 'Sommerfugl følger -e-mønsteret i flertal: sommerfugl → sommerfugle.', 'Sommerfuglene flagrede mellem blomsterne.', ['animals']),
    noun('A2', 'myre', 'en', 'myrer', 'er', 'Myre får -r i flertal, da ordet ender på -e: myre → myrer.', 'Myrerne byggede en stor tue.', ['animals']),
    noun('A2', 'ged', 'en', 'geder', 'er', 'Ged får -er i flertal: ged → geder.', 'Gederne klatrede op ad skrænten.', ['animals']),
    noun('A2', 'kylling', 'en', 'kyllinger', 'er', 'Kylling får -er i flertal: kylling → kyllinger.', 'Kyllingerne pippede i kurven.', ['animals']),
    noun('B1', 'rotte', 'en', 'rotter', 'er', 'Rotte får -r i flertal, da ordet ender på -e: rotte → rotter.', 'Rotterne gemte sig i kælderen.', ['animals']),
    noun('B1', 'delfin', 'en', 'delfiner', 'er', 'Delfin får -er i flertal: delfin → delfiner.', 'Delfinerne fulgte skibet.', ['animals']),

    // Technology
    noun('A2', 'fjernsyn', 'et', 'fjernsyn', 'zero', 'Fjernsyn har samme form i ubestemt ental og flertal: et fjernsyn, fjernsyn.', 'Fjernsynene stod tændt i hver stue.', ['technology']),
    noun('A2', 'radio', 'en', 'radioer', 'er', 'Radio får -er i flertal: radio → radioer.', 'Radioerne spillede den samme sang.', ['technology']),
    noun('A2', 'fil', 'en', 'filer', 'er', 'Fil får -er i flertal: fil → filer.', 'Filerne blev gemt på computeren.', ['technology']),
    noun('A2', 'mappe', 'en', 'mapper', 'er', 'Mappe får -r i flertal, da ordet ender på -e: mappe → mapper.', 'Mapperne blev sorteret efter dato.', ['technology']),
    noun('B1', 'ledning', 'en', 'ledninger', 'er', 'Ledning får -er i flertal: ledning → ledninger.', 'Ledningerne lå viklet sammen bag skrivebordet.', ['technology'])
  ];

  window.DANSK_NOUNS = MANUAL.concat(REGULAR);
})();
