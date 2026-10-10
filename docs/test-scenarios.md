# Billio Test Scenario Matrix

Last reviewed: 2026-10-10

## Scope and usage

This matrix maps every current risk in the [risk register](risk-register.md)
to at least one scenario. It defines intended checks; no scenario in this
document has been executed. The first-milestone layer is limited to visible
demo behavior. Server authorization, persisted financial effects,
transaction atomicity, cron behavior, concurrency, and idempotency require
future safe interfaces and are labelled conditional.

“Automation candidate” describes suitability for later automation, not
existing automation. Where a scenario changes demo data or uploads a
fixture, it must use a unique, synthetic, identifiable record/file and
follow the access and test-data boundaries. Do not infer persistence or
server enforcement from a UI result.

## Scenarios

### RBT-001 — Role switcher and bill/payment UI affordances

- **Risk ID:** RISK-001.
- **Feature:** Demo roles / bill and payment access.
- **Scenario:** Select each exposed role and inspect controls on Bills, a
  pending bill detail, and Payment runs.
- **Preconditions:** Demo is available; seeded sample pages load; role
  switcher offers Avery Chen, Marcus Rivera, and Priya Shah.
- **Expected result:** The switcher lists Bookkeeper, AP Manager, and
  Controller. Documented role-dependent controls and queue prompts match
  the [demo overview](demo-overview.md). UI visibility is recorded only;
  this does not prove server authorization.
- **Test type:** Role/access positive and negative UI check.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes, for stable role options and visible
  affordances; server rejection/no-mutation check is conditional future
  work.
- **Data requirements:** Existing seeded role examples; no mutation.
- **Dependencies:** Deployed demo and stable seed records.

### VEN-001 — Vendor management controls by role

- **Risk ID:** RISK-002.
- **Feature:** Vendor authorization.
- **Scenario:** Compare the vendor directory as Bookkeeper, AP Manager,
  and Controller.
- **Preconditions:** Vendor directory is available; select each demo role.
- **Expected result:** Bookkeeper and AP Manager can view vendors but do
  not see create/edit/archive controls; Controller sees management
  controls, as documented. Do not attempt a mutation in this scenario.
- **Test type:** Role/access UI check.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes, for role-dependent UI controls;
  unauthorized mutation and unchanged data are conditional future checks.
- **Data requirements:** Seeded vendor directory; no mutation.
- **Dependencies:** Deployed demo and role switcher.

### AUTH-001 — Creator cannot approve their own bill

- **Risk ID:** RISK-003.
- **Feature:** Separation of duties.
- **Scenario:** Open a documented self-created pending bill as its creator
  and inspect available decision controls.
- **Preconditions:** Seeded self-created pending bill is available and its
  creator/awaiting role are visible.
- **Expected result:** Product docs say the creator cannot approve or
  reject their bill. Record the visible UI affordance or prompt; a role
  switcher does not provide independent authenticated identities and
  cannot prove enforcement.
- **Test type:** Separation-of-duties UI assessment.
- **Test layer:** UI; authenticated server check conditional.
- **Priority:** P1.
- **Automation candidate:** Conditional, only if the seeded example is
  stable. Authenticated creator/approver isolation requires future access.
- **Data requirements:** Existing self-created seed bill; no mutation.
- **Dependencies:** Stable seed bill and documented creator/approver
  expectations.

### BILL-001 — Approval threshold boundary routing

- **Risk ID:** RISK-004.
- **Feature:** Approval threshold selection.
- **Scenario:** Submit identifiable bills immediately below, at, and
  above `$5,000.00`.
- **Preconditions:** Safe unique bill records can be created through the
  UI; active vendor and expense GL account are available; form supports
  the amounts; shared-demo mutation boundaries are acceptable.
- **Expected result:** Standard amount below `$5,000.00` awaits AP Manager;
  `$5,000.00` and above await Controller, per the seeded policy shown in
  Settings and described in product docs. This establishes visible
  routing only.
