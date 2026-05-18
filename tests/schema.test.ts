import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationPath = resolve(
  process.cwd(),
  "supabase/migrations/0001_initial_schema.sql"
);

function migrationSql() {
  return readFileSync(migrationPath, "utf8");
}

describe("initial Supabase schema", () => {
  it("defines the lean v1 operational tables", () => {
    const sql = migrationSql();

    for (const table of [
      "profiles",
      "cattle",
      "weight_records",
      "health_records",
      "cattle_sales",
      "crop_fields",
      "crop_cycles",
      "crop_events",
      "counterparties",
      "contracts",
      "services",
      "financial_transactions",
      "cash_flow_items",
      "employees",
      "work_entries",
      "employee_payments",
      "import_batches",
      "import_errors",
      "reminders"
    ]) {
      expect(sql).toContain(`create table public.${table}`);
    }

    expect(sql).not.toContain("create table public.receivables");
    expect(sql).not.toContain("create table public.payment_obligations");
    expect(sql).not.toContain("create table public.crop_outputs");
  });

  it("defines roles and enables RLS on protected tables", () => {
    const sql = migrationSql();

    expect(sql).toContain("create type public.app_role");
    for (const role of ["owner_admin", "office_user", "field_user", "read_only_accountant"]) {
      expect(sql).toContain(`'${role}'`);
    }

    for (const table of ["profiles", "financial_transactions", "cash_flow_items", "employee_payments"]) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
    }
  });

  it("documents policy boundaries for field and read-only users", () => {
    const sql = migrationSql();

    expect(sql).toContain("field users can read cattle operations");
    expect(sql).toContain("field users cannot access finance");
    expect(sql).toContain("read only accountants can read reports");
    expect(sql).toContain("read only accountants cannot mutate operations");
  });
});
