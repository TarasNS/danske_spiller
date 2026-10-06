#!/usr/bin/env node
'use strict';

/*
 * run_checks.cjs — deterministic gate for article drafts produced by the
 * writing-danish-learning-articles skill.
 *
 *   node run_checks.cjs <draftDir>     lint one draft directory (da.md + en.md)
 *   node run_checks.cjs --fixtures     run the regression corpus in cases.json
 *   node run_checks.cjs <dir> --json   machine-readable report
 *
 * This checks structure, sourcing and measurable readability. It does NOT judge whether
 * an article is good, whether a source actually supports its claim, or whether the two
 * language versions say the same thing in the same order. Those need a reader.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------- configuration

const REQUIRED_FIELDS = [
  'title', 'meta_description', 'slug', 'lang', 'hreflang_partner',
  'target_keyword', 'secondary_keywords', 'reader_level', 'topic_source',
  'lix', 'status', 'claims',
];

const READER_LEVELS = ['A2', 'B1', 'B2'];
const TOPIC_SOURCES = ['queue', 'fallback-research'];
const CLAIM_KINDS = ['mechanics', 'fee', 'rule', 'date', 'deadline', 'statistic', 'derived', 'other'];

// Claims of these kinds may only cite an authority (tier 1-2). A language school's
// description of exam mechanics is acceptable; its statement of a fee or a rule is not.
const AUTHORITY_ONLY_KINDS = ['fee', 'rule', 'date', 'deadline'];

// How the source was actually consulted. From baseline evidence: a well-researched run still
// ended up citing a page that 404'd on direct fetch and was known only through search-result
// snippets. A claim whose source you could not load is not a sourced claim.
const VERIFIED_MODES = ['fetched', 'search-extract', 'derived'];

// Claims that readers act on must come from a page that was actually retrieved.
const FETCH_REQUIRED_KINDS = ['fee', 'rule', 'date', 'deadline'];

const AUTHORITY_DOMAINS = [
  'retsinformation.dk', 'lovtidende.dk', 'uvm.dk', 'iu.dk', 'ufm.dk',
  'nyidanmark.dk', 'borger.dk', 'stukuvm.dk', 'dst.dk',
  // kommune sites (fees, enrolment, self-payment)
  'kk.dk', 'aarhus.dk', 'odense.dk', 'aalborg.dk', 'esbjerg.dk', 'randers.dk',
  'kolding.dk', 'vejle.dk', 'horsens.dk', 'roskilde.dk', 'gladsaxe.dk', 'gentofte.dk',
];

// LIX ceiling per reader level. PROJECT CONVENTION, NOT A RESEARCH FINDING:
// LIX bands were defined for native readers and no validated LIX<->CEFR mapping exists.
// See danish-register.md. Raising a ceiling to make an article pass is forbidden
// (references/promotion-rule.md, rule 7).
//
// Ceiling only, deliberately: there is no floor. An article that reads more easily than its
// level requires is not a defect, and English LIX runs structurally lower than Danish for the
// same content (shorter words), so a two-sided band would fail clear English prose.
const LIX_CEILING = { A2: 32, B1: 38, B2: 45 };

const HEDGES_DA = ['typisk', 'omkring', 'normalt', 'cirka', 'ca', 'ofte', 'plejer',
  'nogenlunde', 'som regel', 'rundt regnet', 'vel', 'måske', 'næsten'];
const HEDGES_EN = ['typically', 'usually', 'roughly', 'approximately', 'around', 'about',
  'generally', 'normally', 'often', 'tends to', 'tend to', 'some', 'maybe', 'nearly', 'almost'];

// Danish abbreviations whose periods are not sentence ends (protected before splitting).
const ABBREVS = ['f.eks.', 'bl.a.', 'dvs.', 'osv.', 'ca.', 'kl.', 'mv.', 'm.v.', 'pga.',
  'ift.', 'iflg.', 'jf.', 'nr.', 'bl. a.', 'f. eks.', 'e.g.', 'i.e.', 'etc.', 'vs.'];

const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'’][A-Za-zÀ-ÖØ-öø-ÿ]+)*/gu;

