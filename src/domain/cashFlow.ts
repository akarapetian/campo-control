export type CashFlowDirection = "in" | "out";
export type CashFlowStatus = "scheduled" | "due" | "overdue" | "settled" | "cancelled";

export type CashFlowItem = {
  id: string;
  direction: CashFlowDirection;
  amount: number;
  currency: "ARS" | "USD" | string;
  issueDate?: string;
  expectedCashDate: string;
  paymentTerms?: string;
  counterpartyId?: string;
  sourceType?: "cattle_sale" | "contract" | "service" | "transaction" | "employee_payment";
  sourceId?: string;
  assignedUserId?: string;
  settledDate?: string;
  status: CashFlowStatus;
};

export type CashFlowSummary = {
  upcomingIncoming: CashFlowItem[];
  upcomingOutgoing: CashFlowItem[];
  dueToday: CashFlowItem[];
  overdueIncoming: CashFlowItem[];
  overdueOutgoing: CashFlowItem[];
  cashCollected: number;
  cashPaid: number;
};

function compareDateOnly(left: string, right: string) {
  return left.localeCompare(right);
}

function isSettled(item: CashFlowItem) {
  return item.status === "settled" || Boolean(item.settledDate);
}

export function summarizeCashFlow(items: CashFlowItem[], today: string): CashFlowSummary {
  const summary: CashFlowSummary = {
    upcomingIncoming: [],
    upcomingOutgoing: [],
    dueToday: [],
    overdueIncoming: [],
    overdueOutgoing: [],
    cashCollected: 0,
    cashPaid: 0
  };

  for (const item of items) {
    if (item.status === "cancelled") {
      continue;
    }

    if (isSettled(item)) {
      if (item.direction === "in") {
        summary.cashCollected += item.amount;
      } else {
        summary.cashPaid += item.amount;
      }
      continue;
    }

    const dateOrder = compareDateOnly(item.expectedCashDate, today);

    if (dateOrder === 0) {
      summary.dueToday.push(item);
    } else if (dateOrder < 0) {
      if (item.direction === "in") {
        summary.overdueIncoming.push(item);
      } else {
        summary.overdueOutgoing.push(item);
      }
    } else if (item.direction === "in") {
      summary.upcomingIncoming.push(item);
    } else {
      summary.upcomingOutgoing.push(item);
    }
  }

  return summary;
}
