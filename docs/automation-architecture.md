# Billio UI Automation Architecture

Last reviewed: 2026-10-21

## Purpose and boundary

This document defines the architecture for a small, risk-led Playwright
suite against the deployed Billio demo. The TypeScript/Playwright tooling
scaffold, typed role fixture, and initial read-only role/access checks are
in place; mutable workflow coverage and CI are not implemented yet. The
developer has approved unique synthetic vendor/bill creation and
payment-workflow execution through supported UI flows. The first
milestone can assert only browser-visible
behavior. In particular, role selection through the demo switcher is not
authentication and cannot establish server-side authorization, persistence,
or ledger correctness.

The architecture follows the available scenarios in
[`test-scenarios.md`](test-scenarios.md), risk priorities in
[`risk-register.md`](risk-register.md), and access boundaries in
[`access-and-environment.md`](access-and-environment.md). Conditional
server, API, database, scheduled-job, and controlled-concurrency testing
remain outside the first-milestone design.

## Proposed repository layout

```text
billio-qa-automation/
├── docs/
│   ├── automation-architecture.md
│   ├── demo-overview.md
│   ├── risk-register.md
│   ├── test-scenarios.md
│   ├── rbac-matrix.md
│   ├── test-data-strategy.md
│   ├── api-server-test-strategy.md
│   ├── database-validation-strategy.md
│   ├── bill-lifecycle-state-machine.md
│   └── traceability-matrix.md       # add when traceability is implemented
├── tests/
│   ├── authorization/               # role-dependent UI affordances
│   ├── bills/                       # selected visible lifecycle/calculation checks
│   ├── vendors/                     # read-only directory controls by role
│   ├── payments/                    # only safe, observable scenarios
│   ├── recurring-bills/             # only when stable and useful
│   ├── invoice-intake/              # only synthetic fixture, safe observable flow
│   └── dashboard/                   # only risk-justified checks
├── fixtures/
│   └── test.ts                      # shared browser context and role helpers
├── types/
│   └── demo-role.ts                 # reusable demo role type
├── test-data/
│   └── invoice-fixtures/            # synthetic, non-sensitive files only
├── utils/                           # small domain helpers if duplication appears
├── playwright.config.ts
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example                     # BASE_URL placeholder only, if needed
└── .gitignore                       # local env and generated artifacts
```

Directories are created when the first test in that domain is selected;
empty folders and speculative abstractions are unnecessary. Keep the
Billio application separate from this QA repository.

## Runtime and configuration

- Use TypeScript, Playwright Test, and Node.js; add dependencies only for
  an established need. Current dev tooling is listed in `package.json`
  and locked in `package-lock.json`.
- Load optional local overrides from ignored `.env.local` using dotenv.
  `.env.example` documents the sole first-milestone variable, `BASE_URL`.
- Set `use.baseURL` from `BASE_URL`; when unset, use the documented demo
  URL. Validate that overrides use HTTP or HTTPS. CI should set
  `BASE_URL` explicitly.
- Do not configure credentials, `storageState`, database connections,
  private endpoints, or secrets for the current scope.
- Use a desktop browser project initially. Add browsers only when a
  defined risk or supported-user requirement justifies the cost.
- Run read-only checks in parallel only after confirming page isolation.
  Keep shared-demo mutations serial (`workers: 1`). Use unique synthetic
  vendors/bills and allow them to remain; a worker limit does not isolate
  shared application data. Do not mutate seeded records for setup.
- Use bounded test and assertion timeouts based on the deployed demo's
  observed response behavior. Synchronize on locator assertions and
  meaningful navigation/network conditions; never arbitrary sleeps.

## Test organization and traceability

Group specs by business domain, not by technical widget. Use descriptive
test names with stable scenario IDs, for example
`[RBT-001] shows the documented bill controls for each demo role`. Each
automated test should identify its scenario and risk in a short comment or
metadata field, and should assert a business-relevant visible outcome.

