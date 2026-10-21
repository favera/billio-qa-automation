# Billio Test Scenario Matrix

Last reviewed: 2026-10-21

## Scope and usage

This matrix maps every current risk in the [risk register](risk-register.md)
to at least one scenario. It defines intended checks and marks implemented
coverage separately. The first-milestone layer is limited to visible
demo behavior. Server authorization, persisted financial effects,
transaction atomicity, cron behavior, concurrency, and idempotency require
future safe interfaces and are labelled conditional.

“Automation candidate” describes suitability for later automation, not
existing automation. The suite currently covers a read-only subset of
RBT-001 (role options and Bookkeeper/AP Manager process-due control
visibility), VEN-001 (vendor management link visibility for all three
roles), STATE-001 (seeded pending state and activity display), and FIN-002
(unsaved line total around the $5,000 boundary). All five current UI tests
last passed on 2026-10-20; results are UI evidence only. Other scenarios
and no vendor, bill, or payment creation/execution scenario has yet been
run. Test mutations may use uniquely identified synthetic vendors and
bills through supported UI flows. Submission/approval and payment flows
are approved only on test-created records; process-due must be scoped so
it cannot pay unrelated bills. Do not infer persistence or server
enforcement from a UI result.

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
  vendor creation is covered separately. Unauthorized mutation and
  unchanged-data server assertions remain conditional future checks.
- **Data requirements:** Seeded vendor directory; no mutation.
- **Dependencies:** Deployed demo and role switcher.

### VEN-002 — Create a uniquely identified synthetic vendor

- **Risk ID:** RISK-002.
- **Feature:** Vendor creation and displayed vendor data.
- **Scenario:** As Controller, create a minimal synthetic vendor through
  the supported UI and inspect its directory/detail representation.
- **Preconditions:** Vendor form is available; required fields and any
  payment-method defaults are known; fabricated contact/remittance data
  are used.
- **Expected result:** The new vendor is visible with its unique name and
  selected documented defaults. This is UI evidence only and does not
  prove persistence or server authorization.
- **Test type:** Positive create / data display.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes, after spec review; use unique identifiers
  and allow the synthetic vendor to remain in the demo.
- **Data requirements:** Fabricated organization name and synthetic
  values only; no real email, address, tax ID, or banking details.
- **Dependencies:** Controller role, vendor creation UI, stable required
  field labels and defaults.

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
- **Preconditions:** Unique synthetic vendor and bill can be created via
  supported UI; form supports the amounts; threshold policy is visible.
- **Expected result:** Standard amount below `$5,000.00` awaits AP Manager;
  `$5,000.00` and above await Controller, per the seeded policy shown in
  Settings and described in product docs. This establishes visible
  routing only.
- **Test type:** Boundary / workflow.
- **Test layer:** UI; rule persistence/server checks conditional.
- **Priority:** P1.
- **Automation candidate:** Yes, after spec review; create uniquely
  identified vendor/bills, submit each, and inspect the awaiting role.
  The records may remain in the demo.
- **Data requirements:** Synthetic invoice numbers and amounts below,
  equal to, and above the threshold; active vendor and expense GL.
- **Dependencies:** Stable seeded threshold policy; UI allows safe bill
  submission.

### BILL-002 — Supported Draft submission and approval transition

- **Risk ID:** RISK-005.
- **Feature:** Bill lifecycle.
- **Scenario:** Create a minimal synthetic bill, submit it, inspect its
  pending state and awaiting role, then approve it as an eligible
  non-creator reviewer and inspect Approved state.
- **Preconditions:** Unique test-created bill; known active vendor and GL;
  expected approver role is determined from Settings before submission.
- **Expected result:** Docs specify Draft → Pending approval → Approved.
  The bill shows Pending approval and the expected awaiting role after
  submission, then Approved after the eligible reviewer acts. UI state is
  not persistence proof.
- **Test type:** Positive lifecycle workflow.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes, after spec review; use a test-created
  bill and explicitly select the documented approver role. This scenario
  does not pay the bill.
- **Data requirements:** Unique synthetic vendor and bill.
- **Dependencies:** Documented lifecycle, role switcher, stable policy,
  supported vendor/bill UI, and safe data strategy.

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
- **Automation candidate:** Yes, after spec review; reject only a unique
  test-created bill and retain the resulting Draft for review.
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

### BILL-005 — Create and inspect a uniquely identified Draft bill

