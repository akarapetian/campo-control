import { describe, expect, it } from "vitest";
import { canAccessPayrollSettings, exportPayrollPayments, payrollDisclaimer } from "./payroll";

describe("employees and payroll payment tracking", () => {
  it("exports employees, payments, advances, and totals for a date range", () => {
    const report = exportPayrollPayments(
      {
        employees: [{ id: "emp-1", displayName: "Juan Perez" }],
        payments: [
          { id: "pay-1", employeeId: "emp-1", date: "2026-06-10", amountArs: 100000, type: "payment" },
          { id: "adv-1", employeeId: "emp-1", date: "2026-06-05", amountArs: 20000, type: "advance" }
        ]
      },
      { from: "2026-06-01", to: "2026-06-30" }
    );

    expect(report.rows).toEqual([
      {
        employeeName: "Juan Perez",
        paymentsArs: 100000,
        advancesArs: 20000,
        totalArs: 120000
      }
    ]);
    expect(report.totals).toEqual({ paymentsArs: 100000, advancesArs: 20000, totalArs: 120000 });
  });

  it("denies field users from payroll settings", () => {
    expect(canAccessPayrollSettings("field_user")).toBe(false);
    expect(canAccessPayrollSettings("office_user")).toBe(true);
  });

  it("uses non-compliance language and handles empty reports", () => {
    const report = exportPayrollPayments({ employees: [], payments: [] }, { from: "2026-06-01", to: "2026-06-30" });

    expect(report.emptyState).toBe("No hay pagos en el periodo seleccionado.");
    expect(payrollDisclaimer).not.toMatch(/impuesto|deduccion|cumplimiento legal/i);
  });
});
