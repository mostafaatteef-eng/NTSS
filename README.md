# EBDAA Learning Hub

A free, browser-based interactive learning experience for Ebdaa National Technical Science Schools (Badr) — Year 1 AI and Data Engineering.

## Academic structure

- Year 1 → AI in Data Engineering & Analysis → Term 1 (Units 1–3), Term 2 (Units 4–6) → 39 interactive sessions.
- Year 2 → AI in Data Engineering & Analysis → Term 1 (Programming and Scripting for Automation; Data Types and Modeling for AI; Database Design and Management) and Term 2 (Data Analysis Techniques; Data Preprocessing Techniques; Machine Learning and Deep Learning Algorithms). These are 41 source-verified **session titles**, not yet developed interactive lessons.
- Year 3 → AI in Data Engineering & Analysis → Term 1 (Statistical Analysis for Data Science; Data Annotation and Labeling for AI; AI Application Monitoring and Maintenance) and Term 2 (Data Management Frameworks for AI; Data Privacy, Security, and Fairness; Applied Machine Learning and Analytics). Six units and 36 source-verified lesson titles. Interactive Year 3 lessons are pending; the content index is live.
- Year 3 source reconciliation: the Term 2 combined teacher guide's contents page lists a Unit 6 monitoring title, while its actual Unit 6 body (pp. 124–125) identifies **Applied Machine Learning and Analytics**, corroborated by the standalone Unit 18 guide. The actual unit and standalone guide take precedence. The standalone first-term monitoring guide is kept in first term.

`grade-catalog.js` holds the year/subject/unit/session taxonomy and is editable only by users with repository write permissions. Additional general-education or technical subjects can be added after their official syllabi are uploaded.

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
