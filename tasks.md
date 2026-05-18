# Tasks

## T1: App Foundation And Spanish Shell

Status: [x]

### Outcome

A Vite + React + TypeScript app with dark desktop-first layout, login screen, authenticated app shell, Campo Control cow logo placement, Spanish operator copy baseline, and route structure.

### Scope

- Scaffold React app and test tooling.
- Add login screen with dark theme and cow logo.
- Add authenticated shell with desktop navigation, user menu, and cow logo.
- Add routes for dashboard, cattle, crops, finance, employees, contracts/services, imports, reports, and settings.
- Add basic narrow-width stacking where practical without building specialized phone workflows.

### Dependencies

- None.

### Implementation Notes

- Use Spanish strings for operator-facing copy from the start.
- Keep layout desktop-first and data-dense.
- Defer mobile-specific navigation and field-entry screens.

### Acceptance Criteria Covered

- Dark login with Campo Control cow logo.
- Cow logo in authenticated app shell.
- Operator-facing text is Argentine Spanish.
- Desktop-first with basic responsive tolerance.

### Test Cases

- Happy path: unauthenticated user sees dark login with cow logo.
- Error path: unauthenticated user cannot access authenticated routes.
- Edge case: narrow viewport stacks primary layout without horizontal clipping of core navigation.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T2: Supabase Schema, Roles, And Access Boundaries

Status: [x]

### Outcome

Core Supabase schema, profile roles, seed data, and role-based access rules exist for owner/admin, office user, field user, and read-only/accountant.

### Scope

- Add initial tables from `plan.md`: profiles, cattle, weight_records, health_records, cattle_sales, crop_fields, crop_cycles, crop_events, counterparties, contracts, services, financial_transactions, cash_flow_items, employees, work_entries, employee_payments, import_batches, import_errors, and reminders.
- Add role values and seed users/profiles for test scenarios.
- Add RLS policies for finance/payroll, field-entry, reports, and admin-only settings.

### Dependencies

- T1.

### Implementation Notes

- Keep schema lean: use `cash_flow_items` for money-in and money-out scheduling.
- Do not add accounting ledgers, journals, tax tables, or payroll compliance calculations.

### Acceptance Criteria Covered

- Field user is denied finance/payroll settings.
- Read-only/accountant cannot create, edit, import, or mark payments paid.
- Payroll features avoid legal compliance claims through data boundaries.

### Test Cases

- Happy path: owner/admin can access all protected tables and settings.
- Error path: field user cannot read or write finance/payroll settings.
- Edge case: read-only/accountant can view/export reports but cannot mutate operational records.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T3: Cash-Flow Dashboard States

Status: [x]

### Outcome

Dashboard shows actual cash collected/paid separately from expected cash in/out, with upcoming, due today, and overdue `cash_flow_items`.

### Scope

- Build dashboard query/helpers for `cash_flow_items`.
- Group items into upcoming incoming, upcoming outgoing, due today, overdue incoming, and overdue outgoing.
- Show paid/collected cash totals separately from expected cash.
- Add Spanish labels and empty states.

### Dependencies

- T1, T2.

### Implementation Notes

- Treat `settled_date` as the source of truth for collected/paid cash.
- Expected cash uses `expected_cash_date` and `status`.

### Acceptance Criteria Covered

- Future payment obligations appear as upcoming.
- Past due unpaid obligations appear as overdue.
- Deferred expenses appear as upcoming outflows and are not counted as paid.
- Due or overdue deferred expenses remain visible until marked paid.

### Test Cases

- Happy path: dashboard groups future incoming and outgoing items correctly.
- Error path: overdue unsettled item appears as overdue until settled.
- Edge case: item due today appears in due-today state, not future or overdue.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T4: Cattle Profiles, Weights, Health, And Weight Chart

Status: [x]

### Outcome

Users can list cattle, open a cattle profile, view chronological weight and health histories, add records, and see a desktop/tablet-readable weight-over-time chart.

### Scope

- Build cattle list with search by tag/identifier and status filters.
- Build cattle profile overview.
- Add weight record creation and chronological display.
- Add health event creation and display linked to the cow.
- Add weight-over-time chart with Spanish empty state.

### Dependencies

- T1, T2.

### Implementation Notes

- Chart data must come from `weight_records`, not hard-coded sample data.
- Keep forms clear for desktop/tablet; phone-optimized entry is deferred.

### Acceptance Criteria Covered

- Cow profile shows weight history in chronological order.
- Cow profile shows database-backed weight graph on desktop/tablet.
- Cow profile shows health events linked to that cow.
- Missing or sparse chart data shows Spanish empty state.

### Test Cases

