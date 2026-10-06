# VERIFY US-006 - Adverbier Danish TTS (verifier V-ADV)

Method: puppeteer-core/Edge with `window.speechSynthesis` replaced by a spy (records text and lang; scenarios: fake da-DK voice, en-US-only voice, empty voice list) and `SpeechSynthesisUtterance` stubbed. No real audio heard.

| Criterion | Result | Evidence |
|---|---|---|
| The game loads `../shared/dansk-core.js` (and `DanskSpeech`) and uses `DanskCore.tts` / `DanskCore.ui.ttsButton` with `da-DK`. | PASS | `adverbs.html:356-357` loads `shared/dansk-speech.js` then `shared/dansk-core.js` (root-level paths), the same order as the other games; no data script needed. Core sets `lang='da-DK'`; core untouched. |
| A replay button appears on every Danish prompt and in the wrong-answer feedback, at least 44x44, with a Danish aria-label. | PASS | Meaning, Gap, Category, Connector, Listening: exactly one `.dc-tts-button` (class used) in `#content`, 44x44, aria-label "Afspil igen". Translate/Ordstilling have no Danish prompt before answering; the button is in their feedback. Wrong-answer feedback in all 7 modes: 44x44 button, click speaks the Danish sentence. |
| "Lyt og vælg" speaks the sentence with the target word, does not show the answer word before the user answers, and can be replayed. | PASS | With da voice the full sentence is spoken once on render (after a user click) and again on replay. Visible text is only "Lyt til sætningen. Hvilket af ordene hører du?" + button. Distractors never occur in the sentence (10 entries x 60 builds). |
| `speechSynthesis.speak` is called with `lang:"da-DK"` (spy test). | PASS | Every recorded call has `lang: "da-DK"`. |
| TTS is only triggered by the user or by an explicit listening prompt (no surprise autoplay). | PASS | 0 speak calls after load; listening autoplay gated on user interaction. |

Further results
- Spoken text never reveals the answer: Gap and Connector audio for "endnu" = `Jeg har ikke set filmen,.` (blank dropped); no leak in 10 entries.
- Cosmetic: stray ",." and a missing word in the gap audio; audible quality unverified.
- No Danish voice (en-US only): Lyt og vælg falls back to "Der er ingen dansk stemme på denne enhed. Vælg det ord, der mangler: Jeg har ikke set filmen ______." (blanked, no leak); the replay button is dimmed, labelled "Afspil igen (ingen dansk stemme fundet på denne enhed)", and a click is silent. Empty voice list (not loaded yet): treated as available and speaks.
- 360 px screenshot of wrong feedback: no overflow. Zero console errors. Only `.tts-row` CSS added; no core change.

Not verified: listening with a real Danish voice (U-05), audible quality of gap audio, wording of the Lyt og vælg prompt (native).

Verification: VERIFIED (all 5 criteria PASS by spy test; real-voice listening check U-05 and native wording review remain open outside the criteria)