// ---------------------------------------------------------------- front matter

function unquote(s) {
  const t = String(s).trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  return t;
}

function parseScalar(v) {
  const t = v.trim();
  if (t.startsWith('[') && t.endsWith(']')) {
    const inner = t.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map((x) => unquote(x));
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  return unquote(t);
}

function parseFrontMatter(src) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/.exec(src);
  if (!m) return { fm: null, body: src };
  const body = src.slice(m[0].length);
  const lines = m[1].split(/\r?\n/);
  const fm = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || /^\s*#/.test(line)) { i++; continue; }
    const top = /^([A-Za-z_][\w]*):[ \t]*(.*)$/.exec(line);
    if (!top) { i++; continue; }
    const key = top[1];
    const val = top[2];
    if (val.trim() === '') {
      const items = [];
      i++;
      while (i < lines.length && /^[ \t]*-[ \t]+/.test(lines[i])) {
        const obj = {};
        const first = lines[i].replace(/^[ \t]*-[ \t]+/, '');
        const kv = /^([A-Za-z_][\w]*):[ \t]*(.*)$/.exec(first);
        if (kv) obj[kv[1]] = parseScalar(kv[2]);
        i++;
        while (i < lines.length
               && /^[ \t]+[A-Za-z_]/.test(lines[i])
               && !/^[ \t]*-[ \t]+/.test(lines[i])) {
          const kv2 = /^[ \t]+([A-Za-z_][\w]*):[ \t]*(.*)$/.exec(lines[i]);
          if (kv2) obj[kv2[1]] = parseScalar(kv2[2]);
          i++;
        }
        items.push(obj);
      }
      fm[key] = items;
      continue;
    }
    fm[key] = parseScalar(val);
    i++;
  }
  return { fm, body };
}

// ---------------------------------------------------------------- text handling

function stripMarkdown(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')          // fenced code
    .replace(/^[ \t]*\|.*\|[ \t]*$/gm, ' ')   // table rows (skew sentence length)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')    // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // links -> text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '') // heading markers
    .replace(/^[ \t]{0,3}>[ \t]?/gm, '')      // blockquotes
    .replace(/^[ \t]*[-*+][ \t]+/gm, '')      // bullets
    .replace(/^[ \t]*\d+\.[ \t]+/gm, '')      // ordered list markers
    .replace(/\*\*|__|\*|_|~~/g, '')
    .replace(/\r/g, '');
}

function splitSentences(text) {
  let t = text;
  ABBREVS.forEach((a, idx) => {
    t = t.split(a).join(`\u0001${idx}\u0001`);
  });
  const parts = t.split(/[.!?:]+(?=\s|$)/);
  return parts
    .map((p) => {
      let s = p;
      ABBREVS.forEach((a, idx) => { s = s.split(`\u0001${idx}\u0001`).join(a); });
      return s.trim();
    })
    .filter((p) => (p.match(WORD_RE) || []).length > 0);
}

function words(text) {
  return text.match(WORD_RE) || [];
}

function lix(plain) {
  const sentences = splitSentences(plain);
  const w = words(plain);
  if (!sentences.length || !w.length) return null;
  const longWords = w.filter((x) => x.length > 6).length;
  return Math.round((w.length / sentences.length) + ((100 * longWords) / w.length));
}

function norm(s) {
  return String(s).toLowerCase().replace(/\s+/g, ' ').trim();
}

function h2s(body) {
  const out = [];
  const re = /^[ \t]{0,3}##[ \t]+(.+?)[ \t]*$/gm;
  let m;
  while ((m = re.exec(body)) !== null) out.push(m[1].trim());
  return out;
}

// ---------------------------------------------------------------- checks

