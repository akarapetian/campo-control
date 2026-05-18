type AppRole = "owner_admin" | "office_user" | "field_user" | "read_only_accountant";

type Employee = {
  id: string;
  displayName: string;
};

type EmployeePayment = {
  id: string;
  employeeId: string;
  date: string;
  amountArs: number;
  type: "payment" | "advance";
};

type PayrollData = {
  employees: Employee[];
  payments: EmployeePayment[];
};

type DateRange = {
  from: string;
  to: string;
};

type PayrollReportRow = {
  employeeName: string;
  paymentsArs: number;
  advancesArs: number;
  totalArs: number;
};

export const payrollDisclaimer =
  "Reporte operativo de pagos y adelantos registrados. Revisar con la oficina contable cuando corresponda.";

export function canAccessPayrollSettings(role: AppRole) {
  return role === "owner_admin" || role === "office_user";
}

function inRange(date: string, range: DateRange) {
  return date >= range.from && date <= range.to;
}

export function exportPayrollPayments(data: PayrollData, range: DateRange) {
  const rows: PayrollReportRow[] = data.employees
    .map((employee) => {
      const employeePayments = data.payments.filter(
        (payment) => payment.employeeId === employee.id && inRange(payment.date, range)
      );
      const paymentsArs = employeePayments
        .filter((payment) => payment.type === "payment")
        .reduce((sum, payment) => sum + payment.amountArs, 0);
      const advancesArs = employeePayments
        .filter((payment) => payment.type === "advance")
        .reduce((sum, payment) => sum + payment.amountArs, 0);

      return {
        employeeName: employee.displayName,
        paymentsArs,
        advancesArs,
        totalArs: paymentsArs + advancesArs
      };
    })
    .filter((row) => row.totalArs > 0);

  const totals = rows.reduce(
    (sum, row) => ({
      paymentsArs: sum.paymentsArs + row.paymentsArs,
      advancesArs: sum.advancesArs + row.advancesArs,
      totalArs: sum.totalArs + row.totalArs
    }),
    { paymentsArs: 0, advancesArs: 0, totalArs: 0 }
  );

  return {
    rows,
    totals,
    emptyState: rows.length === 0 ? "No hay pagos en el periodo seleccionado." : undefined,
    disclaimer: payrollDisclaimer
  };
}
