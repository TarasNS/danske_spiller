# Changelog: writing-danish-learning-articles

Entry: version · date · ledger ids · files · regression result · reviewer

## 0.1.0 · 2026-10-06 (initial baseline; exempt from the one-rule-per-round cap, every ledger row is `adopted-pending-review` until a second reviewer signs off)

- Added `SKILL.md`, `article-recipe.md`, `danish-register.md`, `references/promotion-rule.md`,
  `ledger/findings-ledger.md`, `regression/run_checks.cjs` + `cases.json` + 9 fixtures.
- Content scaffolding outside the skill: `content/blog/topic-queue.md`,
  `content/blog/published-index.md`.
- Ledger ids: A001-A007.

### RED phase (baseline, no skill present)

Three fresh-context runs. Two of the four predicted failures **did not reproduce**, and the
guidance planned against them was cut rather than written:

- **Reproduced (A001).** Under deadline pressure with "don't research", the writer kept
  unverified exam facts in the body behind hedges — `omkring B2`, `på de fleste prøvesteder`,
  `i god tid` — and disclosed the uncertainty only in its report to the editor, never to the
  reader. This is the failure the skill is built around. It is *not* fabrication: the writer
  knew which claims were unverified and published them anyway, softened.
- **Reproduced (A002, A003).** The well-researched run still cited a language school for
  durations and allowed aids, from a page that 404'd on direct fetch, and presented its own
  arithmetic ("≈ 4 hours", "~10 weeks before") alongside sourced facts.
- **Did not reproduce (A007).** Given room, the control researched thoroughly (23 lookups),
  preferred official sources, flagged its own weakest claim, and omitted a figure where sources
  conflicted. No broad "you must research" guidance was written.
- **Did not reproduce (A006).** The da/en control re-authored rather than translated, held 6 H2s
  in the same order across both versions, glossed Danish examples on first use. The planned
  equivalence section was cut; only mechanical parity checks remain in the linter.

### GREEN / gate

- `node regression/run_checks.cjs --fixtures` → **9/9** cases as expected (1 positive,
  8 negative, one per enforced rule).
- Two self-inflicted defects were found by the fixtures and fixed, not worked around:
  A004 (suffix matching let `sprogskolen.kolding.dk` count as Kolding Kommune) and A005 (a
  readability floor failed clear prose at LIX 19/14).

### NOT measured

- **No native Danish reader has reviewed any output.** The register and grammar guidance in
  `danish-register.md` is unvalidated by a native speaker.
- **The LIX↔CEFR mapping is a project convention, not a finding.** LIX bands were defined for
  native readers; no validated mapping to CEFR levels exists. The per-level ceilings are the
  most likely thing here to be wrong.
- The linter cannot check whether a cited source actually supports its claim, nor whether the two
  language versions say the same thing in the same order. Both need a reader.
- The weekly scheduled run has not executed yet, so nothing is known about its behaviour
  unattended.
- Reviewer: none yet. Author is the proposer; a second reviewer is still required by
  `references/promotion-rule.md`.
