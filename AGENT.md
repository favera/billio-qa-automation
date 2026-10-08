# AGENT.md

## Purpose

This repository is a portfolio-grade QA automation project for
**Billio**, a fintech-style Accounts Payable application.

The first milestone demonstrates Senior QA / SDET / QA Lead capabilities
using only the deployed demo, its role switcher, the UI, and accessible
product documentation. Possible future capabilities include:

-   Risk-Based Testing (RBT)
-   Playwright + TypeScript automation
-   Risk-based assessment of API/server-side and database validation needs
-   Role-dependent UI behavior checks (not authenticated authorization testing)
-   Financial workflow testing
-   State-machine testing
-   Concurrency and idempotency risk assessment; execution is conditional
-   AI-assisted invoice intake checks only if exposed and observable in the demo
-   Recurring bills and scheduled payments
-   CI/CD and reporting
-   Risk-to-test traceability
-   Test reliability and failure analysis

`PLAN.md` is the project roadmap. This file defines how an AI coding
agent should operate inside the repository.

------------------------------------------------------------------------

## 1. Agent Mission

When working in this repository, optimize for **quality engineering**,
not simply test-count growth.

Every meaningful test should answer:

1.  What business or technical risk does this test mitigate?
2.  Why is this test needed?
3.  Why is this the correct test layer?
4.  What failure would it detect?
5.  How does it contribute to risk coverage?

Prefer a small number of high-value, deterministic tests over a large
number of shallow UI tests.

The target outcome is a repository that could credibly be reviewed by:

-   QA Leads
-   SDET Leads
-   Engineering Managers
-   Staff/Principal QA Engineers
-   Fintech engineering teams
-   Hiring managers evaluating automation architecture

------------------------------------------------------------------------

## 2. Source of Truth

Use these sources in this order when making decisions:

1.  Current behavior observed through the permitted Billio demo
2.  Accessible Billio documentation / ADRs
3.  `PLAN.md` (which records current access boundaries)
4.  QA strategy and risk register
5.  Test scenario matrix
6.  RBAC matrix
7.  Traceability documentation
8.  Existing automated tests
9.  Agent assumptions

There is currently no access to the Billio frontend/backend source,
backend interfaces, or database. Do not assume those sources are
available. Never invent application behavior when accessible
documentation or demo behavior can answer the question.

If documentation is inaccessible or behavior is unclear, record the
ambiguity and evidence source rather than silently creating an
assumption. UI observations prove only what was visible in that UI.

------------------------------------------------------------------------

## 3. Repository Boundary

This repository is the **QA automation repository**.

The Billio application belongs to its application repository, which is
not currently accessible to this project.

### Do not:

-   Modify Billio application source code from this repository.
-   Modify application business logic just to make a test pass.
-   Change the production database schema.
-   Add test-only behavior to the application without explicit approval.
-   Remove application validations because they make automation
    difficult.
-   Disable security controls for test convenience.

If an application change is genuinely required to make behavior
testable, report it as a recommendation instead of silently implementing
it.

------------------------------------------------------------------------

## 4. Billio Context and Access Limits

Project context describes Billio as a Next.js application using:

-   Next.js App Router
-   React
-   TypeScript
-   Server Components
-   Client Components
-   Server Actions
-   Prisma
-   PostgreSQL / Neon
-   Zod
-   Vercel
-   Blob-based invoice/document intake
-   Gemini-assisted invoice extraction
-   Vitest for unit/pure logic
-   Playwright for E2E/smoke coverage

These architecture details have not been independently verified from
source code. They must not be treated as confirmed implementation facts.

### Important access rule

No backend interface is currently available for testing. Do not invent
REST endpoints or attempt direct server testing in the first milestone.
If access changes, first determine whether the behavior is implemented
through:

-   Server Actions
-   internal application functions
-   database operations
-   cron handlers
-   browser/network requests
-   supported HTTP interfaces

Then use the lowest appropriate test layer, if the interface is
documented, safe, and authorized for testing.

------------------------------------------------------------------------

## 5. Risk-Based Testing Is Mandatory

Do not add tests simply because a feature exists.

Use:

**Business capability → Risk → Risk analysis → Test scenario → Test
layer → Automation**

The risk register is the primary source for deciding what deserves
strong coverage.

### Risk score

Use:

`RPN = Impact × Likelihood × Detectability`

Each dimension is scored from 1 to 5.

        RPN Priority
  --------- ---------------
    80--125 P0 / Critical
     50--79 P1 / High
     25--49 P2 / Medium
      1--24 P3 / Low