- **Test type:** Boundary / workflow.
- **Test layer:** UI; rule persistence/server checks conditional.
- **Priority:** P1.
- **Automation candidate:** Conditional, because submitting bills changes
  shared demo data; use unique identifiers and a documented safe-data
  approach before automating.
- **Data requirements:** Synthetic invoice numbers and amounts below,
  equal to, and above the threshold; active vendor and expense GL.
- **Dependencies:** Stable seeded threshold policy; UI allows safe bill
  submission.

### BILL-002 — Supported Draft submission and approval transition

- **Risk ID:** RISK-005.
- **Feature:** Bill lifecycle.
- **Scenario:** Create a minimal synthetic draft, submit it, and inspect
  its pending state and awaiting role; use an eligible approver only if
  the test data is explicitly safe to mutate.
- **Preconditions:** Safe unique test record; known active vendor and GL;
  expected approver role is determined from Settings before submission.
- **Expected result:** Docs specify Draft → Pending approval → Approved.
  After submission, the bill shows Pending approval and the expected
  awaiting role. If approval is separately exercised, an eligible
  non-creator approver moves it to Approved and the detail reflects that
  state. UI state is not persistence proof.
- **Test type:** Positive lifecycle workflow.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Conditional, because creation/submission and
  approval mutate shared demo data.
- **Data requirements:** Unique synthetic bill and safe test vendor.
- **Dependencies:** Documented lifecycle, role switcher, stable seed
  policy, safe data strategy.

### BILL-003 — Rejection requires a reason and returns to revision

- **Risk ID:** RISK-005.
- **Feature:** Bill rejection lifecycle.
- **Scenario:** On a safe pending bill, inspect rejection validation and
  rejection outcome with a non-empty synthetic reason.
- **Preconditions:** Pending bill awaits the selected approver; bill is
  explicitly safe for mutation; approver is not the bill creator.
- **Expected result:** Rejection requires a reason and returns the bill to
  Draft with a visible Needs revision indication, per product docs. No
  “Rejected” current status is expected. Confirm visible activity if
  exposed.
- **Test type:** Negative validation and workflow.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Conditional; rejection changes shared demo
  data and needs an isolated, identifiable record.
- **Data requirements:** Safe pending bill and synthetic rejection text.
- **Dependencies:** Rejection controls and documented rejection rule.

### BILL-004 — Invalid or stale bill action

- **Risk ID:** RISK-005.
- **Feature:** Bill state guards and revision handling.
- **Scenario:** Assess whether a stale edit/decision or repeated transition
  is rejected without duplicate state/history changes.
- **Preconditions:** Requires two controlled views or a documented test
  interface that can create a stale revision. Do not simulate by
  manipulating private endpoints.
- **Expected result:** Product docs describe stale revision rejection.
  Exact UI error and duplicate-action behavior must be confirmed from an
  authorized interface before asserting them. No server/persistence claim
  is made from UI alone.
- **Test type:** Negative / stale-state; concurrency risk assessment.
- **Test layer:** Server/integration and database, conditional future
  work; UI can record visible error only if exposed.
- **Priority:** P1.
- **Automation candidate:** No for the current demo-only milestone;
  conditional when a safe controlled interface is available.
- **Data requirements:** Controlled bill revision and concurrent/stale
  actors; dedicated test data.
- **Dependencies:** Safe server test interface and reliable state
  observation.

### FIN-001 — Bill total matches entered line amounts

- **Risk ID:** RISK-006.
- **Feature:** Financial calculations.
- **Scenario:** Enter multiple simple synthetic line amounts and compare
  the displayed total with the arithmetic sum on the form and bill detail.
- **Preconditions:** Safe UI-created bill; amount inputs accept the
  selected simple decimal values; no tax/rounding rule is assumed.
- **Expected result:** The displayed bill total equals the sum of visible
  line amounts for the selected values, and the detail repeats the
  submitted lines and total. This checks visible arithmetic only; exact
  rounding limits and persisted amount are separate unknowns.
