import { describe, expect, it } from "vitest";
import { canEditContracts, createContract, createServiceCashFlow } from "./contracts";

describe("contracts, services, and counterparties", () => {
  it("creates an outgoing cash-flow item for a deferred service payment", () => {
    const cashFlow = createServiceCashFlow({
      serviceId: "service-1",
      counterpartyId: "contractor-1",
      amountArs: 75000,
      serviceDate: "2026-06-01",
      terms: "60_days"
    });

    expect(cashFlow.direction).toBe("out");
    expect(cashFlow.sourceType).toBe("service");
    expect(cashFlow.sourceId).toBe("service-1");
    expect(cashFlow.counterpartyId).toBe("contractor-1");
    expect(cashFlow.expectedCashDate).toBe("2026-07-31");
  });

  it("denies contract edits for field and read-only roles", () => {
    expect(canEditContracts("owner_admin")).toBe(true);
    expect(canEditContracts("office_user")).toBe(true);
    expect(canEditContracts("field_user")).toBe(false);
    expect(canEditContracts("read_only_accountant")).toBe(false);
  });

  it("allows contracts without attachments in v1", () => {
    const contract = createContract({
      id: "contract-1",
      counterpartyId: "vendor-1",
      type: "servicio",
      status: "active"
    });

    expect(contract.attachmentPaths).toEqual([]);
  });
});
