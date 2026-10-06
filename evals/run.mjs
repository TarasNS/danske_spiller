#!/usr/bin/env node
// Agent evals: replay a real historical task against the CURRENT Claude Code configuration.
//   node evals/run.mjs [--case <id>] [--runs N] [--selftest]
//   --selftest  no model call: each case's checks must FAIL at `from` and PASS at `fix` (validates the graders).
// Per run: snapshot of `from` (no git history, so the fix can't be read) + current CLAUDE.md/.claude overlay ->
// `claude -p <prompt>` (NOT --bare) -> may_change gate -> deterministic checks copied in only afterwards.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const SELFTEST = args.includes('--selftest');
const RUNS = Number(opt('runs', 1));
const ONLY = opt('case');
const BUDGET = opt('budget', process.env.EVAL_BUDGET_USD || '3');
const TIMEOUT_MS = Number(process.env.EVAL_TIMEOUT_MS || 15 * 60 * 1000);
const OUT = path.join(ROOT, 'evals-out');
const win = process.platform === 'win32';
const TMP = fs.realpathSync.native(os.tmpdir()); // long path: Claude Code blocks Windows 8.3 short names (TARAST~1)
const SETTINGS = path.join(ROOT, 'evals', 'settings.json');

const git = (a, cwd, extra = {}) => execFileSync('git', a, { cwd, encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'pipe'], ...extra }).trim();
const STAR2 = '@@STAR2@@';
const globRe = g => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, STAR2).replace(/\*/g, '[^/]*').split(STAR2).join('.*') + '$');
const rm = d => fs.rmSync(d, { recursive: true, force: true, maxRetries: 3 });

function snapshot(rev, dest) { // export the tree only (no history) via a throwaway index; no tar, so it works on Windows and Linux
  fs.mkdirSync(dest, { recursive: true });
  const idx = path.join(TMP, `eval-idx-${process.pid}-${Date.now()}`);
  const env = { ...process.env, GIT_INDEX_FILE: idx };
  try {
    git(["read-tree", rev], ROOT, { env });
    git(["checkout-index", "-a", "-f", "--prefix=" + dest.split(path.sep).join('/') + "/"], ROOT, { env });
  } finally { fs.rmSync(idx, { force: true }); }
}
function overlayConfig(dest) {
  rm(path.join(dest, '.claude')); rm(path.join(dest, 'CLAUDE.md'));
  fs.copyFileSync(path.join(ROOT, 'CLAUDE.md'), path.join(dest, 'CLAUDE.md'));
  for (const d of ['agents', 'skills', 'hooks']) { // agent-memory is deliberately not injected
    const src = path.join(ROOT, '.claude', d);
    if (fs.existsSync(src)) fs.cpSync(src, path.join(dest, '.claude', d), { recursive: true });
  }
}
function baseline(dest) {
  git(['init', '-q'], dest); git(['config', 'user.email', 'eval@local'], dest); git(['config', 'user.name', 'eval'], dest);
  git(['add', '-A'], dest); git(['commit', '-q', '-m', 'baseline', '--no-verify'], dest);
}
function runChecks(c, dest) {
  // Graders always come from the current checkout, never from the historical one.
  fs.copyFileSync(path.join(ROOT, 'shared', 'validate.js'), path.join(dest, 'shared', 'validate.js'));
  return c.checks.map(cmd => {
    const r = spawnSync(cmd.split('{root}').join(ROOT.replace(/\\/g, '/')), { cwd: dest, shell: true, encoding: 'utf8', timeout: 5 * 60 * 1000 });
    return { cmd, ok: r.status === 0, out: ((r.stdout || '') + (r.stderr || '')).trim().slice(0, 1500) };
  });
}
function scopeViolations(c, dest) {
  const res = c.may_change.map(globRe);
  const changed = git(['status', '--porcelain', '-uall'], dest).split('\n').filter(Boolean).map(l => l.replace(/^\S+\s+/, '').replace(/^"|"$/g, ''));
  return { changed, violations: changed.filter(f => !res.some(re => re.test(f))) };
}

