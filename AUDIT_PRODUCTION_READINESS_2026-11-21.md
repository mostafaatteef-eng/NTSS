# EBDA Learning — Production Readiness Audit (Working Report)
**Audit date:** 21 November 2026  
**Branch:** `audit/production-readiness-20261121`  
**Status:** **NOT APPROVED for production merge.** Static and simulated checks do not replace real-browser testing, deployment verification, or teacher sign-off.

## A. Executive summary
The repository was inspected through the connected GitHub source interface. Live website access through the available web tool was unavailable; no real Lighthouse, network, Core Web Vitals, live GitHub Pages, browser printing, or physical-device performance measurements were obtained. Changes in this audit were isolated to a dedicated review branch.

The currently indexed catalog contains **586 lessons/activities**, comprising **578 intended 50-question assessments** and **8 ungraded Business English projects**. This is an **index and question-bank structural inventory**, not verification that all 578 lessons are scientifically correct, accessible, or pass real-browser E2E tests.

## B. Architecture and flow
`index.html` → ordered deferred scripts → `app-main.js` (navigation, subject selection) → `lazy-features.js` (optional subject and laboratory modules) → student name gate → subject practice engine → `lesson-completion.js` (70% formative certificate; separately marked ungraded Business English project participation record).

AI/Data Analysis: `curriculum-data.js` + `grade-catalog.js` → `question-factory.js` → `assessment-enhancements.js` → `practice-workshop.js`, `mistake-review.js`, `mastery-engine.js` → locally generated completion sheet.

The browser execution environments are `python-lab-worker.js` (Pyodide) and `sql-lab-worker.js` (sql.js). The Service Worker stores same-origin site resources on demand. Student answers may be stored locally in browser storage for a limited resume window; the certificate name is held in in-memory state.

## C. Issues register
| ID | Severity | Evidence | Action in audit branch | Verification |
|---|---|---|---|---|
| AUD-001 | P1 | Live Pyodide browser test selected an arbitrary Python task but submitted an `average(values)` solution | Select an actual matching average task; fail explicitly if unavailable | JS syntax check; full live browser run **not yet verified** |
| AUD-002 | P2 | Dragging the visual threshold rebuilt and replaced its slider DOM | Update existing bar classes and output without replacing slider | Simulated controller test matched four bar classifications and retained DOM identity |
| AUD-003 | P2 | Name fields used `autocomplete="name"` on a shared educational device | Change name inputs to `autocomplete="off"` | Source check; browser-autofill behavior varies and still needs device QA |
| AUD-004 | P1 | Content Security Policy includes `script-src 'unsafe-inline'` and the app relies on inline `onclick` handlers | **Not fixed:** requires systematic event-handler refactor, CSP staging and regression testing | Security review **pending**; do not claim the current policy is strict |
| AUD-005 | P1 | No confirmed end-to-end browser execution, Android/iOS Safari or actual certificate PDF print | Existing automated browser jobs retained; add full-bank CI test | Browser/print **not run or independently verified** in this audit |
| AUD-006 | P1 | Many question items are generated from parameterized templates; available project code cannot prove textbook/rubric alignment | Added cross-curriculum generation audit; **teacher approval remains required** | Structural check only; subject content truth **not approved** |
| AUD-007 | P2 | Project participation records are not independently graded or authenticated | Retain explicit `Not graded` / not-official wording | Source and mock certificate checks reviewed |
| AUD-008 | P2 | First-run Pyodide/SQLite relies on external WebAssembly runtime downloads | Leave fault handling and external runtime dependencies documented | Offline executable-lab use **not verified** |
| AUD-009 | P2 | No reliable prior-vs-current real-device performance baseline | Keep performance logging/CI; no fabricated speed gains | FCP/LCP/INP/CLS/bytes/CPU values **unavailable** |

## D. Educational audit and content coverage
| Curriculum | Indexed lessons / activities | Scope of automated structural inspection |
|---|---:|---|
| AI & Data Analysis (years 1–3) | 116 | 50-question contract, IDs, assessed variants |
| Mathematics (years 1–3) | 76 | Question generation |
| Advanced English (years 1–3) | 102 | Question generation with grammar extension bank |
| Physics STEM (years 1–3) | 63 | Question generation |
| Arabic Language (years 1–3) | 73 | Question generation |
| German (years 1–3) | 24 | Question generation with language bank/dialogues |
| Social Studies (years 2–3) | 26 | Question generation |
| National Education (year 1) | 17 | Question generation |
| Economics (year 3) | 20 | Question generation |
| Business English (years 1–3) | 69 | 61 generated assessments; 8 explicitly ungraded projects |
| **Total** | **586** | **578 assessed lessons + 8 projects** |

