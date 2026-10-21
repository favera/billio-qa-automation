# Billio Test Data Strategy

Last reviewed: 2026-10-21

## Scope and current state

This strategy supports first-milestone scenarios against the deployed
Billio demo. The demo may contain shared data; no dedicated test tenant,
reset mechanism, API factory, database access, or cleanup interface is
available. Data setup is limited to records and files created through
supported UI flows. The developer has approved test creation of synthetic
vendors and bills and execution of payment workflows. Synthetic records
may remain in the shared demo; no reset, deletion, or cleanup mechanism is
available. No data factories or cleanup code exist yet.

Use only synthetic, non-sensitive values. A UI message or displayed
record is evidence of UI behavior; it does not prove persisted state.

## Data classes and handling

| Data class | Preferred source | Handling |
|---|---|---|
| Demo roles | Existing role switcher options | Select explicitly in each test. These are demo UI roles, not authenticated users. |
| Bills, vendors, payment runs, recurring series, GL accounts, policy | Existing seeded demo records for read-only checks | Identify a record by stable, visible business fields and confirm its state before asserting. Never assume a seed record is safe to mutate. |
| Synthetic bill values | Supported UI form for a uniquely identified test bill | Use a unique run identifier, minimal values, and a suitable vendor/expense GL. Submit/approve/pay only for an approved scenario; records may remain. |
| Synthetic vendor values | Supported vendor form for a uniquely identified test vendor | Use fabricated organization and payment details only; do not edit/archive/reactivate records as routine cleanup. |
| Invoice documents | Repository-owned synthetic fixtures, if later needed | Use fabricated organization/person names and values; no real invoices, bank details, personal data, or customer documents. |
| Accounts, credentials, database rows, payment secrets | Not available or needed in the first milestone | Do not fabricate account fixtures or add credentials/API/DB variables. |

## Data selection rules

1. Prefer a read-only scenario using an existing record when the record's
   identity and visible state are stable enough for the assertion.
2. Inspect the record's current state and relevant relationships before
   acting. Stop if it differs from the documented precondition; do not
   adapt by mutating another shared record without review.
3. Create vendors and bills only through supported UI flows, using
   identifiers such as `test-vendor-<UTC-run-id>-<scenario-id>` and
   `test-bill-<UTC-run-id>-<scenario-id>`. Use fabricated vendor and
   payment details. Do not modify seeded records for test setup.
4. A payment scenario may submit and approve its own synthetic bill and
   execute the documented Pay now or scheduling flow. Use the fewest
   test records and actions needed. Rejection is not a payment
   prerequisite and should be a separate, traceable scenario.
5. Keep each record minimal and self-contained. Avoid tests that rely on
   another test, a particular execution order, previous UI state, or a
   specific worker.
6. Do not assume cleanup is possible. Do not delete records or perform
   broad cleanup. Synthetic vendors, bills, and payment records may
   remain in the demo. Do not run a scenario if its clearly labeled test
   records cannot safely remain visible.
7. Use no automated retry for a financial mutation. Keep execution serial
   while scenarios touch shared state; a single worker reduces collisions
   but does not provide data isolation.
8. Concurrency, duplicate payments, approval races, cron, and stale-state
   scenarios need a controlled interface and isolated data. They are
   conditional future work, not UI test-data targets.

## Identifiers and deterministic values

Keep business values fixed for repeatability and make mutable records
unique per run. When the form provides a suitable human-readable field,
use a compact identifier such as:

```text
test-bill-<UTC-run-id>-<scenario-id>
test-vendor-<UTC-run-id>-<scenario-id>
```

The run identifier should be generated once per test run, contain a UTC
timestamp plus a short random suffix, and be reused across related records
from that run. For example:

```text
20261011T143000Z-a1b2c3
```

Use fixed synthetic amounts and dates appropriate to a scenario (for
example, below/at/above a documented approval threshold). Avoid current
time-dependent expectations unless the scenario explicitly tests time
handling. Do not use real vendor identifiers, account numbers, addresses,
emails, or payment information.

## Scenario data plan