- **Risk ID:** RISK-005.
- **Feature:** Bill creation and Draft state display.
- **Scenario:** Create one minimal synthetic bill through the supported
  new-bill UI and inspect its resulting detail page.
- **Preconditions:** New-bill form is available; a synthetic or seeded
  active vendor and expense GL account can be selected; Create saves a Draft
  without submitting it.
- **Expected result:** A bill detail is visible with the unique synthetic
  invoice number, selected vendor, entered line amount, and Draft status.
  Do not submit or perform any decision/payment action. This is visible UI
  evidence only, not proof of persistence.
- **Test type:** Positive create / state display.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes, after scenario review; create serially
  with a unique run ID. The synthetic Draft may remain in the shared demo.
- **Data requirements:** One minimal bill using fixed synthetic values,
  an active vendor, and active expense GL; unique invoice
  number `test-bill-<UTC-run-id>-BILL-005`.
- **Dependencies:** Supported bill creation UI, stable Draft detail
  fields, and an existing active vendor/account.

### STATE-001 — Seeded pending approval state and activity snapshot

- **Risk ID:** RISK-005.
- **Feature:** Bill lifecycle display and activity history.
- **Scenario:** Open seeded bill ACME-10501 as Bookkeeper and inspect its
  current status, awaiting role, and visible creation/submission events.
- **Preconditions:** ACME-10501 remains a seeded Pending approval bill
  awaiting AP Manager, with Created and Submitted for approval entries.
  This state was rechecked read-only on 2026-10-14.
- **Expected result:** The detail displays Pending approval, says it
  awaits AP Manager approval, and shows the Created bill and Submitted
  for approval events. This observes a current state only; it does not
  validate transition correctness or persisted history.
- **Test type:** State snapshot / activity display; read-only.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes while the stable seed remains in this
  state; stop or revise the check if its seed precondition changes.
- **Data requirements:** Existing seeded bill ACME-10501; no mutation.
- **Dependencies:** Demo availability, stable seed details, role switcher.

### FIN-001 — Created Draft total matches entered line amounts

- **Risk ID:** RISK-006.
- **Feature:** Financial calculations.
- **Scenario:** Create a uniquely identified Draft with multiple simple
  synthetic line amounts and compare the displayed total with their
  arithmetic sum on the form and bill detail.
- **Preconditions:** New-bill UI, an active vendor and expense
  GL; amount inputs accept selected simple decimal values; no
  tax/rounding rule is assumed. The Draft may remain in the shared demo.
- **Expected result:** The displayed bill total equals the sum of visible
  line amounts for the selected values, and the detail repeats the
  saved Draft lines and total. This checks visible arithmetic only; exact
  rounding limits and persisted amount are separate unknowns.
- **Test type:** Calculation / UI consistency.
- **Test layer:** UI; unit/server/DB checks conditional.
- **Priority:** P1.
- **Automation candidate:** Yes, after scenario review; create serially
  with a unique run ID. This does not include submission or approval;
  deterministic calculation logic cannot be tested here without
  project-owned code.
- **Data requirements:** Unique synthetic bill with two or more simple
  positive amounts, vendor, and expense GL.
- **Dependencies:** New-bill UI and stable total display.

### FIN-002 — Unsaved line total across the approval threshold

- **Risk ID:** RISK-006.
- **Feature:** Financial calculation / threshold-adjacent display.
- **Scenario:** On a new, unsaved bill, enter `$4,999.99` and `$0.01` in
  separate lines, then change the second line to `$0.02`.
- **Preconditions:** New-bill form is available; the Bookkeeper role can
  open it; amount inputs accept the two decimal values.
- **Expected result:** The displayed total updates from `$5,000.00` to
  `$5,000.01`. Do not submit the bill. This checks displayed arithmetic
  only, not approval routing, rounding rules generally, or persistence.
- **Test type:** Financial boundary / UI calculation; no mutation.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Yes; both lines remain unsaved and the test
  does not click Create bill.
- **Data requirements:** Synthetic values entered into the transient form;
  no record or invoice file.
- **Dependencies:** Stable amount labels, Add line button, and total display.

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
  Pay Now on a test-created bill is covered by PAY-002. UI visibility
  does not establish server enforcement.
- **Data requirements:** Existing Approved and non-approved bills.
- **Dependencies:** Stable seeded bills and payment controls.

### PAY-002 — Paid result references the expected bill and amount

