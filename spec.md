# Spec

## Problem

Agricultural operations that manage cattle, crops, employees, services, contracts, and payments often rely on disconnected spreadsheets, paper records, and memory. This makes it difficult to see upcoming obligations, import historical data cleanly, track each cow's weight and health over time, and prepare payroll/payment reports for office and accounting workflows.

Campo Control will provide a dark-themed Spanish web app for Argentine agricultural operators to centralize operational records, imports, reminders, and day-to-day tracking.

## Goals

- Provide a responsive online web app for office and mobile field use.
- Support Spanish-only operator screens using Argentine Spanish.
- Use ARS as the primary currency, with optional USD reference fields where business records require it.
- Import core records from CSV/Excel templates with validation before committing data.
- Track finances, employees, payroll-related payments, contracts, services, crop operations, cattle profiles, cattle weights, and cattle health events.
- Show responsive graphs for operational trends such as cow weight over time, crop costs, crop activity, and production/yield metrics when data is available.
- Show due and overdue payment reminders in the app and send email reminders to assigned users.
- Include a dark operational UI and a fun cow logo in the login screen and app navigation.
- Produce bilingual planning artifacts throughout the project, with English as the developer-facing source and Spanish as the stakeholder-facing equivalent.

## Non-Goals

- Do not calculate Argentine payroll taxes, statutory deductions, or legal payroll compliance in v1.
- Do not provide tax filing, accounting certification, or legal compliance guarantees.
- Do not support offline-first field data entry in v1.
- Do not build bank, vendor, government, or WhatsApp integrations in v1.
- Do not support English operator screens in v1.
- Do not replace specialist veterinary, accounting, or agronomy systems where legally or professionally required.

## Users And Use Cases

- Owner/admin:
  - See a high-level dashboard of payments, herd status, recent imports, and operational alerts.
  - Manage users, roles, imports, settings, and reports.
  - Review finances, contracts, services, crop records, employees, and cattle records.
- Office user:
  - Import spreadsheet data for finances, employees, contracts, services, cattle, weights, and health records.
  - Track payments, due dates, employee payments, advances, and payroll export reports.
  - Mark obligations as paid and maintain counterparty records.
- Field user:
  - Search cattle by tag/identifier.
  - Add cattle weight records and health events from a phone while online.
  - Record crop/service activity related to fields and crop cycles.
- Read-only/accountant:
  - View reports and export finance/payroll data without editing operational records.

## Design

Campo Control will be a Vite + React web app backed by Supabase Auth, Postgres, Storage, and scheduled jobs. The UI will be dark themed, dense, and operational rather than marketing-oriented. It should prioritize searchable tables, clear status labels, fast mobile entry, and dashboard alerts.

Primary modules:

- Dashboard:
  - Upcoming payment obligations.
  - Overdue payment obligations.
  - Recent imports.
  - Cattle health alerts.
  - Quick links for common entry flows.
- Cattle:
  - Cattle profile with tag/identifier, status, origin, birth/acquisition data, notes, and ownership context.
  - Weight timeline across time.
  - Health event history with treatments, symptoms, dates, and notes.
- Crops:
  - Fields/lots.
  - Crop cycles.
  - Crop-related services, costs, contracts, field activity, production/yield metrics, and notes.
- Analytics:
  - Cow weight over time charts from weight records.
  - Crop cost charts by field, crop cycle, category, and date range.
  - Crop activity charts from field events and service records.
  - Crop production/yield charts when harvest or output metrics are recorded.
  - Responsive chart layouts that remain readable on desktop and mobile.
- Finance:
  - Income, expenses, categories, counterparties, payment obligations, paid status, due dates, and attachments.
  - ARS-first display with optional USD reference fields.
- Employees and payroll tracking:
  - Employee records, work entries, advances, payments, and exportable payroll/payment reports.
  - No legal payroll calculations in v1.
- Contracts and services:
  - Counterparties, service records, contract terms, payment schedules, due dates, and attachments.
- Imports:
  - CSV/Excel templates for each major record type.
  - Validation preview before commit.
  - Spanish error messages for invalid rows.
  - Import batch history.
- Reminders:
  - In-app dashboard reminders for due and overdue payment obligations.
  - Email reminders before and on due dates.
- Branding:
  - App name: Campo Control.
  - Fun cow logo visible on login and in the authenticated app shell.

Roles:

- Owner/admin: full access.
- Office user: finance, employees, contracts, services, imports, and reports.
- Field user: cattle, health, weights, and crop/service entries.
- Read-only/accountant: reports and exports only.

## Acceptance Criteria

- Given a user opens the app, when the login screen appears, then it uses the dark theme and shows the Campo Control cow logo.
- Given an authenticated user is in the app, when navigation is visible, then the cow logo appears in the app shell.
- Given an operator uses the app, when they view labels, forms, validation messages, and navigation, then operator-facing text is in Argentine Spanish.
- Given money values are displayed, when no alternate currency is specified, then ARS is the default currency.
- Given a spreadsheet import template is uploaded, when required fields are valid, then the app previews records before saving them.
- Given a spreadsheet import contains invalid rows, when validation runs, then the app shows Spanish row-level errors and does not save invalid records.
- Given a cow has weight records, when a user opens the cow profile, then the profile shows weight history in chronological order.
- Given a cow has multiple weight records, when a user views the cow profile on desktop or mobile, then the app shows a responsive weight-over-time graph sourced from database weight records.
- Given a cow has health records, when a user opens the cow profile, then the profile shows health events linked to that cow.
- Given crop cycle cost, service, field activity, or production data exists, when a user opens crop analytics, then the app shows responsive graphs filtered by field, crop cycle, date range, and metric type.
- Given chart data is missing or sparse, when a user opens a graph area, then the app shows an empty-state message in Spanish instead of a broken or misleading chart.
- Given a payment obligation has a future due date, when it is within the configured reminder window, then it appears as upcoming on the dashboard.
- Given a payment obligation is past due and unpaid, when a user opens the dashboard, then it appears as overdue until marked paid.
- Given email reminders are enabled, when the reminder job runs, then assigned users receive reminders for due and overdue payment obligations.
- Given a field user is logged in, when they try to access finance or payroll settings, then access is denied.
- Given a read-only/accountant user is logged in, when they try to create, edit, import, or mark a payment paid, then access is denied.
- Given an office user exports payroll/payment data, when a date range is selected, then the export includes employees, payments, advances, and totals for that period.
- Given payroll tracking features are visible, when explanatory or report text appears, then it does not claim to calculate Argentine payroll taxes, deductions, or legal payroll compliance.
- Given planning artifacts are created, when Phase 1 and later phases are completed, then each English artifact has a matching `.es.md` Spanish artifact with the same structure and decisions.

## Open Questions

- Which email provider should be used for production reminder delivery?
- What default reminder window should be used: 7 days before due date, 3 days before due date, day-of, or a combination?
- Which spreadsheet fields are present in the business's existing finance, employee, cattle, contract, service, crop, weight, and health records?
- Should attachments be required for contracts and payment receipts in v1, or optional only?
- Which reports are most important for the first release: finance summary, payroll/payment export, cattle health, cattle weight, contract obligations, or crop cost report?
