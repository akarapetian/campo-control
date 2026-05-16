# Plan

## Tech Stack

- Frontend: Vite, React, TypeScript.
- UI: Dark theme, desktop-first layouts, Spanish operator copy, accessible contrast, and compact data-dense screens with basic narrow-width tolerance.
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
- Scheduled jobs identify upcoming and overdue cash-flow items and send email reminders.
- Dashboard cash-flow views use one scheduled cash-flow model for both obligations to pay and receivables to collect, including cattle-sale collections and deferred expenses that may be upfront, deferred 30/60 days, or set to a custom date.
- Analytics views query normalized operational tables directly for v1 charts:
  - Cattle weight charts use `weight_records` filtered by `cattle_id` and ordered by `date`.
  - Crop charts use `crop_cycles`, `crop_events`, `services`, and `financial_transactions` filtered by field, cycle, metric, and date range.
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

## UI Plan

The UI should be planned as a role-aware operational workspace, not as separate disconnected modules. The first authenticated screen is the dashboard, with navigation to focused work areas for cattle, crops, finance, imports, reports, and settings.

App shell:

- Persistent dark app shell with Campo Control cow logo, primary navigation, user menu, and role-aware menu visibility.
- Desktop uses a left navigation rail and dense table-first layouts.
- Narrow widths use stacked layouts where practical, but specialized phone navigation and field-entry screens are deferred from v1.
- Operator-facing text, empty states, validation, filters, and actions are Spanish-only.

Dashboard:

- Top summary row separates cash collected/paid from expected cash in/out.
- Cash-flow area groups `cash_flow_items` into upcoming incoming, upcoming outgoing, due today, overdue incoming, and overdue outgoing.
- Operational alert area shows cattle health follow-ups, recent imports, and failed import batches.
- Quick actions route users to common entry flows such as add cattle weight, add health event, record expense, record cattle sale, import spreadsheet, and export report.

Cattle UI:

- Cattle list with search by tag/identifier, status filters, and quick access to profiles.
- Cattle profile uses tabs or sections for overview, weight history, health events, and sales.
- Weight and health forms are optimized for clear desktop/tablet entry; specialized one-handed phone entry is deferred.
- Sale entry records the sale event, then creates or links scheduled `cash_flow_items` for upfront or deferred collection.

Finance and cash-flow UI:

- Finance home shows transactions, scheduled cash-flow items, and overdue/due states as separate views over the same underlying records.
- Expense or purchase entry records the transaction, then creates or links a scheduled outgoing `cash_flow_items` row for upfront, 30-day, 60-day, or custom terms.
- Cattle-sale collection and deferred expense states use consistent labels, date filters, and mark-settled actions.
- Reports distinguish booked income/expenses from cash actually collected/paid.

Crops UI:

- Crop area starts from fields/lots, then drills into crop cycles.
- Crop cycle detail shows field events, services/costs, and production/yield events from `crop_events`.
- Crop analytics screen provides filters for field, cycle, date range, and metric type, with Spanish empty states when data is missing or sparse.

Imports UI:

- Import flow is a step-by-step wizard: choose record type, upload file, preview parsed rows, review Spanish row-level errors, then commit valid rows.
- Import history shows source file, record type, row counts, error counts, status, and created-by user.

Reports and settings UI:

- Reports focus on finance summary, payroll/payment export, cattle health, cattle weight, contract obligations, and crop cost outputs.
- Settings cover users, roles, reminder windows, and import templates.
- Payroll/payment report screens must avoid legal payroll compliance language.

## Data Model

Initial domain entities:

- `profiles`: user profile, display name, role, notification email, active status.
- `cattle`: tag/identifier, name or label, status, sex, breed, birth date, acquisition date, origin, notes.
- `cattle_sales`: optional cattle reference for single-animal sales, lot description or animal count for group sales, buyer/counterparty, sale date, gross amount ARS, optional amount USD, notes.
- `weight_records`: cattle reference, date, weight, unit, notes, recorded by.
- `health_records`: cattle reference, date, type, symptoms, treatment, medication, veterinarian, follow-up date, notes.
- `crop_fields`: field/lot name, location notes, area, active status.
- `crop_cycles`: field reference, crop type, season, start date, end date, status, notes.
- `crop_events`: crop cycle reference, field reference, date, event type, quantity, unit, optional cost category, output/yield flag, notes, recorded by.
- `counterparties`: vendors, customers, contractors, service providers, contact details.
- `contracts`: counterparty reference, type, start/end dates, summary, status, attachment references.
- `services`: crop/cattle/business service records, optional crop field/cycle/cattle references, counterparty reference, date, description, cost, linked contract, notes.
- `financial_transactions`: income/expense type, category, counterparty, optional crop field/cycle/service references, amount ARS, optional amount USD, transaction date, description, attachment references.
- `cash_flow_items`: direction in/out, counterparty, optional source cattle sale/contract/service/transaction/employee payment, amount, currency, issue date, expected cash date, payment terms, payment method, status, assigned user, settled date.
- `employees`: identity/contact details, role/job, start date, active status, notes.
- `work_entries`: employee reference, date, work description, hours/days/quantity, notes.
- `employee_payments`: employee reference, date, amount, type, period start/end, notes.
- `import_batches`: uploaded file metadata, record type, status, created by, row counts, error counts.
- `import_errors`: batch reference, row number, field, message.
- `reminders`: cash-flow item reference, reminder date, channel, status, recipient.

The schema should start normalized enough to support imports, filtering, reminders, reports, and role-based access without overbuilding accounting or payroll-specific legal rules.

Deliberate simplifications for v1:

- Use `cash_flow_items` for both money-in and money-out scheduling instead of separate receivable and payable tables. Direction, source reference, expected cash date, and status are enough for dashboard reminders and cash-flow reporting.
- Keep cattle sale payment timing in `cash_flow_items`, not duplicated in `cattle_sales`; `cattle_sales` records the operational sale event.
- Use `crop_events` for both field activity and production/yield events instead of a separate crop output table. Harvest or output rows are distinguished by event type and output/yield flag.
- Avoid ledger/accounting constructs such as accounts, journals, tax rules, or double-entry postings in v1.

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
- Cash-flow risk: deferred cattle-sale checks and other delayed collections can make booked income look like available cash unless expected collections and collected cash are clearly separated.
- Expense surprise risk: deferred purchases, service bills, card payments, checks, and automatic debits can create future account deductions that are easy to forget unless committed expenses and paid cash are clearly separated.
- Access-control risk: finance and payroll data require strict role and Row Level Security tests.
- Localization risk: English developer docs and Spanish operator docs can drift if artifacts are not maintained together.
- Scope risk: field users may want fast phone entry, but v1 intentionally prioritizes desktop office workflows and defers specialized mobile UX.
- Data model risk: `cash_flow_items` and `crop_events` can become vague catch-all tables unless v1 templates constrain allowed types, required dates, statuses, and source links.
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
  - Configure dark theme, Spanish copy baseline, desktop-first routing/app shell, and Campo Control cow logo placement.
  - Set up Supabase client and auth flow.
- M4: Core schema and access control
  - Add Supabase schema, roles, seed data, and Row Level Security.
  - Add tests for access boundaries.
- M5: Dashboard and payment reminders
  - Build scheduled cash-flow items for payment obligations, deferred expenses, cattle-sale receivables, due/overdue dashboard states, cash-flow separation, and email reminder job.
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
  - Cattle profile weight/health timelines and desktop/tablet-readable weight charts.
  - Crop analytics charts for costs, activity, and output/yield metrics.
  - Payroll/payment export.
- Run full build/typecheck/test checks before Phase 4 signoff.
