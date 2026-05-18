import { describe, expect, it } from "vitest";
import { summarizeCashFlow, type CashFlowItem } from "./cashFlow";

const items: CashFlowItem[] = [
  {
    id: "incoming-future",
    direction: "in",
    amount: 120000,
    currency: "ARS",
    expectedCashDate: "2026-06-15",
    status: "scheduled"
  },
  {
    id: "outgoing-future",
    direction: "out",
    amount: 45000,
    currency: "ARS",
    expectedCashDate: "2026-06-20",
    status: "scheduled"
  },
  {
    id: "due-today",
    direction: "out",
    amount: 30000,
    currency: "ARS",
    expectedCashDate: "2026-06-10",
    status: "scheduled"
  },
  {
    id: "incoming-overdue",
    direction: "in",
    amount: 90000,
    currency: "ARS",
    expectedCashDate: "2026-06-01",
    status: "scheduled"
  },
  {
    id: "outgoing-overdue",
    direction: "out",
    amount: 15000,
    currency: "ARS",
    expectedCashDate: "2026-05-30",
    status: "scheduled"
  },
  {
    id: "settled-incoming",
    direction: "in",
    amount: 70000,
    currency: "ARS",
    expectedCashDate: "2026-06-02",
    settledDate: "2026-06-03",
    status: "settled"
  },
  {
    id: "settled-outgoing",
    direction: "out",
    amount: 25000,
    currency: "ARS",
    expectedCashDate: "2026-06-02",
    settledDate: "2026-06-03",
    status: "settled"
  }
];

describe("summarizeCashFlow", () => {
  it("separates expected cash-flow states from settled cash totals", () => {
    const summary = summarizeCashFlow(items, "2026-06-10");

    expect(summary.upcomingIncoming.map((item) => item.id)).toEqual(["incoming-future"]);
    expect(summary.upcomingOutgoing.map((item) => item.id)).toEqual(["outgoing-future"]);
    expect(summary.dueToday.map((item) => item.id)).toEqual(["due-today"]);
    expect(summary.overdueIncoming.map((item) => item.id)).toEqual(["incoming-overdue"]);
    expect(summary.overdueOutgoing.map((item) => item.id)).toEqual(["outgoing-overdue"]);
    expect(summary.cashCollected).toBe(70000);
    expect(summary.cashPaid).toBe(25000);
  });

  it("does not count unsettled deferred expenses as paid cash", () => {
    const summary = summarizeCashFlow(
      [
        {
          id: "deferred-expense",
          direction: "out",
          amount: 60000,
          currency: "ARS",
          expectedCashDate: "2026-07-10",
          status: "scheduled"
        }
      ],
      "2026-06-10"
    );

    expect(summary.upcomingOutgoing).toHaveLength(1);
    expect(summary.cashPaid).toBe(0);
  });
});
