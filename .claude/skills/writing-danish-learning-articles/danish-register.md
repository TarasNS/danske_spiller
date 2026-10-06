# Danish register and readability for learner-facing articles

## The readability ceiling

LIX = `A/B + 100C/A`, where A is words, B is sentences and C is words longer than six letters.
Conventional bands: under 30 easy, 30-50 medium, over 50 advanced
([Lix readability test](https://en.wikipedia.org/wiki/Lix_(readability_test))).

Ceilings used by `regression/run_checks.cjs`:

| reader_level | LIX ceiling |
|---|---|
| A2 | 32 |
| B1 | 38 |
| B2 | 45 |

**These ceilings are a project convention, not a research finding.** LIX bands were defined for
native readers, and there is no validated LIX↔CEFR mapping. Do not present the mapping to a
reader, or in this skill, as established. It is a candidate for the ledger, and it is the one
number here most likely to be wrong.

There is **no floor**. An article that reads more easily than its level requires is not a defect.
English LIX also runs structurally lower than Danish for the same content, because English words
are shorter — do not "correct" an easy English version upward.

## How to come down under the ceiling

Both terms of LIX are things you control sentence by sentence.

- **One idea per sentence.** The fastest way down is a full stop where a comma was.
- **Cut nominalisations.** `genustilhørsforholdet manifesterer sig kongruensmæssigt` → `kønnet
  smitter`. Nominalisation inflates both long words and sentence length at once.
- **Prefer the short synonym** when it is the word a learner already owns: `bruge` over
  `anvende`, `vise` over `demonstrere`, `fordi` over `eftersom`, `men` over `imidlertid`.
- **A loanword can beat a purist Danish word.** `en pause` is easier than `et ophold` for most
  learners; `teste` is easier than `afprøve`. Readability for this reader wins over register
  purism.
- **Avoid stacked subordinate clauses.** Two levels is a lot; three is a rewrite.
- **Verbs over passives.** `prøven bedømmes af to censorer` → `to censorer bedømmer prøven`.

## Register

- Address the reader as `du`, throughout, in both languages. Not `man`, not `De`.
- `man` is fine for a general statement about Danish, never as a substitute for `du` in advice.
- Write as a teacher who respects the reader: direct, concrete, no cheerleading. No "Det er
  faktisk ret nemt!" about something that is not easy — a learner who finds it hard then
  concludes the problem is them.
- Imperatives for practice steps: `Skriv ordet ned.` `Læs listen højt.`
- Exam topics are the one place to raise formality slightly: use the exam's own terms
  (`skriftlig fremstilling`, `læseforståelse`, `prøvetermin`) and gloss each on first use, since
  the reader will meet these words on the official pages.

## Traps that make learner-facing Danish read wrong

- **Grammar terms unglossed.** `intetkøn` and `fælleskøn` need a gloss on first use; so do
  `bestemt`/`ubestemt form`.
- **Examples that need the rule to parse.** An example must be testable by a reader who has not
  yet understood the rule.
- **Mixed-gender example sets.** When illustrating one gender, do not quietly include the other.
- **Over-explaining the exception.** The exception list is the end of a section, never its
  middle; the usable rule has to land first.
- **English syntax in Danish.** Watch V2: `Derfor du skal øve` → `Derfor skal du øve`. And
  adverb placement: `Jeg har ikke set det` not `Jeg har set det ikke`.
- **Danish syntax in English.** In the English version, V2 inversion and `ikke`-placement must
  not survive the re-authoring.

## What this file does not cover

Whether the Danish actually sounds native when read aloud — that is
`danish-native-speech-writer`. Whether a grammar claim is correct — that is a native reader's
job, and `danish-grammar-qa` for game data.
