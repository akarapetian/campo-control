# Spec

## Problem

Agricultural operations that manage cattle, crops, employees, services, contracts, and payments often rely on disconnected spreadsheets, paper records, and memory. This makes it difficult to see upcoming obligations, import historical data cleanly, track each cow's weight and health over time, and prepare payroll/payment reports for office and accounting workflows.

Campo Control will provide a dark-themed Spanish web app for Argentine agricultural operators to centralize operational records, imports, reminders, and day-to-day tracking.

## Goals

- Provide a desktop-first online web app for office and administrative use, with basic responsive tolerance for tablet and narrow browser widths.
- Default operator screens to Argentine Spanish, with an in-app English language toggle for English-speaking owners/admins and collaborators.
- Use ARS as the primary currency, with optional USD reference fields where business records require it.
- Import core records from CSV/Excel templates with validation before committing data.
- Track finances, employees, payroll-related payments, contracts, services, crop operations, cattle profiles, cattle weights, and cattle health events.
- Track cattle sales with upfront, 30-day, 60-day, and custom deferred collection terms so expected cash inflows are visible before the money is collected.
- Track purchases, services, and expense obligations with upfront, 30-day, 60-day, and custom deferred payment terms so future cash outflows are visible before the account is debited.
- Show responsive graphs for operational trends such as cow weight over time, crop costs, crop activity, and production/yield metrics when data is available.
- Show due and overdue payment reminders in the app and send email reminders to assigned users.
- Include a dark operational UI and a fun cow logo in the login screen and app navigation.
- Produce bilingual planning artifacts throughout the project, with English as the developer-facing source and Spanish as the stakeholder-facing equivalent.

## Non-Goals

- Do not calculate Argentine payroll taxes, statutory deductions, or legal payroll compliance in v1.
- Do not provide tax filing, accounting certification, or legal compliance guarantees.
- Do not support offline-first field data entry in v1.
- Do not build specialized mobile field-entry workflows in v1.
- Do not build bank, vendor, government, or WhatsApp integrations in v1.
- Do not make English the default operator language in v1.
- Do not replace specialist veterinary, accounting, or agronomy systems where legally or professionally required.

## Users And Use Cases

- Owner/admin:
  - See a high-level dashboard of payments, herd status, recent imports, and operational alerts.
  - Manage users, roles, imports, settings, and reports.
  - Review finances, contracts, services, crop records, employees, and cattle records.
  - Switch the UI between Spanish and English when needed for English-speaking collaborators.
- Office user:
  - Import spreadsheet data for finances, employees, contracts, services, cattle, weights, and health records.
  - Track payments, receivables, due dates, employee payments, advances, and payroll export reports.
  - Mark obligations as paid and maintain counterparty records.
- Field user:
  - Search cattle by tag/identifier.
  - Add cattle weight records and health events from the desktop-first app while online.
  - Record crop/service activity related to fields and crop cycles from the desktop-first app.
- Read-only/accountant:
  - View reports and export finance/payroll data without editing operational records.

## Design

Campo Control will be a Vite + React web app backed by Supabase Auth, Postgres, Storage, and scheduled jobs. The UI will be dark themed, dense, and operational rather than marketing-oriented. It should prioritize searchable tables, clear status labels, desktop office workflows, and dashboard alerts. Mobile-specific field entry is deferred from v1. Spanish is the default UI language, with an English toggle available in the app shell and login screen.

Primary modules:

- Dashboard:
  - Upcoming payment obligations.
  - Overdue payment obligations.
  - Upcoming and overdue cattle-sale collections, including deferred 30/60-day terms.
  - Upcoming and overdue deferred expenses so operators can see expected account deductions before they happen.
  - Recent imports.
  - Cattle health alerts.
  - Quick links for common entry flows.
- Cattle:
  - Cattle profile with tag/identifier, status, origin, birth/acquisition data, notes, and ownership context.
  - Sale records for sold animals or lots, including buyer, sale date, price, payment method, collection terms, expected collection date, and collected status.
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
  - Chart layouts optimized for desktop and tablet-sized viewports, with graceful narrow-width stacking where practical.
- Finance:
  - Income, expenses, categories, counterparties, payment obligations, receivables, paid/collected status, due dates, expected collection dates, and attachments.
  - Deferred expense tracking with purchase date, payment/debit date, payment terms, payment method, and paid status.
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
- Given an English-speaking user changes the language toggle to English, when they view supported navigation, dashboard, and login copy, then those labels appear in English without changing ARS currency defaults or Spanish-first business assumptions.
- Given a user returns to Spanish from the language toggle, when they view supported navigation, dashboard, and login copy, then those labels appear in Argentine Spanish again.
- Given money values are displayed, when no alternate currency is specified, then ARS is the default currency.
- Given a spreadsheet import template is uploaded, when required fields are valid, then the app previews records before saving them.
- Given a spreadsheet import contains invalid rows, when validation runs, then the app shows Spanish row-level errors and does not save invalid records.
- Given a cow has weight records, when a user opens the cow profile, then the profile shows weight history in chronological order.
- Given a cow has multiple weight records, when a user views the cow profile on a desktop or tablet-sized viewport, then the app shows a readable weight-over-time graph sourced from database weight records.
- Given a cow has health records, when a user opens the cow profile, then the profile shows health events linked to that cow.
- Given crop cycle cost, service, field activity, or production data exists, when a user opens crop analytics on a desktop or tablet-sized viewport, then the app shows readable graphs filtered by field, crop cycle, date range, and metric type.
- Given chart data is missing or sparse, when a user opens a graph area, then the app shows an empty-state message in Spanish instead of a broken or misleading chart.
- Given a payment obligation has a future due date, when it is within the configured reminder window, then it appears as upcoming on the dashboard.
- Given a payment obligation is past due and unpaid, when a user opens the dashboard, then it appears as overdue until marked paid.
- Given an expense is recorded with 30-day, 60-day, or custom deferred payment terms, when a user opens the dashboard before the payment/debit date, then the expense appears as an upcoming cash outflow and is not counted as already paid.
- Given a deferred expense is due today or past due and unpaid, when a user opens the dashboard, then it appears as due or overdue until marked paid.
- Given a cattle sale is recorded with upfront payment, when the dashboard calculates cash received, then the sale can be counted as collected on the sale date once marked received.
- Given a cattle sale is recorded with 30-day, 60-day, or custom deferred payment terms, when a user opens the dashboard before the expected collection date, then the sale appears as an upcoming receivable and is not counted as received cash.
- Given a cattle-sale receivable is past its expected collection date and not marked collected, when a user opens the dashboard, then it appears as overdue until marked collected.
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
- Which cattle-sale payment terms should be offered by default: upfront, 30 days, 60 days, 90 days, custom date, installments, or all of these?
- Which expense payment terms should be offered by default: upfront, 30 days, 60 days, 90 days, custom date, installments, automatic debit, or all of these?
- Should attachments be required for contracts and payment receipts in v1, or optional only?
- Which reports are most important for the first release: finance summary, payroll/payment export, cattle health, cattle weight, contract obligations, or crop cost report?