function hedgeViolations(plain, lang) {
  const hedges = lang === 'en' ? HEDGES_EN : HEDGES_DA;
  const out = [];
  splitSentences(plain).forEach((sentence) => {
    if (!/\d/.test(sentence)) return;
    const toks = sentence.split(/\s+/);
    for (let i = 0; i < toks.length; i++) {
      const bare = toks[i].toLowerCase().replace(/[^a-zà-öø-ÿ.]/g, '');
      const two = `${bare} ${(toks[i + 1] || '').toLowerCase().replace(/[^a-zà-öø-ÿ]/g, '')}`.trim();
      const hit = hedges.find((h) => h === bare || h === bare.replace(/\.$/, '') || h === two);
      if (!hit) continue;
      const window = toks.slice(i + 1, i + 4).join(' ');
      if (/\d/.test(window)) {
        out.push({ hedge: hit, sentence: sentence.slice(0, 160) });
        break;
      }
    }
  });
  return out;
}

function hostOf(url) {
  try {
    const h = new URL(String(url)).hostname.toLowerCase();
    return h.replace(/^www\./, '');
  } catch (e) {
    return null;
  }
}

// Exact host match only (after stripping "www."). Deliberately NOT suffix matching:
// language schools are commonly hosted on a kommune's own domain — sprogskolen.kolding.dk is
// a school, not the kommune — so ".endsWith('.kolding.dk')" would admit exactly the tier-3
// sources this check exists to keep out. A new authority host is added here on purpose.
function isAuthority(url) {
  const h = hostOf(url);
  if (!h) return false;
  return AUTHORITY_DOMAINS.includes(h);
}

