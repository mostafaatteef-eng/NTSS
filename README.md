# EBDA Learning Hub

A free, browser-based interactive learning experience for EBDA National Technical Science Schools (Badr) — Year 1 AI and Data Engineering.

## Unified Year 1–3 five-stage learning experience (November 2026)

All three grades now use **the same learning-page interaction model**, with a visible five-step progress bar, lesson navigation in the sidebar, a single focused activity per screen, and **Back / Continue** controls:

1. **Discover** — a focused interactive concept and prediction
2. **Experiment** — executable Python/SQL or a computed lab, with optional numerical evidence and code tests
3. **Understand** — a step-through concept visualizer, with an optional data playground
4. **Check** — one immediate-feedback applied question; checking the answer unlocks the standard Continue action
5. **Practice** — 50 sequential formative questions with hints and mistake review; optional industrial missions, rubric inspection and local evidence export

The Year 2/3 accordion wall and separate lesson flow are removed. Returning to Experiment preserves the student's editor draft, and returning after a run retains the prior output within this visit. Learners can also jump directly to the 50 questions, matching Year 1. There is no learner registration, central progress tracking or persistent student record. The source-mapped content remains provisional unless individually matched to the original academic assessment checklist.

**Verification:** scripted integration simulation enumerated 77 advanced sessions and rendered all five learning stages for each without errors; the CI scripts have been revised for the unified path. Passing real Playwright and Python/SQLite WebAssembly checks and completing GitHub Pages deployment must be verified separately through Actions.

## Reliability and learner-flow repair — 15 November 2026

- **Practice questions:** prevent unchecked next actions, retain selections and hints when students return to an earlier question, and keep all 50 questions in one uninterrupted sequence. The explanation for an incorrect answer is reached through guided mistake review instead of being spoiled immediately. Optional skill-map review remains after each ten questions.
- **Year 1:** preserve already-checked stage answers when returning to a previous step; move the industrial case to an optional disclosure, and simplify the Understand explanation to one main insight.
- **Years 2–3:** visible stage position and a **Continue to next stage** control reduce accordion guessing; changing stages without a page reload preserves code-editor drafts. Existing Python/SQL output is stored in the lesson state so rerenders do not erase the result.
- **Testing:** added code checks for the full 116 lesson banks and complete 50-question navigation, and staged 77-lab simulations. Browser smoke tests additionally verify that navigation preserves code-editor work. No browser/WASM deployment success is asserted without a confirmed GitHub Actions run.

## Student experience visual refresh — 15 November 2026

The noisy **Practical Brief · Your learning mission** checklist, including its 0/3 counter, expected-evidence paragraph and approval-status copy, has been removed across all Year 2/3 lessons. The previous Discover theory view also repeated the same three steps in large cards. It now asks one concise prediction question and offers optional expandable guidance, keeping the focus on understanding and experimentation. Discover now opens directly onto educational theory. The 50 inline questions, code labs, practical feedback and evidence export remain.

The new expressive-but-calm interface uses EBDA teal and yellow accents, data-inspired illustration, brighter academic-year cards, clearer stage feedback and mobile touch targets. No student accounts or new promotional dashboards.

Regression checks now explicitly reject the removed checklist. GitHub Actions and real-browser checks must still pass before treating the redesign as deployed and visually verified.

## Minimal student-first UI redesign (November 2026)

The live source now loads **`ebda-ui.css`** after the original styles. It introduces a calm, responsive design language with restrained EBDA teal and yellow, system typography, larger whitespace, accessible focus indicators, clear learner navigation and simpler grade cards. The home hero uses a lightweight, CSS-based data illustration rather than a heavy promotional visual. Search remains prominent; About/Admin/editor shortcuts and learner account requirements are not added.

The Year 1 lesson sequence explicitly labels its five stages: **Discover → Experiment → Understand → Check → Practice**. Year 2/3 specialization sessions now use **the same five sequential learning stages as Year 1**: Discover, Experiment, Understand, Check and Practice. Only the active stage is displayed. Supporting activities such as the data playground and optional investigations are available in secondary expandable panels. All existing content—including the 50 inline questions per lesson, coding challenges, source-linked indicators and export tools—is preserved.

**Release checks:** `scripts/validate.mjs` asserts the CSS asset, five lab stages and exactly one initially open stage. Desktop/mobile and Pyodide/SQLite browser smoke scripts have been updated to expand the right stages. `.github/workflows/deploy-pages.yml` now copies `*.css` into the GitHub Pages artifact so the redesign is actually published after successful CI.