The intended chain is:

```text
Risk ID → Scenario ID → spec/test → browser-visible result → report
```

Only scenarios marked as first-milestone UI checks and suitable for
repeatable execution should become automated. Vendor/bill creation,
submission/approval for test-created bills, scheduling, and Pay now are
approved mutations; implement only risk-justified flows with unique data.
Process-due remains conditional unless its eligible set can be scoped to
test bills. Do not turn every matrix row into an end-to-end test.

## Fixtures and role selection

The reusable `DemoRole` type lives in `types/demo-role.ts`; the initial
fixture in `fixtures/test.ts` exposes a typed `selectDemoRole` helper for
the three observed demo roles: Bookkeeper (Avery Chen), AP Manager (Marcus
Rivera), and Controller (Priya Shah). It targets the
accessible “Viewing as” combobox, selects by visible option label, and
checks the selected option label. Each test selects its role explicitly;
do not depend on a role left by a previous test. This interaction passed
in the read-only Phase 11 suite.

Role fixtures describe demo UI state, not users or identities. They must
not imply authenticated sessions or prove authorization enforcement.
Prefer accessible role/name/label locators; use a documented stable test
ID only when semantic locators are not viable. Avoid generated classes,
deep CSS selectors, and private application APIs.

## Test data and side effects

Read-only checks should prefer seeded records only when their identity and
state are stable enough for the assertion. Mutation tests may create
synthetic vendors/bills through the supported UI using unique run
identifiers. Submit, approve, schedule, or pay only records created for
that scenario. Synthetic records may remain; do not assume deletion or
cleanup, perform broad cleanup, or mutate seeded bills. Process-due is
conditional unless scoped to test records. Use no real financial data or
personal information.

If a global action may affect unrelated shared-demo state, keep it manual
or defer it until its impact can be scoped. A successful UI message does
not establish that the change persisted correctly.

## Assertions and evidence

- Assert role options and visible controls, labels, statuses, and
  navigation that are directly observable.
- For transitions, assert the resulting visible state and any displayed
  activity item; describe it as UI evidence.
- Do not infer a server response, authorization rejection, database
  mutation, absence of duplicate payments, or ledger balance from browser
  rendering alone.
- Keep assertions specific to the scenario's documented expectation;
  record disagreements between docs and deployed UI as findings rather
  than silently redefining expected behavior.

## Reports and failure handling

Start with Playwright's built-in list reporter locally and HTML reporter
for CI review. On failure, retain a trace and screenshot; keep video
off unless a failure mode needs it. Ignore generated report/result
directories in version control. Report automated checks, manual
observations, and unverified risks separately; test count is not a quality
metric.

Classify failures before changing tests: product behavior, automation,
test data, environment/dependency, or requirement ambiguity. Do not add
retries or longer timeouts to hide a failure. CI must use only the demo
URL and synthetic data; no credential or DB secrets are needed for this
architecture.

## Growth path

1. Bootstrap the minimal TypeScript/Playwright configuration in Phase 7.
2. Extend high-value, read-only role/access scenarios only where visible
   controls and seed data are stable.
3. Add approved mutation scenarios with unique naming, serial execution,
   and explicit retained-record expectations documented.
4. Revisit API/server/database layers only if a safe, documented interface
   and appropriate access become available.

## Decisions and open constraints

| Decision | Rationale / constraint |
|---|---|
| Playwright Test + TypeScript | Matches the roadmap and supports browser UI checks with typed helpers. |
| Demo URL as sole target | Current access is limited to deployed demo and public docs. |
| Explicit role selection per test | Prevents hidden dependence on prior UI state; role switcher is not authentication. |
| Use unique synthetic records for approved mutations | Shared demo data has no known reset or cleanup interface. |
| No API/DB client in first milestone | No documented test interface or access is available. |
| No reporting dependency initially | Built-in Playwright reporters suffice until suite needs demonstrate otherwise. |
