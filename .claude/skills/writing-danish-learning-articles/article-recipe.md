# Article recipe

## Front matter (both files, every field required)

```yaml
---
title: "En eller et: sådan vælger du den rigtige artikel"   # 25-65 chars, contains target_keyword
meta_description: "Er det en eller et? Lær de mønstre ..."  # <=155 chars, contains target_keyword
slug: en-eller-et                      # da and en must differ
lang: da                               # da | en
hreflang_partner: en                   # "en" in da.md, "da" in en.md
target_keyword: "en eller et"
secondary_keywords: ["køn på navneord", "fælleskøn"]
reader_level: B1                        # A2 | B1 | B2
topic_source: queue                     # queue | fallback-research
lix: 19                                 # measured, not estimated (run_checks.cjs recomputes)
status: draft                           # the skill never publishes
claims:
  - id: C1
    kind: other                         # mechanics|fee|rule|date|deadline|statistic|derived|other
    claim: "Danske navneord har to køn."
    source_url: "https://sproget.dk/..."
    accessed: 2026-10-06
    verified: fetched                   # fetched | search-extract | derived
  - id: C2
    kind: derived
    claim: "Den skriftlige prøvedag varer i alt fire timer."
    source_url: "https://www.kk.dk/..."
    accessed: 2026-10-06
    verified: derived
    from: [C1]                          # required for kind: derived
---
```

The claim ids must be identical in both language versions. A claim in one and not the other is a
defect, not an editorial choice.

## Section order

1. **H1** — the question as asked, containing the target keyword.
2. **Answer first.** The question is resolved inside the first 60 words. No scene-setting, no
   "Danish is a beautiful language", no restating the title as a problem. A reader who leaves
   after one paragraph should still have the answer.
3. **Why it matters** — the consequence of getting it wrong, concretely. One short section.
4. **The usable rule** — the highest-leverage thing first. For grammar, the rule that covers the
   most cases (compounds inherit from the final element) before the exception lists.
5. **Worked examples** — every grammar claim is followed by an example the reader can test.
   Danish examples stay in Danish; in the English version, gloss each one in parentheses on
   first use only.
6. **What to do about it** — practice, not theory. Specific enough to start today.
7. **FAQ** — three to five questions phrased the way people actually search, each answered in
   one or two sentences. Draw them from real query variants, not invented ones.
8. **Next step** — one link or one action. Not a list of everything on the site.

## Headings

- Phrase every H2 as the searcher's question or the thing they want: "Hvor skal ikke stå?",
  not "Adverbialplacering".
- H2 count and order match across the two language versions (the linter checks the count; the
  order is a reader's job).
- No heading over ~60 characters. No heading that only makes sense after reading the one before.

## Exam-topic specifics

- State what the reader must *do*, before what the exam *is*.
- Separate the parts: what is tested, how long, what aids are allowed, how it is graded. Readers
  skim for exactly one of these.
- Every fee, date, deadline and refund rule carries its scope in the sentence: which kommune,
  which year. These are the claims most likely to be stale when the article is read.
- Never imply a pass threshold, a fee or a date that is not in `claims` with
  `verified: fetched`.

## Length

900-1400 words of body prose. Shorter is fine if the question is small — padding a thin topic to
hit a number is how you get the scene-setting opening this recipe forbids.
