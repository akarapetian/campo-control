type CropMetric = "cost" | "activity" | "yield";

type CropEvent = {
  id: string;
  fieldId: string;
  cropCycleId: string;
  eventDate: string;
  eventType: string;
  quantity?: number;
  unit?: string;
  isOutput: boolean;
};

type CropFinancialTransaction = {
  id: string;
  fieldId?: string;
  cropCycleId?: string;
  transactionDate: string;
  category: string;
  amountArs: number;
};

type CropAnalyticsRecords = {
  cropEvents: CropEvent[];
  financialTransactions: CropFinancialTransaction[];
};

type CropAnalyticsFilters = {
  fieldId: string;
  cropCycleId: string;
  from: string;
  to: string;
  metric: CropMetric;
};

type CropAnalyticsPoint = {
  label: string;
  value: number;
};

type CropAnalyticsResult = {
  points: CropAnalyticsPoint[];
  emptyState?: string;
};

function inRange(date: string, from: string, to: string) {
  return date >= from && date <= to;
}

function withEmptyState(points: CropAnalyticsPoint[]): CropAnalyticsResult {
  if (points.length === 0) {
    return {
      points,
      emptyState: "No hay datos suficientes para mostrar este grafico."
    };
  }

  return { points };
}

export function buildCropAnalytics(
  records: CropAnalyticsRecords,
  filters: CropAnalyticsFilters
): CropAnalyticsResult {
  if (filters.metric === "cost") {
    return withEmptyState(
      records.financialTransactions
        .filter(
          (transaction) =>
            transaction.fieldId === filters.fieldId &&
            transaction.cropCycleId === filters.cropCycleId &&
            inRange(transaction.transactionDate, filters.from, filters.to)
        )
        .map((transaction) => ({
          label: transaction.category,
          value: transaction.amountArs
        }))
    );
  }

  const matchingEvents = records.cropEvents.filter(
    (event) =>
      event.fieldId === filters.fieldId &&
      event.cropCycleId === filters.cropCycleId &&
      inRange(event.eventDate, filters.from, filters.to)
  );

  if (filters.metric === "activity") {
    return withEmptyState(
      matchingEvents
        .filter((event) => !event.isOutput)
        .map((event) => ({
          label: event.eventType,
          value: event.quantity ?? 0
        }))
    );
  }

  return withEmptyState(
    matchingEvents
      .filter((event) => event.isOutput)
      .map((event) => ({
        label: event.eventType,
        value: event.quantity ?? 0
      }))
  );
}
