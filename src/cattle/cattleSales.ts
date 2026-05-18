import type { CashFlowItem } from "../domain/cashFlow";

export type CattleSaleTerms = "upfront" | "30_days" | "60_days" | "custom";

export type CreateCattleSaleCashFlowInput = {
  saleId: string;
  buyerId: string;
  amountArs: number;
  saleDate: string;
  terms: CattleSaleTerms;
  customExpectedCashDate?: string;
  assignedUserId?: string;
};

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function expectedCashDate(input: CreateCattleSaleCashFlowInput) {
  if (input.terms === "upfront") {
    return input.saleDate;
  }

  if (input.terms === "30_days") {
    return addDays(input.saleDate, 30);
  }

  if (input.terms === "60_days") {
    return addDays(input.saleDate, 60);
  }

  return input.customExpectedCashDate;
}

export function createCattleSaleCashFlow(input: CreateCattleSaleCashFlowInput): CashFlowItem {
  const collectionDate = expectedCashDate(input);

  if (!input.buyerId || input.amountArs <= 0 || !collectionDate) {
    throw new Error("Comprador, importe y fecha esperada de cobro son obligatorios.");
  }

  return {
    id: `cash-flow:${input.saleId}`,
    direction: "in",
    sourceType: "cattle_sale",
    sourceId: input.saleId,
    counterpartyId: input.buyerId,
    amount: input.amountArs,
    currency: "ARS",
    issueDate: input.saleDate,
    expectedCashDate: collectionDate,
    paymentTerms: input.terms,
    assignedUserId: input.assignedUserId,
    status: "scheduled"
  };
}

export function markCollectionSettled(item: CashFlowItem, settledDate: string): CashFlowItem {
  return {
    ...item,
    settledDate,
    status: "settled"
  };
}