Security and financial-integrity failures may be promoted regardless of
calculated RPN.

Do not treat RPN as an absolute truth. A low-probability failure
involving money, authorization, or data integrity can still require
P0/P1 coverage.

------------------------------------------------------------------------

## 6. Risk IDs and Traceability

Use stable identifiers.

Examples:

-   `RISK-001`
-   `RISK-009`
-   `RISK-016`
-   `AUTH-001`
-   `PAY-003`
-   `CON-003`

Do not casually rename existing IDs.

When adding a meaningful test:

1.  Identify the risk.
2.  Identify or create the scenario.
3.  Link the automated test to the scenario.
4.  Update traceability if required.
5.  Update the risk coverage documentation if coverage changed.

A test without traceability should be considered incomplete for
high-risk functionality.

------------------------------------------------------------------------

## 7. Test Layer Selection

For the first milestone, choose between manual inspection and UI automation
based on what can be observed in the demo. Other layers are conditional
future work requiring access and a safe documented interface.

  Behavior                   Preferred layer
  -------------------------- ----------------------------
  Visible role-dependent behavior   Manual / Playwright UI
  Critical observable journey      Manual / Playwright UI
  Visual interaction               Playwright
  Pure calculation                 Unit (only if project-owned testable code exists)
  Server authorization             Conditional server/API/integration
  Persistence integrity            Conditional DB/integration
  Transaction/concurrency           Conditional integration/API/DB
  AI extraction                     Conditional UI or integration
  Cron processing                   Conditional server/integration

Do not use Playwright for everything.

UI tests are expensive and should primarily cover critical user journeys
and browser-specific behavior.

------------------------------------------------------------------------

## 8. Financial Integrity Rules

Financial workflows require stronger validation than ordinary CRUD.

If suitable access becomes available, validate critical financial
operations as appropriate:

1.  User permissions
2.  Request/input
3.  Server-side authorization
4.  Business rule
5.  Persisted state
6.  Amount
7.  Vendor
8.  Dates
9.  Related payment state
10. Activity/audit history
11. Transaction behavior

In the first milestone, record UI messages and resulting visible state as
UI evidence only. Do not claim that they prove financial integrity or
successful persistence.

------------------------------------------------------------------------

## 9. Bill Lifecycle

The current project plan lists this lifecycle as an example to verify
against accessible documentation and the demo:

`DRAFT → PENDING_APPROVAL → APPROVED → SCHEDULED → PAID`

Rejection can return a bill to:

`DRAFT`

Only document and check transitions actually supported by accessible
documentation or visible behavior. Do not present the following as
confirmed demo behavior until verified. When established, distinguish:

-   Valid transitions
-   Invalid transitions
-   Unauthorized transitions
-   Duplicate transitions
-   Stale transitions
-   Concurrent transitions

Do not test or assert lifecycle states unless they are confirmed by
accessible documentation or demo behavior. Source code is not currently
available.

------------------------------------------------------------------------

## 10. Approval Thresholds

The project context proposes this approval boundary, which must be
verified from accessible documentation or demo behavior before it is
used as an expected result:

-   `$0–$4,999.99` → AP Manager
-   `$5,000+` → Controller

If the demo exposes the relevant inputs and outcomes, consider boundary
checks. Do not treat these values or routing expectations as confirmed
until verified.

If the demo exposes relevant inputs and outcomes, select boundary values
based on the rules verified from accessible documentation or observed
behavior. Do not make these candidate values mandatory when the feature
or expected rule is unverified.

------------------------------------------------------------------------

## 11. Separation of Duties

Assess separation of duties only if the relevant behavior is documented
or exposed by the demo. The role switcher does not establish distinct
authenticated identities.

Potential scenarios, only if supported by accessible docs and demo UI:

-   Role-dependent UI for creator/approver actions
-   Visible approval or rejection result
-   Identity/persistence and crafted-request bypass are conditional
    future checks requiring suitable access

Visible UI behavior is the only first-milestone evidence; it cannot prove
server-side enforcement.

------------------------------------------------------------------------

## 12. Authorization and RBAC

Record roles actually exposed by the demo and documented in accessible
product material. The following names appear in existing project
context, but must be verified before being treated as confirmed:

-   Bookkeeper
-   AP Manager
-   Controller

The first milestone assesses role-dependent UI behavior only. Server
authorization testing is conditional future work.

A hidden button is not proof of authorization.

If a safe server test interface becomes available, unauthorized
operations should be checked for:

