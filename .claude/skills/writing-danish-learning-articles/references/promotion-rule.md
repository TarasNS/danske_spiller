# Promotion rule: when may a finding change this skill?

First question: **is this a reusable rule about writing Danish learning articles, or a defect in
one article?**

A finding is **generalizable** only if (a) ≥2 *independent* articles show the same root cause
(different topics and different runs — the same topic rewritten counts once, and two paragraphs
of one article count once), **or** (b) a cited authority states the rule (one instance suffices).

Otherwise it is **article-specific**: log it, add a regression case tagged `known-case`, and do
**not** edit `SKILL.md`, a reference file or `run_checks.cjs`.

## Loop: Write → Check → Diagnose → Correct → Re-test → Learn

1. **Check** by an agent other than the one that wrote the article.
2. **Diagnose**: write a ledger row first. The default hypothesis is a research or drafting
   error in this article, not a gap in the skill.
3. **Correct** the article. Max 3 attempts per failing item, each with a different hypothesis;
   then report Blocked with the last evidence.
4. **Re-test**: `node regression/run_checks.cjs` over the fixture corpus must show zero
   regressions. Readability and register rows that need a native reader are never auto-passed.
5. **Learn**: only ledger rows are written automatically. Edits to `SKILL.md`, the reference
   files or the linter are *proposals*, applied only if generalizable **and** approved by a
   reviewer other than the proposer (Opus-class or the user). Max one promoted rule per review
   round. Any claim about what Danish learners find readable, and any LIX↔CEFR claim, needs a
   native reader or a cited source — LIX bands were defined for native readers and the
   per-level band in `danish-register.md` is a project convention, not a finding.
6. Every promoted rule ships with one positive and one negative regression case plus a
   CHANGELOG entry.
7. **Never loosen a check so a new article passes.** In particular: never widen a LIX band,
   never remove a banned hedge, and never downgrade a claim's required source tier to make
   `run_checks.cjs` go green. A failing check means the article is wrong, until a second
   independent article plus a reviewer says the check is.
8. Candidates without a second independent instance after 3 review rounds are closed as
   article-specific.