**Verification boundaries:** JavaScript integration simulation has checked all 116 lesson entries, all 5,800 question variants and the single-open stage structure of all 77 Year 2/3 laboratories, with zero simulation errors. This does **not** prove that Chromium tests, network-loaded WebAssembly runtimes or GitHub Pages deployment have passed. Check GitHub Actions before treating the deployment as confirmed.

## Guided errors, runnable coding challenges, industrial missions and concept visualizers

**Smart Mistake Review:** Wrong answers in the integrated 50-question lesson sequence now reveal a three-stage, optional explanation: identify the misconception; review the worked solution; try a related question on the same skill. The related question is formative and does not affect the original 50-question count/order. All state stays in RAM.

**Code Challenges with Test Cases:** Twenty Year-2 Python/SQL specialization sessions now include supplementary code challenges within the existing executable code editor. Python challenges test student-defined functions for averaging sensor values, cleaning invalid readings and counting alerts across three independent inputs. SQL challenges test counts, aggregate JOINs and threshold filters against two separate synthetic database fixtures. Tests run locally in the browser using the existing Pyodide/SQLite WebAssembly engines. A sample starter solution is optional. These do **not** cover every official product checklist item. Source topic mapping is unit-level, not instructor certification.

**Interactive Mission Mode:** The existing 18 industrial evidence missions now persist across all lessons within their respective unit, instead of appearing only in the first unit lesson. Each has three linked decisions with staged evidence and helpful retry feedback. The four-step industrial SQL evidence mystery additionally requires real SQL output before a clue can be unlocked. No mission progress is persisted.

**Interactive Concept Visualizer:** All 39 first-year lessons and all 77 upper-year lessons now include a manipulable computed walkthrough showing one of: stepwise Python loops, relational INNER JOIN matches (including unmatched rows), changes in sample mean, KNN nearest-neighbor distances/majority labels, or threshold-based alert rates. The illustrations use small synthetic data and do not replace full official projects.

**Validation status:** JavaScript simulations checked all 39 Year-1 concept visualizers and the 77 Year-2/3 pages, including 20 coding challenge panels, continuous mission displays, and in-lesson wrong-answer review. Sample Python functions (3 cases) and two distinct SQLite JOIN fixtures were separately verified with local Python/SQLite reference interpreters. The GitHub Actions runtime smoke test has been updated to check actual Pyodide and sql.js execution within Chromium; successful CI execution and GitHub Pages availability have **not** been confirmed.

## In-lesson assessment sequence — corrected

- **No separate Practice Workshop card or launch button** is rendered.
- **Year 1:** students move through prediction → experiment → explanation → concept check → **50 guided questions as the fifth lesson stage**, then advance to the next lesson after completing the questions.
- **Years 2 and 3:** the 50-question sequence appears directly in the same practical lesson page with its runtime lab and evidence checks, immediately showing Question 1/50.
- Questions are shuffled **once when starting each lesson attempt**, remain fixed from Question 1 to Question 50, and shuffle anew on retry. The full 50-question pool is preserved.
- All states are kept in memory; no student accounts, profile data or server scores. Immediate feedback, optional milestone skill reviews after each ten questions, and explanations remain available.
- A scripted functional regression traversed 116 lessons and all 50 steps of a first-year lesson, including end-of-lesson navigation. This is not a confirmed live GitHub Pages/Chromium run.

## Adaptive learning, named skill mastery and applied laboratories

The EBDA Learning Hub now has four integrated additions:

1. **Adaptive Learning:** Each 50-question lesson is continuous, with optional mastery reviews after every ten questions. A fresh Fisher–Yates shuffle sets a different sequence when a new attempt begins; that sequence remains fixed until the final question. The mastery map still reports first-attempt accuracy and hints, but it does not reorder questions halfway through an attempt. It does not use opaque AI scoring, change the approved source content or claim formally validated difficulty calibration. The same 50 parameterized items remain available.
2. **Skill Mastery Map:** After ten questions and in the final summary, the learner sees ten named skills, correct/attempted counts and a formative status (Not assessed / Needs practice / Progressing / Developing mastery). Skill names are linked to the domain-specific question templates, not inferred from personal data. Estimates reset on reload; no user profiles, persistent learning histories or records.
3. **Practical Rubrics:** Every one of the 77 Year 2/3 laboratories has a detailed rubric with 30 points for observed code execution or genuine browser manipulation, 35 for a verified correct numerical evidence response, 20 reserved for teacher assessment of interpretation, and 15 reserved for teacher sign-off against the unit product checklist and relevant KPIs. A button lets learners write a reflection and include formative rubric status in their local evidence export. The teacher-review points are **never** self-awarded by the app. Generic runtime output alone does **not** satisfy a correct calculation.
4. **Visual Data Playground:** All 77 Year 2/3 labs now include a six-record synthetic sensor dataset, with live filtering by site/threshold, descending sorting, mean imputation, min-max scaling, recomputed summaries and bar charts, and local CSV export. This is a deliberately small exploratory dataset; it does not automatically satisfy source-specific official dataset/project requirements.