-   Request is rejected.
-   Correct authorization error is returned.
-   No unauthorized database mutation occurs.
-   Related activity/audit records are not incorrectly created.

Do not assume an HTTP status or error such as `FORBIDDEN` without an
accessible specification and testable interface.

Never weaken authorization to make tests easier.

------------------------------------------------------------------------

## 13. Demo Role Selection

The demo has no login or session flow. Use only the in-page role
switcher if it is present and reliably operable.

-   Enumerate roles from the actual switcher and accessible documentation.
-   Select the role explicitly in each test or fixture.
-   Assert only observable role-dependent UI behavior.
-   State clearly that this does not prove authenticated identity or
    server-side authorization.
-   Do not add login, credential, or `storageState` flows unless a real
    authentication process becomes available.

Never commit credentials, session tokens, cookies, API keys, or secrets.

------------------------------------------------------------------------

## 14. Playwright Standards

### Locators

Prefer, in order:

1.  Accessible roles
2.  Labels
3.  Text when stable and meaningful
4.  `data-testid` when necessary
5.  Stable semantic attributes

Avoid:

-   Generated CSS classes
-   Deep CSS selectors
-   XPath unless unavoidable
-   DOM structure assumptions

### Waiting

Never use arbitrary sleeps such as:

``` ts
await page.waitForTimeout(5000);
```

Prefer:

-   `expect(...).toBeVisible()`
-   `expect(...).toHaveText()`
-   `expect(...).toHaveURL()`
-   `waitForResponse`
-   `waitForRequest`
-   locator assertions
-   application-specific readiness conditions

A timeout should be evidence of a real synchronization problem, not a
reason to increase waits blindly.

### Test structure

Use:

-   `test.describe`
-   `test.step`
-   descriptive test names
-   reusable fixtures
-   deterministic setup

Example naming:

``` text
[PAY-003] prevents duplicate Pay Now execution
```

or another repository-consistent convention.

------------------------------------------------------------------------

## 15. Test Isolation

Every test should be independently executable. Since demo data may be
shared, keep mutations identifiable, scoped, and safe.

Do not rely on:

-   Test execution order
-   Another test creating data
-   Shared mutable records
-   Previous test state
-   A specific worker executing first
-   Manual cleanup

Prefer unique test data.

If a scenario intentionally tests concurrency, the shared state must be
explicit and controlled.

------------------------------------------------------------------------

## 16. Test Data Strategy

First-milestone test data should be created through supported UI paths
and should be:

-   Deterministic
-   Minimal
-   Readable
-   Reusable where safe
-   Unique where mutation occurs
-   Easy to clean up

Do not assume test accounts, API setup, database cleanup, or server
fixtures are available. Prefer UI-created records with unique run
identifiers where supported. API factories/builders are conditional
future work.

Examples:

``` ts
createVendor()
createBill()
createApprovedBill()
createPendingApprovalBill()
createPayment()
```

Do not create unnecessarily large datasets for simple tests.

------------------------------------------------------------------------

## 17. Database Validation

Database checks are valuable for high-risk workflows but are out of the
first milestone because database access is unavailable.

Use them selectively.

Good candidates include:

-   Unauthorized mutation prevention
-   Financial amount integrity
-   Vendor/payment association
-   State transition persistence
-   Transaction rollback
-   PaymentRun creation
-   Idempotency
-   Activity/audit history
-   Concurrency protection

Avoid direct DB assertions for every UI test.

If safe read access becomes available, use DB validation selectively to
prove critical invariants, not to couple every UI test to implementation
details. Visible UI state is not equivalent to a database assertion.

------------------------------------------------------------------------

## 18. Concurrency and Idempotency

Concurrency is a first-class risk to record. Executable concurrency
tests are conditional future work because no backend or database test
interface is currently available.

Important examples:

-   Two approval attempts
-   Two Pay Now attempts
-   Concurrent process-due executions
-   Stale bill revisions
-   Batch containing stale data
-   Repeated payment processing
-   Transaction failure during financial operation

Do not claim financial consistency from UI-only checks. If a suitable
test interface becomes available, design deterministic checks for
financial consistency.

Do not simulate concurrency with arbitrary delays.

Use controlled parallel requests/promises and deterministic
synchronization.

------------------------------------------------------------------------

## 19. Payment Testing

Payment behavior is high risk. First-milestone checks may cover only
payment behavior exposed through the demo UI.

Where the demo exposes these details, observe UI-visible behavior only:

