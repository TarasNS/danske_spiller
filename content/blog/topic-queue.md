# Topic queue

The weekly run takes the **top item with `status: todo`** and writes it. When no `todo` item
remains, the run does bounded gap research instead, tags the article
`topic_source: fallback-research`, and proposes new rows **in the pull request** — never by
editing this file itself.

Allowed topic domains (bounds the fallback research; anything outside needs a human to add it
here):

- Danish exams and certification: Prøve i Dansk 1/2/3, Studieprøven, IELTS-equivalence questions
- Danskuddannelse: tiers, entitlement, enrolment, moving between modules
- Danish grammar for learners: gender, word order, tenses, pronouns, prepositions, conjunctions
- Pronunciation and listening for learners
- Vocabulary building and study strategy
- Using Danish in practice: work, kommune, healthcare, study, everyday situations

Not allowed without human approval: immigration and citizenship law, visa advice, tax, legal or
financial guidance, anything requiring a professional qualification to answer.

| priority | topic | da target keyword | en target keyword | reader_level | intent | status |
|---|---|---|---|---|---|---|
| 1 | What Prøve i Dansk 3 consists of, part by part | prøve i dansk 3 | prøve i dansk 3 exam | B1 | informational | todo |
| 2 | How to prepare for the written composition (skriftlig fremstilling) | skriftlig fremstilling pd3 | danish written exam preparation | B2 | informational | todo |
| 3 | en or et: how to decide, and what actually predicts gender | en eller et | danish en or et | B1 | informational | todo |
| 4 | Danish word order: why the verb comes second | ordstilling dansk | danish word order v2 | B1 | informational | todo |
| 5 | Where to put "ikke" in a Danish sentence | ikke placering dansk | danish negation ikke | A2 | informational | todo |
