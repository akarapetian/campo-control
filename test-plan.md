# Test Plan

## Test Strategy

Use TDD from Phase 3 onward. Start each task by writing the smallest failing test for the behavior described here, confirm the expected failure, implement the minimum code, then rerun the targeted test. Use Vitest and React Testing Library for UI behavior, focused query/helper tests for cash-flow and analytics logic, and Supabase SQL/policy tests where practical for schema and RLS. Full build/typecheck/test verification is reserved for Phase 4.

## T1: App Foundation And Spanish Shell

### Happy Path

- Test: Render unauthenticated app root.
- Expected failure before implementation: no app shell/login route exists.
- Expected pass condition: login screen renders in dark theme with Campo Control cow logo and Spanish copy.

### Error Paths

- Test: Navigate to `/dashboard` while unauthenticated.
- Expected failure before implementation: protected-route handling does not exist.
- Expected pass condition: user is redirected to login or shown Spanish access prompt.

### Edge Cases

- Test: Render app shell at a narrow viewport.
- Expected failure before implementation: layout is absent or clips primary navigation.
- Expected pass condition: core navigation/logo remain visible or stacked without horizontal clipping.

## T2: Supabase Schema, Roles, And Access Boundaries

### Happy Path

- Test: Owner/admin profile can read/write core operational tables.
- Expected failure before implementation: schema, seed profiles, or policies do not exist.
- Expected pass condition: owner/admin can perform permitted operations.

### Error Paths

- Test: Field user attempts to access finance/payroll settings.
- Expected failure before implementation: RLS/policy boundary does not exist.
- Expected pass condition: access is denied.

### Edge Cases

- Test: Read-only/accountant attempts to mark a cash-flow item settled.
- Expected failure before implementation: mutation is not blocked.
- Expected pass condition: read-only/accountant can view/export but cannot mutate.

## T3: Cash-Flow Dashboard States

### Happy Path

- Test: Dashboard helper groups unsettled future incoming/outgoing `cash_flow_items`.
- Expected failure before implementation: grouping helper or dashboard query is missing.
- Expected pass condition: items are grouped as upcoming incoming and upcoming outgoing.

### Error Paths

- Test: Past expected cash date with no `settled_date` appears overdue.
- Expected failure before implementation: overdue logic is missing.
- Expected pass condition: item remains overdue until settled.

### Edge Cases

- Test: Item with expected cash date equal to today appears as due today.
- Expected failure before implementation: due-today state is missing or misclassified.
- Expected pass condition: item is not grouped as future or overdue.

## T4: Cattle Profiles, Weights, Health, And Weight Chart

### Happy Path

- Test: Cattle profile renders details, chronological weights, linked health events, and chart data from `weight_records`.
- Expected failure before implementation: cattle profile and queries do not exist.
- Expected pass condition: records render in order and chart receives database-backed data.

### Error Paths

- Test: Request a missing cattle profile.
- Expected failure before implementation: missing state is not handled.
- Expected pass condition: Spanish not-found or empty state is shown.

### Edge Cases

- Test: Cow with one or zero weight records opens chart area.
- Expected failure before implementation: chart renders misleading or broken output.
- Expected pass condition: Spanish sparse/empty chart state is shown.

## T5: Cattle Sales And Deferred Collection Scheduling

### Happy Path

- Test: Create cattle sale with 60-day terms.
- Expected failure before implementation: sale form or cash-flow creation is missing.
- Expected pass condition: `cattle_sales` row and linked incoming `cash_flow_items` row are created with expected collection date.

### Error Paths

- Test: Submit sale without buyer, amount, or expected collection date.
- Expected failure before implementation: validation is missing.
- Expected pass condition: Spanish validation errors appear and no records are saved.

### Edge Cases

- Test: Create upfront sale without marking it settled.
- Expected failure before implementation: upfront sale may count as received cash immediately.
- Expected pass condition: sale appears expected/receivable until marked settled.

## T6: Finance Transactions And Deferred Expenses

### Happy Path

- Test: Create 30-day expense transaction.
- Expected failure before implementation: finance form or outgoing cash-flow creation is missing.
- Expected pass condition: ARS transaction and linked outgoing `cash_flow_items` row are created.

### Error Paths

- Test: Submit expense without amount or expected payment/debit date.
- Expected failure before implementation: validation is missing.
- Expected pass condition: Spanish validation errors appear and no invalid record is saved.

### Edge Cases

- Test: Add optional USD reference to ARS expense.
- Expected failure before implementation: currency formatting or optional USD support is missing.
- Expected pass condition: ARS remains primary display and USD is shown only as reference.

