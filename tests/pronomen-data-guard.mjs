// Placeholder/integrity guard for pronomenmysteriet/data.js (US-001). Dependency-free.
//   node tests/pronomen-data-guard.mjs [path/to/data.js]
// Exit 1 on any failure. Mode keys and level chips are read from the game's index.html
// so the data cannot silently drift from what the game expects.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.resolve(process.argv[2] || path.join(root, 'pronomenmysteriet/data.js'));
const html = fs.readFileSync(path.join(root, 'pronomenmysteriet/index.html'), 'utf8');

const errors = [];
const fail = (m) => errors.push(m);

const gameModes = [...html.matchAll(/\{\s*key:'([a-z_]+)'\s*,\s*num:\d+/g)].map(m => m[1]);
const lv = html.match(/var LEVELS = \[([^\]]*)\]/);
const gameLevels = lv ? [...lv[1].matchAll(/'([^']+)'/g)].map(m => m[1]) : [];
if (gameModes.length === 0) fail('could not read mode keys from pronomenmysteriet/index.html');
if (gameLevels.length === 0) fail('could not read LEVELS from pronomenmysteriet/index.html');

const sandbox = { window: {} };
try {
  vm.runInNewContext(fs.readFileSync(dataFile, 'utf8'), sandbox, { filename: dataFile });
} catch (e) {
  fail('data file failed to load: ' + e.message);
}
const DATA = sandbox.window.PRONOMEN_DATA;
if (!DATA || typeof DATA !== 'object') fail('window.PRONOMEN_DATA missing');

const PLACEHOLDER = /Test sentence|\bopt[12]\b|Test note|\bTODO\b|lorem|\bdummy\b|\bplaceholder\b/i;
const norm = (s) => String(s).normalize('NFC').trim().toLowerCase();

if (DATA) {
  const keys = Object.keys(DATA);
  for (const m of gameModes) if (!keys.includes(m)) fail(`missing mode key used by the game: ${m}`);
  for (const k of keys) if (!gameModes.includes(k)) fail(`mode key unknown to the game: ${k}`);

  const seen = new Map();
  for (const mode of gameModes) {
    const items = DATA[mode];
    if (!Array.isArray(items) || items.length === 0) { fail(`mode ${mode} is empty or not an array`); continue; }
    for (const lvl of gameLevels) {
      if (!items.some(i => i.level === lvl)) fail(`mode ${mode} has no items for level ${lvl}`);
    }
    items.forEach((it, n) => {
      const tag = `${mode}[${n}] ${it && it.id}`;
      if (!it || typeof it !== 'object') return fail(`${tag}: not an object`);
      if (!it.id || typeof it.id !== 'string') fail(`${tag}: missing id`);
      else if (seen.has(it.id)) fail(`${tag}: duplicate id (also in ${seen.get(it.id)})`);
      else seen.set(it.id, mode);
      if (it.mode !== mode) fail(`${tag}: item.mode "${it.mode}" != key "${mode}"`);
      if (!gameLevels.includes(it.level)) fail(`${tag}: level "${it.level}" not in game chips ${gameLevels}`);
      if (typeof it.sentence_da !== 'string' || !/_{2,}/.test(it.sentence_da)) fail(`${tag}: sentence_da missing or has no ___ blank`);
      if (!Array.isArray(it.options) || it.options.length < 2) fail(`${tag}: needs >= 2 options`);
      else {
        if (new Set(it.options.map(norm)).size !== it.options.length) fail(`${tag}: duplicate options`);
        if (!it.options.some(o => norm(o) === norm(it.correct))) fail(`${tag}: correct "${it.correct}" not in options ${JSON.stringify(it.options)}`);
      }
      if (typeof it.note !== 'string' || !it.note.trim()) fail(`${tag}: empty note`);
      const strings = [it.id, it.sentence_da, it.correct, it.note, ...(it.options || []), ...(it.context_da || [])];
      for (const s of strings) if (PLACEHOLDER.test(String(s))) { fail(`${tag}: placeholder text "${s}"`); break; }
    });
  }
}

if (errors.length) {
  console.error(`FAIL pronomen-data-guard (${errors.length} problems) for ${dataFile}`);
  errors.slice(0, 25).forEach(e => console.error('  - ' + e));
  if (errors.length > 25) console.error(`  ... and ${errors.length - 25} more`);
  process.exit(1);
}
const total = gameModes.reduce((a, m) => a + DATA[m].length, 0);
console.log(`PASS pronomen-data-guard: ${gameModes.length} modes, ${total} items, levels ${gameLevels.join('/')}`);
