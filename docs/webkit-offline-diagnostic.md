# WebKit offline QA dependency investigation

Base: deployed PR20 merge f8697227aed03e295511efa1414b657969b940fe. Local proposal only.

## Root-cause evidence

The pinned Playwright1.56.1 WebKit fails navigation after context.setOffline(true) even when an independent minimal service worker returns literal HTML or CacheStorage data with no network operation. Both controls verify an active controller and cached document. The same cases pass Chromium. Cutting origin transport instead allows fresh WebKit tabs to read the minimal cached response. This isolates an automation/engine behavior independent of EBDA, not a missing EBDA asset.

Upstream https://github.com/microsoft/playwright/issues/42775 documents the same behavior. Linked fix https://github.com/microsoft/playwright/pull/42894 was merged5Oct2026. A closed issue alone was not treated as proof: isolated Playwright1.64.1 and its matching WebKit were installed and tested locally.

The1.64.1WebKit minimal literal/cache cases pass under both emulated offline and origin-unavailable controls. More importantly, the actual unchanged learning-browser-qa.cjs test logic passes all20subject/device cases,4sizes and each existing fresh-tab offline check against deployedPR20source. The local1.64.1 comparison used an isolated import/launch override for missing host libraries; assertions and offline operations were unchanged. Remote CI on its Ubuntu24.04 runner remains the decisive unmodified-launch check.

## Proposed release scope

Change only the learning-browser-qa workflow's Playwright pin1.56.1to1.64.1. Matching browser/dependency installation remains the existing install step. No application code, service worker, cache version, content, permissions, jobs, assertions, skips or retries change. The other assessment workflow has its own dependency and is not changed.

This is not a real iPhone Safari certification. Earlier origin-cut fresh-tab diagnostic passed8browser/device cases once, but another run failed one WebKit connection; that control remains diagnostic rather than replacement green coverage. Existing same-page reload is not what the current WebKit learning test asserts, and no extra claim is made for it.
