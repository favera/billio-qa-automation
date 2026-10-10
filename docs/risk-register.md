# Billio Risk Register

Last reviewed: 2026-10-08

## Scope and scoring notes

This register is based on the live UI and product documentation summarized
in [demo-overview.md](demo-overview.md). It identifies risks; it does not
report executed tests or verified defects. The Billio source repository,
server test interfaces, and database are not available to this project.

Impact, likelihood, detectability, RPN, and priority use the scales in
[PLAN.md](../PLAN.md#6-phase-2--risk-based-testing-strategy). Likelihood,
technical causes, and mitigations are planning estimates or documentation
claims because production incident and implementation evidence are not
available. Detectability is scored higher when a failure would likely
require integration or persistence evidence to discover. Security and
financial-integrity risks are promoted to at least P1 even when their RPN
falls below 50. A priority is not a statement of likelihood or a defect
finding.

**Status meanings:** “Open — UI evidence only” means the UI affordance or
display was observed, but the underlying risk is unverified. “Open — docs
only” means the risk and described control come from product docs, without
an independent behavior check. “Open — conditional” means meaningful
validation needs an API/server, database, or controlled concurrency
interface outside the first milestone.

## Prioritized risks

### RISK-001 — Unauthorized bill or payment mutation

- **Feature/domain:** Authorization / RBAC; bill and payment actions.
- **Risk description:** A user without the required role can invoke a bill
  approval, rejection, scheduling, payment, or process-due operation even
  when the UI hides its control.
- **Business consequence:** Unauthorized approvals or payment effects,
  financial loss, and loss of trust in approval controls.
- **Technical cause:** **Unknown.** A mismatch between UI gating and
  server-side role enforcement is a candidate cause; the demo role switcher
  is not authenticated identity.
- **Scoring:** Impact 5; likelihood 2 (estimate: no bypass evidence);
  detectability 5 (server enforcement and resulting state need deeper
  access); **RPN 50; P1** (critical authorization override also applies).
- **Existing mitigation:** Product docs describe shared role guards at the
  UI and server-action layers. Live UI checks showed Bookkeeper payment
  controls hidden and an AP Manager approval prompt; this does not verify
  server enforcement.
- **Proposed test coverage:** Compare visible role affordances for each
  documented role. Server-side rejection and no-mutation checks remain
  conditional future coverage.
- **Automation strategy:** First milestone: Playwright UI checks for
  role-dependent controls and queue prompts. Future: authorized server
  tests with state checks if a safe documented interface is provided.
- **Status:** Open — UI evidence only; server authorization unverified.

### RISK-002 — Unauthorized vendor master-data changes

- **Feature/domain:** Vendor authorization and data integrity.
- **Risk description:** A Bookkeeper or AP Manager creates, edits, archives,
  or reactivates a vendor without Controller permission.
- **Business consequence:** Incorrect remittance defaults or GL coding can
  flow into new bills; vendor records may be hidden or duplicated.
- **Technical cause:** **Unknown.** Candidate cause is missing or
  inconsistent enforcement between vendor controls and mutation handlers.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 4 (role
  and resulting vendor state need to be checked); **RPN 32; P1** (security
  authorization override).
- **Existing mitigation:** Product docs describe Controller-owned vendor
  mutations and server role checks. Live UI showed no New vendor link for
  Avery and a New vendor link for Priya; no mutation was attempted.
- **Proposed test coverage:** Verify visible management controls by role;
  if later access permits, verify unauthorized mutation rejection and
  unchanged vendor state.
- **Automation strategy:** First milestone: role-based directory UI
  checks. Future server/data validation is conditional.
- **Status:** Open — UI evidence only; mutation enforcement unverified.

### RISK-003 — Separation-of-duties failure

- **Feature/domain:** Bill approval and separation of duties.
- **Risk description:** A bill creator approves or rejects their own bill,
  or the demo role switcher is mistaken for separate authenticated users.
- **Business consequence:** Self-approval may bypass independent review of
  a financial obligation.
- **Technical cause:** **Unknown.** Candidate cause is an incomplete
  creator/approver comparison or reliance on the selectable demo role as
  identity.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 4 (requires
  creator and approver identity evidence); **RPN 40; P1** (authorization
  and financial-integrity override).
- **Existing mitigation:** Product docs state that bill creators cannot
  approve or reject their own bills. The demo does not expose a real login
  or session flow.
- **Proposed test coverage:** Observe the documented self-created bill
  state and role-dependent UI, while reporting identity enforcement as
  unverified. Authenticated identity checks are conditional future work.
- **Automation strategy:** First milestone: UI observation of the seeded
  self-created example if stable. Future: distinct identities and
  server-side authorization checks, if available.
- **Status:** Open — docs only for the rule; authenticated enforcement
  unverified.

### RISK-004 — Bill routed to the wrong approver

- **Feature/domain:** Approval thresholds and bill submission.
- **Risk description:** Billio selects the wrong approval rule at or near
  a threshold, or a submitted bill's awaiting role changes unexpectedly.
- **Business consequence:** A bill may be approved without the intended
  level of review or remain blocked in the wrong queue.
- **Technical cause:** **Unknown.** Candidate causes include boundary
  comparison, amount conversion, or rule-selection defects.
- **Scoring:** Impact 5; likelihood 3 (estimate: money thresholds create
  boundary exposure); detectability 3 (routing is visible after submit);
  **RPN 45; P1** (financial-integrity override).
- **Existing mitigation:** Live Settings UI and product docs show standard
  bills routed to AP Manager and bills of `$5,000.00+` routed to
  Controller. Docs say the selected role is stored at submission. No
  threshold bill was submitted during reconnaissance.
- **Proposed test coverage:** UI boundary checks around `$5,000.00` and
  visible awaiting-role confirmation. Server rule and persisted routing
  checks are conditional future coverage.
- **Automation strategy:** First milestone: create uniquely identifiable
  safe bills through the UI only if the shared demo data and cleanup
  boundaries are suitable. Future: direct rule and persisted-state checks.
- **Status:** Open — rule documented and visible; boundary outcomes
  untested.

### RISK-005 — Invalid or stale bill lifecycle transition

- **Feature/domain:** Bill lifecycle, approval, rejection, stale actions.
- **Risk description:** A bill skips a required state, accepts a repeated
  or invalid decision, or applies an outdated edit/approval after the bill
  has changed.
- **Business consequence:** Incorrect payment readiness, lost changes, or
  duplicate/misleading activity history.
- **Technical cause:** **Unknown.** Product docs describe revision guards;
  whether the deployed implementation handles all stale and duplicate
  submissions correctly has not been verified.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 4 (stale
  race behavior needs controlled state); **RPN 32; P1** (financial-
  integrity override).
- **Existing mitigation:** Docs describe Draft → Pending approval →
  Approved → Scheduled → Paid, rejection back to Draft, activity entries,
  and stale revision checks. Live list/detail confirmed some states and
  activity display.
- **Proposed test coverage:** Observe supported transitions through safe
  UI flows; assess invalid/repeated and stale transitions only when a
  controlled interface is available.
- **Automation strategy:** First milestone: selected observable UI
  transitions using unique records. Future: concurrent/stale server tests.
- **Status:** Open — UI state sample observed; transitions and revision
  guards unverified.

### RISK-006 — Incorrect bill total or financial calculation

- **Feature/domain:** Financial calculations and bill capture.
- **Risk description:** Line amounts, decimal precision, rounding, or the
  derived total are incorrect or inconsistent between capture and detail.
- **Business consequence:** A bill may be approved or paid for the wrong
  amount and produce inaccurate accounting information.
- **Technical cause:** **Unknown.** Candidate causes include decimal
  conversion, rounding, or inconsistent validation.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 4
  (arithmetic can look plausible without a reliable independent check);
  **RPN 40; P1** (financial-integrity override).
- **Existing mitigation:** Product docs state amounts are represented in
  integer cents and totals are derived from lines. The live bill form and
  detail page displayed a total matching the one visible line in the
  observed sample; this is not boundary or persistence evidence.
- **Proposed test coverage:** Compare entered line values with displayed
  totals using documented financial boundaries. Pure calculations and
  persisted amounts require suitable project-owned code or future access.
- **Automation strategy:** First milestone: UI checks of displayed totals
  for safe test data. Future: deterministic unit/server/DB checks for
  precision and persistence.
- **Status:** Open — one UI example observed; financial boundaries
  untested.

### RISK-007 — Incorrect or inactive GL coding

- **Feature/domain:** GL coding and chart of accounts.
- **Risk description:** A bill line uses an incorrect, inactive, or
  non-expense GL account, or vendor defaults populate the wrong account.
- **Business consequence:** Expenses may be classified incorrectly and
  approval/journal review may be misleading.
- **Technical cause:** **Unknown.** Candidate causes include stale picker
  options, wrong vendor defaults, or insufficient server validation.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 3 (account
  code is visible on bill review); **RPN 24; P1** (financial-integrity
  override).
- **Existing mitigation:** Docs describe active expense-account
  restrictions and seeded vendor defaults. Live Settings showed the chart
  of accounts; a bill detail showed its selected account.
- **Proposed test coverage:** Confirm displayed account, vendor default,
  and available active-account choices. Server rejection of crafted
  invalid account IDs is conditional future coverage.
- **Automation strategy:** First milestone: UI checks on form and detail.
  Future: server validation and persisted account-link checks.
- **Status:** Open — documentation and display observed; invalid/inactive
  account handling unverified.

### RISK-008 — Payment executed for the wrong bill, vendor, amount, or state

- **Feature/domain:** Pay-now and payment execution.
- **Risk description:** A payment action applies to an unapproved bill or
  uses a mismatched vendor or amount instead of the approved bill total.
- **Business consequence:** Unauthorized or incorrect disbursement and
  inconsistent bill/payment history.
- **Technical cause:** **Unknown.** Candidate causes include a stale bill
  state, mismatched action input, or incorrect association with a payment
  run.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 5
  (requires reliable payment/run and persisted-state evidence); **RPN 50;
  P1** (financial-integrity override).
- **Existing mitigation:** Docs describe pay-now for approved bills and
  per-bill payment-run/activity history. Real money rails are documented
  as out of scope. No payment was executed.
- **Proposed test coverage:** UI observation of eligibility, bill amount,
  vendor, resulting visible status, and run link. Server/database
  financial effect checks are conditional future coverage.
- **Automation strategy:** First milestone: do not exercise payment
  mutation without a safe, identifiable demo setup; document UI evidence
  separately. Future: controlled integration and persistence checks.
- **Status:** Open — payment behavior documented, not executed.

### RISK-009 — Duplicate payment effect on repeat or retried action

- **Feature/domain:** Payment idempotency / duplicate payment.
- **Risk description:** Repeated Pay now, process-due, or retry requests
  create multiple payment runs, activity entries, or payment effects for
  the same bill.
- **Business consequence:** Duplicate financial settlement or misleading
  financial history.
- **Technical cause:** **Unknown.** Candidate causes include missing
  idempotency/state guards or a retry path that is not transaction-safe.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 5
  (duplicate persisted effects may not be visible in the UI); **RPN 50;
  P1** (financial-integrity override).
- **Existing mitigation:** Product docs state stale/duplicate submissions
  are guarded and repeated process-due is a no-op. These are documentation
  claims, not independently verified results.
- **Proposed test coverage:** Observe whether the UI prevents or explains
  a repeated action if safely exposed. Prove no duplicate effect only
  with a suitable server/database test interface.
- **Automation strategy:** First milestone: record UI response/state only
  if a safe repeated action can be exercised. Future: idempotency and
  persisted effect assertions.
- **Status:** Open — docs only; no repeat action executed.

### RISK-010 — Incorrect payment method or scheduled date

- **Feature/domain:** Payment scheduling.
- **Risk description:** Scheduling uses the wrong payment method or date,
  accepts a past/invalid date, or processes a bill earlier/later than
  intended.
- **Business consequence:** Payment may be delayed, processed prematurely,
  or assigned to the wrong settlement method.
- **Technical cause:** **Unknown.** Candidate causes include date
  conversion/time-zone errors, stale defaults, or weak input validation.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 3
  (scheduled date and method are expected to be visible); **RPN 24; P1**
  (financial timing/integrity override).
- **Existing mitigation:** Docs state dates are date-only and today or
  later; payment method defaults from vendor but can be overridden. No
  schedule action was executed.
- **Proposed test coverage:** UI checks for method defaults/override and
  allowed date boundaries, with visible post-schedule review. Exact
  persisted scheduling and execution timing remain conditional.
- **Automation strategy:** First milestone: UI checks only when a safe
  unique approved bill is available. Future: server date/time-zone
  boundary tests.
- **Status:** Open — rules documented; scheduling not exercised.

### RISK-011 — Concurrent or batch payment leaves partial/duplicate state

- **Feature/domain:** Concurrency, batch scheduling, transaction rollback.
- **Risk description:** Concurrent decisions or a stale item in a batch
  causes partial updates, duplicate effects, or a PaymentRun that does not
  match the bills advanced.
- **Business consequence:** Bills and payment history can disagree; some
  bills may be paid/scheduled while others are incorrectly omitted or
  duplicated.
- **Technical cause:** **Unknown.** Transaction and conditional-update
  controls are described in docs but not verified against the deployed
  behavior.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 5
  (requires controlled concurrency and persisted-state inspection);
  **RPN 50; P1** (financial-integrity override).
- **Existing mitigation:** Docs state batch scheduling rolls back if any
  selected row is stale and payment actions use transactions. No batch or
  concurrency action was run.
- **Proposed test coverage:** Conditional future testing with controlled
  simultaneous requests and state/run/activity assertions. UI alone is
  insufficient to establish atomicity.
- **Automation strategy:** Future API/server/database integration tests
  only after a safe documented interface is available; outside first
  milestone.
- **Status:** Open — conditional; no controlled concurrency interface.

### RISK-012 — Missing, duplicate, or incorrect activity history

- **Feature/domain:** Audit trail and actor attribution.
- **Risk description:** A bill state change has no activity entry, appears
  more than once, or attributes the action to the wrong actor/system.
- **Business consequence:** Reviewers cannot reliably reconstruct who did
  what and when; audit evidence may conflict with bill state.
- **Technical cause:** **Unknown.** Candidate cause is a failed or
  non-atomic write between state and activity history.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 4
  (requires comparing activity with state changes); **RPN 32; P2**.
- **Existing mitigation:** Docs state bill changes append activity and
  history is written with state changes in a transaction. Live detail
  exposed Created and Submitted entries for one seeded bill.
- **Proposed test coverage:** Check visible timeline for one or more safe
  UI transitions and confirm the actor/event text. Atomicity and complete
  history require future persistence checks.
- **Automation strategy:** First milestone: UI assertions on the visible
  bill timeline. Future: state/history transaction tests.
- **Status:** Open — one display sample observed; completeness and
  attribution unverified.

### RISK-013 — AI extraction supplies incorrect invoice values

- **Feature/domain:** AI invoice extraction.
- **Risk description:** Incorrect vendor, invoice number, dates, line
  amounts, or GL suggestions are accepted without sufficient human
  review.
- **Business consequence:** Incorrect or fraudulent-looking bill data may
  enter approval and payment workflows.
- **Technical cause:** Probabilistic extraction errors are an inherent
  product risk; provider/model behavior and field-level failure rates are
  **unknown**.
- **Scoring:** Impact 5; likelihood 3 (estimate: extraction is
  probabilistic); detectability 3 (values are visible for review);
  **RPN 45; P1** (financial-integrity override).
- **Existing mitigation:** Docs describe AI markers, editable fields,
  normal bill validation, and two sample fixtures. Intake is documented
  as temporary upload/extraction with best-effort file deletion.
- **Proposed test coverage:** With synthetic fixtures only, compare
  extracted candidates to expected values, check visible review markers,
  and confirm edits remain possible. Do not equate plausible extraction
  with correctness or persistence.
- **Automation strategy:** First milestone: UI checks only if safe fixture
  uploads and service availability are established. Future: broader
  extraction validation with controlled provider fixtures.
- **Status:** Open — documented capability; no fixture uploaded or
  extraction run.

### RISK-014 — Invalid bill or invoice input passes validation

- **Feature/domain:** Invoice validation, file validation, bill capture.
- **Risk description:** Missing, malformed, oversized, invalid-date,
  invalid-amount, inactive-vendor, or invalid-GL input is accepted or
  causes inconsistent form state.
- **Business consequence:** Bad invoice data can route for approval or
  affect financial calculations.
- **Technical cause:** **Unknown.** Candidate causes include incomplete
  client/server validation or inconsistent AI/manual input handling.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 3 (form
  errors are visible, but backend acceptance is not); **RPN 24; P1**
  (financial-integrity override for invalid monetary/vendor data).
- **Existing mitigation:** Docs describe required invoice number, active
  vendor, active expense GL, amount/date validation, and a 10 MB limit for
  PDF/PNG/JPG intake. Exact numeric amount/date limits are not documented
  in the reviewed pages.
- **Proposed test coverage:** Observe visible validation feedback for
  manual fields and documented file constraints. Server-side rejection
  and exact boundary checks require verified expected rules.
- **Automation strategy:** First milestone: selected UI validation checks
  with synthetic inputs and no persistence unless safe. Future: shared
  schema/server validation tests.
- **Status:** Open — rules partly documented; negative validation
  untested.

### RISK-015 — Recurring series generates missing or duplicate bills

- **Feature/domain:** Recurring bills and generation.
- **Risk description:** A due series skips an occurrence, creates a
  duplicate occurrence, applies the wrong cadence/end rule, or generates
  a bill with the wrong approval/payment treatment.
- **Business consequence:** Bills may be omitted or duplicated, leading
  to missed obligations or duplicate payment exposure.
- **Technical cause:** **Unknown.** Cadence calculations, catch-up caps,
  and uniqueness behavior are implementation claims in docs, not
  independently verified.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 5
  (requires comparing a series schedule with generated bills); **RPN 50;
  P1** (financial-integrity override).
- **Existing mitigation:** Docs describe five cadences, end rules,
  per-bill/upfront approval modes, and a 60-occurrence-per-run cap. Live
  recurring UI displayed one active series; docs describe four seeded
  statuses, an unresolved discrepancy.
- **Proposed test coverage:** First inspect series status and generated
  occurrence visibility. Generation, duplicate prevention, cadence
  boundaries, and catch-up require a controlled test setup.
- **Automation strategy:** First milestone: read-only UI assertions on
  visible series/occurrence details. Future: deterministic generator
  tests and persistence assertions.
- **Status:** Open — UI/docs differ on visible seed inventory; generation
  untested.

### RISK-016 — Cron processes the wrong bills or is not safely repeatable

- **Feature/domain:** Scheduled payment processing and cron.
- **Risk description:** The scheduled job processes future/not-due bills,
  misses due bills, or creates duplicate effects when retried or run
  alongside manual processing.
- **Business consequence:** Premature, delayed, or duplicate payments and
  unreliable payment history.
- **Technical cause:** **Unknown.** Docs describe a server-derived UTC
  cutoff and shared processor; deployed configuration, schedule, and
  interaction with concurrent requests are unverified.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 5
  (requires job execution and state comparison); **RPN 50; P1**
  (financial-integrity override).
- **Existing mitigation:** Docs and Bills UI describe daily 13:00 UTC
  Auto-pay; product docs say cron and Run now share a processor. The cron
  endpoint and job were not invoked.
- **Proposed test coverage:** Read-only UI review of due/next-run summary;
  job cutoff, authorization, repeat, and resulting effects are
  conditional future coverage.
- **Automation strategy:** First milestone: assert only safe visible
  summaries. Future: controlled cron-route tests with authorization and
  state/run/activity checks.
- **Status:** Open — schedule visible/documented; cron unexecuted.

### RISK-017 — Bill/payment state differs from persisted financial state

- **Feature/domain:** Database integrity and transaction behavior.
- **Risk description:** UI indicates bill or payment success while related
  persisted bill, line, payment-run, or activity records are missing,
  inconsistent, or partially committed.
- **Business consequence:** Operators may rely on a payment or approval
  that did not complete correctly; accounting records may be incomplete.
- **Technical cause:** **Unknown.** Candidate causes include partial
  transaction failure or stale reads; no database access is available.
- **Scoring:** Impact 5; likelihood 2 (estimate); detectability 5
  (UI alone cannot establish persisted state); **RPN 50; P1**
  (financial-integrity override).
- **Existing mitigation:** Product docs describe transactional writes and
  per-bill history. The live journal preview explicitly says it is not
  posted to a ledger; docs state there is no persisted global ledger.
- **Proposed test coverage:** Treat visible confirmation as UI evidence
  only. Validate persisted bills, lines, PaymentRuns, activity, and
  transaction rollback only if safe read/test access is granted.
- **Automation strategy:** Conditional API/integration/database tests;
  no direct DB access or interface is currently available.
- **Status:** Open — conditional; persistence unverified.

### RISK-018 — AP dashboard aging or exposure is misclassified

- **Feature/domain:** Dashboard / AP aging.
- **Risk description:** Due-date boundaries, status inclusion, or vendor
  aggregation misclassifies outstanding bills or amounts.
- **Business consequence:** Operators may overlook overdue exposure or
  prioritize the wrong vendors and bills.
- **Technical cause:** **Unknown.** Candidate causes include date boundary
  or status-projection defects.
- **Scoring:** Impact 4; likelihood 2 (estimate); detectability 3
  (individual bill rows and bucket totals are visible); **RPN 24; P2**.
- **Existing mitigation:** Product docs define Current/1–30/31–60/61–90/
  90+ buckets and describe a shared captured “today” for aging and
  overdue calculations. Live dashboard showed bucket totals and links.
- **Proposed test coverage:** Check displayed bucket membership against
  documented boundaries and a bill detail, using stable dates. Reconcile
  aggregate amounts with authoritative records only if safe state access
  becomes available.
- **Automation strategy:** First milestone: selected UI checks for
  observable links and bucket labels/contents; date logic unit tests are
  conditional on project-owned testable code.
- **Status:** Open — UI surface observed; aggregate correctness
  unverified.

## Coverage planning summary

| Priority | Risks | First-milestone fit |
|---|---|---|
| P1 | RISK-001–011, 013–017 | UI affordance, routing display, visible state, and review checks where safely observable; authorization bypass, financial effect, idempotency, concurrency, cron, and persistence need future interfaces. |
| P2 | RISK-012, 018 | Visible activity and dashboard display checks can be considered at UI level; server/data claims remain conditional. |

## Evidence and review

- [Phase 1 demo overview](demo-overview.md)
- [Access and environment boundaries](access-and-environment.md)
- [Phase 2 scoring definitions](../PLAN.md#6-phase-2--risk-based-testing-strategy)

Review likelihood estimates and update statuses when reliable test
results, incident information, or safe server/database access becomes
available. Do not convert documentation claims or UI observations into
verified server-side coverage.
