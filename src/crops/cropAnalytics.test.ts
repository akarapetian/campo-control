import { describe, expect, it } from "vitest";
import { buildCropAnalytics } from "./cropAnalytics";

const records = {
  cropEvents: [
    {
      id: "event-1",
      fieldId: "field-1",
      cropCycleId: "cycle-1",
      eventDate: "2026-03-10",
      eventType: "siembra",
      quantity: 12,
      unit: "ha",
      isOutput: false
    },
    {
      id: "yield-1",
      fieldId: "field-1",
      cropCycleId: "cycle-1",
      eventDate: "2026-06-01",
      eventType: "cosecha",
      quantity: 3200,
      unit: "kg",
      isOutput: true
    }
  ],
  financialTransactions: [
    {
      id: "cost-1",
      fieldId: "field-1",
      cropCycleId: "cycle-1",
      transactionDate: "2026-03-12",
      category: "Semillas",
      amountArs: 150000
    }
  ]
};

describe("buildCropAnalytics", () => {
  it("filters cost, activity, and yield metrics by field, cycle, and date range", () => {
    expect(
      buildCropAnalytics(records, {
        fieldId: "field-1",
        cropCycleId: "cycle-1",
        from: "2026-03-01",
        to: "2026-06-30",
        metric: "cost"
      }).points
    ).toEqual([{ label: "Semillas", value: 150000 }]);

    expect(
      buildCropAnalytics(records, {
        fieldId: "field-1",
        cropCycleId: "cycle-1",
        from: "2026-03-01",
        to: "2026-06-30",
        metric: "activity"
      }).points
    ).toEqual([{ label: "siembra", value: 12 }]);

    expect(
      buildCropAnalytics(records, {
        fieldId: "field-1",
        cropCycleId: "cycle-1",
        from: "2026-03-01",
        to: "2026-06-30",
        metric: "yield"
      }).points
    ).toEqual([{ label: "cosecha", value: 3200 }]);
  });

  it("returns a Spanish empty state for sparse or missing data", () => {
    const result = buildCropAnalytics(records, {
      fieldId: "field-2",
      cropCycleId: "cycle-2",
      from: "2026-03-01",
      to: "2026-06-30",
      metric: "cost"
    });

    expect(result.points).toEqual([]);
    expect(result.emptyState).toBe("No hay datos suficientes para mostrar este grafico.");
  });
});