## T7: Crops, Services, And Crop Analytics

### Happy Path

- Test: Crop analytics renders filtered cost/activity/yield data from linked records.
- Expected failure before implementation: crop analytics query or chart is missing.
- Expected pass condition: chart data responds to field, cycle, date range, and metric filters.

### Error Paths

- Test: Unauthorized role tries to edit crop/service records.
- Expected failure before implementation: role check or RLS is missing.
- Expected pass condition: edit is denied.

### Edge Cases

- Test: Analytics opens with missing or sparse crop data.
- Expected failure before implementation: chart area breaks or displays fake data.
- Expected pass condition: Spanish empty/sparse state appears.

## T8: Contracts, Services, Counterparties, And Attachments

### Happy Path

- Test: Create service linked to counterparty with deferred payment schedule.
- Expected failure before implementation: service form or schedule creation is missing.
- Expected pass condition: service and outgoing `cash_flow_items` are created.

### Error Paths

- Test: Unauthorized role attempts to create contract/service.
- Expected failure before implementation: access enforcement is missing.
- Expected pass condition: create/edit is denied.

### Edge Cases

- Test: Save contract without attachment.
- Expected failure before implementation: form may incorrectly require attachment.
- Expected pass condition: contract saves when required fields are valid and attachment is absent.

## T9: Imports With Validation Preview And History

### Happy Path

- Test: Upload valid cattle import template.
- Expected failure before implementation: import parser/preview does not exist.
- Expected pass condition: parsed rows preview, then commit creates records and import batch history.

### Error Paths

- Test: Upload file with invalid required fields.
- Expected failure before implementation: row-level validation is missing.
- Expected pass condition: Spanish row-level errors appear and invalid records are not saved.

### Edge Cases

- Test: Upload mixed valid and invalid rows.
- Expected failure before implementation: partial-preview behavior is undefined.
- Expected pass condition: valid rows are previewed, invalid rows show errors, and commit requires explicit confirmation.

## T10: Employees, Payroll Tracking, And Payment Export

### Happy Path

- Test: Office user exports payroll/payment report for selected date range.
- Expected failure before implementation: employee/payment export does not exist.
- Expected pass condition: export includes employees, payments, advances, and totals.

### Error Paths

- Test: Field user attempts to access payroll settings.
- Expected failure before implementation: access denial is missing.
- Expected pass condition: access is denied.

### Edge Cases

- Test: Export date range with no employee payments.
- Expected failure before implementation: empty export handling is missing.
- Expected pass condition: Spanish empty report state or export with zero totals is produced.

## T11: Reminder Job And Email Selection

### Happy Path

- Test: Reminder job runs with due and overdue unsettled `cash_flow_items`.
- Expected failure before implementation: reminder selection/job is missing.
- Expected pass condition: reminder records are created and email adapter is called for assigned recipients.

### Error Paths

- Test: Reminder job sees already-settled items.
- Expected failure before implementation: settled items may be selected.
- Expected pass condition: settled items are skipped.

### Edge Cases

- Test: Assigned user has missing notification email.
- Expected failure before implementation: job may crash or silently drop item.
- Expected pass condition: reminder is recorded as skipped/failed without stopping other reminders.

## T12: Reports, Settings, And Release-Level Localization Checks

### Happy Path

- Test: Admin opens reports/settings and updates reminder window.
- Expected failure before implementation: reports/settings screens do not exist.
- Expected pass condition: admin can view reports and save reminder settings.

### Error Paths

- Test: Unauthorized user attempts to edit settings.
- Expected failure before implementation: settings guard is missing.
- Expected pass condition: edit is denied.

### Edge Cases

- Test: Bilingual artifact structure check runs with a missing Spanish section.
- Expected failure before implementation: no artifact alignment check exists.
- Expected pass condition: check fails with a useful message naming the missing section.

## T13: Language Toggle For English-Speaking Users

### Happy Path

- Test: User toggles from Spanish to English on login and then signs in.
- Expected failure before implementation: language toggle or translated strings do not exist.
- Expected pass condition: login, navigation, dashboard heading, and cash-flow labels render in English.

### Error Paths

- Test: User opens a protected route while language is English.
- Expected failure before implementation: protected-route prompt remains only Spanish.
- Expected pass condition: protected-route prompt is shown in English.

### Edge Cases

- Test: User toggles back from English to Spanish.
- Expected failure before implementation: language state cannot return or labels remain English.
- Expected pass condition: supported labels return to Argentine Spanish.
