# Billio Demo Overview

Last reviewed: 2026-10-08

## Purpose and evidence boundary

This overview records Phase 1 reconnaissance of the deployed Billio demo
and its accessible product documentation. It is a map for planning QA
coverage, not a claim that server-side behavior, persistence, or financial
integrity has been independently verified.

Evidence labels:

- **Live UI**: directly visible in Chrome at `https://billio-psi.vercel.app/`.
- **Product docs**: documented at the linked Billio product documentation
  pages; documentation claims have not been verified against source code.
- **Unknown**: not established by the demo UI or product docs reviewed.

The seven product documentation pages linked from the docs index were
accessible in Chrome: [Vendors](https://billio-psi.vercel.app/docs/product/vendors),
[Bills](https://billio-psi.vercel.app/docs/product/bills),
[Payments](https://billio-psi.vercel.app/docs/product/payments),
[Recurring bills](https://billio-psi.vercel.app/docs/product/recurring-bills),
[Dashboard](https://billio-psi.vercel.app/docs/product/dashboard),
[Invoice intake](https://billio-psi.vercel.app/docs/product/invoice-intake),
and [Settings](https://billio-psi.vercel.app/docs/product/settings). No
inaccessible page among those seven was encountered.

## Product areas and navigation

**Live UI:** The shared navigation exposes Dashboard, Bills, Payments,
Vendors, Settings, and Docs. The Bills page links to Recurring series and
New bill. A bill detail page links back to Bills. Vendor rows open vendor
details. Payment run rows are documented as linking to run detail.

**Live UI:** The dashboard displays AP aging buckets and a top-vendors
table. The Bills list shows bills with vendor, invoice number, due date,
amount, status, and view action; it also exposes status/vendor filters,
search, quick views, and sortable columns. The vendor directory shows
email, payment terms, GL category, status, and vendor detail links. The
Settings page shows approval rules and a chart of accounts.

**Product docs:** Bill details include approval context, line items,
activity history, and a per-bill journal preview. Payments expose
immutable payment-run history. Recurring series expose status filters,
cadence, next payment, amount, approval mode, generation state, and
details.

## Demo roles and documented role behavior

**Live UI:** The “Viewing as” role switcher offers:

| Demo identity | Role |
|---|---|
| Avery Chen | Bookkeeper |
| Marcus Rivera | AP Manager |
| Priya Shah | Controller |

This is a demo role switcher, not a login or authenticated identity.
Visible feature gating is UI evidence only and does not prove server-side
authorization.

**Product docs describe the following role model:**

| Capability | Bookkeeper | AP Manager | Controller |
|---|---|---|---|
| View dashboard, bills, vendor directory, settings | Yes | Yes | Yes |
| Create/edit/submit draft bills | Yes | Yes | Yes |
| Approve/reject a bill awaiting AP Manager | No | Yes, unless creator | Yes, unless creator |
| Approve/reject a bill awaiting Controller | No | No | Yes, unless creator |
| Schedule/pay-now/batch schedule/process due | No | Yes | Yes |
| View payment run history | Yes | Yes | Yes |
| Manage vendors (create/edit/archive/reactivate) | No | No | Yes |
| View recurring series | Yes | Yes | Yes |
| Create/edit/cancel/generate recurring series | No | Yes | Yes |
| Edit approval policy or GL accounts | No | No | No; deferred |

**Live UI spot checks:** Avery's bill list has no “Run now” control, and
payment history is readable. On a bill awaiting AP Manager approval,
Avery sees a prompt to switch to Marcus; no approval controls are shown.
The same bill viewed as Marcus exposes Approve and Reject controls. The
vendor directory viewed as Avery has no New vendor link; viewed as Priya,
it exposes New vendor. These observations establish only current UI
affordances.

## Bill entities and workflow

**Product docs establish these relationships:** A bill belongs to one
active vendor and has one or more description/amount/GL-coded line items.
The bill total is derived from its lines. Bill approval routing stores an
awaiting role. Payment runs link to constituent bills. Recurring series
generate ordinary bills that use the same bill and payment workflows.

**Documented bill lifecycle:**

```text
Draft → Pending approval → Approved → Scheduled → Paid
  ↑            │
  └─ Rejected ─┘
```

“Rejected” is documented as an activity event that returns the bill to
Draft, with a required rejection reason and a “Needs revision” indicator;
it is not a separate current bill status. “Overdue” is a derived display
marker for approved or scheduled unpaid bills past the due date, not a
separate persisted lifecycle status.

**Live UI:** The Bills list displays Draft, Pending approval, Approved,
Scheduled, and Paid, sometimes with an Overdue marker. A sample pending
bill detail displayed vendor, invoice/date fields, awaiting role,
submitter, approval rule, line item, an activity timeline, and an
unposted journal preview. The journal preview explicitly said “Not yet
posted to the ledger.”

## Approval rules

**Product docs and live Settings UI:** Two seeded rules are visible:

- Standard bills: any amount / `$0.00+` routes to AP Manager.
- High-value bills: `$5,000.00+` routes to Controller.

The docs say Billio selects the highest active threshold at or below the
bill total when the bill is submitted. AP Managers decide bills awaiting
AP Manager; Controllers can decide either queue. The creator cannot
approve or reject their own bill. The Settings page is read-only for all
roles; policy editing is deferred. No approval action was executed during
reconnaissance.

## Bill capture, invoice intake, and input rules

**Live UI:** `/bills/new` shows a manual bill form with vendor, invoice
number, invoice date, due date, line description, amount, GL account,
total, and Create bill controls. The page also offers “From PDF or image”
with a file drop zone/file picker. No file was uploaded.

**Product docs:** Invoice intake accepts PDF, PNG, and JPG files up to
10 MB. It extracts candidate vendor, invoice number, dates, line
descriptions, amounts, and suggested expense GL accounts into the normal
bill form. AI-marked values remain reviewable/editable before saving.
Manual bill save uses the normal bill flow. Two sample invoice fixtures
are documented: Acme Office Supplies and Northwood Solutions.

**Product docs on file handling:** Uploaded files are temporary extraction
input staged in Vercel Blob, sent to Google Gemini for extraction, then
deleted best-effort after extraction or cancellation. Saved bills do not
retain the attachment or a file reference. Use only synthetic,
non-sensitive fixtures; an upload transmits file bytes to the demo's
configured services. Retention/deletion is best-effort as documented and
was not independently verified.

**Documented validation behavior:** Vendor must be active; invoice number
is required; at least one line item is used; line amounts and dates are
validated; line GL accounts must be active expense accounts; bill total
is derived from line amounts. Vendor payment terms can prefill the due
date, which remains editable. Invoice intake drops invalid dates,
amounts, unknown GL identifiers, and missing fields rather than trusting
them. The docs mention explicit amount caps but do not give their numeric
values. Exact date ranges, maximum amount, decimal/rounding rules, and
duplicate invoice behavior were not fully established here; duplicate
invoice detection is documented as not implemented.

## Payments and scheduled processing

**Product docs:** AP Managers and Controllers can schedule an approved
bill with ACH, check, or card and a date; pay an approved bill now; batch
schedule approved selections; or process due scheduled bills. Scheduling
creates Scheduled state; Pay now or process-due creates Paid state.
Payment-run history distinguishes Schedule, Pay-now, and Process-due
actions. Refunds, reversals, partial payments, and real bank/payment
rails are out of scope. Docs state that repeat process-due is a no-op,
but this behavior was not executed or independently verified.

**Live UI:** The Bills page displays “Auto-pay runs daily at 13:00 UTC,”
last-run and next-run summaries, and a Run now button for the AP Manager
view. The Bookkeeper view does not show Run now. The Payment runs page is
readable as Bookkeeper; the observed default 30-day filter showed an
empty-state message. No payment or process-due action was executed.

**Product docs:** A Vercel Cron route processes scheduled bills daily at
13:00 UTC and shares the process-due logic with Run now. A separate cron
route generates recurring bills. Cron endpoints, secrets, server
authorization, concurrency, and idempotency were not exercised.

## Recurring bills

**Product docs:** Series can run daily, weekly, monthly, quarterly, or
annually, with no end, occurrence-count, or final-date rules. They support
per-bill approval or upfront series approval. Per-bill mode generates
pending-approval bills; upfront-approved mode generates scheduled bills
and schedule payment runs. The first bill is created with the series.
AP Managers and Controllers can manage series; Bookkeepers can view.

**Live UI:** The recurring list is available under Bills and exposes
status filters, Generate due occurrences, and New recurring series to the
AP Manager view. At review time it displayed one active Lakeside Catering
Group series (“Testing recurring Beal thingie”), with a next payment date
of Jul 9, 2026 and “Future generation scheduled.” The docs describe four
seed examples spanning pending, active, completed, and canceled. This
docs/demo difference is unresolved; the UI display was recorded as seen
and no generation action was run.

## Visible history, accounting, and dashboard

**Live UI and product docs:** Bill detail pages expose bill activity
entries (the observed sample showed Created and Submitted events) and a
journal preview. Product docs describe activity entries for successful
bill state changes and say the journal is derived per bill. The preview
is not proof of a persisted ledger; the docs state that no global GL
register or persisted ledger is implemented. Vendor edits have no
vendor-level change history per the docs.

**Live UI:** The dashboard displays outstanding-by-due-date buckets,
bill links, a top-five vendor rollup, and metric navigation. The current
seed displayed 18 bills in the 90+ days bucket and zero in the other four
buckets at review time. This is a dated data snapshot, not an invariant.

## External dependencies documented

- Google Gemini 2.5 Flash / Google Generative AI provider for invoice
  extraction; requires `GOOGLE_GENERATIVE_AI_API_KEY`.
- Vercel Blob for temporary invoice upload; requires
  `BLOB_READ_WRITE_TOKEN`.
- Vercel Cron for scheduled payment processing and recurring generation;
  docs describe `CRON_SECRET` and a system-user attribution setting.
- The product documentation describes a Vercel-hosted Next.js application
  with Prisma and PostgreSQL/Neon. These architecture details come from
  product docs/project context and were not checked against application
  source code.

## Unknowns and first-milestone limitations

- The role switcher does not establish authenticated identities or
  server-side authorization. UI gating alone cannot prove enforcement.
- No Billio source repository, backend test interface, or database is
  available to this QA project. UI state does not prove persistence,
  transaction atomicity, ledger correctness, or absence of unauthorized
  mutation.
- No approval, rejection, bill creation, invoice upload, vendor edit,
  scheduling, payment, manual cron, or recurring generation action was
  executed during Phase 1.
- Cron execution and external service configuration are documented but
  unverified. No network/API requests were attempted directly.
- Concurrency, stale submissions, duplicate handling, retry behavior,
  and payment idempotency are documented risks/mechanisms only; no
  suitable non-mutating or controlled interface was used to validate
  them.
- The number and content of visible seed records can change. The
  recurring series inventory differed from the product docs at the time
  of review.
- Financial and operational claims below the UI boundary require
  suitable future access and remain out of Phase 1 evidence.

## Evidence pages

- Live app: <https://billio-psi.vercel.app/>
- Product docs index: <https://billio-psi.vercel.app/docs>
- Product docs: `/docs/product/vendors`, `/docs/product/bills`,
  `/docs/product/payments`, `/docs/product/recurring-bills`,
  `/docs/product/dashboard`, `/docs/product/invoice-intake`,
  `/docs/product/settings`
- Live UI pages inspected: `/`, `/bills`, `/bills/new`,
  `/bills/recurring`, `/bills/seed_bill_pending_controller_acme`,
  `/payments/runs`, `/vendors`, `/settings`
