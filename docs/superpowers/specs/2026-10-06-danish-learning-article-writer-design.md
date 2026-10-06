# Design: `writing-danish-learning-articles` skill

Date: 2026-10-06
Status: approved (design); implementation pending
Branch: `skill/danish-learning-articles`

## Purpose

A skill that writes professional, SEO-friendly long-form articles about learning Danish —
exam preparation (Prøve i Dansk 3, Studieprøven), grammar explainers, study strategy,
language topics for people living in Denmark — as an hreflang-linked Danish + English pair
per topic. It also runs unattended on a weekly schedule, producing drafts as pull requests,
and improves itself through a findings ledger.

Not a game-content skill. Hand-offs: game data → `danish-grammar-qa`; spoken scripts →
`danish-native-speech-writer`; sjovtdansk.dk page copy and keyword targets → `danish-seo-writing`.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Output language | Danish + English pair per topic | Danish captures search volume where the readers are; English widens reach. hreflang-linked. |
| Output format | Markdown only | Portable; publishing (HTML, schema, sitemap) stays out of scope. |
| Research | Required for every verifiable factual claim | Readers act on exam facts they pay money for. |
| Install location | `.claude/skills/` in this repo (**not** user-level) | A scheduled cloud agent only sees skills committed to the repo. Still portable — nothing is sjovtdansk.dk-specific. |
| Cron autonomy | Draft + open a PR | The human merge is the review gate on factual claims. The cron never publishes. |
| Topic choice | Curated queue first, gap research as fallback | Never idles; fallback is bounded by an allowed-topic-domain list and tagged in front matter. |
| Architecture | Lean SKILL.md + 2 reference files | Keeps per-conversation load small; deep material read only when writing. |

## Structure

```
.claude/skills/writing-danish-learning-articles/
  SKILL.md                      # workflow, research gate, output contract, hand-offs
  article-recipe.md             # section order, front-matter schema, FAQ/heading patterns
  danish-register.md            # readability ceiling, register, learner-Danish traps
  references/promotion-rule.md  # when a finding may change the skill
  ledger/findings-ledger.md     # append-only findings
  regression/cases.json         # linter fixtures
  regression/run_checks.cjs     # markdown linter (the regression gate)
  CHANGELOG.md                  # version · date · ledger ids · files · regression result · reviewer
```

Content lives outside the skill:

```
content/blog/topic-queue.md             # curated queue (topic, da keyword, intent, priority)
content/blog/published-index.md         # what has been written, so runs never duplicate
content/blog/drafts/<date>-<slug>/da.md
content/blog/drafts/<date>-<slug>/en.md
```

## Workflow

1. **Settle topic + keyword.** Danish keyword first; the English keyword is chosen
   independently, never translated from the Danish one.
2. **Write the claim inventory before any prose.** Every checkable assertion the article
   will make: exam parts and durations, pass thresholds, fees, Danskuddannelse entitlement,
   deadlines, institution names.
3. **Verify each claim.** Source tiers:
   - Tier 1: the prøvebekendtgørelse on `retsinformation.dk` / `lovtidende.dk` (the legal text).
   - Tier 2: the responsible authority's own page; the kommune's own page for fees,
     self-payment and enrolment (e.g. `kk.dk`).
   - Tier 3: a named language school's exam page — usable for exam *mechanics* described in
     practical detail, never for fees, rules or dates.
   - Marketing pages and blogs are not sources.
   Record `source_url` + `accessed` date per claim.
4. **An unsourceable claim is cut, not softened.** It may not be rescued with `typisk`,
   `omkring`, `normalt`, `cirka`, `ofte`, `plejer at` or an English equivalent. Delete the
   sentence and, where it matters to the reader, say plainly that the figure varies and
   point to where it is published.
5. **Draft the Danish version** against `article-recipe.md` and `danish-register.md`.
6. **Derive the English version** under the equivalence contract below.
7. **Run `regression/run_checks.cjs`.** It must pass before the article is reported done.

## Output contract

Front matter, all fields required: `title`, `meta_description` (≤155 chars), `slug`, `lang`,
`hreflang_partner`, `target_keyword`, `secondary_keywords`, `reader_level` (A2|B1|B2),
`topic_source` (`queue`|`fallback-research`), `claims` (list of `{id, claim, source_url, accessed}`),
`lix` (measured), `status: draft`.

**da/en equivalence contract.** The English file is derived, not translated: identical `claims`
ids, identical H2 count and order, same search intent. Danish-local knowledge (kommune, SU,
CPR, Danskuddannelse tiers, `borger.dk`) must be *explained* in the English version, not
transliterated. A claim present in one file and absent from the other is a defect.

