# Plan

## Tech Stack

- Frontend: Vite, React, TypeScript.
- UI: Dark theme, responsive layouts, Spanish operator copy, accessible contrast, and compact data-dense screens.
- Charts: Responsive React chart components for time-series and category charts, backed by typed query helpers instead of hard-coded sample data.
- Backend: Supabase Auth, Postgres, Row Level Security, Storage, and Edge Functions or scheduled jobs.
- Imports: CSV and Excel parsing in the app/backend workflow with validation preview before commit.
- Testing: Vitest and React Testing Library for frontend behavior, Supabase SQL/policy tests where practical, and integration tests for import/reminder logic.
- Deployment target: Hosted web app with Supabase project backing production data.

## Architecture

- Single-page React app with authenticated routes for dashboard, cattle, crops, finance, employees, contracts/services, imports, reports, and settings.
- Supabase Auth manages users and sessions.
- Postgres stores operational records, import batches, and reminders.
- Row Level Security enforces role-based access for owner/admin, office user, field user, and read-only/accountant.
- Supabase Storage stores attachments such as contracts, receipts, and supporting documents.
- Scheduled jobs identify upcoming and overdue payment obligations and send email reminders.
- Dashboard cash-flow views distinguish obligations to pay from receivables to collect, including cattle-sale collections and deferred expenses that may be upfront, deferred 30/60 days, or set to a custom date.
- Analytics views query normalized operational tables directly for v1 charts:
  - Cattle weight charts use `weight_records` filtered by `cattle_id` and ordered by `date`.
  - Crop charts use `crop_cycles`, `crop_events`, `services`, `financial_transactions`, and `crop_outputs` filtered by field, cycle, metric, and date range.
  - Empty, sparse, and permission-restricted datasets return Spanish empty states instead of fake data.
- Import workflow:
  - User selects record type and uploads CSV/Excel.
  - App parses the file and maps it to the expected template.
  - Validation preview shows accepted rows and row-level errors in Spanish.
  - User commits valid records.
  - Import batch history records source file metadata, counts, errors, and commit status.
- Bilingual project artifacts:
  - Every English planning artifact gets a matching `.es.md` Spanish artifact.
  - Technical identifiers, commands, paths, table names, task IDs, and test IDs remain unchanged across languages.

## Data Model

Initial domain entities:

- `profiles`: user profile, display name, role, notification email, active status.
- `cattle`: tag/identifier, name or label, status, sex, breed, birth date, acquisition date, origin, notes.
- `cattle_sales`: cattle or lot references, buyer/counterparty, sale date, gross amount ARS, optional amount USD, payment method, payment terms, expected collection date, collected date, status, notes.
- `weight_records`: cattle reference, date, weight, unit, notes, recorded by.
- `health_records`: cattle reference, date, type, symptoms, treatment, medication, veterinarian, follow-up date, notes.
- `crop_fields`: field/lot name, location notes, area, active status.
- `crop_cycles`: field reference, crop type, season, start date, end date, status, notes.
- `crop_events`: crop cycle reference, field reference, date, event type, quantity, unit, notes, recorded by.
- `crop_outputs`: crop cycle reference, field reference, harvest/output date, quantity, unit, quality notes, destination notes.
- `counterparties`: vendors, customers, contractors, service providers, contact details.
- `contracts`: counterparty reference, type, start/end dates, summary, status, attachment references.
- `services`: crop/cattle/business service records, optional crop field/cycle/cattle references, counterparty reference, date, description, cost, linked contract, notes.
- `financial_transactions`: income/expense type, category, counterparty, optional crop field/cycle/service references, amount ARS, optional amount USD, transaction date, payment/debit date, payment terms, payment method, paid/collected status, description, attachment references.
- `receivables`: counterparty, source cattle sale/contract/service/transaction, amount, currency, sale or issue date, expected collection date, payment instrument, status, assigned user, collected date.
- `payment_obligations`: counterparty, source purchase/contract/service/transaction, amount, currency, purchase or issue date, due date, payment terms, payment method, status, assigned user, paid date.
- `employees`: identity/contact details, role/job, start date, active status, notes.
- `work_entries`: employee reference, date, work description, hours/days/quantity, notes.
- `employee_payments`: employee reference, date, amount, type, period start/end, notes.
- `import_batches`: uploaded file metadata, record type, status, created by, row counts, error counts.
- `import_errors`: batch reference, row number, field, message.
- `reminders`: payment obligation reference, reminder date, channel, status, recipient.