function checkOne(file, fm, body, fail) {
  const where = path.basename(file);

  REQUIRED_FIELDS.forEach((f) => {
    const v = fm[f];
    const empty = v === undefined || v === '' || v === null
      || (Array.isArray(v) && v.length === 0);
    if (empty) fail(`${where}: front matter missing or empty field "${f}"`);
  });

  if (fm.reader_level && !READER_LEVELS.includes(fm.reader_level)) {
    fail(`${where}: reader_level "${fm.reader_level}" not one of ${READER_LEVELS.join('/')}`);
  }
  if (fm.topic_source && !TOPIC_SOURCES.includes(fm.topic_source)) {
    fail(`${where}: topic_source "${fm.topic_source}" not one of ${TOPIC_SOURCES.join('/')}`);
  }
  if (fm.status !== 'draft') {
    fail(`${where}: status must be "draft" (the skill never publishes); got "${fm.status}"`);
  }

  const md = String(fm.meta_description || '');
  if (md.length > 155) fail(`${where}: meta_description is ${md.length} chars (max 155)`);
  const title = String(fm.title || '');
  if (title.length && (title.length < 25 || title.length > 65)) {
    fail(`${where}: title is ${title.length} chars (want 25-65)`);
  }

  // claims: every one sourced and dated; authority-only kinds may not cite a school or blog
  (Array.isArray(fm.claims) ? fm.claims : []).forEach((c, idx) => {
    const id = c.id || `#${idx + 1}`;
    if (!c.claim) fail(`${where}: claim ${id} has no "claim" text`);
    if (!c.source_url) {
      fail(`${where}: claim ${id} has no source_url — an unsourceable claim is cut, not kept`);
    }
    if (!c.accessed || !/^\d{4}-\d{2}-\d{2}$/.test(String(c.accessed))) {
      fail(`${where}: claim ${id} has no valid "accessed" date (YYYY-MM-DD)`);
    }
    if (!c.kind || !CLAIM_KINDS.includes(c.kind)) {
      fail(`${where}: claim ${id} kind "${c.kind}" not one of ${CLAIM_KINDS.join('/')}`);
    }
    if (c.source_url && !hostOf(c.source_url)) {
      fail(`${where}: claim ${id} source_url is not a URL: ${c.source_url}`);
    }
    if (c.kind && AUTHORITY_ONLY_KINDS.includes(c.kind) && c.source_url
        && !isAuthority(c.source_url)) {
      fail(`${where}: claim ${id} is a "${c.kind}" claim but cites `
        + `${hostOf(c.source_url)}, which is not an authority source `
        + `(use retsinformation.dk / the kommune / the responsible authority)`);
    }
    if (!c.verified || !VERIFIED_MODES.includes(c.verified)) {
      fail(`${where}: claim ${id} has no valid "verified" mode `
        + `(${VERIFIED_MODES.join('/')})`);
    }
    if (c.kind && FETCH_REQUIRED_KINDS.includes(c.kind) && c.verified !== 'fetched') {
      fail(`${where}: claim ${id} is a "${c.kind}" claim verified only by `
        + `"${c.verified}" — load the page itself or cut the claim`);
    }
    if (c.kind === 'derived') {
      if (c.verified !== 'derived') {
        fail(`${where}: claim ${id} has kind "derived" but verified "${c.verified}"`);
      }
      const from = Array.isArray(c.from) ? c.from : String(c.from || '').split(/[,\s]+/).filter(Boolean);
      if (from.length < 1) {
        fail(`${where}: derived claim ${id} must list the claim ids it was computed from `
          + `in "from" — a figure you worked out yourself is not a source`);
      }
      const known = (fm.claims || []).map((x) => x.id);
      from.filter((f) => !known.includes(f)).forEach((f) => {
        fail(`${where}: derived claim ${id} references unknown claim "${f}"`);
      });
    }
  });

  const plain = stripMarkdown(body);

  // hedging next to a number
  hedgeViolations(plain, fm.lang).forEach((v) => {
    fail(`${where}: hedge "${v.hedge}" next to a number — source the figure or cut the `
      + `sentence: "${v.sentence}"`);
  });

  // keyword placement
  const kw = norm(fm.target_keyword || '');
  if (kw) {
    if (!norm(title).includes(kw)) fail(`${where}: target_keyword "${kw}" not in title`);
    if (!norm(md).includes(kw)) fail(`${where}: target_keyword "${kw}" not in meta_description`);
    // Tokenise on whitespace, not with WORD_RE: that regex matches letters only, so any
    // keyword containing a digit ("prøve i dansk 3") could never match, even as the first
    // words of the article. LIX still uses WORD_RE; only this haystack keeps digits.
    const first100 = plain.trim().split(/\s+/).slice(0, 100).join(' ');
    if (!norm(first100).includes(kw)) {
      fail(`${where}: target_keyword "${kw}" not in the first 100 words`);
    }
  }

  // readability — ceiling only, no floor (see LIX_CEILING)
  const measured = lix(plain);
  const ceiling = LIX_CEILING[fm.reader_level];
  if (measured === null) {
    fail(`${where}: no measurable prose`);
  } else {
    if (typeof fm.lix === 'number' && Math.abs(fm.lix - measured) > 2) {
      fail(`${where}: front matter lix ${fm.lix} but measured ${measured} (recount)`);
    }
    if (ceiling && measured > ceiling) {
      fail(`${where}: LIX ${measured} is above the ${fm.reader_level} ceiling ${ceiling} — `
        + `shorten sentences and swap long words, never raise the ceiling`);
    }
  }

  return { lix: measured, h2: h2s(body), claimIds: (fm.claims || []).map((c) => c.id) };
}

