import { loadNow, loadBaseline, eq, ok, done } from './lib.mjs';
const F = 'tidsmaskinen/data.js';
const flat = w => Object.values(w.TIDS_DATA).flat().filter(x => x && x.id);
const now = flat(loadNow(F)), old = flat(loadBaseline(F));
const TARGET = ['maden-serveres-kun-mellem-klokken-11-og-13', 'foedselsdagen-fejres-altid-med-kage-og-flag', 'der-betales-kun-med-kort-her', 'der-spises-ikke-i-klassen'];
const bad = TARGET.filter(id => { const x = now.find(p => p.id === id); return !x || /___\s+(ikke|kun|altid)\b/i.test(x.sentence) || (x.sentence.match(/___/g) || []).length !== 1 || !x.options.includes(x.correct); });
eq('target items fixed', bad, []);
eq('total items', now.length, old.length);
eq('ids unchanged', now.map(x => x.id), old.map(x => x.id));
const oldById = new Map(old.map(x => [x.id, x]));
const changed = now.filter(x => JSON.stringify(x) !== JSON.stringify(oldById.get(x.id))).map(x => x.id);
ok(`only passive-mode items may change (got ${changed.filter(id => now.find(x => x.id === id).mode !== 'passive')})`, changed.every(id => now.find(x => x.id === id).mode === 'passive'));
ok(`too many items changed: ${changed.length}`, changed.length <= 12);
for (const id of changed) { const x = now.find(p => p.id === id); ok('options/correct invalid ' + id, x.options.includes(x.correct) && (x.accepted_answers || []).includes(x.correct)); }
done();
