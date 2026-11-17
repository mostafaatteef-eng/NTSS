# EBDA NTSS — Learning Experience Improvements

Release: 2026-11-17. Implementation in the GitHub Pages front-end, without a student-account backend.

## 1. Adaptive learning
- The AI/Data Analysis question workshop keeps 50 assessed questions in five blocks of ten.
- After questions 10, 20, 30, and 40, the **next unanswered block only** is reordered by the existing skill-mastery estimator. Previously graded questions and the remaining blocks are unchanged.
- Across the other subject engines, first attempts feed optional, nonintrusive review suggestions after repeated errors. Their core question order and formal grading logic are not changed.
- Adaptation is **formative support**, not a validated psychometric adaptive test or a machine-learning-based proficiency model.

## 2. Smart mistake review
- All ten question engines record the first assessed attempt only, per session in memory.
- Wrong answers expose available question explanations using a 3-step review: identify the concept, study the explanation, articulate reasoning before continuing.
- The existing AI workshop retains its more detailed step-by-step related-question review.
- No extra learning-task score is added to the lesson assessment. Session evidence is discarded on lesson reset/reload.

## 3. Interactive concept visualizer and visual learning
- Synthetic models for Ohm's law, motion, averages, linear functions, demand, data thresholds, Python loop tracing, SQL INNER JOINs and KNN nearest-neighbor classification.
- Accurate annotated Arabic nominal/verbal sentences and Kana/Inna structures, plus English past perfect examples.
- Models are shown only for matching lesson titles and are explicitly illustrative, not substitutes for teacher-reviewed curricular content.
- Sliders update computed values without replacing the slider element on every movement.

## 4. Focus-first question design
- Legacy XP ribbons and duplicate progress meters are visually suppressed, while the primary 50-question count and five-stage progress remain.
- Extra practice games, lab shortcuts, visualizations and explanations are grouped into one collapsed 'Learning tools (optional)' drawer.
- The drawer is keyboard-accessible via native details/summary and preserves its expanded state across per-question rerenders.
- Original question/answer grading, English NTSS certificate design and logo remain unchanged.

## 5. Testing and current limits
- learning-improvements-tests.cjs contains five dependency-free regression tests: syntax and engine integration, local first-attempt evidence, computed visual examples, adaptive block invariants, and asset wiring.
- The tests were replicated in a JavaScript-based verification harness and all five passed on the committed source.
- The GitHub Actions security-regression workflow includes these tests and should be inspected at https://github.com/mostafaatteef-eng/NTSS/actions . A successful Actions execution has **not** been independently confirmed.
- The live website was not tested in a real authenticated browser during this change; interactive cross-browser QA and real-student usability testing remain necessary.
- Content coverage of the visualizer is deliberately selective. Lessons without a suitable model do not display a misleading generic simulation.
- Client-side practice scores and certificates are not authoritative or tamper-proof.
- No personal data, cookies or permanent analytics were added by these modules.

## Suggested acceptance checks
1. Open first, second and third year AI lessons; complete 10 questions and verify the next block remains at 50 total and all answered results remain fixed.
2. Answer three or more questions incorrectly in a five-question window; open the suggested review and confirm that it contains the original item's explanation where available.
3. Open Mathematics > Linear Functions, Physics > Ohm's Law, Year 2 Python, Year 2 SQL, or KNN/ML lessons; move the sliders and verify the model output changes.
4. Test Arabic nominal sentences, Kana and Inna and English past perfect visual structures.
5. On phone widths 320–430px, verify only one question is primary and that bonus tools remain in the optional drawer.
6. Test keyboard focus, screen-reader descriptions, and A4 certificate print preview.

Core files: learning-support.js, learning-concepts.js, learning-ux.css, practice-workshop.js, app-main.js and individual subject practice engines.