- **Test type:** Calculation / UI consistency.
- **Test layer:** UI; unit/server/DB checks conditional.
- **Priority:** P1.
- **Automation candidate:** Conditional yes, after safe test-data setup;
  deterministic calculation logic cannot be tested here without
  project-owned code.
- **Data requirements:** Unique synthetic bill with two or more simple
  positive amounts.
- **Dependencies:** New-bill UI and stable total display.

### GL-001 — Bill line uses an active expense GL account

- **Risk ID:** RISK-007.
- **Feature:** GL coding.
- **Scenario:** Inspect the line-item GL picker, vendor default, and
  selected account on bill detail.
- **Preconditions:** Active vendor and active expense account exist; use
  a non-mutating existing bill or safe draft.
- **Expected result:** The picker exposes active expense accounts; a
  vendor default may prefill the first line as documented; the selected
  account is visible on bill detail. Invalid or archived account
  rejection is not asserted unless the UI exposes a safe test path.
- **Test type:** Functional / data-selection.
- **Test layer:** UI; server/DB validation conditional.
- **Priority:** P1.
- **Automation candidate:** Yes for stable visible choices and displayed
  account; crafted invalid-ID checks are not a UI automation candidate.
- **Data requirements:** Existing vendor/account configuration; no new
  vendor required.
- **Dependencies:** Settings, vendor, and bill pages.

### PAY-001 — Payment eligibility and visible payment details

- **Risk ID:** RISK-008.
- **Feature:** Payment execution.
- **Scenario:** Compare an Approved bill and a non-approved bill as
  Bookkeeper, AP Manager, and Controller; inspect payment controls and
  any confirmation details without submitting a payment.
- **Preconditions:** Seeded bills in Approved and non-approved states;
  role switcher available.
- **Expected result:** Docs permit payment mutations only for AP Manager
  and Controller and describe payment actions for approved bills. Record
  whether the UI shows the expected eligibility, vendor, and amount.
  Do not claim server enforcement or successful settlement.
- **Test type:** Eligibility / role UI check.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes for visibility and displayed values;
  actually submitting a payment is a separate, conditional mutation.
- **Data requirements:** Existing Approved and non-approved bills.
- **Dependencies:** Stable seeded bills and payment controls.

### PAY-002 — Paid result references the expected bill and amount

- **Risk ID:** RISK-008.
- **Feature:** Payment amount/vendor association.
- **Scenario:** If a payment is explicitly authorized for a safe demo bill,
  compare pre-action bill vendor/total with post-action bill status,
  payment-run summary, and visible activity/journal details.
- **Preconditions:** Dedicated identifiable bill is safe to pay; approved
  state and expected total are visible; UI payment action is available.
- **Expected result:** Visible payment history and resulting bill detail
  refer to the same bill/vendor and amount, and the bill shows Paid as
  documented. This does not prove a persisted or external payment effect.
- **Test type:** Positive payment workflow / UI consistency.
- **Test layer:** UI; API/DB reconciliation conditional.
- **Priority:** P1.
- **Automation candidate:** No by default in shared demo; reconsider only
  with a safely isolated test bill and explicit cleanup boundaries.
- **Data requirements:** Dedicated synthetic bill approved for payment.
- **Dependencies:** Safe mutation authorization, payment UI, run history.

### PAY-003 — Repeated Pay now / process-due behavior

- **Risk ID:** RISK-009.
- **Feature:** Payment idempotency.
- **Scenario:** If safely exposed, repeat the same payment/process-due
  action and record the UI response and visible status/history.
- **Preconditions:** Controlled bill/action and safe demo state; no
  financial side effect beyond documented simulated demo behavior.
- **Expected result:** Docs state repeat process-due is a no-op. For
  Pay now, an exact expected response is not asserted until the UI/docs
  specify it. Record visible feedback only; UI cannot prove no duplicate
  persisted effect.
- **Test type:** Idempotency / repeat-action observation.
- **Test layer:** UI observation first milestone; server/DB conditional.
- **Priority:** P1.
- **Automation candidate:** No for shared demo by default; future
  controlled integration test is preferred.
