import type { CashFlowItem } from "../domain/cashFlow";

type AppRole = "owner_admin" | "office_user" | "field_user" | "read_only_accountant";
type PaymentTerms = "upfront" | "30_days" | "60_days" | "custom";

type ContractInput = {
  id: string;
  counterpartyId: string;
  type: string;
  status: string;
  attachmentPaths?: string[];
};

type ServiceCashFlowInput = {
  serviceId: string;
  counterpartyId: string;
  amountArs: number;
  serviceDate: string;
  terms: PaymentTerms;
  customExpectedCashDate?: string;
};

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function expectedPaymentDate(input: ServiceCashFlowInput) {
  if (input.terms === "upfront") {
    return input.serviceDate;
  }

  if (input.terms === "30_days") {
    return addDays(input.serviceDate, 30);
  }

  if (input.terms === "60_days") {
    return addDays(input.serviceDate, 60);
  }

  return input.customExpectedCashDate;
}

export function canEditContracts(role: AppRole) {
  return role === "owner_admin" || role === "office_user";
}

export function createContract(input: ContractInput) {
  return {
    ...input,
    attachmentPaths: input.attachmentPaths ?? []
  };
}

export function createServiceCashFlow(input: ServiceCashFlowInput): CashFlowItem {
  const paymentDate = expectedPaymentDate(input);

  if (input.amountArs <= 0 || !paymentDate) {
    throw new Error("Importe y fecha esperada de pago son obligatorios.");
  }

  return {
    id: `cash-flow:${input.serviceId}`,
    direction: "out",
    sourceType: "service",
    sourceId: input.serviceId,
    counterpartyId: input.counterpartyId,
    amount: input.amountArs,
    currency: "ARS",
    issueDate: input.serviceDate,
    expectedCashDate: paymentDate,
    paymentTerms: input.terms,
    status: "scheduled"
  };
}