The schema should start normalized enough to support imports, filtering, reminders, reports, and role-based access without overbuilding accounting or payroll-specific legal rules.

Chart support should come from the same normalized records used by operational screens. The app should not maintain a separate chart-only data store in v1; if performance requires it later, aggregated reporting views can be added without changing the capture model.

## Dependencies

- Supabase project and environment variables for local and hosted environments.
- Email provider for production reminders.
- CSV/Excel parsing library selected during implementation.
- Date/currency formatting utilities for Argentine Spanish and ARS values.
- Responsive charting library selected during implementation.
- Icon/logo asset for the Campo Control cow mark.
- Accounting/payroll domain review before any future legal payroll calculation work.

## Risks

- Payroll/legal risk: Argentine payroll rules are out of scope for v1; UI and docs must avoid implying legal compliance.
- Data import risk: existing spreadsheets may have inconsistent column names, duplicates, missing identifiers, or mixed currencies.
- Reminder risk: email delivery depends on provider setup, deliverability, and correct recipient data.
- Cash-flow risk: deferred cattle-sale checks and other delayed collections can make booked income look like available cash unless receivables and collected cash are clearly separated.
- Expense surprise risk: deferred purchases, service bills, card payments, checks, and automatic debits can create future account deductions that are easy to forget unless committed expenses and paid cash are clearly separated.
- Access-control risk: finance and payroll data require strict role and Row Level Security tests.
- Localization risk: English developer docs and Spanish operator docs can drift if artifacts are not maintained together.
- Mobile usability risk: field users need fast entry on phones even though offline sync is deferred.
- Data model risk: cattle, crop, service, and finance records can become too generic unless v1 templates are intentionally scoped.
- Analytics risk: graphs will only be useful if imports and forms capture dates, field/cycle links, units, and categories consistently.
- Security risk: attachments, payroll/payment exports, and financial records need careful storage and permission controls.
- Testing gap risk: scheduled jobs and Supabase policies may be harder to test than normal UI flows.

## Milestones

- M1: Phase 1 docs
  - Create English and Spanish spec/plan artifacts.
  - Confirm MVP scope, app name, theme, roles, reminders, imports, and payroll boundaries.
- M2: Phase 2 task/test planning
  - Create English and Spanish `tasks.md` and `test-plan.md`.
  - Break the MVP into TDD-sized vertical tasks.
- M3: App foundation
  - Scaffold Vite + React + TypeScript.
  - Configure dark theme, Spanish copy baseline, routing, app shell, and Campo Control cow logo placement.
  - Set up Supabase client and auth flow.
- M4: Core schema and access control
  - Add Supabase schema, roles, seed data, and Row Level Security.
  - Add tests for access boundaries.
- M5: Dashboard and payment reminders
  - Build payment obligations, deferred expenses, cattle-sale receivables, due/overdue dashboard states, cash-flow separation, and email reminder job.
- M6: Cattle tracking
  - Build cattle profiles, weight history, weight-over-time charts, and health records.
- M7: Operations modules
  - Build finance, employees/payroll tracking, contracts/services, crop records, and crop analytics graphs.
- M8: Imports and reports
  - Build CSV/Excel imports with validation preview.
  - Build payroll/payment and operational exports.
- M9: Final verification
  - Run full test/build checks.
  - Review acceptance criteria.
  - Update final verification in English and Spanish artifacts.

## Verification Strategy

- Treat `spec.md` acceptance criteria as the release verification source of truth.
- Keep `spec.es.md`, `plan.es.md`, `tasks.es.md`, and `test-plan.es.md` structurally aligned with English artifacts.
- Use TDD from Phase 3 onward:
  - Write failing tests first.
  - Confirm expected failure.
  - Implement minimum behavior.
  - Confirm tests pass.
  - Refactor only after passing tests.
- Validate important flows with automated tests:
  - Login/app shell and dark theme.
  - Spanish UI copy for operator-facing screens.
  - Role-based access denial.
  - Spreadsheet import preview, validation errors, and commit.
  - Payment reminder dashboard state and email job selection.
  - Deferred expense dashboard state for upfront, 30-day, 60-day, custom, paid, due, and overdue cases.
  - Cattle-sale receivable dashboard state for upfront, 30-day, 60-day, custom, collected, and overdue cases.
  - Cattle profile weight/health timelines and responsive weight charts.
  - Crop analytics charts for costs, activity, and output/yield metrics.
  - Payroll/payment export.
- Run full build/typecheck/test checks before Phase 4 signoff.
