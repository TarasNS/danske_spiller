// Dataset of Danish verbs with their conjugated forms, translations, and an
// example sentence (with English translation) showing the verb in use.
// This list contains exactly 150 of the most common Danish verbs.
const verbs = [
    { infinitive: 'være', present: 'er', past: 'var', pastParticiple: 'været', translation: 'to be', example: 'Hun er glad i dag.', exampleEn: 'She is happy today.', cefr: 'A1', note: 'Det vigtigste verbum på dansk. »Er« bruges i alle sætninger, der beskriver eller definerer noget.' },
    { infinitive: 'have', present: 'har', past: 'havde', pastParticiple: 'haft', translation: 'to have', example: 'Jeg har en hund.', exampleEn: 'I have a dog.', cefr: 'A1', note: 'Hjælpeverbum: »har« danner førnutid sammen med tillægsformen, fx »jeg har spist«.' },
    { infinitive: 'komme', present: 'kommer', past: 'kom', pastParticiple: 'kommet', translation: 'to come', example: 'Han kommer snart.', exampleEn: 'He is coming soon.', cefr: 'A1', note: 'Uregelmæssigt verbum: nutid »kommer«, datid »kom«. Indgår i »komme fra«.' },
    { infinitive: 'gøre', present: 'gør', past: 'gjorde', pastParticiple: 'gjort', translation: 'to do/make', example: 'Hvad gør du nu?', exampleEn: 'What are you doing now?', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »gjorde«. I hverdagssproget bruger man oftere »lave« om at fremstille noget.' },
    { infinitive: 'tage', present: 'tager', past: 'tog', pastParticiple: 'taget', translation: 'to take', example: 'Hun tager bussen til arbejde.', exampleEn: 'She takes the bus to work.', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »tog«. Indgår i faste vendinger som »tage en beslutning«.' },
    { infinitive: 'sige', present: 'siger', past: 'sagde', pastParticiple: 'sagt', translation: 'to say', example: 'Han siger altid sandheden.', exampleEn: 'He always tells the truth.', cefr: 'A1', note: 'Uregelmæssigt verbum: »siger«, »sagde«, »sagt«.' },
    { infinitive: 'vide', present: 'ved', past: 'vidste', pastParticiple: 'vidst', translation: 'to know', example: 'Jeg ved ikke svaret.', exampleEn: "I don't know the answer.", cefr: 'A1', note: 'Bruges om at vide fakta, ikke om at kende personer: »ved«, »vidste«, »vidst«.' },
    { infinitive: 'lade', present: 'lader', past: 'lod', pastParticiple: 'ladet', translation: 'to let', example: 'Han lader mig låne bogen.', exampleEn: 'He lets me borrow the book.', cefr: 'A2', note: 'Uregelmæssigt verbum: datid »lod«. Indgår i »lade være med« (lade være).' },
    { infinitive: 'holde', present: 'holder', past: 'holdt', pastParticiple: 'holdt', translation: 'to hold', example: 'Hun holder hans hånd.', exampleEn: 'She holds his hand.', cefr: 'A2', note: 'Datid og tillægsform er begge »holdt«. Indgår i mange udtryk, fx »holde op« og »holde ferie«.' },
    { infinitive: 'hedde', present: 'hedder', past: 'hed', pastParticiple: 'heddet', translation: 'to be called', example: 'Hvad hedder du?', exampleEn: 'What is your name?', cefr: 'A1', note: 'Bruges kun om navne: »Hvad hedder du?« er den almindelige måde at spørge om nogens navn.' },
    { infinitive: 'gå', present: 'går', past: 'gik', pastParticiple: 'gået', translation: 'to go/walk', example: 'Vi går i skole hver dag.', exampleEn: 'We go to school every day.', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »gik«. »Gå i skole« betyder at være skoleelev; »gå til skole« betyder at gå derhen.' },
    { infinitive: 'rejse', present: 'rejser', past: 'rejste', pastParticiple: 'rejst', translation: 'to travel', example: 'De rejser til Italien om sommeren.', exampleEn: 'They travel to Italy in the summer.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). Kan også betyde »tage af sted«, fx »Hun rejser i morgen tidlig«. Om tog siger man »køre« eller »afgå«.' },
    { infinitive: 'bære', present: 'bærer', past: 'bar', pastParticiple: 'båret', translation: 'to carry', example: 'Han bærer en tung taske.', exampleEn: 'He carries a heavy bag.', cefr: 'B1', note: 'Uregelmæssigt verbum: »bærer«, »bar«, »båret«. Bruges også om at have tøj på: »bære hat«.' },
    { infinitive: 'trække', present: 'trækker', past: 'trak', pastParticiple: 'trukket', translation: 'to pull/drag', example: 'Hun trækker vognen op ad bakken.', exampleEn: 'She pulls the cart up the hill.', cefr: 'B1', note: 'Uregelmæssigt verbum: »trækker«, »trak«, »trukket«. »Trække vejret« betyder at ånde.' },
    { infinitive: 'ligge', present: 'ligger', past: 'lå', pastParticiple: 'ligget', translation: 'to lie', example: 'Katten ligger på sofaen.', exampleEn: 'The cat is lying on the sofa.', cefr: 'A2', note: 'Uregelmæssigt verbum: datid »lå«. Må ikke forveksles med »lægge«.' },
    { infinitive: 'lægge', present: 'lægger', past: 'lagde', pastParticiple: 'lagt', translation: 'to lay/put', example: 'Jeg lægger bogen på bordet.', exampleEn: 'I put the book on the table.', cefr: 'A2', note: 'Datid »lagde«, tillægsform »lagt«. Tager objekt, i modsætning til »ligge«.' },
    { infinitive: 'sidde', present: 'sidder', past: 'sad', pastParticiple: 'siddet', translation: 'to sit', example: 'Han sidder ved vinduet.', exampleEn: 'He sits by the window.', cefr: 'A2', note: 'Uregelmæssigt verbum: datid »sad«. Tager aldrig objekt.' },
    { infinitive: 'slå', present: 'slår', past: 'slog', pastParticiple: 'slået', translation: 'to hit', example: 'Bølgerne slår mod klipperne.', exampleEn: 'The waves hit the rocks.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »slog«. Indgår i »slå op« og »slå til«.' },
    { infinitive: 'falde', present: 'falder', past: 'faldt', pastParticiple: 'faldet', translation: 'to fall', example: 'Bladene falder om efteråret.', exampleEn: 'The leaves fall in autumn.', cefr: 'A2', note: 'Datid »faldt«. Indgår i »falde i søvn«.' },
    { infinitive: 'spise', present: 'spiser', past: 'spiste', pastParticiple: 'spist', translation: 'to eat', example: 'Vi spiser morgenmad klokken syv.', exampleEn: 'We eat breakfast at seven o\'clock.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Spise middag« betyder at have middagsmad.' },
    { infinitive: 'sove', present: 'sover', past: 'sov', pastParticiple: 'sovet', translation: 'to sleep', example: 'Babyen sover hele natten.', exampleEn: 'The baby sleeps all night.', cefr: 'A1', note: 'Datid »sov«. »Sove godt« er en almindelig fast vending.' },
    { infinitive: 'stjæle', present: 'stjæler', past: 'stjal', pastParticiple: 'stjålet', translation: 'to steal', example: 'Tyven stjæler hendes cykel.', exampleEn: 'The thief steals her bicycle.', cefr: 'B1', note: 'Uregelmæssigt verbum: »stjæler«, »stjal«, »stjålet« – ligner »bære«.' },
    { infinitive: 'græde', present: 'græder', past: 'græd', pastParticiple: 'grædt', translation: 'to cry', example: 'Barnet græder, fordi det er træt.', exampleEn: 'The child cries because it is tired.', cefr: 'A2', note: 'Datid »græd«, tillægsform »grædt«.' },
    { infinitive: 'sælge', present: 'sælger', past: 'solgte', pastParticiple: 'solgt', translation: 'to sell', example: 'Han sælger grøntsager på markedet.', exampleEn: 'He sells vegetables at the market.', cefr: 'A2', note: 'Uregelmæssigt verbum: »solgte«, »solgt«. Det modsatte af »købe«.' },
    { infinitive: 'vælge', present: 'vælger', past: 'valgte', pastParticiple: 'valgt', translation: 'to choose', example: 'Hun vælger den røde kjole.', exampleEn: 'She chooses the red dress.', cefr: 'A2', note: 'Uregelmæssigt verbum: »valgte«, »valgt«. Efterfølges ofte af »at + infinitiv«.' },
    { infinitive: 'vænne', present: 'vænner', past: 'vænnede', pastParticiple: 'vænnet', translation: 'to accustom', example: 'Han vænner sig til det kolde vejr.', exampleEn: 'He gets used to the cold weather.', cefr: 'B1', note: 'Bruges næsten altid refleksivt: »vænne sig til« betyder at blive vant til.' },
    { infinitive: 'binde', present: 'binder', past: 'bandt', pastParticiple: 'bundet', translation: 'to bind', example: 'Hun binder sit hår op.', exampleEn: 'She ties her hair up.', cefr: 'B1', note: 'Uregelmæssigt verbum (i–a–u): »bandt«, »bundet«. »Binde op« betyder at knytte fast.' },
    { infinitive: 'brænde', present: 'brænder', past: 'brændte', pastParticiple: 'brændt', translation: 'to burn', example: 'Lyset brænder hele natten.', exampleEn: 'The candle burns all night.', cefr: 'B1', note: 'Regelmæssigt verbum (-te/-t). Kan bruges både uden objekt (lyset brænder) og med objekt (brænde noget af).' },
    { infinitive: 'drikke', present: 'drikker', past: 'drak', pastParticiple: 'drukket', translation: 'to drink', example: 'Jeg drikker kaffe hver morgen.', exampleEn: 'I drink coffee every morning.', cefr: 'A1', note: 'Uregelmæssigt verbum (i–a–u), ligesom »binde«, »finde« og »vinde«.' },
    { infinitive: 'finde', present: 'finder', past: 'fandt', pastParticiple: 'fundet', translation: 'to find', example: 'Han finder sine nøgler under sofaen.', exampleEn: 'He finds his keys under the sofa.', cefr: 'A1', note: 'Uregelmæssigt verbum (i–a–u). »Finde på« betyder at finde på noget nyt eller opfinde.' },
    { infinitive: 'forsvinde', present: 'forsvinder', past: 'forsvandt', pastParticiple: 'forsvundet', translation: 'to disappear', example: 'Solen forsvinder bag skyerne.', exampleEn: 'The sun disappears behind the clouds.', cefr: 'A2', note: 'Følger samme mønster som »finde« (i–a–u): »forsvandt«, »forsvundet«.' },
    { infinitive: 'løbe', present: 'løber', past: 'løb', pastParticiple: 'løbet', translation: 'to run', example: 'Hun løber en tur hver morgen.', exampleEn: 'She goes for a run every morning.', cefr: 'A2', note: 'Datid »løb«. »Løbe en tur« betyder at gå en løbetur.' },
    { infinitive: 'slippe', present: 'slipper', past: 'slap', pastParticiple: 'sluppet', translation: 'to let go', example: 'Han slipper ballonen.', exampleEn: 'He lets go of the balloon.', cefr: 'B1', note: 'Uregelmæssigt verbum (i–a–u): »slap«, »sluppet«. »Slippe af sted med« betyder at slippe godt fra noget.' },
    { infinitive: 'stikke', present: 'stikker', past: 'stak', pastParticiple: 'stukket', translation: 'to stick/pierce', example: 'Bien stikker ham i armen.', exampleEn: 'The bee stings him on the arm.', cefr: 'B1', note: 'Uregelmæssigt verbum (i–a–u): »stak«, »stukket«. Indgår i »stikke af« og »stikke ud«.' },
    { infinitive: 'vinde', present: 'vinder', past: 'vandt', pastParticiple: 'vundet', translation: 'to win', example: 'Vores hold vinder kampen.', exampleEn: 'Our team wins the match.', cefr: 'A2', note: 'Uregelmæssigt verbum (i–a–u). Det modsatte er »tabe«.' },
    { infinitive: 'bide', present: 'bider', past: 'bed', pastParticiple: 'bidt', translation: 'to bite', example: 'Hunden bider ikke fremmede.', exampleEn: "The dog doesn't bite strangers.", cefr: 'B1', note: 'Uregelmæssigt verbum: datid »bed«. »Bide mærke i« betyder at lægge mærke til.' },
    { infinitive: 'gribe', present: 'griber', past: 'greb', pastParticiple: 'grebet', translation: 'to grasp/catch', example: 'Han griber bolden med én hånd.', exampleEn: 'He catches the ball with one hand.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »greb«. »Gribe ind« betyder at blande sig for at stoppe noget.' },
    { infinitive: 'lide', present: 'lider', past: 'led', pastParticiple: 'lidt', translation: 'to suffer', example: 'Patienten lider af hovedpine.', exampleEn: 'The patient suffers from a headache.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »led«. »Lide af« bruges om at have en sygdom eller et problem.' },
    { infinitive: 'ride', present: 'rider', past: 'red', pastParticiple: 'redet', translation: 'to ride', example: 'Hun rider på sin hest hver weekend.', exampleEn: 'She rides her horse every weekend.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »red«. Bruges om at ride på dyr; »køre« bruges om køretøjer.' },
    { infinitive: 'skinne', present: 'skinner', past: 'skinnede', pastParticiple: 'skinnet', translation: 'to shine', example: 'Solen skinner i dag.', exampleEn: 'The sun is shining today.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Bruges mest om solen.' },
    { infinitive: 'skrive', present: 'skriver', past: 'skrev', pastParticiple: 'skrevet', translation: 'to write', example: 'Jeg skriver et brev til min ven.', exampleEn: 'I am writing a letter to my friend.', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »skrev«. »Skrive under« betyder at underskrive.' },
    { infinitive: 'slide', present: 'slider', past: 'sled', pastParticiple: 'slidt', translation: 'to wear out', example: 'Skoene slider hurtigt på asfalten.', exampleEn: 'The shoes wear out quickly on the asphalt.', cefr: 'B2', note: 'Uregelmæssigt verbum: datid »sled«. Bruges også overført: »slide sig op« betyder at udmatte sig selv.' },
    { infinitive: 'stige', present: 'stiger', past: 'steg', pastParticiple: 'steget', translation: 'to rise', example: 'Prisen stiger hver måned.', exampleEn: 'The price rises every month.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »steg«. Bruges om priser, temperaturer og om at klatre.' },
    { infinitive: 'tie', present: 'tier', past: 'tav', pastParticiple: 'tiet', translation: 'to be silent', example: 'Han tier, når hun taler.', exampleEn: 'He stays silent when she speaks.', cefr: 'B2', note: 'Datid »tav« afviger fra infinitiv. »Tie stille« betyder at forholde sig helt tavs.' },
    { infinitive: 'vride', present: 'vrider', past: 'vred', pastParticiple: 'vredet', translation: 'to twist/wring', example: 'Hun vrider vasketøjet.', exampleEn: 'She wrings the laundry.', cefr: 'B2', note: 'Uregelmæssigt verbum: datid »vred«. Bruges også overført: »vride sig« betyder at sno sig, fx af smerte eller for at slippe fri.' },
    { infinitive: 'byde', present: 'byder', past: 'bød', pastParticiple: 'budt', translation: 'to offer/bid', example: 'Han byder på et gammelt maleri.', exampleEn: 'He bids on an old painting.', cefr: 'B2', note: 'Uregelmæssigt verbum (y–ø–u): »bød«, »budt«. »Byde velkommen« betyder at modtage nogen.' },
    { infinitive: 'lyve', present: 'lyver', past: 'løj', pastParticiple: 'løjet', translation: 'to lie', example: 'Han lyver, når det passer ham.', exampleEn: 'He lies when it suits him.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »løj«. Må ikke forveksles med »ligge«.' },
    { infinitive: 'synge', present: 'synger', past: 'sang', pastParticiple: 'sunget', translation: 'to sing', example: 'Børnene synger en sang.', exampleEn: 'The children are singing a song.', cefr: 'A2', note: 'Uregelmæssigt verbum (y–a–u): »sang«, »sunget«.' },
    { infinitive: 'skyde', present: 'skyder', past: 'skød', pastParticiple: 'skudt', translation: 'to shoot', example: 'Jægeren skyder ikke i naturreservatet.', exampleEn: "The hunter doesn't shoot in the nature reserve.", cefr: 'B1', note: 'Uregelmæssigt verbum (y–ø–u). »Skyde genvej« betyder at tage en genvej.' },
    { infinitive: 'bryde', present: 'bryder', past: 'brød', pastParticiple: 'brudt', translation: 'to break', example: 'Bølgerne bryder mod stranden.', exampleEn: 'The waves break against the beach.', cefr: 'B1', note: 'Uregelmæssigt verbum (y–ø–u). »Bryde sig om« betyder at kunne lide.' },
    { infinitive: 'flyve', present: 'flyver', past: 'fløj', pastParticiple: 'fløjet', translation: 'to fly', example: 'Flyet flyver højt over skyerne.', exampleEn: 'The plane flies high above the clouds.', cefr: 'A2', note: 'Uregelmæssigt verbum: datid »fløj«. Bruges om fugle, fly og om ting, der bevæger sig hurtigt.' },
    { infinitive: 'flyde', present: 'flyder', past: 'flød', pastParticiple: 'flydt', translation: 'to flow', example: 'Vandet flyder ned ad floden.', exampleEn: 'The water flows down the river.', cefr: 'B1', note: 'Uregelmæssigt verbum: »flød«, »flydt«. I hverdagssproget kan »flyde« også betyde, at der er rodet.' },
    { infinitive: 'fryse', present: 'fryser', past: 'frøs', pastParticiple: 'frosset', translation: 'to freeze', example: 'Jeg fryser, når det er koldt udenfor.', exampleEn: "I freeze when it's cold outside.", cefr: 'A2', note: 'Uregelmæssigt verbum: »frøs«, »frosset«. Kan bruges upersonligt (»det fryser«) og personligt (»jeg fryser«).' },
    { infinitive: 'krybe', present: 'kryber', past: 'krøb', pastParticiple: 'krøbet', translation: 'to crawl', example: 'Babyen kryber på gulvet.', exampleEn: 'The baby crawls on the floor.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »krøb«. »Krybe til korset« betyder at give efter og indrømme, at man tog fejl.' },
    { infinitive: 'blive', present: 'bliver', past: 'blev', pastParticiple: 'blevet', translation: 'to become/stay', example: 'Hun bliver lærer efter uddannelsen.', exampleEn: 'She becomes a teacher after her education.', cefr: 'A1', note: 'Datid »blev«. Bruges også til at danne passiv: »det bliver gjort«.' },
    { infinitive: 'stå', present: 'står', past: 'stod', pastParticiple: 'stået', translation: 'to stand', example: 'Han står ved døren.', exampleEn: 'He stands by the door.', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »stod«. »Stå op« betyder at komme ud af sengen eller rejse sig.' },
    { infinitive: 'give', present: 'giver', past: 'gav', pastParticiple: 'givet', translation: 'to give', example: 'Jeg giver hende en gave.', exampleEn: 'I give her a present.', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »gav«. »Give op« betyder at opgive.' },
    { infinitive: 'få', present: 'får', past: 'fik', pastParticiple: 'fået', translation: 'to get/receive', example: 'Vi får post hver dag.', exampleEn: 'We get mail every day.', cefr: 'A1', note: 'Meget uregelmæssigt verbum: »får«, »fik«, »fået«. Bruges også i »få nogen til at gøre noget«.' },
    { infinitive: 'se', present: 'ser', past: 'så', pastParticiple: 'set', translation: 'to see', example: 'Jeg ser en fugl i træet.', exampleEn: 'I see a bird in the tree.', cefr: 'A1', note: 'Uregelmæssigt verbum: datid »så«. »Se ud« betyder at have et bestemt udseende; »se på« betyder at kigge på.' },
    { infinitive: 'bringe', present: 'bringer', past: 'bragte', pastParticiple: 'bragt', translation: 'to bring', example: 'Han bringer blomster til hende.', exampleEn: 'He brings her flowers.', cefr: 'A2', note: 'Uregelmæssigt verbum: »bragte«, »bragt«. Lidt mere formelt end »tage med«.' },
    { infinitive: 'kunne', present: 'kan', past: 'kunne', pastParticiple: 'kunnet', translation: 'to be able/can', example: 'Jeg kan tale dansk.', exampleEn: 'I can speak Danish.', cefr: 'A1', note: 'Modalverbum: nutid »kan«. Datid og infinitiv er ens (»kunne«).' },
    { infinitive: 'skulle', present: 'skal', past: 'skulle', pastParticiple: 'skullet', translation: 'to have to/shall', example: 'Vi skal mødes klokken fem.', exampleEn: "We're meeting at five o'clock.", cefr: 'A1', note: 'Modalverbum: nutid »skal«. Datid og infinitiv er ens. Udtrykker pligt eller en plan.' },
    { infinitive: 'ville', present: 'vil', past: 'ville', pastParticiple: 'villet', translation: 'to want/will', example: 'Hun vil rejse til Spanien.', exampleEn: 'She wants to travel to Spain.', cefr: 'A1', note: 'Modalverbum: nutid »vil«. Datid og infinitiv er ens. Udtrykker lyst eller vilje.' },
    { infinitive: 'måtte', present: 'må', past: 'måtte', pastParticiple: 'måttet', translation: 'may / must', example: 'Du må ikke ryge her.', exampleEn: 'You must not smoke here.', cefr: 'A1', note: 'Modalverbum: nutid »må«. »Må ikke« (forbud) er noget helt andet end »behøver ikke«.' },
    { infinitive: 'burde', present: 'bør', past: 'burde', pastParticiple: 'burdet', translation: 'to ought to/should', example: 'Du bør spise flere grøntsager.', exampleEn: 'You should eat more vegetables.', cefr: 'B1', note: 'Modalverbum: nutid »bør«. Datid og infinitiv er ens. Udtrykker en opfordring eller moralsk pligt.' },
    { infinitive: 'turde', present: 'tør', past: 'turde', pastParticiple: 'turdet', translation: 'to dare', example: 'Han tør ikke springe ud i vandet.', exampleEn: "He doesn't dare jump into the water.", cefr: 'B2', note: 'Modalverbum: nutid »tør«. Datid og infinitiv er ens. I skriftsprog kan »vove« også bruges.' },
    { infinitive: 'sætte', present: 'sætter', past: 'satte', pastParticiple: 'sat', translation: 'to put/place', example: 'Hun sætter koppen på bordet.', exampleEn: 'She puts the cup on the table.', cefr: 'A2', note: 'Uregelmæssigt verbum: »satte«, »sat«. »Sætte sig« betyder at sidde ned; »sætte i gang« betyder at starte noget.' },
    { infinitive: 'træffe', present: 'træffer', past: 'traf', pastParticiple: 'truffet', translation: 'to meet', example: 'Jeg træffer ham ofte i kantinen.', exampleEn: 'I often meet him in the canteen.', cefr: 'B1', note: 'Uregelmæssigt verbum: »traf«, »truffet«. »Træffe en beslutning« lyder mere formelt end »tage en beslutning«.' },
    { infinitive: 'nyde', present: 'nyder', past: 'nød', pastParticiple: 'nydt', translation: 'to enjoy', example: 'Vi nyder solen på terrassen.', exampleEn: 'We enjoy the sun on the terrace.', cefr: 'B1', note: 'Uregelmæssigt verbum: »nød«, »nydt«. Bruges om at få glæde af noget, fx sol eller en god middag.' },
    { infinitive: 'tilbringe', present: 'tilbringer', past: 'tilbragte', pastParticiple: 'tilbragt', translation: 'to spend (time)', example: 'De tilbringer sommeren ved kysten.', exampleEn: 'They spend the summer by the coast.', cefr: 'B1', note: 'Følger »bringe«: »tilbragte«, »tilbragt«. Bruges kun om tid, ikke om penge.' },
    { infinitive: 'fortsætte', present: 'fortsætter', past: 'fortsatte', pastParticiple: 'fortsat', translation: 'to continue', example: 'Hun fortsætter med at træne hver dag.', exampleEn: 'She continues to train every day.', cefr: 'A2', note: 'Følger »sætte«: »fortsatte«, »fortsat«. Bruges ofte med »med at + infinitiv«.' },
    { infinitive: 'opgive', present: 'opgiver', past: 'opgav', pastParticiple: 'opgivet', translation: 'to give up', example: 'Han giver aldrig så let op.', exampleEn: 'He never gives up so easily.', cefr: 'B1', note: 'Følger »give«: »opgav«, »opgivet«. I formelt sprog betyder det også at oplyse, fx »opgive sin adresse«.' },
    { infinitive: 'springe', present: 'springer', past: 'sprang', pastParticiple: 'sprunget', translation: 'to jump', example: 'Børnene springer i vandpytterne.', exampleEn: 'The children jump in the puddles.', cefr: 'B1', note: 'Uregelmæssigt verbum (i–a–u). »Springe over« betyder at hoppe over eller undlade noget.' },
    { infinitive: 'tvinge', present: 'tvinger', past: 'tvang', pastParticiple: 'tvunget', translation: 'to force', example: 'Regnen tvinger os indenfor.', exampleEn: 'The rain forces us inside.', cefr: 'B1', note: 'Uregelmæssigt verbum (i–a–u). Efterfølges ofte af »til at + infinitiv«.' },
    { infinitive: 'tilføje', present: 'tilføjer', past: 'tilføjede', pastParticiple: 'tilføjet', translation: 'to add', example: 'Hun tilføjer salt til suppen.', exampleEn: 'She adds salt to the soup.', cefr: 'B1', note: 'Regelmæssigt verbum (-ede/-et). Bruges om at føje noget til, fx ingredienser eller oplysninger.' },
    { infinitive: 'glemme', present: 'glemmer', past: 'glemte', pastParticiple: 'glemt', translation: 'to forget', example: 'Jeg glemmer altid mine nøgler.', exampleEn: 'I always forget my keys.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). »Glemme alt om« er en fast vending.' },
    { infinitive: 'drømme', present: 'drømmer', past: 'drømte', pastParticiple: 'drømt', translation: 'to dream', example: 'Han drømmer om at blive pilot.', exampleEn: 'He dreams of becoming a pilot.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). »Drømme om« bruges både om natlige drømme og om ønsker.' },
    { infinitive: 'løfte', present: 'løfter', past: 'løftede', pastParticiple: 'løftet', translation: 'to lift', example: 'Hun løfter den tunge kasse.', exampleEn: 'She lifts the heavy box.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Løfte sløret« betyder at afsløre noget.' },
    { infinitive: 'læse', present: 'læser', past: 'læste', pastParticiple: 'læst', translation: 'to read', example: 'Jeg læser en bog hver aften.', exampleEn: 'I read a book every evening.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Læse op« betyder at læse højt; »læse til læge« betyder at uddanne sig til læge.' },
    { infinitive: 'vokse', present: 'vokser', past: 'voksede', pastParticiple: 'vokset', translation: 'to grow', example: 'Planten vokser hurtigt i solen.', exampleEn: 'The plant grows quickly in the sun.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Vokse op« bruges om børn, der bliver voksne.' },
    { infinitive: 'betyde', present: 'betyder', past: 'betød', pastParticiple: 'betydet', translation: 'to mean', example: 'Ordet betyder noget helt andet.', exampleEn: 'The word means something completely different.', cefr: 'A2', note: 'Uregelmæssigt verbum: datid »betød«. »Det betyder meget for mig« er et almindeligt udtryk.' },
    { infinitive: 'rive', present: 'river', past: 'rev', pastParticiple: 'revet', translation: 'to tear', example: 'Hun river papiret i stykker.', exampleEn: 'She tears the paper into pieces.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »rev«. »Rive ned« betyder at nedrive.' },
    { infinitive: 'forstå', present: 'forstår', past: 'forstod', pastParticiple: 'forstået', translation: 'to understand', example: 'Jeg forstår ikke spørgsmålet.', exampleEn: "I don't understand the question.", cefr: 'A1', note: 'Følger »stå«: »forstod«, »forstået«. »Forstå sig på« betyder at have forstand på.' },
    { infinitive: 'fortælle', present: 'fortæller', past: 'fortalte', pastParticiple: 'fortalt', translation: 'to tell', example: 'Han fortæller en historie til børnene.', exampleEn: 'He tells the children a story.', cefr: 'A1', note: 'Uregelmæssigt verbum: »fortalte«, »fortalt«. »Fortælle om« betyder at berette om noget.' },
    { infinitive: 'hjælpe', present: 'hjælper', past: 'hjalp', pastParticiple: 'hjulpet', translation: 'to help', example: 'Vi hjælper hinanden med opgaverne.', exampleEn: 'We help each other with the tasks.', cefr: 'A1', note: 'Uregelmæssigt verbum: »hjalp«, »hjulpet«. »Hjælpe til« betyder at give en hånd med.' },
    { infinitive: 'modtage', present: 'modtager', past: 'modtog', pastParticiple: 'modtaget', translation: 'to receive', example: 'Hun modtager en pakke i dag.', exampleEn: 'She receives a package today.', cefr: 'B1', note: 'Følger »tage«: »modtog«, »modtaget«. Mere formelt end »få«.' },
    { infinitive: 'ringe', present: 'ringer', past: 'ringede', pastParticiple: 'ringet', translation: 'to call', example: 'Jeg ringer til min mor hver søndag.', exampleEn: 'I call my mother every Sunday.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Ringe til« betyder at telefonere; »ringe på« betyder at ringe på en dørklokke.' },
    { infinitive: 'ryge', present: 'ryger', past: 'røg', pastParticiple: 'røget', translation: 'to smoke', example: 'Han ryger ikke længere.', exampleEn: 'He no longer smokes.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »røg«. Kan også betyde at forsvinde, fx »Det røg ud ad vinduet«.' },
    { infinitive: 'smage', present: 'smager', past: 'smagte', pastParticiple: 'smagt', translation: 'to taste', example: 'Kagen smager virkelig godt.', exampleEn: 'The cake tastes really good.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). »Det smager godt« er det almindelige udtryk; »smage på« betyder at tage en bid.' },
    { infinitive: 'smide', present: 'smider', past: 'smed', pastParticiple: 'smidt', translation: 'to throw away', example: 'Han smider skraldet ud.', exampleEn: 'He throws the trash out.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »smed«. »Smide ud« betyder at kassere; »smide med« betyder at kaste rundt med noget.' },
    { infinitive: 'svømme', present: 'svømmer', past: 'svømmede', pastParticiple: 'svømmet', translation: 'to swim', example: 'Vi svømmer i havet om sommeren.', exampleEn: 'We swim in the sea in the summer.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et).' },
    { infinitive: 'svare', present: 'svarer', past: 'svarede', pastParticiple: 'svaret', translation: 'to answer', example: 'Hun svarer på alle spørgsmålene.', exampleEn: 'She answers all the questions.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Svare på« bruges om at besvare noget; »svare til« betyder at passe til.' },
    { infinitive: 'tænke', present: 'tænker', past: 'tænkte', pastParticiple: 'tænkt', translation: 'to think', example: 'Jeg tænker på dig hver dag.', exampleEn: 'I think of you every day.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Tænke på« betyder at have i tankerne; »tænke over« betyder at overveje.' },
    { infinitive: 'kysse', present: 'kysser', past: 'kyssede', pastParticiple: 'kysset', translation: 'to kiss', example: 'De kysser hinanden farvel.', exampleEn: 'They kiss each other goodbye.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Kysse farvel« er en fast vending.' },
    { infinitive: 'kende', present: 'kender', past: 'kendte', pastParticiple: 'kendt', translation: 'to know (someone)', example: 'Jeg kender ham fra skolen.', exampleEn: 'I know him from school.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). Bruges om at kende personer og steder; »vide« bruges om fakta.' },
    { infinitive: 'forlade', present: 'forlader', past: 'forlod', pastParticiple: 'forladt', translation: 'to leave', example: 'Hun forlader huset klokken otte.', exampleEn: 'She leaves the house at eight o\'clock.', cefr: 'B1', note: 'Følger »lade«: »forlod«, »forladt«. Mere formelt end »gå« eller »tage af sted«.' },
    { infinitive: 'mødes', present: 'mødes', past: 'mødtes', pastParticiple: 'mødtes', translation: 'to meet (each other)', example: 'Vi mødes på caféen kl. tre.', exampleEn: 'We meet at the café at 3 o\'clock.', cefr: 'A2', note: 'Gensidigt s-verbum: nutid og infinitiv ender begge på -es. S\'et kan ikke undværes.' },
    { infinitive: 'låne', present: 'låner', past: 'lånte', pastParticiple: 'lånt', translation: 'to borrow', example: 'Jeg låner en bog fra biblioteket.', exampleEn: 'I borrow a book from the library.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). Bruges både om at låne og at låne ud – sammenhængen afgør, hvad der menes.' },
    { infinitive: 'træde', present: 'træder', past: 'trådte', pastParticiple: 'trådt', translation: 'to step', example: 'Han træder ud af bilen.', exampleEn: 'He steps out of the car.', cefr: 'B1', note: 'Uregelmæssigt verbum: datid »trådte«. Mere formelt end »gå«; indgår i »træde i kraft«.' },
    { infinitive: 'oversætte', present: 'oversætter', past: 'oversatte', pastParticiple: 'oversat', translation: 'to translate', example: 'Hun oversætter teksten til engelsk.', exampleEn: 'She translates the text into English.', cefr: 'B1', note: 'Følger »sætte«. »Oversætte fra … til …« angiver kilde- og målsprog.' },
    { infinitive: 'beskrive', present: 'beskriver', past: 'beskrev', pastParticiple: 'beskrevet', translation: 'to describe', example: 'Han beskriver sin rejse i detaljer.', exampleEn: 'He describes his trip in detail.', cefr: 'B1', note: 'Følger »skrive«: »beskrev«, »beskrevet«. Bruges meget i akademisk og journalistisk sprog.' },
    { infinitive: 'beslutte', present: 'beslutter', past: 'besluttede', pastParticiple: 'besluttet', translation: 'to decide', example: 'Vi beslutter os for at blive hjemme.', exampleEn: 'We decide to stay home.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Bruges næsten altid refleksivt: »beslutte sig for at«.' },
    { infinitive: 'forberede', present: 'forbereder', past: 'forberedte', pastParticiple: 'forberedt', translation: 'to prepare', example: 'Hun forbereder middagen i køkkenet.', exampleEn: 'She prepares dinner in the kitchen.', cefr: 'B1', note: 'Regelmæssigt verbum (-te/-t). Bruges ofte refleksivt: »forberede sig på«.' },
    { infinitive: 'oplyse', present: 'oplyser', past: 'oplyste', pastParticiple: 'oplyst', translation: 'to inform', example: 'Skolen oplyser forældrene om ændringen.', exampleEn: 'The school informs the parents about the change.', cefr: 'B2', note: 'Regelmæssigt verbum (-te/-t). Formelt; i hverdagen siger man hellere »fortælle«. »Oplyse om« tager »om«.' },
    { infinitive: 'påstå', present: 'påstår', past: 'påstod', pastParticiple: 'påstået', translation: 'to claim', example: 'Han påstår, at han har ret.', exampleEn: 'He claims that he is right.', cefr: 'B1', note: 'Følger »stå«: »påstod«, »påstået«. Antyder, at udsagnet kan anfægtes, i modsætning til neutrale »sige«.' },
    { infinitive: 'sørge', present: 'sørger', past: 'sørgede', pastParticiple: 'sørget', translation: 'to care/ensure', example: 'Hun sørger for, at alt er klar.', exampleEn: 'She makes sure everything is ready.', cefr: 'B1', note: 'Regelmæssigt verbum (-ede/-et). »Sørge for« betyder at sikre; »sørge over« betyder at være ked af det.' },
    { infinitive: 'undskylde', present: 'undskylder', past: 'undskyldte', pastParticiple: 'undskyldt', translation: 'to apologize', example: 'Han undskylder for at komme sent.', exampleEn: 'He apologizes for being late.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). »Undskyld« er det almindelige ord for »sorry« og »excuse me«.' },
    { infinitive: 'undersøge', present: 'undersøger', past: 'undersøgte', pastParticiple: 'undersøgt', translation: 'to examine/investigate', example: 'Lægen undersøger patienten.', exampleEn: 'The doctor examines the patient.', cefr: 'B1', note: 'Regelmæssigt verbum (-te/-t). Bruges om lægeundersøgelser, videnskab og almindelig granskning.' },
    { infinitive: 'glæde', present: 'glæder', past: 'glædede', pastParticiple: 'glædet', translation: 'to please', example: 'Det glæder mig at se dig.', exampleEn: 'It pleases me to see you.', cefr: 'B1', note: 'Regelmæssigt verbum (-ede/-et). Bruges ofte refleksivt: »glæde sig til«.' },
    { infinitive: 'interessere', present: 'interesserer', past: 'interesserede', pastParticiple: 'interesseret', translation: 'to interest', example: 'Musik interesserer hende meget.', exampleEn: 'Music interests her a lot.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Bruges ofte refleksivt: »interessere sig for«.' },
    { infinitive: 'skynde', present: 'skynder', past: 'skyndte', pastParticiple: 'skyndt', translation: 'to hurry', example: 'Vi skynder os til toget.', exampleEn: 'We hurry to the train.', cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). Bruges næsten kun refleksivt: »skynde sig«.' },
    { infinitive: 'mene', present: 'mener', past: 'mente', pastParticiple: 'ment', translation: 'to think/mean', example: 'Jeg mener, det er en god idé.', exampleEn: "I think it's a good idea.", cefr: 'A2', note: 'Regelmæssigt verbum (-te/-t). »Jeg mener« udtrykker en holdning; »tænke« er selve tankeprocessen.' },
    { infinitive: 'acceptere', present: 'accepterer', past: 'accepterede', pastParticiple: 'accepteret', translation: 'to accept', example: 'Han accepterer tilbuddet.', exampleEn: 'He accepts the offer.', cefr: 'A2', note: 'Regelmæssigt verbum: verber på -ere får -erede/-eret i datid og tillægsform.' },
    { infinitive: 'arbejde', present: 'arbejder', past: 'arbejdede', pastParticiple: 'arbejdet', translation: 'to work', example: 'Hun arbejder på et hospital.', exampleEn: 'She works at a hospital.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Arbejde med« og »arbejde som« er almindelige.' },
    { infinitive: 'arrangere', present: 'arrangerer', past: 'arrangerede', pastParticiple: 'arrangeret', translation: 'to arrange', example: 'De arrangerer en fest for ham.', exampleEn: 'They arrange a party for him.', cefr: 'B1', note: 'Regelmæssigt -ere-verbum (-erede/-eret). Bruges meget om at planlægge arrangementer og møder.' },
    { infinitive: 'begynde', present: 'begynder', past: 'begyndte', pastParticiple: 'begyndt', translation: 'to begin', example: 'Filmen begynder klokken otte.', exampleEn: "The movie begins at eight o'clock.", cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Begynde at + infinitiv« er den almindelige konstruktion.' },
    { infinitive: 'besøge', present: 'besøger', past: 'besøgte', pastParticiple: 'besøgt', translation: 'to visit', example: 'Vi besøger vores bedsteforældre i weekenden.', exampleEn: 'We visit our grandparents on the weekend.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). Bruges både om at besøge personer og steder.' },
    { infinitive: 'betale', present: 'betaler', past: 'betalte', pastParticiple: 'betalt', translation: 'to pay', example: 'Han betaler regningen online.', exampleEn: 'He pays the bill online.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Betale for« betyder at give penge for noget; »betale sig« betyder at kunne svare sig.' },
    { infinitive: 'danse', present: 'danser', past: 'dansede', pastParticiple: 'danset', translation: 'to dance', example: 'De danser hele natten.', exampleEn: 'They dance all night.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Danse med nogen« betyder at danse sammen med en person.' },
    { infinitive: 'deltage', present: 'deltager', past: 'deltog', pastParticiple: 'deltaget', translation: 'to participate', example: 'Hun deltager i konkurrencen.', exampleEn: 'She participates in the competition.', cefr: 'B1', note: 'Følger »tage«: »deltog«, »deltaget«. Efterfølges af »i«, fx »deltage i et møde«.' },
    { infinitive: 'diskutere', present: 'diskuterer', past: 'diskuterede', pastParticiple: 'diskuteret', translation: 'to discuss', example: 'Vi diskuterer planerne for ferien.', exampleEn: 'We discuss the plans for the vacation.', cefr: 'A2', note: 'Regelmæssigt -ere-verbum (-erede/-eret). Kan ofte erstattes af »tale om«, men er lidt mere formelt.' },
    { infinitive: 'elske', present: 'elsker', past: 'elskede', pastParticiple: 'elsket', translation: 'to love', example: 'Jeg elsker dig.', exampleEn: 'I love you.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Jeg elsker dig« er den faste kærlighedserklæring.' },
    { infinitive: 'forklare', present: 'forklarer', past: 'forklarede', pastParticiple: 'forklaret', translation: 'to explain', example: 'Læreren forklarer reglen igen.', exampleEn: 'The teacher explains the rule again.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Forklare for nogen« betyder at forklare noget til en person.' },
    { infinitive: 'fotografere', present: 'fotograferer', past: 'fotograferede', pastParticiple: 'fotograferet', translation: 'to photograph', example: 'Han fotograferer solnedgangen.', exampleEn: 'He photographs the sunset.', cefr: 'B1', note: 'Regelmæssigt -ere-verbum (-erede/-eret). I hverdagen siger man ofte »tage et billede«.' },
    { infinitive: 'frygte', present: 'frygter', past: 'frygtede', pastParticiple: 'frygtet', translation: 'to fear', example: 'Hun frygter mørket.', exampleEn: 'She fears the dark.', cefr: 'B1', note: 'Regelmæssigt verbum (-ede/-et). Mere formelt end »være bange for«. »Frygte det værste« er en fast vending.' },
    { infinitive: 'grine', present: 'griner', past: 'grinede', pastParticiple: 'grinet', translation: 'to laugh', example: 'Vi griner af den sjove vittighed.', exampleEn: 'We laugh at the funny joke.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Hverdagsord for at le; »grine af« betyder at gøre grin med.' },
    { infinitive: 'hente', present: 'henter', past: 'hentede', pastParticiple: 'hentet', translation: 'to fetch', example: 'Jeg henter børnene fra skole.', exampleEn: 'I pick up the children from school.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Betyder at gå hen og tage noget med; »hente nogen« betyder at afhente en person.' },
    { infinitive: 'høre', present: 'hører', past: 'hørte', pastParticiple: 'hørt', translation: 'to hear', example: 'Hører du musikken?', exampleEn: 'Do you hear the music?', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Høre til« betyder at tilhøre; »høre fra« betyder at få besked fra nogen.' },
    { infinitive: 'købe', present: 'køber', past: 'købte', pastParticiple: 'købt', translation: 'to buy', example: 'Hun køber mælk i butikken.', exampleEn: 'She buys milk at the store.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Købe ind« betyder at handle. Det modsatte er »sælge«.' },
    { infinitive: 'køre', present: 'kører', past: 'kørte', pastParticiple: 'kørt', translation: 'to drive', example: 'Han kører til arbejde hver dag.', exampleEn: 'He drives to work every day.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). Bruges om at køre alle slags køretøjer, også »køre på cykel«.' },
    { infinitive: 'lave', present: 'laver', past: 'lavede', pastParticiple: 'lavet', translation: 'to make/do', example: 'Vi laver mad sammen i aften.', exampleEn: 'We are making food together tonight.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Lave mad« og »lave lektier« er meget almindelige udtryk.' },
    { infinitive: 'lege', present: 'leger', past: 'legede', pastParticiple: 'leget', translation: 'to play', example: 'Børnene leger i parken.', exampleEn: 'The children play in the park.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Lege« bruges om børns leg; om sport og instrumenter bruger man »spille«.' },
    { infinitive: 'lære', present: 'lærer', past: 'lærte', pastParticiple: 'lært', translation: 'to learn', example: 'Jeg lærer dansk hver dag.', exampleEn: 'I learn Danish every day.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). Betyder både at lære og at undervise – »lære nogen noget« betyder at undervise.' },
    { infinitive: 'lytte', present: 'lytter', past: 'lyttede', pastParticiple: 'lyttet', translation: 'to listen', example: 'Hun lytter til radioen.', exampleEn: 'She listens to the radio.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Lytte til« tager »til«. Modsat »høre« er det en aktiv handling.' },
    { infinitive: 'lukke', present: 'lukker', past: 'lukkede', pastParticiple: 'lukket', translation: 'to close', example: 'Butikken lukker klokken seks.', exampleEn: "The store closes at six o'clock.", cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Lukke op« betyder tværtimod at åbne – et nyttigt par af modsætninger.' },
    { infinitive: 'male', present: 'maler', past: 'malede', pastParticiple: 'malet', translation: 'to paint', example: 'Han maler et billede af søen.', exampleEn: 'He paints a picture of the lake.', cefr: 'B1', note: 'Regelmæssigt verbum (-ede/-et). Bruges både om kunstmaleri og om at male et hus.' },
    { infinitive: 'åbne', present: 'åbner', past: 'åbnede', pastParticiple: 'åbnet', translation: 'to open', example: 'Hun åbner vinduet for frisk luft.', exampleEn: 'She opens the window for fresh air.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). »Åbne for« bruges om at dreje op for fx vand: »åbne for vandhanen«.' },
    { infinitive: 'prøve', present: 'prøver', past: 'prøvede', pastParticiple: 'prøvet', translation: 'to try', example: 'Jeg prøver en ny opskrift.', exampleEn: 'I am trying a new recipe.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Prøve at« betyder at forsøge; om tøj siger man »prøve en jakke« eller »prøve noget på«.' },
    { infinitive: 'reparere', present: 'reparerer', past: 'reparerede', pastParticiple: 'repareret', translation: 'to repair', example: 'Han reparerer cyklen i garagen.', exampleEn: 'He repairs the bike in the garage.', cefr: 'B1', note: 'Regelmæssigt -ere-verbum (-erede/-eret). Lidt formelt; i hverdagen siger man også »fikse« eller »sætte i stand«.' },
    { infinitive: 'savne', present: 'savner', past: 'savnede', pastParticiple: 'savnet', translation: 'to miss', example: 'Jeg savner mine venner.', exampleEn: 'I miss my friends.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Bruges om at længes efter personer eller ting; »mangle« bruges om at mangle noget.' },
    { infinitive: 'smile', present: 'smiler', past: 'smilede', pastParticiple: 'smilet', translation: 'to smile', example: 'Hun smiler, når hun ser ham.', exampleEn: 'She smiles when she sees him.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). »Smile til nogen« betyder at smile mod en person. Substantivet er »et smil«.' },
    { infinitive: 'snakke', present: 'snakker', past: 'snakkede', pastParticiple: 'snakket', translation: 'to chat', example: 'Vi snakker om gamle dage.', exampleEn: 'We chat about old times.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). Hverdagssprog; i mere formelle sammenhænge siger man »tale«. »Snakke om« betyder at tale om.' },
    { infinitive: 'spille', present: 'spiller', past: 'spillede', pastParticiple: 'spillet', translation: 'to play', example: 'Han spiller fodbold om søndagene.', exampleEn: 'He plays football on Sundays.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). Bruges om sport og instrumenter; »lege« bruges om børns leg.' },
    { infinitive: 'spørge', present: 'spørger', past: 'spurgte', pastParticiple: 'spurgt', translation: 'to ask', example: 'Hun spørger om vejen til stationen.', exampleEn: 'She asks for directions to the station.', cefr: 'A1', note: 'Uregelmæssigt verbum: »spurgte«, »spurgt«. »Spørge om« betyder at stille et spørgsmål om noget; »spørge efter« bruges, når man beder om at få eller tale med nogen eller noget, fx »spørge efter chefen«.' },
    { infinitive: 'starte', present: 'starter', past: 'startede', pastParticiple: 'startet', translation: 'to start', example: 'Mødet starter om ti minutter.', exampleEn: 'The meeting starts in ten minutes.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). Kan ofte erstattes af »begynde«, men lyder lidt mere moderne og hverdagsagtigt.' },
    { infinitive: 'stoppe', present: 'stopper', past: 'stoppede', pastParticiple: 'stoppet', translation: 'to stop', example: 'Bussen stopper ved hjørnet.', exampleEn: 'The bus stops at the corner.', cefr: 'A1', note: 'Regelmæssigt verbum (-ede/-et). Kan ofte erstattes af »holde op«.' },
    { infinitive: 'studere', present: 'studerer', past: 'studerede', pastParticiple: 'studeret', translation: 'to study', example: 'Hun studerer medicin på universitetet.', exampleEn: 'She studies medicine at university.', cefr: 'A1', note: 'Regelmæssigt -ere-verbum (-erede/-eret). Bruges om studier på universitetet; »læse« er mere generelt.' },
    { infinitive: 'tale', present: 'taler', past: 'talte', pastParticiple: 'talt', translation: 'to speak', example: 'Vi taler dansk i klassen.', exampleEn: 'We speak Danish in class.', cefr: 'A1', note: 'Regelmæssigt verbum (-te/-t). »Tale med« og »tale om« er faste udtryk. Lidt mere formelt end »snakke«.' },
    { infinitive: 'træne', present: 'træner', past: 'trænede', pastParticiple: 'trænet', translation: 'to train', example: 'Han træner i fitnesscentret hver morgen.', exampleEn: 'He trains at the gym every morning.', cefr: 'A2', note: 'Regelmæssigt verbum (-ede/-et). Bruges om motion og sportstræning, også om at træne andre.' },
    { infinitive: 'tømme', present: 'tømmer', past: 'tømte', pastParticiple: 'tømt', translation: 'to empty', example: 'Hun tømmer skraldespanden.', exampleEn: 'She empties the trash can.', cefr: 'B1', note: 'Regelmæssigt verbum (-te/-t). Bruges om at fjerne alt indhold; »tappe« bruges om væsker.' },
];

// Status tracking for each verb: 'unreviewed', 'correct', or 'wrong'
let statuses = verbs.map(() => ({ status: 'unreviewed' }));

// Index of the current card being shown
let currentIndex = 0;

// Score counters
let correctCount = 0;
let wrongCount = 0;

// Active CEFR filter: 'All' or one of 'A1','A2','B1','B2','C1'
let cefrFilter = 'All';

/* ---------- REVIEW MISTAKES MODE ---------- */
// When in review mode these are non-null:
//   reviewDeck     — array of { verbIndex } for the mistake verbs being reviewed
//   reviewPos      — current position within reviewDeck
//   savedIndex     — currentIndex value to restore on exit
let reviewDeck   = null;
let reviewPos    = 0;
let savedIndex   = 0;

// Returns the subset of verbs that match the current CEFR filter
function filteredVerbs() {
    if (cefrFilter === 'All') return verbs;
    return verbs.filter(v => v.cefr === cefrFilter);
}

/* ---------- PROGRESS (localStorage) ---------- */
const LS_KEY = 'verb_glosekort_v1';

// Build a fresh, default progress object matching the current deck size
function defaultProgress() {
    return {
        currentIndex: 0,
        correctCount: 0,
        wrongCount: 0,
        statuses: verbs.map(() => ({ status: 'unreviewed' }))
    };
}

// Load saved progress from localStorage, falling back to defaults on any
// missing/invalid data or if storage is unavailable (e.g. private browsing).
function loadProgress() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return defaultProgress();
        const data = JSON.parse(raw);
        if (
            !data ||
            !Array.isArray(data.statuses) ||
            data.statuses.length !== verbs.length ||
            typeof data.currentIndex !== 'number'
        ) {
            return defaultProgress();
        }
        return data;
    } catch (e) {
        return defaultProgress();
    }
}

// Persist the current game state to localStorage
function saveProgress() {
    try {
        const data = {
            currentIndex: currentIndex,
            correctCount: correctCount,
            wrongCount: wrongCount,
            statuses: statuses
        };
        localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (e) {
        // Storage blocked (e.g. private browsing) - silently ignore.
    }
}

/* ---------- SPEECH SYNTHESIS (Danish) ---------- */
let voices = [];
function refreshVoices(){
    if(!('speechSynthesis' in window)) return;
    voices = speechSynthesis.getVoices();
}
function danishVoice(){
    return (window.DanskSpeech&&DanskSpeech.pickVoice(voices))||voices.find(v=>/da(-|_)?DK/i.test(v.lang)) || voices.find(v=>/^da/i.test(v.lang)) || null;
}
if('speechSynthesis' in window){
    speechSynthesis.onvoiceschanged = refreshVoices;
    refreshVoices();
}
function speak(text){
    if(!('speechSynthesis' in window) || !text) return;
    try{
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(window.DanskSpeech?DanskSpeech.normalize(text):text);
        u.lang = "da-DK";
        const v = danishVoice();
        if(v) u.voice = v;
        u.rate = 0.95;
        speechSynthesis.speak(u);
    }catch(e){/* ignore */}
}
function speakerBtn(text, cls){
    const b = document.createElement("button");
    b.className = "dc-tts-button " + (cls||"");
    b.type = "button";
    b.setAttribute("aria-label","Lyt");
    b.addEventListener("click", e=>{ e.stopPropagation(); speak(text); });
    return b;
}

// DOM references
const verbListEl = document.getElementById('verb-list');
const cardWrapper = document.querySelector('.card-wrapper');
const cardNumberEl = document.getElementById('card-number');
const remainingEl = document.getElementById('remaining');
const correctCountEl = document.getElementById('correct-count');
const wrongCountEl = document.getElementById('wrong-count');
const wrongBtn = document.getElementById('wrong-btn');
const rightBtn = document.getElementById('right-btn');
const restartBtn = document.getElementById('restart-btn');
const reviewMistakesBtn = document.getElementById('review-mistakes-btn');
const reviewModeBanner  = document.getElementById('review-mode-banner');
const exitReviewBtn     = document.getElementById('exit-review-btn');

/* ---------- REVIEW MISTAKES HELPERS ---------- */

// Returns true when we are currently in Review Mode
function inReviewMode() { return reviewDeck !== null; }

// Update the Review Mistakes button: enabled only when there are 'wrong' verbs
// and we are NOT already in review mode
function updateReviewBtn() {
    const hasWrong = statuses.some(s => s.status === 'wrong');
    reviewMistakesBtn.disabled = !hasWrong || inReviewMode();
    reviewMistakesBtn.title = hasWrong
        ? 'Øv de verber, du har svaret forkert på'
        : 'Ingen fejl endnu – øv dig videre!';
}

// Enter Review Mode: snapshot current position, build the sub-deck, render
function enterReviewMode() {
    savedIndex = currentIndex;
    reviewDeck = statuses
        .map((s, i) => (s.status === 'wrong' ? i : -1))
        .filter(i => i !== -1)
        .map(verbIndex => ({ verbIndex }));
    reviewPos = 0;
    currentIndex = reviewDeck[0].verbIndex;
    reviewModeBanner.style.display = 'flex';
    reviewMistakesBtn.disabled = true;
    renderAll();
}

// Exit Review Mode: restore the saved position, hide the banner, re-render
function exitReviewMode() {
    reviewDeck  = null;
    reviewPos   = 0;
    currentIndex = savedIndex;
    reviewModeBanner.style.display = 'none';
    updateReviewBtn();
    renderAll();
}

// Advance within the review sub-deck; exit when the deck is exhausted
function reviewGoToNext() {
    reviewPos++;
    if (reviewPos >= reviewDeck.length) {
        // Finished all mistake cards — exit automatically
        exitReviewMode();
    } else {
        currentIndex = reviewDeck[reviewPos].verbIndex;
        renderAll();
    }
}

/* ---------- CEFR LEVEL FILTER UI ---------- */
function buildCefrFilter() {
    const sidebar = document.querySelector('.sidebar');
    const heading = sidebar.querySelector('h2');

    const filterRow = document.createElement('div');
    filterRow.id = 'cefr-filter';
    filterRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin-bottom:0.9rem;';

    const levels = ['All', 'A1', 'A2', 'B1', 'B2', 'C1'];
    levels.forEach(level => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = level === 'All' ? 'Alle' : level;
        btn.dataset.level = level;
        btn.style.cssText = [
            'padding:3px 9px',
            'border-radius:999px',
            'border:2px solid var(--wl-gold)',
            'background:rgba(255,255,255,0.07)',
            'color:var(--wl-gold-light)',
            'font-family:\'Quicksand\',sans-serif',
            'font-size:0.78rem',
            'font-weight:700',
            'cursor:pointer',
            'transition:background 0.2s,color 0.2s',
        ].join(';');
        if (level === cefrFilter) {
            btn.style.background = 'var(--wl-gold)';
            btn.style.color = 'var(--wl-ink)';
        }
        btn.addEventListener('click', () => {
            cefrFilter = level;
            // Update active styling
            filterRow.querySelectorAll('button').forEach(b => {
                b.style.background = 'rgba(255,255,255,0.07)';
                b.style.color = 'var(--wl-gold-light)';
            });
            btn.style.background = 'var(--wl-gold)';
            btn.style.color = 'var(--wl-ink)';
            // Jump to first card in the filtered set (or stay if already valid)
            const fv = filteredVerbs();
            if (fv.length === 0) return;
            // If currentIndex verb is not in filtered set, move to first filtered verb
            if (!fv.includes(verbs[currentIndex])) {
                currentIndex = verbs.indexOf(fv[0]);
            }
            // US-043: never rest on an already-answered card (both buttons would be disabled)
            if (!inReviewMode()) skipToUnanswered();
            renderAll();
        });
        filterRow.appendChild(btn);
    });

    // Insert filter row between heading and verb list
    heading.insertAdjacentElement('afterend', filterRow);

    // US-037: on small screens the sidebar sits below the card, so show the
    // compact level-chip row above the card instead.
    const mq = window.matchMedia ? window.matchMedia('(max-width: 480px)') : null;
    function placeFilter() {
        if (mq && mq.matches) {
            const main = document.querySelector('.main-content');
            const sb = main && main.querySelector('.scoreboard');
            if (main && sb) main.insertBefore(filterRow, sb);
        } else {
            heading.insertAdjacentElement('afterend', filterRow);
        }
    }
    if (mq) {
        placeFilter();
        if (mq.addEventListener) mq.addEventListener('change', placeFilter);
        else if (mq.addListener) mq.addListener(placeFilter);
    }
}

// Create and display the card for the current verb
function renderCard() {
    // Clear previous card
    cardWrapper.innerHTML = '';

    const verb = verbs[currentIndex];
    // Create card element
    const card = document.createElement('div');
    card.classList.add('flashcard');

    // Front side: shows infinitive and translation
    const front = document.createElement('div');
    front.classList.add('card-face', 'card-front');
    front.innerHTML = `<div class="infinitive-row"><span>${verb.infinitive}</span></div><div style="font-size:0.8rem; margin-top:0.5rem;">${verb.translation}</div>`;
    front.querySelector('.infinitive-row').appendChild(speakerBtn(verb.infinitive, 'speaker-front'));

    // Back side: shows conjugated forms plus an example sentence in context
    const back = document.createElement('div');
    back.classList.add('card-face', 'card-back');
    back.innerHTML = `
        <p><strong>Nutid:</strong> ${verb.present}</p>
        <p><strong>Datid:</strong> ${verb.past}</p>
        <p><strong>Tillægsform:</strong> ${verb.pastParticiple}</p>
        <p class="example example-row">"${verb.example}"</p>
        <p class="example-en">${verb.exampleEn}</p>
    `;
    back.querySelector('.example-row').appendChild(speakerBtn(verb.example, 'speaker-back'));

    // Usage/conjugation note (shown on card back)
    if (verb.note) {
        const noteEl = document.createElement('p');
        noteEl.className = 'verb-note';
        noteEl.style.cssText = [
            'margin-top:0.45rem',
            'font-size:0.72rem',
            'font-style:italic',
            'opacity:0.78',
            'color:var(--wl-cream)',
            'border-top:1px dashed rgba(212,175,55,0.35)',
            'padding-top:0.35rem',
            'line-height:1.35',
        ].join(';');
        noteEl.textContent = verb.note;
        back.appendChild(noteEl);
    }

    // Append faces and event listener to flip
    card.appendChild(front);
    card.appendChild(back);
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Vend kortet');
    card.addEventListener('click', () => {
        card.classList.toggle('is-flipped');
    });
    card.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target === card) {
            e.preventDefault();
            card.classList.toggle('is-flipped');
        }
    });

    cardWrapper.appendChild(card);
}

// Render the list of verbs in the sidebar with status indicators
function renderVerbList() {
    verbListEl.innerHTML = '';
    const fv = filteredVerbs();
    fv.forEach((verb) => {
        const index = verbs.indexOf(verb);
        const li = document.createElement('li');
        // US-043: keyboard-operable list item (real button inside the li)
        const itemBtn = document.createElement('button');
        itemBtn.type = 'button';
        itemBtn.className = 'verb-item-btn';
        itemBtn.textContent = verb.infinitive;
        li.appendChild(itemBtn);

        // Determine status class
        if (index === currentIndex) {
            li.classList.add('now');
            itemBtn.setAttribute('aria-current', 'true');
        } else if (fv.indexOf(verb) === fv.indexOf(verbs[currentIndex]) + 1) {
            li.classList.add('next');
        }

        if (statuses[index].status === 'correct') {
            li.classList.add('completed', 'correct');
        } else if (statuses[index].status === 'wrong') {
            li.classList.add('completed', 'wrong');
        }

        // Add click event to jump to card
        itemBtn.addEventListener('click', () => {
            currentIndex = index;
            renderAll();
            // renderAll rebuilds the list: keep keyboard focus on the chosen verb
            const nowBtn = verbListEl.querySelector('li.now button');
            if (nowBtn) nowBtn.focus();
        });

        verbListEl.appendChild(li);
    });
}

// Update the scoreboard numbers
function updateScoreboard() {
    if (inReviewMode()) {
        // Show review-specific counters
        const total = reviewDeck.length;
        cardNumberEl.textContent = `Repetition ${reviewPos + 1} af ${total}`;
        const remaining = total - reviewPos;
        remainingEl.textContent = `Tilbage: ${remaining}`;
        correctCountEl.textContent = `Rigtige: ${correctCount}`;
        wrongCountEl.textContent = `Forkerte: ${wrongCount}`;

        const progressBar = document.getElementById('progress-bar');
        progressBar.style.background = 'linear-gradient(90deg, var(--wl-red-dark), var(--wl-red))';
        progressBar.style.width = `${(reviewPos / total) * 100}%`;

        // In review mode cards always start as 'wrong' — always allow re-rating
        wrongBtn.disabled = false;
        rightBtn.disabled = false;
        wrongBtn.classList.remove('disabled');
        rightBtn.classList.remove('disabled');
    } else {
        // Normal mode scoreboard
        const progressBar = document.getElementById('progress-bar');
        progressBar.style.background = '';   // restore CSS default

        const fv = filteredVerbs();
        const filteredStatuses = fv.map(v => statuses[verbs.indexOf(v)]);
        const completedCount = filteredStatuses.filter(item => item.status !== 'unreviewed').length;
        const filteredPosition = fv.indexOf(verbs[currentIndex]);
        const displayIndex = filteredPosition >= 0 ? filteredPosition : 0;

        cardNumberEl.textContent = `Kort ${displayIndex + 1} af ${fv.length}`;
        const remaining = fv.length - completedCount;
        remainingEl.textContent = `Tilbage: ${remaining}`;
        correctCountEl.textContent = `Rigtige: ${correctCount}`;
        wrongCountEl.textContent = `Forkerte: ${wrongCount}`;

        const progressPercent = fv.length > 0 ? (completedCount / fv.length) * 100 : 0;
        progressBar.style.width = `${progressPercent}%`;

        // Disable buttons if current card already marked
        const status = statuses[currentIndex].status;
        if (status === 'correct' || status === 'wrong') {
            wrongBtn.disabled = true;
            rightBtn.disabled = true;
            wrongBtn.classList.add('disabled');
            rightBtn.classList.add('disabled');
        } else {
            wrongBtn.disabled = false;
            rightBtn.disabled = false;
            wrongBtn.classList.remove('disabled');
            rightBtn.classList.remove('disabled');
        }
    }

    updateReviewBtn();
}

// Render everything
function renderAll() {
    cancelAdvance();
    renderVerbList();
    renderCard();
    updateScoreboard();
}

// US-043: index of the next unanswered card in the filtered set after fromIdx
// (wrapping around), or -1 when every card in the filter is answered.
function nextUnanswered(fromIdx) {
    const fv = filteredVerbs();
    const pos = fv.indexOf(verbs[fromIdx]);
    for (let k = 1; k <= fv.length; k++) {
        const v = fv[(pos + k) % fv.length];
        const idx = verbs.indexOf(v);
        if (statuses[idx].status === 'unreviewed') return idx;
    }
    return -1;
}

// If the current card is already answered, move to an unanswered one (if any)
function skipToUnanswered() {
    if (statuses[currentIndex].status === 'unreviewed') return;
    const n = nextUnanswered(currentIndex);
    if (n !== -1) currentIndex = n;
}

// Move to the next unanswered card within the filtered set; if none are left,
// stay put (the "Bunken er færdig" panel is shown).
function goToNext() {
    const n = nextUnanswered(currentIndex);
    if (n !== -1) currentIndex = n;
    renderAll();
}

// US-043: pending auto-advance. While one is pending, further answer clicks are ignored.
let advanceTimer = null;
let lastClickAccepted = false;   // read by the Sjovt hooks below
function cancelAdvance() {
    if (advanceTimer !== null) { clearTimeout(advanceTimer); advanceTimer = null; }
    wrongBtn.classList.remove('disabled');
    rightBtn.classList.remove('disabled');
}
function scheduleAdvance(fn) {
    wrongBtn.classList.add('disabled');
    rightBtn.classList.add('disabled');
    advanceTimer = setTimeout(() => { advanceTimer = null; fn(); }, 1200);
}

// Handle marking as wrong — also auto-flips the card to reveal note
wrongBtn.addEventListener('click', () => {
    lastClickAccepted = false;
    if (advanceTimer !== null) return;
    if (inReviewMode()) {
        lastClickAccepted = true;
        // In review mode: verb stays 'wrong', flip to show answer, then advance
        const card = cardWrapper.querySelector('.flashcard');
        if (card && !card.classList.contains('is-flipped')) {
            card.classList.add('is-flipped');
        }
        scheduleAdvance(reviewGoToNext);
        return;
    }
    if (statuses[currentIndex].status === 'unreviewed') {
        lastClickAccepted = true;
        statuses[currentIndex].status = 'wrong';
        wrongCount++;
        saveProgress();
        // Flip the card so the note is visible before advancing
        const card = cardWrapper.querySelector('.flashcard');
        if (card && !card.classList.contains('is-flipped')) {
            card.classList.add('is-flipped');
        }
        // Delay advance so learner can read the note
        scheduleAdvance(goToNext);
    }
});

// Handle marking as correct
rightBtn.addEventListener('click', () => {
    lastClickAccepted = false;
    if (advanceTimer !== null) return;
    if (inReviewMode()) {
        lastClickAccepted = true;
        // Promote this verb from 'wrong' to 'correct' and advance
        if (statuses[currentIndex].status === 'wrong') {
            statuses[currentIndex].status = 'correct';
            correctCount++;
            wrongCount = Math.max(0, wrongCount - 1);
            saveProgress();
        }
        reviewGoToNext();
        return;
    }
    if (statuses[currentIndex].status === 'unreviewed') {
        lastClickAccepted = true;
        statuses[currentIndex].status = 'correct';
        correctCount++;
        saveProgress();
        goToNext();
    }
});

// Restart the game
restartBtn.addEventListener('click', () => {
    // US-011: never wipe progress without confirmation (wording matches Magiske Verber)
    if (!confirm('Vil du nulstille alle fremskridt? Det kan ikke fortrydes.')) return;
    // Exit review mode if active before resetting
    if (inReviewMode()) {
        reviewDeck = null;
        reviewPos  = 0;
        reviewModeBanner.style.display = 'none';
    }
    // Reset statuses
    statuses = verbs.map(() => ({ status: 'unreviewed' }));
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    saveProgress();
    renderAll();
    const sdFb = document.getElementById('sd-fb');
    if (sdFb) { sdFb.className = 'sd-fb-line'; sdFb.textContent = ''; }
});

// Enter review mode when "Review Mistakes" is clicked
reviewMistakesBtn.addEventListener('click', () => {
    if (!inReviewMode()) enterReviewMode();
});

// Exit review mode when "Back to full deck" is clicked
exitReviewBtn.addEventListener('click', () => {
    if (inReviewMode()) exitReviewMode();
});

// Initialize on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    // Build the CEFR filter UI in the sidebar
    buildCefrFilter();

    // Restore any saved progress before the first render so the sidebar's
    // now/next/completed classes and the scoreboard reflect where the user
    // left off. Falls back to a fresh game if nothing was saved or storage
    // is unavailable.
    const saved = loadProgress();
    statuses = saved.statuses;
    currentIndex = saved.currentIndex;
    correctCount = saved.correctCount;
    wrongCount = saved.wrongCount;
    skipToUnanswered();

    renderAll();
    // Reflect persisted mistake state on the Review button
    updateReviewBtn();
});


/* ---------- Sjovt Dansk visual hooks (additive; no game logic) ---------- */
(function () {
    const S = window.Sjovt;
    const fbEl = document.getElementById('sd-fb');
    const doneEl = document.getElementById('sd-done');
    const doneText = document.getElementById('sd-done-text');
    let wasDone = null, lastC = null, lastW = null;

    function setFb(ok, text) {
        if (!fbEl) return;
        fbEl.className = 'sd-fb-line ' + (ok ? 'ok' : 'bad');
        fbEl.textContent = (ok ? '✓ ' : '✗ ') + text;
    }
    wrongBtn.addEventListener('click', () => {
        if (wrongBtn.disabled || !lastClickAccepted) return;
        setFb(false, 'Markeret som forkert – kortet er vendt, så du kan studere det');
        if (S) S.fx.wrong(wrongBtn);
    });
    rightBtn.addEventListener('click', () => {
        if (rightBtn.disabled || !lastClickAccepted) return;
        setFb(true, 'Markeret som rigtigt');
        if (S) S.fx.correct(rightBtn);
    });
    // Feedback line is cleared inside the restart handler, only after the reset is confirmed.

    const baseUpdate = updateScoreboard;
    updateScoreboard = function () {
        baseUpdate();
        const fv = filteredVerbs();
        const done = !inReviewMode() && fv.length > 0 && fv.every(v => statuses[verbs.indexOf(v)].status !== 'unreviewed');
        if (doneEl) {
            doneEl.hidden = !done;
            if (done && doneText) doneText.textContent = `Rigtige: ${correctCount} · Forkerte: ${wrongCount}`;
        }
        if (done && wasDone === false && S) { S.fx.celebrate(); S.fx.enter(doneEl); }
        wasDone = done;
        if (S) {
            if (lastC !== null && correctCount !== lastC) S.fx.bump(correctCountEl);
            if (lastW !== null && wrongCount !== lastW) S.fx.bump(wrongCountEl);
        }
        lastC = correctCount; lastW = wrongCount;
    };
    if (S) S.watchScreens('.review-mode-banner');
})();
