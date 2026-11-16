# NTSS Security Hardening — November 16, 2026

## Changes implemented
- SQL lab: single read-only SELECT, freshly generated fictional data per run; rejects multiple queries, SQL comments and destructive statements. Input limited to 2,000 characters. Output capped by number of result sets, rows, columns and string-cell lengths.
- Python lab: Python AST preflight rejects common runtime escape patterns and limits imports to introductory data/math modules; program limited to 3,000 characters and output to 8,000 characters. This is **not** a robust security sandbox.
- Coding lab: cancellation invalidates stale worker messages and parent retains its timeout.
- Page: compatible CSP meta policy blocks object/frame content, form submissions and unapproved external page scripts, and limits workers to same-origin. Referrer policy is no-referrer.
- Regression tests: dependency-free Node test file and GitHub Actions workflow on pushes and pull requests.

## Second hardening stage — 2026-11-16

- Moved the entire 43 KB main application script out of index.html to app-main.js, served from the same site. This reduces inline script exposure and is a prerequisite to strict CSP; **inline onclick/oninput handlers still require CSP unsafe-inline**.
- Added browser-security-smoke.cjs and a GitHub Actions workflow .github/workflows/browser-security.yml using Chromium. The suite checks startup, three grade menus, economics lesson navigation, the certificate name/eligibility logic, the browser SQL worker refusing DROP TABLE, mobile width, browser errors and CSP violations.
- Updated security-tests.cjs to parse the extracted app-main.js and assert that there is no inline script block.
- **Status:** the Chromium suite is committed, but successful execution on GitHub Actions or a full real-device browser session was not yet confirmed. Do not report the browser checks as passed until a workflow run succeeds.
- The core grade navigation and assessment modules remain deployed as before, with a versioned app-main.js reference to refresh caches.

## Remaining security limitations
1. The page uses inline scripts and event handlers, requiring CSP 'unsafe-inline' today. This significantly weakens DOM XSS defense. Externalizing handlers, scripts and CSS is needed for a strict CSP.
2. CSP meta tags cannot enforce frame-ancestors or generate CSP reports. These require HTTP headers, which are not configured here.
3. Pyodide and SQL.js are fetched from version-specific jsDelivr CDN paths inside workers. They are not yet self-hosted or integrity-pinned by cryptographic checks, leaving supply-chain risk.
4. Student code execution in a Worker is not a strong sandbox. AST import screening is bypassable by sufficiently determined adversaries. Do not expose credentials or trusted school data to the worker; use a dedicated sandbox origin or stronger constrained execution model for adversarial code.
5. Grades, completion state and locally generated certificates are all client-side and therefore editable. Never use them as official evidence. To issue verifiable certificates, create an authenticated backend, record verified attempts server-side and support revocation/verification.
6. All visible user-controlled strings and innerHTML output paths need a manual DOM XSS audit and browser tests. This commit cannot prove the absence of XSS.
7. GitHub settings are not changed: enable protected main branch, PR review, 2FA and secret scanning via repository administration.
8. Run actual browser/device tests, verify third-party WebAssembly loading and inspect console CSP violations. The committed workflow is not proof that GitHub Actions has executed successfully.

## Verification performed
- JavaScript sources and index inline script parsed; mocked SQL Web Worker accepted two realistic SELECT queries and rejected DROP, UPDATE, multi-statement, comments and oversized input.
- Policy is present in the index source; no complete browser penetration test or deployed-header inspection has been carried out.

## Academic and privacy rules
- Do not require students' ID numbers, contact info, home addresses, secrets, or account credentials in these exercises.
- Certificate student name remains in browser memory only and is not a trusted identity assertion.

## Reference standards
- MDN CSP: https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP
- OWASP CSP: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- SQLite security: https://www.sqlite.org/security.html
- sql.js: https://sql.js.org/