# EBDAA Learning Hub

A free, browser-based interactive learning experience for Ebdaa National Technical Science Schools (Badr) — Year 1 AI and Data Engineering.

## Academic structure

- Year 1 → AI in Data Engineering & Analysis → Term 1 (Units 1–3), Term 2 (Units 4–6) → 39 interactive sessions.
- Year 2 → AI in Data Engineering & Analysis → Term 1 (Programming and Scripting for Automation; Data Types and Modeling for AI; Database Design and Management) and Term 2 (Data Analysis Techniques; Data Preprocessing Techniques; Machine Learning and Deep Learning Algorithms). These are 41 source-verified **session titles**, not yet developed interactive lessons.
- Year 3 → AI in Data Engineering & Analysis → Term 1 (Statistical Analysis for Data Science; Data Annotation and Labeling for AI; AI Application Monitoring and Maintenance) and Term 2 (Data Management Frameworks for AI; Data Privacy, Security, and Fairness; Applied Machine Learning and Analytics). Six units and 36 source-verified lesson titles. Interactive Year 3 lessons are pending; the content index is live.
- Year 3 source reconciliation: the Term 2 combined teacher guide's contents page lists a Unit 6 monitoring title, while its actual Unit 6 body (pp. 124–125) identifies **Applied Machine Learning and Analytics**, corroborated by the standalone Unit 18 guide. The actual unit and standalone guide take precedence. The standalone first-term monitoring guide is kept in first term.

`grade-catalog.js` holds the year/subject/unit/session taxonomy and is editable only by users with repository write permissions. Additional general-education or technical subjects can be added after their official syllabi are uploaded.

## Immersive curriculum cases and genuine runtime acceptance

- 18 unit-level three-stage narrative cases are embedded alongside lessons; new stages unlock only after the preceding answer is verified.
- Year 2 relational database units include a custom **Factory SQL Mystery** with four evidence clues and three linked SQLite tables. Students must run SQL and inspect the expected query result before unlocking clues. The industrial data and scenario were created for EBDAA, not copied from third-party games.
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

**New architecture:** Grade → specialization subject → semester → unit → session → practical brief → live laboratory → embedded formative challenge → immediate feedback. The standalone Challenge Arena link and its routes have been removed.

**Coverage:** 41 Year-2 and 36 Year-3 session pages (77 total), each with a session-specific practical task brief and proposed evidence output; 12 unit-level LO/KPI mappings transcribed/paraphrased from the uploaded teacher guides. Important: the source guides present these indicators at unit level. Session-to-indicator alignment in the application is a proposal, not an official per-session allocation.

**Working computational engines:**
- Python editing/execution through an on-demand Pyodide 0.27.7 WebAssembly worker (12-second execution timeout; first use requires internet). This is an executable educational sandbox, not an unrestricted full Python cloud service.
- Real SQLite SELECT queries over an in-memory synthetic factory dataset using sql.js 1.11.0 WebAssembly (download on first use). Browser-local, disposed per execution.
- Recalculating JavaScript demonstrations for basic descriptive statistics, one-sample t statistic, Pearson correlation, Bayes, data preprocessing, KNN, classification metrics, anomaly detection, annotation agreement, telemetry, pipelines, fairness-screening metrics and agriculture.
- Additional source-topic-specific calculators for 12 selected sessions; other sessions reuse an educational calculation engine at unit level with an individual practical brief.
- Every one of the 77 Year-2/3 sessions also has an independent auto-checked quantitative evidence question and an embedded conceptual challenge, both with explanations. Numerical problems are synthetic and formative.

**Pedagogy and evidence:** Every session has a manipulable or executable activity and a formative checkpoint. These checkpoints provide explanations rather than recording student grades. The current lab outcomes, numerical assessment items and unit-level question banks are **supplementary instructional prototypes**, not validated equivalents of all official practical projects, product checklists or summative assessments. The 77 pages therefore provide working practical entry points, **not 77 independently validated full curriculum labs**. A curriculum expert must still review each against the original session's full teaching steps and acceptance criteria.

**Security/privacy:** No student registration, names, saved marks, telemetry, or backend. The browser fetches public runtime assets from third-party CDNs when Python or SQL is launched; ordinary network requests may expose standard connection metadata to those providers. No student records are transmitted by the application. Admin editing uses GitHub repository write permissions.

**Testing:** JavaScript syntax, navigation, every one of the 77 new session flows, embedded feedback, 39 original Year-1 lessons, and 77 practical briefs pass scripted simulation tests. End-to-end execution of Pyodide and SQLite in a real browser, complete academic validation, accessibility testing and confirmation of GitHub Pages publication remain outstanding.

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
In GitHub > Settings > Pages, set Source to **GitHub Actions**, then run the Publish EBDAA Learning Hub workflow. Expected URL: https://mostafaatteef-eng.github.io/NTSS/

## Limitations
Not a hosted backend or full CMS. No unrestricted Python execution; visual interactions include calculated examples and conceptual models. First-term student book is not included in supplied files, so supplementary content requires academic review. The 39 lessons are short guided concepts; complete curricular lab coverage and external validations are not yet implemented.

Pedagogical direction informed by [Brilliant's description of its learning approach](https://brilliant.org/about/), without copying Brilliant's proprietary interface or content.