- **Data requirements:** Dedicated scheduled or approved bill in a safe
  controlled state.
- **Dependencies:** Safe payment test data; persisted run/effect visibility
  for conclusive assertion.

### PAY-004 — Payment method and date are correct before scheduling

- **Risk ID:** RISK-010.
- **Feature:** Payment scheduling.
- **Scenario:** Inspect the Schedule form for a safe Approved bill; verify
  vendor default method, override options, and date restrictions without
  confirming the action.
- **Preconditions:** Approved bill and safe test setup; form is available
  for a role permitted to schedule.
- **Expected result:** Method defaults from vendor when available and
  can be overridden; scheduling date is today or later, per docs. Exact
  time-zone conversion behavior is unknown and not inferred.
- **Test type:** Boundary / form validation.
- **Test layer:** UI; server date-boundary checks conditional.
- **Priority:** P1.
- **Automation candidate:** Yes for form defaults/options and visible
  validation if stable; schedule submission is conditional mutation.
- **Data requirements:** Approved bill with known vendor payment method.
- **Dependencies:** Payment scheduling UI and documented rule.

### PAY-005 — Batch scheduling rejects stale selection atomically

- **Risk ID:** RISK-011.
- **Feature:** Concurrency / transaction rollback.
- **Scenario:** Select multiple Approved bills, make one stale or
  ineligible through a controlled concurrent action, then submit a batch.
- **Preconditions:** Dedicated test environment or safe concurrent test
  interface; not appropriate for the shared demo without isolation.
- **Expected result:** Docs claim a stale/non-Approved selection causes
  the entire batch to roll back and report conflicts. Verify no selected
  bill or run is partially advanced using authoritative state. Expected
  behavior is documentation-based until validated.
- **Test type:** Concurrency / atomicity negative test.
- **Test layer:** Server/integration + database, conditional future work.
- **Priority:** P1.
- **Automation candidate:** No in current first milestone; conditional
  when isolated data and concurrency control exist.
- **Data requirements:** Multiple controlled Approved bills and one
  deliberately stale selection.
- **Dependencies:** Safe test environment, concurrent action interface,
  authoritative run and bill state.

### AUD-001 — Bill activity matches visible successful transitions

- **Risk ID:** RISK-012.
- **Feature:** Activity history / actor attribution.
- **Scenario:** Review the activity timeline before and after one safe
  UI transition and compare displayed event, actor, and time to the
  visible bill state.
- **Preconditions:** Existing seeded bill or safe uniquely identified
  draft; do not perform an unnecessary mutation.
- **Expected result:** The timeline exposes the documented event and
  visible actor/time for the transition. One visible example does not
  prove complete or atomic audit persistence.
- **Test type:** Audit/history UI consistency.
- **Test layer:** UI; database/transaction check conditional.
- **Priority:** P2.
- **Automation candidate:** Yes for stable event text on seeded data;
  state-history completeness remains conditional.
- **Data requirements:** Existing bill with activity entries.
- **Dependencies:** Bill detail and activity timeline.

### INV-001 — AI-prefilled invoice values remain reviewable

- **Risk ID:** RISK-013.
- **Feature:** AI invoice extraction.
- **Scenario:** With a synthetic documented fixture and configured
  extraction dependencies, inspect prefilled values and correct a
  deliberately chosen field before any save.
- **Preconditions:** Synthetic, non-sensitive fixture; user accepts that
  file bytes are sent to configured Blob/Gemini services; file deletion
  is best-effort; extraction dependencies are available.
- **Expected result:** Extracted fields appear in the normal bill form
  with AI review markers; fields remain editable; manual corrections
  replace candidate values. Extraction output itself is probabilistic
  and must be compared with fixture content, not assumed correct.
- **Test type:** AI-assisted intake / human-review control.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Conditional, only with approved synthetic
  fixture, stable provider access, and controlled upload setup.
