// Functional spec for tidsmaskinen. The game file is resolved relative to this script (<repo>/tidsmaskinen/index.html),
// so it can be started from any cwd; only --shots uses a cwd-relative default (set SHOT_ROOT otherwise).
// Dump files (tids-content.json, tids-rounds.json, tids-dumps.json) go to OUT, default <os tmpdir>/tids-spectest (never the repo); the path is printed.
//   cd <worktree> && SHOT_ROOT=<main>/docs/redesign/screenshots OUT=<dir> node <main>/tests/tidsmaskinen.mjs [--shots] [--only=a,b,c]
// Sections: boot, rounds, unlock, timed, persist, kbd, layout, theme, root
import { launch, openGame, sleep, hasHorizontalOverflow, smallTapTargets, focusRingProblems, unlabelledButtons, shot } from './lib/harness.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const FILE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'tidsmaskinen', 'index.html');
const SHOTS = process.argv.includes('--shots');
const ONLY = (process.argv.find(a => a.startsWith('--only=')) || '').replace('--only=', '').split(',').filter(Boolean);
const want = s => !ONLY.length || ONLY.includes(s);
const OUT = process.env.OUT || path.join(os.tmpdir(), 'tids-spectest');
fs.mkdirSync(OUT, { recursive: true });
console.log('NOTE dump files are written to ' + OUT);
const MODES = ['present_vs_preterite','preterite_vs_perfect','pluperfect','future','modal','conditional','infinitive','passive','imperative'];
const POOLS = [120,180,100,140,180,140,140,180,80];
const results = [];
const rec = (name, ok, ev) => { results.push({ name, ok, ev }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ev ? '  :: ' + String(ev).slice(0, 600) : '')); };
const note = (name, ev) => console.log('NOTE ' + name + ' :: ' + String(ev).slice(0, 800));
const norm = s => String(s).toLowerCase().replace(/[.!?]+$/, '').replace(/[’‘`´]/g, "'").replace(/\s+/g, ' ').trim();

// instrument audio + tts on every document
const INIT = () => {
  window.__osc = 0; window.__tts = 0;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) {
    const o = AC.prototype.createOscillator; AC.prototype.createOscillator = function () { window.__osc++; return o.apply(this, arguments); };
    const b = AC.prototype.createBufferSource; AC.prototype.createBufferSource = function () { window.__osc++; return b.apply(this, arguments); };
  }
  if (window.speechSynthesis) { const sp = window.speechSynthesis.speak.bind(window.speechSynthesis); window.speechSynthesis.speak = function (u) { window.__tts++; try { return sp(u); } catch (e) {} }; }
};

const browser = await launch();
const dumps = []; // learner-visible records per item

// ---------------- in-page helpers
const lookupFn = () => {
  const host = document.getElementById('item-host');
  const s = host.querySelector('.sentence'); if (!s) return null;
  const text = s.textContent.replace(/\s+/g, ' ').trim();
  const ctxEl = host.querySelector('.evidence'); const ctx = ctxEl ? ctxEl.textContent.trim() : '';
  const nm = x => x.replace(/_{2,}/g, '?').replace(/\s+/g, ' ').trim();
  const res = [];
  for (const arr of Object.values(window.TIDS_DATA)) for (const it of arr) if (nm(it.sentence) === text && (it.context || '').trim() === ctx) res.push(it);
  return res.length ? { item: res[0], n: res.length } : null;
};
const tlFn = () => {
  const r = document.querySelector('#item-host .tl'); if (!r) return null;
  return {
    role: r.getAttribute('role'), aria: r.getAttribute('aria-label'),
    zones: [...r.querySelectorAll('.tl-zone')].map(z => ({ name: z.querySelector('.tl-zname').textContent, lit: z.classList.contains('lit'), cards: [...z.querySelectorAll('.tl-card')].map(c => c.innerText.replace(/\s+/g, ' ').trim()) })),
    caption: r.querySelector('.tl-caption').textContent,
    axisHidden: r.querySelector('.tl-axis') ? getComputedStyle(r.querySelector('.tl-axis')).display === 'none' : null,
    segsOn: [...r.querySelectorAll('.tl-seg.on')].length
  };
};
const optsFn = () => [...document.querySelectorAll('#item-host .opt')].map(b => ({ v: b.getAttribute('data-value'), t: b.querySelector('.otxt').textContent, dis: b.disabled, cls: b.className }));
const L = page => page.evaluate(lookupFn);
const TL = page => page.evaluate(tlFn);
const OPTS = page => page.evaluate(optsFn);
const progress = page => page.$eval('#progress-count', n => n.textContent).catch(() => null);
const sumVisible = page => page.$eval('#summary-screen', n => !n.classList.contains('hidden'));
const SCAN = /undefined|\[object|NaN|&amp;|&lt;|&gt;|&#\d+;|<\/?[a-z][^>]*>|\{\{|null/;

function accOf(item) {
  const acc = (item.accepted_answers || []).slice();
  if (item.correct) acc.unshift(item.correct);
  return acc.map(norm);
}
function displayOf(item) {
  if (item.slots) return item.slots.map(s => s.accepted_answers[0]);
  return [item.correct || item.accepted_answers[0]];
}

async function slipInfo(page) {
  return page.evaluate(() => {
    const s = document.querySelector('#item-host .slip'); if (!s) return null;
    return { text: s.innerText, notes: s.querySelectorAll('.note').length, tts: s.querySelectorAll('.dc-tts-button').length, btns: [...s.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || '') + '|' + b.textContent.trim()), focus: document.activeElement.textContent.trim() };
  });
}

// Play one item. directive: c | w | w2 | bw. Returns record.
async function playItem(page, directive, o = {}) {
  const lk = await L(page);
  if (!lk) { return { err: 'lookup failed', text: await page.$eval('#item-host', n => n.innerText).catch(() => '') }; }
  const item = lk.item;
  const r = { id: item.id, mode: item.mode, level: item.level, verify: !!item.verify, ctx: item.context, sentence: item.sentence, directive, ambiguousLookup: lk.n > 1 };
  r.pre = { text: await page.$eval('#item-host', n => n.innerText), tl: await TL(page), tts: await page.$$eval('#item-host .dc-tts-button', n => n.length), progress: await progress(page) };
  const isSlots = !!item.slots;
  const t0Info = {};
  if (isSlots) {
    const n = item.slots.length; r.nSlots = n; r.slotAria = [];
    let wrongDone = false;
    for (let si = 0; si < n; si++) {
      const opts = await OPTS(page);
      r.slotAria.push(await page.$eval('#item-host .options', x => x.getAttribute('aria-label')));
      const accSlot = item.slots[si].accepted_answers.map(norm);
      const right = opts.findIndex(x => accSlot.includes(norm(x.v)));
      const wrong = opts.findIndex(x => !accSlot.includes(norm(x.v)));
      let wantWrong = false;
      if (directive === 'w' && si === 0) wantWrong = true;
      if (directive === 'w2' && si === n - 1) wantWrong = true;
      (r.slotOpts ||= []).push(opts.map(x => x.t));
      const btns = await page.$$('#item-host .opt');
      t0Info.t0 = Date.now();
      await btns[wantWrong ? wrong : right].click();
      if (wantWrong) { wrongDone = true; r.wrongAtSlot = si; break; }
      if (si < n - 1) await sleep(700);
    }
    r.expect = wrongDone ? 'wrong' : 'right';
  } else {
    const opts = await OPTS(page);
    r.options = opts.map(x => x.t);
    const acc = accOf(item);
    const right = opts.findIndex(x => acc.includes(norm(x.v)));
    const wrong = opts.findIndex(x => !acc.includes(norm(x.v)));
    r.expect = (directive === 'w') ? 'wrong' : 'right';
    const btns = await page.$$('#item-host .opt');
    t0Info.t0 = Date.now();
    await btns[directive === 'w' ? wrong : right].click();
  }
  // after (last) click
  r.post = { tl: await TL(page), text: await page.$eval('#item-host', n => n.innerText), cls: await page.$eval('#item-host > div', n => n.className).catch(() => '') };
  r.osc = await page.evaluate(() => window.__osc);
  // build step?
  const build = await page.$('#item-host .build');
  if (build && r.expect === 'right') {
    r.build = true;
    r.buildText = await page.$eval('#item-host', n => n.innerText);
    const words = item.sentence.replace(/_{2,}/, item.correct).split(/\s+/);
    const labels = await page.$$eval('#item-host .build-bank .tile', ns => ns.map(n => (n.getAttribute('aria-label') || '') + '|' + n.textContent.trim()));
    r.tileLabels = labels.slice(0, 3);
    if (o.onBuild) await o.onBuild(page, r);
    if (o.stopAtBuild) return r;
    if (directive === 'bw') {
      // place tiles in current bank order (shuffled => wrong order)
      let guard = 0;
      while (guard++ < 40) { const t = await page.$('#item-host .build-bank .tile'); if (!t) break; await t.click(); }
      r.expect = 'wrong';
    } else {
      for (const w of words) {
        const tiles = await page.$$('#item-host .build-bank .tile');
        let hit = null;
        for (const t of tiles) { const dw = await t.evaluate(n => n.getAttribute('data-word')); if (dw === w) { hit = t; break; } }
        if (!hit) { r.buildErr = 'tile not found: ' + w; break; }
        await hit.click();
      }
    }
    const chk = await page.$('#item-host .build .btn.accent');
    r.checkEnabled = chk ? await chk.evaluate(n => !n.disabled) : null;
    t0Info.t0 = Date.now();
    if (chk && r.checkEnabled) await chk.click();
    r.postBuild = { text: await page.$eval('#item-host', n => n.innerText) };
    r.post.text = r.postBuild.text;
  }
  if (r.expect === 'right') {
    const prev = r.pre.progress;
    let adv = null;
    for (let k = 0; k < 80; k++) { await sleep(25); const c = await progress(page); if (c !== prev || await sumVisible(page)) { adv = Date.now() - t0Info.t0; break; } }
    r.advMs = adv;
    const slipNow = await slipInfo(page);
    if (slipNow && adv === null) r.unexpectedSlip = slipNow.text;
  } else {
    await sleep(350);
    r.slip = await slipInfo(page);
    r.progressAfterSlip = await progress(page);
    if (o.checkWait) { await sleep(1300); r.stillWaiting = (await progress(page)) === r.progressAfterSlip; }
    r.slipTl = await TL(page);
    if (o.slipShot) await o.slipShot(page, r);
    const useKey = o.keyVidere;
    if (useKey) await page.keyboard.press('Enter'); else await page.click('#item-host .slip .btn.accent');
    await sleep(80);
  }
  r.dispAnswer = displayOf(item);
  r.note = item.note;
  dumps.push(r);
  return r;
}

async function roundSummary(page) {
  await sleep(250);
  return page.evaluate(() => {
    const s = document.getElementById('summary-screen');
    return { visible: !s.classList.contains('hidden'), text: s.innerText, weak: [...s.querySelectorAll('.weak-list li')].map(l => l.textContent), primary: [...s.querySelectorAll('button.primary')].map(b => b.textContent), buttons: [...s.querySelectorAll('button')].map(b => b.textContent.trim()), links: [...s.querySelectorAll('a')].map(a => a.getAttribute('href') + '|' + a.textContent), focus: document.activeElement.tagName + ':' + document.activeElement.textContent.trim().slice(0, 20) };
  });
}

async function selectMode(page, mi) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const bs = await page.$$('#mode-list .mode-btn');
  await bs[mi].click();
}
const srsDump = page => page.evaluate(() => JSON.parse(localStorage.getItem('srs:tidsmaskinen') || 'null'));

async function playRound(page, plan, o = {}) {
  const recs = [];
  for (let i = 0; i < plan.length; i++) {
    const r = await playItem(page, plan[i], { ...o, checkWait: o.checkWait && recs.every(x => x.stillWaiting === undefined) });
    recs.push(r);
    if (r.err) { rec('lookup item ' + i, false, r.err + ' ' + r.text); break; }
  }
  return recs;
}

// ================= sections
let page, issues;
try {
  // ---------- boot / start screen
  if (want('boot')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const st = await page.evaluate(() => ({
      title: document.title, desc: document.querySelector('meta[name=description]')?.content, canon: document.querySelector('link[rel=canonical]')?.href, lang: document.documentElement.lang,
      h1: document.querySelector('#start-screen h1')?.textContent.trim(),
      pools: Object.fromEntries(Object.entries(window.TIDS_DATA).map(([k, v]) => [k, v.length])),
      buttons: [...document.querySelectorAll('#start-screen button')].map(b => b.textContent.trim().replace(/\s+/g, ' ')),
      pCount: document.querySelectorAll('#start-screen p').length, text: document.getElementById('start-screen').innerText,
      modeNames: [...document.querySelectorAll('#mode-list .mode-btn')].map(b => b.textContent.trim().replace(/\s+/g, ' ')),
      pace: [...document.querySelectorAll('#pace-list .chip')].map(b => ({ t: b.textContent, pressed: b.getAttribute('aria-pressed'), dis: b.getAttribute('aria-disabled'), title: b.title, aria: b.getAttribute('aria-label') })),
      levels: [...document.querySelectorAll('#level-list .chip')].map(b => ({ t: b.textContent, pressed: b.getAttribute('aria-pressed'), dis: b.getAttribute('aria-disabled'), title: b.title })),
      live: !!document.querySelector('[aria-live]')
    }));
    console.log(JSON.stringify(st, null, 1));
    rec('head: title + description + canonical (+lang=da)', /Tidsmaskinen/.test(st.title) && st.desc && st.desc.length > 40 && st.canon === 'https://sjovtdansk.dk/tidsmaskinen/index.html' && st.lang === 'da', `${st.title} | ${st.canon}`);
    rec('pools 120/180/100/140/180/140/140/180/80', MODES.every((m, i) => st.pools[m] === POOLS[i]), JSON.stringify(st.pools));
    rec('start: 9 mode buttons + 4 levels + 2 pace + Spil (+no paragraphs)', st.modeNames.length === 9 && st.levels.length === 4 && st.pace.length === 2 && st.buttons.filter(b => b === 'Spil').length === 1 && st.pCount === 0, st.buttons.join(' | '));
    rec('start: Træning default pressed; Med tid locked on fresh profile', st.pace[0].pressed === 'true' && st.pace[1].pressed === 'false' && st.pace[1].dis === 'true', JSON.stringify(st.pace));
    rec('start: default levels A2,B1,B2 selected; C1 disabled for mode 1 (no C1 data)', st.levels.map(l => l.pressed).join() === 'true,true,true,false' && st.levels[3].dis === 'true', JSON.stringify(st.levels));
    // C1 chips per mode
    const c1 = {};
    for (let mi = 0; mi < 9; mi++) { await selectMode(page, mi); c1[MODES[mi]] = await page.$$eval('#level-list .chip', ns => ns.map(n => n.textContent + ':' + n.getAttribute('aria-pressed') + ':' + (n.getAttribute('aria-disabled') || ''))); }
    note('level chips per mode', JSON.stringify(c1));
    rec('C1 chip enabled exactly for modes with C1 data (6,7,8)', MODES.every((m, i) => (c1[m][3].endsWith(':true') === !(i === 5 || i === 6 || i === 7))), JSON.stringify(Object.fromEntries(Object.entries(c1).map(([k, v]) => [k, v[3]]))));
    // click disabled chips: no effect
    await selectMode(page, 0);
    await page.click('#level-list .chip[data-level=C1]'); await page.click('#pace-list .chip[data-pace=timed]');
    const after = await page.evaluate(() => ({ l: [...document.querySelectorAll('#level-list .chip')].map(n => n.getAttribute('aria-pressed')).join(), p: [...document.querySelectorAll('#pace-list .chip')].map(n => n.getAttribute('aria-pressed')).join() }));
    rec('clicking disabled C1 / locked Med tid changes nothing', after.l === 'true,true,true,false' && after.p === 'true,false', JSON.stringify(after));
    if (SHOTS) await shot(page, 'tidsmaskinen', 'mobile', 'start-light');
    rec('boot console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- rounds for every mode (fresh profile)
  if (want('rounds')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const planA = ['c', 'w', 'c', 'c', 'w', 'c', 'c', 'c', 'w', 'c'];
    const per = {};
    for (let mi = 0; mi < 9; mi++) {
      const mode = MODES[mi];
      await selectMode(page, mi);
      await page.click('#btn-play'); await sleep(250);
      const header = await progress(page);
      rec(`${mode}: round starts 1/10`, header === '1/10', header);
      if (SHOTS && [1, 5, 6, 8].includes(mi)) await shot(page, 'tidsmaskinen', 'mobile', `play-${mode}`);
      let plan = planA.slice();
      if (mi === 5) plan = ['c', 'w', 'c', 'w2', 'c', 'c', 'c', 'w2', 'c', 'c'];
      if (mi === 2) plan = ['c', 'w', 'c', 'c', 'w', 'c', 'c', 'c', 'bw', 'c'];
      const recs = await playRound(page, plan, {
        checkWait: true,
        slipShot: async (p, r) => { if (SHOTS && mi === 1 && !per.__s1) { per.__s1 = 1; await shot(p, 'tidsmaskinen', 'mobile', 'wrong-feedback-mode2'); } if (SHOTS && mi === 5 && r.nSlots === 2 && !per.__s6) { per.__s6 = 1; await shot(p, 'tidsmaskinen', 'mobile', 'wrong-feedback-mode6'); } if (SHOTS && mi === 7 && !per.__s8) { per.__s8 = 1; await shot(p, 'tidsmaskinen', 'mobile', 'wrong-feedback-mode8'); } },
        onBuild: async (p, r) => { if (SHOTS && !per.__b) { per.__b = 1; await shot(p, 'tidsmaskinen', 'mobile', 'build-step'); } }
      });
      const sum = await roundSummary(page);
      per[mode] = { recs, sum };
      const nMiss = recs.filter(r => r.expect === 'wrong').length;
      const nRight = recs.filter(r => r.expect === 'right').length;
      rec(`${mode}: round-end screen (score, accuracy, <=3 weak, one primary Spil igen, Gentag fejl, one cross-game chip)`,
        sum.visible && new RegExp(`${nRight}/10`).test(sum.text) && /%/.test(sum.text) && sum.weak.length >= 1 && sum.weak.length <= 3 && sum.primary.length === 1 && sum.primary[0] === 'Spil igen' && sum.buttons.includes('Gentag fejl') && sum.links.length === 1 && /^BUTTON:Spil igen/i.test(sum.focus),
        JSON.stringify({ nRight, nMiss, weak: sum.weak, buttons: sum.buttons, links: sum.links, focus: sum.focus, text: sum.text.replace(/\n+/g, ' / ').slice(0, 140) }));
      if (SHOTS && [1, 5, 8].includes(mi)) await shot(page, 'tidsmaskinen', 'mobile', `roundend-${mode}`);
      // SRS keys
      const store = await srsDump(page);
      const keys = store ? Object.keys(store.items) : [];
      const pkeys = store ? Object.keys(store.patterns) : [];
      const fresh = keys.filter(k => k.startsWith(`tidsmaskinen:${mode}:`));
      rec(`${mode}: SRS keys tidsmaskinen:${mode}:<id> (no indices) + pattern keys`, fresh.length === 10 && fresh.every(k => !/:\d+$/.test(k)) && pkeys.some(k => k.startsWith('pattern:tidsmaskinen:')), `n=${fresh.length} ex=${fresh[0]} pk=${pkeys.filter(k=>true).slice(-2).join(', ')}`);
      // second round: just-missed items must reappear
      const missedIds = recs.filter(r => r.expect === 'wrong').map(r => r.id);
      await page.click('#summary-host .primary'); await sleep(250);
      const ids2 = [];
      const recs2 = [];
      const plan2 = ['c','w','c','c','c','c','c','c','c','c'];
      for (let i = 0; i < 10; i++) { const lk = await L(page); if (!lk) break; ids2.push(lk.item.id); const d = (mi === 2 && i >= 7) ? 'c' : (i === 1 ? 'w' : 'c'); const r = await playItem(page, d, mi === 5 ? {} : {}); recs2.push(r); }
      const back = missedIds.filter(id => ids2.includes(id));
      rec(`${mode}: just-missed items reappear next round`, back.length === missedIds.length, `missed=${missedIds.length} back=${back.length}`);
      per[mode].recs2 = recs2;
      await sleep(200);
      // go to start for next mode
      const sum2 = await roundSummary(page);
      if (sum2.visible) { const homeBtn = await page.$$('#summary-host .sum-actions .btn'); for (const b of homeBtn) { const t = await b.evaluate(n => n.textContent); if (t === 'Til start') { await b.click(); break; } } }
      await sleep(150);
    }
    // aggregate per-mode checks
    const all = Object.entries(per).filter(([k]) => !k.startsWith('__')).flatMap(([mode, v]) => [...v.recs, ...v.recs2].map(r => ({ ...r, __m: mode })));
    const rights = all.filter(r => r.expect === 'right' && !r.err);
    const advs = rights.map(r => r.advMs).filter(x => x != null);
    rec('correct: auto-advance 700-1000 ms (all modes)', advs.length === rights.length && advs.every(t => t >= 700 && t <= 1100), `n=${advs.length}/${rights.length} min=${Math.min(...advs)} max=${Math.max(...advs)}`);
    const congrats = rights.filter(r => /(flot|godt klaret|super|bravo|tillykke|well done|great|korrekt|rigtigt svar|duelig|fantastisk|sejt|godt gået|dygtig)/i.test(r.post.text));
    rec('correct: no congratulatory text', congrats.length === 0, congrats.slice(0, 2).map(r => r.post.text).join(' || '));
    const pressed = rights.filter(r => /press/.test(r.post.cls)).length;
    note('correct animation class (press) present', `${pressed}/${rights.length}`);
    rec('correct: positive animation class + sound (oscillators)', pressed >= rights.length * 0.95 && all.every(r => r.osc > 0), `press=${pressed}/${rights.length}`);
    const wrongs = all.filter(r => r.expect === 'wrong' && r.slip);
    const badSlip = wrongs.filter(r => r.slip.notes !== 1 || !/Rigtigt svar:/.test(r.slip.text) || r.slip.tts !== 1 || !r.slip.btns.some(b => /Videre/.test(b)) || !r.slip.btns.some(b => /Lyt/.test(b)) || !r.slip.text.includes(r.note) || !r.dispAnswer.every(d => r.slip.text.includes(d)) || r.slip.focus !== 'Videre');
    rec('wrong: correct answer + exactly one note + replay + Videre (focused)', wrongs.length > 0 && badSlip.length === 0, `n=${wrongs.length} bad=${badSlip.length} ${badSlip.slice(0, 2).map(r => r.id + ':' + JSON.stringify(r.slip)).join(' || ')}`);
    const waited = wrongs.filter(r => r.stillWaiting !== undefined);
    rec('wrong: waits for input (no auto-advance after 1.6 s)', waited.length > 0 && waited.every(r => r.stillWaiting), `checked=${waited.length}`);
    const noTL = all.filter(r => !r.pre || !r.pre.tl || r.pre.tl.role !== 'img' || !r.pre.tl.aria || r.pre.tl.aria.length < 15);
    rec('timeline/zone strip with text alternative on every prompt', noTL.length === 0, `n=${all.length} bad=${noTL.length} ${noTL.slice(0, 2).map(r => r.id).join(',')}`);
    const noCap = all.filter(r => !r.post.tl || !r.post.tl.caption || !(r.post.tl.zones.some(z => z.lit) ? /^Aktivt: /.test(r.post.tl.caption) : /^(Konstruktion: |Nutid bruges om fortiden)/.test(r.post.tl.caption)));
    rec('after answer: caption present; lit zone => "Aktivt: ..." caption, neutral (no zone) => "Konstruktion: <svar>" caption (never colour-only)', noCap.length === 0, `bad=${noCap.length} ${noCap.slice(0, 3).map(r => r.id).join(',')}`);
    const noTTS = all.filter(r => r.pre.tts !== 1);
    rec('every prompt has TTS replay button', noTTS.length === 0, `bad=${noTTS.length}`);
    const scanBad = [];
    for (const r of all) { for (const t of [r.pre.text, r.post.text, r.slip && r.slip.text, r.buildText]) if (t && SCAN.test(t.replace(/\bnull\b/g, ''))) scanBad.push(r.id + ': ' + (t.match(SCAN) || [])[0]); }
    rec('no undefined/[object Object]/raw HTML/NaN in prompts or feedback', scanBad.length === 0, `items=${all.length} bad=${scanBad.slice(0, 4).join(' | ')}`);
    const amb = all.filter(r => r.ambiguousLookup);
    note('lookup ambiguity (same sentence+context appears twice)', amb.length);
    // (mode 3 build and mode 6 multi-slot are covered by the dedicated 'build' and 'cond' sections)
    fs.writeFileSync(path.join(OUT, 'tids-rounds.json'), JSON.stringify(per, null, 1));
    rec('rounds: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- mode 3 build step: right and wrong paths (loops until both seen 3x)
  if (want('build')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(page, 2);
    const seenB = [];
    for (let rd = 0; rd < 8; rd++) {
      await page.click('#btn-play'); await sleep(250);
      for (let i = 0; i < 10; i++) {
        const dirB = i < 7 ? 'c' : ((rd + i) % 2 === 0 ? 'bw' : 'c');
        const r = await playItem(page, dirB, { checkWait: i >= 7 });
        seenB.push({ ...r, idx: i });
        if (r.err) break;
      }
      await sleep(250);
      await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); });
      await sleep(150); await selectMode(page, 2);
      const r1 = seenB.filter(r => r.build && r.directive === 'c').length, w1 = seenB.filter(r => r.build && r.directive === 'bw').length;
      if (r1 >= 3 && w1 >= 3) break;
    }
    const bR = seenB.filter(r => r.build && r.directive === 'c'), bW = seenB.filter(r => r.build && r.directive === 'bw');
    const lateNoBuild = seenB.filter(r => r.idx >= 7 && !r.build && !r.err);
    note('mode3: late items without build (long sentence)', lateNoBuild.map(r => r.id + ' words=' + r.sentence.split(/\s+/).length).join('; '));
    rec('mode 3: build step appears for late items; right build auto-advances ~800ms', bR.length >= 2 && bR.every(r => r.advMs >= 700 && r.advMs <= 1100 && !r.buildErr && r.checkEnabled), `right=${bR.length} adv=${bR.map(r => r.advMs)}`);
    rec('mode 3: wrong build shows correct answer + one note + Videre, waits', bW.length >= 2 && bW.every(r => r.slip && r.slip.notes === 1 && /Rigtigt svar: \S/.test(r.slip.text) && r.slip.btns.some(b => /Videre/.test(b))), `wrong=${bW.length} ${bW[0] && JSON.stringify(bW[0].slip)}`);
    const earlyB = seenB.filter(r => r.idx < 7 && r.build);
    rec('mode 3: no build step in the first 7 items', earlyB.length === 0, `n=${earlyB.length}`);
    const congr = bR.filter(r => /\b(flot|godt klaret|super|bravo|tillykke|well done|great|korrekt|rigtigt svar|duelig|fantastisk|sejt|godt gået|dygtig)\b/i.test(r.post.text));
    rec('mode 3: no congratulatory text after right build', congr.length === 0, `n=${congr.length}`);
    note('build screen text', bR[0] && bR[0].buildText);
    const store = await srsDump(page);
    rec('mode 3: build items recorded in SRS under tidsmaskinen:pluperfect:<id>', bR.concat(bW).every(r => store.items['tidsmaskinen:pluperfect:' + r.id]), `n=${bR.length + bW.length}`);
    rec('build: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- mode 6 multi-slot paths
  if (want('cond')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(page, 5);
    const seenC = [];
    const cnt = () => ({ multiR: seenC.filter(r => r.nSlots === 2 && r.expect === 'right').length, w1: seenC.filter(r => r.nSlots === 2 && r.directive === 'w').length, w2: seenC.filter(r => r.nSlots === 2 && r.directive === 'w2' && r.wrongAtSlot === 1).length });
    for (let rd = 0; rd < 14; rd++) {
      await page.click('#btn-play'); await sleep(250);
      for (let i = 0; i < 10; i++) {
        const lk = await L(page); if (!lk) break;
        let d = 'c';
        if (lk.item.slots.length === 2) { const c = cnt(); d = c.w1 < 3 ? 'w' : (c.w2 < 3 ? 'w2' : 'c'); } else d = i % 4 === 1 ? 'w' : 'c';
        seenC.push(await playItem(page, d, { checkWait: false }));
      }
      await sleep(250);
      await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); });
      await sleep(150); await selectMode(page, 5);
      const c = cnt(); if (c.w1 >= 3 && c.w2 >= 3 && c.multiR >= 3) break;
    }
    const c = cnt();
    const multi = seenC.filter(r => r.nSlots === 2);
    note('mode6 counts', JSON.stringify(c) + ' single=' + seenC.filter(r => r.nSlots === 1).length);
    rec('mode 6: per-slot aria-label ("felt n af N") on multi-slot items; single-slot plain label', multi.length > 0 && multi.every(r => /felt 1 af 2/.test(r.slotAria[0]) && (r.slotAria[1] === undefined || /felt 2 af 2/.test(r.slotAria[1]))) && seenC.filter(r => r.nSlots === 1).every(r => r.slotAria[0] === 'Svarmuligheder'), `multi=${multi.length}`);
    const w1 = multi.filter(r => r.directive === 'w'), w2 = multi.filter(r => r.directive === 'w2' && r.wrongAtSlot === 1), ok2 = multi.filter(r => r.expect === 'right');
    rec('mode 6: wrong FIRST slot ends the item (slip with both answers, one note, 2nd slot never shown)', w1.length >= 2 && w1.every(r => r.slip && r.slip.notes === 1 && r.dispAnswer.every(a => r.slip.text.includes(a)) && r.slotAria.length === 1), `n=${w1.length} ${w1[0] && JSON.stringify(w1[0].slip.text)}`);
    rec('mode 6: wrong SECOND slot -> slip with both answers + one note', w2.length >= 2 && w2.every(r => r.slip && r.slip.notes === 1 && r.dispAnswer.every(a => r.slip.text.includes(a))), `n=${w2.length}`);
    rec('mode 6: both slots right -> auto-advance ~800ms from last click', ok2.length >= 2 && ok2.every(r => r.advMs >= 700 && r.advMs <= 1100), `n=${ok2.length} adv=${ok2.map(r => r.advMs)}`);
    const store = await srsDump(page);
    rec('mode 6: one SRS entry per item (not per slot), key tidsmaskinen:conditional:<id>', Object.keys(store.items).every(k => /^tidsmaskinen:conditional:[a-z0-9-]+$/.test(k)), `keys=${Object.keys(store.items).length}`);
    rec('cond: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- accepted-answer equivalents, first-round hint, aria-live
  if (want('extras')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(page, 0);
    await page.click('#btn-play'); await sleep(250);
    const hint = await page.$eval('#item-host .hint', n => n.textContent).catch(() => null);
    rec('first-round hint: Danish, <=8 words, visible on first prompt', hint && hint.trim().split(/\s+/).length <= 8, hint);
    const hr = await playItem(page, 'c');
    const live = await page.evaluate(() => { const l = document.querySelector('[aria-live]'); return l ? l.textContent : null; });
    note('aria-live content right after correct', live);
    const hint2 = await page.$eval('#item-host .hint', n => n.textContent).catch(() => null);
    rec('hint hidden after the first correct answer (rest of round + next round)', hint2 === null, String(hint2));
    for (let i = 1; i < 10; i++) await playItem(page, 'c');
    await sleep(300); await page.click('#summary-host .primary'); await sleep(250);
    const hint3 = await page.$eval('#item-host .hint', n => n.textContent).catch(() => null);
    rec('hint stays hidden in the next round', hint3 === null, String(hint3));
    await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')]; });
    await page.keyboard.press('Escape'); await sleep(200);
    // wrong feedback lists equivalents ("også:")
    // mutate data so every accepted equivalent is selectable, then play and click equivalents
    await page.evaluate(() => {
      for (const arr of Object.values(window.TIDS_DATA)) for (const it of arr) {
        if (it.slots) continue;
        const acc = it.accepted_answers || []; const disp = it.correct || acc[0];
        const ex = acc.filter(a => a.toLowerCase() !== disp.toLowerCase());
        if (!ex.length) continue;
        if (it.options) ex.forEach(e => { if (!it.options.includes(e)) it.options.push(e); });
        else it.distractors = (it.distractors || []).concat(ex.filter(e => !(it.distractors || []).includes(e)));
      }
    });
    let clicked = 0, accepted = 0; const detail = []; const byMode = {};
    for (const mi of [2, 3, 4, 7, 8]) {
      for (let rd = 0; rd < 3 && (byMode[MODES[mi]] || 0) < 8; rd++) {
        await selectMode(page, mi);
        await page.click('#btn-play'); await sleep(250);
        for (let i = 0; i < 10; i++) {
          const lk = await L(page); if (!lk) break;
          const it = lk.item; const acc = it.accepted_answers || []; const disp = it.correct || acc[0];
          const ex = acc.filter(a => norm(a) !== norm(disp));
          if (ex.length && !(mi === 2 && i >= 7)) {
            const prev = await progress(page);
            const opts = await OPTS(page);
            const k = opts.findIndex(o => norm(o.v) === norm(ex[0]));
            if (k < 0) { detail.push('not offered: ' + it.id); await playItem(page, 'c'); continue; }
            const btns = await page.$$('#item-host .opt'); const t0 = Date.now(); await btns[k].click();
            let adv = null; for (let q = 0; q < 60; q++) { await sleep(25); if ((await progress(page)) !== prev || await sumVisible(page)) { adv = Date.now() - t0; break; } }
            const slip = await slipInfo(page);
            clicked++; byMode[MODES[mi]] = (byMode[MODES[mi]] || 0) + 1;
            if (adv && !slip) accepted++; else detail.push(`${it.id}: clicked "${ex[0]}" adv=${adv} slip=${slip && slip.text}`);
            if (slip) await page.click('#item-host .slip .btn.accent');
          } else { try { await playItem(page, 'c'); } catch (e) { console.log('playItem crash ' + it.id + ' ' + JSON.stringify(await OPTS(page)) + ' acc=' + JSON.stringify(acc) + ' mode=' + MODES[mi] + ' i=' + i); throw e; } }
        }
        await sleep(300);
        await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); });
        await sleep(150);
      }
    }
    note('equivalents clicked per mode', JSON.stringify(byMode));
    console.log(detail.join(' | '));
    rec('accepted equivalents graded correct (>=20 items, modes 3,4,5,8,9; data patched so equivalents are selectable)', clicked >= 20 && accepted === clicked, `clicked=${clicked} accepted=${accepted} ${detail.slice(0, 3).join(' | ')}`);
    rec('extras: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- extra rounds (modes 4,5,6,8 x2 more rounds) for content-in-UI review
  if (want('content')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const seen = [];
    for (const mi of [3, 4, 5, 7, 0, 1, 2, 6, 8]) {
      await selectMode(page, mi);
      const rounds = [3, 4, 5, 7].includes(mi) ? 3 : 1;
      for (let rd = 0; rd < rounds; rd++) {
        await page.click('#btn-play'); await sleep(200);
        // alternate right/wrong to also capture notes; mode 3 build handled
        const plan = rd === 0 ? ['w','w','w','w','w','w','w','w','w','w'] : ['w','c','w','c','w','c','w','c','w','c'];
        const recs = [];
        for (let i = 0; i < 10; i++) { const d = (mi === 2 && i >= 7 && plan[i] === 'c') ? 'c' : plan[i]; const r = await playItem(page, d); recs.push(r); }
        seen.push(...recs);
        const sum = await roundSummary(page);
        const homeBtn = await page.$$('#summary-host .sum-actions .btn'); for (const b of homeBtn) { if ((await b.evaluate(n => n.textContent)) === 'Til start') { await b.click(); break; } }
        await sleep(150);
        await selectMode(page, mi);
      }
    }
    fs.writeFileSync(path.join(OUT, 'tids-content.json'), JSON.stringify(seen.map(r => ({ id: r.id, mode: r.mode, level: r.level, verify: r.verify, ctx: r.ctx, sentence: r.sentence, options: r.options, slotOpts: r.slotOpts, ans: r.dispAnswer, expect: r.expect, caption: r.post && r.post.tl && r.post.tl.caption, lit: r.post && r.post.tl && r.post.tl.zones.filter(z => z.lit).map(z => z.name), zones: r.post && r.post.tl && r.post.tl.zones.map(z => z.name + (z.cards.length ? '[' + z.cards.join('; ') + ']' : '')).join(' | '), aria: r.pre && r.pre.tl && r.pre.tl.aria, note: r.note })), null, 1));
    const bad = seen.filter(r => r.err);
    const scanBad = [];
    for (const r of seen) for (const t of [r.pre && r.pre.text, r.post && r.post.text, r.slip && r.slip.text]) if (t && SCAN.test(t)) scanBad.push(r.id);
    rec('content rounds: items rendered, no escape artefacts', bad.length === 0 && scanBad.length === 0, `items=${seen.length} errs=${bad.length} scan=${scanBad.join(',')}`);
    rec('content rounds: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- Med tid unlock + timed expiry
  if (want('unlock') || want('timed')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(page, 0);
    await page.click('#btn-play'); await sleep(200);
    // 9 correct + 1 wrong
    for (let i = 0; i < 10; i++) await playItem(page, i === 4 ? 'w' : 'c');
    await sleep(300);
    await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start').click(); });
    await sleep(200);
    const tc9 = await page.evaluate(() => ({ total: JSON.parse(localStorage.getItem('tidsmaskinen:totalCorrect')), pace: [...document.querySelectorAll('#pace-list .chip')].map(n => n.getAttribute('aria-disabled') + ':' + n.getAttribute('aria-pressed')).join() }));
    rec('Med tid still locked after 9 correct', tc9.total === 9 && /^(null|):true,true:false$/.test('x') === false && tc9.pace.split(',')[1].startsWith('true'), JSON.stringify(tc9));
    await page.click('#btn-play'); await sleep(200);
    await playItem(page, 'c'); // 10th correct
    await page.keyboard.press('Escape'); await sleep(200);
    const tc10 = await page.evaluate(() => ({ total: JSON.parse(localStorage.getItem('tidsmaskinen:totalCorrect')), startVisible: !document.getElementById('start-screen').classList.contains('hidden'), pace: [...document.querySelectorAll('#pace-list .chip')].map(n => (n.getAttribute('aria-disabled') || 'no') + ':' + n.getAttribute('aria-pressed')).join() }));
    rec('Med tid unlocks after the 10th correct answer (Escape returns to start)', tc10.total === 10 && tc10.startVisible && tc10.pace === 'no:true,no:false', JSON.stringify(tc10));
    // hint text first round only?
    const keys = await page.evaluate(() => Object.keys(localStorage));
    note('localStorage keys', keys.join(', '));
    // ---- timed: real timer
    await page.click('#pace-list .chip[data-pace=timed]');
    const pace = await page.$$eval('#pace-list .chip', ns => ns.map(n => n.getAttribute('aria-pressed')).join());
    rec('Med tid selectable once unlocked', pace === 'false,true', pace);
    await selectMode(page, 0);
    const srsBefore = await srsDump(page);
    await page.click('#btn-play'); await sleep(300);
    const tmr = await page.$eval('#timer', n => ({ hidden: n.classList.contains('hidden'), text: n.textContent, aria: n.getAttribute('aria-hidden'), size: getComputedStyle(n).fontSize }));
    rec('timed: timer visible, shows seconds', !tmr.hidden && /⏱ \d+ s/.test(tmr.text), JSON.stringify(tmr));
    if (SHOTS) await shot(page, 'tidsmaskinen', 'mobile', 'play-timed');
    const lk = (await L(page)).item;
    const key = `tidsmaskinen:present_vs_preterite:${lk.id}`;
    const t0 = Date.now();
    let slip = null;
    for (let k = 0; k < 300; k++) { await sleep(100); slip = await slipInfo(page); if (slip) break; }
    const el = Date.now() - t0;
    rec('timed: real expiry after ~20 s shows "Tiden er gået" + answer + one note, waits', slip && /Tiden er gået/.test(slip.text) && /Rigtigt svar: \S/.test(slip.text) && slip.notes === 1 && el >= 19000 && el <= 22500, JSON.stringify({ el, slip }));
    const srsAfter = await srsDump(page);
    rec('timed expiry: no SRS write (item key + pattern + counts unchanged)', JSON.stringify(srsBefore) === JSON.stringify(srsAfter) && JSON.stringify(srsBefore?.items?.[key] ?? null) === JSON.stringify(srsAfter?.items?.[key] ?? null), `key before=${JSON.stringify(srsBefore?.items?.[key] ?? null)} after=${JSON.stringify(srsAfter?.items?.[key] ?? null)}`);
    const optsDis = await page.$$eval('#item-host .opt', ns => ns.every(n => n.disabled));
    const revealed = await page.$$eval('#item-host .opt.reveal-correct', ns => ns.length);
    rec('timed expiry: options locked and correct option revealed', optsDis && revealed === 1, `dis=${optsDis} reveal=${revealed}`);
    if (SHOTS) await shot(page, 'tidsmaskinen', 'mobile', 'timed-expiry');
    await sleep(1200);
    const still = await progress(page);
    rec('timed expiry: waits for Videre (no auto advance)', still === '1/10', still);
    await page.click('#item-host .slip .btn.accent'); await sleep(100);
    // finish round with offset-trick expiry & correct answers mixed. Then Gentag fejl contains expired item
    const info = [];
    for (let i = 1; i < 10; i++) {
      if (i === 2) { // another expiry via clock offset
        await page.evaluate(() => { const o = Date.now.bind(Date); const off = 25000; Date.now = () => o() + off; });
        for (let k = 0; k < 30; k++) { await sleep(100); if (await slipInfo(page)) break; }
        await page.evaluate(() => { /* restore */ });
        info.push(await slipInfo(page));
        await page.click('#item-host .slip .btn.accent'); await sleep(100);
        await page.evaluate(() => location.hash = ''); // noop
        continue;
      }
      await playItem(page, 'c');
    }
    note('offset-expiry slip', JSON.stringify(info[0]));
    await sleep(300);
    const sum = await roundSummary(page);
    rec('timed round: summary shows "Ikke nået" stat for expired items + Gentag fejl', /ikke nået/i.test(sum.text) && sum.buttons.includes('Gentag fejl'), sum.text.replace(/\n+/g, ' / '));
    // Gentag fejl contains the expired items
    await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Gentag fejl').click(); });
    await sleep(200);
    const rl = await L(page);
    const prog = await progress(page);
    rec('Gentag fejl after timeout starts a round with the expired items', rl && /^1\/2$/.test(prog), `progress=${prog} first=${rl && rl.item.id} expired=${key}`);
    await page.keyboard.press('Escape'); await sleep(200);
    // ---- conditional 2-slot expiry (clock offset) + mode 3 build expiry
    await selectMode(page, 5);
    let done2 = false, tries = 0, info6 = null;
    while (!done2 && tries < 6) {
      tries++;
      await page.click('#btn-play'); await sleep(250);
      for (let i = 0; i < 10; i++) {
        const lk6 = await L(page); if (!lk6) break;
        if (lk6.item.slots.length === 2) {
          const key6 = `tidsmaskinen:conditional:${lk6.item.id}`;
          const before = await srsDump(page);
          // answer first slot right, then expire
          const opts = await OPTS(page); const acc = lk6.item.slots[0].accepted_answers.map(norm);
          const btns = await page.$$('#item-host .opt'); await btns[opts.findIndex(x => acc.includes(norm(x.v)))].click();
          await sleep(650);
          const slot2aria = await page.$eval('#item-host .options', x => x.getAttribute('aria-label'));
          await page.evaluate(() => { const o = Date.now.bind(Date); Date.now = () => o() + 60000; });
          let s6 = null; for (let k = 0; k < 30; k++) { await sleep(100); s6 = await slipInfo(page); if (s6) break; }
          const after = await srsDump(page);
          const blanks = await page.$$eval('#item-host .blank', ns => ns.map(n => n.textContent + ':' + n.className));
          info6 = { id: lk6.item.id, slot2aria, s6, srsSame: JSON.stringify(before) === JSON.stringify(after), keyPresent: !!after.items[key6], blanks, answers: displayOf(lk6.item) };
          done2 = true; break;
        }
        await playItem(page, 'c');
      }
      if (!done2) { await sleep(300); await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); }); }
    }
    note('2-slot expiry', JSON.stringify(info6));
    rec('timed 2-slot conditional expiry: Tiden er gået + both answers + one note + no SRS write', info6 && /Tiden er gået/.test(info6.s6.text) && info6.answers.every(a => info6.s6.text.includes(a)) && info6.s6.notes === 1 && info6.srsSame && !info6.keyPresent && /felt 2 af 2/.test(info6.slot2aria), JSON.stringify(info6).slice(0, 500));
    // Date.now offset persists in this page; reload for the build expiry test
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(page, 2);
    let didB = false, tr = 0, infoB = null;
    while (!didB && tr < 6) {
      tr++;
      await page.click('#btn-play'); await sleep(250);
      for (let i = 0; i < 10; i++) {
        const lkb = await L(page); if (!lkb) break;
        if (i >= 7) {
          const opts = await OPTS(page); const acc = accOf(lkb.item);
          const btns = await page.$$('#item-host .opt'); await btns[opts.findIndex(x => acc.includes(norm(x.v)))].click(); await sleep(150);
          if (await page.$('#item-host .build')) {
            const before = await srsDump(page);
            const tm = await page.$eval('#timer', n => ({ text: n.textContent, hidden: n.classList.contains('hidden') }));
            await page.evaluate(() => { const o = Date.now.bind(Date); Date.now = () => o() + 60000; });
            let sb = null; for (let k = 0; k < 30; k++) { await sleep(100); sb = await slipInfo(page); if (sb) break; }
            const after = await srsDump(page);
            infoB = { id: lkb.item.id, tm, sb, same: JSON.stringify(before) === JSON.stringify(after) };
            didB = true; break;
          }
          // no build (long sentence): answered already; wait advance
          await sleep(900); continue;
        }
        await playItem(page, 'c');
      }
      if (!didB) { await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); }); await sleep(200); }
    }
    note('build expiry', JSON.stringify(infoB));
    rec('timed mode-3 build step: timer shown, expiry -> Tiden er gået + answer + note, no SRS write', infoB && /Tiden er gået/.test(infoB.sb.text) && infoB.sb.notes === 1 && infoB.same && /\d+ s/.test(infoB.tm.text), JSON.stringify(infoB).slice(0, 400));
    rec('timed: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- persistence
  if (want('persist')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(page, 4);
    await page.click('#level-list .chip[data-level=B1]'); // deselect B1 -> A2,B2
    await page.click('#btn-play'); await sleep(250);
    const rr = await playRound(page, ['c', 'w', 'c', 'c', 'w', 'c', 'c', 'c', 'w', 'c']);
    const lv = rr.map(r => r.level);
    rec('level chip filter: only selected levels (A2,B2) appear', lv.every(l => l === 'A2' || l === 'B2') && lv.includes('A2'), [...new Set(lv)].join());
    const s1 = JSON.stringify(await srsDump(page));
    const prefs1 = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k)])));
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const s2 = JSON.stringify(await srsDump(page));
    rec('SRS state survives reload (items + patterns identical)', s1 === s2 && s1.length > 100, `bytes=${s1.length}`);
    const ps = await page.evaluate(() => ({ modePressed: [...document.querySelectorAll('#mode-list .mode-btn')].map(n => n.getAttribute('aria-pressed')).join(), lv: [...document.querySelectorAll('#level-list .chip')].map(n => n.getAttribute('aria-pressed')).join() }));
    rec('mode + level selection persist across reload', ps.modePressed.split(',')[4] === 'true' && ps.lv === 'true,false,true,false', JSON.stringify(ps));
    const st = JSON.parse(s2);
    const patKeys = Object.keys(st.patterns);
    note('modal pattern keys', patKeys.join(' ; '));
    rec('pattern keys follow pattern:tidsmaskinen:<type>:<a>:<b>', patKeys.length > 0 && patKeys.every(k => /^pattern:tidsmaskinen:[a-z-]+:[^:]+:[^:]+$/.test(k)), patKeys.slice(0, 3).join(' ; '));
    // mute persists + silent
    note('sound state before mute click', await page.evaluate(() => document.getElementById('sd-sound-btn').textContent + ' dc=' + localStorage.getItem('dc:sound-enabled')));
    await page.evaluate(() => window.scrollTo(0, 0)); await page.click('#sd-sound-btn'); await sleep(100);
    const snd = await page.$eval('#sd-sound-btn', n => n.textContent + '|' + n.getAttribute('aria-pressed'));
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const snd2 = await page.$eval('#sd-sound-btn', n => n.textContent);
    await page.click('#btn-play'); await sleep(250);
    const o0 = await page.evaluate(() => window.__osc);
    await playItem(page, 'c'); await playItem(page, 'w');
    const o1 = await page.evaluate(() => window.__osc);
    rec('mute: label changes, persists across reload, no audio nodes created', /✗/.test(snd) && /✗/.test(snd2) && o1 === o0, `${snd} reload=${snd2} osc ${o0}->${o1}`);
    await page.keyboard.press('Escape'); await sleep(150);
    await page.evaluate(() => window.scrollTo(0, 0)); await page.click('#sd-sound-btn'); await page.click('#btn-play'); await sleep(250);
    const o2 = await page.evaluate(() => window.__osc); await playItem(page, 'c'); const o3 = await page.evaluate(() => window.__osc);
    rec('unmuted: audio nodes created (sanity)', o3 > o2, `${o2}->${o3}`);
    // TTS replay click calls speechSynthesis
    const tts0 = await page.evaluate(() => window.__tts); await page.click('#item-host .dc-tts-button'); await sleep(100);
    const tts1 = await page.evaluate(() => window.__tts);
    rec('TTS replay button calls speechSynthesis.speak', tts1 > tts0, `${tts0}->${tts1}`);
    rec('persist: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
    // localStorage throwing
    const t = await openGame(browser, FILE, { viewport: 'mobile', init: () => { Storage.prototype.getItem = function () { throw new Error('blocked'); }; Storage.prototype.setItem = function () { throw new Error('blocked'); }; Storage.prototype.removeItem = function () { throw new Error('blocked'); }; } });
    await selectMode(t.page, 2);
    await t.page.click('#btn-play'); await sleep(250);
    const rr2 = await playRound(t.page, ['c', 'w', 'c', 'c', 'w', 'c', 'c', 'c', 'bw', 'c']);
    const sm = await roundSummary(t.page);
    rec('localStorage throwing: full mode-3 round (incl. build) reaches round end, console clean', sm.visible && t.issues.length === 0, `${sm.text.replace(/\n+/g, ' / ').slice(0, 80)} issues=${t.issues.join(' || ')}`);
    await t.page.close();
  }

  // ---------- keyboard
  if (want('kbd')) {
    ({ page, issues } = await openGame(browser, FILE, { viewport: 'desktop', init: INIT }));
    await page.evaluate(() => localStorage.clear()); await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const order = [];
    for (let i = 0; i < 22; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => { const e = document.activeElement; return e.id || (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 18) || e.tagName; })); }
    console.log('tab order:', order.join(' > '));
    rec('start: Tab reaches header, all 9 modes, 4 levels, 2 pace chips, Spil', ['sd-theme-btn', 'sd-sound-btn', 'btn-play'].every(x => order.includes(x)) && order.filter(o => /^[1-9][^0-9]/.test(o)).length === 9 && ['A2', 'B1', 'B2', 'C1', 'Træning', 'Med tid'].every(x => order.some(o => o.replace('✓ ', '') === x)), order.join(' > '));
    const fr = await focusRingProblems(page, 22);
    rec('start: focus ring visible on every focus stop', fr.length === 0, fr.join(','));
    for (let mi = 0; mi < 9; mi++) {
      await selectMode(page, mi);
      await page.focus('#btn-play'); await page.keyboard.press('Enter'); await sleep(250);
      const fo = await page.evaluate(() => document.activeElement.className);
      const lk = (await L(page)).item;
      const isSlots = !!lk.slots;
      let opts = await OPTS(page);
      let acc = isSlots ? lk.slots[0].accepted_answers.map(norm) : accOf(lk);
      const rightIdx = opts.findIndex(x => acc.includes(norm(x.v)));
      const wrongIdx = opts.findIndex(x => !acc.includes(norm(x.v)));
      // wrong via number key
      await page.keyboard.press(String(wrongIdx + 1)); await sleep(350);
      const sl = await slipInfo(page);
      rec(`kbd mode ${mi + 1}: Enter on Spil, first option focused; number key selects; Videre focused after wrong`, /opt/.test(fo) && sl && sl.focus === 'Videre', `focus=${fo} slip=${sl && sl.focus}`);
      await page.keyboard.press('Enter'); await sleep(120);
      const p2 = await progress(page);
      // correct via number key on next item
      const lk2 = (await L(page)).item;
      opts = await OPTS(page); acc = lk2.slots ? lk2.slots[0].accepted_answers.map(norm) : accOf(lk2);
      await page.keyboard.press(String(opts.findIndex(x => acc.includes(norm(x.v))) + 1));
      if (lk2.slots) { await sleep(650); if (lk2.slots.length > 1) { opts = await OPTS(page); acc = lk2.slots[1].accepted_answers.map(norm); await page.keyboard.press(String(opts.findIndex(x => acc.includes(norm(x.v))) + 1)); } }
      await sleep(1000);
      const p3 = await progress(page);
      rec(`kbd mode ${mi + 1}: Enter on Videre advances (2/10), correct number key auto-advances (3/10)`, p2 === '2/10' && p3 === '3/10', `${p2} ${p3}`);
      await page.keyboard.press('Escape'); await sleep(200);
      rec(`kbd mode ${mi + 1}: Escape returns to start`, await page.$eval('#start-screen', n => !n.classList.contains('hidden')), '');
    }
    // keyboard-only build step (mode 3)
    await selectMode(page, 2);
    let bdone = false, bt = 0;
    while (!bdone && bt < 5) {
      bt++; await page.click('#btn-play'); await sleep(250);
      for (let i = 0; i < 10; i++) {
        if (i >= 7) {
          const lk = (await L(page)).item; const opts = await OPTS(page); const acc = accOf(lk);
          await page.keyboard.press(String(opts.findIndex(x => acc.includes(norm(x.v))) + 1)); await sleep(200);
          if (await page.$('#item-host .build')) {
            const words = lk.sentence.replace(/_{2,}/, lk.correct).split(/\s+/);
            const f0 = await page.evaluate(() => document.activeElement.className);
            // press number keys to place words in order
            for (const w of words) {
              const bank = await page.$$eval('#item-host .build-bank .tile', ns => ns.map(n => n.getAttribute('data-word')));
              const k = bank.indexOf(w);
              if (k >= 9) { const tiles = await page.$$('#item-host .build-bank .tile'); await tiles[k].focus(); await page.keyboard.press('Enter'); } else await page.keyboard.press(String(k + 1));
              await sleep(30);
            }
            const placed = await page.$$eval('#item-host .build-answer .tile', ns => ns.map(n => n.getAttribute('data-word')).join(' '));
            const prev = await progress(page);
            await page.keyboard.press('Enter');
            let adv = null; const t0 = Date.now(); for (let k = 0; k < 60; k++) { await sleep(25); if ((await progress(page)) !== prev || await sumVisible(page)) { adv = Date.now() - t0; break; } }
            rec('kbd mode 3 build: first tile focused, number keys place tiles, Enter checks, auto-advances', /tile/.test(f0) && placed === words.join(' ') && adv && adv < 1100, `focus0=${f0} placed="${placed}" adv=${adv}`);
            bdone = true; break;
          }
          await sleep(900); continue;
        }
        await playItem(page, 'c');
      }
      if (!bdone) { await page.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); }); await sleep(200); }
    }
    if (!bdone) rec('kbd mode 3 build', false, 'no build step seen');
    rec('kbd: console clean', issues.length === 0, issues.join(' || '));
    await page.close();
  }

  // ---------- layout / a11y / themes across viewports
  if (want('layout')) {
    const lumF = ([r, g, b]) => { const f = v => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
    const contrastFn = () => {
      const lum = ([r, g, b]) => { const f = v => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const parse = c => (c.match(/[\d.]+/g) || []).map(Number);
      const effBg = el => { const layers = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c.length >= 3) { const a = c[3] ?? 1; if (a > 0) layers.push([c[0], c[1], c[2], a]); if (a >= 1) break; } } let base = [255, 255, 255]; for (let i = layers.length - 1; i >= 0; i--) { const [r, g, b, a] = layers[i]; base = [r * a + base[0] * (1 - a), g * a + base[1] * (1 - a), b * a + base[2] * (1 - a)]; } return base; };
      const out = [];
      for (const el of document.querySelectorAll('body *')) {
        if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
        if (el.closest('[aria-disabled="true"]') || el.disabled) { /* disabled still checked below with opacity */ }
        let op = 1; for (let e = el; e; e = e.parentElement) op *= +getComputedStyle(e).opacity;
        const fg = parse(cs.color); const bg = effBg(el);
        const fa = fg[3] ?? 1; const fgc = [fg[0] * fa + bg[0] * (1 - fa), fg[1] * fa + bg[1] * (1 - fa), fg[2] * fa + bg[2] * (1 - fa)];
        const L1 = lum(fgc), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        if (ratio < 4.5) out.push(`${ratio.toFixed(2)} op=${op.toFixed(2)} ${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 20)} "${el.textContent.trim().slice(0, 24)}"`);
      }
      return [...new Set(out)].slice(0, 12);
    };
    const checkScreen = async (p, label, acc) => {
      const ov = await hasHorizontalOverflow(p); const sm = await smallTapTargets(p); const ct = await p.evaluate(contrastFn);
      const unl = await unlabelledButtons(p);
      if (ov) acc.push(`${label}: h-scroll`); if (sm.length) acc.push(`${label}: small ${sm.join(';')}`); if (unl.length) acc.push(`${label}: unlabelled ${unl.join(';')}`);
      return ct;
    };
    for (const vp of ['small', 'mobile', 'tablet', 'desktop'].filter(v => !process.env.VP || process.env.VP.split(',').includes(v))) for (const scheme of ['light', 'dark']) {
      const r = await openGame(browser, FILE, { viewport: vp, colorScheme: scheme, init: INIT }); const p = r.page;
      await p.evaluate(() => { localStorage.clear(); localStorage.setItem('tidsmaskinen:totalCorrect', '30'); });
      await p.reload({ waitUntil: 'load' }); await sleep(1500);
      const acc = []; const lowC = {};
      const theme = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
      lowC.start = await checkScreen(p, 'start', acc);
      if (SHOTS && (vp === 'small' || vp === 'desktop')) await shot(p, 'tidsmaskinen', vp, `start-${scheme}`);
      for (const mi of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        await selectMode(p, mi);
        await p.click('#btn-play'); await sleep(250);
        // answer all 10: first wrong (slip check), rest right; mode 3 stops at build to check
        const lkF = (await L(p)).item;
        lowC['play' + mi] = await checkScreen(p, `play m${mi + 1}`, acc);
        if (SHOTS && (vp === 'small' || vp === 'desktop') && [1, 5, 6, 8].includes(mi)) await shot(p, 'tidsmaskinen', vp, `play-m${mi + 1}-${scheme}`);
        const recs = [];
        for (let i = 0; i < 10; i++) {
          const dir = i === 0 ? 'w' : 'c';
          const r1 = await playItem(p, dir, {
            slipShot: async (pp, rr) => { if (i === 0) { lowC['slip' + mi] = await checkScreen(pp, `slip m${mi + 1}`, acc); if (SHOTS && (vp === 'small' || vp === 'desktop') && [1, 5, 7].includes(mi)) await shot(pp, 'tidsmaskinen', vp, `wrong-m${mi + 1}-${scheme}`); } },
            onBuild: async (pp, rr) => { lowC.build = await checkScreen(pp, `build m3`, acc); if (SHOTS && (vp === 'small' || vp === 'desktop') && !lowC.__bs) { lowC.__bs = 1; await shot(pp, 'tidsmaskinen', vp, `build-${scheme}`); } }
          });
          if (r1.err) { acc.push('lookup fail ' + r1.text); break; }
        }
        await sleep(300);
        lowC['sum' + mi] = await checkScreen(p, `summary m${mi + 1}`, acc);
        if (SHOTS && (vp === 'small' || vp === 'desktop') && [1, 5, 8].includes(mi)) await shot(p, 'tidsmaskinen', vp, `roundend-m${mi + 1}-${scheme}`);
        await p.evaluate(() => { [...document.querySelectorAll('#summary-host .btn')].find(b => b.textContent === 'Til start')?.click(); });
        await sleep(150);
      }
      // timed prompt screen layout
      await selectMode(p, 0); await p.click('#pace-list .chip[data-pace=timed]'); await p.click('#btn-play'); await sleep(250);
      lowC.timed = await checkScreen(p, 'play timed', acc);
      const ctAll = Object.entries(lowC).filter(([k, v]) => Array.isArray(v) && v.length).map(([k, v]) => k + ':' + v.join('/'));
      rec(`${vp}/${scheme}: no h-scroll, taps>=44, icon buttons labelled (all screens, 9 modes + build + timed)`, acc.length === 0, acc.slice(0, 6).join(' || ') + ` theme=${theme}`);
      rec(`${vp}/${scheme}: contrast >=4.5 (composited bg) on all screens`, ctAll.length === 0, ctAll.slice(0, 5).join(' || '));
      rec(`${vp}/${scheme}: console clean`, r.issues.length === 0, r.issues.join(' || '));
      await p.close();
    }
  }

  // ---------- themes: data-theme toggle, reduced motion
  if (want('theme')) {
    let r = await openGame(browser, FILE, { viewport: 'mobile', colorScheme: 'dark', init: INIT });
    let p = r.page; await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'load' }); await sleep(1500);
    const th1 = await p.evaluate(() => document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')); // US-040: no attribute until the user chooses (OS drives CSS)
    await p.click('#sd-theme-btn'); const th2 = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await p.click('#sd-theme-btn'); const th3 = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    rec('dark: prefers-color-scheme drives the theme; bar toggle flips both ways', th1 === 'dark' && th2 !== th1 && th3 === th1, `${th1} -> ${th2} -> ${th3}`);
    await p.close();
    r = await openGame(browser, FILE, { viewport: 'mobile', reducedMotion: true, init: INIT }); p = r.page;
    await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(p, 1); await p.click('#btn-play'); await sleep(250);
    const lk = (await L(p)).item; const opts = await OPTS(p); const acc = accOf(lk);
    const btns = await p.$$('#item-host .opt'); await btns[opts.findIndex(x => acc.includes(norm(x.v)))].click(); await sleep(60);
    const anim = await p.evaluate(() => ({ n: document.getAnimations().filter(a => a.playState === 'running').length, press: !!document.querySelector('#item-host .press'), isNew: !!document.querySelector('#item-host .tl-card.new'), sweep: !!document.querySelector('#item-host .tl-seg.sweep') }));
    rec('reduced motion: no running animations after a correct answer; fully functional', anim.n === 0 && !anim.press && !anim.isNew && !anim.sweep, JSON.stringify(anim));
    await sleep(1000);
    const prog = await progress(p);
    rec('reduced motion: round still auto-advances', prog === '2/10', prog);
    await p.close();
    // control: with motion there are animations (sanity)
    r = await openGame(browser, FILE, { viewport: 'mobile', init: INIT }); p = r.page;
    await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'load' }); await sleep(1500);
    await selectMode(p, 1); await p.click('#btn-play'); await sleep(250);
    const lk2 = (await L(p)).item; const o2 = await OPTS(p); const a2 = accOf(lk2);
    const b2 = await p.$$('#item-host .opt'); await b2[o2.findIndex(x => a2.includes(norm(x.v)))].click(); await sleep(60);
    const anim2 = await p.evaluate(() => ({ press: !!document.querySelector('#item-host .press'), isNew: !!document.querySelector('#item-host .tl-card.new'), sweep: !!document.querySelector('#item-host .tl-seg.sweep') }));
    note('control (motion allowed): animations present', JSON.stringify(anim2));
    await p.close();
  }

  // ---------- long words / wrap + special chars + escape check across all items (static render in DOM is covered); check wrapping at 360 with longest sentence
  if (want('wrap')) {
    const r = await openGame(browser, FILE, { viewport: 'small', init: INIT }); const p = r.page;
    await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'load' }); await sleep(1500);
    // Inject the longest items of each mode into pool by monkeypatching DATA ordering is not possible; instead report max lengths and rely on layout section.
    const lens = await p.evaluate(() => { const out = {}; for (const [k, arr] of Object.entries(window.TIDS_DATA)) { let m = 0, id = ''; for (const it of arr) { const t = (it.context || '') + ' ' + it.sentence + ' ' + (it.note || ''); if (t.length > m) { m = t.length; id = it.id; } } out[k] = m + ':' + id; } return out; });
    note('longest text per mode', JSON.stringify(lens));
    await p.close();
  }
} catch (e) { rec('SPEC CRASH', false, e.stack); }
await browser.close();
fs.writeFileSync(path.join(OUT, 'tids-dumps.json'), JSON.stringify(dumps.length), 'utf8');
console.log(`\n${results.filter(r => r.ok).length}/${results.length} passed`);
for (const r of results.filter(x => !x.ok)) console.log('FAILED: ' + r.name + ' :: ' + String(r.ev).slice(0, 300));
process.exit(results.some(r => !r.ok) ? 1 : 0);
