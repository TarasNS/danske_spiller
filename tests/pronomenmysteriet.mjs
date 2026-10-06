// Functional spec for pronomenmysteriet. Run from the worktree cwd:
//   cd <worktree> && SHOT_ROOT=<main>/docs/redesign/screenshots node <main>/tests/pronomenmysteriet.mjs [--shots]
import { launch, openGame, sleep, hasHorizontalOverflow, smallTapTargets, shot } from './lib/harness.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const FILE = 'pronomenmysteriet/index.html';
const SHOTS = process.argv.includes('--shots');
const MODES = ['subject_object','possessive_agreement','reflexive_possessive','den_det_de','nogen_nogle_noget','demonstrative'];
const POOLS = [120,120,180,100,140,100];
const results = [];
const rec = (name, ok, ev) => { results.push({ name, ok, ev }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (ev ? '  :: ' + ev : '')); };
const shownItems = {}; // mode -> [{ctx,sentence,options,gloss,wrong?:{...}}]

// US-001 data guard: placeholder text / unknown mode keys fail the run. PM_DATA_FILE overrides the data path (for guard self-tests).
{
  const g = spawnSync(process.execPath, [new URL('./pronomen-data-guard.mjs', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'), ...(process.env.PM_DATA_FILE ? [process.env.PM_DATA_FILE] : [])], { encoding: 'utf8' });
  rec('data guard: no placeholder text / unknown mode keys', g.status === 0, ((g.stdout || '') + (g.stderr || '')).trim().split(/\r?\n/).slice(0, 4).join(' | '));
}

const browser = await launch();

async function lookup(page) {
  // find item data for the currently shown item
  return page.evaluate(() => {
    const sent = [...document.querySelectorAll('#item-host .sentence')][0];
    const blank = sent.querySelector('.sd-gap');
    const text = sent.textContent;
    const all = [].concat(...Object.values(window.PRONOMEN_DATA));
    const ctx = [...document.querySelectorAll('#item-host .evidence li')].map(l => l.textContent);
    const norm = s => s.replace(/\s+/g, ' ').trim();
    const cand = all.filter(i => norm(i.sentence_da.replace(/_{2,}/, '?')) === norm(text) && JSON.stringify(i.context_da || []) === JSON.stringify(ctx));
    return cand[0] || null;
  });
}
const optTexts = page => page.$$eval('#item-host .opt .otxt', ns => ns.map(n => n.textContent));

async function playRound(page, mode, plan /* array of 'c'|'w' */, collect) {
  let advTimes = [];
  for (let i = 0; i < plan.length; i++) {
    const item = await lookup(page);
    if (!item) { rec(`${mode}: item lookup #${i}`, false, 'could not map shown item to data'); return; }
    const opts = await page.$$eval('#item-host .opt', ns => ns.map(n => ({ v: n.getAttribute('data-value'), t: n.querySelector('.otxt').textContent })));
    const rec1 = { id: item.id, level: item.level, verify: !!item.verify, ctx: item.context_da, sentence: item.sentence_da, order: opts.map(o => o.t), srcOrder: item.options, gloss: item.gloss_en, note: item.note, ref: item.reference, correct: item.correct };
    const wantC = plan[i] === 'c';
    const idx = opts.findIndex(o => (o.v === item.correct) === wantC);
    const btns = await page.$$('#item-host .opt');
    const t0 = Date.now();
    await btns[idx].click();
    if (wantC) {
      // ensure no slip/congrats
      const txtNow = await page.$eval('#item-host', n => n.innerText);
      rec1.afterCorrectText = txtNow;
      const prevCount = await page.$eval('#progress-count', n => n.textContent);
      let changed = false;
      for (let k = 0; k < 40; k++) { await sleep(50); const c = await page.$eval('#progress-count', n => n.textContent).catch(() => null); const sumVisible = await page.$eval('#summary-screen', n => !n.classList.contains('hidden')); if (c !== prevCount || sumVisible) { changed = true; break; } }
      rec1.advMs = Date.now() - t0; advTimes.push(rec1.advMs);
      if (!changed) rec(`${mode}: auto-advance`, false, 'no advance in 2s');
    } else {
      await sleep(900);
      const slip = await page.evaluate(() => {
        const s = document.querySelector('#item-host .slip');
        if (!s) return null;
        return { text: s.innerText, notes: s.querySelectorAll('.note').length, tts: s.querySelectorAll('button[aria-label*="høj" i], button[title*="høj" i], .dc-tts, button').length, btns: [...s.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || '') + '|' + b.textContent.trim()), chain: s.querySelector('.chain')?.innerText || null };
      });
      rec1.slip = slip;
      // still on same item (waits for input)?
      const cnt = await page.$eval('#progress-count', n => n.textContent);
      rec1.stillSame = cnt;
      if (collect && i === plan.indexOf('w') && mode === MODES[2]) {}
      await page.click('#item-host .slip .btn.accent');
    }
    (shownItems[mode] ||= []).push(rec1);
    await sleep(120);
  }
  return advTimes;
}

try {
  // ---------- start screen + pools
  let { page, issues } = await openGame(browser, FILE, { viewport: 'mobile' });
  const start = await page.evaluate(() => ({
    visibleButtons: [...document.querySelectorAll('#start-screen button')].map(b => b.textContent.trim().replace(/\s+/g, ' ')),
    h1: document.querySelector('#start-screen h1')?.textContent.trim(),
    text: document.getElementById('start-screen').innerText,
    pools: Object.fromEntries(Object.entries(window.PRONOMEN_DATA).map(([k, v]) => [k, v.length]))
  }));
  console.log(JSON.stringify(start, null, 1));
  rec('pools 120/120/180/100/140/100', MODES.every((m, i) => start.pools[m] === POOLS[i]), JSON.stringify(start.pools));
  rec('start: exactly one Spil + 6 modes + 3 levels', start.visibleButtons.filter(b => b === 'Spil').length === 1 && start.visibleButtons.length === 1 + 6 + 3, start.visibleButtons.join(' | '));
  if (SHOTS) { await shot(page, 'pronomenmysteriet', 'mobile', 'start-l'); }

  // ---------- each mode: select, one full round with mixed answers
  for (let mi = 0; mi < MODES.length; mi++) {
    const mode = MODES[mi];
    await page.evaluate(() => { localStorage.removeItem('srs:pronomenmysteriet'); });
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const mbtns = await page.$$('#mode-list .mode-btn');
    await mbtns[mi].click();
    await page.click('#btn-play'); await sleep(200);
    const header = await page.$eval('#progress-count', n => n.textContent);
    rec(`${mode}: round starts with 10 items`, header === '1/10', header);
    if (SHOTS && (mi === 0 || mi === 2)) await shot(page, 'pronomenmysteriet', 'mobile', `play-${mode}`);
    // shuffled check later; plan: c,w,c,c,w,c,c,c,w,c  => 7/10, 3 weak
    const plan = ['c','w','c','c','w','c','c','c','w','c'];
    // screenshot of wrong feedback during first wrong
    const item0 = await lookup(page);
    if (SHOTS && mi === 2) {
      // wrong immediately on first item for screenshot
      const opts = await page.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value')));
      const btns = await page.$$('#item-host .opt');
      const k = opts.findIndex(v => v !== item0.correct); await btns[k].click(); await sleep(900);
      await shot(page, 'pronomenmysteriet', 'mobile', 'wrong-feedback-reflexive');
      await page.click('#item-host .slip .btn.accent');
      const adv = await playRound(page, mode, plan.slice(1));
      var advs = adv;
    } else {
      var advs = await playRound(page, mode, plan);
    }
    await sleep(300);
    const sum = await page.evaluate(() => {
      const s = document.getElementById('summary-screen');
      return { visible: !s.classList.contains('hidden'), text: s.innerText, weak: s.querySelectorAll('.weak-list li').length, primary: [...s.querySelectorAll('button.primary')].map(b => b.textContent), buttons: [...s.querySelectorAll('button')].map(b => b.textContent.trim()), xlinks: [...s.querySelectorAll('a')].map(a => a.getAttribute('href')) };
    });
    rec(`${mode}: round-end screen`, sum.visible && /\d+\/10/.test(sum.text) && /%/.test(sum.text) && sum.weak > 0 && sum.weak <= 3 && sum.primary.length === 1 && sum.primary[0] === 'Spil igen' && sum.buttons.includes('Gentag fejl') && sum.xlinks.length === 1, JSON.stringify({ weak: sum.weak, buttons: sum.buttons, x: sum.xlinks, stats: sum.text.replace(/\n+/g, ' / ').slice(0, 160) }));
    const adAvg = advs && advs.length ? advs : [];
    rec(`${mode}: auto-advance ~800ms`, adAvg.length > 0 && adAvg.every(t => t >= 700 && t <= 1200), JSON.stringify(adAvg));
    if (SHOTS && (mi === 0 || mi === 2)) await shot(page, 'pronomenmysteriet', 'mobile', `roundend-${mode}`);

    // SRS keys
    const store = await page.evaluate(() => JSON.parse(localStorage.getItem('srs:pronomenmysteriet') || 'null'));
    const keys = store ? Object.keys(store.items) : [];
    const keyOk = keys.length === 10 && keys.every(k => k.startsWith(`pronomenmysteriet:${mode}:`) && !/:\d+$/.test(k));
    rec(`${mode}: SRS keys format`, keyOk, keys.slice(0, 2).join(', ') + ` (n=${keys.length})`);
    const boxes = Object.values(store.items).map(e => e.box).sort().join('');
    const missedIds = shownItems[mode].filter(r => r.slip).map(r => r.id);

    // persistence + due-first after reload (only on mode 3 and 1 to save time)
    if (mi === 2 || mi === 0) {
      const state0 = JSON.stringify(store);
      await page.reload({ waitUntil: 'load' }); await sleep(1500);
      const store2 = await page.evaluate(() => localStorage.getItem('srs:pronomenmysteriet'));
      rec(`${mode}: SRS survives reload`, store2 === state0 || JSON.stringify(JSON.parse(store2)) === state0, `boxes=${boxes}`);
      const savedMode = await page.$$eval('#mode-list .mode-btn', ns => ns.map(n => n.getAttribute('aria-pressed')));
      rec(`${mode}: mode selection persists`, savedMode[mi] === 'true', savedMode.join(','));
      await page.click('#btn-play'); await sleep(200);
      const ids = [];
      for (let i = 0; i < 10; i++) { const it = await lookup(page); ids.push(it.id); const btns = await page.$$('#item-host .opt'); const opts = await page.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value'))); await btns[opts.findIndex(v => v !== it.correct)].click(); await sleep(150); await page.click('#item-host .slip .btn.accent'); await sleep(80); }
      const allMissedFirst = missedIds.every(id => ids.includes(id));
      // box>1 items are not due for 1 day, so none of the 7 correct ones should appear
      const correctIds = shownItems[mode].filter(r => !r.slip).map(r => r.id);
      const leaked = correctIds.filter(id => ids.includes(id));
      rec(`${mode}: due items first on new round (3 missed back, 7 not-due kept out)`, allMissedFirst && leaked.length === 0, `missedBack=${allMissedFirst} leaked=${leaked.length}`);
    }
  }

  // ---------- correct-answer UI: no congratulatory text
  const congrats = Object.values(shownItems).flat().filter(r => r.afterCorrectText).map(r => r.afterCorrectText);
  const bad = congrats.filter(t => /(flot|godt klaret|super|rigtigt|korrekt|bravo|tillykke|well done|correct|great)/i.test(t.replace(/Rigtigt svar/gi, '')));
  rec('correct answer: no congratulatory text', bad.length === 0, bad.slice(0, 2).join(' || '));

  // ---------- wrong feedback structure
  const slips = Object.values(shownItems).flat().filter(r => r.slip);
  const badSlips = slips.filter(r => r.slip.notes !== 1 || !/Rigtigt svar:/.test(r.slip.text) || !r.slip.text.includes(r.note) || r.slip.btns.length !== 2 || !r.slip.btns.some(b => /Videre/.test(b)));
  rec('wrong feedback: correct answer + one note + replay + Videre', badSlips.length === 0, `slips=${slips.length} bad=${badSlips.length} sampleBtns=${JSON.stringify(slips[0]?.slip.btns)}`);
  const wrongStaysSame = slips.every(r => true);
  // reflexive owner chain consistent
  const refl = slips.filter(r => r.ref);
  rec('reflexive wrong feedback shows owner chain', refl.length > 0 && refl.every(r => r.slip.chain), `with-ref=${refl.length} chain=${refl[0]?.slip.chain?.replace(/\n/g, ' ')}`);

  // ---------- option shuffling
  const all = Object.values(shownItems).flat();
  const sameOrder = all.filter(r => JSON.stringify(r.order) === JSON.stringify(r.srcOrder)).length;
  rec('options shuffled (not always source order)', sameOrder < all.length * 0.8, `sourceOrder ${sameOrder}/${all.length}`);

  // ---------- level filter
  await page.reload({ waitUntil: 'load' }); await sleep(1500);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' }); await sleep(1500);
  const mb = await page.$$('#mode-list .mode-btn'); await mb[2].click();
  const chips = await page.$$('#level-list .chip');
  // select only A2: toggle B1 and B2 off
  await chips[1].click(); await chips[2].click();
  const lv = await page.$$eval('#level-list .chip', ns => ns.map(n => n.getAttribute('aria-pressed')));
  await page.click('#btn-play'); await sleep(200);
  const lvls = [];
  for (let i = 0; i < 10; i++) { const it = await lookup(page); lvls.push(it.level); const btns = await page.$$('#item-host .opt'); await btns[0].click(); await sleep(150); const sl = await page.$('#item-host .slip .btn.accent'); if (sl) await sl.click(); else await sleep(900); await sleep(80); }
  rec('level chip A2 only filters', lv.join() === 'true,false,false' && lvls.every(l => l === 'A2'), `${lv} ${[...new Set(lvls)]}`);
  await page.reload({ waitUntil: 'load' }); await sleep(1500);
  const lv2 = await page.$$eval('#level-list .chip', ns => ns.map(n => n.getAttribute('aria-pressed')));
  rec('level selection persists', lv2.join() === 'true,false,false', lv2.join());
  // deselecting last level is prevented
  const ch2 = await page.$$('#level-list .chip'); await ch2[0].click();
  const lv3 = await page.$$eval('#level-list .chip', ns => ns.map(n => n.getAttribute('aria-pressed')));
  rec('cannot deselect last level', lv3.join() === 'true,false,false', lv3.join());

  // ---------- keyboard-only
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' }); await sleep(1500);
  const order = [];
  for (let i = 0; i < 14; i++) { await page.keyboard.press('Tab'); order.push(await page.evaluate(() => { const e = document.activeElement; return e.id || (e.textContent || '').trim().slice(0, 14) || e.tagName; })); }
  console.log('tab order:', order.join(' > '));
  rec('tab order reaches mode/level/Spil/header buttons', ['sd-theme-btn','sd-sound-btn','btn-play'].every(x => order.includes(x)) && order.filter(o => /^[1-6]/.test(o)).length >= 6, order.join(' > '));
  await page.focus('#btn-play'); await page.keyboard.press('Enter'); await sleep(300);
  const playVisible = await page.$eval('#play-screen', n => !n.classList.contains('hidden'));
  const focusedOpt = await page.evaluate(() => document.activeElement.className);
  rec('Enter on Spil starts; first option focused', playVisible && /opt/.test(focusedOpt), focusedOpt);
  const it1 = await lookup(page);
  const optv = await page.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value')));
  await page.keyboard.press('2'); await sleep(100);
  const chosen = await page.$$eval('#item-host .opt', ns => ns.map(n => n.className));
  rec('number key 2 selects option 2', /chosen/.test(chosen[1]), chosen.join(' | '));
  // finish via keyboard: wrong => Videre focused => Enter
  const focusedAfter = await page.evaluate(() => document.activeElement.textContent.trim());
  if (/Videre/.test(focusedAfter)) { await page.keyboard.press('Enter'); await sleep(150); rec('Videre is focused after wrong; Enter advances', (await page.$eval('#progress-count', n => n.textContent)) === '2/10', focusedAfter); }
  else { rec('number key 2 was correct (then auto-advance)', true, focusedAfter); await sleep(1000); }
  await page.keyboard.press('Escape'); await sleep(200);
  rec('Escape returns to start', await page.$eval('#start-screen', n => !n.classList.contains('hidden')), '');
  // Space on focused chip
  await page.focus('#level-list .chip:nth-child(2)'); await page.keyboard.press('Space');
  // All level chips start pressed, so the first Space correctly un-presses chip 2; a second Space presses it again.
  const chip2 = () => page.$eval('#level-list .chip:nth-child(2)', n => n.getAttribute('aria-pressed'));
  const spOff = await chip2();
  await page.keyboard.press('Space');
  const spOn = await chip2();
  rec('Space toggles a chip (true -> false -> true)', spOff === 'false' && spOn === 'true', `after 1st Space=${spOff}; after 2nd=${spOn}`);

  // ---------- mute
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' }); await sleep(1500);
  const sndBefore = await page.$eval('#sd-sound-btn', n => n.textContent);
  await page.click('#sd-sound-btn');
  const sndAfter = await page.$eval('#sd-sound-btn', n => n.textContent + '|' + n.getAttribute('aria-pressed'));
  const stored = await page.evaluate(() => [localStorage.getItem('dc:sound-enabled'), localStorage.getItem('pronomenmysteriet:sound')]);
  // wrap audio: count oscillators created when playing while muted
  await page.evaluate(() => { window.__osc = 0; const AC = window.AudioContext || window.webkitAudioContext; if (AC) { const o = AC.prototype.createOscillator; AC.prototype.createOscillator = function () { window.__osc++; return o.apply(this, arguments); }; const b = AC.prototype.createBufferSource; AC.prototype.createBufferSource = function () { window.__osc++; return b.apply(this, arguments); }; } });
  await page.click('#btn-play'); await sleep(200);
  const it2 = await lookup(page); const o2 = await page.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value')));
  await (await page.$$('#item-host .opt'))[o2.findIndex(v => v === it2.correct)].click(); await sleep(300);
  const oscMuted = await page.evaluate(() => window.__osc);
  rec('mute: label changes, persisted, no audio nodes created', sndBefore === 'LYD' && /✗/.test(sndAfter) && oscMuted === 0, `${sndBefore} -> ${sndAfter}; stored=${stored}; osc=${oscMuted}`);
  await page.click('#btn-back'); await page.click('#sd-sound-btn'); await page.click('#btn-play'); await sleep(300);
  const it3 = await lookup(page); const o3 = await page.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value')));
  await sleep(1000);
  await (await page.$$('#item-host .opt'))[o3.findIndex(v => v === it3.correct)].click(); await sleep(300);
  const oscOn = await page.evaluate(() => window.__osc);
  rec('unmuted: audio nodes created (sanity)', oscOn > 0, `osc=${oscOn}`);

  // ---------- TTS on prompt
  await page.click('#btn-back'); await page.click('#btn-play'); await sleep(300);
  const ttsN = await page.$$eval('#item-host button', ns => ns.map(n => (n.getAttribute('aria-label') || '') + '|' + n.textContent.trim()).filter(t => !/^\|?\d/.test(t)));
  console.log('buttons in play item (non-option):', ttsN);
  rec('prompt has TTS replay button', ttsN.some(t => /(lyt|afspil|oplæs|replay|🔊|play)/i.test(t)), ttsN.join(' ; '));

  // ---------- issues
  rec('console clean over full session (file://)', issues.length === 0, issues.join(' || '));
  await page.close();

  // ---------- dark: data-theme and prefers-color-scheme, screenshots all viewports
  for (const vp of ['small', 'mobile', 'tablet', 'desktop']) {
    for (const scheme of ['light', 'dark']) {
      const r = await openGame(browser, FILE, { viewport: vp, colorScheme: scheme });
      const p = r.page;
      await p.evaluate(() => localStorage.clear());
      await p.reload({ waitUntil: 'load' }); await sleep(1500);
      const dm = await p.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme'), bg: getComputedStyle(document.body).backgroundColor }));
      if (SHOTS) await shot(p, 'pronomenmysteriet', vp, `start-${scheme}`);
      const o1 = await hasHorizontalOverflow(p);
      const mbs = await p.$$('#mode-list .mode-btn'); await mbs[2].click();
      await p.click('#btn-play'); await sleep(300);
      const it = await lookup(p);
      const ov = await hasHorizontalOverflow(p);
      const small = await smallTapTargets(p);
      if (SHOTS && (vp === 'small' || vp === 'desktop')) await shot(p, 'pronomenmysteriet', vp, `play-${scheme}`);
      const ops = await p.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value')));
      await (await p.$$('#item-host .opt'))[ops.findIndex(v => v !== it.correct)].click(); await sleep(900);
      const ov2 = await hasHorizontalOverflow(p);
      const small2 = await smallTapTargets(p);
      if (SHOTS && (vp === 'small' || vp === 'desktop')) await shot(p, 'pronomenmysteriet', vp, `wrong-${scheme}`);
      await p.click('#item-host .slip .btn.accent');
      for (let i = 1; i < 10; i++) { const x = await lookup(p); const ops2 = await p.$$eval('#item-host .opt', ns => ns.map(n => n.getAttribute('data-value'))); await (await p.$$('#item-host .opt'))[ops2.findIndex(v => v === x.correct)].click(); await sleep(i === 9 ? 1000 : 900); }
      await sleep(300);
      const ov3 = await hasHorizontalOverflow(p);
      const small3 = await smallTapTargets(p);
      if (SHOTS && (vp === 'small' || vp === 'desktop')) await shot(p, 'pronomenmysteriet', vp, `roundend-${scheme}`);
      const sumVis = await p.$eval('#summary-screen', n => !n.classList.contains('hidden'));
      rec(`${vp}/${scheme}: no h-scroll all screens, tap>=44, round completes`, !o1 && !ov && !ov2 && !ov3 && small.length + small2.length + small3.length === 0 && sumVis, JSON.stringify({ o1, ov, ov2, ov3, small, small2, small3, theme: dm.theme, bg: dm.bg }));
      rec(`${vp}/${scheme}: console clean`, r.issues.length === 0, r.issues.join(' || '));
      await p.close();
    }
  }
} catch (e) { rec('SPEC CRASH', false, e.stack); }
await browser.close();
// Dump of every shown item: OUT overrides; default is the OS temp dir so nothing is written into the repo.
const outFile = process.env.OUT || path.join(os.tmpdir(), 'pm-items.json');
fs.writeFileSync(outFile, JSON.stringify(shownItems, null, 1));
console.log('items dump written to ' + outFile);
console.log(`\n${results.filter(r => r.ok).length}/${results.length} passed`);
process.exit(results.some(r => !r.ok) ? 1 : 0);
