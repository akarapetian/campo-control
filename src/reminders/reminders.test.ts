import { describe, expect, it } from "vitest";
import { selectReminderDeliveries } from "./reminders";

describe("reminder job selection", () => {
  it("selects due and overdue unsettled cash-flow items for assigned users", () => {
    const result = selectReminderDeliveries(
      [
        {
          id: "due",
          direction: "out",
          amount: 1000,
          currency: "ARS",
          expectedCashDate: "2026-06-10",
          assignedUserId: "user-1",
          status: "scheduled"
        },
        {
          id: "overdue",
          direction: "in",
          amount: 2000,
          currency: "ARS",
          expectedCashDate: "2026-06-01",
          assignedUserId: "user-1",
          status: "scheduled"
        }
      ],
      { today: "2026-06-10", reminderWindowDays: 0, recipients: { "user-1": "user@example.com" } }
    );

    expect(result.deliveries.map((delivery) => delivery.cashFlowItemId)).toEqual(["due", "overdue"]);
    expect(result.deliveries[0].recipient).toBe("user@example.com");
  });

  it("skips settled items", () => {
    const result = selectReminderDeliveries(
      [
        {
          id: "settled",
          direction: "out",
          amount: 1000,
          currency: "ARS",
          expectedCashDate: "2026-06-01",
          settledDate: "2026-06-01",
          assignedUserId: "user-1",
          status: "settled"
        }
      ],
      { today: "2026-06-10", reminderWindowDays: 7, recipients: { "user-1": "user@example.com" } }
    );

    expect(result.deliveries).toEqual([]);
  });

  it("records missing recipients without stopping selection", () => {
    const result = selectReminderDeliveries(
      [
        {
          id: "missing-recipient",
          direction: "out",
          amount: 1000,
          currency: "ARS",
          expectedCashDate: "2026-06-10",
          assignedUserId: "user-2",
          status: "scheduled"
        }
      ],
      { today: "2026-06-10", reminderWindowDays: 0, recipients: {} }
    );

    expect(result.deliveries).toEqual([]);
    expect(result.failures).toEqual([
      {
        cashFlowItemId: "missing-recipient",
        reason: "Usuario asignado sin email de notificacion."
      }
    ]);
  });
});
