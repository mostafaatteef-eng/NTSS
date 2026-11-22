# Content clarity review, local only

Base: frozen091f0ed. Branch: fix/content-clarity-review-2026-11-22.
This is separate from the math-diversity pilot and the deployed PR18. No upload, PR, merge, deployment or release claim.

## Two wording edits

1. Business English, Year1 unit0 lesson2, Describing the Past. The term remains read. Its definition now identifies the past tense, the pronunciation /red/ and a yesterday/book sentence with a blank. The lesson still teaches simple past and recounting events. This is a written cue, not a new speech/audio feature.
2. Social studies, Year2 unit0 lesson2, مناخ مصر والأقاليم المناخية. Only the rainfall definition changes, to قطرات ماء سائل تسقط من السحب. The previous broad definition also described other climate elements. Narrowing it makes the temperature/rainfall mismatch in student question19 plainly false. Its false answer key is unchanged. The corresponding true rainfall questions remain true. No heat/air-temperature definition is guessed.

## Evidence and limits

- Cambridge, read on22Nov2026: https://dictionary.cambridge.org/us/dictionary/english/read . Supports identical spelling for present and past, with the past pronounced /red/. The practice wording is original, not a copied dictionary example.
- UK Met Office, Rain, read on22Nov2026: https://weather.metoffice.gov.uk/learn-about/weather/types-of-weather/rain . Supports rain as liquid water droplets falling from clouds. The short Arabic definition is our paraphrase. It does not promise that every droplet reaches the ground.
- These sources establish the facts, not alignment to an exact Egyptian textbook page. Teacher review remains appropriate before formal assessment.

## Verification

-35/35 existing and added Node tests pass, zero skips. Four focused tests added, no test removed or weakened.
-All603 activities still exist:595 graded banks of50 plus8 ungraded projects.
-Exactly two of the87 Business English/social banks have changed generated output. The other85 are byte-equivalent to091. All87 preserve item counts, order, mode and answer-key structure.
-The generator and UI code are unchanged. Physics, mathematics, other subjects and the math pilot are untouched.
-Before/after browser samples at390px and1280px for both lessons. The framework advanced setup questions; the target used its real answer control and Check/Enter. Business read and social False were accepted. No page errors, CSP violations or horizontal overflow in these samples. All four paired screenshots visually inspected.

## Release boundary

This is a review candidate, not ready to claim live. Cache/asset release preparation is intentionally absent. If approved for publication, prepare narrowly versioned changed assets, recheck cache migration and run CI before a distinct push/merge approval. Avoid a broad cache purge merely for two data edits while the user's slowdown report is still being localized.

## Separate decisions

- Math89ae198 is not part of this branch. It introduces signed fractions, tan2θ and actual integration. The user must choose between preserving the previous narrow difficulty and reviewing richer lesson-aligned tasks. Cosmetic variants cannot honestly be called50new exercises.
- Refraction input range/units need a scoped review of arithmetic difficulty before changing them. Light and measurement need the intended quantities. No speculative physics changes here.
- The slowdown report remains unresolved pending the user's exact stage/device. These clarity edits are not a claimed performance fix.