- **Data requirements:** Synthetic PDF/PNG/JPG fixture; no real invoice
  or sensitive data.
- **Dependencies:** Upload UI, Blob token, Google Gemini API access, safe
  synthetic fixture.

### INV-002 — Invoice file and extracted values meet documented limits

- **Risk ID:** RISK-014.
- **Feature:** Invoice validation and file handling.
- **Scenario:** Assess supported file types/size and visible handling of
  missing or invalid extracted date, amount, vendor, and GL suggestions.
- **Preconditions:** Synthetic files only; no saving a bill; use file
  cases that can be safely uploaded; exact amount/date boundaries must
  first be obtained from accessible requirements.
- **Expected result:** Product docs specify PDF/PNG/JPG up to 10 MB.
  Intake should leave missing values editable and drop invalid
  dates/amounts/unknown GL suggestions. Exact unsupported-file error
  copy and numeric amount/date bounds are unknown until observed.
- **Test type:** Negative validation / boundary.
- **Test layer:** UI; server validation conditional.
- **Priority:** P1.
- **Automation candidate:** Conditional; upload tests depend on external
  services and must use synthetic files. Pure server validation is future
  work.
- **Data requirements:** Synthetic supported and boundary files; no
  confidential invoices.
- **Dependencies:** Upload UI, extraction service, exact business rules
  for any numeric boundary assertion.

### REC-001 — Recurring series list and role-dependent controls

- **Risk ID:** RISK-015.
- **Feature:** Recurring bills.
- **Scenario:** View the recurring series list as each role; compare
  visibility of read and mutation controls; inspect series state and
  generated occurrence links.
- **Preconditions:** Recurring page and role switcher available; record
  the live inventory because documentation and current seed inventory
  differed at last review.
- **Expected result:** Docs say all roles can view; AP Manager and
  Controller can manage/generate while Bookkeeper is read-only. Do not
  require four exact seeded rows because the live page showed one active
  series at last review.
- **Test type:** Role UI / data-display observation.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes for role controls and displayed fields;
  seed count/status assertions are conditional on stable fixture data.
- **Data requirements:** Current seeded recurring series; no mutation.
- **Dependencies:** Recurring page, role switcher, seed stability.

### REC-002 — Recurring generation creates the documented occurrence

- **Risk ID:** RISK-015.
- **Feature:** Recurring generation and cadence.
- **Scenario:** In a controlled setup, generate one due series occurrence
  and inspect its invoice/date/amount, approval mode, series pointer, and
  duplicate protection on a repeat run.
- **Preconditions:** Dedicated safe series and test clock/control; manual
  generation or cron must not run against shared reviewer data.
- **Expected result:** Generated bill uses the series template and
  documented per-bill/upfront approval mode; repeat generation does not
  duplicate an occurrence. Exact calendar behavior should follow verified
  cadence/end rules. Docs are the expectation source, not verified result.
- **Test type:** Positive generation / repeat behavior.
- **Test layer:** Server/integration + database; UI summary can be
  supplemental only.
- **Priority:** P1.
- **Automation candidate:** No in current shared demo; conditional with
  isolated data and controllable date.
- **Data requirements:** Dedicated recurring series, expected occurrence
  schedule, controlled test date.
- **Dependencies:** Safe generator interface, stable clock, persisted
  series and bill state.

### CRON-001 — Process-due selects only bills due at the UTC cutoff

- **Risk ID:** RISK-016.
- **Feature:** Scheduled payment cron.
- **Scenario:** In a controlled environment, process one due and one
  future Scheduled bill, then repeat the job.
- **Preconditions:** Dedicated safe scheduled bills; controllable server
  date or authorized cron test interface; never invoke the shared demo
  mutation during reconnaissance.
- **Expected result:** Docs state only Scheduled bills with scheduled date
  at or before server-derived UTC today become Paid; a repeat with no due
  bills is a no-op. Verify bill, run, and activity changes via an
  authoritative state source.
