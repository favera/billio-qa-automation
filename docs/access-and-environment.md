# Billio QA Project: Access and Environment

Last reviewed: 2026-10-08

## Repository relationship

This repository contains the QA plan, documentation, and any automation
developed for the Billio demo. The Billio application is maintained in a
separate repository. The project owner currently has no access to the
Billio frontend or backend source repository, backend test interfaces, or
database. The QA project must not depend on obtaining that access to
complete its first milestone.

## Permitted first-milestone target

- Application demo: <https://billio-psi.vercel.app/>
- Product documentation: <https://billio-psi.vercel.app/docs>
- The demo is described by the project owner as having no login/session
  flow and as exposing an in-page role switcher.
- Role names, permissions, and feature behavior must be confirmed from
  the live UI or accessible product documentation before they are used
  as expected results.

The documentation and demo were reachable in Chrome during the Phase 0
review. The `/bills/new` page visibly offers invoice intake via PDF or
image drop zone/file picker. This confirms the capability is exposed; it
does not establish upload retention, downstream processing, or deletion
behavior. Use only synthetic, non-sensitive fixtures when exercising it.

## Data and safety boundaries

- Creating and changing identifiable demo data is permitted.
- Use unique, recognizable test records where the UI allows it.
- Avoid broad or destructive cleanup.
- No database access is available; do not claim persistence, transaction,
  or ledger validation from UI observations.
- Do not assume invoice upload or fixture support until it is observed
  in the demo.
- The role switcher can support role-dependent UI checks. It does not
  prove authenticated identity or server-side authorization.

## Deferred access-dependent work

Source-level unit tests, API/server tests, direct database validation,
cron execution, and deeper concurrency/idempotency checks require access
to suitable documented interfaces. They are outside the first
milestone, and no progress depends on that access being granted.