-   Only eligible bills can be paid.
-   Which roles see or can invoke payment actions in the UI.
-   Displayed amount matches the submitted or displayed bill details.
-   Displayed vendor and payment date match the visible record.
-   What the UI does after a repeated action, if safely testable; this
    does not prove idempotency.
-   Visible status and activity/history behavior after success or failure.
-   Repeated execution is safe.

Do not describe a disabled button or UI message as proof of duplicate
payment prevention. Proving idempotency requires an appropriate
server/integration/database test, which is conditional future work.

------------------------------------------------------------------------

## 20. Scheduled Payments and Process Due

Project context describes scheduled payment and process-due behavior;
verify that these are exposed in accessible documentation or the demo
before treating them as confirmed.

The following cron details are unverified project-context claims, not
first-milestone requirements:

-   Runs at `13:00 UTC`
-   Requires `Authorization: Bearer $CRON_SECRET`
-   Uses `SYSTEM_USER_ID`
-   Shares core processing logic with manual "Run now"

Cron checks are conditional future work. If a safe test interface becomes
available, scenarios may distinguish:

-   Due payment
-   Future payment
-   Unauthorized cron call
-   Missing cron authorization
-   Invalid cron authorization
-   Repeated cron execution
-   Concurrent cron execution
-   PaymentRun behavior
-   Audit actor/system identity

Do not hard-code production secrets.

------------------------------------------------------------------------

## 21. AI Invoice Intake

AI output is **untrusted input**.

The AI extraction layer must not be treated as authoritative financial
truth.

Only test invoice intake if it is exposed and safe to exercise in the
demo. Candidate scenarios, where supported, include:

-   Valid document
-   Corrupted document
-   Missing invoice number
-   Ambiguous vendor
-   Incorrect total
-   Multiple tax rates
-   Unsupported currency
-   Low-quality scan
-   Contradictory document data
-   User correction of extracted values
-   User rejection of extraction
-   Server-side validation after extraction

The critical server-side validation assertion is conditional future work;
UI observations cannot prove that AI output cannot bypass validation.

Do not assume AI extraction is perfectly deterministic.

Tests involving AI should be designed around business invariants and
validation behavior rather than brittle exact model wording.

------------------------------------------------------------------------

## 22. Known Product Limitations

Record product limitations only when confirmed by accessible
documentation or demo observation. Older project context lists these
unverified examples:

-   Duplicate invoice detection is not implemented.
-   Refunds/voids/reversals are not implemented.
-   Unscheduling is not implemented.
-   Partial payments are not implemented.
-   CSV bulk upload is not implemented.
-   Persisted invoice attachments are not implemented.
-   Editable settings are not implemented.

Do not create tests that claim these capabilities exist.

If a limitation is relevant to a risk, document it as:

-   Known limitation
-   Coverage gap
-   Risk acceptance
-   Future enhancement

Do not disguise an unsupported feature as a passing test.

------------------------------------------------------------------------

## 23. Shared Database Awareness

Whether environments share a database is currently unknown because
application documentation and database access are not available. Treat
shared-data risk as a precaution when modifying demo records, not as a
confirmed architecture fact.

This creates risks involving:

-   Data contamination
-   Test collisions
-   Concurrent execution
-   Accidental destructive operations
-   Non-deterministic assertions

Therefore:

-   Prefer isolated test data.
-   Avoid destructive cleanup against shared environments.
-   Never delete broad datasets.
-   Never run destructive tests against production without explicit
    authorization.
-   Clearly document environment assumptions.
-   Do not assume a dedicated test database is available for CI.

------------------------------------------------------------------------

## 24. Tags and Test Suites

Use tags consistently.

Use only tags that match implemented checks. Possible conceptual groups:

-   `@p0`
-   `@p1`
-   `@p2`
-   `@p3`
-   `@rbac`
-   `@payments`
-   `@concurrency`
-   `@ai`
-   `@cron`
-   `@database`

A test may have multiple relevant tags. Do not use authentication tags
for the current demo role-switcher checks.

Keep the first-milestone UI suite small and safe for frequent execution.

------------------------------------------------------------------------

## 25. CI/CD Philosophy

If CI is configured, begin with QA-repository lint/typecheck and the
implemented demo UI suite only when it is stable and safe to run. Broader
or scheduled runs are optional and should reflect available coverage.

### Pull requests (first milestone)

Run, when implemented and safe:

-   QA repository lint/typecheck
-   Stable demo UI checks

### Main branch

Run, if useful:

-   Expanded demo UI checks
-   Reporting

### Scheduled/nightly