- Happy path: profile renders cattle details, ordered weights, health events, and chart.
- Error path: profile for missing cattle shows Spanish not-found or empty state.
- Edge case: cow with one or zero weights shows empty/sparse chart state rather than misleading chart.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T5: Cattle Sales And Deferred Collection Scheduling

Status: [x]

### Outcome

Users can record cattle sales and create linked incoming `cash_flow_items` for upfront, 30-day, 60-day, or custom collection dates.

### Scope

- Build cattle sale entry for single animal or lot sale.
- Link sale to buyer/counterparty and sale amount.
- Create incoming `cash_flow_items` with payment terms and expected collection date.
- Mark collection settled and reflect it on dashboard.

### Dependencies

- T2, T3, T4.

### Implementation Notes

- `cattle_sales` records the operational sale.
- `cash_flow_items` records expected and settled collection timing.

### Acceptance Criteria Covered

- Upfront cattle sale can count as collected once marked received.
- Deferred cattle sale appears as upcoming receivable before expected collection date.
- Overdue cattle-sale receivable appears overdue until marked collected.

### Test Cases

- Happy path: 60-day cattle sale creates upcoming incoming cash-flow item.
- Error path: sale without buyer, amount, or expected collection date cannot be saved.
- Edge case: upfront sale only counts as received cash after it is marked settled.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T6: Finance Transactions And Deferred Expenses

Status: [x]

### Outcome

Users can record income/expense transactions and schedule outgoing deferred expenses with upfront, 30-day, 60-day, and custom payment terms.

### Scope

- Build finance transaction list and entry form.
- Default money display to ARS with optional USD reference.
- Create linked outgoing `cash_flow_items` for deferred expenses.
- Mark outgoing cash-flow items paid/settled.

### Dependencies

- T2, T3.

### Implementation Notes

- Keep transaction date separate from expected cash date.
- Reports and dashboard must not treat unsettled deferred expenses as paid cash.

### Acceptance Criteria Covered

- ARS is default currency.
- Deferred expense appears as upcoming outflow before payment/debit date.
- Deferred expense appears due or overdue until marked paid.

### Test Cases

- Happy path: 30-day expense creates upcoming outgoing cash-flow item with ARS default.
- Error path: expense with missing amount or expected cash date fails validation.
- Edge case: USD reference amount can be present without replacing ARS display.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T7: Crops, Services, And Crop Analytics

Status: [x]

### Outcome

Users can manage fields, crop cycles, field events, service/cost records, and desktop/tablet-readable crop analytics.

### Scope

- Build fields/lots and crop cycle screens.
- Add crop events for activity and production/yield rows.
- Link services and financial transactions to field/cycle where applicable.
- Build crop analytics filters for field, cycle, date range, and metric type.
- Show Spanish empty states for missing/sparse data.

### Dependencies

- T2, T6.

### Implementation Notes

- Use `crop_events` for activity and output/yield instead of a separate output table.
- Use operational data only; no fake chart data.

### Acceptance Criteria Covered

- Crop analytics shows graphs filtered by field, cycle, date range, and metric type.
- Missing or sparse chart data shows Spanish empty state.

### Test Cases

- Happy path: crop analytics renders cost/activity/yield graph from linked records.
- Error path: user without permission cannot edit crop/service records.
- Edge case: sparse analytics data shows Spanish empty state.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T8: Contracts, Services, Counterparties, And Attachments

Status: [x]

### Outcome

Users can manage counterparties, contracts, services, payment schedules, and optional attachments.

### Scope

- Build counterparty list/detail.
- Build contract and service records linked to counterparties.
- Add optional attachment references through Supabase Storage.
- Create scheduled `cash_flow_items` from contract or service payment schedules.

### Dependencies

- T2, T3, T6.

### Implementation Notes

- Attachments remain optional in v1 unless the open question is later resolved differently.
- Contract/service schedules should reuse `cash_flow_items`.

### Acceptance Criteria Covered

- Payment obligations from contracts/services can appear upcoming or overdue.
- Role access denies unauthorized edits.

### Test Cases

- Happy path: service with deferred payment creates linked outgoing cash-flow item.
- Error path: unauthorized role cannot create or edit contract/service.
- Edge case: contract can be saved without attachment when attachments are optional.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T9: Imports With Validation Preview And History

Status: [x]

### Outcome

Users can import CSV/Excel templates, preview valid rows, see Spanish row-level errors, commit valid records, and review import history.

### Scope

- Build import wizard: choose record type, upload file, preview rows, review errors, commit.
- Implement validation for required fields and basic types.
- Record import batch metadata and row errors.
- Support major record types defined by v1 templates.

### Dependencies

- T2 and whichever target table is imported for each template.

### Implementation Notes

- Do not save invalid rows.
- Template fields should remain intentionally scoped to avoid vague catch-all imports.