**Academic limitation:** The above are operational formative learning features, **not** completion or accreditation of the entire official practical rubrics. Unit-level indicators in `performance-map.js` are supported by the uploaded teacher guides; their per-session assignments and official product acceptance still need qualified teacher review. See [ASSESSMENT_AUDIT.md](ASSESSMENT_AUDIT.md). A successful browser/WASM deployment has not yet been independently confirmed.

**Technical implementation:** `mastery-engine.js`, `practical-rubrics.js`, `visual-playground.js` and the updated `practice-workshop.js`/`lab-studio.js`. Their state is held in browser RAM only. GitHub Actions release tests check navigation, original 116 lesson banks, mastery, numerical scoring and data transformations.

## EBDA learner-experience improvements (14 November 2026)
- **Simplified home screen:** removed the Four Ways to Learn promotional cards and their CSS; lesson search and grade navigation remain directly below the hero.

The publicly visible product name is **EBDA Learning** (not EBDAA). Internal `EBDAA_*` JavaScript identifiers are retained for compatibility and are not part of the visual brand.

- **Cross-grade lesson search:** a live home-page search covers all 116 lessons, with direct navigation to the appropriate grade, unit and session. No search history is collected.
- **Continuous randomized attempts:** every new lesson attempt shuffles the 50-item set once (consecutive attempts differ within a tab). Learners move through all 50 questions without mandatory checkpoint screens; after each ten questions they may optionally open their skill map. Progress exists only in memory.
- **Streamlined Discover stage:** The large Practical Brief checklist was removed from all 77 Year-2/3 labs; interactive theory, experiment evidence, quizzes, rubric and export remain.
- **Evidence export:** students can save a local plain-text lab report containing source/unit indicators, their own editor content (Python or SQL if applicable), and their entered numerical evidence. This is not an accredited assessment certificate or official checklist submission.
- **Accessible navigation:** visible keyboard skip link, search input labeling, and reduced-motion preferences. Full WCAG testing remains outstanding.
- **Scientific integrity:** Prevent repeated scoring by re-submitting the same checked response. Neither the generated question count nor completing the checklist establishes scientific accreditation.

The new UI and content changes have passed scripted JavaScript-flow tests. Browser-based rendering, file download, Pyodide, SQLite, CI deployment and mobile accessibility must be verified separately before formal release.

## Academic structure

- Year 1 → AI in Data Engineering & Analysis → Term 1 (Units 1–3), Term 2 (Units 4–6) → 39 interactive sessions.
- Year 2 → AI in Data Engineering & Analysis → Term 1 (Programming and Scripting for Automation; Data Types and Modeling for AI; Database Design and Management) and Term 2 (Data Analysis Techniques; Data Preprocessing Techniques; Machine Learning and Deep Learning Algorithms). These are 41 source-verified **session titles**, not yet developed interactive lessons.
- Year 3 → AI in Data Engineering & Analysis → Term 1 (Statistical Analysis for Data Science; Data Annotation and Labeling for AI; AI Application Monitoring and Maintenance) and Term 2 (Data Management Frameworks for AI; Data Privacy, Security, and Fairness; Applied Machine Learning and Analytics). Six units and 36 source-verified lesson titles. Interactive Year 3 lessons are pending; the content index is live.
- Year 3 source reconciliation: the Term 2 combined teacher guide's contents page lists a Unit 6 monitoring title, while its actual Unit 6 body (pp. 124–125) identifies **Applied Machine Learning and Analytics**, corroborated by the standalone Unit 18 guide. The actual unit and standalone guide take precedence. The standalone first-term monitoring guide is kept in first term.

`grade-catalog.js` holds the year/subject/unit/session taxonomy and is editable only by users with repository write permissions. Additional general-education or technical subjects can be added after their official syllabi are uploaded.

## Immersive curriculum cases and genuine runtime acceptance

