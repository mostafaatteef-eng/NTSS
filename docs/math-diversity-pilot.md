# Scoped math diversity pilot, review only
Base: frozen091f0ed. Separate branch fix/math-diversity-pilot-2026-11-22. No publishing or merging.

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

## Release status
Local review candidate only. No PR, push, merge, deployment, service-worker version bump or claim that the general repetition problem is solved. A release needs a separate review and cache/version update. The signed-input fractions and actual integration tasks improve lesson relevance but change the previous narrow difficulty profile. Review them, rather than treating distinctness alone as approval.

## Formula sources, read 2026-11-22
- OpenStax Precalculus 2e, 7.5 Solving Trigonometric Equations: https://openstax.org/books/precalculus-2e/pages/7-5-solving-trigonometric-equations
- OpenStax Precalculus 2e, 7.3 Double-Angle, Half-Angle, and Reduction Formulas: https://openstax.org/books/precalculus-2e/pages/7-3-double-angle-half-angle-and-reduction-formulas
- OpenStax Calculus Volume 1, Table of Integrals: https://openstax.org/books/calculus-volume-1/pages/a-table-of-integrals
Sources verify standard formula facts. Question wording, parameter choices and checks here are original, not copied textbook exercises.
