import { describe, expect, it } from "vitest";
import { createExpenseTransaction, createExpenseCashFlow } from "./finance";

describe("finance transactions and deferred expenses", () => {
  it("creates an ARS expense and outgoing 30-day cash-flow item", () => {
    const transaction = createExpenseTransaction({
      id: "txn-1",
      category: "Insumos",
      counterpartyId: "vendor-1",
      amountArs: 60000,
      transactionDate: "2026-06-01",
      description: "Compra de alimento"
    });

    const cashFlow = createExpenseCashFlow(transaction, {
      terms: "30_days",
      paymentMethod: "cheque"
    });

    expect(transaction.currency).toBe("ARS");
    expect(cashFlow.direction).toBe("out");
    expect(cashFlow.sourceType).toBe("transaction");
    expect(cashFlow.sourceId).toBe("txn-1");
    expect(cashFlow.expectedCashDate).toBe("2026-07-01");
    expect(cashFlow.paymentTerms).toBe("30_days");
    expect(cashFlow.status).toBe("scheduled");
  });

  it("requires amount and expected payment date for deferred expenses", () => {
    expect(() =>
      createExpenseCashFlow(
        createExpenseTransaction({
          id: "txn-2",
          category: "Servicio",
          amountArs: 0,
          transactionDate: "2026-06-01"
        }),
        { terms: "custom" }
      )
    ).toThrow("Importe y fecha esperada de pago son obligatorios.");
  });

  it("keeps USD as an optional reference without replacing ARS", () => {
    const transaction = createExpenseTransaction({
      id: "txn-3",
      category: "Repuestos",
      amountArs: 100000,
      amountUsd: 100,
      transactionDate: "2026-06-01"
    });

    expect(transaction.currency).toBe("ARS");
    expect(transaction.amountArs).toBe(100000);
    expect(transaction.amountUsd).toBe(100);
  });
});
