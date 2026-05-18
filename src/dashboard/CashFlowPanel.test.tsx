import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CashFlowPanel } from "./CashFlowPanel";

describe("CashFlowPanel", () => {
  it("shows settled cash separately from expected cash-flow groups", () => {
    render(
      <CashFlowPanel
        today="2026-06-10"
        items={[
          {
            id: "sale-60",
            direction: "in",
            amount: 120000,
            currency: "ARS",
            expectedCashDate: "2026-06-15",
            status: "scheduled"
          },
          {
            id: "expense-30",
            direction: "out",
            amount: 45000,
            currency: "ARS",
            expectedCashDate: "2026-06-20",
            status: "scheduled"
          },
          {
            id: "settled-sale",
            direction: "in",
            amount: 80000,
            currency: "ARS",
            expectedCashDate: "2026-06-01",
            settledDate: "2026-06-01",
            status: "settled"
          }
        ]}
      />
    );

    expect(screen.getByText("Efectivo cobrado")).toBeInTheDocument();
    expect(screen.getByText("ARS 80.000")).toBeInTheDocument();
    expect(screen.getByText("Ingresos proximos")).toBeInTheDocument();
    expect(screen.getByText("ARS 120.000")).toBeInTheDocument();
    expect(screen.getByText("Egresos proximos")).toBeInTheDocument();
    expect(screen.getByText("ARS 45.000")).toBeInTheDocument();
  });
});
