---
name: writing-danish-learning-articles
description: Use when writing or revising a long-form article, blog post or guide about learning Danish — exam preparation (Prøve i Dansk 3, PD3, Studieprøven, danskprøve), grammar explainers, study strategy, or language topics for people living in Denmark — in Danish, English or both. Triggers on "skriv en artikel om dansk", "blogindlæg", "blog post about Danish", "PD3 guide", or a topic plus a request for SEO-friendly article copy. Not for grammar-game data (use danish-grammar-qa), spoken scripts (use danish-native-speech-writer) or sjovtdansk.dk page copy (use danish-seo-writing).
---

# Writing Danish learning articles

Version 0.1.0 (see `CHANGELOG.md`). One topic produces **two** markdown articles, Danish and
English, as a pair. Markdown only: this skill never writes HTML, JSON-LD or sitemap entries, and
never publishes.

## The rule that matters

Baseline runs without this skill showed that research is not the weak point — given room, agents
look things up thoroughly and flag their own weak sources. The failure appears when something
pushes back: a deadline, "just write it from what you know", a scheduled run that wants to
finish. What breaks then is not the research. It is the article's honesty. The unverified figure
stays in the body wearing a hedge, and the uncertainty gets reported to the editor instead of to
the reader.

**The reader gets the same uncertainty the editor gets.**

A claim you could not source is **cut from the article**, not softened. These are not available
as rescues: `typisk`, `omkring`, `normalt`, `cirka`, `ca.`, `ofte`, `plejer at`, `som regel`,
`nogenlunde`, `vel`, `måske`, `næsten`, and `typically`, `usually`, `roughly`, `approximately`,
`around`, `generally`, `often`, `tends to`, `nearly`.

When the figure matters to the reader, name where it is published instead of approximating it.
"Prøvegebyret fastsættes af din kommune — se din kommunes side om danskprøver" is useful to a
reader. "Prøven koster omkring 1.600 kr." is a guess in a suit, and it is the sentence someone
budgets against.

## Workflow

1. **Keyword.** Danish target keyword first. The English keyword is chosen for English search,
   never translated from the Danish one.
2. **Claim inventory before any prose.** List every checkable assertion the article will make:
   exam parts, durations, aids allowed, grading, pass thresholds, fees, entitlement, dates,
   deadlines.
3. **Verify each claim, and record how.** Source tiers:
   - Tier 1 — the prøvebekendtgørelse on `retsinformation.dk` / `lovtidende.dk`.
   - Tier 2 — the responsible authority (`uvm.dk`, `iu.dk`, `nyidanmark.dk`, `borger.dk`), or
     the kommune's own site for fees, enrolment and self-payment.
   - Tier 3 — a named language school's exam page. Usable for exam *mechanics* described in
     practical detail. Never for a fee, a rule, a date or a deadline.
   Marketing pages and blogs are not sources. Note that a school is often hosted on a kommune
   domain (`sprogskolen.kolding.dk` is a school, not Kolding Kommune).
4. **A page you could not load is not a source you have read.** Record `verified: fetched` only
   when you retrieved the page. If you have it only from a search snippet, that is
   `verified: search-extract`, and it may not carry a fee, rule, date or deadline claim.
5. **Your own arithmetic is a claim.** A total you computed (25 + 65 + 150 = 240 minutes) is
   `kind: derived`, listing in `from` the claim ids it was computed from.
6. **Scope what is scoped.** A kommune-set fee, a refund rule or a year's exam dates get their
   scope in the sentence itself: which kommune, which year.
7. **Sources that disagree: omit the figure** and say it varies. Do not average them, and do not
   pick the one that reads best.
8. **Draft the Danish version** against [article-recipe.md](article-recipe.md) and
   [danish-register.md](danish-register.md).
9. **Derive the English version.** Not a translation: same claims, same structure, re-authored
   in English, with Danish-local context (kommune, SU, CPR, Danskuddannelse tiers) explained
   rather than transliterated.
10. **Gate:** `node regression/run_checks.cjs <draftDir>` must pass. Then append a row to
    `content/blog/published-index.md`.

## Red flags — stop

- "I'll hedge it and flag it for the editor" — the reader never sees your flag.
- "The deadline doesn't allow research" — then the article ships without that claim.
- "This is common knowledge" — pass thresholds and fees are what readers act on.
- "The search snippet is enough" — it is `search-extract`, and not for fees, rules or dates.
- "My arithmetic isn't really a claim" — it is `kind: derived`.
- "The LIX ceiling is too strict here" — rewrite the prose. Never raise the ceiling.

## Rationalizations

| Excuse | Reality |
|---|---|
| "I hedged it, so I'm not asserting it" | A hedge next to a number reads as a figure, not as doubt. `run_checks.cjs` fails it. |
| "I disclosed the uncertainty in my report" | The report goes to one person. The article goes to the reader who books the exam. |
| "Omitting it leaves a gap" | Naming where the figure is published fills the gap better than an approximation. |
| "The school's page is more detailed than the ministry's" | Fine for mechanics. Never for fees, rules or dates. |
| "Two sources roughly agree" | Roughly is not a figure. Cite one you loaded, or omit. |
| "It passed last time" | Checks are not evidence of correctness; they are a floor. |
| "I'll fix the check instead" | Never loosen a check so an article passes (`references/promotion-rule.md`, rule 7). |

## Hand-offs

Game data → `danish-grammar-qa`. Spoken scripts and TTS → `danish-native-speech-writer`.
sjovtdansk.dk page copy, titles and keyword targets → `danish-seo-writing`. Structured data →
`schema`.

## Self-improvement

Findings go to `ledger/findings-ledger.md` as rows, automatically. Changes to this skill, the
reference files or the linter are **proposals**: generalizable only with ≥2 independent articles
showing the same root cause or a cited authority, one promoted rule per round, approved by a
reviewer other than the proposer, shipping one positive and one negative regression case. Full
rule: [references/promotion-rule.md](references/promotion-rule.md).
