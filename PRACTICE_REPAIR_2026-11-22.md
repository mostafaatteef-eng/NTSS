# Practice progression and interface repair

## Scope

- Fix Data Analysis progression after question 10 across all 17 lessons.
- Make shared practice controls, question counters, stage labels, catalog actions and return navigation follow the selected Arabic/English interface language.
- Keep language switching available inside focused practice, including completion screens.
- Preserve AI's rich lesson stages, labs, existing questions, question languages and certificate rules.

## Progression cause and repair

The adaptive engine previously assumed every question referenced one of ten skills. Data Analysis defines more than ten concepts, and numerical items also used out-of-range IDs. Reordering the next sprint indexed missing skill records and threw an exception.

Valid additional concept IDs now have separate evidence records. Data Analysis concepts carry their source question as a descriptive label. Numerical variations share the relevant calculation skill; Excel mean and range stay separate. Invalid metadata cannot break grading: those items retain their positions during adaptation and do not create invented skill evidence. No questions are discarded and no adaptive tests are disabled.

Checkpoint item IDs and scoring rules remain unchanged. The new regression checks completion and save/resume with correct and incorrect responses, distinct skill evidence, malformed metadata and HTML escaping of labels.

## Interface boundaries

The selected interface language governs shared controls. Questions, answer choices, passages, original curriculum titles, source notes, specialist instructions and the original certificate artwork are not machine-translated. Their text is preserved, with automatic text direction where appropriate. AI's five rich pedagogical stages and the other subjects' five question sprints remain different by design. This repair does not pretend they have identical instructional content.

Business English projects remain ungraded participation activities. The 70% eligibility threshold for assessed completion certificates is unchanged. Names remain local to the session.

## Regression checks

- `node scripts/data-analysis-qa.mjs`: source coverage plus 34 full completion cases, 1,700 graded responses and 34 checkpoint restores across all 17 lessons.
- `node scripts/practice-ui-browser-qa.mjs`: 112 representative subject/year, interface-language and viewport cases; all 17 Data Analysis lessons completed with the actual Check/Next buttons; source titles and progress preserved through language switches.
- Existing assessment browser QA runs the new browser regression on Chromium. Existing data-analysis QA runs the new progression regression, so the fixes are covered in the existing CI pipeline without a workflow change.
- Existing bank, certificate, security, source-validation, runtime and lab-integration checks remain in place.

Screenshots from the browser regression are written under `qa-artifacts/practice-repair`. They are local review evidence, not a deployed preview. Real iPhone/Safari hardware and the previously known WebKit offline issue are outside this repair's verified coverage.
