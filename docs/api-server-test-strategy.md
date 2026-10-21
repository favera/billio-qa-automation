# Billio API and Server Test Strategy

Last reviewed: 2026-10-11

## Current decision

API/server tests are not currently implementable for this project. There is
no access to the Billio source repository, a documented and authorized
server test interface, a backend test environment, or the database. Public
product documentation and the deployed demo support UI checks, but do not
provide a stable API contract for this QA repository. The demo role
switcher is not authentication.

No endpoint, Server Action, payload, error code, test account, or data
reset mechanism is assumed here. Do not invent REST routes or probe
undocumented mutation endpoints. The Phase 11 Playwright checks remain
browser-visible role-dependent UI checks only.

## Access gate for future work

Reassess this strategy only when an owner provides a safe, documented test
surface and suitable access. Before adding a server test, establish all
of the following:

1. **Authorized environment:** identify a dedicated test/staging target
   and explicit permission to exercise its mutations. The developer has
   approved supported-UI vendor/bill/payment workflows in the demo; this
   does not authorize undocumented API/server mutations. Do not run
   financial mutation tests through an undocumented server interface or
   against a production database.
2. **Actual interface:** confirm whether behavior is exposed through a
   documented HTTP API, Server Action, or another supported test surface.
   Obtain its schema, authentication model, and versioning/error contract.
3. **Identity:** have distinct authenticated test identities for
   authorization and separation-of-duties scenarios. A selectable demo
   role is not a substitute.
4. **Data isolation:** establish deterministic setup and either safe
   scoped cleanup or a disposable environment. Do not rely on broad
   cleanup or test order.
5. **Observable outcomes:** define response assertions from the interface
   contract. For high-impact financial changes, establish an approved way
   to inspect resulting business state and audit effects; a success
   response alone does not prove durable state or atomicity.
6. **Safe execution:** define limits, idempotency keys or equivalent
   controls where specified, and recovery/stop procedures for payment,
   cron, and concurrency tests.

If any prerequisite is missing, record the scenario as conditional and
continue with the lowest safe observable layer. Do not add
`APIRequestContext` or another API client just to make the architecture
look complete.

## Conditional priority order

| Priority | Risk / scenarios | Future server-side confidence sought |
|---|---|---|
| 1 | RISK-001–003: unauthorized actions and separation of duties | Authenticated role is evaluated for each mutation; creator cannot decide own bill; denial contract is respected and protected state/audit effects are absent. |
| 2 | RISK-004–007: threshold routing, lifecycle, totals, GL validation | Boundary amounts and invalid transitions follow documented rules; derived financial values and account constraints are validated at the authoritative layer. |
| 3 | RISK-008–012: payment eligibility, amount/date/vendor, duplicates, batch atomicity, audit | Only eligible bills are processed; payment effects are correct and nonduplicated under documented retries; related state and audit changes are consistent. |
| 4 | RISK-015–016: recurring generation and scheduled processing | Occurrence generation and due-time selection honor documented schedule/timezone/cutoff rules; repeated processing behaves as specified. |
| 5 | RISK-013–014: AI extraction and invoice validation | Untrusted extracted values pass ordinary validation and require review/correction where specified. |
| 6 | RISK-017–018: persistence consistency and dashboard aggregation | Critical persisted relationships and derived metrics agree with documented business rules. |

Priority is a planning order, not a claim that an implementation mechanism
or interface exists. Choose unit, service, integration, or contract tests
once the actual implementation and test surface are known; do not route
every concern through browser tests.

## Assertion rules when access becomes available

- Use only documented request/command shapes and specified authorization
  outcomes. Do not assume a status such as `403` or an error label such as
  `FORBIDDEN` unless the contract says so.
- Assert rejected requests do not cause the protected state transition;
  inspect database state only through an approved, safe mechanism.
- For financial mutations, relate the response to the resulting bill,
  payment, ledger, and activity state where the approved interface permits
  those checks.
- Test idempotency, races, stale revisions, process-due, and transaction
  behavior only with controlled isolated data and safe repeatable hooks.
- Keep server-level tests independent from UI tests. UI coverage may
  complement them but cannot replace them.

## Current coverage and limitation

The current suite covers a small read-only subset of role-dependent UI
behavior in RBT-001 and VEN-001. No server request has been made and no
authenticated authorization, persistence, financial transaction, cron,
or idempotency behavior has been verified. See the
[`risk register`](risk-register.md), [`scenario matrix`](test-scenarios.md),
and [`access record`](access-and-environment.md) for current evidence and
boundaries.

