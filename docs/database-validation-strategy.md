# Billio Database Validation Strategy

Last reviewed: 2026-10-14

## Current status and boundary

Database validation is conditional future work. This project has no Billio
database access, schema, test database, or approved query interface. Do not
connect to a database, add database credentials, infer physical table
names, or claim persistence from browser-visible results. The application
architecture and product descriptions do not establish the deployed
database schema.

The Phase 11 suite remains read-only browser UI coverage. UI state,
confirmation messages, and displayed activity do not prove durable writes,
transaction atomicity, rollback, or ledger integrity. No DB driver,
connection config, query, fixture, or database test has been added.

## Access gate

Begin DB validation only when an owner provides all of the following:

1. An isolated, non-production database or a disposable test environment,
   plus explicit authorization for the intended reads and writes.
2. The actual schema and supported access method, including ownership of
   migrations and compatibility expectations.
3. Least-privilege test credentials and secure local/CI secret handling.
   Read-only access should be used for assertions where possible.
4. Deterministic test-data setup and safe, scoped cleanup or environment
   reset. Tests must not depend on broad deletion or order of execution.
5. A supported way to invoke the business operation under test. Direct DB
   writes must not bypass application behavior just to set up a scenario
   unless a documented fixture mechanism explicitly permits that.
6. Agreed expected business invariants and transaction boundaries for the
   operation, including which side effects should exist on success and
   which must be absent on failure.

If any gate is unmet, mark the check conditional and retain the current
UI-only evidence limits. Never use production or the shared demo database
for validation, setup, or cleanup.

## Logical validation targets

These are business-level relationships from product documentation and the
scenario matrix. They are not claims about physical tables or columns.

### Bill creation and update

- The bill's visible/business identifier, vendor, amount, dates, status,
  and creator match the supported operation's input and documented rules.
- The expected line items are associated with the bill; their derived
  total agrees with the bill total using documented precision/rounding.
- Required status/routing and activity effects agree with the operation.
- No orphaned, duplicate, or partial child records result from a failed
  operation, where the documented transaction contract requires atomicity.

### Approval and rejection

- Only an authenticated, eligible identity can decide the bill; the
  creator cannot approve or reject their own bill where separation of
  duties applies.
- Successful approval or rejection produces the documented status and
  related history effects together.
- Rejected or stale/invalid operations leave protected business state and
  history consistent with the documented failure contract.

### Payment

- A successful payment operation relates to the expected bill, vendor,
  amount, method, and payment date, with the documented bill/run state.
- The resulting history and payment records agree with the operation.
- Failure does not leave partial payment-related state if the documented
  transaction boundary promises atomic behavior.
- Repeated requests are checked for duplicate financial effects only when
  the supported interface defines retry/idempotency behavior and a safe
  isolated environment exists.

Product documentation says the journal shown in the UI is a preview and
that a persisted global ledger is not part of the current slice. Do not
invent or require a ledger table as an expected result.

## Test design when access is granted

- Invoke the real supported application operation through its documented
  API/server interface; do not test by directly inserting the expected
  rows.
- Assert logical business invariants using the approved read interface.
  Keep queries narrow, scoped to unique test records, and independent of
  incidental implementation details where possible.
- Pair high-impact write checks with failure/rollback assertions only
  where a documented safe failure trigger exists.
- Keep database checks separate from browser checks. A higher-level test
  may verify the user journey, while a focused service/database test
  verifies persistence invariants.
- Record setup, identifiers, cleanup result, environment, and evidence for
  each run. Never silently clean up unrelated data.
- Keep financial mutation tests serial unless isolation and concurrency
  controls are proven for the dedicated environment.

## Relationship to current scenarios

[`DB-001`](test-scenarios.md) is the central conditional persistence and
transaction scenario. Related risks include authorization and separation
of duties (RISK-001–003), bill lifecycle and calculation (RISK-004–006),
payment integrity and idempotency (RISK-008–011), activity history
(RISK-012), and persisted consistency (RISK-017). These remain unverified
at the database layer. The visible UI suite does not reduce this status.