- 18 unit-level three-stage narrative cases are embedded alongside lessons; new stages unlock only after the preceding answer is verified.
- Year 2 relational database units include a custom **Factory SQL Mystery** with four evidence clues and three linked SQLite tables. Students must run SQL and inspect the expected query result before unlocking clues. The industrial data and scenario were created for EBDA, not copied from third-party games.
- The instructional pattern combines immersive problem-solving, real-world project tasks, an investigative chain of evidence, and editable SQL JOIN examples, inspired by The Data Escape Room, DataWars, Knight Lab SQL Murder Mystery, and W3Schools SQL JOIN.
- **QA gate**: `scripts/validate.mjs` checks structural/logic flow; `scripts/browser-smoke.mjs` checks real desktop/mobile DOM interaction; `scripts/runtime-smoke.mjs` runs actual Pyodide Python and sql.js SQLite WebAssembly in Chromium, checks the JOIN results and checks a guessed SQL case answer is blocked without SQL evidence.
- **Truthful status**: CI checks and external runtimes have been configured but no successful remote Chromium/GitHub Pages deployment report has been independently retrieved in this conversation. Do not treat the live service as verified until an explicit green run and HTTPS page access have been recorded.
- **Scientific equivalence** is still partial: the source checklists include full Python/SQL artifact creation, advanced security, dataset evaluation, model training and teacher assessment. Review the current evidence/gaps in [ASSESSMENT_AUDIT.md](ASSESSMENT_AUDIT.md). Matching 50 question variants to a lesson is not the same as passing its complete practical checklist.

## 50 practice items per lesson (November 2026 enhancement)

- 116 specialization lesson pages across grades 1–3, each with exactly **50 generated practice questions** (5,800 total).
- Ten domain-specific reasoning templates per lesson, each with five data/scenario variations. This is 50 distinct item texts per lesson, **not 50 independent learning objectives or 5,800 manually curated, source-certified questions**.
- UI modes: calculations, four-option choices, true/false assertions, and clickable workflow ordering; immediate explanatory feedback, question navigation and a non-persistent end summary.
- Formats across the generated bank: 1,740 numeric, 2,320 multiple-choice, 1,160 true/false and 580 ordering items.
- Automated release checks assert exactly 50 non-duplicate question stems for **each** lesson and verify keys, formats and source-status flags. Editorial and subject-specialist review is still mandatory before summative or certified assessment.

**Curriculum audit:** [ASSESSMENT_AUDIT.md](ASSESSMENT_AUDIT.md) inventories all 116 sessions and 18 unit-level practical checklists, identifies gaps, and explicitly marks all units PARTIAL. The question count is a practice-bank coverage metric, not evidence of full practical-checklist compliance.

**Browser QA:** [scripts/browser-smoke.mjs](scripts/browser-smoke.mjs) uses Playwright Chromium to check real DOM navigation, answer feedback, mobile overflow and JS errors. The GitHub Actions verification job must succeed before the static site can be deployed by the configured workflow. A workflow definition by itself does not establish a successful production deployment; confirm run status in GitHub Actions and Pages settings. Python/SQL external WebAssembly runtimes additionally require a live browser and network-specific acceptance testing.

## Integrated practical specialization laboratories (Years 2 and 3)

**New architecture:** Grade → specialization subject → semester → unit → session → interactive concept → live laboratory → embedded formative challenge → immediate feedback. The standalone Challenge Arena link and its routes have been removed.

**Coverage:** 41 Year-2 and 36 Year-3 session pages (77 total), each with a session-specific practical task brief and proposed evidence output; 12 unit-level LO/KPI mappings transcribed/paraphrased from the uploaded teacher guides. Important: the source guides present these indicators at unit level. Session-to-indicator alignment in the application is a proposal, not an official per-session allocation.

**Working computational engines:**
- Python editing/execution through an on-demand Pyodide 0.27.7 WebAssembly worker (12-second execution timeout; first use requires internet). This is an executable educational sandbox, not an unrestricted full Python cloud service.
- Real SQLite SELECT queries over an in-memory synthetic factory dataset using sql.js 1.11.0 WebAssembly (download on first use). Browser-local, disposed per execution.
- Recalculating JavaScript demonstrations for basic descriptive statistics, one-sample t statistic, Pearson correlation, Bayes, data preprocessing, KNN, classification metrics, anomaly detection, annotation agreement, telemetry, pipelines, fairness-screening metrics and agriculture.
- Additional source-topic-specific calculators for 12 selected sessions; other sessions reuse an educational calculation engine at unit level with a focused theory-led Discover stage.
- Every one of the 77 Year-2/3 sessions also has an independent auto-checked quantitative evidence question and an embedded conceptual challenge, both with explanations. Numerical problems are synthetic and formative.

