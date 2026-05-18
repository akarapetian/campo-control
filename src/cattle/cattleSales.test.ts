import { describe, expect, it } from "vitest";
import { createCattleSaleCashFlow, markCollectionSettled } from "./cattleSales";

describe("cattle sale cash-flow scheduling", () => {
  it("creates an incoming 60-day cash-flow item for a cattle sale", () => {
    const item = createCattleSaleCashFlow({
      saleId: "sale-1",
      buyerId: "buyer-1",
      amountArs: 180000,
      saleDate: "2026-06-01",
      terms: "60_days",
      assignedUserId: "office-1"
    });

    expect(item.direction).toBe("in");
    expect(item.sourceType).toBe("cattle_sale");
    expect(item.sourceId).toBe("sale-1");
    expect(item.counterpartyId).toBe("buyer-1");
    expect(item.amount).toBe(180000);
    expect(item.currency).toBe("ARS");
    expect(item.issueDate).toBe("2026-06-01");
    expect(item.expectedCashDate).toBe("2026-07-31");
    expect(item.paymentTerms).toBe("60_days");
    expect(item.assignedUserId).toBe("office-1");
    expect(item.status).toBe("scheduled");
    expect(item.settledDate).toBeUndefined();
  });

  it("requires buyer, positive amount, and a collection date", () => {
    expect(() =>
      createCattleSaleCashFlow({
        saleId: "sale-1",
        buyerId: "",
        amountArs: 0,
        saleDate: "2026-06-01",
        terms: "custom"
      })
    ).toThrow("Comprador, importe y fecha esperada de cobro son obligatorios.");
  });

  it("keeps upfront sales expected until explicitly settled", () => {
    const item = createCattleSaleCashFlow({
      saleId: "sale-2",
      buyerId: "buyer-2",
      amountArs: 95000,
      saleDate: "2026-06-01",
      terms: "upfront"
    });

    expect(item.expectedCashDate).toBe("2026-06-01");
    expect(item.status).toBe("scheduled");

    expect(markCollectionSettled(item, "2026-06-01")).toMatchObject({
      status: "settled",
      settledDate: "2026-06-01"
    });
  });
});
