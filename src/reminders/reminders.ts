import type { CashFlowItem } from "../domain/cashFlow";

type ReminderOptions = {
  today: string;
  reminderWindowDays: number;
  recipients: Record<string, string>;
};

type ReminderDelivery = {
  cashFlowItemId: string;
  recipient: string;
};

type ReminderFailure = {
  cashFlowItemId: string;
  reason: string;
};

function addDays(date: string, days: number) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function isSettled(item: CashFlowItem) {
  return item.status === "settled" || Boolean(item.settledDate);
}

function isReminderCandidate(item: CashFlowItem, options: ReminderOptions) {
  if (isSettled(item) || item.status === "cancelled") {
    return false;
  }

  const windowEnd = addDays(options.today, options.reminderWindowDays);
  return item.expectedCashDate <= windowEnd;
}

export function selectReminderDeliveries(items: CashFlowItem[], options: ReminderOptions) {
  const deliveries: ReminderDelivery[] = [];
  const failures: ReminderFailure[] = [];

  for (const item of items) {
    if (!isReminderCandidate(item, options)) {
      continue;
    }

    const recipient = item.assignedUserId ? options.recipients[item.assignedUserId] : undefined;

    if (!recipient) {
      failures.push({
        cashFlowItemId: item.id,
        reason: "Usuario asignado sin email de notificacion."
      });
      continue;
    }

    deliveries.push({
      cashFlowItemId: item.id,
      recipient
    });
  }

  return { deliveries, failures };
}