**Pedagogy and evidence:** Every session has a manipulable or executable activity and a formative checkpoint. These checkpoints provide explanations rather than recording student grades. The current lab outcomes, numerical assessment items and unit-level question banks are **supplementary instructional prototypes**, not validated equivalents of all official practical projects, product checklists or summative assessments. The 77 pages therefore provide working practical entry points, **not 77 independently validated full curriculum labs**. A curriculum expert must still review each against the original session's full teaching steps and acceptance criteria.

**Security/privacy:** No student registration, names, saved marks, telemetry, or backend. The browser fetches public runtime assets from third-party CDNs when Python or SQL is launched; ordinary network requests may expose standard connection metadata to those providers. No student records are transmitted by the application. Admin editing uses GitHub repository write permissions.

**Testing:** JavaScript syntax, navigation, every one of the 77 new session flows, embedded feedback, 39 original Year-1 lessons, and 77 practical lesson structures pass scripted simulation tests. End-to-end execution of Pyodide and SQLite in a real browser, complete academic validation, accessibility testing and confirmation of GitHub Pages publication remain outstanding.

## Challenge Arena — enhanced specialization pedagogy

There are 18 unit-level mission banks and 54 authored formative questions. Their questions are distributed across lesson checks, with immediate explanations; no separate Challenge Arena navigation remains. These are supplementary formative exercises authored for this platform, not official assessment papers.

- Year 1: missions extend the existing 39 full guided sessions and hands-on visual experiments.
- Year 2: six unit question banks for automation scripting, relational modeling, database queries, analysis, preprocessing and model evaluation; all 41 session entries have working practical activities and await deeper individual academic validation.
- Year 3: six unit question banks on statistical analysis, annotation, monitoring, governance, privacy/fairness, and precision agriculture; all 36 session entries have working practical activities and await deeper individual academic validation.

All mission questions and answers live in `missions-data.js` and require GitHub collaborator access to edit. Tests check every mission. Results and attempts exist only in browser memory during the active visit. Do not treat them as formal assessment or student records.

## Public learning
- No student accounts, no student names, no teacher dashboards and no student analytics.
- Six curriculum units and 39 short concept journeys, with 39 distinct entry questions and a separate application checkpoint.
- Each journey includes a prediction question, a topic demonstration, a concept explanation, and an immediate-feedback practice step.
- Browser-only calculated experiments include K-Means centroid updates, 2D KNN distances and voting, BFS traversal, vector magnitude, gradient descent, probability and algorithm operations.
- Direct manipulation: binary bit switches, mutable list builder, and LIFO push/pop stack.
- Clear labels distinguish real calculations, simplified conceptual models and textbook teaching content.
- No personal data is sent to a backend. Answers are used in memory for the current visit only.
- Educational text and practice are supplementary, newly authored content; official guides remain separately protected.

## Brand
Colors drawn from the supplied school palette: `#CBC0A3`, `#FFEAAF`, `#1CA29A`, `#FFD700`.
The header includes the supplied NTSS identity artwork.

## Admin-only editing
Content editing uses GitHub's existing authenticated authorization model — **not a fake front-end admin password**.

1. Log into GitHub as an account with write permission to this repository.
2. Open [curriculum-data.js](https://github.com/mostafaatteef-eng/NTSS/edit/main/curriculum-data.js).
3. Modify titles, explanations, questions, options, answers or labels carefully, preserving valid JavaScript syntax.
4. Commit the changes to the repository.
5. GitHub Pages may publish automatically after Actions is enabled. Review the Actions run after editing.

A built-in password-protected dashboard would require server-side authentication and an API; a client-only login is not secure. Repository permissions restrict editing but not viewing: this public static website makes all shipped teaching content publicly readable.

## Quality checks

The release pipeline runs `node scripts/validate.mjs` before GitHub Pages publishing. It checks 39 lesson journeys, question integrity, and the no-student-storage design. The checks are computational smoke tests, not a substitute for browser, usability, accessibility or academic review.

## Deploy
In GitHub > Settings > Pages, set Source to **GitHub Actions**, then run the Publish EBDA Learning Hub workflow. Expected URL: https://mostafaatteef-eng.github.io/NTSS/

## Limitations
Not a hosted backend or full CMS. No unrestricted Python execution; visual interactions include calculated examples and conceptual models. First-term student book is not included in supplied files, so supplementary content requires academic review. The 39 lessons are short guided concepts; complete curricular lab coverage and external validations are not yet implemented.

Pedagogical direction informed by [Brilliant's description of its learning approach](https://brilliant.org/about/), without copying Brilliant's proprietary interface or content.
