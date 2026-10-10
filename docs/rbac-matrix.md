# Billio RBAC and UI Behavior Matrix

Last reviewed: 2026-10-10

## Purpose and evidence boundary

This matrix records role permissions described in accessible Billio
product documentation and role-dependent UI behavior observed in the
deployed demo during Phase 1 reconnaissance (2026-10-08). It does not
claim authenticated identity or server-side authorization coverage.

The demo's “Viewing as” control is a role switcher, not a login. **A
visible or hidden control is evidence only of UI behavior.** No approval,
rejection, payment, bill creation, vendor mutation, invoice upload, or
recurring-series mutation was executed for this matrix. Therefore,
observable mutation results are marked “not executed.” No server
responses, persisted state, or resulting audit writes were inspected.

## Role identities

| Demo identity | Role shown by switcher | Evidence | Confidence and limits |
|---|---|---|---|
| Avery Chen | Bookkeeper | Live role switcher, inspected 2026-10-08; [role switcher decision](https://billio-psi.vercel.app/docs/decisions/0011-viewing-as-switcher-no-real-auth) | High confidence that this option is shown in the current demo; not an authenticated identity. |
| Marcus Rivera | AP Manager | Live role switcher, inspected 2026-10-08; role names also appear in [Bills](https://billio-psi.vercel.app/docs/product/bills) and [role taxonomy](https://billio-psi.vercel.app/docs/decisions/0019-role-taxonomy) | High confidence that this option is shown in the current demo; not an authenticated identity. |
| Priya Shah | Controller | Live role switcher, inspected 2026-10-08; role names also appear in [Vendors](https://billio-psi.vercel.app/docs/product/vendors) and [role taxonomy](https://billio-psi.vercel.app/docs/decisions/0019-role-taxonomy) | High confidence that this option is shown in the current demo; not an authenticated identity. |

## Permission and UI matrix

“Allowed” reports the permission documented by Billio product docs, not a
verified server authorization result. “Expected UI” reports documented
role behavior. “Observed result” reports only a direct page/control
observation from Phase 1; uninspected roles or unexecuted actions are
explicitly called out.

| Action | Bookkeeper — Avery | AP Manager — Marcus | Controller — Priya | Evidence, observed result, confidence and limits |
|---|---|---|---|---|
| View dashboard | **Allowed:** Yes. **Expected UI:** Dashboard metrics, aging, vendor rollup. | **Allowed:** Yes. **Expected UI:** Same read-only dashboard. | **Allowed:** Yes. **Expected UI:** Same read-only dashboard. | [Dashboard docs](https://billio-psi.vercel.app/docs/product/dashboard) say all roles can view. Dashboard rendered in the live UI as Marcus on 2026-10-08. High confidence for that visible page; role-by-role display equality was not exhaustively compared. |
| View bills list and bill detail | **Allowed:** Yes. **Expected UI:** Read bills/details. **Observed:** Bills list and ACME-10501 detail opened; awaiting-AP-manager message shown. | **Allowed:** Yes. **Expected UI:** Read bills/details and queue context. **Observed:** Bills list and same detail opened; approve/reject controls appeared on the pending item. | **Allowed:** Yes. **Expected UI:** Read bills/details and queue context. **Observed:** Not inspected directly in Phase 1. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) and [role-gating ADR](https://billio-psi.vercel.app/docs/decisions/0012-per-feature-role-gating) document bill viewing for the roles. Direct observations establish only rendered UI. No server response or data-access control was tested. |
| Create, edit, and submit a Draft bill | **Allowed:** Yes. **Expected UI:** New bill form; Draft editing/submission. | **Allowed:** Yes. **Expected UI:** Same capture controls. **Observed:** New-bill form opened. | **Allowed:** Yes. **Expected UI:** Same capture controls. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) describe all three capture-capable roles. Live `/bills/new` form was inspected as Marcus. No bill was created or submitted. For Avery and Priya, UI behavior is docs-only. |
| Use invoice intake on a new bill | **Allowed:** Yes for all bill-capture roles. **Expected UI:** Upload/pre-fill flow on `/bills/new`. | **Allowed:** Yes. **Expected UI:** Upload/pre-fill flow. **Observed:** PDF/image control visible on `/bills/new`. | **Allowed:** Yes. **Expected UI:** Upload/pre-fill flow. | [Invoice intake docs](https://billio-psi.vercel.app/docs/product/invoice-intake) say Bookkeepers, AP Managers, and Controllers can use intake. UI control directly observed as Marcus only. No file was uploaded; no extraction or saved bill result exists. Upload transmits file bytes to configured services as documented. |
| Approve a bill awaiting AP Manager | **Allowed:** No. **Expected UI:** No decision controls; queue prompt may explain the next role. **Observed:** Prompt to switch to Marcus; no approval controls on ACME-10501. | **Allowed:** Yes, if not the bill creator. **Expected UI:** Approve control. **Observed:** Approve control on ACME-10501. | **Allowed:** Yes, if not the bill creator. **Expected UI:** Approve control. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) and [role-gating ADR](https://billio-psi.vercel.app/docs/decisions/0012-per-feature-role-gating). Bookkeeper and AP Manager UI directly observed; Controller behavior is docs-only. No approval was executed; no server check. |
| Reject a bill awaiting AP Manager | **Allowed:** No. **Expected UI:** No reject control. **Observed:** No decision controls on ACME-10501. | **Allowed:** Yes, if not the bill creator; a reason is required. **Expected UI:** Rejection reason and Reject control. **Observed:** Both shown on ACME-10501. | **Allowed:** Yes, if not the bill creator; a reason is required. **Expected UI:** Rejection controls. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) describes role and reason requirements. UI directly observed for Avery and Marcus only. Reject was not clicked; reason validation and resulting Draft/activity were not observed. |
| Approve or reject a bill awaiting Controller | **Allowed:** No. **Expected UI:** No decision controls. | **Allowed:** No. **Expected UI:** Waiting message for Controller; no decision controls. | **Allowed:** Yes, if not the bill creator. **Expected UI:** Decision controls. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) state Controller can decide either awaiting role and AP Manager cannot decide Controller-routed bills. This queue was not inspected in the live UI; all behavior here is docs-only. No action was executed. |
| Approve or reject a bill created by the current user | **Allowed:** No. **Expected UI:** No self-approval/rejection control. | **Allowed:** No. **Expected UI:** No self-approval/rejection control. | **Allowed:** No. **Expected UI:** No self-approval/rejection control. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) state nobody can decide a bill they created. A role switcher cannot prove distinct authenticated users. No self-created pending bill control/result was inspected; server enforcement is unverified. |
| View bill activity and journal preview | **Allowed:** Yes. **Expected UI:** Read timeline and preview. **Observed:** Activity and unposted journal preview displayed on ACME-10501. | **Allowed:** Yes. **Expected UI:** Read timeline and preview. **Observed:** Same seeded bill showed Created and Submitted entries and “Not yet posted to the ledger.” | **Allowed:** Yes. **Expected UI:** Read timeline and preview. | [Bills docs](https://billio-psi.vercel.app/docs/product/bills) describe detail history and journal preview for reviewers. Live view observed as Avery and Marcus. Rendered history does not prove complete, persisted, or atomic audit records. Controller display not separately checked. |
| View payment-run history and detail | **Allowed:** Yes. **Expected UI:** Read-only history. **Observed:** `/payments/runs` opened and showed the default 30-day empty state. | **Allowed:** Yes. **Expected UI:** Read run history and detail. | **Allowed:** Yes. **Expected UI:** Read run history and detail. | [Payments docs](https://billio-psi.vercel.app/docs/product/payments) document read access for all three roles. Avery's list view was directly observed; AP Manager and Controller detail access were not directly compared. Empty state under a 30-day filter does not mean there is no all-time history. |
| Schedule an Approved bill | **Allowed:** No. **Expected UI:** Schedule control unavailable. | **Allowed:** Yes. **Expected UI:** Schedule control for an eligible Approved bill. | **Allowed:** Yes. **Expected UI:** Schedule control for an eligible Approved bill. | [Payments docs](https://billio-psi.vercel.app/docs/product/payments) list AP Manager and Controller as mutators. As Avery, payment mutation controls were absent from the Bills list. Schedule controls on an Approved detail were not opened; no schedule action or result was observed. |
| Pay an Approved bill now | **Allowed:** No. **Expected UI:** Pay-now control unavailable. | **Allowed:** Yes. **Expected UI:** Pay-now control for an eligible Approved bill. | **Allowed:** Yes. **Expected UI:** Pay-now control for an eligible Approved bill. | [Payments docs](https://billio-psi.vercel.app/docs/product/payments). Bookkeeper payment controls were absent in observed Bills UI; AP Manager/Controller Pay-now controls were not directly inspected on an eligible bill. No payment was executed. |
| Batch schedule selected Approved bills | **Allowed:** No. **Expected UI:** Batch scheduling controls unavailable. | **Allowed:** Yes. **Expected UI:** Batch schedule action when eligible rows are selected. | **Allowed:** Yes. **Expected UI:** Batch schedule action when eligible rows are selected. | [Payments docs](https://billio-psi.vercel.app/docs/product/payments) document this role split. No rows were selected and no batch action was attempted. UI and transaction behavior unverified. |
| Run process-due now | **Allowed:** No. **Expected UI:** Run now unavailable. **Observed:** Run now absent from Avery's Bills page. | **Allowed:** Yes. **Expected UI:** Run now control. **Observed:** Button was visible on Marcus's Bills page. | **Allowed:** Yes. **Expected UI:** Run now control. | [Payments docs](https://billio-psi.vercel.app/docs/product/payments) and live Bills page. Avery and Marcus controls directly observed; Controller not directly checked. The action was not run. No payment processing result or server authorization was observed. |
| View vendor directory and details | **Allowed:** Yes. **Expected UI:** Read list/details. **Observed:** Vendor directory opened. | **Allowed:** Yes. **Expected UI:** Read list/details. **Observed:** Vendor directory opened; no New vendor link. | **Allowed:** Yes. **Expected UI:** Read list/details. **Observed:** Vendor directory opened. | [Vendors docs](https://billio-psi.vercel.app/docs/product/vendors) document read access to all roles. Directory views were opened in the live UI as all three roles during Phase 1. Page content was visible; no vendor data was changed. |
| Create, edit, archive, or reactivate vendor | **Allowed:** No. **Expected UI:** Management controls absent. **Observed:** No New vendor link. | **Allowed:** No. **Expected UI:** Management controls absent. **Observed:** No New vendor link. | **Allowed:** Yes. **Expected UI:** Management controls visible. **Observed:** New vendor link visible. | [Vendors docs](https://billio-psi.vercel.app/docs/product/vendors) and [role-gating ADR](https://billio-psi.vercel.app/docs/decisions/0012-per-feature-role-gating). Create link and absence for other roles observed; edit/archive/reactivate controls not individually inspected. No mutation or server check was performed. |
| View recurring series and generated bills | **Allowed:** Yes. **Expected UI:** Read-only list/details. | **Allowed:** Yes. **Expected UI:** List/details and management affordances. **Observed:** One active series visible. | **Allowed:** Yes. **Expected UI:** List/details and management affordances. | [Recurring bills docs](https://billio-psi.vercel.app/docs/product/recurring-bills) state all roles can view. AP Manager page inspected and showed one active series; this differed from the four documented seed examples. Bookkeeper and Controller list views not inspected. |
| Create, edit, cancel, or manually generate recurring series | **Allowed:** No. **Expected UI:** Mutation controls absent. | **Allowed:** Yes. **Expected UI:** New series and generation controls. **Observed:** New recurring series and Generate due occurrences buttons visible. | **Allowed:** Yes. **Expected UI:** New series and generation controls. | [Recurring bills docs](https://billio-psi.vercel.app/docs/product/recurring-bills). AP Manager controls directly observed; Bookkeeper and Controller affordances are docs-only. No series was created, edited, canceled, or generated. |
| Approve or reject a pending recurring series | **Allowed:** No; docs reserve mutations for AP leadership. | **Allowed:** Yes by the documented approval route when eligible. **Expected UI:** Decision controls only when awaiting role permits. | **Allowed:** Yes by the documented approval route when eligible. **Expected UI:** Decision controls only when awaiting role permits. | [Recurring bills docs](https://billio-psi.vercel.app/docs/product/recurring-bills) say approval is “by approval route” but do not define exact routing thresholds/identity rules on that page. No pending series decision controls were inspected. Do not infer a specific awaiting role. |
| View Settings approval policy and chart of accounts | **Allowed:** Yes. **Expected UI:** Read-only reference. | **Allowed:** Yes. **Expected UI:** Read-only reference. **Observed:** Policy and chart displayed. | **Allowed:** Yes. **Expected UI:** Read-only reference. **Observed:** Same policy and chart displayed. | [Settings docs](https://billio-psi.vercel.app/docs/product/settings) state the page is identical/read-only for all roles. Live UI inspected as AP Manager and Controller. Bookkeeper view not separately inspected. |
| Edit approval policy or GL accounts | **Allowed:** No; not available in this product slice. | **Allowed:** No; not available in this product slice. | **Allowed:** No; deferred even for Controller. **Observed:** Read-only/deferred message. | [Settings docs](https://billio-psi.vercel.app/docs/product/settings) state nobody can edit in this slice. AP Manager and Controller pages displayed read-only text; no edit action was attempted. |

## Evidence confidence and limits

| Evidence type | Confidence | What it establishes | What it does not establish |
|---|---|---|---|
| Live role switcher options | High for current visible options | The demo offers Avery Chen (Bookkeeper), Marcus Rivera (AP Manager), and Priya Shah (Controller). | Real authenticated identities, independent user sessions, or production RBAC. |
| Live visible/hidden control | High for that page, role, and review time | The observed UI exposed or omitted a control for the selected demo role. | Server-side rejection, protection against crafted requests, or absence of mutation. |
| Product documentation | Medium as a product expectation | What the Billio product documentation says should be allowed and how the UI is intended to behave. | That the deployed build or server enforces the rule correctly. |
| Visible status/activity after seed data loads | High for displayed text | What the page currently renders for that bill, role, and seed state. | Durable persistence, completeness/atomicity of audit history, or database correctness. |
| Unexecuted mutation | None for outcome | The action is documented or its control is visible. | Any resulting bill/payment/vendor state, server response, or audit effect. |

The Live UI observations above were made during Phase 1 on 2026-10-08.
The demo and seed data may change; re-check controls before turning these
observations into automation expectations. Server-side authorization,
authenticated identity, persistence, and no-mutation assertions remain
conditional future work requiring safe documented interfaces.

## Evidence references

- [Phase 1 demo overview](demo-overview.md)
- [Access and environment boundaries](access-and-environment.md)
- [Bills](https://billio-psi.vercel.app/docs/product/bills)
- [Payments](https://billio-psi.vercel.app/docs/product/payments)
- [Vendors](https://billio-psi.vercel.app/docs/product/vendors)
- [Recurring bills](https://billio-psi.vercel.app/docs/product/recurring-bills)
- [Invoice intake](https://billio-psi.vercel.app/docs/product/invoice-intake)
- [Settings](https://billio-psi.vercel.app/docs/product/settings)
- [Dashboard](https://billio-psi.vercel.app/docs/product/dashboard)
- [ADR 0011 — Viewing-as switcher](https://billio-psi.vercel.app/docs/decisions/0011-viewing-as-switcher-no-real-auth)
- [ADR 0012 — Per-feature role gating](https://billio-psi.vercel.app/docs/decisions/0012-per-feature-role-gating)
- [ADR 0019 — Role taxonomy](https://billio-psi.vercel.app/docs/decisions/0019-role-taxonomy)
