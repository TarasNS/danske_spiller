import { loadNow, loadBaseline, eq, ok, done } from './lib.mjs';
const F = 'shared/data/nouns.js';
const now = loadNow(F).DANSK_NOUNS, old = loadBaseline(F).DANSK_NOUNS;
const g = b => now.find(n => n.base === b)?.definite_plural;
eq('lærer', g('lærer'), 'lærerne'); eq('computer', g('computer'), 'computerne'); eq('printer', g('printer'), 'printerne');
eq('noun count', now.length, old.length);
// Nothing else may change: only -er-base nouns, and only definite_plural.
const byId = new Map(old.map(n => [n.id, n]));
for (const n of now) {
  const o = byId.get(n.id); if (!o) { ok('unknown id ' + n.id, false); continue; }
  for (const k of Object.keys(o)) if (JSON.stringify(o[k]) !== JSON.stringify(n[k]) && !(k === 'definite_plural' && /er$/.test(n.base))) ok(`unexpected change ${n.id}.${k}`, false);
}
done();
