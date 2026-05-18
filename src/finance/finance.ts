import type { CashFlowItem } from "../domain/cashFlow";

type ExpenseTerms = "upfront" | "30_days" | "60_days" | "custom";

type CreateExpenseTransactionInput = {
  id: string;
  category: string;
  amountArs: number;
  transactionDate: string;
  counterpartyId?: string;
  amountUsd?: number;
  description?: string;
};

type ExpenseCashFlowOptions = {
  terms: ExpenseTerms;
  customExpectedCashDate?: string;
  paymentMethod?: string;
  assignedUserId?: string;
};

export type ExpenseTransaction = {
  id: string;
  direction: "out";
  category: string;
  amountArs: number;
  amountUsd?: number;
  currency: "ARS";
  transactionDate: string;
  counterpartyId?: string;
  description?: string;
};

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function expectedPaymentDate(transactionDate: string, options: ExpenseCashFlowOptions) {
  if (options.terms === "upfront") {
    return transactionDate;
  }

  if (options.terms === "30_days") {
    return addDays(transactionDate, 30);
  }

  if (options.terms === "60_days") {
    return addDays(transactionDate, 60);
  }

  return options.customExpectedCashDate;
}

export function createExpenseTransaction(
  input: CreateExpenseTransactionInput
): ExpenseTransaction {
  return {
    id: input.id,
    direction: "out",
    category: input.category,
    amountArs: input.amountArs,
    amountUsd: input.amountUsd,
    currency: "ARS",
    transactionDate: input.transactionDate,
    counterpartyId: input.counterpartyId,
    description: input.description
  };
}

export function createExpenseCashFlow(
  transaction: ExpenseTransaction,
  options: ExpenseCashFlowOptions
): CashFlowItem {
  const paymentDate = expectedPaymentDate(transaction.transactionDate, options);

  if (transaction.amountArs <= 0 || !paymentDate) {
    throw new Error("Importe y fecha esperada de pago son obligatorios.");
  }

  return {
    id: `cash-flow:${transaction.id}`,
    direction: "out",
    sourceType: "transaction",
    sourceId: transaction.id,
    counterpartyId: transaction.counterpartyId,
    amount: transaction.amountArs,
    currency: "ARS",
    issueDate: transaction.transactionDate,
    expectedCashDate: paymentDate,
    paymentTerms: options.terms,
    assignedUserId: options.assignedUserId,
    status: "scheduled"
  };
}