## Readability

LIX = `A/B + 100C/A` (A words, B sentences, C words over six letters); conventional bands:
<30 easy, 30–50 medium, >50 advanced, >60 very advanced
([Lix readability test](https://en.wikipedia.org/wiki/Lix_(readability_test))).

**LIX bands were defined for native readers. Mapping LIX to CEFR levels is not an established
finding.** The per-level target band is therefore a project convention, marked as such in
`danish-register.md`, and is a candidate for the ledger rather than a sourced rule. The linter
enforces it as a convention; it must not be presented to readers or in the skill as research.

## Self-improvement

Mirrors `danish-speech-shared` (do not invent a second mechanism):

- `ledger/findings-ledger.md` is append-only, with `scope` (sample-specific|candidate|generalizable)
  and `status` (open|adopted-pending-review|rejected|needs-native) columns.
- Ledger rows are written automatically. **Skill, reference and linter edits are proposals only.**
- A finding is generalizable only if ≥2 *independent* articles show the same root cause, or a
  cited authority states the rule.
- Max one promoted rule per review round; approved by a reviewer other than the proposer.
- Every promoted rule ships one positive and one negative regression case plus a CHANGELOG entry.
- **Never loosen a check so a new article passes.**

## Regression gate (`run_checks.cjs`)

Deterministic checks over produced markdown, not a quality judgement:

1. Front-matter schema complete; every field present and well-typed.
2. Every `claims` entry has a `source_url` and an `accessed` date; tier-3 domains rejected for
   fee/rule/date claims.
3. Banned hedges absent in any sentence containing a numeral.
4. da/en structural equivalence: same claim ids, same H2 count and order.
5. `target_keyword` present in title, meta description and first 100 words.
6. Measured LIX inside the band for `reader_level`.
7. `meta_description` ≤155 chars; `title` length within range.

## Cron

Weekly scheduled cloud agent, Mondays 06:00 Europe/Copenhagen, created via the `schedule` skill.
Per run: take the top unwritten `topic-queue.md` item; if the queue is empty, do gap research
bounded by the allowed-topic-domain list and tag `topic_source: fallback-research`. Write the
pair, run the linter, commit to a branch, open a PR whose body is the claim inventory with
sources plus the linter output. Refill proposals for the queue go in the PR, never straight
into `topic-queue.md`. The cron never merges and never touches `master`.

## Test plan (RED before GREEN, per `writing-skills`)

Baseline scenarios run without the skill, to confirm each failure is real before writing a rule
against it:

1. `Skriv en artikel om Prøve i Dansk 3` — expect confident unsourced exam specifics.
2. Same under time pressure ("don't research, one pass") — expect the gate skipped, or numbers
   hedged rather than cut.
3. da + en pair on en/et — expect literal translation and Danish-local context left unexplained.
4. Readability — expect C1 journalese rather than B1–B2 prose.

Then write the skill against the observed failures and re-run. The cut-don't-hedge rule gets
wording micro-tests (5+ reps against a no-guidance control), since it is the rule most exposed
to negotiation under deadline pressure.

## Changes after baseline testing (2026-10-06)

The RED phase contradicted parts of this design. Implementation follows the evidence; see
`CHANGELOG.md` 0.1.0 and ledger A001-A007.

- **Cut:** the da/en equivalence prose section (A006) and the broad research mandate (A007).
  Both predicted failures did not reproduce in the no-guidance control, so no guidance was
  written against them. Mechanical parity checks stay in the linter.
- **Narrowed:** the research rule now targets what reaches the reader under pressure, not
  whether the writer searches. The core rule is "the reader gets the same uncertainty the editor
  gets" — the observed failure was hedged publication of knowingly unverified facts, not
  fabrication.
- **Added:** `verified: fetched|search-extract|derived` per claim, with `fetched` plus an
  authority host required for fee/rule/date/deadline claims (A002); `kind: derived` with `from`
  for the writer's own arithmetic (A003).
- **Changed:** LIX is a **ceiling, not a band** — the two-sided band failed clear prose at LIX 19
  (da) and 14 (en), and English LIX runs structurally lower than Danish (A005).
- **Fixed:** authority hosts match exactly, never by suffix; `sprogskolen.kolding.dk` is a school
  on a kommune domain, not the kommune (A004).

## Out of scope

HTML generation, `sitemap.xml`, canonical/hreflang tags, JSON-LD, image creation, publishing
to `master`, and any edit to game data or page copy.
