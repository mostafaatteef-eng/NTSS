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

-38/38 existing and added Node tests pass, zero skips. Four focused content tests and three release-scope tests were added, with no test removed or weakened. The existing security-regression workflow now includes both new test files in its explicit command; its permissions and other steps are unchanged.
-All603 activities still exist:595 graded banks of50 plus8 ungraded projects.
-Exactly two of the87 Business English/social banks have changed generated output. The other85 are byte-equivalent to091. All87 preserve item counts, order, mode and answer-key structure.
-The generator and UI code are unchanged. Physics, mathematics, other subjects and the math pilot are untouched.
-Before/after browser samples at390px and1280px for both lessons. The framework advanced setup questions; the target used its real answer control and Check/Enter. Business read and social False were accepted. No page errors, CSP violations or horizontal overflow in these samples. All four paired screenshots visually inspected.

## Release boundary

The content changes remain exactly those two definitions. Local release preparation changes only their curriculum URL versions, the lazy-loader URL in index.html, and test/CI coverage. The service worker, cache namespace, runtime release suffix and every other module URL stay unchanged. No push, PR, remote CI run, merge or deployment has occurred.

A same-origin browser was genuinely warmed against extracted091, including fonts and the relevant curricula, before the server changed to this candidate. An ordinary reload replaced only cached index.html in place, preserved all58 prior cache entries, and added exactly three new entries: loader, BE curriculum and social curriculum. Server logs showed only HTML plus those three upgrade requests. Math was revisited without refetch. Both corrected definitions survived offline reload; no page errors or CSP violations. This is local migration evidence, not production verification.

The reproducible script is scripts/content-clarity-cache-qa.mjs. Set NTSS_CLARITY_BASE_ROOT to an extracted091 tree before running it; the script validates five baseline asset hashes and fails if that source is wrong. Artifacts default to qa-artifacts/content-clarity-cache or NTSS_CLARITY_ARTIFACTS. Its result is independent of the release-scope unit tests.

Local CI-equivalent checks passed: six assessment structural/grader/performance/certificate/catalog/data-analysis scripts; responsive assessment in Chromium, Firefox and WebKit; actual strict-CSP SQL2/2 and Python3/3;24 bilingual lab cases;112 cross-subject UI cases and all17 data-analysis completions;112 certificate-name cases; browser smoke;20 Chromium learning/device cases. The initial aggregate Chromium run hit the command time limit during the certificate matrix, which was then completed separately. No interrupted matrix was counted as a pass.

The learning WebKit offline-reload check still fails with the same inherited internal engine error at learning-browser-qa.cjs143:24. It was rerun, not skipped or weakened. This candidate does not claim to fix it. Remote CI and a distinct approved push/merge remain required before publication; the final reviewed head must be preserved.

## Separate decisions

- Math89ae198 is not part of this branch. It introduces signed fractions, tan2θ and actual integration. The user must choose between preserving the previous narrow difficulty and reviewing richer lesson-aligned tasks. Cosmetic variants cannot honestly be called50new exercises.
- Refraction input range/units need a scoped review of arithmetic difficulty before changing them. Light and measurement need the intended quantities. No speculative physics changes here.
- The slowdown report remains unresolved pending the user's exact stage/device. These clarity edits are not a claimed performance fix.
