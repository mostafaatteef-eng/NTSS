# Scoped math diversity release candidate
Originally reviewed as pilot89ae198 atop091f0ed. Release branch fix/math-diversity-release-2026-11-22 is based on deployed PR19 merge682351c. The user approved the disclosed expanded level and before/after samples on22Nov2026 at22:00Cairo. No remote publication has yet occurred from this local candidate.

Replace only three banks currently at 3 unique full items each:
- Year2 unit1 lesson1: Solving Trigonometric Equations. Ten sine/cosine equations at unit-circle values, each exercised through solution identification, smallest/largest solution, number of solutions and rejecting a non-solution. Explicit half-open degree interval. Remains introductory, no quadratic equations or calculator inverses.
- Year2 unit1 lesson6: Double an Angle. Fifty direct sin2/cos2/tan2 identity applications with five Pythagorean triples and signed inputs. No half-angle or inverse equations. Rational inputs are a modest difficulty variation from the prior fixed decimal pair, to be reviewed.
- Year3 unit2 lesson1: Integration of Trigonometric Functions. Five basic sine/cosine definite-integral families with ten coefficients each, radians explicit. No substitution, products or integration by parts. Replaces the derivative-at-zero check with actual elementary integration appropriate to the lesson title.

All retain 50 items and generated-practice disclosure. Distinct combinations are not a claim of fifty independently authored textbook questions. Original source text, exercises and examples are not copied. Formula facts verified against OpenStax sections listed in source ledger. Independent tests check each answer and exactly-one-correct distractors, numeric quadrature for integrals, all unaffected math banks unchanged, and full bank-count regression. Other repetitive banks are untouched and remain work.

## Verification
- `node --test *tests.cjs`: 36/36 pass, zero skips, including five added pilot tests.
- `node scripts/all-lessons-qa.mjs`: 603 activities, 595 graded banks of 50, eight ungraded projects.
- 150 pilot answers checked against independent unit-circle/trig evaluation or numerical quadrature, as applicable.
- Golden hashes from the frozen091 generator verify all other 73 mathematics banks are unchanged.
- Browser samples at 1280px and 390px: actual numeric input/check accepted a correct answer in each pilot bank; baseline comparison uses the same lesson/cursor/student/viewport. Baseline trig recall used actual Enter submission before Check. No page errors, CSP violations, or horizontal overflow in these samples.
- Full before/after evidence is supporting material, not production evidence.

## Release preparation and final-source verification

Teaching output remains byte-identical to reviewed pilot89ae198: only the three listed banks change. Other73math banks remain byte-equivalent to091. The two definitions published in PR19 and all other runtime JavaScript remain unchanged. Math numeric inputs receive one targeted CSS direction rule so signed answers display with a leading minus in the Arabic UI; this is not a shared framework change.

Only the math-practice URL and the lazy-loader URL gain a math1 version. Service worker and cache namespace remain unchanged. Existing security-regression CI now runs math-diversity-tests and math-release-tests as well as every prior test. Prior release-scope assertions were extended for the explicit math version and numeric-direction rule, with strict hashes still guarding every other HTML/loader difference. No security checks, permissions or jobs were removed.

-46/46 tests pass with zero skips, including five math-content oracle tests and three math-release tests. All six structural, grader, performance, certificate-coverage, catalog and data-analysis scripts pass.603activities remain595graded banks of50plus8projects.
-All150pilot answers checked independently, including numeric quadrature and exactly-one-correct distractors. All three banks have50distinct question strings. This is parameterized practice, not50independently authored questions or a solution to repetition elsewhere.
-16real-input/control browser cases at390/1280cover equation choice/rejection/negative RHS, signed double-angle/tangent and first/irrational/final integrals. Answers accepted, zero page/CSP errors or horizontal overflow. Targeted negative-input screenshots visually inspected after correcting RTL sign placement. Setup questions advanced through framework calls.
-Responsive assessment passed Chromium, Firefox and WebKit at four sizes; Chromium live workers passed.112cross-subject UI cases and17data-analysis completions passed.112certificate-name cases passed separately after the aggregate invocation timed out during that matrix; timeout was not counted as a pass.
-Actual strict-CSP SQL2/2andPython3/3, independent lab/challenge drafts, overwrite confirmation and real print dispatch pass.
-Warmed PR19same-origin cache upgrade preserves all58prior entries. Only index.html is replaced; exactly2new entries are added, loader and math-practice. Server receives onlyHTMLplus those2requests. No unchanged BE/social/math-curriculum refetch. New math questions and both published definitions persist offline; zero page/CSP errors.
-Previously disclosed learning-WebKit offline internal engine failure remains unresolved. Responsive-WebKit success is not a claim that its offline test is fixed. Actual remote CI and live release verification remain pending.

Reproducible scripts: scripts/math-release-browser-qa.mjs (NTSS_MATH_ARTIFACTS; optional NTSS_MATH_BASE_URL), scripts/math-release-cache-qa.mjs (requires NTSS_MATH_BASE_ROOT set to extracted PR19source). Cache script validates the baseline before use.

## Formula sources, read 2026-11-22
- OpenStax Precalculus 2e, 7.5 Solving Trigonometric Equations: https://openstax.org/books/precalculus-2e/pages/7-5-solving-trigonometric-equations
- OpenStax Precalculus 2e, 7.3 Double-Angle, Half-Angle, and Reduction Formulas: https://openstax.org/books/precalculus-2e/pages/7-3-double-angle-half-angle-and-reduction-formulas
- OpenStax Calculus Volume 1, Table of Integrals: https://openstax.org/books/calculus-volume-1/pages/a-table-of-integrals
Sources verify standard formula facts. Question wording, parameter choices and checks here are original, not copied textbook exercises.