| Scenarios | Data needed | First-milestone approach | Readiness |
|---|---|---|---|
| RBT-001, VEN-001 | Role options and directory/bill/payment controls | Existing pages and seeded records; no mutation | Suitable for read-only automation after locators and stable page content are confirmed. |
| AUTH-001 | A pending bill with visible creator and awaiting role | Use only an existing example if its state and identity are stable; do not create or approve one for this check | Conditional on a suitable seeded record; identity enforcement remains untestable. |
| GL-001, REC-001 | Existing vendor/account configuration and recurring series | Read-only inspection by role | Suitable only for stable, visible values; recurring seed count has a documented discrepancy. |
| VEN-002 | Unique synthetic vendor with fabricated defaults | Create via supported UI; allow record to remain; no edit/archive cleanup | Candidate for UI automation with unique run identifiers. |
| BILL-005, FIN-001 | Unique bill, vendor, active expense GL; simple line amounts | Create via supported UI and inspect visible fields/total; bill may remain | Candidate for UI automation. |
| BILL-001/002, PAY-002/004/006 | Unique vendor and bill; approval, schedule or payment values | Use only test-created records; execute documented workflow; avoid seeded bills | Authorized UI mutation candidates; global actions require scoped impact. |
| BILL-003 | Unique pending bill and synthetic reason | Create and submit a dedicated test bill; reject only within the scenario | Separate lifecycle mutation candidate; not a payment prerequisite. |
| AUD-001 | Existing bill with visible activity history | Inspect history on a stable seeded bill; do not create an event just to populate activity | Read-only if activity entries and bill identity remain stable. |
| PAY-003/005, BILL-004, CRON-001 | Controlled state, repeat requests or simultaneous actors | Requires duplicate-effect containment or an isolated test interface | Conditional; shared-demo payment duplication/concurrency is not a routine target. |
| INV-001/002 | Synthetic PDF or image with fabricated invoice fields | Add only small repository fixtures if upload tests are later selected; review file contents for sensitive metadata | Conditional on safe upload behavior and synthetic fixture availability. No fixture files exist yet. |
| REC-002 | Active recurring definition and generated occurrence | Do not run generation on a shared seeded series; require a unique test series and safe cleanup plan | Conditional mutation; not currently suitable for automated demo runs. |
| DASH-001 | Bills with known dates/statuses and dashboard bucket values | Compare stable seeded examples read-only; do not manufacture aging data by altering shared bills | Conditional on stable dates and visible bucket semantics. |
| DB-001 | Bill/payment persisted state | No first-milestone data plan | Requires authorized database access and a separate future strategy. |

## Synthetic invoice fixture requirements

If invoice intake scenarios are selected later, fixtures must be generated
for testing rather than copied from real documents. Each fixture should:

- contain fabricated vendor, invoice number, date, line description, and
  amounts;
- avoid real contact details, addresses, tax IDs, bank data, or metadata
  identifying a real person or organization;
- have a documented expected field set and intended test condition;
- be small, readable, and committed only after checking visible content
  and embedded metadata;
- be retained in the repository only if the supported upload flow and
  file handling are understood well enough for safe use.

No invoice fixture is required for read-only role or directory checks.

## Setup and cleanup implementation boundary

At present, setup is manual or uses seeded records. Future UI helpers may
create uniquely identified synthetic vendors and bills and support the
documented payment workflow after scenario/spec review. Do not add API or
database factories. Helpers should accept typed, scenario-relevant
inputs, keep values minimal, surface created record identifiers, and
make each mutation explicit.

Cleanup is not an automatic test step because a supported safe delete or
reset path has not been established. Clearly labeled synthetic records
are expected to remain in the shared demo. A scenario that cannot
tolerate that must not run against it. Reassess this strategy if a
dedicated test environment, documented cleanup mechanism, or isolated
data interface becomes available.

## Evidence limits

The demo has no login/session process, and selectable roles do not provide
distinct authenticated identities. The current project has no database
access. Test data visible in the UI can support checks of rendered fields,
workflow controls, and displayed states only. It cannot establish
authorization enforcement, persistence, rollback, duplicate-payment
absence, or ledger integrity.
