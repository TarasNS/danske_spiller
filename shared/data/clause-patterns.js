// shared/data/clause-patterns.js
// Canonical Danish clause-transformation templates. Exports window.DANSK_CLAUSES.
// Used by Sætningsmaskinen and Tidsmaskinen to build per-game exercise items.
// Schema (see prd.md § 1.7):
// { id, type, level, main_template, sub_template, note, verify, ...type-specific marker field }
// type in: main_to_subordinate | question_formation | indirect_question |
//          relative_clause | der_det | conditional | passive | infinitive | imperative
(function () {
  'use strict';

  var clauses = [

    // -- main_to_subordinate --------------------------------------------
    // Coverage: at, fordi, selvom, hvis, når, da, mens, før, efter at.
    // Each pair demonstrates that a sentence adverb (ikke, altid, aldrig,
    // ofte, måske, sandsynligvis, heldigvis, desværre, allerede) moves to
    // before the finite verb once the clause becomes subordinate.
    { id: 'at-ikke', type: 'main_to_subordinate', conjunction: 'at', main_template: 'Han kommer ikke i dag.', sub_template: 'Jeg ved, at han ikke kommer i dag.', note: 'I ledsætninger indledt med at står sætningsadverbialet (fx ikke) før det finitte verbum, ikke efter som i hovedsætninger.', level: 'A2', verify: false },
    { id: 'at-allerede', type: 'main_to_subordinate', conjunction: 'at', main_template: 'Hun er allerede gået.', sub_template: 'Jeg tror, at hun allerede er gået.', note: 'Adverbialet allerede placeres mellem subjekt og det finitte verbum i ledsætningen.', level: 'A2', verify: false },
    { id: 'fordi-ikke', type: 'main_to_subordinate', conjunction: 'fordi', main_template: 'Han spiser ikke morgenmad.', sub_template: 'Han er sulten, fordi han ikke spiser morgenmad.', note: 'Fordi-sætningen følger ledsætningens ordstilling: subjekt - adverbial - finit verbum.', level: 'A2', verify: false },
    { id: 'fordi-altid', type: 'main_to_subordinate', conjunction: 'fordi', main_template: 'Hun er altid glad.', sub_template: 'Vi kan lide hende, fordi hun altid er glad.', note: 'Altid står før det finitte verbum i fordi-ledsætningen.', level: 'A2', verify: false },
    { id: 'selvom-ikke', type: 'main_to_subordinate', conjunction: 'selvom', main_template: 'Det regner ikke i dag.', sub_template: 'Vi tager en paraply med, selvom det ikke regner i dag.', note: 'Selvom indleder en indrømmende ledsætning; ikke står før verbet regner.', level: 'B1', verify: false },
    { id: 'selvom-maaske', type: 'main_to_subordinate', conjunction: 'selvom', main_template: 'Han kommer måske for sent.', sub_template: 'Vi venter på ham, selvom han måske kommer for sent.', note: 'Måske står før det finitte verbum kommer i ledsætningen.', level: 'B1', verify: false },
    { id: 'hvis-ikke', type: 'main_to_subordinate', conjunction: 'hvis', main_template: 'Det regner ikke.', sub_template: 'Vi tager en gåtur, hvis det ikke regner.', note: 'Hvis indleder en betingelsesledsætning med ledsætningsordstilling: ikke før regner.', level: 'A2', verify: false },
    { id: 'hvis-sandsynligvis', type: 'main_to_subordinate', conjunction: 'hvis', main_template: 'Toget bliver sandsynligvis forsinket.', sub_template: 'Ring til mig, hvis toget sandsynligvis bliver forsinket.', note: 'Sandsynligvis placeres mellem subjekt og finit verbum i hvis-ledsætningen.', level: 'B1', verify: false },
    { id: 'naar-ikke', type: 'main_to_subordinate', conjunction: 'når', main_template: 'Hun har det ikke godt.', sub_template: 'Hun bliver hjemme, når hun ikke har det godt.', note: 'Når bruges om gentagne eller fremtidige tidspunkter; ikke står før har.', level: 'A2', verify: false },
    { id: 'naar-ofte', type: 'main_to_subordinate', conjunction: 'når', main_template: 'Bussen kommer ofte for sent.', sub_template: 'Jeg bliver irriteret, når bussen ofte kommer for sent.', note: 'Ofte placeres før det finitte verbum kommer i når-ledsætningen.', level: 'A2', verify: false },
    { id: 'da-ikke', type: 'main_to_subordinate', conjunction: 'da', main_template: 'Han var ikke hjemme.', sub_template: 'Jeg ringede, da han ikke var hjemme.', note: 'Da bruges om ét enkeltstående tidspunkt i fortiden; ikke står før var.', level: 'B1', verify: false },
    { id: 'da-heldigvis', type: 'main_to_subordinate', conjunction: 'da', main_template: 'Vejret var heldigvis godt.', sub_template: 'Vi tog på picnic, da vejret heldigvis var godt.', note: 'Heldigvis placeres mellem subjekt og det finitte verbum i da-ledsætningen.', level: 'B1', verify: false },
    { id: 'mens-ikke', type: 'main_to_subordinate', conjunction: 'mens', main_template: 'Hun laver ikke aftensmad i aften.', sub_template: 'Vi bestiller takeaway, mens hun ikke laver aftensmad i aften.', note: 'Mens udtrykker samtidighed; ikke står før laver i ledsætningen.', level: 'B1', verify: false },
    { id: 'mens-desvaerre', type: 'main_to_subordinate', conjunction: 'mens', main_template: 'Det regnede desværre meget.', sub_template: 'Vi blev hjemme, mens det desværre regnede meget.', note: 'Desværre placeres før det finitte verbum regnede i mens-ledsætningen.', level: 'B1', verify: false },
    { id: 'foer-plan', type: 'main_to_subordinate', conjunction: 'før', main_template: 'Vi spiser.', sub_template: 'Vask hænderne, før vi spiser.', note: 'Før indleder en tidsledsætning; det finitte verbum står efter subjektet ligesom i andre ledsætninger.', level: 'B1', verify: false },
    { id: 'efter-at-plan', type: 'main_to_subordinate', conjunction: 'efter at', main_template: 'Gæsterne var gået hjem.', sub_template: 'Vi ryddede op, efter at gæsterne var gået hjem.', note: 'Efter at indleder en ledsætning, der beskriver noget, der sker forud for hovedsætningens handling.', level: 'B1', verify: false },

    // -- question_formation ----------------------------------------------
    // Coverage: yes/no, hv-questions, questions with prepositions, subject
    // questions, object questions.
    { id: 'spm-jn-bor', type: 'question_formation', question_type: 'yes_no', main_template: 'Du bor her.', sub_template: 'Bor du her?', note: 'Ja/nej-spørgsmål dannes ved at flytte det finitte verbum foran subjektet.', level: 'A1', verify: false },
    { id: 'spm-jn-ikke', type: 'question_formation', question_type: 'yes_no', main_template: 'Han kommer ikke.', sub_template: 'Kommer han ikke?', note: 'Ikke bliver stående efter subjektet, selvom verbet flytter forrest.', level: 'A1', verify: false },
    { id: 'spm-hv-sted', type: 'question_formation', question_type: 'hv_place', main_template: 'Du bor et sted.', sub_template: 'Hvor bor du?', note: 'Hv-ordet står forrest, efterfulgt af det finitte verbum og så subjektet.', level: 'A1', verify: false },
    { id: 'spm-subjekt', type: 'question_formation', question_type: 'subject_question', main_template: 'Nogen bor her.', sub_template: 'Hvem bor her?', note: 'Ved subjektsspørgsmål bevares den almindelige ordstilling, fordi hv-ordet selv er subjekt.', level: 'A2', verify: false },
    { id: 'spm-objekt-praep', type: 'question_formation', question_type: 'object_question_stranded_prep', main_template: 'Du taler med nogen.', sub_template: 'Hvem taler du med?', note: 'Præpositionen med flyttes til sætningens slutning; hv-ordet erstatter objektet for præpositionen.', level: 'B1', verify: false },
    { id: 'spm-praep-ting', type: 'question_formation', question_type: 'object_question_stranded_prep', main_template: 'Du tænker på noget.', sub_template: 'Hvad tænker du på?', note: 'Samme mønster som med personer: præpositionen på strandes til sidst.', level: 'B1', verify: false },
    { id: 'spm-hv-tid', type: 'question_formation', question_type: 'hv_time', main_template: 'Toget går på et tidspunkt.', sub_template: 'Hvornår går toget?', note: 'Hvornår står forrest, efterfulgt af finit verbum og subjekt.', level: 'A2', verify: false },
    { id: 'spm-hv-grund', type: 'question_formation', question_type: 'hv_reason', main_template: 'Hun græder af en grund.', sub_template: 'Hvorfor græder hun?', note: 'Hvorfor spørger til årsag og følger samme ordstilling som andre hv-spørgsmål.', level: 'A2', verify: false },
    { id: 'spm-hv-maade', type: 'question_formation', question_type: 'hv_manner', main_template: 'Det virker på en måde.', sub_template: 'Hvordan virker det?', note: 'Hvordan spørger til måde/metode.', level: 'A2', verify: false },
    { id: 'spm-jn-modal', type: 'question_formation', question_type: 'yes_no', main_template: 'Du kan svømme.', sub_template: 'Kan du svømme?', note: 'Modalverbet kan flyttes forrest ligesom andre finitte verber i ja/nej-spørgsmål.', level: 'A1', verify: false },

    // -- indirect_question -------------------------------------------------
    // Coverage: no inversion, om for yes/no content, hv- + der for subject
    // questions, punctuation.
    { id: 'indir-om-bor', type: 'indirect_question', main_template: 'Bor du her?', frame: 'Jeg spørger, ...', sub_template: 'Jeg spørger, om du bor her.', note: 'Ja/nej-spørgsmål bliver til om-ledsætninger uden invertering af subjekt og verbum.', level: 'B1', verify: false },
    { id: 'indir-hv-sted', type: 'indirect_question', main_template: 'Hvor bor du?', frame: 'Jeg ved ikke, ...', sub_template: 'Jeg ved ikke, hvor du bor.', note: 'Ingen invertering i den indirekte ledsætning: hv-ord + subjekt + verbum.', level: 'B1', verify: false },
    { id: 'indir-hvem-der', type: 'indirect_question', main_template: 'Hvem kommer?', frame: 'Jeg ved ikke, ...', sub_template: 'Jeg ved ikke, hvem der kommer.', note: 'Når hv-ordet er subjekt i den underforståede sætning, tilføjes der.', level: 'B1', verify: false },
    { id: 'indir-hvem-objekt', type: 'indirect_question', main_template: 'Hvem taler du med?', frame: 'Kan du fortælle mig, ...', sub_template: 'Kan du fortælle mig, hvem du taler med?', note: 'Her er hv-ordet objekt, så der tilføjes ikke der, og den strandede præposition bevares.', level: 'B1', verify: false },
    { id: 'indir-hvornaar', type: 'indirect_question', main_template: 'Hvornår går toget?', frame: 'Ved du, ...', sub_template: 'Ved du, hvornår toget går?', note: 'Ingen invertering: hvornår + subjekt + verbum.', level: 'B1', verify: false },
    { id: 'indir-hvorfor', type: 'indirect_question', main_template: 'Hvorfor kom hun for sent?', frame: 'Jeg forstår ikke, ...', sub_template: 'Jeg forstår ikke, hvorfor hun kom for sent.', note: 'Det indirekte spørgsmål følger ledsætningsordstilling uden inversion.', level: 'B1', verify: false },
    { id: 'indir-om-negativ', type: 'indirect_question', main_template: 'Kommer han i morgen?', frame: 'Jeg er ikke sikker på, ...', sub_template: 'Jeg er ikke sikker på, om han kommer i morgen.', note: 'Om introducerer det underforståede ja/nej-spørgsmål.', level: 'B1', verify: false },
    { id: 'indir-hvordan', type: 'indirect_question', main_template: 'Hvordan virker maskinen?', frame: 'Han forklarede, ...', sub_template: 'Han forklarede, hvordan maskinen virker.', note: 'Ingen invertering; hvordan + subjekt + verbum.', level: 'B2', verify: false },
    { id: 'indir-hvad-der', type: 'indirect_question', main_template: 'Hvad skete der?', frame: 'Fortæl mig, ...', sub_template: 'Fortæl mig, hvad der skete.', note: 'Hvad som subjekt kræver der ligesom hvem.', level: 'B1', verify: false },
    { id: 'indir-punktum', type: 'indirect_question', main_template: 'Er han hjemme?', frame: 'Ved du, ...', sub_template: 'Ved du, om han er hjemme?', note: 'Komma adskiller hovedsætning og indirekte spørgsmål; spørgsmålstegnet afhænger af, om hele ytringen selv er et spørgsmål.', level: 'B1', verify: false },

    // -- relative_clause ---------------------------------------------------
    // Coverage: som, der, hvor, hvis, hvilket, hvad; omission where object.
    { id: 'rel-som-objekt', type: 'relative_clause', relative_word: 'som', omittable: true, main_template: 'Bogen er lang. Jeg læser bogen.', sub_template: 'Bogen, som jeg læser, er lang.', note: 'Som er objekt i relativsætningen og kan udelades: Bogen, jeg læser, er lang.', level: 'B1', verify: false },
    { id: 'rel-der-subjekt', type: 'relative_clause', relative_word: 'der', omittable: false, main_template: 'Manden står der. Manden er min lærer.', sub_template: 'Manden, der står der, er min lærer.', note: 'Der er subjekt i relativsætningen og kan ikke udelades.', level: 'A2', verify: false },
    { id: 'rel-hvor-sted', type: 'relative_clause', relative_word: 'hvor', omittable: false, main_template: 'Byen ligger mod nord. Hun bor i byen.', sub_template: 'Byen, hvor hun bor, ligger mod nord.', note: 'Hvor bruges om sted og erstatter en præpositionsforbindelse (i byen).', level: 'B1', verify: false },
    { id: 'rel-hvis-eje', type: 'relative_clause', relative_word: 'hvis', omittable: false, main_template: 'En person ringede. Jeg har glemt personens navn.', sub_template: 'En person, hvis navn jeg har glemt, ringede.', note: 'Hvis udtrykker ejerskab i relativsætningen: navnet tilhører personen.', level: 'B2', verify: false },
    { id: 'rel-som-subjekt', type: 'relative_clause', relative_word: 'som', omittable: false, main_template: 'Manden kommer i morgen. Manden bor her.', sub_template: 'Manden, som bor her, kommer i morgen.', note: 'Her er som subjekt i relativsætningen og kan ikke udelades.', level: 'A2', verify: false },
    { id: 'rel-som-objekt-variant', type: 'relative_clause', relative_word: 'som', omittable: true, main_template: 'Filmen var kedelig. Vi så filmen i går.', sub_template: 'Filmen, som vi så i går, var kedelig.', note: 'Objektets relativpronomen kan udelades: Filmen, vi så i går, var kedelig.', level: 'B1', verify: false },
    { id: 'rel-hvilket', type: 'relative_clause', relative_word: 'hvilket', omittable: false, main_template: 'Hun bestod eksamen. Det glædede alle.', sub_template: 'Hun bestod eksamen, hvilket glædede alle.', note: 'Hvilket refererer til hele den foregående sætning, ikke til et enkelt navneord.', level: 'B2', verify: false },
    { id: 'rel-hvad-frit', type: 'relative_clause', relative_word: 'hvad', omittable: false, main_template: 'Han sagde noget. Det er ikke sandt.', sub_template: 'Hvad han sagde, er ikke sandt.', note: 'Hvad bruges som frit relativ uden et udtrykkeligt antecedent.', level: 'B2', verify: false },
    { id: 'rel-der-alt', type: 'relative_clause', relative_word: 'der', omittable: false, main_template: 'Bogen ligger på bordet. Bogen tilhører mig.', sub_template: 'Bogen, der ligger på bordet, tilhører mig.', note: 'Der kan bruges i stedet for som, når relativpronomenet er subjekt.', level: 'A2', verify: false },
    { id: 'rel-som-praep', type: 'relative_clause', relative_word: 'som', omittable: true, main_template: 'Manden er min chef. Jeg arbejder for manden.', sub_template: 'Manden, som jeg arbejder for, er min chef.', note: 'Præpositionen for strandes til sidst; det udeladelige som er objekt for præpositionen: Manden, jeg arbejder for, er min chef.', level: 'B2', verify: false },

    // -- der_det -------------------------------------------------------
    // Coverage: weather/impersonal det, extraposition det, existential der,
    // locative der, presentational constructions.
    { id: 'der-det-vejr', type: 'der_det', construction: 'weather_det', main_template: '', sub_template: 'Det regner.', note: 'Det bruges upersonligt om vejr uden reference til noget bestemt.', level: 'A1', verify: false },
    { id: 'der-det-ekstraposition', type: 'der_det', construction: 'extraposition_det', main_template: '', sub_template: 'Det er svært at lære dansk.', note: 'Det er foreløbigt subjekt; det egentlige subjekt er infinitivledet at lære dansk.', level: 'A2', verify: false },
    { id: 'der-eksistentiel', type: 'der_det', construction: 'existential_der', main_template: '', sub_template: 'Der er mange mennesker her.', note: 'Der introducerer noget nyt og ubestemt; det egentlige subjekt (mange mennesker) står efter verbet.', level: 'A2', verify: false },
    { id: 'der-lokativ', type: 'der_det', construction: 'locative_der', main_template: '', sub_template: 'Han bor der.', note: 'Her er der et stedsadverbial, ikke det formelle eksistentielle der.', level: 'A1', verify: false },
    { id: 'der-praesentation', type: 'der_det', construction: 'presentational_der', main_template: '', sub_template: 'Der står en bil udenfor.', note: 'Der + verbum + ubestemt subjekt bruges til at præsentere noget nyt for lytteren.', level: 'A2', verify: false },
    { id: 'der-det-kontrast', type: 'der_det', construction: 'der_vs_det_contrast', main_template: 'Der er en fejl i teksten.', sub_template: 'Det er en fejl i teksten, at datoen mangler.', note: 'Der introducerer en ubestemt størrelse; det henviser foreløbigt til en efterfølgende at-sætning.', level: 'B1', verify: false },
    { id: 'der-det-adjektiv-infinitiv', type: 'der_det', construction: 'extraposition_det', main_template: '', sub_template: 'Det er dejligt at være hjemme.', note: 'Det er foreløbigt subjekt for infinitivledet at være hjemme.', level: 'A2', verify: false },
    { id: 'der-eksistentiel-negation', type: 'der_det', construction: 'existential_der', main_template: '', sub_template: 'Der er ikke plads til flere.', note: 'Ikke placeres efter det finitte verbum og før subjektet i denne konstruktion.', level: 'B1', verify: false },
    { id: 'der-det-vejr-2', type: 'der_det', construction: 'weather_det', main_template: '', sub_template: 'Det sner meget om vinteren i Norge.', note: 'Vejrudtryk med det kan ikke erstattes af der.', level: 'A1', verify: false },
    { id: 'der-praesentation-negation', type: 'der_det', construction: 'presentational_der', main_template: '', sub_template: 'Der kommer ingen gæster i dag.', note: 'Præsentationelt der bruges også med negerede ubestemte subjekter.', level: 'B1', verify: false },

    // -- conditional --------------------------------------------------
    // Coverage: real/open conditions, hypothetical present, counterfactual
    // past, polite hypothetical forms.
    { id: 'kond-aaben', type: 'conditional', conditional_type: 'real_open', main_template: '', sub_template: 'Hvis det regner, bliver vi hjemme.', note: 'Åben/realistisk betingelse: nutid i både hvis-sætningen og hovedsætningen.', level: 'A2', verify: false },
    { id: 'kond-aaben-bydemaade', type: 'conditional', conditional_type: 'real_open', main_template: '', sub_template: 'Hvis du er sulten, så spis noget.', note: 'Hvis-sætning efterfulgt af en hovedsætning i bydemåde.', level: 'A2', verify: false },
    { id: 'kond-hypotetisk-nutid', type: 'conditional', conditional_type: 'hypothetical_present', main_template: '', sub_template: 'Hvis jeg havde tid, ville jeg hjælpe.', note: 'Datid i hvis-sætningen (havde) + ville + infinitiv udtrykker en uvirkelig nutidsbetingelse.', level: 'B1', verify: false },
    { id: 'kond-kontrafaktisk-fortid', type: 'conditional', conditional_type: 'counterfactual_past', main_template: '', sub_template: 'Hvis hun havde ringet, var jeg kommet.', note: 'Pluskvamperfektum i begge led udtrykker en betingelse, der ikke blev opfyldt i fortiden.', level: 'B2', verify: false },
    { id: 'kond-kontrafaktisk-ville-have', type: 'conditional', conditional_type: 'counterfactual_past', main_template: '', sub_template: 'Hvis hun havde ringet, ville jeg være kommet.', note: 'Alternativ konstruktion med ville + være + kort tillægsform i stedet for pluskvamperfektum.', level: 'B2', verify: false },
    { id: 'kond-hoeflig', type: 'conditional', conditional_type: 'polite_hypothetical', main_template: '', sub_template: 'Det ville være dejligt, hvis du kunne hjælpe.', note: 'Ville + kunne udtrykker en høflig, hypotetisk anmodning.', level: 'B1', verify: false },
    { id: 'kond-aaben-fremtid', type: 'conditional', conditional_type: 'real_open', main_template: '', sub_template: 'Hvis vejret bliver godt, tager vi til stranden i weekenden.', note: 'Nutid i hvis-sætningen kan referere til fremtiden.', level: 'A2', verify: false },
    { id: 'kond-hypotetisk-omvendt', type: 'conditional', conditional_type: 'hypothetical_present', main_template: '', sub_template: 'Jeg ville hjælpe, hvis jeg havde tid.', note: 'Rækkefølgen af ledsætning og hovedsætning kan byttes om uden at ændre betydningen.', level: 'B1', verify: false },

    // -- passive --------------------------------------------------------
    // Coverage: active, -s passive, blive passive, være+participle state,
    // impersonal passive, der + passive.
    { id: 'pas-aktiv', type: 'passive', voice: 'active', main_template: 'Vagten åbner døren.', sub_template: 'Vagten åbner døren.', note: 'Aktiv sætning: subjektet (vagten) udfører selv handlingen.', level: 'A2', verify: false },
    { id: 'pas-s-passiv', type: 'passive', voice: 's_passive', main_template: 'Vagten åbner døren.', sub_template: 'Døren åbnes af vagten.', note: '-s-passiv er almindelig i skriftsprog og ved generelle eller gentagne handlinger.', level: 'B1', verify: false },
    { id: 'pas-blive-passiv', type: 'passive', voice: 'blive_passive', main_template: 'Vagten åbner døren.', sub_template: 'Døren bliver åbnet af vagten.', note: 'Blive-passiv er almindelig i talesprog og fremhæver selve handlingen/processen.', level: 'B1', verify: false },
    { id: 'pas-vaere-tilstand', type: 'passive', voice: 'state_participle', main_template: '', sub_template: 'Døren er åbnet.', note: 'Være + kort tillægsform udtrykker en tilstand efter en handling, ikke selve handlingen.', level: 'B1', verify: false },
    { id: 'pas-upersonlig', type: 'passive', voice: 'impersonal_passive', main_template: '', sub_template: 'Der bliver danset på gaden.', note: 'Upersonlig passiv uden noget egentligt grammatisk subjekt ud over der.', level: 'B2', verify: false },
    { id: 'pas-der-s-passiv', type: 'passive', voice: 'der_s_passive', main_template: '', sub_template: 'Der tales dansk her.', note: 'Der + -s-passiv bruges, når der ikke er noget bestemt subjekt at fremhæve.', level: 'B1', verify: false },
    { id: 'pas-aktiv-s-kontrast', type: 'passive', voice: 's_passive', main_template: 'Firmaet sælger produktet globalt.', sub_template: 'Produktet sælges globalt.', note: 'Agenten (firmaet) kan udelades i -s-passiv, når den er uvigtig eller ukendt.', level: 'B1', verify: false },
    { id: 'pas-modal-s-passiv', type: 'passive', voice: 's_passive', main_template: 'Vagten skal åbne døren.', sub_template: 'Døren skal åbnes af vagten.', note: 'Efter modalverber bruges næsten altid -s-passiv, ikke blive-passiv.', level: 'B1', verify: false },

    // -- infinitive -----------------------------------------------------
    // Coverage: modal + infinitive without at, at after lexical verbs,
    // for at, ved at, til at, perception verbs, causative få, lade.
    { id: 'inf-modal', type: 'infinitive', construction: 'modal_bare_infinitive', main_template: '', sub_template: 'Jeg kan svømme.', note: 'Efter modalverber (kan, vil, skal, må, bør) udelades at foran infinitiven.', level: 'A1', verify: false },
    { id: 'inf-at-fuldverbum', type: 'infinitive', construction: 'at_after_lexical_verb', main_template: '', sub_template: 'Jeg prøver at lære dansk.', note: 'Efter mange fuldverber (prøve, håbe, elske) kræves at foran den efterfølgende infinitiv.', level: 'A2', verify: false },
    { id: 'inf-for-at', type: 'infinitive', construction: 'for_at_purpose', main_template: '', sub_template: 'Hun gik tidligt for at nå toget.', note: 'For at indleder en formålskonstruktion: gøre noget med et bestemt formål.', level: 'A2', verify: false },
    { id: 'inf-ved-at', type: 'infinitive', construction: 'ved_at_means', main_template: '', sub_template: 'Man lærer ved at øve sig.', note: 'Ved at udtrykker midlet eller måden, noget sker på.', level: 'B1', verify: false },
    { id: 'inf-til-at', type: 'infinitive', construction: 'til_at_capacity', main_template: '', sub_template: 'Han er ikke i stand til at hjælpe lige nu.', note: 'Til at bruges ofte efter adjektiver/substantiver, der udtrykker evne eller formål.', level: 'B1', verify: false },
    { id: 'inf-sanseverbum', type: 'infinitive', construction: 'perception_verb_bare_infinitive', main_template: '', sub_template: 'Jeg så ham løbe over gaden.', note: 'Efter sanseverber som se og høre udelades at, og infinitiven følger direkte efter objektet.', level: 'B1', verify: false },
    { id: 'inf-faa-kausativ', type: 'infinitive', construction: 'faa_causative', main_template: '', sub_template: 'Hun fik ham til at grine.', note: 'Få + objekt + til at + infinitiv udtrykker at forårsage, at nogen gør noget.', level: 'B1', verify: false },
    { id: 'inf-lade', type: 'infinitive', construction: 'lade_bare_infinitive', main_template: '', sub_template: 'Lad mig hjælpe dig.', note: 'Lade + objekt + infinitiv (uden at) udtrykker tilladelse eller opfordring.', level: 'B1', verify: false },

    // -- imperative -----------------------------------------------------
    // Coverage: regular forms, irregular high-frequency imperatives,
    // negative instructions, polite alternatives, particles, lad være med at.
    { id: 'imp-regelmaessig', type: 'imperative', imperative_type: 'regular', main_template: 'Du lukker døren.', sub_template: 'Luk døren!', note: 'Den regelmæssige bydeform er verbalstammen uden -r.', level: 'A1', verify: false },
    { id: 'imp-vaere', type: 'imperative', imperative_type: 'irregular', main_template: 'Du er stille.', sub_template: 'Vær stille!', note: 'Være har en uregelmæssig bydeform: vær, ikke "vær-r".', level: 'A2', verify: false },
    { id: 'imp-komme', type: 'imperative', imperative_type: 'irregular', main_template: 'Du kommer her.', sub_template: 'Kom her!', note: 'Kom er en hyppigt brugt bydeform, dannet af verbalstammen kom-.', level: 'A1', verify: false },
    { id: 'imp-negativ', type: 'imperative', imperative_type: 'negative', main_template: 'Du åbner ikke døren.', sub_template: 'Åbn ikke døren!', note: 'Ikke placeres direkte efter den imperativiske verbalform.', level: 'A2', verify: false },
    { id: 'imp-hoeflig', type: 'imperative', imperative_type: 'polite_alternative', main_template: 'Luk vinduet.', sub_template: 'Vil du godt lukke vinduet?', note: 'Et spørgsmål med vil du (godt) er en mere høflig instruks end en direkte bydeform.', level: 'A2', verify: false },
    { id: 'imp-partikel', type: 'imperative', imperative_type: 'particle', main_template: 'Du tager jakken på.', sub_template: 'Tag jakken på!', note: 'Partiklen (her: på) placeres til sidst i den imperativiske sætning.', level: 'A2', verify: false },
    { id: 'imp-lad-vaere', type: 'imperative', imperative_type: 'lad_vaere_med_at', main_template: 'Du åbner ikke døren.', sub_template: 'Lad være med at åbne døren!', note: 'Lad være med at + infinitiv er et alternativ til ikke + bydeform, ofte lidt kraftigere.', level: 'B1', verify: false }
  ];

  window.DANSK_CLAUSES = clauses;
})();
