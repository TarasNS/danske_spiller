# simply.com auto-deploy: status and concerns

Written 2026-10-06. Never put secrets or key material in this file.

## Status
- Workflow: `.github/workflows/deploy.yml`, merged via PR #10 on the fork `TarasNS/danske_spiller`.
- Trigger: push to `master`, or manual run (`workflow_dispatch`). Runs `node shared/validate.js` first; a failure blocks the upload.
- Upload: rsync over SSH to `public_html/` on `ssh.simply.com:22` (user `sjovtdansk.dk`). No `--delete`.
- Excluded from upload: `.git/`, `.github/`, `.claude/`, `tests/`, `docs/`, `stories/`, `qa/`, `improvement/`, `tmp_*.js`, `.tmp_*`, `build-loop.sh`, `*.md`, `*.csv`, `.gitignore`.
- Secrets (repo Settings, Secrets and variables, Actions): `SIMPLY_HOST`, `SIMPLY_PORT`, `SIMPLY_USER`, `SIMPLY_SSH_KEY`.
- Verified: first deploy succeeded (rsync sent ~172 KB, site total 2.7 MB). `https://sjovtdansk.dk/` returned 200 right after. Only the front page was checked, not individual games.

## Concerns
1. **SSH private key was pasted into a chat.** It is in that session's transcript. Rotate it: generate a new key pair, add the new public key in the simply.com control panel, update `SIMPLY_SSH_KEY`, remove the old public key.
2. **No deletes on the server.** Games removed or renamed in the repo stay live until deleted by hand (SFTP or the control panel). Adding `--delete` is risky because anything else in `public_html` not in the repo would be wiped.
3. **Host key is trusted on first use** (`ssh-keyscan` in the workflow). Fine for a static site, but it does not protect against a spoofed server. To harden, store simply.com's host key as a secret and write it to `known_hosts`.
4. **Every push to `master` goes live.** There is no staging and no approval step. Only the dataset validator gates it; the smoke tests (`tests/smoke.mjs`) are not run in CI. Options: add a protected environment with required reviewer, or only deploy on tags or manual runs.
5. **Pushes from upstream.** Merging `upstream` (`tasio1/danske_spiller`) into `master` and pushing to the fork also deploys.
6. **Secrets must be set without a trailing newline.** The first run failed with `Bad port '***'` because PowerShell's pipe (`"22" | gh secret set`) appended CRLF. Use `gh secret set NAME --body "value"` instead.
7. **rsync availability.** It worked on simply.com's SSH. If simply.com ever restricts it, switch the upload step to `scp` or `sftp`.
8. **Branch switching in the shared working tree.** During setup, another process switched branches under the session, so the workflow commit `d2114af` landed off-branch and had to be pushed by SHA. Check `us-026-helper` and `us-053-docs` locally for a stray copy of that commit before committing there.
9. **Local workspace state.** `simply.md` itself is untracked and not committed. The branch `ci/deploy-simply` is merged and can be deleted.

## Useful commands
- List runs: `gh run list --repo TarasNS/danske_spiller --limit 5`
- Failed log: `gh run view <id> --repo TarasNS/danske_spiller --log-failed`
- Manual deploy: `gh workflow run deploy.yml --repo TarasNS/danske_spiller`
- Set a secret: `gh secret set SIMPLY_USER --repo TarasNS/danske_spiller --body "value"`