Run only when safe interfaces and access exist:

-   Broader regression and conditional integration/database coverage

Do not solve slow CI by simply increasing parallelism.

First identify whether tests are isolated and safe to run concurrently.

------------------------------------------------------------------------

## 26. Failure Triage

When a test fails, classify the failure before modifying the test.

Possible classifications:

1.  Product defect
2.  Automation defect
3.  Test-data defect
4.  Environment defect
5.  Dependency/service failure
6.  Requirement ambiguity
7.  Known product limitation
8.  Flaky test

Do not immediately add retries or longer timeouts.

For a suspected flaky test:

1.  Reproduce.
2.  Inspect logs/traces.
3.  Determine root cause.
4.  Fix synchronization or isolation.
5.  Re-run repeatedly.
6.  Document if unresolved.

Retries must never be used to hide real failures.

------------------------------------------------------------------------

## 27. Playwright Artifacts

For failed critical tests, preserve useful evidence where practical:

-   Trace
-   Screenshot
-   Video when enabled
-   Console logs
-   Network information
-   Relevant application state

Artifacts should help explain the failure, not merely prove that the
test failed.

------------------------------------------------------------------------

## 28. API / Server Testing

Server-side testing is out of the first milestone. If access changes:

-   Identify the actual implementation mechanism.
-   Use direct server/API testing only through a safe, documented, authorized interface.
-   Validate authorization independently of UI.
-   Validate response/error behavior.
-   Validate database state for critical mutations only if safe DB access is available.

Do not create fake REST endpoints merely to make the framework fit a
conventional API-testing pattern.

------------------------------------------------------------------------

## 29. State-Machine Testing

For lifecycle-heavy features, explicitly model:

### Valid transitions

Example:

``` text
DRAFT → PENDING_APPROVAL
PENDING_APPROVAL → APPROVED
PENDING_APPROVAL → DRAFT
APPROVED → SCHEDULED
SCHEDULED → PAID
```

### Invalid transitions

Examples:

``` text
DRAFT → PAID
PAID → DRAFT
PAID → APPROVED
SCHEDULED → PENDING_APPROVAL
```

For the first milestone, assert only visible transition behavior. Proving
server/business-rule rejection is conditional future work requiring a
suitable test interface.

------------------------------------------------------------------------

## 30. Coding Style

Use the project's existing TypeScript configuration and conventions.

Prefer:

-   Type-safe code
-   Small reusable helpers
-   Explicit names
-   Clear business terminology
-   Minimal duplication
-   Pure functions where appropriate
-   Strong typing for test data
-   Async/await
-   Early failure for invalid setup

Avoid:

-   `any` unless justified
-   Giant utility files
-   Generic helpers that hide important behavior
-   Magic constants
-   Copy/paste test blocks
-   Over-engineering

------------------------------------------------------------------------

## 31. Test Naming

Test names should describe behavior and risk.

Good:

``` text
prevents a Bookkeeper from approving a bill
```

Better when traceability is explicit:

``` text
[AUTH-005] prevents a Bookkeeper from approving a bill
```

Avoid:

``` text
test approval
```

or:

``` text
should work
```

------------------------------------------------------------------------

## 32. New Test Workflow

When asked to add a test:

### Step 1 --- Understand

Inspect available project artifacts:

-   Existing tests
-   Demo behavior and accessible documentation
-   Risk register
-   Scenario matrix

### Step 2 --- Identify risk

Determine:

-   Risk ID
-   Priority
-   Business impact
-   Expected invariant

### Step 3 --- Choose layer

For the first milestone, choose manual inspection or Playwright UI.
Other layers are conditional future work. Possible layers if access becomes
available include:

-   Unit
-   Integration
-   Server/API
-   DB
-   Playwright
-   Multiple layers

### Step 4 --- Design

Define:

-   Preconditions
-   Test data
-   Action
-   Expected result
-   Observable expected result and its evidence source
-   Safe cleanup requirements; do not assume direct database cleanup

### Step 5 --- Implement

Follow existing repository conventions.

### Step 6 --- Execute

Run the smallest relevant suite first when a runnable suite exists. Do
not perform demo actions that could create broad or irreversible changes.

Then run broader coverage if necessary.

### Step 7 --- Diagnose

If it fails, determine why before modifying assertions.

### Step 8 --- Trace

Update documentation/traceability when the new test changes risk
coverage.

------------------------------------------------------------------------

## 33. New Risk Workflow

When a new feature or risk is discovered:

