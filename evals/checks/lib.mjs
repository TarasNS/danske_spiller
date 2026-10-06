// Shared helpers for eval graders. Each grader: node evals/checks/<name>.mjs <workdir>; exit 1 on any failure.
// <workdir> is the evaluated checkout; its git HEAD is the pre-task baseline (`git show HEAD:<path>`).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

export const workdir = path.resolve(process.argv[2] || '.');
const sandboxLoad = (src, file) => { const sb = { window: {} }; vm.runInNewContext(src, sb, { filename: file }); return sb.window; };
export const loadNow = f => sandboxLoad(fs.readFileSync(path.join(workdir, f), 'utf8'), f);
export const loadBaseline = f => sandboxLoad(execFileSync('git', ['show', 'HEAD:' + f], { cwd: workdir, encoding: 'utf8', maxBuffer: 1 << 28 }), f);

const errs = [];
export const eq = (name, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) errs.push(`${name}: got ${JSON.stringify(got)} want ${JSON.stringify(want)}`); };
export const ok = (name, cond) => { if (!cond) errs.push(name); };
export const done = () => { console.log(errs.length ? 'FAIL\n  ' + errs.join('\n  ') : 'PASS'); process.exit(errs.length ? 1 : 0); };