- **Test type:** Date boundary / cron / idempotency.
- **Test layer:** Server/integration + database, conditional future work.
- **Priority:** P1.
- **Automation candidate:** No for the current demo; future deterministic
  cron test when safe interface and test clock exist.
- **Data requirements:** Due and future Scheduled bills with known
  methods and expected totals.
- **Dependencies:** Authorized cron route, controlled server date,
  safe data, authoritative state access.

### DB-001 — Bill/payment writes leave consistent persisted state

- **Risk ID:** RISK-017.
- **Feature:** Database integrity / transaction behavior.
- **Scenario:** Compare a successful bill creation or payment action with
  bill, line items, total, payment run, activity, and resulting status in
  authoritative storage.
- **Preconditions:** Safe read access and authorized isolated test data;
  neither is currently available.
- **Expected result:** Related state and history agree and failed
  transactions leave no partial records. Product docs describe
  transactional writes, but the expected persisted result cannot be
  verified through current UI access.
- **Test type:** Persistence / transaction integration.
- **Test layer:** API/server + database, conditional future work.
- **Priority:** P1.
- **Automation candidate:** No in current milestone; conditional only
  after safe database/test access is granted.
- **Data requirements:** Isolated bill/payment records and authoritative
  database snapshots.
- **Dependencies:** Documented interfaces, safe DB access, transaction
  observability.

### DASH-001 — Dashboard aging bucket membership matches documented dates

- **Risk ID:** RISK-018.
- **Feature:** Dashboard / AP aging.
- **Scenario:** Compare displayed bucket and linked bill detail for bills
  on, before, and after documented aging boundaries.
- **Preconditions:** Stable seeded bills with known due dates; avoid
  current-date-sensitive assertions without a controlled date.
- **Expected result:** Docs define Current (due today or later), 1–30,
  31–60, 61–90, and 90+ days past due. Bills in Draft,
  Pending approval, and Paid are excluded from aging. Verify visible
  bucket placement and link target only; exact aggregate reconciliation
  needs authoritative bill data.
- **Test type:** Date boundary / reporting consistency.
- **Test layer:** UI; calculation/unit or data reconciliation conditional.
- **Priority:** P2.
- **Automation candidate:** Conditional yes for stable dates and visible
  links; not against drifting seed dates without a test clock.
- **Data requirements:** Known due dates and statuses spanning bucket
  boundaries.
- **Dependencies:** Dashboard UI, bill details, controlled date or
  stable seed fixtures.

## Risk-to-scenario traceability

| Risk ID | Scenario IDs |
|---|---|
| RISK-001 | RBT-001 |
| RISK-002 | VEN-001 |
| RISK-003 | AUTH-001 |
| RISK-004 | BILL-001 |
| RISK-005 | BILL-002, BILL-003, BILL-004 |
| RISK-006 | FIN-001 |
| RISK-007 | GL-001 |
| RISK-008 | PAY-001, PAY-002 |
| RISK-009 | PAY-003 |
| RISK-010 | PAY-004 |
| RISK-011 | PAY-005 |
| RISK-012 | AUD-001 |
| RISK-013 | INV-001 |
| RISK-014 | INV-002 |
| RISK-015 | REC-001, REC-002 |
| RISK-016 | CRON-001 |
| RISK-017 | DB-001 |
| RISK-018 | DASH-001 |

## First-milestone candidates

The following scenarios have a plausible read-only UI automation path:
RBT-001, VEN-001, GL-001, AUD-001, REC-001, and DASH-001 when the
relevant records and dates are stable. BILL-001–003, FIN-001, PAY-002,
PAY-003, PAY-004, and INV-001–002 can change shared demo data or transmit
files; treat them as conditional until safe unique test data and
dependencies are established. BILL-004, PAY-005, REC-002, CRON-001, and
DB-001 are conditional future server/integration/database work.

## Evidence references

- [Demo overview](demo-overview.md)
- [Risk register](risk-register.md)
- [Project Phase 4 definition](../PLAN.md#8-phase-4--test-scenario-matrix)
