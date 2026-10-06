// Sætningsmaskinen — data.js
// 7 modes. NOTE: the ~900 cloned filler items were removed (US-051); real items
// still have to be authored (and native-reviewed) up to the specs.md counts.
// Schemas from improvement/specs.md § 6

window.SAETNINGS_DATA = {
  adverb_placement: [
    // Mode 1 — Ikke-flytteren: Adverb placement in main vs. subordinate clauses
    // Target (specs.md): 140 items, authoring pending; scope: covering ikke, altid, aldrig, ofte, måske, sandsynligvis, heldigvis, desværre, allerede

    // Basic ikke contrast
    { id: "ikke-main-kommer", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["han", "kommer", "ikke", "i dag"], movable_token: "ikke", accepted_orders: [["han", "kommer", "ikke", "i dag"]], note: "I hovedsætningen efter verbet." },
    { id: "ikke-sub-kommer", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["at", "han", "kommer", "ikke", "i dag"], movable_token: "ikke", accepted_orders: [["at", "han", "ikke", "kommer", "i dag"]], note: "I ledsætningen før det finitte verbum." },
    { id: "ikke-main-arbejder", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "arbejder", "ikke", "her"], movable_token: "ikke", accepted_orders: [["hun", "arbejder", "ikke", "her"]], note: "Ordet ikke efter verbet i hovedsætningen." },
    { id: "ikke-sub-arbejder", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["fordi", "hun", "arbejder", "ikke", "her"], movable_token: "ikke", accepted_orders: [["fordi", "hun", "ikke", "arbejder", "her"]], note: "I fordi-ledsætningen før verbet." },
    { id: "ikke-main-spiser", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["jeg", "spiser", "ikke", "fisk"], movable_token: "ikke", accepted_orders: [["jeg", "spiser", "ikke", "fisk"]], note: "Ikke efter det finitte verbum." },
    { id: "ikke-sub-spiser", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["selvom", "han", "spiser", "ikke", "fisk"], movable_token: "ikke", accepted_orders: [["selvom", "han", "ikke", "spiser", "fisk"]], note: "I selvom-ledsætningen før verbet." },
    { id: "ikke-main-ringer", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["de", "ringer", "ikke", "i dag"], movable_token: "ikke", accepted_orders: [["de", "ringer", "ikke", "i dag"]], note: "Efter verbet i hovedsætning." },
    { id: "ikke-sub-ringer", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["hvis", "de", "ringer", "ikke", "i dag"], movable_token: "ikke", accepted_orders: [["hvis", "de", "ikke", "ringer", "i dag"]], note: "Før verbet i hvis-ledsætning." },

    // altid
    { id: "altid-main", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "drikker", "altid", "kaffe"], movable_token: "altid", accepted_orders: [["hun", "drikker", "altid", "kaffe"]], note: "Efter verbet i hovedsætningen." },
    { id: "altid-sub", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["fordi", "hun", "drikker", "altid", "kaffe"], movable_token: "altid", accepted_orders: [["fordi", "hun", "altid", "drikker", "kaffe"]], note: "Før verbet i fordi-ledsætning." },

    // aldrig
    { id: "aldrig-main", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["jeg", "ser", "aldrig", "filmen"], movable_token: "aldrig", accepted_orders: [["jeg", "ser", "aldrig", "filmen"]], note: "Efter verbet." },
    { id: "aldrig-sub", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["fordi", "jeg", "ser", "aldrig", "filmen"], movable_token: "aldrig", accepted_orders: [["fordi", "jeg", "aldrig", "ser", "filmen"]], note: "Før verbet i ledsætning." },

    // ofte
    { id: "ofte-main", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["du", "besøger", "ofte", "mig"], movable_token: "ofte", accepted_orders: [["du", "besøger", "ofte", "mig"]], note: "Efter verbet." },
    { id: "ofte-sub", level: "B1", mode: "adverb_placement", clause_type: "subordinate", tokens: ["da", "du", "besøger", "ofte", "mig"], movable_token: "ofte", accepted_orders: [["da", "du", "ofte", "besøger", "mig"]], note: "Før verbet i da-ledsætning." },

    // måske
    { id: "måske-main", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["de", "kommer", "måske", "i morgen"], movable_token: "måske", accepted_orders: [["de", "kommer", "måske", "i morgen"]], note: "Efter verbet." },
    { id: "måske-sub", level: "B1", mode: "adverb_placement", clause_type: "subordinate", tokens: ["hvis", "de", "kommer", "måske", "i morgen"], movable_token: "måske", accepted_orders: [["hvis", "de", "måske", "kommer", "i morgen"]], note: "Før verbet i hvis-ledsætning." },

    // sandsynligvis
    { id: "sandsynligvis-main", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["han", "arbejder", "sandsynligvis", "der"], movable_token: "sandsynligvis", accepted_orders: [["han", "arbejder", "sandsynligvis", "der"]], note: "Efter verbet." },
    { id: "sandsynligvis-sub", level: "B1", mode: "adverb_placement", clause_type: "subordinate", tokens: ["fordi", "han", "arbejder", "sandsynligvis", "der"], movable_token: "sandsynligvis", accepted_orders: [["fordi", "han", "sandsynligvis", "arbejder", "der"]], note: "Før verbet i fordi-ledsætning." },

    // heldigvis
    { id: "heldigvis-main", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["de", "ankom", "heldigvis", "til tiden"], movable_token: "heldigvis", accepted_orders: [["de", "ankom", "heldigvis", "til tiden"]], note: "Efter verbet." },
    { id: "heldigvis-sub", level: "B1", mode: "adverb_placement", clause_type: "subordinate", tokens: ["da", "de", "ankom", "heldigvis", "til tiden"], movable_token: "heldigvis", accepted_orders: [["da", "de", "heldigvis", "ankom", "til tiden"]], note: "Før verbet i da-ledsætning." },

    // desværre
    { id: "desværre-main", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "blev", "desværre", "syg"], movable_token: "desværre", accepted_orders: [["hun", "blev", "desværre", "syg"]], note: "Efter verbet." },
    { id: "desværre-sub", level: "B1", mode: "adverb_placement", clause_type: "subordinate", tokens: ["selvom", "hun", "blev", "desværre", "syg"], movable_token: "desværre", accepted_orders: [["selvom", "hun", "desværre", "blev", "syg"]], note: "Før verbet i selvom-ledsætning." },

    // allerede
    { id: "allerede-main", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["jeg", "har", "allerede", "set", "det"], movable_token: "allerede", accepted_orders: [["jeg", "har", "allerede", "set", "det"]], note: "Efter finit verbum." },
    { id: "allerede-sub", level: "B1", mode: "adverb_placement", clause_type: "subordinate", tokens: ["da", "jeg", "har", "allerede", "set", "det"], movable_token: "allerede", accepted_orders: [["da", "jeg", "allerede", "har", "set", "det"]], note: "Før finit verbum i da-ledsætning." },

    { id: "ikke-har-gjort", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["han", "har", "ikke", "gjort", "det"], movable_token: "ikke", accepted_orders: [["han", "har", "ikke", "gjort", "det"]], note: "Mellem auxiliar og particip." },
    { id: "ikke-sub-har-gjort", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["fordi", "han", "har", "ikke", "gjort", "det"], movable_token: "ikke", accepted_orders: [["fordi", "han", "ikke", "har", "gjort", "det"]], note: "Før auxiliaret i ledsætning." },
    { id: "altid-har", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "har", "altid", "været", "venlig"], movable_token: "altid", accepted_orders: [["hun", "har", "altid", "været", "venlig"]], note: "Efter auxiliaret." },
    { id: "aldrig-vil", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["jeg", "vil", "aldrig", "gøre", "det"], movable_token: "aldrig", accepted_orders: [["jeg", "vil", "aldrig", "gøre", "det"]], note: "Efter modalverbet." },
    { id: "ofte-går", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "går", "ofte", "i parken"], movable_token: "ofte", accepted_orders: [["hun", "går", "ofte", "i parken"]], note: "Efter verbet før adverbiale." },
    { id: "måske-var", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["det", "var", "måske", "ikke", "rigtigt"], movable_token: "måske", accepted_orders: [["det", "var", "måske", "ikke", "rigtigt"]], note: "Efter verbet." },
    { id: "sandsynligvis-kan", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["han", "kan", "sandsynligvis", "ikke", "komme"], movable_token: "sandsynligvis", accepted_orders: [["han", "kan", "sandsynligvis", "ikke", "komme"]], note: "Efter modalverbet." },
    { id: "heldigvis-kunne", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "kunne", "heldigvis", "løse", "problemet"], movable_token: "heldigvis", accepted_orders: [["hun", "kunne", "heldigvis", "løse", "problemet"]], note: "Efter modalverbet." },
    { id: "desværre-kunne", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["de", "kunne", "desværre", "ikke", "få", "billetter"], movable_token: "desværre", accepted_orders: [["de", "kunne", "desværre", "ikke", "få", "billetter"]], note: "Efter modalverbet." },
    { id: "allerede-kan", level: "B1", mode: "adverb_placement", clause_type: "main", tokens: ["du", "kan", "allerede", "læse", "dansk"], movable_token: "allerede", accepted_orders: [["du", "kan", "allerede", "læse", "dansk"]], note: "Efter modalverbet." },
    // Continuing pattern with more examples...
    { id: "ikke-drikker", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["jeg", "drikker", "ikke", "mælk"], movable_token: "ikke", accepted_orders: [["jeg", "drikker", "ikke", "mælk"]], note: "Efter verbet." },
    { id: "ikke-sub-drikker", level: "A2", mode: "adverb_placement", clause_type: "subordinate", tokens: ["fordi", "jeg", "drikker", "ikke", "mælk"], movable_token: "ikke", accepted_orders: [["fordi", "jeg", "ikke", "drikker", "mælk"]], note: "Før verbet i ledsætning." },
    { id: "aldrig-lærer", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["han", "lærer", "aldrig", "dansk"], movable_token: "aldrig", accepted_orders: [["han", "lærer", "aldrig", "dansk"]], note: "Efter verbet." },
    { id: "altid-tager", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "tager", "altid", "bussen"], movable_token: "altid", accepted_orders: [["hun", "tager", "altid", "bussen"]], note: "Efter verbet." },
    { id: "ofte-mødes", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["vi", "mødes", "ofte", "på", "cafeen"], movable_token: "ofte", accepted_orders: [["vi", "mødes", "ofte", "på", "cafeen"]], note: "Efter verbet." },
    { id: "ikke-køber", level: "A2", mode: "adverb_placement", clause_type: "main", tokens: ["hun", "køber", "ikke", "blomster"], movable_token: "ikke", accepted_orders: [["hun", "køber", "ikke", "blomster"]], note: "Efter verbet." },
  ],

  main_to_subordinate: [
    // Mode 2 — Hovedsætning til ledsætning: Transform main clause to subordinate
    // Target (specs.md): 160 items, authoring pending; scope: covering at, fordi, selvom, hvis, når, da, mens, før, efter at

    { id: "arb-ikke-fordi", level: "B1", mode: "main_to_subordinate", source: "Hun arbejder ikke i dag.", frame: "Jeg ved, at ...", tiles: ["hun", "arbejder", "ikke", "i dag"], accepted_orders: [["hun", "ikke", "arbejder", "i dag"]], full_answer: "Jeg ved, at hun ikke arbejder i dag.", note: "I at-ledsætningen står ikke før arbejder." },
    { id: "kommer-i-morgen-at", level: "B1", mode: "main_to_subordinate", source: "Han kommer i morgen.", frame: "Jeg tror, at ...", tiles: ["han", "kommer", "i morgen"], accepted_orders: [["han", "kommer", "i morgen"]], full_answer: "Jeg tror, at han kommer i morgen.", note: "I at-ledsætningen er ordstillingen som i hovedsætningen her." },
    { id: "regner-fordi", level: "B1", mode: "main_to_subordinate", source: "Det regner i dag.", frame: "Vi bliver hjemme, fordi ...", tiles: ["det", "regner", "i dag"], accepted_orders: [["det", "regner", "i dag"]], full_answer: "Vi bliver hjemme, fordi det regner i dag.", note: "I fordi-ledsætningen beholder man ordstillingen." },
    { id: "går-hvis", level: "B1", mode: "main_to_subordinate", source: "Han går til skole.", frame: "Han bliver sur, hvis ...", tiles: ["han", "går", "til skole"], accepted_orders: [["han", "går", "til skole"]], full_answer: "Han bliver sur, hvis han går til skole.", note: "I hvis-ledsætningen følges normal ordstilling." },
    { id: "snør-når", level: "B1", mode: "main_to_subordinate", source: "Det sner.", frame: "Jeg er glad, når ...", tiles: ["det", "sner"], accepted_orders: [["det", "sner"]], full_answer: "Jeg er glad, når det sner.", note: "I når-ledsætningen følges normal ordstilling." },
    { id: "ringede-da", level: "B1", mode: "main_to_subordinate", source: "Du ringede.", frame: "Jeg var her, da ...", tiles: ["du", "ringede"], accepted_orders: [["du", "ringede"]], full_answer: "Jeg var her, da du ringede.", note: "I da-ledsætningen som subjunktion følges normal ordstilling." },
    { id: "snakkede-mens", level: "B1", mode: "main_to_subordinate", source: "De snakkede.", frame: "Jeg skrev et brev, mens ...", tiles: ["de", "snakkede"], accepted_orders: [["de", "snakkede"]], full_answer: "Jeg skrev et brev, mens de snakkede.", note: "I mens-ledsætningen følges normal ordstilling." },
    { id: "forlod-før", level: "B2", mode: "main_to_subordinate", source: "Jeg forlod stedet.", frame: "Han kom, før ...", tiles: ["jeg", "forlod", "stedet"], accepted_orders: [["jeg", "forlod", "stedet"]], full_answer: "Han kom, før jeg forlod stedet.", note: "I før-ledsætningen følges normal ordstilling." },
    { id: "åbnede-efter", level: "B2", mode: "main_to_subordinate", source: "Jeg åbnede døren.", frame: "Vi gik ud, efter at ...", tiles: ["jeg", "åbnede", "døren"], accepted_orders: [["jeg", "åbnede", "døren"]], full_answer: "Vi gik ud, efter at jeg åbnede døren.", note: "I efter at-ledsætningen følges normal ordstilling." },
    { id: "selvom-kender", level: "B1", mode: "main_to_subordinate", source: "Han kender dansk.", frame: "Han taler ikke dansk, selvom ...", tiles: ["han", "kender", "dansk"], accepted_orders: [["han", "kender", "dansk"]], full_answer: "Han taler ikke dansk, selvom han kender dansk.", note: "I selvom-ledsætningen følges normal ordstilling." },
  ],

  direct_question: [
    // Mode 3 — Byg spørgsmålet: Direct questions
    // Target (specs.md): 140 items, authoring pending; scope: covering yes/no, hv-questions, prepositions, subject/object questions

    { id: "q-yes-no-bor", level: "A2", mode: "direct_question", tiles: ["du", "bor", "her"], accepted_orders: [["bor", "du", "her"]], full_answer: "Bor du her?", note: "Ja/nej-spørgsmål starter med verbet." },
    { id: "q-hv-hvor-bor", level: "A2", mode: "direct_question", tiles: ["hvor", "du", "bor"], accepted_orders: [["hvor", "bor", "du"]], full_answer: "Hvor bor du?", note: "Hv-spørgsmål: spørgeord + verbum + subjekt." },
    { id: "q-hvem-står", level: "A2", mode: "direct_question", tiles: ["hvem", "står", "der"], accepted_orders: [["hvem", "står", "der"]], full_answer: "Hvem står der?", note: "Hvem som subjekt: hvem + verbum." },
    { id: "q-hvad-spiser", level: "A2", mode: "direct_question", tiles: ["hvad", "spiser", "du"], accepted_orders: [["hvad", "spiser", "du"]], full_answer: "Hvad spiser du?", note: "Hvad: spørgeord + verbum + subjekt." },
    { id: "q-prep-med-hvem", level: "B1", mode: "direct_question", tiles: ["hvem", "taler", "du", "med"], accepted_orders: [["hvem", "taler", "du", "med"]], full_answer: "Hvem taler du med?", note: "Præposition kommer til slut." },
    { id: "q-hvornår-kommer", level: "A2", mode: "direct_question", tiles: ["hvornår", "kommer", "han"], accepted_orders: [["hvornår", "kommer", "han"]], full_answer: "Hvornår kommer han?", note: "Hvornår + verbum + subjekt." },
    { id: "q-hvorfor-ringer", level: "A2", mode: "direct_question", tiles: ["hvorfor", "ringer", "du", "ikke"], accepted_orders: [["hvorfor", "ringer", "du", "ikke"]], full_answer: "Hvorfor ringer du ikke?", note: "Hvorfor + verbum + subjekt." },
    { id: "q-ja-nei-kommer", level: "A2", mode: "direct_question", tiles: ["du", "kommer", "i morgen"], accepted_orders: [["kommer", "du", "i morgen"]], full_answer: "Kommer du i morgen?", note: "Ja/nej-spørgsmål starter med verbet." },
    { id: "q-hvor-ligger", level: "A2", mode: "direct_question", tiles: ["hvor", "ligger", "København"], accepted_orders: [["hvor", "ligger", "København"]], full_answer: "Hvor ligger København?", note: "Geografisk spørgsmål: hvor + verbum." },
    { id: "q-hvem-skriver", level: "B1", mode: "direct_question", tiles: ["hvem", "skrev", "denne", "bog"], accepted_orders: [["hvem", "skrev", "denne", "bog"]], full_answer: "Hvem skrev denne bog?", note: "Hvem som subjekt: hv-ord + verbum + resten." },
  ],

  indirect_question: [
    // Mode 4 — Indirekte spørgsmål: Indirect questions
    // Target (specs.md): 140 items, authoring pending; scope: covering om, hv- + der, no inversion

    { id: "iq-hvem-der-kommer", level: "B1", mode: "indirect_question", prompt: "Jeg ved ikke, ___ kommer.", tiles: ["hvem", "der", "hvem der", "kommer"], accepted_answers: ["hvem der"], note: "Som subjekt følges hvem normalt af der." },
    { id: "iq-om-kommer", level: "B1", mode: "indirect_question", prompt: "Jeg ved ikke, ___ kommer.", tiles: ["om", "han", "om han", "kommer"], accepted_answers: ["om han"], note: "Ja/nej-indlede med om uden inversion." },
    { id: "iq-hvor-bor", level: "B1", mode: "indirect_question", prompt: "Jeg ved, ___ hun bor.", tiles: ["hvor", "hvor hun"], accepted_answers: ["hvor"], note: "Hv-ord uden der eller inversion." },
    { id: "iq-hvad-hedder", level: "B1", mode: "indirect_question", prompt: "Kan du fortælle mig, ___ hedder?", tiles: ["hvad", "han", "hvad han"], accepted_answers: ["hvad han"], note: "Hvad som objekt uden inversion." },
    { id: "iq-hvornår-går", level: "B1", mode: "indirect_question", prompt: "Jeg spurgte, ___ toget går.", tiles: ["hvornår", "hvornår toget"], accepted_answers: ["hvornår"], note: "Hv-ord + normal ordstilling." },
    { id: "iq-hvorfor-ringer", level: "B1", mode: "indirect_question", prompt: "Han ville vide, ___.", tiles: ["hvorfor", "hvorfor jeg", "hvorfor jeg ikke ringede"], accepted_answers: ["hvorfor jeg ikke ringede"], note: "Hvorfor uden inversion; ikke står før verbet i ledsætningen." },
    { id: "iq-hvem-mødte", level: "B2", mode: "indirect_question", prompt: "Hun spurgte, ___.", tiles: ["hvem", "hvem jeg", "hvem jeg mødte"], accepted_answers: ["hvem jeg mødte"], note: "Hvem som objekt uden inversion." },
    { id: "iq-om-ved", level: "B1", mode: "indirect_question", prompt: "Jeg ved ikke, ___ har ret.", tiles: ["om", "han", "om han"], accepted_answers: ["om han"], note: "Om-ledsætning uden inversion." },
    { id: "iq-hvor-mange", level: "B1", mode: "indirect_question", prompt: "Kan du sige mig, ___ kommer?", tiles: ["hvor mange", "hvor mange mennesker", "hvor mange mennesker der"], accepted_answers: ["hvor mange mennesker der"], note: "Når spørgeleddet er subjekt, tilføjes der: hvor mange mennesker der kommer." },
    { id: "iq-hvilken", level: "B2", mode: "indirect_question", prompt: "Jeg ved ikke, ___ bog han læser.", tiles: ["hvilken", "hvilken bog"], accepted_answers: ["hvilken"], note: "Hvilken uden inversion." },
  ],

  relative_clause: [
    // Mode 5 — Relativværkstedet: Relative clauses
    // Target (specs.md): 180 items, authoring pending; scope: covering som, der, hvor, hvis, hvilket, hvad with optional omission

    { id: "rc-som-læser", level: "B1", mode: "relative_clause", context: "Bogen er lang. Jeg læser bogen.", target_frame: "Bogen, ___, er lang.", accepted_answers: ["som jeg læser", "jeg læser"], note: "Objektet som kan udelades i relativsætningen." },
    { id: "rc-der-står", level: "B1", mode: "relative_clause", context: "Manden står der.", target_frame: "Manden, ___ står der, er min lærer.", accepted_answers: ["der", "som"], note: "Som eller der for subjekt i relativsætning." },
    { id: "rc-hvor-bor", level: "B1", mode: "relative_clause", context: "Byen ligger mod nord. Hun bor der.", target_frame: "Byen, ___ hun bor, ligger mod nord.", accepted_answers: ["hvor"], note: "Hvor i relativsætning for sted." },
    { id: "rc-hvis-navn", level: "B2", mode: "relative_clause", context: "En person. Jeg har glemt hendes navn.", target_frame: "En person, ___ navn jeg har glemt, ringede.", accepted_answers: ["hvis"], note: "Hvis i relativsætning for possessiv." },
    { id: "rc-hvilket", level: "B2", mode: "relative_clause", context: "En bog. Jeg læste den.", target_frame: "En bog, ___ jeg læste, var interessant.", accepted_answers: ["som"], note: "Som er objekt i relativsætningen; hvilket kan ikke referere til et enkelt navneord." },
    { id: "rc-hvad-sagde", level: "B2", mode: "relative_clause", context: "Han sagde noget. Det var vigtigt.", target_frame: "___ han sagde, var vigtigt.", accepted_answers: ["hvad"], note: "Hvad i relativsætning for nomen." },
    { id: "rc-som-arbejder", level: "B1", mode: "relative_clause", context: "En mand arbejder her. Han er min ven.", target_frame: "En mand, ___ arbejder her, er min ven.", accepted_answers: ["der", "som"], note: "Som eller der for subjekt." },
    { id: "rc-som-mødte", level: "B1", mode: "relative_clause", context: "Jeg mødte en pige. Hun er venlig.", target_frame: "Pigen, ___, er venlig.", accepted_answers: ["som jeg mødte", "jeg mødte"], note: "Omission af som mulig for objekt." },
    { id: "rc-hvor-ligger", level: "B1", mode: "relative_clause", context: "Et land. Jeg bor der.", target_frame: "Landet, ___ jeg bor, ligger i Skandinavien.", accepted_answers: ["hvor"], note: "Hvor for stedsangivelse i relativsætning." },
    { id: "rc-hvis-hus", level: "B2", mode: "relative_clause", context: "En ven. Mit hus står ved hans hus.", target_frame: "En ven, ___ hus ligger ved siden af mit.", accepted_answers: ["hvis"], note: "Hvis for possessiv relation." },
  ],

  der_or_det: [
    // Mode 6 — Der eller det?: Existential vs. impersonal
    // Target (specs.md): 160 items, authoring pending; scope: distinguishing weather det, extraposition det, existential der, locative der

    { id: "det-regner", level: "A2", mode: "der_or_det", sentence: "___ regner.", options: ["det", "der"], correct: "det", note: "Vejrord bruger impersonalt det." },
    { id: "der-står-en-bil", level: "A2", mode: "der_or_det", sentence: "___ står en bil udenfor.", options: ["det", "der"], correct: "der", note: "Eksistentielt der for noget/nogen." },
    { id: "det-er-svært", level: "A2", mode: "der_or_det", sentence: "___ er svært at lære dansk.", options: ["det", "der"], correct: "det", note: "Ekstraposition med det + infinitiv." },
    { id: "der-er-mange", level: "A2", mode: "der_or_det", sentence: "___ er mange mennesker her.", options: ["det", "der"], correct: "der", note: "Eksistentielt der." },
    { id: "det-sner", level: "A2", mode: "der_or_det", sentence: "___ sner i dag.", options: ["det", "der"], correct: "det", note: "Vejrord bruger impersonalt det." },
    { id: "der-ligger-en-bog", level: "B1", mode: "der_or_det", sentence: "___ ligger en bog på bordet.", options: ["det", "der"], correct: "der", note: "Presentational der for genstand på sted." },
    { id: "det-virker", level: "B1", mode: "der_or_det", sentence: "___ virker som om det regner.", options: ["det", "der"], correct: "det", note: "Impersonalt det med verbum." },
    { id: "der-dunker-noget", level: "B1", mode: "der_or_det", sentence: "___ dunker noget imod døren.", options: ["det", "der"], correct: "der", note: "Presentational der." },
    { id: "der-synes-at-være", level: "B2", mode: "der_or_det", sentence: "___ synes at være et problem.", options: ["det", "der"], correct: "der", note: "Existential der med infinitiv." },
  ],

  clause_chain: [
    // Mode 7 — Sætningskæden: Complex clause chains B2–C1
    // Target (specs.md): 100 items, authoring pending; scope: with multiple clause types and chunks

    { id: "chain-1", level: "B2", mode: "clause_chain", sentence: "Jeg tror, at den bog, som hun anbefalede, ikke længere kan købes.", chunks: ["Jeg tror,", "at den bog,", "som hun anbefalede,", "ikke længere kan købes."], accepted_orders: [["Jeg tror,", "at den bog,", "som hun anbefalede,", "ikke længere kan købes."]], note: "Kompleks ledsætningskæde med relativsætning." },
    { id: "chain-2", level: "B2", mode: "clause_chain", sentence: "Da jeg kom hjem, var filmen allerede begyndt.", chunks: ["Da jeg kom hjem,", "var filmen", "allerede begyndt."], accepted_orders: [["Da jeg kom hjem,", "var filmen", "allerede begyndt."]], note: "Tidssætning og participium." },
    { id: "chain-3", level: "B2", mode: "clause_chain", sentence: "Hvis det regner i morgen, skal vi blive hjemme.", chunks: ["Hvis det regner i morgen,", "skal vi", "blive hjemme."], accepted_orders: [["Hvis det regner i morgen,", "skal vi", "blive hjemme."]], note: "Betingelsessætning med modalverbum." },
    { id: "chain-4", level: "C1", mode: "clause_chain", sentence: "Det faktum, at han aldrig havde mødt hende før, gjorde mødet uventet.", chunks: ["Det faktum,", "at han aldrig havde mødt hende før,", "gjorde mødet", "uventet."], accepted_orders: [["Det faktum,", "at han aldrig havde mødt hende før,", "gjorde mødet", "uventet."]], note: "Nominalfrase med at-ledsætning." },
    { id: "chain-5", level: "B2", mode: "clause_chain", sentence: "Selvom han var træt, arbejdede han hele dagen.", chunks: ["Selvom han var træt,", "arbejdede han", "hele dagen."], accepted_orders: [["Selvom han var træt,", "arbejdede han", "hele dagen."]], note: "Selvom-ledsætning først; hovedsætningen bagefter har verbet før subjektet." },
    { id: "chain-6", level: "C1", mode: "clause_chain", sentence: "Den lærer, hvis undervisning var berømt, lærte os det som hun selv havde lært.", chunks: ["Den lærer,", "hvis undervisning var berømt,", "lærte os", "det som hun selv havde lært."], accepted_orders: [["Den lærer,", "hvis undervisning var berømt,", "lærte os", "det som hun selv havde lært."]], note: "Dobbelt relativsætning." },
    { id: "chain-7", level: "B2", mode: "clause_chain", sentence: "Fordi det regnede, og fordi vi var trætte, gik vi hjem.", chunks: ["Fordi det regnede,", "og fordi vi var trætte,", "gik vi hjem."], accepted_orders: [["Fordi det regnede,", "og fordi vi var trætte,", "gik vi hjem."]], note: "Koordinerede årsagssætninger." },
    { id: "chain-8", level: "C1", mode: "clause_chain", sentence: "Efter at hun havde rejst hjemmefra, som hun havde ønsket sig længe, fandt hun fred.", chunks: ["Efter at hun havde rejst hjemmefra,", "som hun havde ønsket sig længe,", "fandt hun fred."], accepted_orders: [["Efter at hun havde rejst hjemmefra,", "som hun havde ønsket sig længe,", "fandt hun fred."]], note: "Tidsbestemmelse med indsat relativsætning." },
    { id: "chain-9", level: "B2", mode: "clause_chain", sentence: "Jeg ved ikke, hvor han bor, eller hvornår han kommer.", chunks: ["Jeg ved ikke,", "hvor han bor,", "eller hvornår han kommer."], accepted_orders: [["Jeg ved ikke,", "hvor han bor,", "eller hvornår han kommer."]], note: "Koordinerede indirekte spørgsmål." },
    { id: "chain-10", level: "B2", mode: "clause_chain", sentence: "Hvis du lærer dansk nu, vil det være lettere senere.", chunks: ["Hvis du lærer dansk nu,", "vil det være", "lettere senere."], accepted_orders: [["Hvis du lærer dansk nu,", "vil det være", "lettere senere."]], note: "Betingelse med fremtidig virkning." },
  ],
};

// Placeholder / duplicate guard (US-051). Warns (never throws) when an item looks
// like generated filler: a "-variant-N" id, a repeated id, or two items in the same
// mode with identical content. Keeps cloned filler from creeping back in.
(function () {
  'use strict';
  var data = window.SAETNINGS_DATA, ids = {}, seen = {};
  Object.keys(data).forEach(function (mode) {
    data[mode].forEach(function (item) {
      if (/variant/i.test(item.id) || ids[item.id]) {
        console.warn('[saetningsmaskinen] placeholder/duplicate id: ' + item.id);
      }
      ids[item.id] = true;
      var copy = {};
      Object.keys(item).forEach(function (k) { if (k !== 'id') copy[k] = item[k]; });
      var key = mode + '|' + JSON.stringify(copy);
      if (seen[key]) {
        console.warn('[saetningsmaskinen] duplicate content: ' + item.id + ' = ' + seen[key]);
      }
      seen[key] = item.id;
    });
  });
})();
