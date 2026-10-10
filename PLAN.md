# Billio QA Automation Project — PLAN

## 1. Project Goal

Build a QA portfolio project for the Billio Accounts Payable demo that demonstrates Senior SDET / QA Lead skills, beginning with evidence available through the deployed UI and accessible documentation:

- Risk-Based Testing (RBT)
- Test strategy and risk analysis
- Playwright with TypeScript
- API/server-side testing only if a safe, documented interface becomes available later (not part of the first milestone)
- Database validation only if access becomes available later (not part of the first milestone)
- Role-based feature access testing through the demo role switcher; authentication testing is out of scope for this demo
- Financial workflow testing
- Concurrency and idempotency risk assessment, with execution deferred unless a suitable interface becomes available
- AI-assisted invoice testing only for behavior reachable and observable in the demo
- Test data management
- CI/CD with GitHub Actions
- Reporting and quality metrics
- Traceability between business risks and automated tests

The goal is **not** to maximize the number of automated tests.

The first milestone is limited to what can be checked using the deployed demo, its role switcher, the UI, and accessible product documentation. Identify the highest-value observable risks, select an appropriate check, automate feasible checks reliably, and report coverage limits honestly.

---

# 2. Project Context

## Application Under Test

**Billio** — Accounts Payable application.

Application:
`https://billio-psi.vercel.app/`

Documentation:
`https://billio-psi.vercel.app/docs`

The application is described in existing project context as using a full-stack Next.js architecture with:

- Next.js 15 / App Router
- React
- TypeScript
- Server Components
- Server Actions
- Prisma
- PostgreSQL / Neon
- Zod validation
- Vercel
- AI-assisted invoice intake
- Scheduled payment processing
- Vitest
- Playwright

These architecture details have not been independently verified from source code. The automation repository remains separate from the application repository; the author currently has no access to the Billio frontend or backend repository.

### Current environment and access assumptions