1.  Describe the business capability.
2.  Identify failure modes.
3.  Score Impact.
4.  Score Likelihood.
5.  Score Detectability.
6.  Calculate RPN.
7.  Assign priority.
8.  Define mitigation.
9.  Create scenarios.
10. Choose test layers.
11. Automate only scenarios feasible with available demo access; mark
    others as conditional or unverified.
12. Update traceability.

Do not start with Playwright code.

------------------------------------------------------------------------

## 34. What the Agent Must Not Do

Never:

-   Invent application functionality.
-   Invent REST endpoints.
-   Disable authorization checks.
-   Commit secrets.
-   Commit real customer/financial data.
-   Use production credentials.
-   Modify application behavior silently.
-   Delete broad database data.
-   Add arbitrary sleeps.
-   Add retries to hide defects.
-   Make every test E2E.
-   Treat UI visibility as proof of authorization.
-   Treat AI output as trusted financial data.
-   Claim database integrity without database evidence for critical financial workflows.
-   Rename risk IDs casually.
-   Mark a known limitation as a passing feature.
-   Remove failing tests without explaining why.
-   Skip tests permanently without documenting the reason.

------------------------------------------------------------------------

## 35. Security and Secrets

Never commit:

-   Passwords
-   API keys
-   Session cookies
-   OAuth tokens
-   Database credentials
-   Stripe secrets
-   Cron secrets
-   Production credentials
-   Private customer data

Use environment variables.

Recommended pattern:

``` text
.env.example
.env.local
```

Only `.env.example` should contain safe placeholders.

------------------------------------------------------------------------

## 36. Git Workflow

Use focused branches.

Examples:

``` text
feat/project-bootstrap
feat/risk-register
feat/demo-role-ui
feat/first-milestone-ui
feat/payment-tests
feat/concurrency-tests
feat/ai-invoice-tests
feat/ci-pipeline
docs/traceability
fix/playwright-sync
```

Commits should be focused and explain intent.

Examples:

``` text
feat: add demo role-selection UI coverage
test: observe repeated payment action behavior
test: cover verified approval boundary behavior
docs: add payment risk traceability
fix: stabilize payment readiness assertion
```

Avoid mixing unrelated refactors with test changes.

------------------------------------------------------------------------

## 37. Pull Request Expectations

A meaningful PR should explain:

-   What changed
-   Why it changed
-   Risk covered
-   Test layer selected
-   Tests executed
-   Results
-   Known limitations
-   Follow-up work if applicable

For significant changes, include risk/scenario IDs.

------------------------------------------------------------------------

## 38. Definition of Done

A QA automation change is complete when:

-   The behavior is understood.
-   Relevant risk is identified.
-   The appropriate test layer is selected.
-   Test data is deterministic.
-   The test is isolated.
-   Assertions verify meaningful business behavior.
-   No arbitrary waits are used.
-   No secrets are introduced.
-   Assertions do not claim persistence or server behavior without
    evidence from an appropriate test layer.
-   The targeted suite passes.
-   Broader relevant suites pass or failures are explained.
-   Traceability is updated when required.
-   Documentation remains accurate.

------------------------------------------------------------------------

## 39. Portfolio Quality Bar

This repository is intended to demonstrate engineering judgment.

Prefer demonstrating:

-   Why a test exists
-   Why it is automated
-   Why it belongs at a particular layer
-   How risk is prioritized
-   What role-dependent UI behavior was observed and what server authorization remains unverified
-   Which financial risks were checked in the UI and which require deeper access
-   How concurrency risks were assessed and what evidence would be needed to test them
-   How test data is managed
-   How failures are diagnosed
-   How CI is structured
-   How coverage is measured

A recruiter should be able to see more than "I know Playwright."

The repository should communicate:

> I can design a quality strategy, identify risk, build maintainable
> automation, protect financial workflows, and lead quality engineering
> decisions.

------------------------------------------------------------------------

## 40. Agent Response Format

When completing repository work, report:

### Changed

List files changed or created.

### Why

Explain the quality/risk reason.

### Tests

List the commands executed and results.

### Risk coverage

List affected risk/scenario IDs.

### Notes

Mention assumptions, limitations, or follow-up work.

Keep explanations concise but technically useful.

------------------------------------------------------------------------

## 41. Final Principle

The goal is not maximum automation.

The goal is **maximum confidence per meaningful test**.

For every important change, ask:

> What could go wrong, how bad would it be, how likely is it, how
> difficult would it be to detect, and what is the cheapest reliable
> test that gives us confidence?

That question should drive the repository.
