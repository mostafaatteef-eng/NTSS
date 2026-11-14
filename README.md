# EBDAA Learning Hub

A free, browser-based interactive learning experience for Ebdaa National Technical Science Schools (Badr) — Year 1 AI and Data Engineering.

## Public learning
- No student accounts, no student names, no teacher dashboards and no student analytics.
- Six curriculum units and 39 short concept journeys.
- Each journey includes a prediction question, a manipulable topic demonstration, a concept explanation, and an immediate-feedback practice step.
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

## Deploy
In GitHub > Settings > Pages, set Source to **GitHub Actions**, then run the Publish EBDAA Learning Hub workflow. Expected URL: https://mostafaatteef-eng.github.io/NTSS/

## Limitations
Not a hosted backend or full CMS. No real Python execution; visual interactions are instructional models. First-term student book is not included in supplied files, so supplementary content requires academic review. The 39 lessons are short guided concepts; complete curricular lab coverage and external validations are not yet implemented.

Pedagogical direction informed by [Brilliant's description of its learning approach](https://brilliant.org/about/), without copying Brilliant's proprietary interface or content.