function lintDraft(dir) {
  const failures = [];
  const fail = (m) => failures.push(m);
  const info = {};

  ['da', 'en'].forEach((lang) => {
    const file = path.join(dir, `${lang}.md`);
    if (!fs.existsSync(file)) {
      fail(`missing ${lang}.md — every topic ships a Danish and an English version`);
      return;
    }
    const src = fs.readFileSync(file, 'utf8');
    const { fm, body } = parseFrontMatter(src);
    if (!fm) { fail(`${lang}.md: no YAML front matter`); return; }
    if (fm.lang && fm.lang !== lang) {
      fail(`${lang}.md: front matter lang is "${fm.lang}"`);
    }
    info[lang] = checkOne(file, fm, body, fail);
    info[`${lang}_fm`] = fm;
  });

  // da/en equivalence
  if (info.da && info.en) {
    const a = [...info.da.claimIds].sort();
    const b = [...info.en.claimIds].sort();
    const onlyDa = a.filter((x) => !b.includes(x));
    const onlyEn = b.filter((x) => !a.includes(x));
    if (onlyDa.length || onlyEn.length) {
      fail('claim ids differ between versions — a claim in one version and not the other is a '
        + `defect (da only: [${onlyDa}], en only: [${onlyEn}])`);
    }
    if (info.da.h2.length !== info.en.h2.length) {
      fail(`H2 count differs: da has ${info.da.h2.length}, en has ${info.en.h2.length}`);
    }
    const daFm = info.da_fm || {};
    const enFm = info.en_fm || {};
    if (daFm.hreflang_partner !== 'en' || enFm.hreflang_partner !== 'da') {
      fail('hreflang_partner must be "en" in da.md and "da" in en.md');
    }
    if (daFm.slug && enFm.slug && daFm.slug === enFm.slug) {
      fail('da and en must not share a slug');
    }
    if (norm(daFm.target_keyword) === norm(enFm.target_keyword)) {
      fail('da and en target_keyword are identical — the English keyword is chosen for English '
        + 'search, not translated from the Danish one');
    }
  }

  return { failures, info };
}

// ---------------------------------------------------------------- entry point

function reportDraft(dir, asJson) {
  const { failures, info } = lintDraft(dir);
  if (asJson) {
    console.log(JSON.stringify({
      dir, pass: failures.length === 0, failures,
      lix: { da: info.da && info.da.lix, en: info.en && info.en.lix },
    }, null, 2));
  } else {
    console.log(`\n${dir}`);
    if (info.da) console.log(`  da: LIX ${info.da.lix}, ${info.da.h2.length} H2, ${info.da.claimIds.length} claims`);
    if (info.en) console.log(`  en: LIX ${info.en.lix}, ${info.en.h2.length} H2, ${info.en.claimIds.length} claims`);
    if (!failures.length) {
      console.log('  PASS (structure, sourcing and readability only — H2 order across '
        + 'languages and whether each source supports its claim still need a reader)');
    } else {
      console.log(`  FAIL (${failures.length})`);
      failures.forEach((f) => console.log(`    - ${f}`));
    }
  }
  return failures.length === 0;
}

function runFixtures() {
  const casesPath = path.join(__dirname, 'cases.json');
  const cases = JSON.parse(fs.readFileSync(casesPath, 'utf8')).cases;
  let bad = 0;
  cases.forEach((c) => {
    const dir = path.join(__dirname, c.dir);
    const { failures } = lintDraft(dir);
    const got = failures.length === 0 ? 'pass' : 'fail';
    const ok = got === c.expect
      && (c.expect === 'pass' || !c.match
        || failures.some((f) => f.toLowerCase().includes(String(c.match).toLowerCase())));
    if (!ok) {
      bad++;
      console.log(`  ${c.id} EXPECTED ${c.expect}${c.match ? ` matching "${c.match}"` : ''}, GOT ${got}`);
      failures.forEach((f) => console.log(`      ${f}`));
    } else {
      console.log(`  ${c.id} ok (${got}) — ${c.reason}`);
    }
  });
  console.log(`\n${cases.length - bad}/${cases.length} regression cases as expected`);
  return bad === 0;
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--fixtures')) {
    process.exit(runFixtures() ? 0 : 1);
  }
  const dir = args.find((a) => !a.startsWith('--'));
  if (!dir) {
    console.error('usage: run_checks.cjs <draftDir> [--json] | --fixtures');
    process.exit(2);
  }
  process.exit(reportDraft(dir, args.includes('--json')) ? 0 : 1);
}

if (require.main === module) main();
module.exports = { lintDraft, lix, parseFrontMatter, stripMarkdown, splitSentences };
