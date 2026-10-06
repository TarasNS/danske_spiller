import { loadNow, loadBaseline, eq, ok, done } from './lib.mjs';
const F = 'shared/data/verbs.js';
const now = loadNow(F).DANSK_VERBS, old = loadBaseline(F).DANSK_VERBS;
const g = i => now.find(v => v.infinitive === i)?.imperative;
eq('snakke', g('snakke'), 'snak'); eq('lukke', g('lukke'), 'luk'); eq('kysse', g('kysse'), 'kys'); eq('passe', g('passe'), 'pas'); eq('spise', g('spise'), 'spis');
eq('verb count', now.length, old.length);
// Only imperatives that had a doubled final consonant may change, and only by dropping one letter.
const byId = new Map(old.map(v => [v.id, v]));
for (const v of now) {
  const o = byId.get(v.id); if (!o) { ok('unknown id ' + v.id, false); continue; }
  for (const k of Object.keys(o)) {
    if (JSON.stringify(o[k]) === JSON.stringify(v[k])) continue;
    ok(`unexpected change ${v.id}.${k}`, k === 'imperative' && /([b-df-hj-np-tv-z])\1$/.test(o.imperative) && v.imperative === o.imperative.slice(0, -1));
  }
}
done();