Important: The presence of 50 questions per lesson does **not** establish 50 pedagogically independent, scientifically vetted items. Full academic validation requires the current official curriculum, teacher guides, outcome mapping, and human subject-specialist review. Do not silently substitute fabricated references.

## E. UI/UX and accessibility
One-question focus remains the target. Fixed slider re-creation; retained keyboard-focusable native range input and chart output updates. Mobile viewport, hover/focus, target sizes, RTL/LTR, browser print, and assistive technology behavior need executed browser and human tests. Use WCAG 2.2 AA as the acceptance basis, including reflow, labels, focus and touch targets.

## F. Performance
The startup uses `defer` and loads subject modules on demand (previous code review counted 48 startup JS files). This is **not a measured rendering or bandwidth improvement**. Check network waterfalls for duplicate downloads, failed lazy modules, old SW versions, code-runtime startup and interactive question latency. Record real FCP, LCP, INP and CLS before/after on matching devices and network presets.

## G. Name and certificate compliance
| Route | Name gate in source | Certificate logic | Unverified aspect |
|---|---|---|---|
| AI/Data Analysis | yes | 70% practice completion | Real E2E and PDF printing |
| Mathematics | yes | 70% practice completion | Real E2E and PDF printing |
| Physics STEM | yes | 70% practice completion | Real E2E and PDF printing |
| Advanced English | yes | 70% practice completion | Real E2E and PDF printing |
| German | yes | 70% practice completion | Real E2E and PDF printing |
| Arabic | yes | 70% practice completion | Real E2E and PDF printing |
| Social Studies | yes | 70% practice completion | Real E2E and PDF printing |
| National Education | yes | 70% practice completion | Real E2E and PDF printing |
| Economics | yes | 70% practice completion | Real E2E and PDF printing |
| Business English | yes | 70% for scored lessons; **ungraded participation** for projects | Real E2E and PDF printing |

The learner name is transient browser-session state; switching students on a shared still-open device requires deliberate name reset/reload and a written classroom procedure. Browser autofill is disabled in this branch, but cannot alone guarantee that operating systems never suggest names.

## H. Test execution status
| Test | Status | Evidence/limits |
|---|---|---|
| Source inspection and JS syntax of modified modules | **PASS (manual code evaluation)** | Source functions parsed without JS syntax errors |
| Visual threshold update simulated interaction | **PASS (simulation)** | Native control preserved, displayed value and four threshold flags correct |
| All-subject generation audit | **ADDED; CI NOT VERIFIED** | New `scripts/all-lessons-qa.mjs`; subject banks manually sampled/exercised by executing source `build()` functions |
| Scoring/30+ case Python, SQLite runtime | **NOT RUN (real browser)** | Existing browser and grader suite requires reliable Pyodide/sql.js runtime |
| AI 50-question resume and completion | **PASS (prior simulation)** | Browser reload, production state and real printing not validated in this audit |
| Chromium / Firefox / WebKit | **NOT VERIFIED** | Existing Playwright tests require actual CI log evidence |
| Physical Safari / Android / iOS devices | **NOT RUN** | Required for production release |
| Security penetration/dependency tests | **NOT RUN** | CSP audit and dependency risk review needed |
| Academic correctness and current-curriculum sign-off | **NOT VERIFIED** | Human review and official source files required |
| Live Lighthouse / Core Web Vitals before-after | **NOT RUN** | Live website unavailable to audit tool |
| School-issued official credential verification | **NOT APPLICABLE** | Certificates explicitly local, unverified practice records |

## I. Changes in this review branch
- `practice-workshop.js`: avoid destroying the range input on threshold adjustments.
- `scripts/assessment-browser-qa.mjs`: select a Python test matching the average solution.
- `app-main.js`: turn off name autofill hints on name gates.
- `scripts/all-lessons-qa.mjs`: newly added full-curriculum structure and generation checks.
- `.github/workflows/assessment-qa.yml`: include new test in the CI suite.

## J. Unresolved release gates
1. Obtain **successful GitHub Actions job logs**, including full curriculum, real Pyodide, SQLite and all specified viewport sizes.
2. Conduct hands-on browser PDF print and student-name/certificate checks for every curriculum and project exception.
3. Apply targeted CSP hardening as a separate staged migration (avoid breaking existing inline handlers).
4. Verify actual website load, real hardware/mobile interaction and performance metrics with repeatable methodology.
5. Have subject teachers sign off learning objectives, sample answers, source editions and grade-specific difficulty.
6. Only then open approval/merge to `main` and monitor the deployed GitHub Pages version.

**Final release decision: BLOCKED — review work is on an isolated branch, and static checks must not be presented as production proof.**

## Standards used for review criteria
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- OWASP CSP Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet
- Google web.dev performance guidance: https://web.dev/learn/performance/optimize-resource-loading/
- Playwright: https://playwright.dev/docs/intro
