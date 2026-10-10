# Billio UI Automation Architecture

Last reviewed: 2026-10-10

## Purpose and boundary

This document defines the architecture for a small, risk-led Playwright
suite against the deployed Billio demo. The TypeScript/Playwright tooling
scaffold is now in place; tests, custom fixtures, and CI workflow are not
implemented yet. The first milestone can assert only browser-visible
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
- Set `use.baseURL` from `BASE_URL`; defaulting to the documented demo URL
  is acceptable for local smoke runs, while CI should set it explicitly.
- Fail early with a clear message if the configured URL is missing or
  malformed. Do not configure credentials, `storageState`, database
  connections, private endpoints, or secrets for the current scope.
- Use a desktop browser project initially. Add browsers only when a
  defined risk or supported-user requirement justifies the cost.
- Run read-only checks in parallel only after confirming page isolation.
  Keep shared-demo mutations serial (`workers: 1`) or opt-in until unique
  test records and safe cleanup are demonstrated. A worker limit does not
  isolate shared application data.
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
repeatable, non-harmful execution should become automated. Scenario
automation candidates marked conditional (for example, bill approval,
rejection, or payment) require a reviewed safe-data approach before
implementation. Do not turn every matrix row into an end-to-end test.

## Fixtures and role selection

Use a small custom Playwright Test fixture only when it removes meaningful
repetition. It may expose a typed role helper for the three observed demo
roles: Bookkeeper (Avery Chen), AP Manager (Marcus Rivera), and Controller
(Priya Shah). The helper should select a role through an accessible,
user-facing control and verify the selected role label before assertions.
Each test selects its role explicitly; do not depend on a role left by a
previous test.

Role fixtures describe demo UI state, not users or identities. They must
not imply authenticated sessions or prove authorization enforcement.
Prefer accessible role/name/label locators; use a documented stable test
ID only when semantic locators are not viable. Avoid generated classes,
deep CSS selectors, and private application APIs.

## Test data and side effects

Read-only checks should prefer seeded records only when their identity and
state are stable enough for the assertion. Any test that creates or
changes records must use the supported UI, synthetic values, and a unique
run identifier where the UI allows it. Do not assume deletion or cleanup
is available; avoid broad cleanup and avoid mutating shared seeded bills.
Upload only synthetic, non-sensitive invoice fixtures. Never put real
financial documents or personal data in the repository.

If an action changes shared demo state and cannot be isolated or safely
cleaned, keep it as a manual scenario or defer it. A successful UI message
does not establish that the change persisted correctly.

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
2. Confirm role switcher locators and deterministic role selection before
   introducing a reusable fixture.
3. Start with high-value, read-only scenarios such as role options and
   visible vendor/payment controls, where stable.
4. Add a mutation scenario only after its data safety, unique naming, and
   cleanup limits are documented.
5. Revisit API/server/database layers only if a safe, documented interface
   and appropriate access become available.

## Decisions and open constraints

| Decision | Rationale / constraint |
|---|---|
| Playwright Test + TypeScript | Matches the roadmap and supports browser UI checks with typed helpers. |
| Demo URL as sole target | Current access is limited to deployed demo and public docs. |
| Explicit role selection per test | Prevents hidden dependence on prior UI state; role switcher is not authentication. |
| Avoid broad mutable coverage initially | Shared demo data has no known reset or cleanup interface. |
| No API/DB client in first milestone | No documented test interface or access is available. |
| No reporting dependency initially | Built-in Playwright reporters suffice until suite needs demonstrate otherwise. |
