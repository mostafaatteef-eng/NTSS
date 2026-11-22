# Physics slider precision, local functional candidate

Base: deployed PR20 merge f8697227aed03e295511efa1414b657969b940fe. Not uploaded or release-versioned.

The shared range control used step0.1. Physics grades with max(0.011,0.1%of answer).174questions across23of63physics banks have no legal slider value inside that tolerance, out of1260physics slider items. Example:4/3expects1.333;1.3and1.4both fail.

This patch adds an optional positive finite sliderStep configuration, defaulting to the previous0.1for all other subjects. Physics supplies0.001, matching its generated answer precision. No questions, keys, modes, formulas, model parameters or grading tolerance change. All3150physics items are byte-identical to the baseline.49Node tests and six structural/catalog/grader/performance/certificate/data-analysis checks pass.

Browser proof at390/1280: old HTML range sanitizes1.333to1.3and grades wrong. New range retains1.333;33real arrow-key steps from1.3reach1.333and grade correct. Zero sampled page/CSP errors. Before/after screenshots inspected. This proves reachability, not comfortable precise touch input: a numeric companion may still be preferable on phones. Such a control must retain the slider and be tested for focus, synchronization, disabled state and checkpoint identity before claiming mobile UX complete.

Not release ready: asset versions/cache migration and full browser regression remain pending. Existing prior-release hash assertions normalize only the exact optional-step expression and physics setting, retaining all other protected hashes. CI includes the three added tests; no prior test/job/permission removed.

This functional repair is independent of the held light, measurement and refraction curriculum model review. No speculative academic change is included.
