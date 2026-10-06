// Static guards for the reading sections blog/ and en/ (no browser, no deps). Usage: node tests/blog-static.mjs
// Every page: title 50-60 chars, description 140-155, one <h1>, JSON-LD parses, relative links resolve.
// Every quiz: data-answer points at an existing option, has one .why and one no-JS <details> fallback.
// Each section index links every article folder.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let fails = 0, total = 0;
const check = (ok, msg) => { if (!ok) { console.log(`FAIL  ${msg}`); fails++; } };
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"');

for (const section of ['blog', 'en']) {
const BLOG = path.join(ROOT, section);
const posts = fs.readdirSync(BLOG, { withFileTypes: true })
  .filter(d => d.isDirectory() && fs.existsSync(path.join(BLOG, d.name, 'index.html'))).map(d => d.name);
const pages = ['index.html', ...posts.map(p => `${p}/index.html`)];
total += pages.length;

for (const page of pages) {
  const rel = `${section}/${page}`;
  const file = path.join(BLOG, page);
  const html = fs.readFileSync(file, 'utf8');
  const title = unesc((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = unesc((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  check(title.length >= 50 && title.length <= 60, `${rel}: title ${title.length} chars (50-60)`);
  check(desc.length >= 140 && desc.length <= 155, `${rel}: description ${desc.length} chars (140-155)`);
  check((html.match(/<h1[\s>]/g) || []).length === 1, `${rel}: exactly one <h1>`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { check(false, `${rel}: JSON-LD parse error ${e.message}`); }
  }
  for (const m of html.matchAll(/(?:href|src)="([^"#:]+)"/g)) {
    check(fs.existsSync(path.resolve(path.dirname(file), m[1])), `${rel}: broken link ${m[1]}`);
  }
  for (const q of html.matchAll(/<div class="quiz" data-answer="(\d+)">([\s\S]*?)<\/details>/g)) {
    const opts = (q[2].match(/<div class="opts">([\s\S]*?)<\/div>/) || [, ''])[1];
    const n = (opts.match(/<button[\s>]/g) || []).length;
    check(n >= 2 && Number(q[1]) < n, `${rel}: quiz answer ${q[1]} out of range (${n} options)`);
    check((q[2].match(/class="why"/g) || []).length === 1, `${rel}: quiz needs exactly one .why`);
    check(/<details class="nojs">/.test(q[2]), `${rel}: quiz missing no-JS <details> fallback`);
  }
  const quizzes = (html.match(/<div class="quiz"/g) || []).length;
  if (page !== 'index.html') check(quizzes >= 1, `${rel}: article has no quiz`);
}

const index = fs.readFileSync(path.join(BLOG, 'index.html'), 'utf8');
for (const p of posts) check(index.includes(`href="${p}/index.html"`), `${section} index links ${p}`);
}

console.log(fails ? `\n${fails} failed` : `all passed (${total} pages)`);
process.exit(fails ? 1 : 0);