### Acceptance Criteria Covered

- Valid import previews records before saving.
- Invalid import shows Spanish row-level errors and does not save invalid records.

### Test Cases

- Happy path: valid cattle import previews and commits records.
- Error path: invalid rows show Spanish row-level errors and are not saved.
- Edge case: mixed valid/invalid file commits only after explicit user confirmation of valid rows.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T10: Employees, Payroll Tracking, And Payment Export

Status: [x]

### Outcome

Users can manage employees, work entries, advances, payments, and export payroll/payment data for a date range without implying legal payroll compliance.

### Scope

- Build employee list/detail.
- Add work entries, advances, and payments.
- Add date-range export including employees, payments, advances, and totals.
- Add Spanish explanatory text that avoids tax, deduction, or legal compliance claims.

### Dependencies

- T2, T6.

### Implementation Notes

- Do not calculate Argentine payroll taxes, deductions, or legal compliance.
- Employee payments may create outgoing `cash_flow_items` where payment timing is needed.

### Acceptance Criteria Covered

- Payroll/payment export includes employees, payments, advances, and totals for selected period.
- Payroll tracking text does not claim legal payroll compliance.
- Read-only/accountant can view/export but not edit.

### Test Cases

- Happy path: office user exports date-range payroll/payment report.
- Error path: field user cannot access payroll settings.
- Edge case: export with no rows returns Spanish empty report state with zero totals.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T11: Reminder Job And Email Selection

Status: [x]

### Outcome

Scheduled reminder logic selects due and overdue `cash_flow_items` and sends or records email reminders for assigned users.

### Scope

- Add reminder window configuration.
- Add scheduled job or Edge Function for reminder selection.
- Create reminder records.
- Integrate selected email provider or provider abstraction.
- Cover due, overdue, already-settled, and missing-recipient cases.

### Dependencies

- T2, T3.

### Implementation Notes

- Email provider remains an open Phase 1 question; implementation can use an adapter boundary until selected.
- Settled items must not trigger new due/overdue reminders.

### Acceptance Criteria Covered

- Email reminders are sent to assigned users for due and overdue payment obligations when enabled.

### Test Cases

- Happy path: due and overdue unsettled items generate reminders for assigned users.
- Error path: settled items do not generate reminders.
- Edge case: missing recipient is recorded as skipped/failed without stopping the whole job.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T12: Reports, Settings, And Release-Level Localization Checks

Status: [x]

### Outcome

Users can access priority reports and settings, and the app has release-level checks for Spanish operator text, ARS defaults, desktop-first readability, and bilingual planning artifact alignment.

### Scope

- Build reports index for finance summary, payroll/payment export, cattle health, cattle weight, contract obligations, and crop costs.
- Build settings for users, roles, reminder windows, and import templates.
- Add localization checks for operator-facing Spanish copy.
- Add verification that `.es.md` planning artifacts match English artifact structure.

### Dependencies

- T1 through T11.

### Implementation Notes

- Treat `spec.md` acceptance criteria as the release verification source.
- Keep report language operational and avoid legal compliance claims.

### Acceptance Criteria Covered

- Operator-facing text is Argentine Spanish.
- Money defaults to ARS.
- Planning artifacts have matching `.es.md` structure.
- Reports expose priority operational outputs.

### Test Cases

- Happy path: admin can configure users/roles/reminder windows and view reports.
- Error path: unauthorized user cannot edit settings.
- Edge case: artifact structure check fails if a Spanish planning file is missing a matching section.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass

## T13: Language Toggle For English-Speaking Users

Status: [x]

### Outcome

Users can switch supported login, app shell, navigation, and dashboard copy between Spanish and English while Spanish remains the default product language.

### Scope

- Add centralized UI strings for supported shell/login/dashboard labels.
- Add a visible language toggle on login and authenticated app shell.
- Keep Spanish as the default language.
- Preserve ARS-first currency behavior and Spanish-first business assumptions.

### Dependencies

- T1, T3, T12.

### Implementation Notes

- Store language preference in React state for v1.
- Do not attempt full domain-data translation or spreadsheet template translation in this task.

### Acceptance Criteria Covered

- English-speaking user can switch supported UI labels to English.
- User can switch supported UI labels back to Argentine Spanish.
- Spanish remains default.

### Test Cases

- Happy path: toggle from Spanish to English updates login and navigation/dashboard labels.
- Error path: protected route prompt follows selected language.
- Edge case: toggling back to Spanish restores Spanish labels.

### TDD Checklist

- [x] Write failing test
- [x] Verify test fails
- [x] Write minimal code to pass
- [x] Verify test passes
- [x] Refactor if needed
- [x] Verify tests still pass