- **Risk ID:** RISK-008.
- **Feature:** Payment amount/vendor association.
- **Scenario:** Create and approve a uniquely identified synthetic bill,
  execute Pay now, then compare pre-action vendor/total with post-action
  bill status, payment-run summary, and visible activity/journal details.
- **Preconditions:** Supported vendor/bill/approval UI is available; the
  bill is created for this scenario and its approved state and expected
  total are visible; payment UI is available.
- **Expected result:** Visible payment history and resulting bill detail
  refer to the same bill/vendor and amount, and the bill shows Paid as
  documented. This does not prove a persisted or external payment effect.
- **Test type:** Positive payment workflow / UI consistency.
- **Test layer:** UI; API/DB reconciliation conditional.
- **Priority:** P1.
- **Automation candidate:** Yes, after spec review; execute only on a
  uniquely identified test bill. The payment and bill may remain in the
  demo. This does not establish external settlement.
- **Data requirements:** Synthetic vendor and bill, approved test bill,
  expected amount, and Pay now action.
- **Dependencies:** Vendor/bill creation, documented approval route,
  payment UI, run history.

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
- **Automation candidate:** Conditional. The demo action is authorized,
  but repeat execution is suitable only if the UI clearly prevents a
  second effect or the test environment can contain a potential duplicate.
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
  validation; scheduling a test-created Approved bill is authorized.
- **Data requirements:** Approved bill with known vendor payment method.
- **Dependencies:** Payment scheduling UI and documented rule.

### PAY-006 — Scheduled test bill becomes Paid through process-due

- **Risk ID:** RISK-016.
- **Feature:** Scheduled payment execution.
- **Scenario:** Create a synthetic vendor and bill, submit and approve
  the bill, schedule it for a controlled due date, then execute the
  documented process-due UI action and inspect the result.
- **Preconditions:** The demo exposes a way to scope process-due to the
  test bill, or inspection confirms there are no unrelated due bills that
  the action could process. Method/date and expected bill total are
  visible before execution.
- **Expected result:** The test bill changes from Scheduled to Paid and
  the visible payment-run/activity details identify the same bill and
  amount. The UI result does not prove external settlement or persistence.
- **Test type:** Positive scheduled payment workflow.
- **Test layer:** UI.
- **Priority:** P1.
- **Automation candidate:** Conditional on safe scoping of the global
  process-due action. Do not run it if unrelated bills may be paid.
- **Data requirements:** Unique synthetic vendor and bill, controlled
  schedule date, payment method, and expected amount.
- **Dependencies:** Vendor/bill creation, submit/approval flow, scheduling
  form, process-due UI, visible run history.

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
- **Automation candidate:** Conditional on a reliable way to make one
  selected test bill stale without affecting seeded bills; server-side
  atomicity still requires authoritative state access.
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
- **Validation design:** See [database validation strategy](database-validation-strategy.md).
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
| RISK-002 | VEN-001, VEN-002 |
| RISK-003 | AUTH-001 |
| RISK-004 | BILL-001 |
| RISK-005 | BILL-002, BILL-003, BILL-004, BILL-005, STATE-001 |
| RISK-006 | FIN-001, FIN-002 |
| RISK-007 | GL-001 |
| RISK-008 | PAY-001, PAY-002 |
| RISK-009 | PAY-003 |
| RISK-010 | PAY-004 |
| RISK-011 | PAY-005 |
| RISK-012 | AUD-001 |
| RISK-013 | INV-001 |
| RISK-014 | INV-002 |
| RISK-015 | REC-001, REC-002 |
| RISK-016 | PAY-006, CRON-001 |
| RISK-017 | DB-001 |
| RISK-018 | DASH-001 |

## First-milestone candidates

The following scenarios have a plausible UI automation path with read-only
data or uniquely identified synthetic test records: RBT-001, VEN-001/002,
STATE-001, BILL-001/002/003/005, FIN-001/002, GL-001, AUD-001, REC-001,
DASH-001, PAY-001/002/004. PAY-006 is conditional on safely scoping
process-due; PAY-003 requires containment for a potential duplicate
effect. INV-001/002 require synthetic-file review. BILL-004, PAY-005,
REC-002, CRON-001, and DB-001 remain conditional on controlled state,
server/integration/database access, or isolation.

## Evidence references

- [Demo overview](demo-overview.md)
- [Risk register](risk-register.md)
- [Project Phase 4 definition](../PLAN.md#8-phase-4--test-scenario-matrix)