function runCase(c, n) {
  const work = fs.mkdtempSync(path.join(TMP, `eval-${c.id}-`));
  const t0 = Date.now();
  const secs = () => (Date.now() - t0) / 1000;
  try {
    snapshot(c.from, work); overlayConfig(work); baseline(work);
    if (SELFTEST) {
      const before = runChecks(c, work);
      rm(work); fs.mkdirSync(work, { recursive: true }); snapshot(c.fix, work); baseline(work);
      const after = runChecks(c, work);
      const good = before.some(x => !x.ok) && after.every(x => x.ok);
      const why = good ? '' : `selftest: from-state failing ${before.filter(x => !x.ok).length}/${before.length}; fix-state failing ${after.filter(x => !x.ok).length}/${after.length}\n` + after.filter(x => !x.ok).map(x => x.cmd + '\n' + x.out).join('\n');
      return { id: c.id, run: n, pass: good, why, secs: secs() };
    }
    const env = { ...process.env };
    if (process.env.EVAL_CLEAN_HOME) { const h = fs.mkdtempSync(path.join(TMP, 'eval-home-')); env.HOME = h; env.USERPROFILE = h; }
    const model = spawnSync('claude', ['-p', '--output-format', 'json', '--permission-mode', 'acceptEdits', '--setting-sources', 'project,local', '--settings', SETTINGS, '--max-budget-usd', BUDGET],
      { cwd: work, input: c.prompt, encoding: 'utf8', shell: win, timeout: TIMEOUT_MS, env, maxBuffer: 1 << 28 });
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, `${c.id}-${n}.json`), model.stdout || '');
    fs.writeFileSync(path.join(OUT, `${c.id}-${n}.stderr.txt`), model.stderr || '');
    if (model.status !== 0) return { id: c.id, run: n, pass: false, why: `claude exited ${model.status} ${model.error || ''}`, secs: secs() };
    const { changed, violations } = scopeViolations(c, work); // evaluated before the graders are copied in
    fs.writeFileSync(path.join(OUT, `${c.id}-${n}.diff`), git(['diff', 'HEAD'], work));
    const failed = runChecks(c, work).filter(x => !x.ok);
    const why = [violations.length ? `out of scope: ${violations.join(', ')}` : '', ...failed.map(x => `check failed: ${x.cmd}\n${x.out}`)].filter(Boolean).join('\n');
    return { id: c.id, run: n, pass: !why, why, changed, secs: secs() };
  } finally { rm(work); }
}

const dir = path.join(ROOT, 'evals', 'cases');
const cases = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).filter(c => !ONLY || c.id === ONLY);
if (!cases.length) { console.error('no cases matched'); process.exit(2); }

const results = [];
for (const c of cases) for (let n = 1; n <= (SELFTEST ? 1 : RUNS); n++) {
  const r = runCase(c, n); results.push(r);
  console.log(`${r.pass ? 'PASS' : 'FAIL'} ${c.id} #${n} (${r.secs.toFixed(0)}s)${r.why ? '\n' + r.why : ''}`);
}
const lines = ['| case | passed | needed |', '|---|---|---|'];
let failedCases = 0;
for (const c of cases) {
  const rs = results.filter(r => r.id === c.id), p = rs.filter(r => r.pass).length, need = c.min_pass ?? Math.ceil(rs.length / 2);
  if (p < need) failedCases++;
  lines.push(`| ${c.id} | ${p < need ? 'FAIL' : 'ok'} ${p}/${rs.length} | ${need} |`);
}
console.log('\n' + lines.join('\n'));
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, (SELFTEST ? '### Eval graders selftest\n' : '### Agent evals\n') + lines.join('\n') + '\n');
process.exit(failedCases ? 1 : 0);
