// Static SEO guards (no browser, no deps). Usage: node tests/seo-static.mjs
// 1. Homepage: the static fallback cards match the `games` array (same URLs, same order).
// 2. Sitemap: every <loc> is the canonical URL of an existing page.
// 3. Game pages: ship the plain-HTML home link (<nav class="sd-bar" data-sd-static>).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://sjovtdansk.dk/';
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
let fails = 0;
const check = (ok, msg) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); if (!ok) fails++; };

// 1. homepage cards
const home = read('index.html');
const arrayUrls = [...home.match(/const games = \[[\s\S]*?\n\];/)[0].matchAll(/url: "([^"]+)"/g)].map(m => m[1]);
const gridHtml = home.match(/<div class="grid" id="games">([\s\S]*?)\n      <\/div>/)[1];
const staticUrls = [...gridHtml.matchAll(/<a class="sd-card card" href="([^"]+)"/g)].map(m => m[1]);
check(arrayUrls.length > 0 && JSON.stringify(arrayUrls) === JSON.stringify(staticUrls),
  `homepage static cards match games array (${staticUrls.length}/${arrayUrls.length})`);
for (const u of arrayUrls) check(fs.existsSync(path.join(ROOT, decodeURI(u))), `game link exists: ${u}`);

// 2. sitemap <loc> == canonical
const locs = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const loc of locs) {
  const rel = loc.slice(SITE.length) || 'index.html';
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { check(false, `sitemap page exists: ${rel}`); continue; }
  const canon = (fs.readFileSync(file, 'utf8').match(/rel="canonical" href="([^"]+)"/) || [])[1];
  check(canon === loc && !/\s/.test(loc), `sitemap loc = canonical: ${loc}`);
}

// 3. static home link on every game page (every sitemap page except the homepage)
for (const loc of locs.filter(l => l !== SITE)) {
  const rel = loc.slice(SITE.length);
  if (!fs.existsSync(path.join(ROOT, rel))) continue;
  check(/<nav class="sd-bar"[^>]*data-sd-static><a class="sd-bar-home" href="[^"]*index\.html"[^>]*>/.test(read(rel)), `static home link: ${rel}`);
}

// 4. hreflang: every alternate exists, includes the page itself, and is reciprocated with the same set.
const alts = (rel) => Object.fromEntries([...read(rel).matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)" \/>/g)].map(m => [m[1], m[2]]));
for (const loc of locs) {
  const rel = loc.slice(SITE.length) || 'index.html';
  if (!fs.existsSync(path.join(ROOT, rel))) continue;
  const a = alts(rel);
  if (!Object.keys(a).length) continue;
  check(Object.values(a).includes(loc), `hreflang includes self: ${rel}`);
  check('x-default' in a, `hreflang has x-default: ${rel}`);
  for (const [lang, href] of Object.entries(a)) {
    const other = href.slice(SITE.length) || 'index.html';
    if (!fs.existsSync(path.join(ROOT, other))) { check(false, `hreflang ${lang} target exists: ${rel} -> ${href}`); continue; }
    check(JSON.stringify(alts(other)) === JSON.stringify(a) || JSON.stringify(Object.entries(alts(other)).sort()) === JSON.stringify(Object.entries(a).sort()),
      `hreflang reciprocal: ${rel} <-> ${other}`);
  }
}

// 5. icons + share image on every page; "Øv videre" related-game links on every game page.
for (const f of ['favicon.svg', 'favicon-36.png', 'apple-touch-icon.png', 'og-image.png']) {
  check(fs.existsSync(path.join(ROOT, 'shared/icons', f)), `icon file exists: shared/icons/${f}`);
}
for (const loc of locs) {
  const rel = loc.slice(SITE.length) || 'index.html';
  if (!fs.existsSync(path.join(ROOT, rel))) continue;
  const html = read(rel);
  const fav = (html.match(/<link rel="icon" href="([^"]+favicon\.svg)"/) || [])[1];
  check(fav && fs.existsSync(path.resolve(path.dirname(path.join(ROOT, rel)), fav)), `favicon link resolves: ${rel}`);
  check(html.includes(`<meta property="og:image" content="${SITE}shared/icons/og-image.png" />`), `og:image: ${rel}`);
}
for (const u of arrayUrls) {
  const rel = decodeURI(u).replace(/^\.\//, '');
  const html = read(rel);
  const block = (html.match(/<nav class="sd-next"[\s\S]*?<\/nav>/) || [''])[0];
  const links = [...block.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  check(links.length === 2, `"Øv videre" has 2 links: ${rel}`);
  for (const l of links) check(fs.existsSync(path.resolve(path.dirname(path.join(ROOT, rel)), l)), `"Øv videre" link resolves: ${rel} -> ${l}`);
}

console.log(fails ? `\n${fails} failed` : '\nall passed');
process.exit(fails ? 1 : 0);