- The target is the demo site at `https://billio-psi.vercel.app/`.
- The demo has no login or session process. Select test roles using the in-page role switcher dropdown.
- Use accessible Billio documentation, including the [per-feature role-gating decision](https://billio-psi.vercel.app/docs/decisions/0012-per-feature-role-gating) when reachable, as a source for documented roles and permissions; verify observable behavior in the demo. Record inaccessible or unverified documentation as an open limitation.
- The role switcher is a demo mechanism. It can demonstrate feature gating for selected roles, but does not prove authenticated identity or production-grade server authorization unless the application exposes a separate way to verify that.
- There is no access to the application source repositories, backend interfaces, or database. Source-level, API/server, and direct persistence testing are conditional future work and must not block or be represented as part of the first milestone.
- Creating and changing demo data is allowed. Use unique, identifiable records and avoid broad destructive cleanup.
- UI-observable results are evidence of UI behavior only, not proof of server authorization, database persistence, transaction atomicity, or financial ledger integrity.
- The execution order below is a working sequence and may be adjusted as reconnaissance reveals constraints or opportunities.

Revisit these assumptions if access or demo behavior changes.

---

# 3. Guiding Principles

## 3.1 Risk before automation

Do not start by writing Playwright tests.

Start with:

`Business capability → Risk → Risk analysis → Test scenario → Test level → Automation`

## 3.2 Test at the lowest appropriate level

Use the appropriate testing layer:

- Playwright or manual UI checks for critical user journeys and role-gated behavior visible through the demo role switcher
- Unit, API/server/integration, and database checks only as conditional future work if safe access becomes available
- Manual testing only where automation provides insufficient value

## 3.3 Financial and security risks receive priority

Financial integrity, authorization, data integrity, concurrency, and payment risks receive priority even when their probability is relatively low. The role switcher can show role-dependent UI behavior; it does not establish authenticated identity or prove server-side authorization. Authentication and server authorization testing are out of scope for the first milestone.

## 3.4 Avoid UI-only validation

A UI showing the expected result is evidence only for what is observable in the UI. It cannot establish persistence or server-side behavior.

If suitable access becomes available in a future phase, validate critical financial workflows across:

- UI state
- server response
- persisted database state
- resulting business state
- audit/activity history when applicable

## 3.5 Treat AI output as untrusted input

AI-generated invoice fields must pass normal validation and business rules.

Do not assume that correct-looking AI output means correct persisted financial data.

## 3.6 Automation quality matters

Avoid:

- arbitrary sleeps
- brittle selectors
- duplicated setup
- test-order dependencies
- shared mutable test data
- unnecessary end-to-end coverage
- tests that depend on another test passing

---

# 4. Project Phases

## Phase 0 — Repository and Demo Access Setup

### Objectives

Prepare the repositories and development environment.

### Tasks

- [x] Confirm that Billio source-repository access is unavailable and is not required for the first milestone.
- [x] Create a separate QA automation repository.
- [x] Add this `PLAN.md` to the automation repository.
- [x] Document the repository relationship and current access boundary in `docs/access-and-environment.md`.
- [x] Confirm the allowed environment: the Billio demo site.
- [x] Record the supplied demo access model: roles are selected with the in-page dropdown; there is no login/session flow.
- [x] Confirm database access status: unavailable for now; defer DB validation.
- [x] Confirm from the supplied project context that roles are selectable; enumerate names and expected permissions during reconnaissance.
- [x] Confirm invoice intake is exposed on `/bills/new`: the UI offers “From PDF or image” with a drop zone/file picker. Use only synthetic, non-sensitive fixtures; file retention and processing behavior were not established during this Phase 0 check.
- [x] Confirm restrictions on modifying application data: creating and changing demo data is allowed; use controlled, identifiable records.

### Deliverable

A separate repository configured to inspect and, where feasible, automate the deployed demo safely. The current relationship and access boundary are documented in `docs/access-and-environment.md`. Running the application locally is not a first-milestone requirement.

---

# 5. Phase 1 — Application Reconnaissance

Before creating tests, understand the product behavior that can be observed through the demo and accessible documentation.

## Objectives

Map visible product areas, available roles, observable business rules, and critical workflows. Do not infer hidden architecture or data behavior.

### Tasks

- [x] Review accessible product documentation and record inaccessible pages.
- [x] Inventory visible product areas, navigation, role options, and key workflows.
- [x] Record entities, states, and relationships only where the UI/docs establish them.
- [x] Identify roles and permissions.
- [x] Identify bill lifecycle states.
- [x] Identify approval rules.
- [x] Identify payment rules.
- [x] Identify recurring bill behavior.
- [x] Identify invoice intake behavior.
- [x] Identify cron/scheduled processing.
- [x] Identify validation rules.
- [x] Note concurrency/idempotency risks; mechanisms are documented but unverified without controlled access/source-level validation.
- [x] Identify visible audit/activity history, if available.
- [x] Identify known product limitations.
- [x] Identify external dependencies.

### Deliverable

`docs/demo-overview.md`, including observed behavior, evidence sources, unknowns, and limitations. Completed 2026-10-08.

---

# 6. Phase 2 — Risk-Based Testing Strategy

Create the RBT model from observed demo capabilities and accessible documentation before implementing automation. Mark uncertain likelihoods, causes, and mitigations as estimates or unknowns.

## Risk scoring

Use a 1–5 scale.

### Impact

| Score | Definition |
|---|---|
| 5 | Financial loss, unauthorized action, data corruption, critical workflow failure |
| 4 | Major business workflow failure |
| 3 | Important functionality impaired |
| 2 | Limited business impact |
| 1 | Negligible impact |

### Likelihood

| Score | Definition |
|---|---|
| 5 | Very likely |
| 4 | Likely |
| 3 | Possible |
| 2 | Unlikely |
| 1 | Rare |

### Detectability

Higher score means harder to detect before production.

| Score | Definition |
|---|---|
| 5 | Very difficult to detect |
| 4 | Requires specialized/integration testing |
| 3 | Moderately detectable |
| 2 | Easily detectable |
| 1 | Immediately obvious |

### RPN

`RPN = Impact × Likelihood × Detectability`

Maximum RPN = 125.

### Priority

| RPN | Priority |
|---:|---|
| 80–125 | P0 / Critical |
| 50–79 | P1 / High |
| 25–49 | P2 / Medium |
| 1–24 | P3 / Low |

### Critical override

Regardless of RPN, security authorization failures and financial integrity failures must be treated as at least high priority.

---

# 7. Phase 3 — Risk Register

Create:

`docs/risk-register.md`

Completed 2026-10-08; see `docs/risk-register.md`. Estimates and
conditional future-work items are explicitly marked in the register.

Each risk should contain:

- Risk ID
- Feature/domain
- Risk description
- Business consequence
- Technical cause
- Impact
- Likelihood
- Detectability
- RPN
- Priority
- Existing mitigation
- Proposed test coverage
- Automation strategy
- Status

## Initial high-risk areas

The initial register should consider these domains, then include those confirmed by accessible documentation or visible in the demo. Mark others as unverified or out of first-milestone scope rather than implying they were inspected:

- Authorization / RBAC
- Bill lifecycle
- Approval thresholds
- Separation of duties
- Payment execution
- Payment scheduling
- Duplicate payment
- Payment amount
- Payment date
- Concurrency (risk assessment only unless observable through the UI)
- Idempotency (risk assessment only unless observable through the UI)
- Financial calculations
- Vendor authorization
- GL coding
- Audit trail
- AI invoice extraction
- Invoice validation
- Recurring bills
- Cron processing (conditional future work)
- Database integrity (conditional future work)
- Transaction rollback (conditional future work)
- Dashboard/AP aging

---

# 8. Phase 4 — Test Scenario Matrix

Create:

`docs/test-scenarios.md`

Completed 2026-10-10; the matrix maps all current risks to one or more
scenarios and labels first-milestone versus conditional future coverage.

Map each identified risk to one or more scenarios.

Each scenario should contain:

- Scenario ID
- Risk ID
- Feature
- Scenario
- Preconditions
- Expected result
- Test type
- Test layer
- Priority
- Automation candidate
- Data requirements
- Dependencies

Example:

```text
Risk:
RISK-004 — Duplicate payment

Scenario:
PAY-003 — Two Pay Now requests for the same bill

Layer:
Demo UI observation (first milestone); API / DB validation is conditional future work

Priority:
P0

Expected:
Observe whether the UI prevents or reports a repeated payment action, if the demo exposes that flow. This cannot establish that no duplicate persisted payment exists.
```

Let observed capabilities and risks determine scenario count. The former 80–120 figure is a nonbinding estimate, never a quota.

---

# 9. Phase 5 — RBAC and Authorization Matrix

Create:

`docs/rbac-matrix.md`

Completed 2026-10-10; see `docs/rbac-matrix.md` for documented
permissions, observed UI behavior, evidence confidence, and limitations.

Document roles and permissions described in accessible product documentation and behavior observed through the demo role switcher. No source-code or server-side authorization claims are in scope for the first milestone.

For each role/action combination, define:

- Allowed?
- Expected visible UI behavior
- Observable result after the action, if any
- Evidence source (documentation page or demo observation)
- Confidence and limitations; server response, persistence, and audit expectations only where directly observable

Important principle:

> Role-switcher behavior demonstrates role-dependent UI behavior only. It does not prove authenticated identity or server-side authorization.

Server-side authorization scenarios are conditional future work and should be added only if a safe, documented test interface and suitable access become available.

Examples of UI-level scenarios (when exposed):

- A role does not see an approval action, or the UI blocks it.
- A role does not see a payment action, or the UI blocks it.
- The visible bill/payment state remains unchanged after a blocked UI action.

Do not label these checks as proof that an unauthorized server mutation is impossible.

---

# 10. Phase 6 — Test Architecture Design

Define the automation architecture before writing many tests.

Completed 2026-10-10; see [`docs/automation-architecture.md`](docs/automation-architecture.md)
for the proposed suite layout, configuration, role fixtures, test-data
boundaries, evidence rules, and reporting approach. This phase defines the
design only; framework bootstrap is Phase 7.

Recommended structure:

```text
billio-qa-automation/
│
├── docs/
│   ├── demo-overview.md
│   ├── qa-strategy.md
│   ├── risk-register.md
│   ├── test-scenarios.md
│   ├── rbac-matrix.md
│   └── traceability-matrix.md
│
├── tests/
│   ├── authorization/
│   ├── vendors/
│   ├── bills/
│   ├── approvals/
│   ├── payments/
│   ├── recurring-bills/       # only if exposed and observable in demo
│   ├── invoice-intake/        # only if exposed and observable in demo
│   └── dashboard/
│
├── fixtures/
├── test-data/
├── utils/
├── config/
│
├── playwright.config.ts
├── package.json
└── README.md
```

---

# 11. Phase 7 — Automation Stack

Initial stack:

- TypeScript
- Playwright
- Playwright Test
- Node.js
- GitHub Actions
- A suitable reporting solution if the initial suite benefits from it
- ESLint
- Prettier

Potential supporting tools:

- dotenv
- date-fns/date-fns-tz
- APIRequestContext
- custom Playwright fixtures

Do not add dependencies unless they solve a demonstrated problem.

---

# 12. Phase 8 — Environment Configuration

Create environment-specific configuration.

Example:

```text
.env.example
.env.local
```

Never commit:

- passwords
- API keys
- database credentials
- CRON secrets
- production secrets
- personal access tokens

Expected variables should be documented in `.env.example`.

First-milestone example:

```text
BASE_URL=
```

Add other variables only when a confirmed demo testing need exists. Do not add credential or database variables for the first milestone.

---

# 13. Phase 9 — Test Data Strategy

Create a controlled test-data strategy for scenarios reachable through the demo UI.

## Objectives

Tests must avoid depending on uncontrolled shared records.

Define only data needed by observed UI scenarios; do not assume test accounts, API setup, or database cleanup are available. Potential data types, only if present in the demo:

- user accounts
- roles
- vendors
- bills
- line items
- approval thresholds
- payment records
- recurring bill definitions
- invoice documents
- GL accounts

Prefer deterministic data.

Example:

```text
test-vendor-{runId}
test-bill-{runId}
```

Create data through the supported UI in the first milestone. API/server-action creation and direct cleanup are conditional future work. Use unique identifiers where supported and avoid broad cleanup.

---

# 14. Phase 10 — Role Selection Strategy

The demo has no login or session process. Implement reusable Playwright setup for selecting a role through the in-page role switcher.

Recommended approach:

- Identify the role switcher and its supported options during reconnaissance.
- Select the required role explicitly in each test or fixture so role state is clear and isolated.
- Verify role changes take effect in the UI and in the specific visible behavior being tested; report this as role-dependent UI coverage only.
- Do not add login, credential, or `storageState` flows unless the application gains a real authentication process.

Potential role fixtures:

```text
fixtures/roles/
├── <documented-role-a>
└── <documented-role-b>
```

Use only roles actually exposed by the demo and documented by the application.

---

# 15. Phase 11 — Build the First-Milestone UI Suite

The first automation should not attempt to cover everything.

Build the highest-risk flows first.

## First-milestone candidate suite

Select only scenarios supported by observed UI and documented expectations. Assign priority through the risk register; do not assume every item below exists or is testable.

### Role selection and access

- [ ] Role switcher exposes the documented roles
- [ ] Selecting a role applies the expected feature access

### Role-dependent UI behavior

- [ ] Verify a restricted action is unavailable or blocked in the UI for a selected role, if the demo exposes this behavior

### Bills

- [ ] Create bill
- [ ] Correct lifecycle transition
- [ ] Reject bill
- [ ] Approval threshold boundary
- [ ] Invalid state transition

### Approval

- [ ] Correct approver selected
- [ ] Approval behavior matches documented/observed role expectations
- [ ] Separation-of-duties behavior assessed if exposed in the UI; do not infer enforcement beyond visible behavior

### Payments

- [ ] Approved bill can be paid
- [ ] UI blocks payment for an unapproved bill, if this state/action is exposed
- [ ] Correct payment amount
- [ ] Correct vendor
- [ ] Correct payment date
- [ ] Repeated payment action behavior observed, if safely testable; no persistence/idempotency claim

### Data integrity

- [ ] Bill details shown after creation match submitted data (DB persistence assertion deferred)
- [ ] Payment state matches observable bill/payment state (DB comparison deferred)
- [ ] Record transaction atomicity as unverified unless the demo exposes evidence that can establish it

---

# 16. Phase 12 — API / Server-Side Testing

Do not force future server-side tests through the browser, but keep API/server testing out of the first milestone because source and backend access are unavailable.

If access changes, inspect the documented interface and confirm it is safe and authorized to test before adding server-side coverage.

Prioritize:

- Authorization
- Validation
- State transitions
- Payment processing
- Cron processing
- Idempotency
- Error handling
- Transaction behavior

Examples:

```text
Unauthorized request
        ↓
Expected FORBIDDEN
        ↓
No observable business-state mutation (database check deferred)
```

This layer should provide faster feedback than full browser tests.

---

# 17. Phase 13 — Database Validation

Database validation is conditional future work requiring safe database access. In the first milestone, record observable UI state, action feedback, and activity/history where available. Treat these as UI evidence, not proof of database integrity.

Examples:

### Bill creation

```text
UI/API request
      ↓
Bill record
      ↓
Line items
      ↓
Total
      ↓
Activity record
```

### Payment

```text
Payment request
      ↓
PaymentRun
      ↓
Bill status
      ↓
Journal entry
      ↓
Activity
```

Database validation is not part of the first-milestone acceptance criteria. Reassess it only if safe read access is granted.

Do not make UI tests dependent on direct database access. Direct DB validation remains deferred unless access becomes available.

---

# 18. Phase 14 — State Machine Testing

Represent only bill lifecycle states and transitions established by accessible documentation or observed UI behavior. Mark other transitions as unknown.

Expected valid transitions:

```text
DRAFT
  ↓
PENDING_APPROVAL
  ↓
APPROVED
  ↓
SCHEDULED
  ↓
PAID
```

Rejected bills:

```text
PENDING_APPROVAL
        ↓
      DRAFT
```

Where exposed and observable, create checks for:

- Valid transitions
- Invalid transitions
- Role restrictions
- Concurrent transitions (conditional future work)
- Stale revisions (conditional future work)
- Observable post-transition UI state; this does not prove persistence
- Activity history

This should become one of the strongest parts of the automation framework.

---

# 19. Phase 15 — Financial Boundary Testing

Prioritize boundary values.

Approval threshold examples:

```text
$0
$0.01
$4,999.98
$4,999.99
$5,000.00
$5,000.01
```

Also test:

- zero values
- decimal precision
- rounding
- tax
- subtotal
- total
- negative values
- missing values
- very large values
- currency/date boundaries where applicable

Avoid floating-point assumptions.

Validate the application's actual financial rules.

---

# 20. Phase 16 — Concurrency and Idempotency

Record these risks. Implement checks only for behavior directly exposed by the demo; otherwise defer execution until a safe test interface is available:

- Double-click Pay Now
- Two simultaneous payment requests
- Two approval requests
- Stale bill revision
- Concurrent process-due execution
- Re-running a cron job
- Repeating a batch operation
- Retrying a failed operation

Expected principle:

> Retrying a financial operation must not create duplicate financial effects.

This is a major SDET showcase area.

---

# 21. Phase 17 — Invoice AI Testing

If invoice intake is exposed in the demo and safe to exercise, create identifiable fixtures:

```text
test-data/invoices/
├── valid/
├── malformed/
├── boundary/
├── ambiguous/
└── invalid/
```

Test:

- Valid PDF
- Valid image
- Corrupted document
- Missing fields
- Incorrect extraction
- Ambiguous vendor
- Incorrect amount
- Incorrect tax
- Incorrect date
- Incorrect invoice number
- User correction
- AI output validation
- Rejection of invalid data
- Persistence of corrected data

Key principle:

> AI extraction is probabilistic; business validation must remain deterministic.

---

# 22. Phase 18 — Recurring Bills

Automate:

- Daily/weekly/monthly generation where supported
- Start date
- End condition
- Number of occurrences
- Approval mode
- Generated bill correctness
- Duplicate occurrence protection
- Payment scheduling
- Approval behavior

Use date/time utilities carefully and avoid tests that depend on the real current date without control.

---

# 23. Phase 19 — Cron Testing

Test the shared process-due functionality.

Scenarios:

- Valid authorization
- Missing authorization
- Invalid authorization
- Due bill
- Future bill
- Already processed bill
- Multiple due bills
- Concurrent execution
- Repeat execution
- Failure recovery
- Correct PaymentRun creation
- Correct audit/activity information

Cron tests should be deterministic and should not require waiting for the real scheduled job.

---

# 24. Phase 20 — CI/CD

Create GitHub Actions workflows after a feasible demo UI suite exists.

## Pull Request workflow

For the first-milestone UI suite, run only checks that are implemented and configured:

- lint and typecheck for the QA repository
- demo UI checks, if stable and safe to run in CI

## Main branch workflow

Run:

- expanded demo UI regression
- reporting
- API/database coverage only if access and a safe interface become available

Example conceptual pipeline:

```text
Pull Request
     ↓
Lint
     ↓
Typecheck
     ↓
Unit Tests
     ↓
First-Milestone UI Checks
     ↓
Result
```

Optional scheduled run, if safe and stable:

```text
Expanded Demo UI Checks
      +
Report
```

---

# 25. Phase 21 — Reporting

Produce useful test reports.

Track:

- Total tests
- Passed
- Failed
- Skipped
- Flaky
- Execution time
- high-priority risk coverage and pass rate
- Risk coverage
- Automation coverage
- Defects by risk category

Avoid presenting "number of automated tests" as the primary quality metric.

---

# 26. Phase 22 — Risk Coverage

Create a traceability matrix:

```text
Risk
 ↓
Scenario
 ↓
Test
 ↓
Automation
 ↓
Result
```

Example:

```text
RISK-004
Duplicate payment
    ↓
PAY-003
Double Pay Now
    ↓
tests/payments/duplicate-payment.spec.ts
    ↓
Demo UI observation (first milestone); API / DB validation conditional
    ↓
PASS
```

Define:

### Risk Coverage

```text
High-risk, observable scenarios with automated coverage
------------------------------------------------
Total high-risk scenarios
```

Track risk priorities separately, and report automated checks, manual observations, and unverified risks as distinct coverage categories.

---

# 27. Phase 23 — Defect and Failure Analysis

When a test fails, classify the failure.

Possible categories:

- Product defect
- Automation defect
- Test-data defect
- Environment issue
- Dependency failure
- Requirement ambiguity
- Expected product limitation

Do not automatically classify every failed test as a product bug.

Maintain:

`docs/known-limitations.md`

for documented behavior that is intentionally out of scope.

---

# 28. Phase 24 — Reliability / Flakiness

Before considering the framework production-quality:

- [ ] Remove arbitrary waits.
- [ ] Use deterministic locators.
- [ ] Avoid test-order dependencies.
- [ ] Isolate mutable test data.
- [ ] Retry only where justified.
- [ ] Investigate every flaky test.
- [ ] Measure execution time.
- [ ] Run the first-milestone UI suite repeatedly.
- [ ] Ensure parallel execution is safe.
- [ ] Record shared-database and concurrency risks as unverified unless the demo provides a meaningful observable check.

A test should not be marked stable simply because it passes once.

---

# 29. Phase 25 — QA Documentation

The repository should eventually contain:

```text
docs/
├── demo-overview.md
├── qa-strategy.md
├── risk-register.md
├── test-scenarios.md
├── rbac-matrix.md
├── traceability-matrix.md
├── test-data-strategy.md
├── automation-architecture.md
├── known-limitations.md
└── quality-metrics.md
```

The README should explain:

1. What Billio is, based on accessible product information
2. What the project tests
3. Why RBT was selected
4. How risks are scored
5. How tests are prioritized
6. Test architecture
7. Technology stack
8. How to run locally
9. CI/CD
10. Reporting
11. Risk coverage
12. Example test results
13. Known limitations
14. What would be improved for production

---

# 30. Suggested Git Workflow

Use small, meaningful branches.

Examples:

```text
feat/project-bootstrap
feat/risk-register
feat/rbac-tests
feat/bill-lifecycle
feat/payment-tests
feat/invoice-intake
feat/ci-pipeline
docs/qa-strategy
```

Commit examples:

```text
docs: add initial risk register
feat: add demo role-selection fixture
test: cover approval threshold boundaries
test: add payment idempotency coverage
test: validate unauthorized payment attempts
ci: add P0 regression workflow
docs: add risk traceability matrix
```

---

# 31. Definition of Done

The project should not be considered complete merely because the tests pass.

## QA strategy

- [ ] RBT strategy documented
- [x] Risk register completed
- [x] Test scenario matrix completed
- [x] RBAC matrix completed
- [ ] Traceability implemented

## First-milestone automation

- [x] Playwright architecture designed and documented
- [ ] Demo role-selection support implemented, if the UI permits reliable selection
- [ ] Test data strategy implemented
- [ ] Selected high-risk, observable UI scenarios automated
- [ ] Inaccessible and unverified risks documented as limitations

## Conditional future work

- [ ] Reassess source-level, API/server, database, concurrency/idempotency, cron, and deeper AI validation if access or a safe interface becomes available

## CI/CD

- [ ] PR pipeline
- [ ] First-milestone UI regression
- [ ] Expanded demo regression, if suite scope grows
- [ ] Test reports
- [ ] Secrets managed securely

## Quality

- [ ] Flakiness investigated
- [ ] Test execution time measured
- [ ] Risk coverage measured
- [ ] Known limitations documented
- [ ] Defect classification documented

## Portfolio

- [ ] README polished
- [ ] Architecture diagram
- [ ] RBT example
- [ ] Risk matrix
- [ ] Example reports
- [ ] CI status
- [ ] Clear explanation of personal contribution

---

# 32. Portfolio Outcome

The first-milestone repository should communicate this story:

> I assessed an Accounts Payable demo using its accessible documentation, role switcher, and UI; identified and prioritized observable business risks; designed a risk-based approach; and implemented reliable UI checks with clear limits on what could not be verified without source, backend, or database access.

The portfolio should demonstrate that the author can:

- Think beyond UI automation
- Understand software architecture
- Identify business risk
- Design a test strategy
- Build automation frameworks
- Identify where API/server-side tests would add confidence
- Identify persistence risks and report clearly that database state was not verified
- Assess role-dependent UI behavior while stating authorization limits
- Test financial workflows at the observable UI layer
- Identify concurrency and idempotency risks and state what evidence would be needed to test them
- Assess AI-assisted functionality when it is exposed and safely testable in the demo
- Build CI/CD
- Measure quality
- Communicate QA decisions

This is the target profile for a Senior SDET / QA Lead role.

---

# 33. Initial Execution Order

Use this as the default starting sequence; adjust it as environment reconnaissance and project learning warrant.

1. [ ] Record access boundaries and confirm the deployed demo as the permitted target.
2. [ ] Inspect the demo UI and accessible documentation; enumerate visible roles and workflows.
3. [ ] Document observed behavior, evidence sources, unknowns, and limitations.
4. [ ] Create the RBT strategy, risk register, and scenario matrix from verified demo capabilities.
5. [x] Create an RBAC/UI behavior matrix that explicitly does not claim server authorization coverage.
6. [ ] Bootstrap Playwright + TypeScript and configure `BASE_URL` if UI automation is feasible.
7. [ ] Define safe, identifiable UI test data and cleanup boundaries.
8. [ ] Implement the highest-priority observable role/access and business workflow checks.
9. [ ] Add CI and reporting only after the demo suite is reliable and safe to run.
10. [ ] Build traceability and report coverage separately for automated checks, manual observations, and unverified risks.
11. [ ] Stabilize the suite, document limitations, and polish portfolio documentation.
12. [ ] Reassess API/server, source-level, database, concurrency, cron, and deeper AI coverage only if access changes.

---

# 34. Success Criteria

The first milestone succeeds when it demonstrates **quality of engineering rather than quantity of tests** using only the deployed demo and accessible documentation.

The key question is:

> "Can I explain why every important test exists, what risk it mitigates, why it runs at that particular testing layer, and how I know the risk is covered?"

If the answer is yes, the project is doing its job.
